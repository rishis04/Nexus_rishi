# Phase 3: Spatial & Advanced Interfaces

## Objective
Support ISRO-like spatial web applications (Bhuvan/Leaflet) through visual grounding and WebGPU acceleration.

## Components Being Implemented
- Face detection integration.
- Visual grounding algorithms (IoU bounding box logic).
- WebGPU backend for ONNX Runtime.

## Components Intentionally Postponed
- AES-GCM vaults.
- Complex adversarial testing.

## Files to Modify
- `extension/src/vision/grounding.ts`
- `extension/src/vision/face-detection.ts`
- `extension/entrypoints/offscreen/`

## Dependencies
- Potentially `@mediapipe/tasks-vision` for face detection.

## Implementation Tasks
1. Enable WebGPU execution provider in ONNX Runtime Web.
2. Implement Intersection over Union (IoU) spatial fusion to correlate text, DOM, and visual bounding boxes.
3. Integrate face detection and wire it to the Privacy Engine for visual redaction.

## Testing Gates
- **Unit Tests:** Verify IoU calculations and coordinate mapping.
- **Integration Tests:** Verify face detection triggers privacy masking correctly.
- **E2E Tests:** Agent navigates a Leaflet/OpenLayers map widget safely.
- **Demo Verification:** Visually demonstrate faces being blurred on-device.

## Acceptance Criteria
- Agent understands spatial layout of complex canvases.
- Faces are successfully detected and blurred.
- Inference latency drops due to WebGPU acceleration.

## Definition of DONE
- WebGPU inference is stable and visual grounding prevents duplicated interactive regions.

## Known Limitations
- Vulnerable to `isTrusted: false` event rejection by high-security sites.

## Next-Phase Dependencies
- Stable high-performance vision is required before implementing the final security hardening in Phase 4/5.
