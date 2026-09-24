import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
import type { FaceBox } from '@contracts/index.js';

// Suppress noisy OpenGL error checking warnings from MediaPipe WASM
const originalWarn = console.warn;
console.warn = function(...args) {
  if (typeof args[0] === 'string' && args[0].includes('OpenGL error checking is disabled')) {
    return;
  }
  originalWarn.apply(console, args);
};

let faceDetector: FaceDetector | null = null;
export let faceDetectorUsesGpu = false;

export async function initFaceDetector(): Promise<FaceDetector | null> {
  if (faceDetector) return faceDetector;

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  let wasmPath = '';
  let modelPath = '';

  if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
    try {
      wasmPath = chrome.runtime.getURL('mediapipe').replace(/\/+$/, '');
      modelPath = chrome.runtime.getURL('models/blaze_face_full_range.tflite');
    } catch {}
  }

  if (!wasmPath || !modelPath) {
    return null;
  }

  try {
    const vision = await FilesetResolver.forVisionTasks(wasmPath);

    const loadLocal = globalThis.fetch;
    const modelResp = await loadLocal(modelPath);
    if (!modelResp.ok) {
      console.warn('[FaceDetection] Failed to fetch model:', modelResp.status, modelPath);
      return null;
    }
    const modelBuffer = new Uint8Array(await modelResp.arrayBuffer());

    try {
      faceDetector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetBuffer: modelBuffer,
          delegate: 'GPU',
        },
        runningMode: 'IMAGE',
        minDetectionConfidence: 0.6,
        minSuppressionThreshold: 0.4,
      });
      faceDetectorUsesGpu = true;
    } catch (gpuErr) {
      console.warn('[FaceDetection] GPU delegate init failed, falling back to CPU:', gpuErr);
      faceDetector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetBuffer: modelBuffer,
          delegate: 'CPU',
        },
        runningMode: 'IMAGE',
        minDetectionConfidence: 0.6,
        minSuppressionThreshold: 0.4,
      });
      faceDetectorUsesGpu = false;
    }

    return faceDetector;
  } catch (err) {
    console.warn('[FaceDetection] Local MediaPipe init failed or unavailable in this context:', err);
    return null;
  }
}

export async function detectFaces(detector: FaceDetector, imgBitmap: ImageBitmap, scaleX: number, scaleY: number): Promise<FaceBox[]> {
  const faces: FaceBox[] = [];

  // FIX: Draw the ImageBitmap to an OffscreenCanvas with a white background.
  // This solves alpha channel pre-multiplication and black background issues
  // that cause MediaPipe's WebGPU/WASM shaders to fail on screenshots.
  const canvas = new OffscreenCanvas(imgBitmap.width, imgBitmap.height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    console.warn('[FaceDetection] Failed to get 2d context for OffscreenCanvas');
    return [];
  }

  // Fill with solid white to remove any transparency artifacts
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(imgBitmap, 0, 0);

  // We can pass ImageData directly to detector.detect
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const faceResults = detector.detect(imageData);

  faceResults.detections.forEach((det: any) => {
    if (det.boundingBox) {
      let bx = det.boundingBox.originX;
      let by = det.boundingBox.originY;
      let bw = det.boundingBox.width;
      let bh = det.boundingBox.height;

      // Workaround for MediaPipe WebAssembly sometimes returning normalized coordinates [0.0, 1.0]
      // despite typings indicating pixels. If width/height are <= 1.0, they are normalized.
      if (bw <= 1.0 && bh <= 1.0) {
        bx *= imgBitmap.width;
        by *= imgBitmap.height;
        bw *= imgBitmap.width;
        bh *= imgBitmap.height;
      }

      // BlazeFace often returns a very tight bounding box around the core facial features (eyes, nose, mouth).
      // For group photos, these small tight boxes don't cover the full face/head properly.
      // We expand the bounding box by a percentage to cover the forehead, chin, and sides.
      const paddingX = bw * 0.4; // 40% wider
      const paddingY = bh * 0.4; // 40% taller
      
      bx -= paddingX / 2;
      by -= paddingY / 2;
      bw += paddingX;
      bh += paddingY;

      faces.push({
        bbox: [
          Math.round(bx * scaleX),
          Math.round(by * scaleY),
          Math.round(bw * scaleX),
          Math.round(bh * scaleY),
        ],
        confidence: det.categories[0]?.score ?? 0.95,
      });
    }
  });

  return faces;
}
