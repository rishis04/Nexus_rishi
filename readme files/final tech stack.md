# SIH 2026 — PS 26171
# FINAL TECHNOLOGY STACK & IMPLEMENTATION MAPPING

**Problem Statement:** 26171 — On-device Visual Perception for Light-weight Browser Agents  
**Organization:** ISRO  
**Document Type:** Implementation-ready technology stack  
**Status:** FINAL / LOCKED

---

## 1. Purpose

This document maps every major technology in the PS 26171 solution to **where it runs, what implements it, its responsibility, and its implementation priority**.

```text
TypeScript → WXT → Manifest V3
        ↓
Content Script + Thin Service Worker
        ↓
Offscreen Document
        ↓
DOM/ARIA-first perception
        ↓
Selective local visual perception
        ↓
ONNX Runtime Web → WebGPU → WebGL → WASM
        ↓
Perception Fusion / Visual Grounding
        ↓
PII + Secret Fusion
        ↓
Minimum Necessary Disclosure
        ↓
Local Redaction
        ↓
Privacy Egress Firewall
        ↓
Sanitized HTTPS
        ↓
FastAPI → Context Processor → Server VLM → Agent Planner
        ↓
Structured Action
        ↓
Origin / Frame / State validation
        ↓
Local Action Validator
        ↓
Browser Executor
```

---

# 2. Technology Stack — Quick Map

| Layer | Technology | Implemented In | Main Responsibility |
|---|---|---|---|
| Language | TypeScript | Entire extension | Core browser implementation |
| Extension framework | WXT | `extension/` | Build, configuration, entrypoints |
| Browser standard | Manifest V3 | WXT manifest config | Extension runtime/security |
| UI | React | `extension/src/ui/` | Side Panel and dashboards |
| Build | Vite/WXT | Extension build | Bundling/development |
| Page integration | Content Script | `extension/src/content/` | DOM/ARIA/page perception |
| Background runtime | MV3 Service Worker | `extension/src/background/` | Coordination and browser APIs |
| Local AI runtime | ONNX Runtime Web | `extension/src/offscreen/` | On-device inference |
| Primary acceleration | WebGPU | `vision/runtime/` | GPU inference |
| GPU fallback | WebGL | `vision/runtime/` | Secondary acceleration |
| CPU fallback | WASM | `vision/runtime/` | Portable local inference |
| Local models | Quantized ONNX | `vision/models/` | Lightweight visual perception |
| OCR | Local OCR | `perception/ocr/` | Visual text extraction |
| UI detection | Lightweight CV | `perception/ui-detection/` | Visual controls/regions |
| Face detection | Lightweight CV | `perception/face/` | Local face detection |
| DOM perception | Browser DOM APIs | `perception/dom/` | Structured page understanding |
| Accessibility | ARIA/accessibility signals | `perception/accessibility/` | Semantic understanding |
| Router | Deterministic TypeScript | `perception/router/` | HIGH/MEDIUM/LOW routing |
| Visual grounding | TS + local vision | `perception/grounding/` | DOM ↔ visual matching |
| PII detection | Rules + regex + OCR + ML | `privacy/pii/` | Local sensitive-data detection |
| PII fusion | Deterministic fusion | `privacy/fusion/` | Combine privacy signals |
| Task relevance | Policy engine | `privacy/relevance/` | Minimum useful disclosure |
| Secret isolation | Local capability system | `privacy/secrets/` | Use secrets without server exposure |
| Redaction | Canvas/OffscreenCanvas | `privacy/redaction/` | Visual/semantic masking |
| Privacy verifier | TypeScript | `privacy/verifier/` | Final egress decision |
| Network | HTTPS + JSON | `network/` ↔ FastAPI | Sanitized communication |
| Backend | Python | `server/` | Server orchestration |
| API | FastAPI | `server/app/api/` | Browser/server API |
| Context processor | Python | `server/app/context/` | Sanitize/normalize context |
| Server reasoning | VLM | `server/app/vlm/` | Reason over sanitized context |
| Planner | Python | `server/app/planner/` | Generate constrained actions |
| Action protocol | JSON Schema / typed models | `actions/schema/` + server schemas | Constrain server output |
| Action validation | TypeScript | `actions/validator/` | Local security validation |
| Executor | Browser APIs | `actions/executor/` | Execute validated actions |
| State security | State fingerprint | `browser/state/` | Prevent stale actions |
| Origin security | Origin/frame checks | `actions/validator/` | Prevent cross-origin targeting |
| Storage | IndexedDB | `storage/` | Local state/telemetry |
| Model storage | OPFS | `vision/runtime/` | Local model cache |
| Crypto | Web Crypto API | `security/` | Local cryptographic operations |
| E2E testing | Playwright | `tests/` | Browser integration tests |
| Runtime metrics | Browser Performance API | `benchmarks/` | Latency/resource measurement |
| Profiling | Chrome DevTools | Development | Network/CPU/GPU/memory analysis |
| Benchmark analysis | Python | `benchmarks/scripts/` | Metrics and reports |
| Test environment | Custom test site | `test-site/` | Reproducible SIH scenarios |
| Documentation | Markdown | `docs/` | Architecture/API/privacy/benchmark docs |

---

# 3. Browser Extension Foundation

## TypeScript

**Where:** entire `extension/src/` codebase.

**Implements:** perception, routing, privacy, redaction, messaging, action validation, state checks, browser execution and telemetry.

## WXT

**Where:** `extension/`, `wxt.config.ts`, entrypoints.

**Implements:** Manifest V3 packaging, extension entrypoints, development and build pipeline.

## Manifest V3

**Where:** WXT configuration.

**Implements:** permissions, Content Script, Service Worker, Side Panel and Offscreen Document.

---

# 4. Browser Runtime Mapping

## Content Script

**Technology:** TypeScript + DOM APIs + ARIA + observers.

**Where:** `extension/src/content/`

**Does:** DOM extraction, semantic/ARIA extraction, geometry, visibility/interactability, page-change detection, candidate discovery.

**Does not:** run heavy ML or send raw page data directly to the server.

## MV3 Service Worker

**Where:** `extension/src/background/`

**Does:** lifecycle, message routing, browser API coordination, screenshot orchestration and lightweight session state.

> Service Worker = coordinator, not ML engine.

## Offscreen Document

**Where:** `extension/src/offscreen/`

**Does:** ONNX inference, OCR, visual detection, face detection, image preprocessing, visual grounding and Canvas/OffscreenCanvas redaction.

---

# 5. Local AI / Vision Stack

## ONNX Runtime Web

**Where:** `extension/src/vision/onnx/` and `extension/src/vision/runtime/`.

**Does:** load and execute quantized browser-compatible ONNX models.

## Execution backend

```text
WebGPU  → preferred
WebGL   → GPU fallback
WASM    → CPU fallback
```

The system must remain functional without WebGPU.

## Local model strategy

Prefer lightweight, quantized, browser-compatible open models where licensing permits. Local models should perform targeted perception rather than become a full local browser agent.

Responsibilities:

```text
UI region detection
Visual control detection
Visual state detection
Spatial grounding
```

---

# 6. Perception Stack

## DOM Analyzer

**Where:** `extension/src/perception/dom/`

**Technology:** DOM/CSS geometry APIs, MutationObserver, ResizeObserver, IntersectionObserver.

**Output:** element identity, role, text, bbox, visibility, interactability, frame and page-state information.

## Accessibility Analyzer

**Where:** `extension/src/perception/accessibility/`

**Technology:** ARIA and DOM semantics.

**Purpose:** cheap semantic understanding before visual inference.

## Confidence Router

**Where:** `extension/src/perception/router/`

**Technology:** deterministic TypeScript; no local SLM/LLM required.

```text
HIGH   → DOM / ARIA
MEDIUM → targeted region inspection
LOW    → local vision
```

## OCR

**Where:** `extension/src/perception/ocr/`.

**Purpose:** canvas/image text, visual-only controls, visual grounding and PII detection.

OCR should be invoked selectively.

## UI Detection

**Where:** `extension/src/perception/ui-detection/`.

**Purpose:** detect visual buttons, dialogs, cards, custom controls, canvas controls and other unexplained UI.

## Face Detection

**Where:** `extension/src/perception/face/`.

**Purpose:** detect faces locally before any visual data can leave the browser.

---

# 7. Visual Grounding

**Where:** `extension/src/perception/grounding/`.

**Technology:** TypeScript + DOM geometry + local vision + OCR + deterministic matching.

**Purpose:** connect what the browser knows with what the screen visually contains.

Outputs should include:

```text
region_id
bbox
semantic_type
text
confidence
DOM relationship
visual state
origin
frame_id
page_state_hash
```

---

# 8. Perception Contract

**Where:** `extension/src/perception/contract/`.

All perception sources converge into a common representation:

```json
{
  "region_id": "r27",
  "source": ["DOM", "VISION", "OCR"],
  "semantic_type": "button",
  "text": "Submit",
  "bbox": [500, 700, 120, 45],
  "confidence": 0.95,
  "visible": true,
  "interactable": true,
  "sensitivity": "none",
  "origin": "https://example.com",
  "frame_id": "main",
  "page_state_hash": "state_123",
  "timestamp": 123456
}
```

This lets DOM, ARIA, OCR and vision speak the same internal language.

---

# 9. Privacy Stack

The privacy pipeline is entirely local until the payload has passed verification.

```text
DOM PII + OCR PII + Visual PII + Secrets
                ↓
            PII Fusion
                ↓
       Minimum Disclosure
                ↓
             Redaction
                ↓
      Privacy Egress Firewall
                ↓
           SAFE / BLOCK
```

## PII detection

**Where:** `extension/src/privacy/pii/`.

**Technology:** deterministic rules, regex, DOM semantics, OCR and local ML.

Possible classes:

```text
EMAIL, PHONE, PERSON, ADDRESS, CARD,
PASSWORD, AUTH TOKEN, FACE, IDENTIFIER
```

## PII Fusion

**Where:** `extension/src/privacy/fusion/`.

Combines DOM, OCR, visual, input-field and known-secret signals.

## Task relevance / minimum disclosure

**Where:** `extension/src/privacy/relevance/`.

Task relevance can reduce unnecessary disclosure, but cannot override mandatory privacy protection.

Examples:

```text
actual email     → <EMAIL>
actual phone     → <PHONE>
actual person    → <PERSON>
actual password  → <PASSWORD> + local capability
```

## Local Secret Capability

**Where:** `extension/src/privacy/secrets/`.

The server requests a capability reference; the real secret stays local and is resolved only after local policy/origin/target checks.

## Redaction

**Where:** `extension/src/privacy/redaction/`.

**Technology:** Canvas, OffscreenCanvas, image masking and semantic obfuscation.

## Privacy Egress Firewall

**Where:** `extension/src/privacy/verifier/`.

Checks the exact outbound payload for raw PII, secrets, faces, unsafe OCR, raw DOM, unredacted visual data and sensitive metadata.

```text
SAFE   → send
UNSAFE → block
UNKNOWN → block
```

---

# 10. Backend Stack

## Python

**Where:** `server/`.

Used for API, context processing, VLM integration, planning, schema validation and server-side benchmark support.

## FastAPI

**Where:** `server/app/main.py`, `server/app/api/`.

Receives sanitized context, validates requests, invokes context processing/VLM/planner and returns structured actions.

## Context Processor

**Where:** `server/app/context/`.

Converts sanitized browser context into compact reasoning context. It must not reconstruct removed secrets.

## Server VLM

**Where:** `server/app/vlm/`.

Replaceable server-side VLM. It may be cloud or open-weight during SIH, but receives sanitized context only.

## Agent Planner

**Where:** `server/app/planner/`.

Converts reasoning into constrained actions; it cannot directly execute browser code.

---

# 11. Action / Security Stack

## Structured Action Protocol

**Where:** `extension/src/actions/schema/` and `server/app/schemas/`.

Allowed examples:

```text
click
scroll
focus
select
type
keypress
```

## Local Action Validator

**Where:** `extension/src/actions/validator/`.

Checks:

```text
schema
+ target
+ origin
+ frame
+ state fingerprint
+ action policy
```

Invalid actions are blocked.

## Origin / Frame Security

Each action carries origin and frame information. Current browser context must match before execution.

## Browser State Fingerprint

**Where:** `extension/src/browser/state/`.

Binds the action to the page state that was perceived.

```text
Perceive → fingerprint → server reasoning → action
        → re-check fingerprint
             ↓
          same? → execute
          changed? → block + re-perceive
```

## Browser Executor

**Where:** `extension/src/actions/executor/`.

Executes only validated browser actions. Arbitrary server-side JavaScript is not allowed.

---

# 12. Storage / Security

## IndexedDB

**Where:** `extension/src/storage/`.

Used for local settings, telemetry, benchmark data and session state.

## OPFS

**Where:** `extension/src/vision/runtime/`.

Used for local model files and large inference assets.

## Web Crypto API

**Where:** `extension/src/security/`.

Used for local cryptographic operations where required for capability/state/security mechanisms.

---

# 13. UI Stack

## React

**Where:** `extension/src/ui/`.

UI only:

```text
Side Panel
Privacy Dashboard
Benchmark Dashboard
Debug UI
```

The core perception/security pipeline remains TypeScript logic independent of React.

### Side Panel should expose

```text
Task
Perception route
DOM confidence
Vision invocation
Detected PII
Redaction status
Network status
Action status
```

---

# 14. Testing / Benchmark Stack

## Playwright

**Where:** `tests/`.

Used for browser integration, end-to-end tasks, action execution, iframe, Shadow DOM and dynamic-page scenarios.

## Browser Performance API

Used for high-resolution timing of capture, preprocessing, inference, OCR, grounding, redaction and end-to-end latency.

## Chrome DevTools

Used for network, CPU, GPU, memory and extension profiling. The SIH demo should show sanitized network payloads rather than raw sensitive values.

## Python Benchmarking

**Where:** `benchmarks/scripts/`.

Used for precision, recall, IoU, latency, P95, resource comparisons and report generation.

## Test Site

**Where:** `test-site/`.

Scenarios should include normal/custom/canvas/tiny/low-contrast/modal/scrolling/dynamic/disagreement/Shadow DOM/iframe/visual PII/prompt-injection cases.

---

# 15. Benchmark Mapping

Compare:

```text
BASELINE
Continuous/broad visual processing

VS

PROPOSED
DOM/ARIA-first + selective targeted vision
```

Measure:

### Accuracy

```text
Precision
Recall
IoU
Center error
DOM↔Vision grounding
```

### Efficiency

```text
Average latency
Median latency
P95 latency
Vision invocations
Pixels processed
OCR invocations
Local inference time
Memory
CPU time
```

### Privacy

```text
PII precision
PII recall
Redaction precision
Raw pixel egress
Unsafe payload blocks
```

---

# 16. Recommended Repository Structure

```text
project/
├── extension/
│   ├── entrypoints/
│   ├── src/
│   │   ├── content/
│   │   ├── background/
│   │   ├── offscreen/
│   │   ├── perception/
│   │   │   ├── dom/
│   │   │   ├── accessibility/
│   │   │   ├── router/
│   │   │   ├── ocr/
│   │   │   ├── face/
│   │   │   ├── ui-detection/
│   │   │   ├── grounding/
│   │   │   └── contract/
│   │   ├── vision/
│   │   │   ├── models/
│   │   │   ├── onnx/
│   │   │   └── runtime/
│   │   ├── privacy/
│   │   │   ├── pii/
│   │   │   ├── fusion/
│   │   │   ├── relevance/
│   │   │   ├── secrets/
│   │   │   ├── redaction/
│   │   │   └── verifier/
│   │   ├── actions/
│   │   │   ├── schema/
│   │   │   ├── validator/
│   │   │   └── executor/
│   │   ├── browser/state/
│   │   ├── network/
│   │   ├── storage/
│   │   ├── security/
│   │   └── ui/
│   └── tests/
├── server/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── context/
│   │   ├── vlm/
│   │   ├── planner/
│   │   └── schemas/
│   └── tests/
├── test-site/
├── benchmarks/
│   ├── datasets/
│   ├── scripts/
│   └── reports/
├── docs/
│   ├── architecture.md
│   ├── tech-stack.md
│   ├── privacy.md
│   ├── api.md
│   └── benchmark.md
├── docker-compose.yml
├── README.md
└── LICENSE
```

---

# 17. MVP — MUST BUILD

```text
✓ TypeScript
✓ WXT
✓ Manifest V3
✓ Content Script
✓ Thin Service Worker
✓ Offscreen Document
✓ Screenshot capture
✓ DOM extraction
✓ Accessibility signals
✓ DOM/ARIA-first router
✓ Local visual perception
✓ ONNX Runtime Web
✓ WebGPU or WASM fallback
✓ Local PII detection
✓ Local redaction
✓ Privacy verifier
✓ Sanitized server communication
✓ FastAPI
✓ Server VLM
✓ Structured JSON action
✓ Local action validation
✓ Browser action execution
✓ Benchmark measurements
```

# 18. Strongly Recommended

```text
✓ OCR
✓ Face detection
✓ Visual grounding
✓ Perception Contract
✓ PII Fusion
✓ Task relevance
✓ Minimum necessary disclosure
✓ Local secret capability
✓ State fingerprint
✓ Origin/frame validation
✓ Dirty-region tracking
✓ Perception cache
✓ WebGL fallback
✓ Privacy dashboard
✓ Network privacy demonstration
```

# 19. Advanced / If Time Allows

```text
○ More sophisticated visual UI detector
○ Advanced PII classifier
○ Streaming VLM response
○ Offline open-weight server VLM
○ Cross-browser polish
○ Advanced action planning
○ Larger benchmark suite
○ Privacy attack lab
○ Advanced prompt-injection defenses
```

---

# 20. 36-Hour SIH Priority Order

## Priority 1 — Browser Foundation

```text
TypeScript
WXT
Manifest V3
Content Script
Service Worker
Offscreen Document
DOM/ARIA
Screenshot capture
```

## Priority 2 — Local Vision

```text
ONNX Runtime Web
WebGPU
WASM fallback
Lightweight visual model
OCR
Visual grounding
```

## Priority 3 — Privacy

```text
PII rules
Regex
OCR PII
Face detection
PII Fusion
Redaction
Privacy verifier
```

## Priority 4 — Agent

```text
FastAPI
Context Processor
Server VLM
Structured JSON
Action Planner
Local Action Validator
Browser Executor
```

## Priority 5 — Security Hardening

```text
Minimum disclosure
Secret capability
Origin/frame validation
State fingerprint
Instruction/data separation
```

## Priority 6 — Evidence / Presentation

```text
Benchmark dashboard
Privacy dashboard
Test site
Playwright
DevTools network proof
Benchmark reports
```

---

# 21. Team Responsibility Mapping

| Team Member | Primary Technologies / Modules |
|---|---|
| Member 1 — Browser | WXT, MV3, Content Script, Service Worker, Offscreen lifecycle, screenshot, DOM/ARIA |
| Member 2 — Local AI | ONNX Runtime Web, WebGPU, WebGL, WASM, OCR, UI detection, face detection, visual grounding |
| Member 3 — Privacy | PII rules, regex, PII Fusion, task relevance, minimum disclosure, secret capability, redaction, verifier |
| Member 4 — Backend/Agent | FastAPI, Context Processor, VLM, Planner, action schema/policy |
| Member 5 — Testing/UI/Demo | Side Panel, test site, Playwright, benchmarking, DevTools, SIH demo |

---

# 22. Technologies Explicitly NOT Required for Core Architecture

Do not introduce these unless implementation evidence shows a clear need:

```text
✗ Local SLM for routing
✗ RAG
✗ Vector database
✗ Blockchain
✗ Kubernetes
✗ Multi-agent architecture
✗ Full local VLM
✗ Arbitrary server-side JavaScript execution
✗ Heavy learned routing model
✗ Large custom model training from scratch
```

The architecture is intentionally lightweight because PS 26171 emphasizes browser-local resource constraints.

---

# 23. Final Locked Technology Flow

```text
TypeScript
    ↓
WXT
    ↓
Manifest V3
    ↓
Content Script + Thin Service Worker
    ↓
Offscreen Document
    ↓
DOM/ARIA-first perception
    ↓
Selective local vision
    ↓
ONNX Runtime Web
    ↓
WebGPU primary
    ↓
WebGL fallback
    ↓
WASM fallback
    ↓
OCR + UI detection + face detection
    ↓
Visual Grounding
    ↓
Perception Contract / Fusion
    ↓
PII Fusion
    ↓
Minimum Necessary Disclosure
    ↓
Semantic / Visual Redaction
    ↓
Privacy Egress Firewall
    ↓
Sanitized HTTPS
    ↓
FastAPI
    ↓
Context Processor
    ↓
Server VLM
    ↓
Agent Planner
    ↓
Structured JSON action
    ↓
Origin + Frame + State validation
    ↓
Local Action Validator
    ↓
Browser Executor
```

---

# 24. Final Engineering Rule

The technology stack must serve the architecture rather than become the architecture.

```text
DOM / ARIA
    ↓
cheap structured understanding

Local Vision
    ↓
only when structured understanding is insufficient

Privacy Layer
    ↓
always local

Server VLM
    ↓
reasoning over sanitized context

Action Validator
    ↓
local security boundary

Browser
    ↓
final execution authority
```

> **The browser remains the trusted execution and privacy boundary; local vision supplies missing visual understanding, the server supplies reasoning, and every server-derived action is constrained and revalidated locally before execution.**