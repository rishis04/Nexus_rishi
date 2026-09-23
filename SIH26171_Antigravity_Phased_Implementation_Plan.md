# SIH 26171 — Antigravity Phased Implementation Plan

## Purpose

This document converts the locked PS 26171 architecture into an implementation sequence for Antigravity.

The project must be built **incrementally and vertically**. Antigravity must complete one phase, test it against that phase's acceptance criteria, fix every discovered issue, and only then begin the next phase.

The architecture in the master specification is **locked**. Do not redesign it, simplify away security boundaries, replace required components with fake implementations, or add unrelated technologies.

Reference architecture:

```text
USER TASK
→ DOM/ARIA
→ CONFIDENCE ROUTER
→ TARGETED LOCAL VISION
→ VISUAL GROUNDING
→ PII/SECRET PROTECTION
→ MINIMUM DISCLOSURE
→ PRIVACY EGRESS FIREWALL
→ SANITIZED SERVER REASONING
→ STRUCTURED ACTION
→ LOCAL POLICY/ORIGIN/FRAME/STATE VALIDATION
→ BROWSER EXECUTION
→ RE-PERCEPTION
```

The master specification explicitly says the architecture is locked for implementation and that the next milestone is end-to-end vertical integration. It also requires building vertically first and hardening afterward. See the source specification for the locked architecture and build strategy. 

---

# GLOBAL ANTIGRAVITY INSTRUCTIONS

Paste this section at the beginning of the Antigravity implementation task.

## Role

You are the primary implementation engineer for SIH 2026 Problem Statement 26171.

You must implement the project according to this phased plan and the project's locked technical architecture.

## Non-negotiable rules

1. **Follow this plan exactly.**
2. **Do not redesign the architecture.**
3. **Do not hardcode demo behavior, fake model outputs, fake detections, fake privacy decisions, fake actions, or fixed benchmark results.**
4. Implement real interfaces and real runtime behavior.
5. Use configuration, schemas, models, browser APIs, and actual data flow instead of hardcoded values.
6. Do not bypass security boundaries to make a demo work.
7. Do not send raw PII, raw secrets, unrestricted DOM, or unsanitized screenshots to the server.
8. Never allow arbitrary server-side JavaScript execution.
9. Treat webpage content as untrusted data.
10. Keep secrets local.
11. Unknown privacy state must result in BLOCK.
12. Stale actions must result in BLOCK + RE-PERCEIVE.
13. Origin/frame/state validation must happen locally before execution.
14. Visual grounding produces targets; it does not directly execute actions.
15. DOM/ARIA is the default perception route.
16. Local vision is invoked selectively when DOM/ARIA confidence is insufficient.
17. Every perception route must converge into privacy processing.
18. Do not add technologies that are not required by the current phase.
19. Do not optimize prematurely.
20. Do not move to the next phase until the current phase's acceptance tests pass.
21. If a test fails, stop progression, diagnose the root cause, fix it, and rerun the complete phase test suite.
22. Preserve working functionality from earlier phases.
23. After every phase, provide a concise implementation report containing:
   - files changed
   - features implemented
   - tests executed
   - test results
   - failures found and fixed
   - remaining limitations
   - exact confirmation that the phase is ready for the next phase
24. Never claim a feature is complete merely because the code compiles.
25. Never claim performance or privacy guarantees that were not measured.
26. Do not invent benchmark numbers.
27. Use synthetic PII/secrets for demonstrations and tests.
28. Keep the code modular so later phases can integrate without rewriting completed phases.

---

# PHASE 0 — REPOSITORY AUDIT AND IMPLEMENTATION BASELINE

## Objective

Understand the existing repository before modifying it.

## Tasks

1. Inspect the complete repository.
2. Identify:
   - current extension structure
   - current frontend
   - current backend
   - existing browser runtime
   - existing DOM perception code
   - existing visual-grounding code
   - existing privacy code
   - existing action code
   - existing tests
   - existing benchmark code
   - package managers
   - build commands
   - test commands
3. Compare the current repository against the locked architecture.
4. Create a gap report.
5. Identify reusable code.
6. Identify incomplete or unsafe code.
7. Do not rewrite working components without a reason.
8. Establish reproducible build and test commands.

## Deliverables

```text
docs/
└── implementation-baseline.md
```

The baseline must contain:

- current architecture
- current implementation status
- missing modules
- conflicting modules
- existing tests
- missing tests
- recommended implementation order

## Acceptance criteria

- Repository builds successfully.
- Existing tests run successfully, where tests exist.
- No existing functionality is silently removed.
- Baseline report accurately reflects the repository.
- No implementation changes are made merely for convenience.

## Gate

**Do not begin Phase 1 until the repository baseline is complete and the project build/test commands are known.**

---

# PHASE 1 — BROWSER EXTENSION FOUNDATION

## Objective

Create the stable browser runtime foundation.

## Tasks

Implement the extension foundation using the architecture specified in the master document:

```text
extension/
├── entrypoints/
├── components/
├── perception/
├── vision/
├── privacy/
├── actions/
├── capture/
├── telemetry/
├── storage/
└── utils/
```

Implement:

- TypeScript
- WXT
- Manifest V3
- React UI where needed
- content script
- service worker
- extension messaging
- basic browser state access
- configuration handling
- typed message contracts

The service worker must not host heavy ML.

The offscreen document must be prepared as the runtime for local ML and image processing.

## Tests

Test:

- extension build
- extension loading
- content script injection
- service-worker startup
- content-script ↔ service-worker communication
- lifecycle/reload behavior
- invalid messages
- malformed messages
- typed message validation

## Acceptance criteria

All Phase 1 tests pass.

The extension can load in the target browser without errors and establish reliable communication between its runtime components.

No hardcoded page-specific behavior is allowed.

## Gate

**Only after the complete Phase 1 test suite passes may Antigravity continue to Phase 2.**

---

# PHASE 2 — DOM/ARIA PERCEPTION

## Objective

Implement the default browser perception layer.

## Tasks

Implement real extraction of:

- DOM elements
- semantic roles
- accessible names
- labels
- inputs
- visibility
- interactability
- bounding boxes
- iframe/frame relationships
- origin information
- relevant browser state
- mutation information

Create a normalized internal representation.

Suggested modules:

```text
perception/
├── dom/
├── accessibility/
└── analyzer/
```

Do not yet depend on the visual model.

## Required behavior

The system should reliably identify normal:

- buttons
- links
- headings
- inputs
- labels
- checkboxes
- standard forms

It must preserve:

- origin
- frame ID
- geometry
- visibility
- interactability

## Tests

Create a controlled test page containing normal HTML controls.

Test:

- correct element identification
- role extraction
- accessible name extraction
- geometry
- visibility
- interactability
- iframe context
- dynamic DOM mutation
- hidden/off-screen elements

## Acceptance criteria

DOM/ARIA perception produces structured, real browser-derived data.

No selectors, coordinates, labels, or target IDs may be hardcoded for the test page.

## Gate

Run the entire Phase 2 suite. Fix all failures. Only then continue.

---

# PHASE 3 — CONFIDENCE ROUTER

## Objective

Introduce the adaptive perception decision layer.

The router must answer:

> Can DOM/ARIA already explain this region reliably?

## Tasks

Implement:

```text
HIGH
→ DOM/ARIA

MEDIUM
→ targeted region
→ OCR/lightweight visual processing

LOW
→ local visual model
```

The router must use measurable signals from the perception system.

Do not invent arbitrary confidence thresholds and permanently lock them into code.

Thresholds must be configurable and eventually calibrated against the evaluation dataset.

## Telemetry

Record:

- region
- DOM completeness
- ARIA completeness
- rendering source where available
- change state
- selected route
- reason
- confidence

## Tests

Create cases for:

- normal HTML button
- incomplete DOM metadata
- custom control
- dynamic control
- visual-only region

Verify the correct route is selected.

## Acceptance criteria

The router makes decisions from actual page/perception information.

No test-specific routing logic is permitted.

## Gate

Complete routing tests and regression tests before continuing.

---

# PHASE 4 — LOCAL VISUAL PERCEPTION

## Objective

Implement the real local visual inference path.

## Tasks

Implement the browser-local visual model interface:

```typescript
interface VisionModel {
  load(): Promise<void>;
  detect(image: ImageData): Promise<VisionDetection[]>;
  dispose(): Promise<void>;
}

interface VisionDetection {
  className: string;
  confidence: number;
  bbox: BoundingBox;
}
```

Implement:

- screenshot capture
- targeted cropping
- preprocessing
- model loading
- local inference
- postprocessing
- model disposal
- runtime capability detection

Preferred execution order:

```text
WebGPU
→ WebGL
→ WASM
```

Only implement the fallback backends that are supported and testable in the current phase.

Use a real lightweight browser-compatible model.

Do not replace inference with mocked detections.

## Initial visual classes

Start with benchmark-supported classes such as:

- button
- input
- checkbox
- dropdown
- link
- tab
- menu
- dialog

Expand only when justified by tests.

## Tests

Verify:

- model loading
- local inference
- invalid image handling
- model disposal
- backend detection
- bounding-box output
- confidence output
- inference failure handling

## Acceptance criteria

The visual model actually executes locally.

The result is produced from the captured image rather than hardcoded test data.

## Gate

No visual-grounding phase may begin until local inference has been independently verified.

---

# PHASE 5 — VISUAL GROUNDING

## Objective

Connect visual detections to meaningful browser targets.

## Tasks

Implement:

```text
Screenshot
→ local vision
→ region detection
→ OCR association
→ DOM ↔ vision matching
→ grounded perception object
```

Use multiple matching signals:

- IoU
- center distance
- text similarity
- role compatibility
- visibility
- frame identity
- origin identity

Implement explicit disagreement reporting between DOM and vision.

Implement visual states where supported:

- enabled
- disabled
- selected
- expanded
- collapsed
- focused
- checked
- unchecked

Implement spatial relationships:

- above
- below
- left
- right
- contains
- overlaps
- near

## Important

Visual grounding only produces a target representation.

It must not execute browser actions.

## Tests

Use the 16-case visual grounding direction from the specification, progressively implementing:

1. normal submit button
2. custom div button
3. canvas button
4. canvas chart
5. custom dropdown
6. decoy buttons
7. tiny button
8. low contrast
9. overlapping modal
10. scrolling
11. dynamic mutation
12. spatial disagreement
13. shadow DOM
14. iframe
15. visual PII
16. visual prompt injection

Add responsive, high-DPI, zoom, SVG, animation, hidden/off-screen and moving-target cases as the implementation matures.

## Acceptance criteria

A visual target contains enough information for later action validation:

- target ID
- bbox
- semantic type
- confidence
- origin
- frame ID
- browser state identity

No target is selected using a hardcoded coordinate.

## Gate

All currently implemented grounding tests must pass before integration with privacy.

---

# PHASE 6 — PERCEPTION CONTRACT AND FUSION

## Objective

Give DOM, ARIA, OCR, vision and browser signals one common representation.

## Tasks

Implement the Perception Contract containing, as applicable:

- region ID
- source provenance
- semantic type
- text
- bbox
- confidence
- visibility
- interactability
- sensitivity
- origin
- frame ID
- page state hash
- timestamp

Implement:

```text
DOM
ARIA
OCR
VISION
browser state
element metadata
rendering information
        ↓
PERCEPTION FUSION
        ↓
unified perception object
```

Preserve source provenance.

Represent disagreements explicitly.

## Tests

Test:

- DOM-only perception
- vision-only perception
- OCR-assisted perception
- matching perception
- conflicting perception
- stale perception
- cross-frame perception

## Acceptance criteria

All downstream components consume the common contract rather than unrelated internal structures.

## Gate

Contract validation and fusion regression tests must pass.

---

# PHASE 7 — LOCAL PII AND SECRET DETECTION

## Objective

Build the first privacy boundary.

## Tasks

Implement local detection using multiple signals:

```text
DOM
ARIA
regex/rules
OCR
face detection
visual signals
credential/secret metadata
        ↓
PII/SECRET FUSION
```

Support at least:

- person
- email
- phone
- password
- address
- date of birth
- government-ID-like values
- payment information
- face
- authentication secrets

Use synthetic values only for testing/demo.

## Tests

Place synthetic PII in:

- DOM text
- placeholder
- aria-label
- OCR-visible text
- canvas
- image
- SVG
- iframe
- shadow DOM
- partial obstruction
- low contrast
- small text
- dynamic content

## Acceptance criteria

Sensitive information is detected locally before network transmission.

No remote call is allowed to perform the primary privacy decision.

## Gate

Complete PII detection regression suite before implementing network transmission.

---

# PHASE 8 — MINIMUM DISCLOSURE AND LOCAL REDACTION

## Objective

Transform detected sensitive data into the minimum useful representation.

## Tasks

Implement the policy order:

```text
Sensitivity
→ mandatory protection
→ task relevance
→ minimum useful representation
→ redaction
```

Implement semantic redaction such as:

```text
person → <PERSON>
email → <EMAIL>
phone → <PHONE>
password → <PASSWORD>
```

Implement visual redaction using sensitive region masks/bounding boxes.

Protect against:

- partial text
- edge pixels
- small fonts
- overlapping boxes
- high-DPI
- scaling
- zoom
- scrolling
- image PII
- canvas PII

## Acceptance criteria

The sanitized representation contains no original sensitive value where the policy requires removal.

The implementation must not use hardcoded PII strings as the redaction mechanism.

## Gate

Run semantic and visual redaction tests and verify outputs programmatically.

---

# PHASE 9 — PRIVACY EGRESS FIREWALL

## Objective

Create the authoritative network privacy boundary.

## Tasks

Inspect the exact payload immediately before transmission.

Check for:

- raw PII
- secrets
- unredacted OCR
- sensitive metadata
- unrestricted DOM
- unredacted pixels
- forbidden capability values

Policy:

```text
SAFE → transmit
UNSAFE → BLOCK
UNKNOWN → BLOCK
```

The firewall must be independent from upstream PII detection.

## Tests

Attempt to transmit:

- raw email
- raw phone
- raw password
- raw image
- raw screenshot
- raw OCR
- unrestricted DOM
- secret values
- unsafe metadata
- unknown/ambiguous payload

## Acceptance criteria

Unsafe payloads are actually prevented from leaving the browser.

Safe sanitized payloads are transmitted.

## Gate

This phase is security-critical. Do not continue until the firewall tests pass.

---

# PHASE 10 — SANITIZED SERVER REASONING

## Objective

Connect the browser to the server without weakening privacy.

## Tasks

Implement:

```text
Sanitized Context
→ HTTPS
→ FastAPI
→ Context Processor
→ Server VLM
→ Agent Planner
→ Structured Action
```

The server receives only the sanitized representation.

Implement structured schemas.

The VLM must not directly control the browser.

## Tests

Verify:

- valid sanitized request
- malformed request
- oversized request
- forbidden field
- raw PII rejection
- secret rejection
- schema validation
- server unavailable behavior
- model failure behavior

## Acceptance criteria

The server can reason over sanitized context and produce a structured action.

No browser-control channel bypasses the local extension.

## Gate

Complete server contract tests before implementing action execution.

---

# PHASE 11 — STRUCTURED ACTION PROTOCOL

## Objective

Define and validate the browser action protocol.

## Allowed action types

```text
click
scroll
focus
select
type
keypress
fill_secret
```

Every action must carry sufficient context for local validation.

At minimum, where applicable:

- action type
- target
- origin
- frame ID
- page state hash
- capability reference for secrets

## Rules

- No arbitrary JavaScript.
- No arbitrary selectors generated by the server that bypass validation.
- No unrestricted browser commands.
- No server-side secret values.

## Tests

Test valid and invalid schemas for every action type.

## Gate

Action schema validation must pass before local execution is enabled.

---

# PHASE 12 — LOCAL ACTION FIREWALL

## Objective

Make the browser the final authority over action execution.

## Validation chain

```text
Structured Action
→ schema validation
→ user/task policy
→ origin validation
→ frame validation
→ state validation
→ target validation
→ visibility/interactability
→ capability validation
→ EXECUTE / BLOCK
```

## Tasks

Implement:

- origin check
- frame check
- target ownership/context check
- current page state check
- visibility check
- interactability check
- policy check
- capability check

## Tests

Attempt:

- wrong origin
- wrong frame
- wrong target
- hidden target
- stale target
- unauthorized action
- malformed action
- arbitrary JS action
- unauthorized secret capability

## Acceptance criteria

Every invalid action is blocked locally.

The server cannot bypass the validator.

## Gate

Security regression suite must pass before secret capability integration.

---

# PHASE 13 — STATE FINGERPRINT AND RE-PERCEPTION

## Objective

Prevent stale actions from executing against changed browser state.

## Tasks

Create a page state fingerprint using relevant:

- URL/origin
- DOM structural state
- ARIA state
- element geometry
- visual region state
- frame context
- timestamp

Bind perception and action to the state fingerprint.

If:

```text
action state != current state
```

then:

```text
BLOCK
→ RE-PERCEIVE
```

## Tests

Simulate:

- navigation
- DOM mutation
- target movement
- modal appearance
- overlay appearance
- frame changes
- visual changes

## Acceptance criteria

No stale action is executed.

The system automatically returns to perception after a state mismatch.

## Gate

State mismatch tests must pass consistently.

---

# PHASE 14 — LOCAL SECRET CAPABILITY SYSTEM

## Objective

Allow sensitive operations without exposing actual secrets to the server.

## Tasks

Implement a synthetic local secret vault for the prototype.

Server sends:

```json
{
  "action": "fill_secret",
  "capability": "cap_pwd_01"
}
```

The browser validates:

```text
capability exists?
task authorized?
origin authorized?
target authorized?
action type authorized?
```

Only then resolve the secret locally.

## Critical rule

The real secret value must never enter:

- server request
- server response
- telemetry
- logs
- benchmark output

## Tests

Test:

- valid capability
- missing capability
- wrong origin
- wrong target
- wrong task
- unauthorized action
- secret leakage detection

## Acceptance criteria

The secret is resolved and used locally without being transmitted.

## Gate

Run a network/log inspection test confirming the secret does not leave the local trust zone.

---

# PHASE 15 — DIRTY REGIONS AND PERCEPTION CACHE

## Objective

Reduce unnecessary perception work.

## Tasks

Implement invalidation based on:

- MutationObserver
- scrolling
- resizing
- overlays
- modal opening
- dynamic content
- element movement
- CSS/layout changes
- navigation
- visual state changes

Implement safe metadata/result caching.

Do not cache unnecessary raw sensitive screenshots.

Cache validity should consider:

- geometry
- scroll state
- layout state
- DOM changes
- visual fingerprint where appropriate
- page state fingerprint

## Tests

Verify:

- unchanged region → cache reuse
- changed region → invalidation
- moved region → invalidation
- scrolled region → appropriate invalidation
- navigation → invalidation
- sensitive raw data is not unnecessarily persisted

## Gate

Run cache correctness and regression tests.

---

# PHASE 16 — RESOURCE BUDGET MANAGER

## Objective

Make local perception adaptive to available resources.

## Inputs

Use real runtime information for:

- WebGPU availability
- CPU/GPU capability where available
- memory pressure where available
- model availability
- recent inference latency
- page complexity
- task urgency

Select a perception budget.

Example policy:

```text
HIGH resources
→ local visual model + OCR

MEDIUM resources
→ targeted crop + lightweight model

LOW resources
→ DOM/ARIA + OCR where possible
```

Do not fake hardware measurements.

## Tests

Test budget decisions under controlled capability conditions.

Measure actual inference latency.

## Gate

Resource-budget behavior must be deterministic for the same measured runtime conditions and configurable without source-code modification.

---

# PHASE 17 — EXPLAINABLE TELEMETRY

## Objective

Make the system explainable during the SIH demonstration.

Record:

- selected perception route
- reason
- region
- model invocation
- latency
- pixels processed
- OCR calls
- privacy decisions
- egress decision
- action validation decision
- block reasons

Never log:

- raw passwords
- raw secrets
- unnecessary raw PII
- unnecessary screenshots

## Acceptance criteria

Telemetry can explain why the system:

- skipped vision
- invoked vision
- blocked data
- allowed data
- blocked an action
- executed an action
- re-perceived

## Gate

Telemetry tests and sensitive-data log inspection must pass.

---

# PHASE 18 — SIH EVALUATION HARNESS

## Objective

Build the controlled test environment and benchmark system.

## Test site categories

Implement cases for:

- normal HTML
- CSS controls
- SVG
- Canvas
- image UI
- video
- custom controls
- dynamic UI
- shadow DOM
- iframes
- responsive UI
- PII
- prompt injection
- stale actions

## Benchmark dimensions

Measure only actual results:

### Visual

- correct region
- semantic type
- state
- bounding box
- IoU

### Privacy

- precision
- recall
- false negatives
- false positives

### Redaction

- redaction precision
- residual sensitive pixels
- semantic leakage

### Resources

- CPU
- GPU
- memory
- model size
- inference time
- pixels processed
- vision calls
- OCR calls

### End-to-end

- task completion latency
- perception cycles
- server latency
- action latency

Use high-resolution timers.

Do not report rounded zero as literal zero.

## Baseline

Compare:

```text
Broad/full visual processing
```

against:

```text
DOM/ARIA-first
+
confidence-driven
+
targeted local vision
```

## Acceptance criteria

The benchmark is reproducible and reports actual measured results.

No benchmark result may be hardcoded.

---

# PHASE 19 — PRIVACY ATTACK LAB

## Objective

Prove that the security boundaries actually enforce their intended behavior.

## Required attack cases

1. PII in DOM
2. PII in image
3. PII in Canvas
4. tiny PII
5. hidden PII
6. partially obscured PII
7. prompt injection
8. cross-origin target
9. stale action
10. unsafe outgoing payload
11. unauthorized secret request

For every attack record:

```text
Detected?
Redacted?
Blocked?
Transmitted?
Executed?
```

## Acceptance criteria

Each attack has a measurable result.

No security claim is made without test evidence.

## Gate

All critical attacks must pass before final integration.

---

# PHASE 20 — COMPLETE VERTICAL INTEGRATION

## Objective

Connect every completed component into one real end-to-end workflow.

Required path:

```text
USER TASK
↓
DOM/ARIA
↓
CONFIDENCE ROUTER
↓
TARGETED LOCAL VISION
↓
VISUAL GROUNDING
↓
PERCEPTION FUSION
↓
PII/SECRET PROTECTION
↓
MINIMUM DISCLOSURE
↓
LOCAL REDACTION
↓
PRIVACY EGRESS FIREWALL
↓
SANITIZED SERVER REQUEST
↓
SERVER VLM
↓
STRUCTURED ACTION
↓
LOCAL POLICY VALIDATION
↓
ORIGIN/FRAME VALIDATION
↓
STATE VALIDATION
↓
CAPABILITY VALIDATION
↓
BROWSER EXECUTION
↓
PAGE CHANGE
↓
RE-PERCEIVE
```

## Primary demonstration

Use the synthetic login/task page containing:

- email
- password
- phone
- face
- normal DOM controls
- a visual-only/custom-rendered control

The complete flow must demonstrate:

1. DOM/ARIA handles standard controls.
2. Confidence routing skips unnecessary vision.
3. Visual-only content invokes local vision.
4. Visual grounding identifies the relevant target.
5. PII/secret detection happens locally.
6. Sensitive content is redacted.
7. Minimum disclosure is applied.
8. Egress firewall verifies the exact outgoing payload.
9. Server receives sanitized context only.
10. Server produces structured actions.
11. Local validator checks origin, frame, target, state, policy and capability.
12. Secret capability is resolved locally where required.
13. Browser executes the safe action.
14. Page change causes re-perception.

## Gate

The vertical workflow must pass repeatedly without hardcoded page-specific behavior.

---

# PHASE 21 — FINAL HARDENING AND REGRESSION

## Objective

Verify that later work did not break earlier phases.

## Tasks

Run:

- full unit test suite
- integration test suite
- browser tests
- privacy tests
- security tests
- attack lab
- benchmark suite
- regression suite
- build/package validation

Verify:

- no raw secret leaks
- no unsafe payloads
- no arbitrary JS execution
- no stale action execution
- no origin/frame bypass
- no hardcoded demo logic
- no fake model output
- no fake benchmark output
- no broken earlier functionality

## Acceptance criteria

All required tests pass.

Any failure blocks completion until fixed and retested.

---

# PHASE 22 — FINAL SIH DEMO AND EVIDENCE PACKAGE

## Objective

Prepare the implementation for SIH evaluation without changing the architecture.

## Deliverables

Create:

```text
docs/
├── architecture.md
├── implementation-status.md
├── security-model.md
├── benchmark-methodology.md
├── benchmark-results.md
├── demo-flow.md
└── limitations.md
```

Include measured evidence for:

- visual perception
- grounding
- PII detection
- redaction
- egress blocking
- resource usage
- latency
- action validation
- stale-action protection
- capability protection

Do not make claims beyond measured results.

If the benchmark observes zero raw-pixel egress, describe it as an observation from that benchmark rather than a universal certification.

---

# PHASE GATE PROTOCOL

Antigravity must use this protocol after EVERY phase.

## Step 1 — Stop implementation

Do not automatically start the next phase.

## Step 2 — Run phase tests

Run all tests belonging to:

- current phase
- previous phases
- relevant integration tests

## Step 3 — Inspect failures

For every failure:

- identify root cause
- fix implementation
- rerun failed test
- rerun complete phase suite
- rerun relevant regression suite

## Step 4 — Security inspection

Check that the implementation did not introduce:

- privacy bypass
- secret leakage
- arbitrary browser control
- hardcoded behavior
- test-only behavior in production paths

## Step 5 — Build inspection

Verify the project still builds cleanly.

## Step 6 — Completion report

Produce:

```text
PHASE:
STATUS:

IMPLEMENTED:
- ...

TESTS:
- ...

PASSED:
- ...

FAILED:
- ...

FIXES:
- ...

SECURITY CHECK:
PASS / FAIL

REGRESSION CHECK:
PASS / FAIL

READY FOR NEXT PHASE:
YES / NO
```

## Step 7 — Only then continue

If and only if:

```text
build = PASS
phase tests = PASS
regression tests = PASS
security checks = PASS
```

then begin the next phase.

Otherwise remain in the current phase.

---

# FINAL ANTIGRAVITY PROMPT

Use the following as the final instruction when handing this plan to Antigravity:

> Implement SIH 2026 PS 26171 strictly according to this phased implementation plan and the locked architecture in the project's master specification.
>
> Start by auditing the existing repository. Do not immediately rewrite code.
>
> Work one phase at a time.
>
> For the current phase, inspect the existing implementation, implement only the required functionality for that phase, and integrate it cleanly with existing work.
>
> Do not hardcode any page-specific behavior, detections, coordinates, PII values, model outputs, actions, benchmark results, confidence results, or security decisions merely to make tests/demo output pass.
>
> Use real browser state, real DOM/ARIA information, real local visual inference, real OCR where required, real privacy processing, real payload inspection, real structured actions, and real local validation.
>
> Never bypass the privacy boundary or action firewall to make integration easier.
>
> Treat webpage content as untrusted.
>
> Keep raw PII and secrets local.
>
> Never send raw secrets to the server.
>
> Never allow arbitrary server JavaScript execution.
>
> Unknown privacy state must block.
>
> Stale state must block and trigger re-perception.
>
> Visual grounding must produce targets, not execute actions.
>
> Do not redesign the architecture.
>
> Do not add unrelated technologies.
>
> Do not add complexity without measurable value.
>
> After finishing each phase, STOP implementation and run the complete acceptance test suite for that phase plus relevant regression tests.
>
> If anything fails, diagnose and fix it before continuing.
>
> Do not move to the next phase while any required test is failing.
>
> A phase is complete only when:
>
> - implementation is complete,
> - build passes,
> - phase tests pass,
> - relevant regression tests pass,
> - security checks pass,
> - no hardcoded/fake behavior was introduced,
> - and the implementation report confirms readiness.
>
> Only after those conditions are satisfied may you start the next phase.
>
> Preserve all working functionality from previous phases.
>
> At the end of every phase, provide the phase completion report specified in this document.
>
> Continue this process until the complete end-to-end vertical slice is working and the final benchmark/security evidence is generated.
>
> The final goal is not merely a large codebase. The final goal is a working, measurable, privacy-preserving browser-agent loop:
>
> ```text
> USER TASK
> → DOM/ARIA
> → CONFIDENCE ROUTER
> → TARGETED LOCAL VISION
> → VISUAL GROUNDING
> → PERCEPTION FUSION
> → PII/SECRET PROTECTION
> → MINIMUM DISCLOSURE
> → LOCAL REDACTION
> → PRIVACY EGRESS FIREWALL
> → SANITIZED SERVER REASONING
> → STRUCTURED ACTION
> → LOCAL POLICY/ORIGIN/FRAME/STATE VALIDATION
> → BROWSER EXECUTION
> → RE-PERCEPTION
> ```
>
> Stick to this plan. Do not skip phases. Do not jump ahead. Do not replace required implementation with hardcoded demonstrations. Test the current phase completely before moving to the next phase.

---

# Completion Definition

The implementation is considered complete only when the complete prototype can:

- understand a user task;
- extract DOM/ARIA;
- route perception by confidence;
- run a lightweight local visual model;
- detect visual UI regions;
- associate OCR;
- ground visual regions to browser elements;
- handle canvas/custom UI;
- fuse DOM/ARIA/OCR/vision;
- detect PII locally;
- detect sensitive visual content;
- redact locally;
- enforce minimum disclosure;
- protect secrets with local capabilities;
- inspect the exact outgoing payload;
- block unsafe payloads;
- send sanitized context;
- receive structured actions;
- validate schema, origin, frame, target, state and policy;
- reject stale actions;
- reject arbitrary JavaScript;
- execute safe actions locally;
- re-perceive after changes;
- benchmark visual accuracy, privacy, redaction, latency and resources.

The master specification defines these as the project's completion expectations and explicitly identifies the next milestone as end-to-end vertical integration.
