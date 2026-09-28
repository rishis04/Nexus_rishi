Absolutely. Below is the **single complete Markdown block** you can copy directly into:

`SIH26171_MCP_ACTION_VALIDATOR_IMPLEMENTATION_PLAN.md`

It is specifically designed around your current architecture: **MCP + Action Validator + BrowserOS**, while making **privacy/masking a frozen component**. Antigravity must implement **one phase at a time** and must test before moving forward.

````markdown
# SIH 26171 — MCP + Action Validator Implementation Plan

## Privacy-Preserving Browser Agent Integration

---

# 0. READ THIS FIRST — NON-NEGOTIABLE RULES

This document defines the implementation plan for adding:

1. A **local MCP interface**
2. An **Action Validator**
3. A controlled **BrowserOS integration**

to the existing SIH 26171 project.

The purpose of MCP is ONLY to make communication between BrowserOS and the project's controlled capabilities cleaner.

The purpose of the Action Validator is to ensure that BrowserOS cannot directly execute an unsafe or stale browser action.

---

# 1. MOST IMPORTANT REQUIREMENT

## DO NOT TOUCH THE EXISTING MASKING / PRIVACY IMPLEMENTATION

The existing privacy and perception system is considered:

> **KNOWN-GOOD AND FROZEN**

The MCP and Action Validator implementation MUST NOT reduce, modify, bypass, replace, or interfere with the current masking efficiency.

This requirement has higher priority than MCP integration convenience.

If there is a conflict:

```text
PRIVACY / MASKING
       >
ACTION VALIDATOR
       >
MCP
````

Privacy always wins.

---

# 2. PROTECTED SYSTEM

The following areas are privacy-critical and must be treated as read-only unless an absolutely unavoidable integration boundary is missing.

## Vision

```text
extension/src/vision/
extension/src/vision/yunet/
```

Protect:

* YuNet model
* YuNet preprocessing
* YuNet inference
* YuNet postprocessing
* YuNet thresholds
* YuNet confidence settings
* YuNet bounding boxes
* YuNet coordinate calculations
* YuNet scaling
* face tracking
* face detection lifecycle

---

## DOM Perception

Protect:

```text
extension/src/perception/dom/
```

Including:

* DOM snapshot
* DOM traversal
* DOM region extraction
* sensitive DOM detection
* sensitive input detection
* coordinate calculations

---

## Privacy Engine

Protect:

```text
extension/src/privacy.stub.ts
```

Do NOT change:

* masking logic
* redaction logic
* mask geometry
* masking thresholds
* masking conditions
* canvas rendering
* privacy classification
* redaction coordinates

---

## Privacy Runtime

Protect:

```text
extension/src/background/perception-daemon.ts
extension/src/background/privacy-controller.ts
extension/src/background/assemble-frame.ts
```

Do not change privacy behavior merely to integrate MCP.

---

# 3. ABSOLUTE PROHIBITIONS

During this implementation, DO NOT:

* change YuNet
* replace YuNet
* change YuNet thresholds
* change face confidence thresholds
* change face preprocessing
* change face postprocessing
* change bounding-box mathematics
* change coordinate scaling
* change face tracking
* change DOM detection
* change email detection
* change phone detection
* change password detection
* change sensitive-data detection
* change masking geometry
* change privacy scheduling
* change the privacy daemon
* move privacy processing
* add another masking implementation
* bypass the privacy engine
* send raw screenshots to BrowserOS
* send raw DOM to BrowserOS
* send raw sensitive values to BrowserOS
* allow BrowserOS to directly execute browser actions

---

# 4. PROJECT OBJECTIVE

The final system should be:

```text
                         WEB PAGE
                            │
                            ▼
                   ┌─────────────────┐
                   │ DOM PERCEPTION  │
                   │       +         │
                   │ YUNET VISION    │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ EXISTING        │
                   │ PRIVACY ENGINE  │
                   │                 │
                   │ FACE MASKING    │
                   │ DOM MASKING     │
                   │ SENSITIVE DATA  │
                   └────────┬────────┘
                            │
                            ▼
                  SANITIZED OBSERVATION
                            │
                            ▼
                   ┌─────────────────┐
                   │ LOCAL MCP       │
                   │ INTERFACE       │
                   └────────┬────────┘
                            │
                            ▼
                       BROWSEROS
                       AI AGENT
                            │
                            ▼
                    ACTION REQUEST
                            │
                            ▼
                   ┌─────────────────┐
                   │ ACTION          │
                   │ VALIDATOR       │
                   └────────┬────────┘
                            │
                     ┌──────┴──────┐
                     │             │
                   DENY          ALLOW
                     │             │
                     │             ▼
                     │      EXISTING ACTION
                     │         EXECUTOR
                     │             │
                     │             ▼
                     │          BROWSER
                     │
                     └──────► BrowserOS
```

---

# 5. IMPORTANT DATA-FLOW RULE

The correct direction is:

```text
RAW WEB PAGE
     │
     ▼
DOM + VISION
     │
     ▼
EXISTING PRIVACY ENGINE
     │
     ▼
SANITIZED DATA
     │
     ▼
MCP
     │
     ▼
BROWSEROS
```

NOT:

```text
RAW WEB PAGE
     │
     ▼
MCP
     │
     ▼
BROWSEROS
     │
     ▼
PRIVACY
```

Privacy must happen BEFORE MCP exposes information to BrowserOS.

---

# 6. ROLE OF MCP

MCP is NOT:

* the privacy engine
* the face detector
* the DOM parser
* the masking engine
* the action validator
* the AI agent

MCP is simply the controlled interface.

Think of it as:

```text
BrowserOS
    │
    │ "Give me safe page information"
    ▼
   MCP
    │
    ▼
Existing sanitized state
```

And:

```text
BrowserOS
    │
    │ "Perform this action"
    ▼
   MCP
    │
    ▼
Action Validator
    │
    ├── DENY
    │
    └── ALLOW
           │
           ▼
Existing Executor
```

---

# 7. MCP MUST BE LOCAL

For the SIH MVP:

* MCP should run locally.
* No paid MCP service is required.
* No cloud MCP service is required.
* No external privacy server is required.
* No unnecessary infrastructure should be added.

Use an appropriate open-source MCP implementation/library if required.

The exact MCP library should be selected based on the project's existing runtime and BrowserOS compatibility.

Do NOT introduce a new cloud dependency just for MCP.

---

# 8. MINIMAL MCP TOOL SURFACE

Keep MCP intentionally small.

Initially expose only:

```text
get_sanitized_observation()
get_safe_targets()
request_action()
```

Do not create unnecessary MCP tools.

---

# 9. MCP TOOL — get_sanitized_observation

Purpose:

Expose the observation that has ALREADY passed through the existing privacy engine.

The MCP tool must NOT perform a second masking operation.

Correct:

```text
Web Page
   │
   ▼
Existing DOM + YuNet
   │
   ▼
Existing Privacy Engine
   │
   ▼
Sanitized Observation
   │
   ▼
MCP
```

MCP only exposes the already-sanitized result.

---

# 10. MCP TOOL — get_safe_targets

Purpose:

Expose safe actionable target metadata.

Example:

```json
{
  "observationId": "obs-123",
  "targets": [
    {
      "targetId": "button-17",
      "role": "button",
      "label": "Submit"
    }
  ]
}
```

The target representation must NOT expose sensitive values.

Do not expose:

* password contents
* raw email values
* raw phone values
* raw sensitive DOM
* raw face pixels
* unmasked sensitive screenshot data

---

# 11. MCP TOOL — request_action

BrowserOS sends an action request.

Example:

```json
{
  "requestId": "req-123",
  "observationId": "obs-456",
  "action": {
    "type": "click",
    "targetId": "button-17"
  }
}
```

MCP must pass this request to the Action Validator.

MCP must NOT independently authorize the action.

---

# 12. ACTION VALIDATOR

The Action Validator is the security boundary immediately before browser action execution.

Preferred location:

```text
extension/src/security/action-validator.ts
```

If an equivalent security module already exists, reuse it.

Do not create duplicate security systems.

---

# 13. ACTION CONTRACT

Create or reuse:

```text
contracts/ts/action-validator.ts
```

Initially support only actions required by the MVP.

For example:

```text
click
type
scroll
keypress
```

Do not add arbitrary browser capabilities.

---

# 14. ACTION VALIDATOR RESPONSIBILITIES

The Action Validator must check:

## 14.1 Action type

Is the action explicitly supported?

---

## 14.2 Request structure

Is the action request valid?

---

## 14.3 Target existence

Does the target exist?

---

## 14.4 Target identity

Does the requested target correspond to the current observation?

---

## 14.5 Observation freshness

Is the action based on the current observation?

---

## 14.6 Page consistency

Has the page changed since the observation?

---

## 14.7 Frame consistency

Has the relevant frame changed?

---

## 14.8 Action policy

Is the requested action permitted?

---

## 14.9 Fail closed

If the validator cannot determine that an action is safe:

```text
DENY
```

Never guess.

---

# 15. FORBIDDEN ACTIONS

The validator must reject:

```text
eval()
Function()
javascript:
arbitrary JavaScript
arbitrary script injection
unvalidated selectors
unsupported commands
malformed commands
```

The validator must fail closed.

---

# 16. VALIDATION RESULT

Use a structured result.

Example:

```ts
type ValidationResult =
  | {
      allowed: true;
      reason: string;
    }
  | {
      allowed: false;
      reason: string;
      code: string;
    };
```

Example:

```json
{
  "allowed": false,
  "reason": "Observation is stale",
  "code": "STALE_OBSERVATION"
}
```

---

# 17. EXECUTION BOUNDARY

The Action Validator MUST execute immediately before the existing action executor.

Correct:

```text
BrowserOS
    │
    ▼
   MCP
    │
    ▼
Action Validator
    │
    ▼
ALLOW
    │
    ▼
Existing Executor
    │
    ▼
Browser
```

Incorrect:

```text
BrowserOS
    │
    ▼
   MCP
    │
    ▼
Existing Executor
    │
    ▼
Action Validator
```

An action must NEVER execute before validation.

---

# 18. DO NOT REWRITE THE EXISTING EXECUTOR

Reuse the existing action executor.

Only make the smallest interface change necessary to place validation before execution.

Do not refactor unrelated execution code.

---

# 19. BROWSEROS INTEGRATION

BrowserOS remains the external AI-agent layer.

The project does NOT build another AI planner.

Preferred integration:

```text
extension/src/integration/browseros/
├── adapter.ts
├── action-request.ts
├── action-response.ts
└── index.ts
```

Reuse equivalent existing components where possible.

BrowserOS must not be allowed to bypass MCP or the Action Validator.

---

# 20. FINAL CONTROL FLOW

The final flow must be:

```text
WEB PAGE
   │
   ▼
DOM + YuNet
   │
   ▼
EXISTING PRIVACY ENGINE
   │
   ▼
SANITIZED OBSERVATION
   │
   ▼
LOCAL MCP
   │
   ▼
BROWSEROS
   │
   ▼
ACTION REQUEST
   │
   ▼
ACTION VALIDATOR
   │
   ├───────────────► DENY
   │
   ▼
ALLOW
   │
   ▼
EXISTING ACTION EXECUTOR
   │
   ▼
BROWSER
```

---

# 21. PRIVACY DATA BOUNDARY

BrowserOS/MCP MUST NEVER receive:

* raw screenshot
* raw face pixels
* raw email
* raw phone number
* password
* raw sensitive DOM value
* unmasked sensitive content

BrowserOS/MCP MAY receive:

* sanitized screenshot
* sanitized DOM metadata
* safe target IDs
* safe target metadata
* observation ID
* safe geometry
* already-generated redaction metadata where appropriate

---

# 22. NO SECOND PRIVACY ENGINE

There must be only ONE privacy/redaction source of truth.

Do NOT create:

```text
Existing Privacy Engine
        +
MCP Privacy Engine
```

Correct:

```text
Existing Privacy Engine
        │
        ▼
Sanitized State
        │
        ▼
MCP
```

MCP does not redact.

MCP does not unredact.

MCP does not reinterpret sensitive information.

---

# 23. PHASE 1 — BASELINE FREEZE

Before modifying code:

1. Inspect repository structure.
2. Identify existing privacy pipeline.
3. Identify DOM pipeline.
4. Identify YuNet pipeline.
5. Identify sanitized-observation boundary.
6. Identify existing action executor.
7. Identify existing action contracts.
8. Identify existing BrowserOS integration.
9. Check whether MCP-related code already exists.

Run:

```bash
pnpm test
pnpm run build
```

Perform real browser regression testing.

### Face tests

Test:

* large frontal face
* small face
* angled face
* profile face
* multiple faces
* different positions
* different scales

### DOM tests

Test:

* email
* phone number
* password
* sensitive input
* normal text
* non-sensitive content

### Geometry tests

Verify:

* mask is correctly positioned
* no full-screen masking
* no huge parent-container masking
* no coordinate regression

Create:

```text
MCP_ACTION_PHASE1_BASELINE.md
```

Include:

```text
Build:
PASS / FAIL

Tests:
PASS / FAIL

Face masking:
PASS / FAIL

DOM masking:
PASS / FAIL

Sanitized observation:
PASS / FAIL

Action executor:
FOUND / NOT FOUND

BrowserOS integration:
FOUND / NOT FOUND

Existing MCP:
FOUND / NOT FOUND

Privacy-critical files:
LIST
```

Then STOP.

---

# 24. PHASE 1 GATE

Do NOT continue if:

```text
Build = FAIL
OR
Tests = FAIL
OR
Face masking = FAIL
OR
DOM masking = FAIL
OR
Sanitized observation = FAIL
```

If masking is already broken:

```text
STOP
```

Do not attempt to repair masking as part of MCP implementation.

---

# 25. PHASE 2 — ACTION CONTRACT

Create or reuse the Action Validator contract.

Do NOT modify privacy code.

Implement only:

* action types
* request schema
* response schema
* validation result types

Test:

```text
valid click
valid type
valid scroll
valid keypress
malformed action
unsupported action
missing target
```

Run:

```bash
pnpm test
pnpm run build
```

Perform full privacy regression.

Then STOP.

---

# 26. PHASE 3 — ACTION VALIDATOR

Implement the isolated Action Validator.

It must validate:

* action schema
* action type
* target
* observation ID
* observation freshness
* page state
* frame state
* policy

It must reject unsafe actions.

It must fail closed.

Do NOT modify:

```text
YuNet
DOM parser
Privacy Engine
Privacy Controller
Perception Daemon
```

Run:

```bash
pnpm test
pnpm run build
```

Perform privacy regression.

Then STOP.

---

# 27. PHASE 4 — EXECUTION BOUNDARY

Connect the Action Validator immediately before the existing executor.

Test:

```text
Valid action
    ↓
Validator
    ↓
ALLOW
    ↓
Executor
```

Test:

```text
Invalid action
    ↓
Validator
    ↓
DENY
    ↓
Executor NOT called
```

Run full privacy regression.

Then STOP.

---

# 28. PHASE 5 — LOCAL MCP

Add the minimum local MCP interface.

Expose:

```text
get_sanitized_observation
get_safe_targets
request_action
```

MCP must consume existing sanitized state.

Do NOT implement any new masking.

Do NOT modify YuNet.

Do NOT modify DOM detection.

Do NOT modify privacy logic.

Run:

```bash
pnpm test
pnpm run build
```

Perform real browser privacy regression.

Then STOP.

---

# 29. PHASE 6 — MCP + ACTION VALIDATOR

Connect:

```text
MCP
  │
  ▼
request_action
  │
  ▼
Action Validator
  │
  ├── DENY
  │
  └── ALLOW
          │
          ▼
   Existing Executor
```

Test valid and invalid requests.

### Valid

```text
BrowserOS
 → MCP
 → Validator
 → ALLOW
 → Executor
```

### Invalid

```text
BrowserOS
 → MCP
 → Validator
 → DENY
 → Executor NOT called
```

Run full privacy regression.

Then STOP.

---

# 30. PHASE 7 — BROWSEROS ADAPTER

Connect BrowserOS to MCP.

Required:

```text
BrowserOS
    ↓
MCP
    ↓
Action Validator
    ↓
Existing Executor
```

BrowserOS must NOT:

```text
BrowserOS
    ↓
Existing Executor
```

Test:

* valid request
* malformed request
* unsupported request
* stale request
* invalid target

Run privacy regression.

Then STOP.

---

# 31. PHASE 8 — MOCK SERVER / SERVER DEMO

If a mock server is used for the SIH demonstration, it must receive only sanitized information.

Example:

```text
SERVER RECEIVED
────────────────────────

Observation ID:
obs-123

Image:
SANITIZED

Faces detected:
3

Redacted regions:
5

Sensitive DOM regions:
2

Action:
CLICK button-17

Validation:
ALLOWED
```

The mock server must NEVER display:

* raw email
* raw phone
* password
* raw face pixels
* raw sensitive DOM
* unmasked screenshot

---

# 32. PHASE 9 — SECURITY TESTS

Test:

```text
Malformed JSON
Unknown action
Unsupported action
Missing target
Invalid target
Stale observation
Stale target
Changed page
Changed frame
Arbitrary JavaScript
javascript:
Script injection
Unauthorized target
```

Expected:

```text
DENY
```

Also verify:

```text
Executor is NOT called after DENY
```

---

# 33. PHASE 10 — FAILURE ISOLATION

Test:

## MCP unavailable

Expected:

```text
Privacy continues locally.
```

## BrowserOS unavailable

Expected:

```text
Privacy continues locally.
```

## Validator failure

Expected:

```text
Action denied.
Privacy continues.
```

## Executor failure

Expected:

```text
Action fails safely.
Privacy continues.
```

## Mock server unavailable

Expected:

```text
Privacy continues.
```

## Network timeout

Expected:

```text
Action fails closed.
Privacy continues.
```

---

# 34. PHASE 11 — DEMONSTRATION UI

Add a small Action Security section to the existing UI.

Do NOT modify the existing VisualPreview masking implementation.

Example:

```text
ACTION SECURITY
────────────────────────

Request:
CLICK → Submit

Observation:
obs-123

Target:
button-17

Validation:

✓ Valid action
✓ Target exists
✓ Observation current
✓ Page unchanged
✓ Policy allowed

RESULT:
✓ ACTION ALLOWED
```

Blocked action:

```text
ACTION SECURITY
────────────────────────

Request:
CLICK → button-17

Validation:

✓ Valid request
✗ Observation stale

RESULT:
✗ ACTION BLOCKED

Reason:
STALE_OBSERVATION
```

This UI is only for transparency and demonstration.

It must not implement another privacy pipeline.

---

# 35. PHASE 12 — FINAL END-TO-END VALIDATION

Verify:

```text
WEB PAGE
   ↓
DOM + YuNet
   ↓
EXISTING PRIVACY ENGINE
   ↓
SANITIZED OBSERVATION
   ↓
LOCAL MCP
   ↓
BROWSEROS
   ↓
ACTION REQUEST
   ↓
ACTION VALIDATOR
   ↓
ALLOW / DENY
   ↓
EXISTING EXECUTOR
   ↓
BROWSER
```

---

# 36. MANDATORY REGRESSION AFTER EVERY PHASE

After EVERY phase run:

```bash
pnpm test
pnpm run build
```

Then test the actual browser extension.

## Face regression

Verify:

* large face
* small face
* profile face
* angled face
* multiple faces
* different positions
* different scales

## DOM regression

Verify:

* email
* phone
* password
* sensitive input
* normal text

## Privacy regression

Verify:

* sanitized screenshot remains correct
* masks remain correctly positioned
* no full-screen masking
* no large-container masking
* no coordinate regression
* no raw sensitive data reaches MCP
* no raw sensitive data reaches BrowserOS

---

# 37. REGRESSION STOP RULE

If masking stops working after ANY phase:

## STOP IMMEDIATELY.

Do NOT attempt to fix the regression by changing the privacy implementation.

Do NOT modify:

* YuNet
* YuNet thresholds
* YuNet preprocessing
* YuNet postprocessing
* DOM detection
* privacy.stub.ts
* PrivacyController
* PerceptionDaemon
* coordinate calculations
* masking geometry
* redaction conditions

Instead:

1. Identify the first phase that caused the regression.
2. Identify the exact changed file.
3. Identify the exact changed function.
4. Identify the data-flow change.
5. Determine how the new component crossed the privacy boundary.
6. Isolate the new component.
7. Report the issue.

Privacy must remain untouched.

---

# 38. PHASE REPORT FORMAT

After every phase create:

```text
MCP_ACTION_PHASE<N>_REPORT.md
```

Use:

```text
Phase:
Status:

Objective:

Files inspected:

Files added:

Files modified:

Files deleted:

Build:
PASS / FAIL

Unit tests:
PASS / FAIL

Action Validator tests:
PASS / FAIL

MCP tests:
PASS / FAIL

Face regression:
PASS / FAIL

DOM regression:
PASS / FAIL

Privacy regression:
PASS / FAIL

Masking:
UNCHANGED / REGRESSED

Sanitized-data boundary:
PASS / FAIL

Action-execution boundary:
PASS / FAIL

Security findings:

Remaining risks:

Next phase:
```

---

# 39. FINAL ACCEPTANCE CRITERIA

The implementation is complete only when ALL are true:

## MCP

* [ ] Local MCP interface works.
* [ ] MCP exposes only approved tools.
* [ ] MCP can expose sanitized observation.
* [ ] MCP can expose safe targets.
* [ ] MCP can receive action requests.
* [ ] MCP cannot bypass the Action Validator.
* [ ] MCP does not implement a second privacy engine.

## Action Validator

* [ ] Action contract exists.
* [ ] Supported actions are explicitly defined.
* [ ] Invalid actions are rejected.
* [ ] Stale observations are rejected.
* [ ] Invalid targets are rejected.
* [ ] Changed page state is handled.
* [ ] Changed frame state is handled.
* [ ] Arbitrary JavaScript is rejected.
* [ ] Unsupported actions are rejected.
* [ ] Validator fails closed.
* [ ] Executor is only called after ALLOW.

## BrowserOS

* [ ] BrowserOS communicates through MCP.
* [ ] BrowserOS cannot directly bypass MCP.
* [ ] BrowserOS cannot directly bypass the Action Validator.
* [ ] BrowserOS receives sanitized information only.

## Privacy

* [ ] Existing face masking remains unchanged.
* [ ] Existing DOM masking remains unchanged.
* [ ] Existing email masking remains unchanged.
* [ ] Existing phone masking remains unchanged.
* [ ] Existing password masking remains unchanged.
* [ ] Existing YuNet behavior remains unchanged.
* [ ] Existing coordinate calculations remain unchanged.
* [ ] Existing privacy scheduling remains unchanged.
* [ ] No raw screenshot reaches MCP.
* [ ] No raw DOM reaches MCP.
* [ ] No raw email reaches MCP.
* [ ] No raw phone reaches MCP.
* [ ] No password reaches MCP.
* [ ] No raw face data reaches MCP.

## Reliability

* [ ] Build passes.
* [ ] Unit tests pass.
* [ ] Privacy tests pass.
* [ ] Vision tests pass.
* [ ] DOM tests pass.
* [ ] MCP tests pass.
* [ ] Action Validator tests pass.
* [ ] Browser regression passes.
* [ ] Failure isolation passes.

---

# 40. ANTIGRAVITY — EXECUTION INSTRUCTIONS

Read this entire document before modifying anything.

You are implementing:

> **LOCAL MCP + ACTION VALIDATOR INTEGRATION**

You are NOT implementing:

* a new AI agent
* a new vision model
* a new DOM parser
* a new privacy engine
* a new masking algorithm
* a new redaction system

BrowserOS is the external AI-agent layer.

The existing DOM + YuNet + Privacy Engine is the privacy core.

## THE PRIVACY CORE IS FROZEN.

Do not modify it for MCP or Action Validator integration.

---

# 41. ONE PHASE AT A TIME

DO NOT implement the entire plan in one operation.

Start with:

> PHASE 1 ONLY

After Phase 1:

1. Report inspected files.
2. Report existing architecture.
3. Report baseline build.
4. Report baseline tests.
5. Report face regression results.
6. Report DOM regression results.
7. Report privacy regression results.
8. Identify sanitized-observation boundary.
9. Identify action-execution boundary.
10. Identify existing BrowserOS integration.
11. Identify existing MCP code if any.
12. Create the Phase 1 report.
13. STOP.

Do NOT automatically continue to Phase 2.

Wait for explicit approval.

---

# 42. IF EXISTING COMPONENTS ALREADY EXIST

Before creating anything:

Search the repository for:

```text
MCP
Model Context Protocol
action validator
action-validator
BrowserOS
executor
action request
action response
sanitized observation
```

If equivalent functionality already exists:

* inspect it
* reuse it where safe
* do not create duplicate implementations

Do not refactor working privacy code just to make existing components fit MCP.

---

# 43. MINIMAL-CHANGE PRINCIPLE

For this implementation:

> Additive changes are preferred.

Prefer:

```text
NEW MCP LAYER
+
NEW ACTION VALIDATOR
+
SMALL EXECUTION BOUNDARY
```

Avoid:

```text
LARGE REFACTOR
+
PRIVACY REWRITE
+
VISION REWRITE
+
DOM REWRITE
```

Do not perform unrelated cleanup.

Do not optimize unrelated code.

Do not upgrade dependencies unless absolutely required.

---

# 44. DEPENDENCY RULE

Before adding an MCP dependency:

1. Check the current package manager.
2. Check the current runtime.
3. Check whether MCP dependencies already exist.
4. Select the smallest compatible implementation.
5. Explain why the dependency is required.
6. Do not replace existing dependencies unnecessarily.

MCP itself should remain local.

Do not add paid APIs merely to implement MCP.

---

# 45. SECURITY PRINCIPLE

The system must enforce:

```text
PRIVACY FIRST
      ↓
SANITIZED OBSERVATION
      ↓
MCP
      ↓
BROWSEROS
      ↓
ACTION VALIDATION
      ↓
EXECUTION
```

Not:

```text
BROWSEROS
      ↓
RAW DATA
      ↓
ACTION
      ↓
PRIVACY
```

---

# 46. FINAL ARCHITECTURAL PRINCIPLE

The project should be explainable to an SIH judge as:

> "The browser page is first perceived using DOM and on-device vision. Sensitive information is removed by our privacy engine before any agent-facing interface receives the observation. MCP provides a controlled local interface for BrowserOS to access only sanitized information and request actions. Every requested action then passes through our Action Validator before reaching the browser executor."

The implementation must preserve this boundary.

---

# 47. FINAL PRIORITY ORDER

If any conflict occurs:

```text
1. Privacy / Masking
2. Existing Perception
3. Existing Application Stability
4. Action Validator
5. MCP Integration Convenience
```

If MCP integration threatens privacy:

> STOP MCP implementation.

If Action Validator integration threatens privacy:

> STOP Action Validator integration.

Never modify the working masking system merely to make the new feature easier.

---

# FINAL COMMAND

Start with PHASE 1 ONLY.

Inspect first.

Do not modify privacy-critical files.

Do not modify masking.

Do not modify YuNet.

Do not modify DOM detection.

Do not modify privacy thresholds.

Do not modify coordinate calculations.

Do not modify redaction geometry.

Do not modify privacy scheduling.

Establish the baseline.

Create:

```text
MCP_ACTION_PHASE1_BASELINE.md
```

Then STOP and wait for explicit approval before proceeding to Phase 2.

```

**This is the version I recommend you give Antigravity.** The key protection is repeated deliberately: **MCP is downstream of the existing privacy engine, and neither MCP nor Action Validator is allowed to alter the masking pipeline.**
```
