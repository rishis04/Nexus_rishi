# System Limitations

In accordance with Phase 22 rules, this document strictly lists the honest, measured limitations of the Antigravity architecture based on empirical testing. We do not make claims beyond measured results.

## 1. OCR Dependence and Noise
Tesseract OCR running in WASM is powerful but can be noisy. Small text, unusual fonts, or low-contrast text on spatial canvases can result in garbage output. The Confidence Router handles this gracefully by prioritizing DOM when possible, but fully opaque canvas workflows (where DOM text is absent) may struggle with dense text interpretation.

## 2. Chrome Debugger API Intrusiveness
Phase 5 successfully bypassed `event.isTrusted: false` blocks by utilizing `chrome.debugger` to dispatch native hardware events. While functionally perfect, attaching the debugger displays an un-hideable warning bar at the top of the Chrome window ("Antigravity is debugging this browser"). This is a fundamental limitation of Chromium extension APIs and cannot be bypassed without a custom-compiled Chromium fork.

## 3. WebGPU Hardware Constraints
The system achieves <2.5s latency thanks to WebGPU acceleration in ONNX Runtime Web. However, devices without WebGPU support (or outdated graphics drivers) will fall back to WASM SIMD CPU processing, significantly increasing latency beyond the 2.5s benchmark target during Vision Grounding phases.

## 4. Bounding Box Shifts on Dynamic Reflow
State fingerprinting protects against stale states, but minor asynchronous layout shifts (like a lazy-loaded image shifting a button down by 50px *after* perception) can cause the Target Validator to drop the action if the visual bounds no longer align with the stored `TargetResolution`. This strict security requirement results in occasional false-positive "Stale State" errors requiring the Agent to re-perceive the screen.
