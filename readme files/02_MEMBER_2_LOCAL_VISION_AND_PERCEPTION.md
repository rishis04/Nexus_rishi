# MEMBER 2 — Local Vision & Perception Intelligence
**Read `00_SHARED_CONTRACTS_AND_SYNC.md` first.** Section numbers like §7 · I3 refer to it.

You are the **eyes** of the agent. Given a DOM snapshot, a routing plan and a screenshot, you return grounded, fused regions plus OCR tokens and face boxes — quickly, on WebGPU → WebGL → WASM, inside a resource budget. Your visual-grounding prototype is already "integration-ready" (spec §24); your first job is to **plug it into the extension**, not to redo it.

---

## 1. What you own

| Area | Spec sections | Result |
|---|---|---|
| ONNX Runtime Web + backend selection (WebGPU → WebGL → WASM) | Arch §24, Stack §5 | `vision/runtime`, `vision/onnx` |
| Model asset management (bundled + OPFS cache) | Arch §24 | `ModelStore` |
| UI / region detection (real local model) | Visual Grounding §10 | `perception/ui-detection` |
| OCR (selective, crop-based) + text association | VG §10 | `perception/ocr` |
| Face detection | Stack §6 | `perception/face` |
| **DOM ↔ vision grounding**, spatial relations, visual state, disagreement | VG §10 | `perception/grounding` |
| Perception fusion → `PerceptionRegion[]` | Arch §9 | `perception/fusion` |
| Perception cache | Arch §10 | `perception/cache` |
| Perception budget manager | Arch §23 | `perception/budget` |
| CaptureStore (in-memory pixels shared with M3) | I10 | `vision/runtime/capture-store.ts` |
| Visual / latency / resource **benchmarks** + baseline mode | Arch §27 | `benchmarks/visual|latency|resources` |
| Visual test-site cases | Arch §26.1 | `test-site/visual` |
| React components: PerceptionDebug overlay, BenchmarkDashboard | Stack §13 | `src/ui/` |

You do **not** own: what counts as PII or how it's redacted (M3), routing decisions (M1), page-state hashing (M1). You *serve* M3's firewall with `ocrImage`/`detectFaces`.

---

## 2. Tech stack you use (and where)

| Tech | Where | Notes |
|---|---|---|
| **ONNX Runtime Web** (`onnxruntime-web`) | `vision/onnx`, `vision/runtime` | Use the entry that includes the WebGPU EP (recent versions: `onnxruntime-web/webgpu`) — check the version you pin. Run inference inside a **Web Worker** owned by the offscreen doc. |
| **WebGPU → WebGL → WASM** | `vision/runtime/backend.ts` | `executionProviders` order + warm-up run to detect lazy failures |
| **Quantized ONNX models** | `extension/public/models/` (not in git) | INT8 (dynamic/static) or FP16; **static input shapes** (WebGPU/WebGL prefer them); NMS done in TS, not in graph |
| **OPFS** | `vision/runtime/model-store.ts` | `navigator.storage.getDirectory()`; version+sha256 cache (Phase 3) |
| **OffscreenCanvas / `createImageBitmap`** | `vision/runtime/crop.ts`, `preprocess.ts` | crops, letterbox, normalise |
| **Tesseract.js** (start here) or **PaddleOCR-ONNX** (upgrade) | `perception/ocr` | assets **local** (`workerPath`, `corePath`, `langPath`); no CDN in MV3 |
| **Face detector ONNX** (UltraFace-RFB / YuNet class, ~1 MB) | `perception/face` | check licence before shipping |
| **TypeScript** | all | pure functions where possible (grounding/fusion are deterministic) |
| **Vitest** | unit tests | geometry, NMS, grounding score |
| **Python** (`onnx`, `onnxruntime`, `numpy`, `pandas`, `matplotlib`) | `tools/model-export`, `benchmarks/scripts` | quantization, calibration, reports |
| **Playwright + CDP** | benchmark runner | `Performance.getMetrics` for JS heap / task duration |
| **Browser Performance API** | timings | `performance.now()`, `mark/measure`; keep 3 decimals (spec Gap 14) |
| **Chrome DevTools / `chrome://gpu`** | manual profiling | evidence for the resource-utilisation criterion |

**Licence watch (spec: "where licensing permits"):** Ultralytics YOLO weights/code are AGPL-3.0; YOLOX, NanoDet and RT-DETR (Paddle) are Apache-2.0; Tesseract and PaddleOCR are Apache-2.0. Verify each before the final submission.

---

## 3. Migrating your existing prototype into the canonical tree

| Prototype file (`perception/visual-grounding/…`) | Goes to |
|---|---|
| `capture/screenshot.ts` | **dropped** — capture is M1's `captureScreenshot()` in the SW |
| `capture/crop.ts` | `vision/runtime/crop.ts` |
| `model/model-loader.ts` | `vision/onnx/model-loader.ts` |
| `model/inference.ts` | `vision/onnx/inference.ts` |
| `model/preprocessing.ts`, `model/postprocessing.ts` | `vision/onnx/preprocess.ts`, `postprocess.ts` |
| `detection/region-detector.ts`, `region-classifier.ts` | `perception/ui-detection/` |
| `detection/visual-state.ts` | `perception/ui-detection/visual-state.ts` |
| `ocr/text-association.ts`, `ocr-normalizer.ts` | `perception/ocr/` |
| `grounding/dom-matcher.ts`, `geometry.ts`, `spatial-relations.ts`, `grounding-score.ts` | `perception/grounding/` |
| `fusion/visual-perception-fusion.ts` | `perception/fusion/` |
| `types/visual-perception.ts` | **replaced** by `@contracts/vision`, `@contracts/perception` |
| existing 16-case benchmark | `benchmarks/visual/` (+ pages in `test-site/visual/`) |

**Adapters you must write at the boundary** (D1): prototype `{x,y,width,height}` ↔ contract `[x,y,w,h]` via `toBBox()/toRect()` in `contracts/ts/geometry.ts`.

Keep the spec's model interface:
```ts
interface VisionModel { load(): Promise<void>; detect(image: ImageData): Promise<VisionDetection[]>; dispose(): Promise<void>; }
```

---

## 4. Files you create

```
extension/src/
├── vision/
│   ├── index.ts                        # exports visionEngine (public API, §6)
│   ├── runtime/{backend.ts, session.ts, model-store.ts, capture-store.ts, crop.ts, worker.ts, vision.worker.ts}
│   ├── onnx/{model-loader.ts, inference.ts, preprocess.ts, postprocess.ts, nms.ts}
│   └── models/{registry.ts, models.lock.json}
├── perception/
│   ├── ui-detection/{detector.ts, class-map.ts, visual-state.ts, container-suppression.ts}
│   ├── ocr/{engine.ts, tesseract.ts, preprocess.ts, association.ts, normalizer.ts}
│   ├── face/{detector.ts}
│   ├── grounding/{dom-matcher.ts, geometry.ts, spatial-relations.ts, grounding-score.ts, disagreement.ts}
│   ├── fusion/{fuse.ts, combiner.ts, fusion-weights.json}
│   ├── cache/{cache.ts, fingerprint.ts}
│   └── budget/{budget.ts, probes.ts}
├── offscreen/vision-host.ts             # registers vision/* handlers into M1's dispatcher
├── vision.contract.test.ts
└── ui/{PerceptionDebug.tsx, BenchmarkDashboard.tsx}
tools/{model-export/, dataset-gen/}
benchmarks/{visual,latency,resources}/  benchmarks/scripts/{visual_metrics.py, latency_report.py, calibrate_fusion.py}
test-site/visual/
scripts/fetch-models.sh   extension/src/vision/models/models.lock.json
```

---

## 5. Work breakdown (in build order)

### Phase 0 → G0 (hours 0–3)
| # | Task | Output |
|---|---|---|
| 2.1 | Agree the public API (§6) and `VisionRequest/Result` with M1/M3 | merged contracts |
| 2.2 | **Day-1 spike (critical):** in an offscreen page, (a) is `navigator.gpu` defined and `requestAdapter()` non-null? (b) ORT loads a tiny model on `wasm` with **locally bundled** `.wasm` (`ort.env.wasm.wasmPaths = chrome.runtime.getURL('ort/')`), single thread OK; (c) worker creation works. If WebGPU is missing in the offscreen doc, note it and plan side-panel-page hosting as fallback. | `docs/spikes.md` |
| 2.3 | `scripts/fetch-models.sh` + `models.lock.json` (name, url, sha256, size, licence) | reproducible model setup |
| 2.4 | **Vision harness page** (`extension/entrypoints/…` dev-only or a Vite page) that loads `fixtures/frames/<case>/{capture.png,dom.json}` → runs `perceive` → draws boxes | works without the orchestrator |
| 2.5 | `vision-host.ts` skeleton returning fixture results | M1's loop runs |

### Phase 1 → G1 (hours 3–10): real detector in the harness
| # | Task | Details |
|---|---|---|
| 3.1 | **Backend selection** `backend.ts` | probe WebGPU (`navigator.gpu.requestAdapter()`), then WebGL2 on `OffscreenCanvas`, else WASM (detect SIMD via `WebAssembly.validate`; threads only if `crossOriginIsolated`). Create session with `[webgpu, webgl, wasm]` order; on error at create **or first inference**, drop to next. Allow `?backend=` override for benchmarks. Record chosen backend in stats. |
| 3.2 | **Model loader + session** | load from bundled URL → `Uint8Array` → `InferenceSession.create`; one session per model, kept warm; `dispose()` |
| 3.3 | **Preprocess/postprocess** | letterbox to model size, RGB → NCHW float32 normalise; decode output, class-wise NMS in TS, map boxes back to crop → CSS px using `CaptureMeta` (`toCssPx`) |
| 3.4 | **UI detector** on your prototype's model | classes `button, input, checkbox, dropdown, link, tab, menu, dialog` (+ `custom_control`, `card`, `chart`, `table` later) |
| 3.5 | `perceive()` v1 | for each `plan.decisions[level≠HIGH]`: crop → detector → regions; **no OCR/grounding yet** |
| 3.6 | **CaptureStore** | `put(capture_id, ImageBitmap)`, `get`, `release`; TTL 15 s; memory-only (I10). Handle `vision/release`. |
| 3.7 | Telemetry spans | `crop, preprocess, inference, postprocess, total` via M1's sink |

### Phase 2 → G2 (hours 10–22): OCR, grounding, fusion, faces
| # | Task | Details |
|---|---|---|
| 4.1 | **OCR engine** | interface below; Tesseract.js worker created once, reused; `PSM` single-line/sparse for crops; upscale ×2–3 when text height < ~12 px; grayscale + contrast stretch; invert for dark backgrounds. Modes `fast` (crops from plan) / `high_recall` (multi-scale, used for M3's privacy scans). Coordinates back to CSS px. |
| 4.2 | **OCR association** | assign tokens to the smallest containing detected region (containment > IoU); build `text`; keep raw `OcrToken[]` for M3 |
| 4.3 | **Face detector** | tiny ONNX; run **full-frame at reduced resolution whenever a screenshot exists** (it's cheap and it's the safety net); returns `FaceBox[]` in CSS px |
| 4.4 | **DOM ↔ vision grounding** | §5.1 |
| 4.5 | **Visual state** | heuristics on crop pixels → `enabled/disabled/checked/unchecked/selected/expanded/collapsed/focused`; for DOM-backed regions compare with ARIA and raise `disagreement` on conflict |
| 4.6 | **Spatial relations** | `above/below/left/right/contains/overlaps/near` for actionable regions, top-K nearest only (payload size) |
| 4.7 | **Fusion** | §5.2 → returns `PerceptionRegion[]` with `source[]`, `confidence_by_source`, `disagreement`, `relations`, `route`, `sensitivity:'unclassified'`, `origin/frame_id/page_state_hash/timestamp` copied from the request |
| 4.8 | **Canvas/custom UI** | the LOW path: canvas element bbox → crop → detector → vision-only regions with `dom_ref:null`, `actionable` when class ∈ actionable set |
| 4.9 | Serve M3 | implement `ocrImage`, `detectFaces`, `getCapture` (H7/H8); unit-test that they accept arbitrary images (the redacted output) |
| 4.10 | Flip `flags.vision='real'` with M1 | fix integration issues on the login demo |

### Phase 3 → G3/G4 (hours 22–34): efficiency + evidence
| # | Task | Details |
|---|---|---|
| 5.1 | **Perception cache** | §5.3 |
| 5.2 | **Budget manager** | §5.4 |
| 5.3 | **Baseline mode** | `perceive({mode:'baseline'})` = full-frame detector + full-frame OCR every cycle (the spec's "broad/full visual processing") |
| 5.4 | **Benchmark suite** | §5.5 |
| 5.5 | **Backend matrix** | run everything on `webgpu`, `webgl`, `wasm`; report per-backend latency and memory (spec Gap: "WASM-only current backend") |
| 5.6 | Fusion calibration | `calibrate_fusion.py` fits weights/thresholds on benchmark data → writes `fusion-weights.json` (spec: calibrated, not invented) |
| 5.7 | Container suppression | fix the `custom_control` false-positive issue from your benchmark: suppress a proposal that encloses ≥2 actionable children |
| 5.8 | OPFS model store | cache verified models; cold vs warm load times reported |
| 5.9 | Components | `PerceptionDebug` (boxes over screenshot, route per region, provenance chips, disagreements) and `BenchmarkDashboard` (baseline vs proposed charts) |
| 5.10 | Optional: dataset-gen + fine-tune | §5.6 if the detector is the weak link |

---

## 6. Public API (what M1 and M3 call)

```ts
// extension/src/vision/index.ts
export interface VisionEngine {
  init(opts?: { preferredBackend?: Budget['backend'] }): Promise<EngineStatus>;       // lazy; idempotent
  perceive(req: VisionRequest): Promise<VisionResult>;                                 // H1  (M1)
  getBudget(): Budget;                                                                 // H2  (M1)
  ocrImage(img: ImageBitmap | ImageData | Blob,
           opts?: { mode?: 'fast' | 'high_recall'; rects?: BBox[] }): Promise<OcrToken[]>;   // H7 (M3) — coords in IMAGE px
  detectFaces(img: ImageBitmap | ImageData | Blob): Promise<FaceBox[]>;                // H7 (M3) — coords in IMAGE px
  getCapture(capture_id: string): ImageBitmap | undefined;                            // H8 (M3)
  releaseCapture(capture_id: string): void;                                            // vision/release
  invalidate(dirty: DirtyEvent[]): void;                                               // H10 (M1)
  status(): EngineStatus;                                                              // backend, model versions, warm?
  dispose(): Promise<void>;
}
```
Rules:
- `perceive` **never re-routes**: it obeys `plan.decisions[].level/needs`. It may **escalate** MEDIUM → LOW if OCR/grounding fails, and lists it in `stats.escalated`.
- It never returns raw pixels — only regions, tokens, boxes, stats.
- `ocrImage/detectFaces` return **image-pixel** coordinates (they don't know about the page); `perceive` returns **CSS px**. Don't mix (I3).
- All errors are `StageError`, never thrown across the bus.

---

## 7. The hard parts — how to do them

### 7.1 DOM ↔ vision grounding (`grounding/`)
Matching score per (vision detection *v*, DOM element *d*) — deterministic, weights in config:
```
score = w1·IoU(v,d) + w2·(1 − centerDist/diag) + w3·textSim(ocr(v), d.name|d.text)
      + w4·roleCompat(v.class, d.role) + w5·visible(d)
hard constraints: same frame_id AND same origin, else score = 0
```
- Assignment: greedy by score with threshold (or Hungarian if ambiguity is high — decoy-buttons case).
- Outcomes:
  1. matched → fused region (`source:['DOM','VISION','OCR']`, `dom_ref` set, DOM bbox preferred for precision when IoU high).
  2. vision-only → `dom_ref:null` (canvas/custom UI).
  3. DOM-only but seen as interactive → keep, `confidence` from DOM.
- **Disagreement is explicit** (`disagreement`): state (DOM `disabled` vs vision enabled-looking), bbox (matched by text but IoU < τ), type (DOM `div` vs vision `button` is *not* a conflict; DOM `button` vs vision `checkbox` is), text. Never silently choose.
- Your benchmark already shows 19/19 matches, 0.6 px mean centre error, 1/1 disagreement flagged — turn those into regression thresholds.

### 7.2 Fusion (`fusion/`)
```ts
export function fuse(input: { dom: DomElementInfo[]; grounded: GroundedRegion[]; ocr: OcrToken[];
                              req: VisionRequest }): PerceptionRegion[]
```
- Preserve provenance; `confidence_by_source` = measured per source; final `confidence = combiner(bySource)` where `combiner` is pluggable (start weighted mean; replace with the calibrated one). **Do not hard-code magic constants** — put them in `fusion-weights.json`.
- Set `sensitivity:'unclassified'` (M3 classifies) and `route` from the plan.
- `region_id = local_key` at this stage (`dom_id` or `v#`); **M1 mints final ids** (I2).

### 7.3 Cache (`cache/`)
```
key = region fingerprint = hash(bbox rounded, DOM digest (tag,role,name,text hash), crop dHash*, scroll bucket, layout digest)
   (* dHash computed lazily only when DOM digest matches, to avoid decoding pixels for hits)
value = { regions, tokens (text kept in memory only), faces, ts }   // never pixels, never persisted
```
- Invalidate on `invalidate(dirty)` (bbox intersection), on navigation, on page-state change.
- Report `cache_hits/misses` in stats. Target: repeated cycles on an unchanged page → 0 inference calls.
- Cached OCR text is raw → keep **in memory only**, cleared with the CaptureStore TTL for that page state (I10).

### 7.4 Budget manager (`budget/`)
Inputs: chosen backend, `navigator.deviceMemory`, `navigator.hardwareConcurrency`, `performance.memory` (Chrome-only), rolling P50/P95 inference latency (last N runs), page complexity (#regions from M1's plan), task urgency flag.
Output `Budget`:

| Level | Behaviour |
|---|---|
| HIGH | detector + OCR (`fast`), up to N LOW regions |
| MEDIUM | targeted crops only, lighter detector input size |
| LOW | DOM + OCR on the few most important crops; `allow_detector:false` |

Level moves **down** when p95 latency or memory pressure exceeds thresholds; **up** when it recovers. Expose to M1 via `vision/budget` (M1 caches 2 s). Also account for the ~2/s screenshot limit.

### 7.5 Benchmarks (spec §14–15, §27)
Fix the known issues from your results:
1. **0.0 ms values** → `performance.now()` deltas, print 3 decimals, and time each phase separately; run enough iterations for stable P95.
2. **Uneven class coverage** → add real `chart`, `dropdown`, `checkbox` cases (≥10 each).
3. **custom_control FPs** → container suppression (5.7).
4. **WASM-only** → run webgpu/webgl/wasm matrix (5.5).
5. **Estimated resources** → measure: Playwright CDP `Performance.getMetrics` (JSHeapUsedSize, TaskDuration), `performance.memory`, DevTools Performance/GPU screenshots.
6. **Dataset** → 16 → 30–50+ cases (responsive, high-DPI, zoom, SVG, animated, hidden/off-screen, dark mode, more iframe origins).

Metrics: precision, recall, IoU, centre error, DOM↔vision accuracy, disagreement flags; latency avg/median/P95/min/max by phase; vision calls, OCR calls, pixels processed, memory, model size; **baseline vs proposed** on the *same* cases and repeated runs. Output JSON → `benchmarks/reports/` and feed `BenchmarkDashboard`. Only report measured values.

### 7.6 Optional: auto-labelled dataset for the detector
HTML pages give free ground truth: render test/synthetic pages with Playwright, screenshot them, take DOM element rects + roles as labels (button/input/checkbox/dropdown/link/tab/menu/dialog), add theme/DPR/font variation. Use it to fine-tune a small permissively-licensed detector, export to ONNX, quantize, and re-run the benchmark. Only do this if the prototype's detector is measurably the bottleneck.

---

## 8. What you PROVIDE / CONSUME

**Provide to M1:** `perceive`, `getBudget`, `invalidate`, `PerceptionDebug` component, backend/model status for side panel, visual benchmarks.
**Provide to M3:** `OcrToken[]`/`FaceBox[]` in `VisionResult`; `ocrImage`, `detectFaces`, `getCapture`; image coordinate helpers.
**Consume from M1:** `VisionRequest` (with correct `dpr`, `capture_id`, `page_state_hash`, `plan.needs`, DOM with `has_bg_image`, `rendering`), `DirtyEvent`, telemetry sink, fixtures.
**Consume from M3:** nothing at runtime. (Optional Phase-3: M3's NER model can reuse your ORT session helper.)

---

## 9. Stubs to ship at G0
- `vision.stub.ts` behaviour is defined by M1; **you** provide the fixture files it reads: `fixtures/frames/<case>/vision.result.json` for at least the login demo and canvas-button cases (generated by your prototype once).

---

## 10. Tests you own
- **Unit:** letterbox/inverse mapping (DPR 1/2/3, zoom), NMS, IoU/centre distance, grounding score + hard constraints, disagreement detection, cache invalidation, budget transitions.
- **Contract:** `vision.contract.test.ts` — output validates against `VisionResult` Zod on all fixtures.
- **Backend matrix:** same input → results within tolerance across webgpu/webgl/wasm.
- **Regression thresholds** in `benchmarks/visual/thresholds.json` (e.g., grounding accuracy ≥ 0.95, mean centre error ≤ 2 px) enforced in `bench-smoke` CI.
- **E2E hooks:** S2 (canvas button) and S10 (forced backend) with M1.

---

## 11. Definition of Done (Member 2)
- [ ] `visionEngine.perceive` returns fused regions for MEDIUM/LOW plan entries on the login demo and the canvas-button page, inside the extension (not just the harness).
- [ ] WebGPU is used when available; WebGL and WASM fallbacks both produce results; chosen backend is visible in the side panel.
- [ ] Real local model (not a mock) detects UI regions; OCR associates text; grounding matches DOM and flags disagreements; canvas/custom UI yields actionable vision-only regions.
- [ ] Face detector finds faces in the demo image; `ocrImage`/`detectFaces` work on M3's redacted output.
- [ ] Cache gives 0 inference calls on an unchanged page; budget manager lowers level under load.
- [ ] Baseline-vs-Proposed report with measured latency (avg/median/P95), pixels processed, vision/OCR calls, per-class metrics, per-backend results, real memory/CPU numbers.
- [ ] No raw pixels or OCR text persisted anywhere (IndexedDB/OPFS/storage inspected).
- [ ] Models fetchable via `scripts/fetch-models.sh` with checksums; licences recorded.

## 12. Your gotchas checklist
- **DPR/zoom:** the screenshot is device pixels; every box you return is CSS px in top-viewport space (I3). Test DPR 2 and browser zoom 125 %.
- ORT in MV3: local `.wasm` files, `wasmPaths`, Worker via Vite `new URL(..., import.meta.url)`; multi-thread WASM needs cross-origin isolation (optional manifest keys) — otherwise force `numThreads = 1`.
- Some ops silently fall back to CPU on WebGL/WebGPU EPs → verify op coverage at export time and profile each backend.
- Tesseract.js on CPU can be slow: crops only, reuse the worker, don't run `high_recall` unless M3 asks.
- Don't keep `ImageBitmap`s alive past the cycle — `close()` them.
- Don't decide routing; don't classify PII — hand over tokens and boxes.
- Never print boxes with OCR text to console in production builds.