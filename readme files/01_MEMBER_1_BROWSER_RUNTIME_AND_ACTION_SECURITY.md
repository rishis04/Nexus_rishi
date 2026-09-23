# MEMBER 1 — Browser Runtime, Orchestrator & Action Security
**Read `00_SHARED_CONTRACTS_AND_SYNC.md` first.** Section numbers like §7 · I5 refer to it.

You are the **spine of the project**. The extension you build is the container everyone else plugs into, and the browser is "the final authority over privacy, secrets, permissions, state, origin, frame and execution" (spec §25). You are on the critical path until G1, so ship the scaffold fast.

---

## 1. What you own

| Area | Spec sections | Result |
|---|---|---|
| Extension shell (WXT, MV3, entrypoints, manifest, build) | Tech stack §3 | A loadable extension others can plug into |
| Message bus + orchestrator (perceive → act loop) | Arch §4, §34 | `runCycle()` state machine |
| DOM / ARIA extraction, observers, shadow DOM, iframes | Arch §5.1, §6 | `DomSnapshot` |
| Confidence router | Arch §6, §25 | `RoutingPlan` + explainable telemetry |
| Screenshot capture | Arch §5.2 | `CaptureMeta` + data URL |
| Dirty-region signals | Arch §10 | `DirtyEvent` stream |
| Frame assembly + region ID minting | Perception Contract §8 | `PerceptionFrame`, `region_index` |
| State fingerprint, origin/frame security | Arch §19–20 | `page_state_hash`, live checks |
| **Local Action Firewall** (validator) + **executor** | Arch §21–22 | The last security boundary |
| Network gate (attestation check + fetch) | Arch §16 | Only firewall-approved bytes leave |
| Telemetry sink (IndexedDB) | Arch §25 | Per-`cycle_id` timings |
| Side Panel shell, options | Stack §13 | UI |
| Test-site shell + iframe/stale-state pages | Arch §26 | Reproducible demo |
| Playwright harness + E2E runner, CI, docs coordination | Stack §14 | S1–S10 |

You do **not** own: ML/OCR/vision (M2), PII/redaction/firewall/vault internals and the server (M3). You call them through the handshakes in §6 of the shared doc.

---

## 2. Tech stack you use (and where)

| Tech | Where in your code | Notes |
|---|---|---|
| **TypeScript** (strict) | everything | `noUncheckedIndexedAccess` on |
| **WXT** | `extension/wxt.config.ts`, `entrypoints/*` | `defineBackground`, `defineContentScript`; unlisted page for offscreen; `sidepanel` entrypoint; build → `.output/chrome-mv3` |
| **Manifest V3** | WXT manifest block | permissions below |
| **React + Vite** | `entrypoints/sidepanel`, `src/ui/sidepanel` | UI only — pipeline stays framework-free |
| **Zod** | `actions/schema`, `contracts` | `.strict()` everywhere |
| **DOM APIs** | `perception/dom` | `getBoundingClientRect`, `checkVisibility()`, `elementsFromPoint`, `MutationObserver`, `ResizeObserver`, `IntersectionObserver`, `chrome.dom.openOrClosedShadowRoot` |
| **`dom-accessibility-api`** (MIT) | `perception/accessibility` | `computeAccessibleName`, role helpers — do not hand-write accname |
| **`chrome.tabs.captureVisibleTab`** | `capture/` | ~2 calls/s limit |
| **`chrome.offscreen`** | `background/offscreen.ts` | `reasons: ['WORKERS','BLOBS']` + justification string; only one doc allowed |
| **`chrome.webNavigation`** | frame ids / origins | `getAllFrames`, `onCommitted` |
| **`chrome.storage.session`** | `TaskSession` | survives SW restarts, cleared on browser close |
| **IndexedDB** (`idb`) | `storage/`, `telemetry/` | settings + telemetry |
| **Web Crypto** | `security/` | SHA-256 for `page_state_hash` and payload digest check |
| **Vitest** | unit tests | table-driven for the firewall |
| **Playwright** | `tests/e2e` | persistent context with `--load-extension`, `--headless=new` for CI |
| **Performance API** | `telemetry/` | `performance.now()`, keep 3 decimals |

**Manifest (starting point)**
```ts
// wxt.config.ts (excerpt)
manifest: {
  permissions: ['activeTab','scripting','storage','offscreen','sidePanel','webNavigation','tabs'],
  host_permissions: ['<all_urls>', 'http://localhost:8000/*'],
  // optional, enables multi-threaded WASM for M2 — only if all extension resources are local:
  // cross_origin_embedder_policy: { value: 'require-corp' },
  // cross_origin_opener_policy:   { value: 'same-origin' },
}
```
MV3's default extension-page CSP already allows `wasm-unsafe-eval`; **no remote code** — ORT `.wasm`, Tesseract assets and models are all bundled locally (M2).

---

## 3. Files you create

```
extension/
├── wxt.config.ts  tsconfig.json  package.json  .env.example
├── entrypoints/
│   ├── background.ts                       # thin: wires bus → orchestrator
│   ├── content.ts                          # all_frames, match_about_blank, document_idle
│   ├── offscreen/{index.html,main.ts}      # dispatcher: routes 'vision/*' → M2, 'privacy/*' → M3
│   └── sidepanel/{index.html,main.tsx}
└── src/
    ├── config/flags.ts
    ├── background/{orchestrator.ts, session.ts, offscreen.ts, keepalive.ts, frames.ts, assemble-frame.ts}
    ├── content/{extract.ts, registry.ts, observers.ts, frame-offsets.ts, agent-ui.ts}
    ├── capture/screenshot.ts
    ├── network/{client.ts, gate.ts}
    ├── telemetry/{sink.ts, span.ts}
    ├── storage/{idb.ts, settings.ts}
    ├── security/{sha256.ts}
    ├── perception/
    │   ├── dom/{snapshot.ts, visibility.ts, shadow.ts, rendering-kind.ts, to-regions.ts}
    │   ├── accessibility/{role.ts, name.ts}
    │   ├── router/{router.ts, scoring.ts, rules.ts, gaps.ts}
    │   ├── dirty-region/{tracker.ts}
    │   └── contract/index.ts               # re-export @contracts
    ├── browser/state/{fingerprint.ts, options.ts}
    ├── actions/
    │   ├── schema/{action.zod.ts}
    │   ├── validator/{index.ts, schema-check.ts, policy.ts, origin-frame.ts, state.ts, target.ts, capability.ts, text-scan.ts}
    │   └── executor/{index.ts, click.ts, type.ts, select.ts, scroll.ts, keypress.ts, settle.ts}
    ├── vision.stub.ts  privacy.stub.ts     # doubles for M2/M3 (see §7)
    └── ui/sidepanel/{App.tsx, TaskBar.tsx, StageTimeline.tsx, RouteView.tsx, ActionLog.tsx, NetworkStatus.tsx}
test-site/{shared,iframe,stale-state}/       # + login-demo
tests/e2e/{harness.ts, s01-…s10-*.spec.ts}
```

---

## 4. Work breakdown (in build order)

### Phase 0 → G0 (hours 0–3): scaffold others depend on
| # | Task | Output | Notes |
|---|---|---|---|
| 1.1 | `pnpm` workspace, WXT + React + TS, path aliases `@/` → `extension/src`, `@contracts/` → `contracts/ts` | builds & loads | Put contracts package in first so M2/M3 import from day one |
| 1.2 | Commit `contracts/ts/*` from shared doc §4 + Zod schemas + fixtures skeleton | contracts PR | you are TS steward |
| 1.3 | Typed bus (`bus.send/on`) with `{ok,data}|{ok:false,error}` envelope, all messages from shared §5 declared | `contracts/ts/messages.ts` | handlers may be `not_implemented` |
| 1.4 | `offscreen/main.ts` dispatcher + `ensureOffscreen()` (`chrome.runtime.getContexts` → `createDocument` if none → wait for `offscreen/ready`) | offscreen boots | M2/M3 register handlers by import |
| 1.5 | `vision.stub.ts`, `privacy.stub.ts` returning fixture JSON; `flags.ts` | main runnable | |
| 1.6 | **Fixture recorder** (dev-only side-panel button): saves `DomSnapshot`, screenshot PNG, `CaptureMeta` into a downloadable folder | `contracts/fixtures/frames/*` | **M2 and M3 need these by hour 3** |
| 1.7 | `test-site/shared/login-demo.html` (email, password, phone, `<img>` face, standard buttons, **canvas-drawn custom Login button**) + tiny static server on :5173 and :5174 | demo page | Use *synthetic* PII only |
| 1.8 | CI workflow, ESLint rule banning `fetch` outside `extension/src/network/` | green CI | Enforces I5 |
| **Day-1 spike** | Prove: (a) `captureVisibleTab` → data URL → offscreen → `createImageBitmap` works; (b) content script in an iframe gets `frameId` and can message SW; (c) SW survives a 60 s task with a keepalive port | notes in `docs/spikes.md` | |

### Phase 1 → G1 (hours 3–10): mock loop with real browser side
| # | Task | Output | Details |
|---|---|---|---|
| 2.1 | **DOM snapshot** | `DomSnapshot` | Select candidates, not the whole DOM: interactive tags, `[role]`, `[tabindex]`, `contenteditable`, `label`, headings, `canvas/svg/img/video/iframe`, shadow hosts, elements with `cursor:pointer`/onclick heuristic. Compute `bbox` (top-viewport CSS px, add frame offset), `visible` (`checkVisibility()` + opacity + size), `occluded` (`elementsFromPoint` at centre), `interactable`, `rendering` kind. **Password inputs: `value = null`, `has_value` only.** Strip URL query/fragment. |
| 2.2 | **ARIA/accessibility** | role/name/state | `dom-accessibility-api` for name; explicit + implicit role; `aria-expanded/checked/disabled/selected/pressed`. |
| 2.3 | **Shadow DOM** | | Recurse open roots; use `chrome.dom.openOrClosedShadowRoot(el)` (Chrome) — if a closed root can't be read, emit host as `rendering:'shadow_closed'` (router sends it LOW). |
| 2.4 | **Iframes** | | Content script runs in every frame. Each reports frame-relative rects + `FrameInfo`; SW composes offsets (nested frames: sum offsets). If injection is impossible → `accessible:false` → LOW. |
| 2.5 | **Router v1** | `RoutingPlan` | See §5.1. Every decision has `reasons[]`. |
| 2.6 | **Capture** | `captureScreenshot(tabId)` | Only when `plan.needs_screenshot`. Produces `CaptureMeta` (`dpr`, viewport, scroll, image size, `capture_id`, `page_state_hash`). Respect the 2/s limit (queue + coalesce). |
| 2.7 | **Frame assembler** | `assembleFrame()` | DOM regions (HIGH) via `dom/to-regions.ts` + `VisionResult.regions` → `PerceptionFrame`. **Mint `region_id`** = `r1…` in reading order (y then x). Build `region_index`, persist into `TaskSession`, push `registry/set` to content scripts (`region_id → dom_id`; content keeps `WeakRef<Element>` map). |
| 2.8 | **Action schema + validator v1** | Zod `.strict()`; steps `schema → policy → origin → frame → target` | Returns `ValidationVerdict` with per-step `checks`. |
| 2.9 | **Executor v1** | click / type / select / scroll / focus / keypress | See §5.3. |
| 2.10 | **Network client** | `sendPlan(attested)` | See §5.4. |
| 2.11 | **Orchestrator** | `runCycle()` per §2.2 state machine | Persist `TaskSession` after each transition. |
| 2.12 | **Side panel v1** | task input, stage timeline, route list, action log, network status | Subscribes to `ui/state`. |

### Phase 2 → G2 (hours 10–22): swap stubs for real modules
| # | Task | Details |
|---|---|---|
| 3.1 | Flip `flags.vision/privacy/server` to real; fix integration bugs with M2/M3 | Pair with them; you own the bus, they own payloads |
| 3.2 | **State fingerprint** | §5.2 |
| 3.3 | **Origin/frame validation** complete | compares action `origin/frame_id` to **live** values from `dom/fingerprint` and to `TaskSession.allowed_origins` |
| 3.4 | **Capability glue** | validator step `capability` calls `vault.authorize`; executor path calls `vault.resolve` **only after `valid`** |
| 3.5 | **`text_scan`** step | `type.params.text` and `select.option` go through `privacyEngine.scanOutboundText`; reject if `safe=false` or text contains placeholder tokens like `<EMAIL>` |
| 3.6 | Retry logic | `BLOCK` → retry `strict_text_only` once; server retry/backoff; rejection counter; `max_steps` |
| 3.7 | Side panel additions | mount M3's `PrivacyDashboard` and M2's `PerceptionDebug` components |
| 3.8 | Keepalive | long-lived port with heartbeat during a task |

### Phase 3 → G3/G4 (hours 22–34)
| # | Task | Details |
|---|---|---|
| 4.1 | **Dirty regions** | observers → `DirtyEvent` → SW forwards to M2 `cache.invalidate` and marks regions for re-perception |
| 4.2 | Router budget integration | call `vision/budget` at cycle start (cache 2 s); LOW budget lowers the number of allowed LOW regions |
| 4.3 | Human confirmation for risky clicks | policy flags `requires_user_confirmation` (pay/transfer/delete/submit-order keywords) → side panel confirm |
| 4.4 | **Playwright E2E S1–S10** | `tests/e2e`; build with `--mode e2e` to enable `flags.testHooks` |
| 4.5 | E2E latency benchmark | per-`cycle_id` timeline (capture, route, vision, privacy, network, server, validate, execute); output JSON for `benchmarks/e2e/` |
| 4.6 | DevTools network proof script | Playwright records requests from the extension SW and asserts body == what side panel shows |
| 4.7 | Optional: coverage-gap detection in router (§5.1) | |

### Phase 4 → G5 (hours 34–36)
Demo script, `docs/architecture.md`, `README`, fresh-profile dry-runs, packaging zip.

---

## 5. The hard parts — how to do them

### 5.1 Confidence router (`perception/router`)
Deterministic TypeScript. No ML. Per DOM candidate compute a **completeness score** from features, then bucket:

| Feature | Pushes toward |
|---|---|
| has role **and** accessible name, visible, non-zero bbox, `rendering='html'` | HIGH |
| `<div>` with click handler/pointer cursor but **no role/name** | MEDIUM |
| text only in `img`/`svg`/`background-image`, icon-only control | MEDIUM |
| `rendering='canvas'`, `shadow_closed`, inaccessible iframe | **LOW** |
| `occluded=true`, or bbox differs a lot from siblings' layout | MEDIUM (verify) |
| `changed since last cycle` (dirty) | re-evaluate, never auto-HIGH |
| **`img/video/canvas/svg/has_bg_image` with area > threshold** | **at least MEDIUM** (I6: OCR + face scan) |

```ts
export function route(snap: DomSnapshot, prev: PerceptionFrame | null,
                      dirty: DirtyEvent[], budget: Budget): RoutingPlan
```
- Thresholds `τ_high`, `τ_low` live in `router/rules.ts` and are **tuned on the benchmark**, not guessed (spec §9).
- `needs[]` per decision: MEDIUM → `['ocr']` (+`ground` if a DOM element exists); LOW → `['ui_detect','ocr','face','ground']`.
- `crop` = element bbox padded ~8 px (targeted region, not full frame).
- `budget.max_vision_regions` caps how many MEDIUM/LOW crops go to vision; extra ones stay DOM-only and are flagged `reasons:['budget_capped']`.
- Optional (Phase 3): **coverage gaps** — rasterise visible DOM bboxes on a coarse grid; large viewport areas not explained by any DOM element become `gap:<n>` LOW candidates. This is the literal "perceive only what the browser cannot explain" behaviour and shows well in the demo.
- Emit explainable telemetry exactly like spec §25 (REGION #12 … DECISION).

### 5.2 State fingerprint (`browser/state/fingerprint.ts`)
```
page_state_hash = sha256_hex(canonical_json({
  origin, path,
  frames: [ids+origins],
  dialogOpen, scrollBucket(scrollY/64),
  interactive: [for visible+interactable elements: tag, role, name, roundedBBox(4px), aria.disabled/checked]
})).slice(0,16)
```
- Includes only **visible interactive elements + frame structure** so ad rotations and clocks don't cause false stale blocks; excludes anything inside `[data-agent-ui]` (I14).
- Computed in the content script (`dom/fingerprint` message) both at perception time and validation time.
- Provide an option `mode:'strict'|'target-scoped'` (target-scoped = hash of the target + its form group) — start strict as the spec says; only loosen if benchmarks show false blocks.
- Mismatch ⇒ `STALE_STATE` ⇒ block + re-perceive.

### 5.3 Executor (`actions/executor`) — content script only
Executes **only** after the validator returned `valid:true` in the same tick.

| Action | How |
|---|---|
| `click` | resolve `region_id → element` (or `elementFromPoint(bbox centre)` for vision-only regions, converted to frame-local coords) → `scrollIntoView({block:'center'})` if needed → **re-check `elementFromPoint(centre)` is the target or its descendant** (blocks decoys/overlays) → `pointerdown, mousedown, pointerup, mouseup, click` (or `el.click()` for plain controls) |
| `type` | focus → set value via the native prototype setter (`Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set`) → dispatch `input` + `change` (works with React-controlled inputs) |
| `fill_secret` | same as `type`, but the secret arrives only in this message, lives in one local variable, is never logged, and the variable is overwritten afterwards |
| `select` | native `<select>`: set value + `change`; custom dropdown: click sequence |
| `scroll` | bounded `scrollBy` (cap amount) |
| `focus` | `el.focus()` |
| `keypress` | whitelist `Enter, Tab, Escape, Arrow*, Backspace` dispatched to the focused element |

- **No `eval`, no `Function`, no server-provided code**, ever.
- After executing: wait for **settle** (no mutations for ~150 ms or navigation event, hard cap 2 s), compute new hash, return `ExecResult`. Synthetic events are `isTrusted:false`; if a site rejects them, log it — CDP `Input.dispatchMouseEvent` via `chrome.debugger` is a Phase-3 option (shows a browser warning bar).
- Draw an action highlight in a **closed shadow root** marked `data-agent-ui` (I14).

### 5.4 Action firewall (`actions/validator`) — order is fixed
```
schema → policy → origin → frame → state → target → visibility/interactability → capability → text_scan → VALID
```
| Step | Check |
|---|---|
| schema | Zod `.strict()`; action ∈ allowed enum; unknown keys ⇒ reject (this is what blocks "arbitrary JS") |
| policy | action ∈ `session.allowed_actions`; `step_index < max_steps`; `type` not allowed on `is_password` fields (must be `fill_secret`); region not `injection_suspected` for state-changing actions; risky-keyword buttons ⇒ `requires_user_confirmation` |
| origin | `action.origin === live origin` **and** ∈ `session.allowed_origins` |
| frame | `action.frame_id === region_index[target].frame_id` and frame still exists with same origin |
| state | `action.page_state_hash === live page_state_hash` (fetched now via `dom/fingerprint`) |
| target | `region_id ∈ region_index` (I7); `action/resolve-target` says element exists |
| visibility | visible, not occluded, interactable; bbox within tolerance of perceived bbox |
| capability | for `fill_secret`: `vault.authorize(ref, { task_id, origin, frame_id, action, target: { semantic_type, input_type, is_password } })` — the `target` fields come from the `action/resolve-target` response, not from the server |
| text_scan | `scanOutboundText(params.text)` safe |

Write **table-driven Vitest**: one reject case per step, plus 5 combined attack cases. Verdict carries `checks[]` so the side panel can show which gate stopped it (great for the demo).

### 5.5 Network gate (`network/`)
```ts
export async function sendPlan(a: AttestedPayload): Promise<PlanResponse> {
  if (await sha256Hex(a.body) !== a.sha256) throw stageError('PRIVACY_BLOCK', 'digest mismatch');
  // POST a.body as-is (never re-serialise), headers: X-API-Key, Content-Type, timeout 20s, 1 retry
  // parse response with PlanResponseSchema.strict(); cap response size
}
```
- Sends **only** `a.body`. No other function in the extension may call `fetch` (lint).
- Record `network` span; add server-reported `usage.server_ms` for decomposition.

### 5.6 Service-worker lifecycle
- Keep no important state in variables: `TaskSession` → `chrome.storage.session` on every transition; on SW wake, resume from the persisted state or mark `FAILED`.
- Hold a long-lived port (from side panel / offscreen) with a heartbeat every ~20 s while a task runs.
- All `onMessage` listeners register **synchronously at top level** (MV3 requirement).

### 5.7 Firefox note (Phase 3 only)
Firefox has no `chrome.offscreen`. Abstract as `VisionHost` (`offscreen` | `background-page`) so M2's/M3's code doesn't care. Do this only if everything else is done.

---

## 6. What you PROVIDE / CONSUME

**Provide to M2:** `VisionRequest` (with correct `dpr`, `capture_id`, `page_state_hash`, `plan.needs`), `DirtyEvent`s, fixtures (`frames/*`), telemetry sink, side-panel slots.
**Provide to M3:** `PerceptionFrame` (complete, all regions, with `dom` snapshot), `TaskContext` (`allowed_actions`, `allowed_origins`, `history`), test-site hosting for `pii/` and `prompt-injection/`, Playwright runner for the attack lab.
**Consume from M2:** `perceive`, `getBudget`, `cache.invalidate`.
**Consume from M3:** `sanitize`, `scanOutboundText`, `vault.authorize/resolve`, server `/v1/plan`.

---

## 7. Stubs you ship at G0 (permanent test doubles)

| Stub | Behaviour |
|---|---|
| `vision.stub.ts` | `perceive()` returns `fixtures/frames/<case>/vision.result.json`; `getBudget()` fixed HIGH/wasm |
| `privacy.stub.ts` | builds a valid `SanitizedContext` from the frame, replacing `input` values and emails with placeholders by simple regex, returns an `AttestedPayload` with a real SHA-256; `scanOutboundText` = naive regex; vault = in-memory map from `fixtures/vault/demo.json` |
| Mock planner | (M3's server `PLANNER_MODE=mock`) |

---

## 8. Tests you own

- **Unit:** router (table of DOM cases → level), state hash stability/sensitivity, region-id minting determinism, frame offset composition, validator (per step), executor guards (occluded target refuses), network gate (tampered body).
- **E2E (Playwright):** S1–S10 in shared §11. Launch with `chromium.launchPersistentContext(dir, { headless:false | args:['--headless=new'], args:['--disable-extensions-except=…','--load-extension=…'] })`.
- **Perf:** cycle timeline JSON with every stage and `cycle_id`.

---

## 9. Definition of Done (Member 1)

- [ ] Extension loads from `.output/chrome-mv3` with no console errors; SW and offscreen lifecycle are stable over a 5-minute session.
- [ ] `DomSnapshot` handles normal DOM, open **and** closed shadow roots, same-origin and cross-origin iframes, canvas, scrolling, dynamic content.
- [ ] Router produces HIGH/MEDIUM/LOW with reasons; HIGH-only pages call vision 0 times.
- [ ] Every action passes the full validator chain; each step has a failing test.
- [ ] Stale, cross-origin, wrong-frame, unauthorised-capability and injection-target actions are all blocked and re-perceived.
- [ ] Only `AttestedPayload.body` is ever sent; forged/edited body is rejected.
- [ ] `TaskSession` survives a service-worker restart.
- [ ] Side panel shows: task, route per region, DOM confidence, vision invoked?, detected PII (types only), redaction status, firewall verdict, network status, action status.
- [ ] Playwright S1–S10 pass locally; E2E latency JSON produced.
- [ ] Fixtures recorder produced ≥ 5 frames early; contracts CI green.

## 10. Your gotchas checklist
- `chrome.runtime` messages are JSON — send screenshots as data URLs, not Blobs.
- `captureVisibleTab` needs `activeTab`/host permission and is rate-limited; capture only when the plan needs it.
- Device pixel ratio: image px = CSS px × `dpr`; always send `dpr` in `CaptureMeta`.
- Cross-origin iframe coordinates must be **translated to top-viewport space** before they reach M2/M3.
- Don't let your own highlight/overlay change the state hash or get perceived (I14).
- Never log `DomElementInfo.text`/`value`; telemetry meta = numbers and enums.
- Firefox: no offscreen API — deferred, don't start it early.