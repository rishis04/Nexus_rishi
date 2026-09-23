# Benchmark Methodology

As part of the SIH 26171 evaluation harness, we evaluate the system across three core dimensions: Latency, Memory Footprint, and Adversarial Defense.

## 1. Latency Measurement
**Target:** `<2.5s` for a complete perception/validation loop.

**Methodology:**
- Measured programmatically using `vitest` in the `/benchmarks/latency.test.ts` suite.
- Simulates an end-to-end execution pipeline including fingerprinting, bounds checking, and action firewall validation.
- We capture the `performance.now()` delta before and after `validateAction()` completes to reflect true background processing overhead.

## 2. Memory Footprint
**Target:** `<150MB` heap usage.

**Methodology:**
- Assessed using `process.memoryUsage().heapUsed` in `/benchmarks/memory.test.ts`.
- Measures the overhead of loading ONNX WebGPU tensors and Tesseract instances.
- Verifies that garbage collection thresholds remain within reasonable constraints for a background browser extension.

## 3. Adversarial Defense Validation
**Target:** 100% rejection of malicious structural actions.

**Methodology:**
- Executed via `/benchmarks/adversarial.test.ts`.
- Uses a `TargetValidator` test harness to simulate actions targeting elements that are explicitly obscured, positioned off-screen (e.g., `x: -999`), or layered underneath transparent overlays.
- Ensures the system securely fails closed, dropping execution if coordinates fail spatial grounding sanity checks.
