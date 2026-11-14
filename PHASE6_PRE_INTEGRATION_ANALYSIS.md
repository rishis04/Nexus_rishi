# PHASE 6 — PRE-INTEGRATION ARCHITECTURAL ANALYSIS
**Cross-Repository Egress Audit Integration**
**Date:** 2026-09-30
**Repository:** MAIN Privacy-Preserving Browser-Agent (`sih26171-root`)

---

## 1. Executive Summary
This analysis establishes the architectural boundary for integrating the separate **Egress Audit Layer** with the **MAIN browser-agent repository**. The separate Egress Audit repository provides independent pre-egress payload observation, SHA-256 integrity verification, local audit storage, correlation IDs, and a judge-facing audit viewer. 

The MAIN repository's responsibility is solely the privacy pipeline. The Phase 6 objective is to introduce a minimal, non-invasive audit adapter that observes the finalized, sanitized payload immediately before network egress without modifying the payload, weakening privacy, or creating a single point of failure.

---

## 2. Existing Privacy Pipeline Architecture

The end-to-end data flow in this codebase follows a strict local-zone processing pipeline:

```text
Web Page / Active Tab
       ↓
DOM Snapshot & ARIA Resolution
  (`extension/src/content/observers.ts`, `extension/src/perception/dom/snapshot.ts`)
       ↓
Perception Router & Dirty Region Tracker
  (`extension/src/perception/router/router.ts`, `extension/src/perception/dirty-region/tracker.ts`)
       ↓
Perception Assembly (`extension/src/background/assemble-frame.ts`)
  ├─ Selective Local Vision (`extension/src/vision/engine.ts` using YuNet face detection)
  └─ DOM/ARIA Region Indexing
       ↓
Perception Daemon (`extension/src/background/perception-daemon.ts`)
       ↓
Semantic PII Classification Layer (`extension/src/privacy/semantic-pii-classifier.ts`)
       ↓
Indian PII Detector Registry (`extension/src/privacy/indian-pii-registry.ts`)
  (Aadhaar Verhoeff, PAN Checksum, IFSC, Voter ID, Passport, DL, UPI, etc.)
       ↓
Canvas Visual Redaction (`extension/src/privacy.stub.ts` - `redactImageCanvas`)
  (Applies solid blackouts with red borders over face coordinates and PII bboxes)
       ↓
Privacy Verifier & Firewall (`privacyStub.sanitize` in `extension/src/privacy.stub.ts`)
  (Enforces zero cleartext PII, replaces values with typed redaction tokens)
       ↓
Cryptographic Attestation
  (SHA-256 digest calculation over canonicalized JSON context)
       ↓
FINAL SANITIZED CONTEXT (`SanitizeResult.attested`: `AttestedPayload`)
```

---

## 3. Final Sanitized Payload Location

The finalized sanitized payload is produced in:
- **File:** `extension/src/privacy.stub.ts` (aliased as `privacyEngine` via `extension/src/privacy/engine.ts`)
- **Function:** `privacyStub.sanitize(req: SanitizeRequest): Promise<SanitizeResult>`
- **Exact Code Boundary:** Lines 755–788:
  ```typescript
  const sanitizedContext: SanitizedContext = {
    schema_version: '1.0',
    request_id: `req_${req.cycle_id}`,
    task_id: req.task.task_id,
    step_index: req.task.step_index,
    task: req.task.task_text,
    page: { ... },
    regions: sanitizedRegions,
    capabilities,
    redactions,
    image: null,
    history: req.task.history,
    flags: { injection_suspected_region_ids: [] },
  };

  const rawBody = canonicalJson(sanitizedContext);
  const digest = await sha256Hex(rawBody);

  const attested: AttestedPayload = {
    request_id: sanitizedContext.request_id,
    body: rawBody,
    sha256: digest,
    issued_at: Date.now(),
  };
  ```

---

## 4. Current Egress Path

The only point where outbound network traffic leaves the browser extension for planning/reasoning is:
- **File:** `extension/src/network/gate.ts` (re-exported via `extension/src/network/client.ts`)
- **Function:** `sendPlan(attested: AttestedPayload): Promise<PlanResponse>`
- **Transport:** Standard Web `fetch()` API (`POST ${serverUrl}/v1/plan`)
- **Headers:** `Content-Type: application/json`, `X-API-Key: apiKey`
- **Body:** `attested.body` (transmitted byte-for-byte as canonical JSON string)

Inside `sendPlan`, the application verifies Invariant I5:
```typescript
const calculatedDigest = await sha256Hex(attested.body);
if (calculatedDigest !== attested.sha256) {
  throw stageError('PRIVACY_BLOCK', 'network', 'digest mismatch: body was altered after attestation');
}
```

---

## 5. Recommended Interception Point

The optimal, safest interception point is inside **`extension/src/network/gate.ts`**:
- **Timing:** Immediately **AFTER** verifying the SHA-256 digest (`calculatedDigest === attested.sha256`) and **BEFORE** invoking `fetch(`${serverUrl}/v1/plan`, ...)`.
- **Rationale:**
  1. The payload is guaranteed to have passed the entire privacy pipeline (DOM sanitization, Indian PII detection, Face masking, and Privacy Verifier).
  2. Invariant I5 has verified that `attested.body` is completely untampered and matches `attested.sha256`.
  3. Network egress has not yet occurred, perfectly fulfilling the definition of a *pre-egress observation layer*.
  4. Any observation failure can be caught and isolated so that network transport continues unaffected.

---

## 6. Payload Structure

The object passed to the audit boundary has the following exact contract:

### Attested Payload Envelope (`AttestedPayload`)
```typescript
export interface AttestedPayload {
  request_id: string; // e.g., 'req_cycle_172765...'
  body: string;       // UTF-8 Canonical JSON string of SanitizedContext
  sha256: string;     // Hex-encoded SHA-256 digest of body
  issued_at: number;  // Epoch millisecond timestamp
}
```

### Inner Body Structure (`SanitizedContext`)
When parsed, `JSON.parse(attested.body)` contains:
- `schema_version`: `'1.0'`
- `request_id`: Unique request identifier
- `task_id`: Identifier of the current agent session
- `step_index`: Current cycle index
- `task`: High-level user goal
- `page`:
  - `origin`: e.g. `'https://example.com'`
  - `path`: Current URL pathname
  - `title`: Page title
  - `page_state_hash`: Hash of the perception frame
  - `viewport`: `{ width: number, height: number, device_pixel_ratio: number }`
  - `frame_ids`: String array of child frames
- `regions`: Array of `SanitizedRegion`:
  - `region_id`: string
  - `type`: Semantic category (`'input' | 'button' | 'text' | ...`)
  - `text`: Masked text (e.g. `Hello <EMAIL>, your Aadhaar is <REDACTED_AADHAAR>`)
  - `bbox`: `[x, y, width, height]`
  - `interactable`: boolean
- `capabilities`: Array of allowed actions
- `redactions`: Array of `{ type: PiiType, count: number }`
- `image`: Masked image data URL or `null`
- `history`: Prior action execution history
- `flags`: Detection flags

---

## 7. Transport Mechanism

- **Current Outbound Planner Transport:** HTTP Fetch (`POST /v1/plan`).
- **Audit Transport Abstraction:** The external audit layer operates as an independent service (or local HTTP daemon, e.g., `http://localhost:8001` or configurable via `WXT_EGRESS_AUDIT_URL`).
- **Integration Boundary:** An asynchronous, non-blocking adapter `EgressAuditAdapter` with an `observe(payload: EgressAuditPayload)` method.
- **Default State:** Disabled / dormant unless configured, preventing any unwanted network attempts if the external audit repository is not running.

---

## 8. Files That Would Need Modification

Only **one existing file** needs modification to connect the adapter:
- `extension/src/network/gate.ts`: Invoke `egressAuditAdapter.observe(...)` in `sendPlan()`.

And new dedicated adapter files:
- `extension/src/network/egress-audit/types.ts`: TypeScript contracts for the audit observation payload and adapter interface.
- `extension/src/network/egress-audit/adapter.ts`: Concrete implementation with graceful failure handling and configuration.
- `extension/src/network/egress-audit/index.ts`: Module exports.
- `tests/unit/egress-audit-adapter.test.ts`: Focused unit test suite.

---

## 9. Files That Must Remain Untouched (Non-Negotiable)

To preserve architectural integrity and comply with strict regression rules, the following files and directories will **NOT** be touched:
1. `extension/src/vision/**` (All files: `engine.ts`, `yunet.ts`, `offscreen-client.ts`, etc.)
2. `extension/src/perception/**` (DOM extraction, ARIA resolution, dirty region tracking, perception router)
3. `extension/src/privacy/indian-pii-registry.ts` (Aadhaar, PAN, Voter ID, IFSC, etc.)
4. `extension/src/privacy/detectors/**` (All Indian PII detector implementations)
5. `extension/src/privacy/semantic-pii-classifier.ts` (Semantic classification rules)
6. `extension/src/privacy.stub.ts` (Core redaction logic and canvas blackout implementation)
7. `extension/src/actions/**` (Action execution and validation)
8. `server/**` (FastAPI backend server)

---

## 10. Risks and Limitations

1. **Audit Service Unavailability:** The external Egress Audit service may not be running in all environments. The adapter must catch all connection errors and timeouts, logging a warning while allowing the agent planning request to proceed.
2. **Double Hashing Overhead:** SHA-256 is already computed for Invariant I5 in `sendPlan()`. Re-using `attested.sha256` eliminates redundant computation.
3. **Data Leakage Risk:** Under no circumstances should the adapter be passed raw perception frames or unsanitized DOM. It must only ever receive the already-attested `AttestedPayload`.
4. **Separate Repository Independence:** Because the Egress Audit repository is separate and not bundled in this workspace, the adapter will provide a clean pluggable interface conforming to standard audit observation protocols.
