# YUNET_PHASE1_AUDIT

## 1. Current Face Detector
The current face detector is **MediaPipe FaceDetector** from `@mediapipe/tasks-vision`.

## 2. Current Vision Model
The current vision model is **BlazeFace** (specifically `blaze_face_full_range.tflite`).

## 3. Current Model Runtime
The model runs on **TensorFlow Lite WebAssembly** via the MediaPipe vision tasks library. It attempts to use a WebGL/GPU delegate first, then falls back to CPU/WASM.

## 4. Current Input Resolution
The input resolution is dynamic. The full frame is downscaled to a maximum dimension of `1024x1024`. It also performs targeted candidate regional passes where small DOM elements (like avatars) are cropped and upscaled to at least `256x256` before inference.

## 5. Current Coordinate System
Bounding boxes are first generated in the local coordinate space of the resized inference canvas. They are then mapped back to the source image crop, shifted by the crop's offset (`offsetX`, `offsetY`), and finally scaled by `scaleX` and `scaleY` to convert from raw ImageBitmap pixels into Viewport CSS pixels.

## 6. Current Face Bounding-Box Representation
The representation is a normalized `FaceBox` interface (imported from `@contracts/index.js`):
```typescript
export interface FaceBox {
  bbox: [number, number, number, number]; // [x, y, width, height]
  confidence: number;
}
```

## 7. Where Bounding Boxes are Transformed
Transformations occur in `extension/src/vision/face-detection.ts` inside the `runInference` function (lines 128-151). The code maps coordinates from the inference canvas to the source crop, adds protective padding, applies offsets, and scales to CSS pixels using `scaleX` and `scaleY`.

## 8. Where Bounding Boxes Become Privacy Regions
In `extension/src/privacy.stub.ts` (lines 616-640), the `req.frame.faces` array is iterated over. Each face bounding box is directly pushed into the `detections` array as a `FACE` privacy region and also pushed into `boxesToMask` to generate blackout coordinates.

## 9. Where Masking Rectangles are Rendered
The `privacy.stub.ts` engine returns a `SanitizeResult` containing `boxesToMask` and `detections`. The extension's rendering components (like `VisualPreview` in the sidepanel/UI and potentially injected content scripts) read these normalized CSS-coordinate bounding boxes to draw blackout rectangles.

## 10. Can the Existing Implementation Support a Replacement Detector?
**Yes.** The architecture is already highly decoupled. The `visionEngine` in `engine.ts` simply calls `detectFaces(...)` which returns `FaceBox[]`. By creating a `YuNetVisionEngine` and replacing the `detectFaces` implementation with a YuNet-specific ONNX inference loop that returns `FaceBox[]`, the downstream privacy engine, perception daemon, and visual preview will continue working without modification.
