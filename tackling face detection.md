# SIH 26171 — Image-Based Face Detection

## Context

This project implements:

**SIH 2026 — Problem Statement 26171**
**On-device Visual Perception for Light-weight Browser Agents**

The face detector is NOT a webcam/video detector.

The input is a **static screenshot/image captured from the browser page**.

The detector must process webpage screenshots/images locally and identify faces that may represent sensitive visual information.

The implementation must remain lightweight and must respect the SIH requirement for on-device visual perception with low latency.

The target is NOT maximum GPU utilization.

The target is:

> Maximum useful perception performance per unit of CPU/GPU/RAM/VRAM while maintaining reliable detection.

---

# 1. FIRST — UNDERSTAND THE CURRENT PIPELINE

Before modifying anything, inspect the complete image-processing pipeline.

Determine:

Browser page
↓
Screenshot capture
↓
Image preprocessing
↓
Face detection
↓
Bounding box
↓
Coordinate transformation
↓
Privacy/redaction layer
↓
Sanitized image/context
↓
Browser agent

Identify exactly where face detection occurs.

Report:

* Input image source
* Input image dimensions
* Image format
* Image preprocessing
* Model
* Model format
* Runtime
* Backend
* CPU/GPU execution provider
* Quantization
* Confidence threshold
* Maximum faces
* Inference latency
* Output coordinates
* Redaction coordinates

DO NOT change code before this investigation.

---

# 2. REPRODUCE THE FAILURE USING STATIC IMAGES

Create a deterministic test set.

Do NOT use webcam/video.

Test images should include:

### Test 1

One clearly visible frontal face.

### Test 2

Multiple faces.

### Test 3

Small face.

### Test 4

Large face.

### Test 5

Partially visible face.

### Test 6

Side-profile face.

### Test 7

Face in a webpage screenshot.

### Test 8

Face embedded inside an image element.

### Test 9

Face inside a dynamically rendered webpage.

### Test 10

No-face image.

For every image record:

* detected faces
* confidence
* bounding boxes
* inference time
* image dimensions
* preprocessing dimensions

---

# 3. DETERMINE WHAT "NOT WORKING" ACTUALLY MEANS

Classify the current failure into one of these categories.

### A — Model does not detect the face

Example:

Input:
person.jpg

Expected:
1 face

Actual:
0 faces

Then investigate:

* model
* preprocessing
* model input format
* confidence threshold
* runtime
* quantization
* image normalization

---

### B — Model detects the face but bounding box is wrong

Example:

Detection:

x=100
y=200
width=200
height=200

But the redaction appears somewhere else.

Then the ML model is NOT necessarily the problem.

Investigate:

* image scaling
* screenshot scaling
* devicePixelRatio
* CSS pixels vs bitmap pixels
* canvas dimensions
* coordinate normalization
* crop offsets

---

### C — Face is detected only sometimes

Investigate:

* confidence threshold
* input resolution
* preprocessing
* model limitations
* quantization
* image scaling

Do not immediately change the model.

---

### D — Face detection is accurate but too slow

Investigate:

* model size
* quantization
* execution provider
* image resolution
* unnecessary preprocessing
* repeated model initialization
* unnecessary memory copies

---

# 4. IMAGE RESOLUTION

This is critical.

Do NOT automatically feed a full browser screenshot into the model.

For example:

Browser screenshot:

1920 × 1080

should NOT automatically mean:

Model input:

1920 × 1080

Instead use a controlled perception resolution.

Example:

Screenshot
1920 × 1080
↓
Resize
640 × 360
↓
Face detector

But preserve the original dimensions so that detections can later be mapped back:

640 × 360
↓
coordinate transformation
↓
1920 × 1080

Benchmark several resolutions:

* 320 × 180
* 416 × 234
* 512 × 288
* 640 × 360
* 640 × 480

Measure:

Detection accuracy
Inference latency
CPU
GPU
RAM
VRAM

Do NOT select a resolution based only on FPS.

---

# 5. MODEL SELECTION

Use a lightweight face detector appropriate for static image inference.

Do NOT use a huge multimodal model merely to detect faces.

The face detector should be a specialized perception component.

Prefer:

small model
+
quantization
+
local inference

over:

large VLM
+
remote API

The face detector should run independently from the larger browser-agent reasoning model.

---

# 6. QUANTIZATION

Check whether the current model supports:

INT8
or
FP16

Benchmark the available formats.

Example:

FP32
FP16
INT8

Record:

| Model | Size | Latency | Accuracy | RAM | VRAM |
| ----- | ---: | ------: | -------: | --: | ---: |

Do NOT assume INT8 is automatically better.

Measure it.

If INT8 provides sufficiently similar detection quality with significantly lower resource usage, prefer INT8.

---

# 7. HARDWARE UTILIZATION

The project must be hardware-aware.

The goal is NOT:

GPU = 100%

The goal is:

**low latency + reliable detection + low resource consumption.**

Measure:

### CPU

* average utilization
* peak utilization

### GPU

* utilization
* GPU memory usage

### RAM

* application memory
* peak memory

### VRAM

* model memory
* peak GPU memory

### Inference

* average latency
* P95 latency
* maximum latency

---

# 8. NVIDIA RTX 3050

The development machine may have an RTX 3050 4 GB GPU.

Do NOT assume the application is actually using it.

Verify the execution backend.

Possible architecture:

Image
↓
ONNX Runtime / appropriate local runtime
↓
CUDA / GPU execution provider
↓
RTX GPU

OR:

Image
↓
WebGPU-compatible runtime
↓
GPU

If GPU acceleration is unavailable:

Image
↓
CPU inference

must continue working.

The application must NOT hard-fail because GPU acceleration is unavailable.

---

# 9. DO NOT CONSUME THE ENTIRE GPU

The face detector is only one component of the system.

The browser agent may also require:

* DOM perception
* OCR
* visual grounding
* embedding/model inference
* browser rendering
* agent reasoning

Therefore do NOT allocate the entire GPU to face detection.

Avoid:

* unnecessarily large models
* excessive batch sizes
* unnecessary high-resolution inference
* multiple concurrent inference jobs
* duplicate model instances

The face detector should be lightweight enough to coexist with the rest of the browser-agent pipeline.

---

# 10. MODEL INITIALIZATION

Initialize the detector ONCE.

Bad:

for every screenshot:
load model
create session
inference
destroy model

Correct:

application startup
↓
load model
↓
create inference session
↓
reuse session for every screenshot

The model must remain resident when repeated image analysis is required.

---

# 11. IMAGE MEMORY MANAGEMENT

Inspect every image copy.

Avoid unnecessary:

Image
→ Canvas
→ Blob
→ ArrayBuffer
→ Tensor
→ GPU buffer

copies.

Use the minimum required transformations.

Check for:

* unreleased ImageBitmap
* unreleased GPU resources
* duplicate ArrayBuffers
* repeated tensor allocation
* unnecessary canvas copies
* stale screenshot buffers

---

# 12. STATIC IMAGE BATCHING

If multiple independent screenshots/images need processing, investigate whether batching improves performance.

But DO NOT enable large batches by default.

Benchmark:

batch = 1
batch = 2
batch = 4

Choose based on:

latency
memory
throughput

For interactive browser-agent actions, prioritize latency over raw batch throughput.

---

# 13. SUB-500 ms REQUIREMENT

The SIH problem statement describes lightweight visual perception with a target of sub-500 ms per webpage action.

Therefore measure the COMPLETE perception path.

Do NOT measure only:

model inference = 30 ms

and claim:

system = 30 ms

Measure:

Screenshot capture
+
preprocessing
+
model inference
+
postprocessing
+
coordinate transformation
+
redaction preparation

Total:

**Perception latency**

The complete path should be benchmarked against the sub-500 ms target.

---

# 14. FACE DETECTION SHOULD NOT BLOCK THE ENTIRE SYSTEM

Use asynchronous processing where appropriate.

Architecture:

Browser Screenshot
↓
Image Queue
↓
Perception Worker
↓
Face Detector
↓
Detection Result
↓
Privacy Mask
↓
Sanitized Image

The browser UI should remain responsive.

However:

DO NOT create an unlimited queue.

If a newer screenshot supersedes an older screenshot, discard obsolete work when safe.

For interactive browser agents:

latest useful screenshot

>

processing every historical screenshot

---

# 15. DETECTION CONFIDENCE

Benchmark confidence thresholds.

For example:

0.30
0.40
0.50
0.60
0.70

For every threshold record:

* true detections
* false positives
* missed faces

Do not lower the threshold simply to increase detection count.

---

# 16. SMALL FACES ARE IMPORTANT

Browser screenshots may contain faces that occupy only a small portion of the screenshot.

Example:

1920 × 1080 screenshot

Face:

80 × 80 pixels

A naive resize to:

320 × 180

may make the face too small for reliable detection.

Therefore test the relationship between:

original face size

and

detector input size.

If necessary, implement intelligent image handling.

Possible approach:

Full screenshot
↓
low-resolution global detection
↓
candidate regions
↓
higher-resolution crop
↓
face detection

BUT:

Only introduce this multi-stage approach if benchmarking proves it is necessary.

Do not add complexity prematurely.

---

# 17. SCREENSHOT COORDINATE TRANSFORMATION

This is likely to be important.

Example:

Original screenshot:

1920 × 1080

Detector input:

640 × 360

Scale:

X = 1920 / 640 = 3
Y = 1080 / 360 = 3

If detector returns:

x=100
y=50
w=80
h=80

map back to:

x=300
y=150
w=240
h=240

Verify this mathematically.

Do not mix:

CSS pixels
device pixels
bitmap pixels
canvas pixels

---

# 18. TEST FACE REDACTION

Detection alone is not enough.

For every detected face:

Detection
↓
Bounding box
↓
Coordinate transformation
↓
Privacy mask
↓
Rendered result

Verify that the mask completely covers the original face.

Test:

* face near left edge
* face near right edge
* face near top
* face near bottom
* multiple faces
* partially visible faces
* small faces

---

# 19. FALSE POSITIVE TEST

Test images containing:

* human-like drawings
* profile photos
* posters
* statues
* mannequins
* screenshots of faces
* emojis

Record false positives.

The system should not blindly redact every visually similar object.

---

# 20. HARDWARE BENCHMARK MODE

Create a development-only benchmark command.

Example:

npm run benchmark:face

Output:

================================
FACE DETECTION BENCHMARK
========================

Input:
1920 × 1080

Model: <model>

Quantization:
INT8

Backend: <backend>

---

Preprocessing:
XX ms

Inference:
XX ms

Postprocessing:
XX ms

Total:
XX ms

---

CPU:
XX %

GPU:
XX %

RAM:
XX MB

VRAM:
XX MB

Faces:
X

Average confidence:
XX

================================

Run at least 100 image inferences.

Report:

Average
P50
P95
P99
Maximum

Do not rely on a single inference measurement.

---

# 21. HARDWARE COMPARISON

Benchmark at least:

### CPU mode

GPU disabled.

### GPU mode

GPU acceleration enabled.

Compare:

| Metric             | CPU | GPU |
| ------------------ | --: | --: |
| Average latency    |     |     |
| P95 latency        |     |     |
| CPU usage          |     |     |
| GPU usage          |     |     |
| RAM                |     |     |
| VRAM               |     |     |
| Detection accuracy |     |     |

If GPU provides only a small latency improvement while consuming substantially more resources, document that result rather than forcing GPU mode.

---

# 22. FAILURE FALLBACK

The pipeline must support:

GPU available
→ GPU inference

GPU unavailable
→ CPU inference

GPU initialization fails
→ CPU inference

Model loading fails
→ explicit error

Invalid image
→ explicit error

No face
→ valid zero-detection result

Do not treat "no face detected" as an exception.

---

# 23. DO NOT CHANGE THE DOM PERCEPTION PIPELINE

The current project also contains DOM perception.

Face detection is an independent perception capability.

Do NOT break:

* DOM extraction
* accessibility extraction
* screenshot capture
* browser messaging
* overlay
* redaction
* agent communication

Before modifying code:

1. inspect git status
2. create a dedicated branch
3. make small changes
4. test after each change

---

# 24. ACCEPTANCE CRITERIA

Face detection is considered fixed only when:

[ ] Static images are detected reliably.

[ ] Multiple faces work.

[ ] Small faces are tested.

[ ] Bounding boxes are correct.

[ ] Screenshot coordinate mapping is correct.

[ ] Redaction completely covers detected faces.

[ ] No unnecessary model reload occurs.

[ ] CPU usage is measured.

[ ] GPU usage is measured.

[ ] RAM usage is measured.

[ ] VRAM usage is measured.

[ ] GPU fallback works.

[ ] CPU fallback works.

[ ] No memory leak occurs during repeated image processing.

[ ] 100-image benchmark completes successfully.

[ ] P95 perception latency is measured.

[ ] Complete perception pipeline is benchmarked against the SIH sub-500 ms target.

[ ] DOM perception remains functional.

[ ] Browser-agent workflow remains functional.

---

# 25. FINAL REPORT

After making changes, provide:

## Root Cause

What specifically caused face detection to fail?

## Model

Model:
Format:
Quantization:
Size:

## Runtime

Runtime:
Backend:
Execution provider:

## Image

Original resolution:
Detector resolution:

## Performance

Average inference:
P95 inference:
Maximum inference:

Complete perception latency:
P95 complete perception latency:

CPU:
GPU:
RAM:
VRAM:

## Accuracy

Single face:
Multiple faces:
Small faces:
Partial faces:
False positives:

## Changes

List every modified file and explain why it changed.

## Regression

Confirm:

DOM perception:
Screenshot capture:
Privacy masking:
Browser-agent workflow:

## Remaining Issues

List unresolved issues honestly.
