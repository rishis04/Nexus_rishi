# Demo Flow for SIH 26171

This guide provides the official flow to demonstrate the Antigravity architecture to the SIH Jury, highlighting the security constraints and advanced vision capabilities.

## Step 1: Initialization
1. Load the extension unpacked in Google Chrome via `chrome://extensions/`.
2. Open the Antigravity Sidepanel.
3. Start the FastAPI local planner server (`uvicorn planner.main:app`).

## Step 2: Form Interaction & PII Redaction
1. Navigate to a test login portal that requests PII (e.g., an Aadhaar or PAN number).
2. Ask the agent via the Sidepanel: *"Log in to this site."*
3. **Demonstrate:** Open the Extension Network tab to show the egress payload. The Jury will observe that the Aadhaar number is replaced with `[REDACTED_AADHAAR]` and the password field boundary is sent purely as coordinates, not as raw DOM.

## Step 3: Capability Vault Execution
1. The planner will return an action referencing `vault://login/...`.
2. **Demonstrate:** Show that the LLM payload *does not* contain the password. The password is typed into the screen utilizing the local IndexedDB Capability Vault directly.

## Step 4: Visual Perception on Opaque Canvases
1. Navigate to the ISRO Bhuvan test map (or equivalent `<canvas>` heavy site).
2. Ask the agent: *"Click on the central map marker."*
3. **Demonstrate:** The system will utilize the WebGPU ONNX vision model (Phase 3) to locate the element via computer vision rather than DOM tree scraping, proving visual grounding functionality.

## Step 5: Adversarial Hardware Bypass
1. Navigate to a portal with strict anti-bot measures.
2. Observe that standard `HTMLElement.click()` triggers are blocked because `event.isTrusted` is `false`.
3. **Demonstrate:** The Orchestrator automatically falls back to `chrome.debugger` (Phase 5), dispatching a native hardware click to bypass the security wall.
