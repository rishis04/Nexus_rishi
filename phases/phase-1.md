# Phase 1: Core Submission MVP

## Objective
Establish a genuine, end-to-end working flow (Perceive -> Detect PII -> Redact locally -> Sanitize Context -> Reason remotely -> Act locally) without any stubs.

## Components Being Implemented
- PII Detection Engine (Regex + Verhoeff validation for Aadhaar and PAN).
- Canvas Visual Redaction (Drawing blackout boxes over coordinates).
- Basic FastAPI Reasoning Server.
- Extension network gateway to communicate with the server.

## Components Intentionally Postponed
- Complex ONNX/WebGPU computer vision models.
- OCR.
- Capability vaults.
- SHA-256 State Fingerprinting.

## Files to Modify
- `extension/src/privacy.stub.ts` (Convert to real implementation).
- `extension/src/network/gate.ts` (Connect to FastAPI).
- `server/app/main.py` (Create new).

## Dependencies
- `fastapi` and `uvicorn` for the server.

## Implementation Tasks
1. Implement Aadhaar Verhoeff algorithm and PAN format validation.
2. Implement Canvas 2D masking for redaction.
3. Build FastAPI endpoint `/v1/plan` to receive sanitized JSON and return structured clicks.
4. Integrate extension network layer with FastAPI.

## Testing Gates
- **Unit Tests:** Verify Aadhaar/PAN regex and checksums.
- **Integration Tests:** Verify Extension can POST to FastAPI and receive a 200 OK with action schema.
- **E2E Tests:** Playwright script testing the full loop on a local dummy page.
- **Demo Verification:** Visually confirm the network payload contains redacted text/coordinates before it hits the server.

## Acceptance Criteria
- Extension successfully identifies PII on a page.
- Network payload sent to the server contains no raw PII.
- Server successfully returns an action.
- Action executes in the browser.

## Definition of DONE
- All testing gates pass and the E2E loop runs without hardcoded stubs.

## Known Limitations
- Agent is currently blind to non-DOM elements (Canvas/SVG).
- Server relies on simple heuristics rather than a full VLM temporarily.

## Next-Phase Dependencies
- Phase 1 must be perfectly stable before introducing ONNX models in Phase 2.
