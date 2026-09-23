# Sanitization & Perception Mapping

This document tracks exactly where and how different perception data sources are routed through the Privacy Engine to prevent PII leakage while maintaining structural accuracy for the VLM.

## 1. DOM Extraction (`source: ['DOM']`)
*   **Where it happens:** Content Script (`extension/src/content/`)
*   **Data Captured:** HTML element bounding boxes (`getBoundingClientRect`), ARIA roles, and `innerText`.
*   **Text Sanitization:** **YES**. If a paragraph contains an Aadhaar number, the text payload sent to the remote Planner replaces the digits with `<REDACTED_AADHAAR>`.
*   **Visual/Canvas Redaction:** **NO**. We intentionally ignore DOM bounding boxes when drawing black rectangles. Why? Because DOM boxes often wrap entire paragraphs or `<div>` structures. If we used them, we would suffer from "DOM Spillage" and blackout massive, harmless sections of the page.

## 2. Tesseract.js OCR (`source: ['OCR']`)
*   **Where it happens:** Offscreen Document / Vision Engine (`extension/src/vision/engine.ts`)
*   **Data Captured:** Pixel-perfect, word-level bounding boxes and extracted text from the screenshot.
*   **Text Sanitization:** **YES**. Any raw text tokens matching Aadhaar/PAN are replaced with `<REDACTED_...>` in the JSON payload.
*   **Visual/Canvas Redaction:** **YES**. Because Tesseract provides exact micro-coordinates wrapped tightly around the specific digits, the Privacy Engine (`extension/src/privacy/engine.ts`) uses *only* these `['OCR']` coordinates to draw the physical black boxes (`ctx.fillRect`) on the image. This guarantees surgical precision.

## 3. Transformers.js / ONNX Vision (Upcoming Phase)
*   **Where it will happen:** Offscreen Document (via WebGPU)
*   **Data Captured:** Hardware-accelerated UI component detection and complex background text extraction.
*   **Sanitization Strategy:** Will eventually replace Tesseract.js. The high-precision WebGPU bounding boxes will become the new source of truth for drawing the Semantic Blackout Boxes, ensuring both perfect accuracy and strict compliance with ISRO's <150MB RAM / low-latency constraints.
