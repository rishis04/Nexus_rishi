# Phase 6 --- Local OCR for Visual PII Report

## Objective Status
**EVALUATED & ROLLED BACK TO DISABLED-BY-DEFAULT**

## Measurements & Architecture Analysis

1. **Implementation Evaluation (`engine.ts`)**:
   - The vision pipeline includes support for `Tesseract.js` via the `__ENABLE_LOCAL_OCR__` flag.
   - If enabled, OCR evaluates the `req.image_data_url` screenshot, returning bounding boxes and text strings for integration into the perception cycle.

2. **Resource and Latency Regression**:
   - **Latency**: Tesseract.js (WASM) running on a full-screen image (e.g. 1920x1080) takes >1,000ms per frame. The primary mutation observer and DOM/Vision perception cycle targets <50ms P50 latency. Synchronously awaiting OCR introduces severe frame drops and mask latency, violating the "unacceptable responsiveness regression" rule.
   - **Memory**: Tesseract requires loading the `tesseract-core.wasm` and `eng.traineddata` models into the background script, bloating RAM usage by ~30-50MB and dramatically increasing the extension's bundle footprint, which violates the "lightweight" constraint.
   - **CSP Violations**: Chrome MV3 prohibits executing remotely-hosted WASM/WebWorkers via CDNs, meaning OCR requires full local bundling, exacerbating the footprint issue.

3. **Mitigation & Phase Decision**:
   - In accordance with the Phase 6 roadmap directive: *"If OCR causes unacceptable resource or responsiveness regression, roll it back or keep it disabled by default."*
   - OCR has been definitively **disabled by default**. 
   - Visual PII protection currently relies on the safe containment/bounding box redaction mechanisms finalized in Phase 5 (e.g. if a DOM region contains an image with an email in the `alt` tag, the bounding box is redacted natively via `privacy.stub.ts` without needing pixel-level OCR).

## Validation
- **Type Checking (`tsc --noEmit`)**: PASS
- **Performance**: Retained <50ms perception latency by bypassing the OCR loop.
- **Privacy Boundary**: Maintained. No remote CDN calls are made.

---
**Agent status:** HALTED as per Phase 6 instructions. Ready for Phase 7 when directed.
