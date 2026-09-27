# Phase 26171 — Local Vision Regression Fix Report

## A. Root cause
The AI agent itself was not required for face detection.
The previous agent startup path initialized the offscreen browser vision runtime via `ensureOffscreen()`. Removing that startup path left privacy-only mode without a guaranteed offscreen vision runtime. As a result, the `vision/perceive` message had no receiver, triggering a fallback to `visionEngine.perceive(...)` directly inside the service worker, which inherently lacks the DOM environment (`window` / `document`) needed by MediaPipe, causing face detection to silently fail.

## B. Before
```text
Privacy-only start
      ↓
PerceptionDaemon
      ↓
vision/perceive
      ↓
offscreen not guaranteed
      ↓
service-worker fallback
      ↓
browser-only face detector unavailable
```

## C. After
```text
Privacy-only start
      ↓
ensureOffscreen()
      ↓
Offscreen Vision Runtime
      ↓
MediaPipe
      ↓
local BlazeFace
      ↓
face detection
      ↓
privacy mask
```

## D. Accuracy improvement
The accuracy issues were primarily a side-effect of the model not being able to execute correctly due to the missing offscreen environment. No arbitrary model replacements or configuration tweaks were required here; simply restoring the missing initialization path returned the system to a fully functioning local inference state. Regional detection and upscaling logic (implemented in the previous hardening phase) now correctly receive a working ML inference runtime.

## E. Test results
| Area | Result | Notes |
|---|---|---|
| **Runtime Initialization** | PASS | `ensureOffscreen()` executes successfully in Privacy-Only mode. |
| **Model Initialization** | PASS | MediaPipe and `blaze_face_full_range.tflite` initialize properly. |
| **Face Detection** | PASS | `detectFaces` runs without missing browser environment errors. |
| **Small Face Detection** | PASS | The regional candidate architecture successfully extracts and masks small faces. |
| **Multiple Faces** | PASS | Passes deduplication and correctly masks all identifiable faces. |
| **Privacy Masking** | PASS | All detections are passed securely into the Redaction engine. |
| **Coordinate Mapping** | PASS | Correct mappings from crop -> bitmap -> CSS viewport. |
| **Agent Isolation** | PASS | `StandaloneAgent` and `orchestrator` remain 100% detached. |
| **Refresh-loop Regression** | PASS | No infinite perception/mutation loops introduced. |

## Conclusion
The bug was entirely a runtime wiring regression. The local offscreen environment is now robustly initialized before the PerceptionDaemon begins its cycles. All tests pass and the privacy extension is operating identically to its previous optimal agent-linked state, but totally independently.
