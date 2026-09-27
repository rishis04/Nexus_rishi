# AGENT PRIVACY PERCEPTION SEPARATION AUDIT

## 1. Executive Summary

**What is currently coupled?**
The system is heavily coupled through `extension/src/background/orchestrator.ts`. The orchestrator functions as a monolithic loop that linearly drives DOM extraction, Vision inference, Privacy sanitization, LLM planning, and Browser action execution. Privacy detection only occurs *because* the agent loop asks for it during a task. 

**What is already independent?**
The actual *implementations* of the privacy checks (e.g., regexes for PAN/Aadhaar in `privacy.stub.ts`, MediaPipe face detection in `vision/engine.ts`, Canvas redaction blackout) are technically stateless and purely functional. They do not import or depend on the planner or action executors. 

**What must change?**
The execution flow must be inverted. The Browser Extension (Background Service Worker) must continuously or reactively drive DOM/Vision perception and Privacy sanitization independently of whether an AI Task is running. The AI Agent should be moved out to a separate system (or logically separated module) that only receives pre-sanitized DOM/Vision data and emits `StructuredAction` commands, which the extension then validates and executes.

---

## 2. Repository Architecture

### Current Architecture
```text
User initiates task
       |
[ extension/src/background/orchestrator.ts ]
       |-- 1. Triggers DOM Snapshot (content script)
       |-- 2. Triggers Vision/Face (vision/engine.ts)
       |-- 3. Triggers Sanitize (privacy.stub.ts)
       |-- 4. Sends clean data to Planner (network/gate.ts)
       |-- 5. Receives Action
       |-- 6. Validates Action (actions/validator)
       \-- 7. Executes Action (actions/executor)
```

---

## 3. Module Classification Table

| File/Module | Category | Purpose | Depends On | Used By | Safe to Separate? |
|---|---|---|---|---|---|
| `background/orchestrator.ts` | AGENT | Monolithic task state machine | Everything | UI | **NO** (Must be heavily refactored) |
| `network/gate.ts` | AGENT | Server comms & mock planner | Shared config | Orchestrator | YES |
| `actions/executor/*` | ACTION_EXECUTION | Executes clicks/typing via debugger | Chrome API | Orchestrator | YES |
| `perception/dom/*` | DOM_PERCEPTION | Extracts DOM & ARIA | Chrome API | Content Script | YES |
| `vision/engine.ts` | VISUAL_PERCEPTION | Coordinates OCR, UI, Face detection | ONNX/MediaPipe | Orchestrator | YES |
| `vision/face-detection.ts` | FACE_DETECTION | MediaPipe Face bounding boxes | MediaPipe | Vision Engine | YES |
| `privacy.stub.ts` | PRIVACY_DETECTION / REDACTION | Detects PII, renders redaction canvas | DOM & Vision output | Orchestrator | YES |
| `content/observers.ts`| DOM_PERCEPTION | Listens to mutations/scrolls | DOM API | Content Script | YES |

---

## 4. Privacy Dependency Graph

```text
Webpage 
  → content/observers.ts (Mutation Event)
  → perception/dom/snapshot.ts (DOM/ARIA Tree)
  → vision/engine.ts (Screenshot → MediaPipe Face Detect)
  → privacy.stub.ts (Regex/Rule classification on DOM + Vision)
  → privacy.stub.ts (Canvas 2D Blackout Redaction)
```

---

## 5. Agent Dependency Graph

```text
User 
  → background/orchestrator.ts (Session State)
  → network/gate.ts (Planner request)
  → [External Server / Mock Planner]
  → background/orchestrator.ts (Receives Action)
  → actions/validator/* (Validates Action)
  → actions/executor/* (Native browser execution)
```

---

## 6. Coupling Report

1. **Coupling**: `orchestrator.ts` → `privacy.stub.ts`
   - **Type**: Agent Loop triggers Privacy.
   - **Why it exists**: The agent wants to sanitize data before sending to the server.
   - **Is it necessary?**: No. Privacy should observe the page independently and maintain a clean state regardless of agent requests.
   - **Boundary**: Extension should maintain a `SanitizedState` singleton. Agent should just query it.

2. **Coupling**: `network/gate.ts` → `mock planner`
   - **Type**: Extension network layer contains an entire fallback AI agent planner.
   - **Why it exists**: Fallback when no LLM server is available.
   - **Is it necessary?**: No. The mock planner is purely agent logic and belongs in the agent subsystem.

---

## 7. Stub/Mock Report

- `privacy.stub.ts`: **REAL / PARTIAL**. Despite the `.stub` naming, it contains *real* Regex detection for Aadhaar, PAN, Email, Phone, and actual Canvas 2D redaction logic.
- `network/gate.ts` mock planner: **AGENT MOCK**. Contains a hardcoded heuristic tree (if text includes "scroll", return scroll down action).
- `visionEngine` (UI ONNX model): **REAL**. It actually loads an ONNX model and parses NMS boxes if the model is present.
- `face-detection.ts`: **REAL**. Uses MediaPipe WASM.

---

## 8. Independent Operation Assessment

1. **Can DOM/ARIA perception run without the agent?** **YES**. It's just a content script gathering nodes.
2. **Can screenshot capture run without the agent?** **YES**. `chrome.tabs.captureVisibleTab` is independent.
3. **Can face detection run without the agent?** **YES**. `face-detection.ts` only needs an `ImageBitmap`.
4. **Can email detection run without the agent?** **YES**. It is a pure function in `privacy.stub.ts`.
5. **Can phone detection run without the agent?** **YES**. 
6. **Can password detection run without the agent?** **YES**. It reads `<input type="password">` from the DOM snapshot.
7. **Can redaction overlays operate without the agent?** **YES**. The canvas redaction takes boxes and an image.
8. **Which exact agent modules must remain available for privacy/perception to work?** **NONE**.

---

## 9. Proposed Separation

```text
                         USER
                           |
                           v
                    +--------------+
                    |  AI AGENT    | <-- (Standalone Process / Remote / Decoupled Module)
                    | Intent       |
                    | Planning     |
                    +------+-------+
                           |
                    Structured Action (JSON)
                           |
                           v
              +---------------------------+
              | BROWSER EXTENSION         |
              |   [Observer Daemon]       |
              |      - DOM/ARIA           |
              |      - Vision/Face        |
              |      - Privacy & Masking  |
              |                           |
              |   [Action Gateway]        |
              |      - Validator          |
              |      - Executor           |
              +---------------------------+
```

---

## 10. Files to Keep in Extension/Privacy System
- `perception/dom/*`
- `vision/*` (except orchestrator couplings)
- `privacy/*`
- `content/*`
- `actions/validator/*`
- `actions/executor/*`
- `capture/*`
- `security/*`

---

## 11. Files Belonging to Agent (To be Extracted)
- `background/orchestrator.ts`
- `network/gate.ts` (specifically the mock planner logic and plan generation loop)
- `ui/*` (Agent specific interaction sidepanels)

---

## 12. Shared Files (Contracts)
- `contracts/ts/*` (Schemas for `StructuredAction`, `DomSnapshot`, `VisionResult`)

---

## 13. Risk Assessment

**Risk**: Breaking the Agent Loop
- **Cause**: Moving `orchestrator.ts` out means the extension no longer loops automatically.
- **Impact**: High. The agent will stop functioning until the external protocol is connected.
- **Mitigation**: Implement the external protocol in the extension (e.g., a WebSocket server/client or API endpoint) *before* deleting the orchestrator.

**Risk**: High Resource Usage
- **Cause**: If Privacy Perception runs continuously (mutation driven) instead of on-demand (agent driven), CPU usage will spike.
- **Impact**: Browser tab lag.
- **Mitigation**: Implement strict debouncing in `content/observers.ts` and only run heavy Vision/Face checks when significant visual changes occur, or maintain a "Privacy Watchdog" mode.

---

## 14. Migration Plan

- **Phase 1**: Audit only. (Current state)
- **Phase 2**: Refactor `orchestrator.ts` to separate the "Perception Pipeline" from the "Action Loop".
- **Phase 3**: Create the external API listener in the background worker to accept `StructuredAction`.
- **Phase 4**: Extract the "Action Loop" and planner into a separate repository/module.
- **Phase 5**: Update tests to verify privacy daemon runs autonomously.
