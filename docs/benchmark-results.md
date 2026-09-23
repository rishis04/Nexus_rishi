# Benchmark Results

The following metrics were collected on the fully hardened Antigravity Architecture (Phase 21).

## Latency Benchmark
**Requirement:** <2.5s for perception/validation cycle.
**Actual Result:** **~504ms** (Pass ✅)

```text
stdout | benchmarks/latency.test.ts > Latency Benchmarks > should complete a validation cycle in <2.5s
Pipeline latency: 499.77ms

 ✓ Latency Benchmarks > should complete a validation cycle in <2.5s  503ms
```

## Memory Footprint Benchmark
**Requirement:** <150MB heap consumption.
**Actual Result:** **~11.35MB** (Pass ✅)

```text
stdout | benchmarks/memory.test.ts > Memory Benchmarks > should stay under 150MB baseline limit
Heap used: 11.35 MB

 ✓ benchmarks/memory.test.ts (1 test) 4ms
```

## Adversarial Defense Benchmark
**Requirement:** System rejects 100% of invalid structural actions targeting obscured elements.
**Actual Result:** **Pass ✅**

```text
 ✓ benchmarks/adversarial.test.ts (3 tests) 3ms
```
*Test suite successfully rejected clickjacking vectors involving off-screen target boundaries and unverified origins.*

---
**Conclusion**: The system satisfies all constraints specified in the SIH 26171 Master Phase Implementation Plan.
