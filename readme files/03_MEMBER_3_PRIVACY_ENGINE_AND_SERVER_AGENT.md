# MEMBER 3 — Privacy Engine & Server Agent
**Read `00_SHARED_CONTRACTS_AND_SYNC.md` first.** Section numbers like §7 · I5 refer to it.

You own **what may leave the browser** and **what comes back**. Privacy is 40 % of the SIH score (PII precision/recall 20 % + redaction precision 20 %), so your quality bar sets the project's score. You also own both ends of the sanitized-context contract: the extension-side producer and the server-side consumer.

---

## 1. What you own

| Area | Spec sections | Result |
|---|---|---|
| PII detection: DOM signals, regex/rules, OCR text, faces, secrets | Arch §11, Stack §9 | `privacy/pii` |
| PII / secret **fusion** | Arch §11 | `privacy/fusion` |
| Task relevance + **minimum necessary disclosure** | Arch §12 | `privacy/relevance` |
| Semantic + visual **redaction** | Arch §14 | `privacy/redaction` |
| **Privacy Egress Firewall** (independent verifier) | Arch §15 | `privacy/verifier` |
| **Local Secret Capability vault** | Arch §13 | `privacy/secrets` |
| Sanitized-context builder + injection tagging | Arch §16, §18 | `privacy/relevance/context-builder.ts` |
| **FastAPI** server, context processor, VLM adapter, planner | Arch §17, Stack §10 | `server/` |
| Pydantic schemas mirroring the wire contracts | Stack §11 | `server/app/schemas` |
| Attack lab scenarios + PII / redaction benchmarks | Arch §28, §17 matrix | `attack-lab/`, `benchmarks/pii|redaction` |
| Synthetic PII test pages | Arch §26.2–26.3 | `test-site/pii`, `test-site/prompt-injection` |
| React `PrivacyDashboard` | Stack §13 | `src/ui/PrivacyDashboard.tsx` |

You do **not** own: routing/DOM/executor/validator (M1), OCR/detection/grounding (M2). You *use* M2's `ocrImage`, `detectFaces`, `getCapture`.

---

## 2. Tech stack you use (and where)

| Tech | Where | Notes |
|---|---|---|
| **TypeScript** | `extension/src/privacy/*` | runs in the **offscreen document** (same realm as M2 — direct imports) |
| **Regex + rule engine** | `privacy/pii` | plus checksums: Luhn (cards), Verhoeff (Aadhaar) |
| **`libphonenumber-js/min`** (optional) | phone validation | improves phone precision |
| **Canvas / OffscreenCanvas** | `privacy/redaction` | opaque masks → `convertToBlob({type:'image/jpeg', quality})` |
| **Web Crypto API** | `privacy/secrets`, `verifier` | AES-GCM for the vault, SHA-256 for `AttestedPayload` |
| **IndexedDB (`idb`)** | vault storage | non-extractable `CryptoKey` stored via structured clone |
| **Zod (`.strict()`)** | `verifier`, context builder | schema check of the exact outbound body |
| **React** | `PrivacyDashboard` | UI only |
| **Python 3.11+, FastAPI, Uvicorn, Pydantic v2, httpx** | `server/` | |
| **Provider SDK** (Anthropic / OpenAI / Gemini) or **Ollama/vLLM** (open-weight VLM) | `server/app/vlm` | behind one interface; replaceable |
| **pytest, ruff** | `server/tests` | |
| **Docker / docker-compose** | `docker-compose.yml` | optional Caddy for HTTPS demo |
| **Python** (`pandas`, `sklearn`) | `benchmarks/scripts` | PII/redaction metrics |

---

## 3. Files you create

```
extension/src/privacy/
├── index.ts                                   # exports privacyEngine (§6)
├── pii/{detectors.ts, dom-signals.ts, rules-in.ts, checksums.ts, ocr-tolerant.ts, patterns.ts, faces.ts}
├── fusion/{fuse.ts, precedence.ts}
├── relevance/{relevance.ts, ladder.ts, context-builder.ts, injection.ts, region-ranker.ts}
├── redaction/{semantic.ts, visual.ts, geometry.ts}
├── secrets/{vault.ts, authorize.ts, crypto.ts, demo-seed.ts}
└── verifier/{firewall.ts, checks/{schema,keys,text-pii,vault-scan,image,entropy,unclassified,size}.ts, attest.ts}
extension/src/offscreen/privacy-host.ts        # registers privacy/* handlers into M1's dispatcher
extension/src/ui/PrivacyDashboard.tsx
server/
├── pyproject.toml  .env.example  Dockerfile
├── app/
│   ├── main.py  core/{config.py, logging.py, security.py}
│   ├── api/{plan.py, health.py, debug.py}
│   ├── schemas/{wire.py, internal.py}
│   ├── context/{processor.py, prompt.py, server_pii_check.py, injection.py}
│   ├── vlm/{base.py, mock.py, anthropic_client.py, openai_client.py, gemini_client.py, ollama_client.py}
│   └── planner/{planner.py, system_prompt.py, tools.py, verify.py}
└── tests/{test_contracts.py, test_plan_api.py, test_planner_verify.py, test_server_pii_check.py}
test-site/{pii,prompt-injection}/    attack-lab/{scenarios.json, run.ts}
benchmarks/{pii,redaction}/          benchmarks/scripts/{pii_metrics.py, redaction_metrics.py}
```

---

## 4. Work breakdown (in build order)

### Phase 0 → G0 (hours 0–3)
| # | Task | Output |
|---|---|---|
| 3.1 | Own Pydantic mirror of shared §4.7–4.8; `test_contracts.py` runs the shared fixtures | contract PR |
| 3.2 | **Server skeleton**: `/healthz`, `POST /v1/plan`, `PLANNER_MODE=mock` deterministic planner, CORS `*` (dev), `X-API-Key` check, request-size limit | M1 can start G1 immediately |
| 3.3 | Server debug log: when `LOG_RECEIVED_PAYLOADS=true`, write each received body to `server/logs/received/<request_id>.json` and expose `GET /v1/debug/last` (dev only) | evidence for demo & attack lab ("Transmitted?") |
| 3.4 | Author `fixtures/pii/positives.jsonl` + `negatives.jsonl` (synthetic!) and `fixtures/vault/demo.json` | shared by M2/M3/Python |
| 3.5 | **Day-1 spike:** (a) SHA-256 in SW and offscreen via Web Crypto; (b) OffscreenCanvas draws a mask on an ImageBitmap and `convertToBlob` → JPEG; (c) AES-GCM encrypt/decrypt a value with a non-extractable key stored in IndexedDB | `docs/spikes.md` |

### Phase 1 → G1 (hours 3–10): real privacy logic on fixtures, real server contract
| # | Task | Details |
|---|---|---|
| 4.1 | **Regex/rule detectors** | §5.1 |
| 4.2 | **DOM signal detector** | input `type`, `autocomplete` tokens, name/id/placeholder/label keywords, `is_password`, `has_value` |
| 4.3 | **Semantic redaction** | replace spans with `<EMAIL> <PHONE> <PERSON> <ADDRESS> <CARD> <PASSWORD> <DOB> <ID> <TOKEN>` |
| 4.4 | **Context builder v1** | `PerceptionFrame` → `SanitizedContext` (text-only), drops raw `dom`, strips values, sanitizes `task` and `title`, excludes hidden/off-screen text (D10) |
| 4.5 | **Firewall v1** | schema check + key whitelist + text PII re-scan → `AttestedPayload` |
| 4.6 | **Server real planner path** (still fed by mock context) | §5.7 prompts, structured output, verification |
| 4.7 | Unit tests on `positives/negatives` (TS + Python) | precision/recall baseline numbers |

### Phase 2 → G2 (hours 10–22): full pipeline in the extension
| # | Task | Details |
|---|---|---|
| 5.1 | **OCR-PII** | run detectors over `frame.ocr_tokens` lines; map matched character spans back to token boxes (§5.2) |
| 5.2 | **Face PII** | `frame.faces` → `FACE` detections with boxes |
| 5.3 | **PII fusion** | §5.3 |
| 5.4 | **Relevance + minimum disclosure** | §5.4 |
| 5.5 | **Visual redaction** | §5.5 — build the redacted crop image from `visionEngine.getCapture()` |
| 5.6 | **Firewall v2 (image + vault + unclassified)** | §5.6 — re-OCR and re-face-detect the *outgoing* image via M2, mask-integrity check |
| 5.7 | **Capability vault** | §5.8 |
| 5.8 | **Server real VLM adapter** (+ image input) | one provider working; others optional |
| 5.9 | Flip `flags.privacy='real'` with M1; fix integration | pair on the login demo |
| 5.10 | `PrivacyDashboard` v1 | detections by type/source, redaction status, firewall checks (green/red per check), **exact outgoing body viewer**, network log |

### Phase 3 → G3/G4 (hours 22–34): attack lab + evidence
| # | Task | Details |
|---|---|---|
| 6.1 | **Prompt-injection handling** | tagging + server prompt separation (§5.7) |
| 6.2 | **Attack lab** (11 scenarios) | §6 |
| 6.3 | **PII benchmark** | per class, per source (DOM/regex/OCR/vision), precision/recall/FP/FN; report per-detector and fused |
| 6.4 | **Redaction benchmark** | redaction precision, residual sensitive pixels (OCR on the redacted image), semantic leakage (string search in payload) |
| 6.5 | Test-matrix pages | every row of spec §17 (DOM text, placeholder, aria-label, OCR-visible, canvas, image, SVG, iframe, shadow DOM, partial obstruction, low contrast, small text, dynamic) |
| 6.6 | Tuning | thresholds per class from the benchmark (don't invent) |
| 6.7 | Optional: small local NER for PERSON/ADDRESS | reuse M2's ORT helper; only if rules under-perform |
| 6.8 | Optional: offline open-weight VLM adapter (Ollama/vLLM) | |

---

## 5. The hard parts — how to do them

### 5.1 PII detectors (`privacy/pii`)
Layered, independent signals; each emits `PiiDetection{type, source, span/bbox, confidence, mandatory}`.

| Type | Rules (synthetic data only in tests) |
|---|---|
| EMAIL | RFC-lite regex; also obfuscated `name [at] domain` |
| PHONE | Indian mobile `(?:\+91[\s-]?|0)?[6-9]\d{9}`, generic international via `libphonenumber-js/min`; require digit-count sanity to avoid order IDs |
| CARD | 13–19 digits with separators + **Luhn** |
| GOV_ID | **Aadhaar** (12 digits, first digit 2–9, **Verhoeff** checksum), **PAN** `[A-Z]{5}\d{4}[A-Z]`, passport/voter-ID-like patterns, SSN-like |
| BANK_ACCOUNT | IFSC `[A-Z]{4}0[A-Z0-9]{6}`, account-number heuristics near "A/C" labels, UPI `handle@bank` (no dot in domain) |
| DOB | date patterns near labels (`DOB`, `Birth`) |
| AUTH_TOKEN | JWT `eyJ…\.…\.…`, `AKIA…`, `sk-…`, long base64/hex with entropy, tokens in URL params |
| ADDRESS | PIN code (`\b[1-9]\d{5}\b`) + street/locality keywords; `autocomplete=street-address` |
| PERSON | `autocomplete=name/given-name/family-name`, label proximity ("Name", "Dear …"), capitalised bigram + gazetteer; weakest class → rely on context |
| PASSWORD | `input[type=password]`, `autocomplete=current-password/new-password`, label keywords |
| IDENTIFIER | generic account/customer IDs by label |

Design rules:
- **Recall first** in detection (union), precision is recovered in fusion by context.
- **Never store the raw value** in `PiiDetection`; keep `span` + hash if you need dedupe.
- `mandatory=true` for PASSWORD, AUTH_TOKEN, CARD, GOV_ID, FACE, BANK_ACCOUNT. Others are also always replaced by a placeholder — relevance only selects *safer-than-raw* representations (§5.4).

### 5.2 OCR-tolerant matching
OCR mistakes digits/letters (`O↔0`, `l/I↔1`, `S↔5`, `B↔8`). Run a **second pass** with a normaliser applied only in digit-context windows, then map back to original spans. To turn a text span into a box: find tokens whose `line_id` and character offsets overlap the match, take the union of their `bbox`es, pad slightly. Partial-token matches → mask the whole token.

### 5.3 Fusion (`privacy/fusion`)
- Group detections by overlapping region/box/span. Combine **confidence = 1 − ∏(1 − cᵢ)** (noisy-OR) as a starting point, then calibrate per class on the benchmark.
- **Type precedence** when detectors disagree: `PASSWORD/AUTH_TOKEN > CARD > GOV_ID > BANK_ACCOUNT > DOB > PHONE > EMAIL > ADDRESS > PERSON > IDENTIFIER`.
- **Context downgrade** (precision control): labels like "Order ID", "Qty", "Price", "Tracking" downgrade `PHONE/IDENTIFIER` false positives — **never** applied to mandatory classes.
- Merge overlapping boxes; keep the list of contributing sources for the dashboard.
- Output a classified frame: every region gets `sensitivity ∈ {none, pii, secret}` (nothing left `unclassified` — otherwise firewall blocks, I4).

### 5.4 Minimum disclosure (`privacy/relevance`)
Two separate decisions, both deterministic (policy engine, no LLM):
1. **Representation ladder** (safer-than-raw only; task can *upgrade richness*, never reveal raw):
   ```
   EMAIL/PHONE/PERSON/DOB/GOV_ID/PASSWORD → <TYPE>            (no richer option)
   ADDRESS → <ADDRESS>  →  <CITY>          (only if task text mentions city/location)
   CARD    → <CARD>     →  <CARD_LAST4>    (only if task needs last 4)
   FACE    → masked / <FACE>
   ```
2. **Region selection**: rank regions by relevance (term overlap with task, actionable, proximity to likely targets, form-group membership, dirty), keep top-K (~60) + dialogs + anything the router marked LOW; drop irrelevant text-only regions. Cap text at ~200 chars. This also cuts prompt size → server latency.
3. **Mandatory privacy first, relevance second, minimum representation third** (spec Gap 4) — write a unit test proving no task text can switch a mandatory class to raw.

### 5.5 Redaction (`privacy/redaction`)
**Semantic:** replace spans in `text`, `name`, placeholders, aria labels; `input.value` → placeholder; never include `href/src/query`.
**Visual** (only when `include_image` and mode `normal`):
1. Choose crops: LOW/MEDIUM regions (+ dialog) — **not** the full page.
2. Get bitmap via `visionEngine.getCapture(frame.capture.capture_id)`; **refuse if `capture.page_state_hash ≠ frame.page_state_hash`** (I1).
3. Convert boxes CSS px → image px with `CaptureMeta` (`toImagePx`, helper in `contracts/ts/geometry.ts`).
4. Draw **opaque** rectangles at full resolution first, padding `max(4px, 15 % of box height)`, then merge overlapping boxes. Token-level masks for confident text PII; **whole-region masks** for password fields, faces and unclassified/uncertain OCR inside inputs. (Balance: over-masking hurts redaction *precision*.)
5. *Then* downscale and encode with `OffscreenCanvas.convertToBlob` (JPEG, quality ~0.7) — re-encoding also strips metadata.
6. Record `masked_boxes`, `masked_area_px` for the dashboard and benchmark.
Test: partial text, edge pixels, tiny fonts, overlapping boxes, DPR 2/3, zoom, scrolling, image PII, canvas PII.

### 5.6 Egress firewall (`privacy/verifier`) — independent second opinion
Runs on the **serialised body string**, not on your builder's objects. Use a **separate rule instance** with stricter thresholds so a bug in stage A doesn't repeat here. Fail closed.

| # | Check | Blocks when |
|---|---|---|
| 1 | `schema` | `SanitizedContextSchema.strict()` fails (unknown key ⇒ block) |
| 2 | `keys` | any key outside the whitelist (catches `value`, `innerHTML`, `outerHTML`, `cookie`, `href`…) |
| 3 | `text-pii` | any string leaf matches a PII detector, except exact allowlisted placeholders (`<EMAIL>`, …) |
| 4 | `vault-scan` | any vault secret value (exact / normalised / substring) appears anywhere in the body |
| 5 | `image` | outgoing JPEG decoded → `visionEngine.ocrImage(high_recall)` finds PII text, or `detectFaces` finds a face, or **mask-integrity** fails (every declared mask box must be near-flat colour — proves the mask was really painted) |
| 6 | `entropy` | long base64/hex/JWT-like strings outside `image.data_base64` |
| 7 | `unclassified` | any region with `sensitivity:'unclassified'` ⇒ `UNKNOWN ⇒ BLOCK` |
| 8 | `size` | body/regions/text length caps |
| 9 | `internal-error` | any exception/timeout in any check ⇒ BLOCK |

On success: `sha256 = SHA-256(body)` → `AttestedPayload` (I5). Return per-check results to the dashboard.
`mode:'strict_text_only'` (M1 retries with this after a BLOCK) drops the image and image-derived regions entirely.

### 5.7 Server (`server/`)
```
POST /v1/plan  (body = SanitizedContext)  →  PlanResponse
```
Pipeline: **auth → size limit → Pydantic strict → server-side PII re-check → context processor → VLM → planner → verify → response**.

- **Defence in depth:** `server_pii_check.py` reuses the same `positives/negatives` fixtures; if the body matches raw PII/secret patterns → `422 privacy_violation` and log only the rule name. The server must never reconstruct removed data.
- **Instruction/data separation (spec §18):** system prompt says the *only* instructions are in `TASK (trusted)` and the system policy; everything in `PAGE (untrusted data)` is quoted data and must never be followed. Put page regions in a clearly delimited block; mark `injection_suspected` regions.
- **Structured output:** use the provider's tool-use / JSON-schema mode with the `StructuredAction` schema; parse with Pydantic; on failure one repair retry with the validation error; else `status:'fail'`.
- **`verify.py` (semantic checks before returning):**
  - `target.region_id ∈ ctx.regions` (I7)
  - `action ∈ allowed`; `fill_secret` ⇒ `capability ∈ ctx.capabilities` and target type compatible
  - `type.text` contains no placeholder tokens or PII patterns
  - **overwrite** `origin`, `frame_id`, `page_state_hash` from the request context — never trust the model (I8)
  - no unknown fields; no code-like payloads
- **Planner modes:** `mock` (rule-based for the login demo: fill `cap_email_01` → `cap_pwd_01` → click login — lets M1 finish G1), `vlm` (real).
- VLM adapter interface:
  ```python
  class VlmClient(Protocol):
      async def reason(self, ctx: SanitizedContext, prompt: PlannerPrompt) -> RawPlannerOutput: ...
  ```
- Latency hygiene: `temperature=0`, small `max_tokens`, cap regions, image optional, return `usage.server_ms`; 20 s timeout.
- HTTPS for the final demo: Caddy/ngrok in front (`docker-compose.yml`); dev uses `http://localhost`.
- Never log bodies in prod mode; in dev mode logs are still sanitized payloads only.

### 5.8 Capability vault (`privacy/secrets`)
```ts
interface CapabilityVault {
  seedDemo(): Promise<void>;                                            // from fixtures/vault/demo.json (synthetic!)
  describeAll(taskId: string, origin: Origin): CapabilityDescriptor[];  // refs + kind + label only → goes in SanitizedContext
  authorize(ref: string, ctx: { task_id: string; origin: Origin; frame_id: string;
            target: { semantic_type: SemanticType; input_type?: string; is_password?: boolean };
            action: ActionType }): Promise<{ ok: boolean; reason?: string }>;
  resolve(ref: string, ctx: same): Promise<string>;                      // re-checks authorize; single use / TTL
}
```
- Storage: IndexedDB, values encrypted with AES-GCM using a non-extractable `CryptoKey`.
- `authorize` = capability exists ∧ task allowed ∧ origin ∈ `allowed_origins` ∧ target kind matches (`password` cap → only `input[type=password]`; `email` cap → email-type/labelled field) ∧ action is `fill_secret` ∧ rate-limit/TTL.
- Denials are logged as events (feeds attack-lab #11).
- The vault module is importable from both SW (M1's validator/executor path) and offscreen (M3's context builder) — same IndexedDB.
- Scope honesty (spec §13): **synthetic vault, no real password-manager claims.**

---

## 6. Attack lab (`attack-lab/`)
One page/scenario per row; run through M1's Playwright runner; record **Detected? Redacted? Blocked? Transmitted? Executed?** from telemetry + server debug log + network capture.

| # | Scenario | Expected |
|---|---|---|
| 1 | PII in DOM | detected, replaced by placeholder, not transmitted raw |
| 2 | PII in image | OCR detects, masked, image mask-integrity OK |
| 3 | PII in canvas | vision/OCR detects, masked |
| 4 | tiny PII text | detected with upscale OCR; if not → firewall BLOCK |
| 5 | partially obscured PII | detected or region-masked; nothing leaks |
| 6 | hidden PII (display:none / off-screen) | excluded by D10 |
| 7 | prompt injection | tagged untrusted; not executed |
| 8 | cross-origin target | validator blocks |
| 9 | stale action | validator blocks, re-perceive |
| 10 | attempted unsafe payload | firewall BLOCK (test hook injects raw PII) |
| 11 | unauthorised secret request | vault denies |

Use synthetic PII only. Report **measured** results only.

---

## 7. What you PROVIDE / CONSUME

**Provide to M1:** `privacyEngine.sanitize`, `scanOutboundText`, `vault.authorize/resolve/describeAll`, `AttestedPayload`, server `/v1/plan` (mock and live), `PrivacyDashboard`, attack-lab scenarios, PII test pages.
**Provide to M2:** PII fixtures (for OCR quality checks), requirements for OCR (`high_recall` on crops that contain input fields/images).
**Consume from M1:** complete `PerceptionFrame` (every region, `dom`, `capture`), `TaskContext`, retry with `strict_text_only`, Playwright runner.
**Consume from M2:** `OcrToken[]`, `FaceBox[]` in `VisionResult`; `ocrImage`, `detectFaces`, `getCapture`.

---

## 8. Stubs to ship at G0
- Server `PLANNER_MODE=mock` (behaviour described above).
- `fixtures/vault/demo.json` — synthetic: `cap_email_01`, `cap_phone_01`, `cap_pwd_01` bound to the test-site origin.
- `fixtures/wire/*.json` valid + invalid examples for the contract tests.

---

## 9. Tests you own
- **Detector unit tests:** every row of `positives.jsonl` detected; every row of `negatives.jsonl` not detected (per class thresholds).
- **Fusion:** precedence, downgrade never applies to mandatory classes.
- **Relevance:** task text can't force raw disclosure (property test).
- **Redaction:** pixel tests on synthetic images (masked region variance ≈ 0; unmasked regions unchanged), DPR 1/2/3, zoom, overlap merge.
- **Firewall:** table-driven — every check has a failing payload; forged extra field; raw email hidden in `title`; base64 blob; image with a visible face; exception injection ⇒ BLOCK.
- **Vault:** authorisation matrix (origin, target kind, action, task, TTL).
- **Server:** contract fixtures, API tests with mock VLM, planner verify (hallucinated region id, `type` with placeholder, missing capability, wrong origin overwritten).
- **Benchmarks:** `pii_metrics.py`, `redaction_metrics.py` → reports; thresholds in CI `bench-smoke`.

---

## 10. Definition of Done (Member 3)
- [ ] For every scenario in the PII test matrix (spec §17) there is a measured detected/redacted result.
- [ ] Per-class PII precision/recall reported; fused ≥ best single detector on recall.
- [ ] Redaction precision, residual sensitive pixels and semantic leakage reported.
- [ ] Firewall blocks each of its 9 failure classes in tests and in the attack lab; `UNKNOWN ⇒ BLOCK` proven.
- [ ] Server receives only sanitized payloads (debug log proves); `422` on injected raw PII.
- [ ] Vault: `fill_secret` works on the demo origin, denied elsewhere; secret never appears in any payload/log/telemetry (log-grep test).
- [ ] Real VLM returns valid `StructuredAction`s for S1–S4; planner verify rejects hallucinated regions/capabilities.
- [ ] `PrivacyDashboard` shows detections, redaction stats, per-check firewall result, exact outgoing body, network log.
- [ ] Attack-lab report with all 11 rows.

## 11. Your gotchas checklist
- Placeholders in **server context** are fine; placeholders in **`type.text`** are not (server must not type `<EMAIL>` literally).
- The user's own **task text** and the **page title** can contain PII — sanitize them too.
- Query strings/fragments leak tokens — never send them (D7).
- Firewall must operate on the **string that will be sent**, and `AttestedPayload.body` must be sent byte-for-byte.
- Don't reuse the stage-A detector instance in the firewall; independent code path + stricter thresholds.
- Don't let relevance ranking drop a region that carries an *actionable* target the router marked LOW.
- Hidden/off-screen text stays out of the payload unless the task explicitly needs it *and* it passed all checks.
- Synthetic PII only in fixtures, pages and demos — no real personal data in the repo.
