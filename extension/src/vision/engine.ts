import * as ort from 'onnxruntime-web/webgpu';
import Tesseract from 'tesseract.js';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
import type {
  Budget,
  FaceBox,
  OcrToken,
  PerceptionRegion,
  VisionRequest,
  VisionResult,
} from '@contracts/index.js';

// Pre-configure WebGPU execution flags for Phase 3
ort.env.wasm.numThreads = 4;
ort.env.wasm.simd = true;


let faceDetector: FaceDetector | null = null;
/** True when the singleton was successfully created with the GPU delegate. */
let faceDetectorUsesGpu = false;

async function initFaceDetector(): Promise<FaceDetector | null> {
  if (faceDetector) return faceDetector;

  // In MV3 Service Worker (where window is undefined), dynamic importScripts() and WebGPU
  // are blocked by Chrome. Heavy vision / MediaPipe tasks must run in the Offscreen Document.
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  let wasmPath = '';
  let modelPath = '';

  if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
    try {
      // FilesetResolver appends subpaths with slash, so avoid trailing slash to prevent double slash (//)
      wasmPath = chrome.runtime.getURL('mediapipe').replace(/\/+$/, '');
      modelPath = chrome.runtime.getURL('models/blaze_face_short_range.tflite');
    } catch {}
  }

  // Never use remote CDN URLs in extension context to strictly respect CSP and Invariant I5
  if (!wasmPath || !modelPath) {
    return null;
  }

  try {
    const vision = await FilesetResolver.forVisionTasks(wasmPath);

    // ROOT CAUSE FIX: MediaPipe's WASM module cannot fetch chrome-extension:// URLs
    // via its internal Emscripten VFS/XHR. Passing modelAssetPath causes setGraph()
    // to crash inside the WASM with an abort ($func3507 → $Gf) because the buffer
    // is null/empty. The fix: pre-fetch the .tflite bytes from JS context (which CAN
    // read chrome-extension:// URLs), then hand the raw Uint8Array to MediaPipe via
    // modelAssetBuffer. MediaPipe will use the buffer directly, bypassing WASM fetch.
    const modelResp = await fetch(modelPath);
    if (!modelResp.ok) {
      console.warn('[VisionEngine] Failed to fetch model:', modelResp.status, modelPath);
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
        // Lowered from default 0.5 → 0.35 to capture small, partial, and
        // angled faces in browser screenshots without flooding with noise.
        // NMS at 0.4 suppresses duplicate boxes on multi-face scenes.
        minDetectionConfidence: 0.35,
        minSuppressionThreshold: 0.4,
      });
      faceDetectorUsesGpu = true;
    } catch (gpuErr) {
      console.warn('[VisionEngine] GPU delegate init failed, falling back to CPU:', gpuErr);
      faceDetector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetBuffer: modelBuffer,
          delegate: 'CPU',
        },
        runningMode: 'IMAGE',
        minDetectionConfidence: 0.35,
        minSuppressionThreshold: 0.4,
      });
      faceDetectorUsesGpu = false;
    }

    return faceDetector;
  } catch (err) {
    console.warn('[VisionEngine] Local MediaPipe init failed or unavailable in this context:', err);
    return null;
  }
}

export const visionEngine = {
  getBudget(): Budget {
    return {
      level: 'HIGH',
      backend: 'webgpu', // Upgraded to WebGPU
      max_vision_regions: 8,
      max_pixels: 1024 * 1024,
      allow_detector: true,
      ocr_mode: 'fast',
    };
  },

  async perceive(req: VisionRequest): Promise<VisionResult> {
    const regions: PerceptionRegion[] = [];
    const ocr_tokens: OcrToken[] = [];
    const faces: FaceBox[] = [];
    let webgpuUsed = false;
    const t0 = performance.now();
    let inferenceMs = 0;
    let ocrMs = 0;

    // Phase 3: Hardware-Accelerated Face & UI Detection via ONNX WebGPU / MediaPipe
    if (req.image_data_url) {
      try {
        // 1. Try local MediaPipe Face Detection
        try {
          const detector = await initFaceDetector();
          if (detector) {
            // Decode image without network requests (Invariant I5)
            const base64Data = (req.image_data_url || '').split(',')[1] || '';
            if (base64Data && typeof atob !== 'undefined') {
              const binaryStr = atob(base64Data);
              const bytes = new Uint8Array(binaryStr.length);
              for (let i = 0; i < binaryStr.length; i++) {
                bytes[i] = binaryStr.charCodeAt(i);
              }

              // Detect MIME type from the data-URL prefix; default to png for screenshots.
              // This prevents corrupt decoding of PNG screenshots that were previously forced
              // into an image/jpeg Blob.
              const mimeMatch = req.image_data_url.match(/^data:([^;,]+)/);
              const mimeType = (mimeMatch?.[1] || 'image/png') as string;
              const blob = new Blob([bytes], { type: mimeType });

              if (typeof createImageBitmap !== 'undefined') {
                const imgBitmap = await createImageBitmap(blob);
                const bitmapW = imgBitmap.width;
                const bitmapH = imgBitmap.height;

                // DPR-aware coordinate normalisation:
                // MediaPipe returns bounding-box coords in the bitmap's native (physical)
                // pixel space. The rest of the privacy pipeline works in CSS pixels.
                // CaptureMeta.dpr bridges the two; we compute a per-axis scale factor.
                const dpr = req.capture?.dpr ?? 1;
                const viewportW = req.capture?.viewport?.w ?? bitmapW / dpr;
                const viewportH = req.capture?.viewport?.h ?? bitmapH / dpr;
                const scaleX = viewportW / bitmapW;
                const scaleY = viewportH / bitmapH;

                const tInfer0 = performance.now();
                const faceResults = detector.detect(imgBitmap as any);
                inferenceMs = performance.now() - tInfer0;

                // Always release the ImageBitmap after inference to prevent GPU/RAM leak
                // on every perception cycle.
                imgBitmap.close();

                faceResults.detections.forEach((det: any) => {
                  if (det.boundingBox) {
                    // Map from physical bitmap coordinates → CSS viewport coordinates.
                    // Without this step the bounding boxes are DPR× too large and
                    // positioned incorrectly on high-DPI screens.
                    faces.push({
                      bbox: [
                        Math.round(det.boundingBox.originX * scaleX),
                        Math.round(det.boundingBox.originY * scaleY),
                        Math.round(det.boundingBox.width   * scaleX),
                        Math.round(det.boundingBox.height  * scaleY),
                      ],
                      confidence: det.categories[0]?.score ?? 0.95,
                    });
                  }
                });

                // Reflect actual backend used by the singleton delegate.
                webgpuUsed = faceDetectorUsesGpu;
              }
            }
          }
        } catch (e) {
          console.warn('[VisionEngine] MediaPipe face detection failed or unavailable:', e);
        }

        // NOTE: The DOM-element fallback that previously pushed every <img> element
        // into the faces array has been intentionally removed. That code caused
        // aggressive false-positive redaction (profile icons, logos, decorative images)
        // and violated the surgical-precision requirement described in SANITIZATION_MAP.md.
        // Face redaction now relies exclusively on the MediaPipe model's output.

      } catch (e) {
        console.warn('[VisionEngine] Vision inference failed, falling back...', e);
      }
      
      // Phase 2/3: OCR Integration for precise micro-bounding boxes
      // Note: In Chrome Extension MV3, Tesseract remote CDN workers violate extension CSP.
      // We safely bypass remote CDN loading unless explicitly configured with local worker paths.
      if (typeof Worker !== 'undefined' && (globalThis as any).__ENABLE_LOCAL_OCR__) {
        try {
          const tOcr0 = performance.now();
          const result = await Tesseract.recognize(req.image_data_url, 'eng', {
            logger: () => {} // Mute logger
          });
          ocrMs = performance.now() - tOcr0;
          
          (result.data as any)?.words?.forEach((word: any, index: number) => {
            const bbox: [number, number, number, number] = [word.bbox.x0, word.bbox.y0, word.bbox.x1 - word.bbox.x0, word.bbox.y1 - word.bbox.y0];
            ocr_tokens.push({
              text: word.text,
              bbox: bbox,
              confidence: word.confidence / 100,
              line_id: word.line?.id || index
            });
            
            regions.push({
              region_id: `ocr_reg_${index}`,
              local_key: `ocr_${index}`,
              dom_ref: null,
              source: ['OCR', 'VISION'],
              semantic_type: 'text',
              text: word.text,
              bbox: bbox,
              confidence: word.confidence / 100,
              visible: true,
              interactable: false,
              visual_state: ['visible', 'enabled'],
              route: 'LOW',
              sensitivity: 'none',
              origin: req.dom.url_origin,
              frame_id: 'main',
              page_state_hash: req.dom.page_state_hash,
              timestamp: Date.now(),
            });
          });
        } catch (e) {
          console.warn("Tesseract OCR skipped in this context:", e);
        }
      }
    }

    const totalMs = performance.now() - t0;

    return {
      cycle_id: req.cycle_id,
      capture_id: req.capture?.capture_id || `cap_${Date.now()}`,
      regions,
      ocr_tokens,
      faces,
      unresolved: [],
      stats: {
        backend: webgpuUsed ? 'webgpu' : 'wasm',
        models: [{ name: 'vision-engine-v3', version: '0.3.1' }],
        vision_calls: 1,
        ocr_calls: ocrMs > 0 ? 1 : 0,
        pixels_processed: req.capture?.image
          ? req.capture.image.w * req.capture.image.h
          : 1024 * 768,
        cache_hits: 0,
        cache_misses: 1,
        escalated: [],
        timings_ms: {
          total:     Math.round(totalMs    * 10) / 10,
          inference: inferenceMs > 0 ? Math.round(inferenceMs * 10) / 10 : undefined,
          ocr:       ocrMs       > 0 ? Math.round(ocrMs       * 10) / 10 : undefined,
        },
      },
    };
  },

  release(_captureId: string): void {
    // Release capture buffers
  },
};

export const visionStub = visionEngine;
