# Privacy Engine Architecture Schematic

This schematic illustrates our dual-layered approach to Redaction. It perfectly visualizes how we solve the "DOM Spillage" problem while retaining perfect spatial accuracy for the VLM planner.

```mermaid
flowchart TD
    classDef safe fill:#d1fae5,stroke:#059669,stroke-width:2px,color:#064e3b;
    classDef blocked fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#991b1b;
    classDef engine fill:#eff6ff,stroke:#2563eb,stroke-width:2px,color:#1e3a8a;
    classDef source fill:#f3f4f6,stroke:#4b5563,stroke-width:1px;

    Screenshot[Raw Screenshot Pixels]:::source
    DOM[Live DOM Tree]:::source
    
    Screenshot --> Tesseract[Vision Engine \n Tesseract.js / ONNX]:::engine
    DOM --> ContentScript[Content Script \n getBoundingClientRect]:::engine
    
    Tesseract -- "Word-level Micro-Coordinates\n source: ['OCR']" --> Privacy[Privacy Engine]:::engine
    ContentScript -- "Large HTML Element Bounds\n source: ['DOM']" --> Privacy
    
    Privacy --> Route1{Does it contain \n PII / Secret?}
    
    Route1 -- YES & source: ['DOM'] --> TextRedact[JSON Payload Text Redaction\n e.g., REDACTED_AADHAAR]:::safe
    Route1 -- YES & source: ['OCR'] --> CanvasRedact[Physical Canvas Blackout \n ctx.fillRect]:::blocked
    
    TextRedact --> VLM[VLM Planner receives \n structural context without PII]
    CanvasRedact --> VLMImage[VLM Planner sees \n Image with surgical black boxes]
```

### How to Explain This to the Juries:

1. **The Left Side (OCR/Vision):** Explain that standard DOM scraping is flawed because HTML wrappers (`<div>`, `<p>`) are often much larger than the sensitive text itself. If we just blacked out DOM coordinates, we would destroy safe surrounding context ("DOM Spillage").
2. **The OCR Intercept:** To fix this, we run a local, offline OCR pass directly on the image pixels. The OCR engine finds the exact `X,Y` coordinates of *just* the 12 digits of the Aadhaar number.
3. **The Split Execution:**
    *   The **DOM** is used to sanitize the raw text being sent to the LLM (replacing the string).
    *   The **OCR** is strictly used to paint the physical black boxes on the screenshot, ensuring surgical, pixel-perfect visual redaction that never hides safe data from the AI.
