# SIH 2026 Problem Statement 26171 - Progressive Implementation Roadmap

## PART 1 — CURRENT PROJECT STATE

**What genuinely works:**
- Extension scaffolding using WXT (Manifest V3 framework).
- Basic DOM extraction and ARIA role identification.

**What partially works:**
- Action validation logic (implemented but currently over-engineered for the missing pieces).
- Synthetic DOM action execution (but suffers from `isTrusted: false` issues).

**What is mocked/stubbed:**
- Visual Perception: `vision.stub.ts` completely fakes ONNX vision, returning hardcoded bounding boxes.
- Privacy Engine: `privacy.stub.ts` fakes PII detection and performs no actual canvas masking.
- Reasoning/Planner: `network/gate.ts` uses a mock loop that blindly clicks "Sign In".

**What is missing:**
- The actual remote FastAPI VLM planner.
- Real WebGPU/WASM inference pipelines.
- Concrete visual redaction logic.
- Genuine E2E Playwright tests (currently just string-matching file content).

**What is over-engineered for the current stage:**
- Multi-tier representation ladders.
- SHA-256 DOM state fingerprinting causing death loops.
- Cryptographic capability vaults.

## PART 2 — SUBMISSION BUILD

**MUST BUILD:**
1. A genuine local Privacy Engine (Aadhaar/PAN regex + basic Verhoeff validation).
2. Canvas visual redaction (drawing blackout boxes over detected PII coordinates).
3. A basic FastAPI python backend to act as the Reasoning Planner.
4. An end-to-end flow passing sanitized context to the Planner and executing its returned action.

**SHOULD BUILD IF TIME ALLOWS:**
1. Lightweight OCR for text extraction.
2. Improved confidence routing.

**DO NOT BUILD YET:**
1. Cryptographic capability vaults (AES-GCM).
2. SHA-256 state fingerprinting (causes re-perception loops).
3. Adversarial attack simulation labs.

## PART 3 — POST-SUBMISSION ROADMAP

**Phase 1:** Core Submission MVP (Perception -> Redaction -> Planner -> Action).
**Phase 2:** Enhanced Vision (ONNX Runtime, UI component detector, real OCR).
**Phase 3:** Visual Grounding & Canvas interaction (Handling spatial data like ISRO Bhuvan).
**Phase 4:** Performance & Security (WebGPU optimization, AES-GCM vaults).
**Phase 5:** Robust E2E & Hardening (Fixing synthetic event trust, adversarial testing).

## PART 4 — DEMO EVOLUTION

- **Demo V1 → Submission:** DOM perception + Basic PII detection (Aadhaar/PAN) + Local Redaction + Basic Planner + Safe Action on a mock form.
- **Demo V2 → First major upgrade:** Adds real OCR, better PII coverage, and handles basic visual regions.
- **Demo V3 → Advanced perception:** Canvas perception, visual grounding, WebGPU/ONNX inference for UI components.
- **Demo V4 → Security + performance:** Advanced privacy firewall, AES-GCM capability vaults, latency optimization.
- **Demo V5 → Final system:** Adversarial testing, state validation, action attestation, and demonstrating on an ISRO-oriented geospatial scenario (like Bhuvan).

## PART 5 — FINAL ARCHITECTURE MAPPING

The progressive approach directly populates the existing Enterprise Architecture:
- Replacing `vision.stub.ts` fulfills the **Local Vision** specification.
- Replacing `privacy.stub.ts` fulfills the **Privacy Firewall** specification.
- Building the `server/` FastAPI app fulfills the **Remote Reasoning** specification.
Every incremental phase moves us strictly towards the final 10-stage orchestrator without attempting to build it all at once.

## PART 6 — TESTING GATES

For every phase moving forward, we will strictly enforce:

1. **Implementation:** Writing the functional code.
2. **Unit Tests:** Verifying isolated functions (e.g., PII validation algorithms).
3. **Integration Tests:** Verifying subsystem handshakes (e.g., Extension to FastAPI).
4. **E2E Test:** Running a real Playwright browser journey (no static file facades).
5. **Demo Verification:** Live visual check that the feature works interactively.
6. **DONE:** Only then do we proceed to the next component.
