# Phase 2: Enhanced Vision

## Objective
Replace DOM-only scraping with true on-device visual perception using lightweight neural networks.

## Components Being Implemented
- ONNX Runtime Web integration in an Offscreen Document.
- Lightweight UI component detector (e.g., quantized YOLO/NanoDet).
- Local OCR integration (Tesseract.js).

## Components Intentionally Postponed
- Complex visual grounding algorithms for Canvas maps.
- Face detection.
- Hardware-trusted events.

## Files to Modify
- `extension/src/vision.stub.ts` (Convert to real ONNX runner).
- `extension/entrypoints/offscreen/` (Implement WebWorker for inference).
- `extension/package.json` (Add ONNX / Tesseract deps).

## Dependencies
- `onnxruntime-web`
- `tesseract.js`

## Implementation Tasks
1. Setup Chrome Offscreen Document for heavy background processing.
2. Load quantized ONNX model and run inference on screenshot crops.
3. Integrate Tesseract.js to extract text from bounding boxes.
4. Merge visual candidate regions with DOM candidate regions.

## Testing Gates
- **Unit Tests:** Verify model tensor inputs/outputs.
- **Integration Tests:** Verify message passing from content script to offscreen document under 200ms.
- **E2E Tests:** Agent correctly identifies and clicks a button drawn only on a canvas (no DOM equivalent).
- **Demo Verification:** Show DevTools console output of UI elements detected purely visually.

## Acceptance Criteria
- Agent can extract text from images.
- Agent can identify UI elements without DOM hints.

## Definition of DONE
- ONNX and Tesseract run successfully without crashing the browser or exceeding memory limits.

## Known Limitations
- Cannot accurately map complex spatial relations on large interactive canvases.

## Next-Phase Dependencies
- Phase 2 vision outputs must be reliable to feed into Phase 3 spatial grounding.
