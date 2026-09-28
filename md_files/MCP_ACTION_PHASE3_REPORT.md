# Phase 3 Report: Isolated Action Validator

## 1. Validator Architecture

The Phase 3 **Isolated Action Validator** (`ActionValidator`, implemented in [extension/src/security/action-validator.ts](file:///Users/rishis/Desktop/SIH2026_sanjay/extension/src/security/action-validator.ts)) establishes an independent, fail-closed verification barrier between incoming agent action intents and the browser runtime.

```
                    ┌────────────────────────────────────────┐
                    │      AI Agent / MCP Client Intent      │
                    └───────────────────┬────────────────────┘
                                        │ (ActionRequest)
                                        ▼
               ╔═══════════════════════════════════════════════════╗
               ║               ACTION VALIDATOR                    ║
               ║                                                   ║
               ║  1. Schema & Contract Check (Phase 2 Contract)   ║
               ║  2. Observation Existence & Freshness Binding     ║
               ║  3. Page State Hash Consistency                  ║
               ║  4. Target Identity & DOM Existence               ║
               ║  5. Geometry & Coordinate Sanity Check            ║
               ║  6. Target Visibility & Interactability          ║
               ║  7. Target-Action Policy Permission               ║
               ║  8. Secret / Capability Token Verification        ║
               ╚════════════════════════┬══════════════════════════╝
                                        │
                         ┌──────────────┴──────────────┐
                         ▼                             ▼
              [ALLOWED: false]                  [ALLOWED: true]
           Fails closed with reason          Validated Verdict ONLY
             NO EXECUTION                      (No Execution Yet)
```

Key Architectural Properties:
- **Independent & Isolated**: Does not depend on BrowserOS, MCP server, or active browser drivers. Can be tested completely offline and headlessly.
- **Pure Evaluation**: Produces a deterministic `ValidationResult` (`allowed: true` or `allowed: false` with structured error codes). It **never executes actions**.
- **No Inference/Guesswork**: Strict fail-closed policy. If anything is ambiguous, expired, or missing, the action is rejected immediately.
- **Zero Privacy Impact**: Operates downstream of perception/sanitization; reads sanitized observation metadata without altering or accessing raw perception mechanisms.

---

## 2. Validation Flow

When `actionValidator.validate(rawRequest, context)` is invoked, it proceeds through the following sequential validation pipeline:

1. **Contract & Schema Validation**:
   - Parses `rawRequest` against Phase 2 `ActionRequestSchema`.
   - Validates required fields (`request_id`, `observation_id`, `action.type`).
   - Rejects unrecognized action types, malformed parameters, and injection vectors (e.g. `javascript:`, `<script>`).
2. **Observation Context Existence**:
   - Ensures an active `ObservationContext` was provided.
   - Rejects with `INVALID_OBSERVATION` if context is `undefined`, `null`, or malformed.
3. **Observation Freshness & Identity**:
   - Checks `context.is_stale`. Rejects with `STALE_OBSERVATION` if flagged.
   - Compares `req.observation_id` against `context.observation_id`. Rejects on mismatch.
   - Checks observation age against `ttl_ms` (default 15,000ms). Rejects if TTL expired.
   - Compares `page_state_hash` if provided; permits only active or known recent state hashes. Rejects with `PAGE_STATE_MISMATCH` if page mutated.
4. **Target Existence & Ambiguity**:
   - For target-dependent actions (`click`, `type`, `focus`, `select`, `fill_secret`), ensures `target_id` is specified and non-empty.
   - Looks up `target_id` in `context.targets`. Rejects with `TARGET_NOT_FOUND` if target disappeared.
5. **Geometry & Coordinate Sanity**:
   - Validates `bbox`: width > 0, height > 0, and non-NaN numerical values. Rejects corrupted or non-renderable geometries.
6. **Target Visibility & Interactability**:
   - Verifies `visible !== false`.
   - Verifies `interactable !== false` (not disabled, not inert).
   - Rejects with `NOT_INTERACTABLE` if element is obscured or disabled.
7. **Target-to-Action Policy Check**:
   - If target specifies `allowed_actions`, verifies that requested `action.type` is explicitly in the allowed set. Rejects with `POLICY_DENIED` on violation.
8. **Credential & Capability Verification**:
   - For `fill_secret`, enforces that `capability` token is provided and non-empty.
   - Enforces that target element is flagged `is_password === true`.

---

## 3. Fail-Closed Rules

| Condition | Verdict | Error Code | Rationale |
|---|---|---|---|
| Request schema invalid | `allowed: false` | `MALFORMED_REQUEST` | Never attempt to parse or execute unstructured actions. |
| Context missing / null | `allowed: false` | `INVALID_OBSERVATION` | Cannot validate without verified environmental ground truth. |
| Observation ID mismatch | `allowed: false` | `STALE_OBSERVATION` | Agent cannot act on an outdated visual/DOM frame. |
| Observation expired (TTL) | `allowed: false` | `STALE_OBSERVATION` | Mitigates race conditions against DOM changes. |
| Page mutated (hash mismatch) | `allowed: false` | `PAGE_STATE_MISMATCH` | DOM shifted between observation and action request. |
| Missing target_id | `allowed: false` | `MISSING_TARGET` | Prevents blind clicks / wildcard interactions. |
| Target not in observation | `allowed: false` | `TARGET_NOT_FOUND` | Element disappeared or never existed. |
| Corrupted bbox ([w<=0, h<=0]) | `allowed: false` | `NOT_INTERACTABLE` | Prevents firing synthetic events into invalid coordinates. |
| Target hidden or disabled | `allowed: false` | `NOT_INTERACTABLE` | Prevents clicking hidden buttons or interacting with disabled controls. |
| Action not in target's allowed set | `allowed: false` | `POLICY_DENIED` | Prevents typing into buttons or violating element interaction policies. |
| Missing capability for secret fill | `allowed: false` | `CAPABILITY_DENIED` | Secrets cannot be filled without an approved capability token. |
| Secret fill into non-password target | `allowed: false` | `POLICY_DENIED` | Prevents exfiltration into non-credential inputs. |

---

## 4. Observation Binding

The validator binds every action strictly to an `ObservationContext`:
- **Unique Observation ID**: Guarantees the agent saw the specific DOM snapshot before issuing an action.
- **TTL Constraint**: Observations have a bounded lifetime (default 15s) to prevent acting on abandoned views.
- **State Hash Consistency**: Page hash verifies that dynamic single-page applications haven't re-rendered beneath the agent.
- **Sanitized Surface**: Uses only sanitized targets provided by perception, preserving the privacy boundary.

---

## 5. Target Binding

Every target-bound interaction binds to a `SafeTargetMetadata` record:
- **`target_id`**: Canonical reference in the active DOM snapshot.
- **`bbox`**: Bounding box geometry `[x, y, w, h]` verified for positive non-zero area.
- **`visible` / `interactable`**: Enforces physical interactability in the browser viewport.
- **`allowed_actions`**: Granular role-based capability whitelist per target.
- **`is_password`**: Special protection for sensitive credential inputs.

---

## 6. Test Results

Unit test suite executed via Vitest:

- **Isolated Action Validator Tests**: [tests/unit/isolated-action-validator.test.ts](file:///Users/rishis/Desktop/SIH2026_sanjay/tests/unit/isolated-action-validator.test.ts)
  - `valid action`: PASS
  - `valid target (typing)`: PASS
  - `stale observation (id mismatch)`: PASS
  - `stale observation (is_stale flag)`: PASS
  - `stale observation (ttl expired)`: PASS
  - `mutated page state (hash mismatch)`: PASS
  - `invalid observation (context missing)`: PASS
  - `missing target (unspecified target_id)`: PASS
  - `target disappeared (not found in context)`: PASS
  - `ambiguous target (empty string)`: PASS
  - `invalid coordinates (corrupted bbox geometry)`: PASS
  - `actions against hidden targets`: PASS
  - `actions against non-interactable/disabled targets`: PASS
  - `unauthorized target action (policy denial)`: PASS
  - `valid fill_secret with capability and password field`: PASS
  - `reject fill_secret missing capability`: PASS
  - `reject fill_secret into non-password field`: PASS
  - `fail-closed on multiple simultaneous failures`: PASS
  - `valid scroll action without target element`: PASS
- **Total Test Suites**: 19 passed (19 total)
- **Total Unit Tests**: 110 passed (110 total, 0 failed)

---

## 7. Build Result

- Command: `pnpm run build`
- Output: Extension built in 3.5s (`.output/chrome-mv3`) with exit code 0.
- All manifest bundles, chunks, WebAssembly/ONNX runtime files, and content scripts generated cleanly.

---

## 8. Privacy Regression Result

Ran existing privacy and perception test suites:
- `tests/unit/privacy.test.ts`: PASS
- `tests/unit/assemble.test.ts`: PASS
- `tests/unit/perception-daemon.test.ts`: PASS
- `tests/unit/fingerprint.test.ts`: PASS
- `benchmarks/adversarial.test.ts`: PASS

Verification:
- **FACE MASKING**: PASS (Unchanged)
- **DOM MASKING**: PASS (Unchanged)
- **PII REDACTION**: PASS (Unchanged)
- **SANITIZED OBSERVATION BOUNDARY**: PASS (Intact)
- **YU-NET / ONNX RUNTIME**: PASS (Unchanged)

---

## 9. Files Modified / Created

### New Files Created in Phase 3:
1. [extension/src/security/action-validator.ts](file:///Users/rishis/Desktop/SIH2026_sanjay/extension/src/security/action-validator.ts) — Isolated Action Validator implementation.
2. [tests/unit/isolated-action-validator.test.ts](file:///Users/rishis/Desktop/SIH2026_sanjay/tests/unit/isolated-action-validator.test.ts) — Comprehensive unit test suite (19 test cases).
3. [MCP_ACTION_PHASE3_REPORT.md](file:///Users/rishis/Desktop/SIH2026_sanjay/MCP_ACTION_PHASE3_REPORT.md) — Phase 3 validation documentation and report.

---

## 10. Privacy-Critical Files Modified

- **Privacy-critical production files modified in Phase 3**: **0**
- No changes made to:
  - YuNet / ONNX vision pipeline
  - Face detection / tracking
  - DOM perception & snapshotting
  - Privacy engine & sanitizer
  - PerceptionDaemon & PrivacyController
  - Coordinate calculations & redaction masks

---

## Conclusion & Next Phase Gate

Phase 3 is complete. The Action Validator operates in complete isolation, enforcing deterministic fail-closed guarantees on every incoming action request without executing any actions.

**Execution stopped as required.** Awaiting explicit user approval before proceeding to Phase 4 (Execution Boundary).
