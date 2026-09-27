# Visual Face-Only Redaction Fix Report

## Root cause
The extension was previously masking entire image cards/containers whenever a face was detected inside them. This was caused by the `isProfileImage` logic in `privacy.stub.ts`. The rule evaluated `containsFace`, and if a face intersected ANY DOM region (even a massive 800x600 container), it forcefully assigned that DOM region's bounding box to the privacy redaction engine (`bbox: reg.bbox`) under the label `FACE`. 
This threw away the precise Face coordinates provided by the vision engine and incorrectly expanded the masked area to the entire parent image.

## Data flow
**Before:**
```text
Raw Detection (100x100) 
→ Candidate Image Region (800x600)
→ `isProfileImage` triggers because of intersection
→ Privacy Engine merges `bbox: reg.bbox` (800x600)
→ Final Redaction masks 800x600 region
→ VisualPreview draws huge black box over entire image
```

**After:**
```text
Raw Detection (100x100)
→ Candidate Image Region (800x600) is ignored for face-masking since it lacks explicit avatar HTML semantics
→ Raw Face Detection (100x100) pushes directly into `boxesToMask`
→ Final Redaction masks 100x100 region precisely
→ VisualPreview draws precise mask on face
```

## Before
A single face detected inside a large image post caused the **entire image post** to be blacked out, generating massive `[FACE]` blocks and ruining the user experience.

## After
Only the exact face bounding box is masked. If a 1000px image has a 50px face, the 50px face is redacted while the 950px of remaining non-sensitive image stays visible. Small explicit HTML avatars `<img class="avatar">` still retain their fallback full-element masking to ensure unidentifiable icons remain protected.

## Face detection
- **Unique face count**: Deduplicated using IoU in the vision engine.
- **Final FACE region count**: Maps 1:1 to unique, validated face ML detections rather than candidate DOM regions.

## Geometry
- **Raw bbox**: Uses MediaPipe's coordinates transformed to the CSS viewport space.
- **Final bbox**: Retained exactly, without arbitrary padding or `boundingRect` expansions that contaminate parent regions.

## Privacy
- `Email`, `Phone`, `Password`, and `PII` remain protected appropriately, untouched by this vision-centric fix.
- Non-face images (like scenery) are not automatically masked.

## Agent isolation
- **AI agent not running**: `StandaloneAgent` and `orchestrator` are fully detached.

## Regression
- **Manual scrolling safe**: The `PerceptionDaemon` mutation and intersection observers continue safely without starting refresh loops. No autonomous actions execute.

## Tests
- **Unit & Integration Tests**: PASS (66/66)
- **Face Model Checks**: PASS
- **Geometry Checks**: PASS
