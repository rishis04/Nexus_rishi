# SIH 26171 — Privacy Perception & Own-Profile Redaction Fix Plan

## Purpose

This document is a **targeted engineering plan for Antigravity** to diagnose and fix the current privacy/redaction failure where:

- profiles belonging to other people are being redacted;
- the user's own profile surface is not consistently being redacted;
- this occurs on dynamic social platforms such as LinkedIn, Instagram, Facebook, and potentially other sites.

The goal is **NOT** to add site-specific masking rules.

The goal is to correct the underlying perception → privacy → redaction architecture so that the same privacy mechanism can identify and protect sensitive profile surfaces regardless of which website renders them.

---

# 1. NON-NEGOTIABLE IMPLEMENTATION RULES

Antigravity MUST follow these rules throughout this task.

## 1.1 No hardcoding

Do NOT hardcode:

- LinkedIn-specific selectors
- Instagram-specific selectors
- Facebook-specific selectors
- usernames
- profile names
- profile URLs
- profile IDs
- CSS class names from one specific website
- fixed coordinates
- fixed screen positions
- fixed bounding boxes
- known profile-image URLs
- known avatar URLs
- known DOM paths
- known React component names
- known website-specific DOM structures
- hardcoded PII values
- hardcoded face locations
- hardcoded redaction locations
- hardcoded detection results
- hardcoded confidence values
- hardcoded model outputs
- hardcoded benchmark results
- special-case conditions such as:

```text
if website == LinkedIn
if website == Instagram
if username == <specific user>
if element.class == <specific social-media class>
```

These are explicitly forbidden.

The implementation must derive decisions from actual runtime information.

---

# 2. DO NOT PATCH THE SYMPTOM

The observed symptom is:

```text
Other person's profile
        ↓
masked

User's own profile
        ↓
not masked
```

Do NOT interpret this as:

> "Add a rule to mask my profile."

Instead investigate:

```text
PAGE
 ↓
DOM / ARIA PERCEPTION
 ↓
PERCEPTION REGION
 ↓
CONFIDENCE ROUTING
 ↓
VISUAL PERCEPTION IF REQUIRED
 ↓
PERCEPTION FUSION
 ↓
PII / SENSITIVE CONTENT DETECTION
 ↓
REDACTION DECISION
 ↓
REDACTION REGION
 ↓
OVERLAY / MASK
```

Find the **first stage where the user's own profile differs from a correctly masked profile**.

That is the stage that must be fixed.

---

# 3. CURRENT CODEBASE PROBLEM TO INVESTIGATE

The current implementation has several architectural weaknesses that must be verified against the actual repository before modifying anything.

## 3.1 DOM perception coverage

The current DOM perception layer primarily collects explicitly recognized interactive/semantic elements and certain elements with interaction-related properties.

This can miss profile surfaces represented by:

- generic `<div>` elements;
- nested component trees;
- CSS background images;
- dynamically inserted elements;
- lazy-loaded content;
- shadow DOM;
- custom web components;
- visual-only UI;
- canvas;
- SVG structures;
- elements whose semantics are not exposed through obvious ARIA metadata.

### Required investigation

Determine whether the user's own profile surface is actually represented in the perception output.

Do NOT assume that it is.

---

# 4. FIRST TASK — REPRODUCE THE BUG

Before changing implementation, create a reproducible test case.

Use a controlled environment and inspect:

1. a profile belonging to another person that is currently masked;
2. the user's own profile that is currently not masked.

Capture the perception pipeline output for both.

Do NOT record real sensitive values in logs.

Use hashes, labels, IDs, or sanitized representations where possible.

---

# 5. CREATE A PERCEPTION DEBUG REPORT

For each profile surface, record:

```text
Perception Region ID
Source
DOM tag
Semantic role
Accessible name
Text presence
Image presence
Image type
CSS background presence
SVG presence
Canvas presence
Shadow DOM presence
Bounding box
Visibility
Interactability
Frame ID
Origin
Mutation timestamp
Routing confidence
Selected perception route
Vision invoked?
OCR invoked?
PII detection invoked?
Sensitivity result
Redaction decision
Redaction bounding box
Overlay created?
```

Do NOT log:

- passwords
- authentication tokens
- raw personal information
- full screenshots containing unnecessary PII
- raw profile information unless absolutely required for local debugging

Prefer metadata and sanitized identifiers.

---

# 6. COMPARE WORKING VS BROKEN PROFILE

Build a comparison table internally.

Example:

```text
                        Other Profile       Own Profile

DOM region discovered       YES                  ?
ARIA information             YES                  ?
Accessible name              YES                  ?
Image element                YES                  ?
CSS background               ?                    ?
Shadow DOM                   ?                    ?
Canvas                       ?                    ?
Bounding box                 YES                  ?
Visibility                  YES                  ?
Confidence                  ?                    ?
Vision invoked              ?                    ?
Face detected               YES                  ?
PII detected                YES                  ?
Redaction generated         YES                  ?
Overlay rendered            YES                  ?
```

The actual values must come from runtime observation.

Do NOT fill missing values manually.

---

# 7. FIX THE PERCEPTION COVERAGE PROBLEM

If the user's profile surface is absent from the perception representation, improve the generic perception system.

The perception system must be able to identify meaningful visual regions even when they are represented by generic DOM structures.

It must account for:

- generic containers with meaningful rendered content;
- images;
- CSS background images;
- SVG;
- canvas;
- shadow DOM;
- dynamically inserted content;
- lazy-loaded content;
- custom components;
- iframe boundaries;
- responsive layouts.

Do NOT simply collect every `<div>`.

That would create excessive noise and destroy the performance model.

Instead introduce a **generic region-discovery strategy** based on measurable evidence.

Potential signals include:

- rendered geometry;
- image/media content;
- accessibility semantics;
- visual prominence;
- interaction capability;
- DOM ancestry;
- text relationships;
- CSS rendering information;
- viewport visibility;
- change frequency;
- overlap;
- component structure.

The implementation must remain consistent with the project's DOM/ARIA-first and confidence-driven architecture.

---

# 8. FIX CSS-BACKGROUND IMAGE COVERAGE

A profile image may not exist as:

```html
<img>
```

It may instead be rendered through CSS.

The perception system must be able to recognize meaningful rendered image regions without relying on a specific site's CSS class.

Inspect computed rendering information where appropriate.

Possible evidence includes:

```text
background-image
background-size
background-position
rendered dimensions
visibility
opacity
clipping
```

Do not treat every CSS background as PII.

The system must produce a candidate region and allow the privacy/vision pipeline to determine whether it is sensitive.

---

# 9. FIX SHADOW DOM / CUSTOM COMPONENT COVERAGE

Modern websites may use:

```text
Shadow DOM
Custom Elements
Web Components
```

The perception system should inspect accessible/open structures where browser APIs permit it.

Do not bypass browser security boundaries.

Do not attempt to access inaccessible cross-origin content.

Maintain:

```text
origin
frame ID
security boundary
```

for every discovered region.

---

# 10. FIX DYNAMIC CONTENT HANDLING

Social platforms are single-page applications.

A profile surface may appear:

```text
initial page
    ↓
JavaScript executes
    ↓
component inserted
    ↓
image loaded
    ↓
layout changes
    ↓
avatar rendered
```

The privacy system must react to meaningful changes.

Use the existing mutation/dirty-region architecture.

A newly inserted or visually changed region should become eligible for re-perception.

Do NOT continuously scan the entire page on every mutation.

Use dirty-region/invalidation logic.

---

# 11. FIX LAZY-LOADED MEDIA

Profile images can appear only after:

- scrolling;
- intersection with viewport;
- network loading;
- component hydration;
- user interaction.

The system must recognize when previously incomplete regions become meaningful.

The sequence should be:

```text
initial perception
        ↓
incomplete/unknown region
        ↓
dirty event / media load / layout change
        ↓
re-perception
        ↓
privacy analysis
```

Unknown must not silently become trusted.

---

# 12. FIX CONFIDENCE ROUTING

The current architecture is DOM/ARIA-first.

Keep that.

Do NOT make visual inference run on every page element.

The correct logic is:

```text
DOM/ARIA explains region well
        ↓
HIGH confidence
        ↓
avoid unnecessary vision

DOM/ARIA insufficient
        ↓
targeted visual analysis

DOM/ARIA + visual evidence still insufficient
        ↓
local visual model / OCR as required
```

The routing decision must use actual evidence.

Do not create website-specific rules.

Do not create rules such as:

```text
LinkedIn → always run vision
Instagram → always run vision
Facebook → always run vision
```

---

# 13. FIX COVERAGE-GAP ROUTING

If a meaningful rendered region exists but is not sufficiently represented by DOM/ARIA, the system must be able to classify it as a **coverage gap**.

A coverage gap should trigger targeted local visual analysis rather than silently disappearing from the privacy pipeline.

Conceptually:

```text
DOM/ARIA perception
        ↓
coverage analysis
        ↓
unexplained meaningful region
        ↓
targeted crop
        ↓
local visual perception
```

The visual analysis must remain local.

---

# 14. FIX VISUAL PERCEPTION

If the user's profile image is not represented sufficiently through DOM/ARIA, the local visual path must be capable of detecting it.

Do not replace the visual model with hardcoded detections.

Do not manually specify face coordinates.

Do not manually identify the user's profile.

The visual model should produce actual detections from actual pixels.

Where a face detector is used:

```text
image
 ↓
face detection
 ↓
bounding box
 ↓
confidence
```

must come from actual inference.

---

# 15. FIX SCREENSHOT FAILURE HANDLING

The repository currently contains a screenshot fallback path.

Investigate whether screenshot failure can result in a placeholder/empty image being passed into visual inference.

This behavior must be changed so that capture failure is represented explicitly.

Correct behavior:

```text
capture requested
      ↓
success
      ↓
valid image

OR

capture requested
      ↓
failure
      ↓
CAPTURE_FAILED
      ↓
do not pretend visual analysis succeeded
```

Do NOT silently substitute a fake image and report successful visual processing.

The system must distinguish:

```text
NO_CAPTURE
```

from:

```text
VALID_CAPTURE
```

---

# 16. PRIVACY ENGINE MUST NOT DEPEND ONLY ON DOM NAMES

Do not rely exclusively on metadata such as:

```text
"profile"
"avatar"
"photo"
"picture"
```

Those may be useful signals, but they cannot be the authoritative privacy decision.

A profile image can be rendered without those strings.

Use a fusion of:

```text
DOM evidence
ARIA evidence
visual evidence
OCR evidence
media type
geometry
semantic context
rendered appearance
```

Then produce:

```text
Perception object
        ↓
Sensitivity classification
```

---

# 17. IMPROVE PRIVACY SIGNAL FUSION

The privacy engine should combine multiple independent signals.

Conceptually:

```text
DOM
ARIA
OCR
VISION
MEDIA
CONTEXT
        ↓
PII / SENSITIVITY FUSION
        ↓
sensitivity result
        ↓
redaction policy
```

Do not allow one fragile DOM string to determine the entire result.

Do not allow one weak visual guess to automatically redact everything either.

Preserve confidence and provenance.

---

# 18. OWN-PROFILE VS OTHER-PROFILE MUST NOT REQUIRE USERNAME HARDcoding

The system should NOT need a hardcoded username to recognize sensitive content.

The objective is not:

```text
identify the user by username
```

The objective is:

```text
identify sensitive personal information
```

If the system can detect:

```text
face
email
phone
private identity information
profile image
```

then it can protect the information without knowing the user's literal username.

If authenticated-user context is eventually required by the architecture, derive it through legitimate runtime/browser signals and keep it generic.

Do NOT store or hardcode the user's personal identity merely to make redaction work.

---

# 19. REDACTION MUST USE ACTUAL GEOMETRY

Once sensitivity is detected, create the redaction region from the actual perception result.

Do not use:

```text
top-left corner
fixed 100×100 box
known avatar coordinates
```

Use:

```text
detected bbox
+
document coordinates
+
viewport coordinates
+
scroll position
+
frame transformation
```

as appropriate.

The redaction must follow the actual rendered object.

---

# 20. REDACTION MUST FOLLOW PAGE CHANGES

If the profile image moves because of:

- scrolling
- responsive layout
- window resize
- modal opening
- dynamic UI
- SPA navigation

the redaction region must be invalidated and recomputed.

Do not leave a stale overlay at the old position.

Correct behavior:

```text
page state changes
       ↓
dirty region
       ↓
invalidate old redaction
       ↓
re-perceive
       ↓
recompute redaction
```

---

# 21. REDACTION OVERLAY VALIDATION

Verify that the privacy engine actually renders the redaction.

Test:

```text
PII detected
    ↓
redaction region generated
    ↓
overlay created
    ↓
overlay positioned correctly
    ↓
overlay covers sensitive pixels
```

Also test:

- high-DPI screens
- browser zoom
- scrolling
- responsive layout
- overlapping elements
- transformed elements
- iframe boundaries

Do not assume that generating a bbox means the user is actually protected.

---

# 22. PRIVACY FAIL-CLOSED BEHAVIOR

Where privacy state is genuinely unknown:

```text
UNKNOWN
 ↓
BLOCK / PROTECT
```

Do not silently treat:

```text
capture failure
vision failure
uncertain region
unknown rendering
```

as:

```text
SAFE
```

However, avoid blindly masking the entire page.

Use the architecture's targeted-region model.

---

# 23. VERIFY THE RUNTIME CONFIGURATION

Inspect the runtime configuration.

The repository currently contains stub/mock-oriented configuration paths.

Determine whether the actual running extension is using:

```text
stub privacy
stub vision
mock server
```

or real implementations.

Do not assume the source implementation is the implementation actually being executed.

Trace:

```text
configuration
 ↓
dependency selection
 ↓
runtime initialization
 ↓
actual module
```

If a stub is active, fix the integration/configuration so the real implementation is used.

Do not fake the stub output to look like the real implementation.

---

# 24. DO NOT BREAK THE EXISTING SUCCESS CASE

Before modifying privacy behavior, record regression tests for profiles that currently work.

After every change:

```text
Other profile masking
        ↓
must continue to work

Own profile masking
        ↓
must now work
```

Also verify that unrelated content is NOT unnecessarily masked.

---

# 25. REQUIRED TEST MATRIX

Create automated/controlled tests for:

## DOM-rendered profile

```text
normal img
```

## CSS-rendered profile

```text
background-image
```

## SVG profile

```text
SVG image/content
```

## Canvas profile

```text
canvas-rendered image
```

## Shadow DOM profile

```text
shadow-root component
```

## Dynamically inserted profile

```text
initially absent
→ inserted later
```

## Lazy-loaded profile

```text
placeholder
→ image loads
```

## Scrolled profile

```text
off-screen
→ enters viewport
```

## Responsive profile

```text
desktop layout
→ mobile/tablet layout
```

## High-DPI profile

```text
devicePixelRatio > 1
```

## Zoomed profile

```text
browser zoom != 100%
```

## Iframe profile

```text
same-origin iframe
```

and, where permitted by the browser security model:

```text
cross-origin iframe
```

must maintain its security boundary.

---

# 26. REQUIRED SECURITY TESTS

Verify that the fix does NOT introduce:

- cross-origin DOM access
- secret leakage
- raw PII transmission
- unsafe screenshot transmission
- arbitrary JavaScript execution
- selector injection
- unsafe remote control
- logging of raw PII
- logging of secrets
- privacy bypass
- hardcoded user identity

---

# 27. REQUIRED REGRESSION TESTS

Run the entire existing test suite.

Then specifically verify:

```text
DOM perception
ARIA extraction
confidence routing
visual inference
visual grounding
PII detection
redaction
egress firewall
action validation
state validation
re-perception
```

The fix must not bypass later privacy/security phases.

---

# 28. PERFORMANCE REQUIREMENTS

Do not solve this by continuously scanning the entire page.

Measure:

- DOM scan latency
- number of regions
- coverage-gap count
- screenshot count
- pixels processed
- vision calls
- OCR calls
- privacy analysis latency
- redaction update latency

Use dirty-region processing.

Use targeted crops where possible.

Do not optimize based on guesses.

---

# 29. REQUIRED DEBUGGING ORDER

Antigravity MUST investigate in this order:

### Step 1

Confirm whether the user's profile surface enters the perception pipeline.

### Step 2

If not, fix generic perception coverage.

### Step 3

Confirm routing.

### Step 4

Confirm whether visual perception is invoked when DOM/ARIA is insufficient.

### Step 5

Confirm actual visual inference output.

### Step 6

Confirm PII/sensitivity detection.

### Step 7

Confirm redaction decision.

### Step 8

Confirm redaction geometry.

### Step 9

Confirm overlay rendering.

### Step 10

Confirm dynamic updates and re-perception.

### Step 11

Confirm no privacy/security regression.

Do NOT jump directly to changing the redaction overlay.

---

# 30. PHASED IMPLEMENTATION

## Phase A — Reproduce and Instrument

Implement only debugging/instrumentation.

Deliver:

```text
docs/own-profile-redaction-debug.md
```

Record the complete pipeline comparison.

### Gate A

Do not modify the privacy algorithm until the first failing stage is identified.

---

## Phase B — Generic Perception Coverage

Fix missing generic rendered regions.

Support the required rendering forms without site-specific selectors.

### Gate B

Run perception regression tests.

The own profile must now enter the perception pipeline.

---

## Phase C — Coverage-Gap Routing

Ensure meaningful unexplained regions trigger targeted local visual perception.

### Gate C

Verify:

```text
DOM-covered region
→ no unnecessary vision

DOM-uncovered meaningful region
→ targeted vision
```

---

## Phase D — Real Visual Perception

Fix screenshot/inference integration.

Ensure actual image data reaches the visual model.

### Gate D

Verify actual model detections.

No mock/fake detections.

---

## Phase E — Privacy Fusion

Connect DOM, ARIA, OCR and vision evidence into the privacy classifier.

### Gate E

Verify both:

```text
other person's profile
```

and:

```text
user's own profile
```

are handled through the same generic pipeline.

---

## Phase F — Redaction Geometry

Fix bbox transformation and overlay positioning.

### Gate F

Verify:

- scrolling
- zoom
- DPI
- responsive layout
- movement
- dynamic insertion

---

## Phase G — Dynamic/Re-perception Hardening

Ensure SPA mutations and lazy-loaded content cause targeted re-perception.

### Gate G

Navigate between multiple views without reloading the entire extension/page.

Sensitive profile surfaces must remain protected after changes.

---

## Phase H — Full Regression + Security

Run all existing tests plus the new test matrix.

### Gate H

Only continue if:

```text
BUILD = PASS
UNIT TESTS = PASS
INTEGRATION TESTS = PASS
PRIVACY TESTS = PASS
SECURITY TESTS = PASS
REGRESSION TESTS = PASS
```

---

# 31. PHASE GATE RULE

After EVERY phase, Antigravity must STOP.

It must NOT automatically continue.

It must run:

```text
current phase tests
+
previous phase regression tests
+
security tests relevant to the change
```

If any test fails:

```text
STOP
↓
identify root cause
↓
fix
↓
rerun failed test
↓
rerun complete phase suite
↓
rerun regression suite
```

Only when everything passes may the next phase begin.

---

# 32. COMPLETION REPORT

At the end of every phase, produce:

```text
PHASE:
STATUS:

ROOT CAUSE IDENTIFIED:
...

FILES CHANGED:
...

IMPLEMENTATION:
...

TESTS EXECUTED:
...

TEST RESULTS:
...

REGRESSION RESULTS:
...

SECURITY RESULTS:
...

PERFORMANCE OBSERVATIONS:
...

HARD-CODED SITE/USER LOGIC ADDED:
NO

STUB/MOCK BEHAVIOR ADDED:
NO

READY FOR NEXT PHASE:
YES / NO
```

If the answer to either of these is:

```text
HARD-CODED SITE/USER LOGIC ADDED: YES
```

or:

```text
STUB/MOCK BEHAVIOR ADDED: YES
```

the phase is NOT complete.

---

# 33. FINAL ACCEPTANCE CRITERIA

The fix is complete only when the system can generically protect sensitive profile information across different rendering implementations.

At minimum:

```text
DOM profile
CSS profile
SVG profile
Canvas profile
Shadow DOM profile
Dynamic profile
Lazy-loaded profile
Responsive profile
Scrolled profile
```

must be processed through the same architecture.

The system must not know:

```text
"this is LinkedIn"
```

or:

```text
"this is the user's username"
```

in order to perform the basic privacy protection.

Instead it should reason from:

```text
rendered content
+
perception
+
visual evidence
+
privacy signals
+
policy
```

---

# 34. FINAL ANTIGRAVITY PROMPT

Use this as the direct instruction to Antigravity:

> Analyze the current repository and fix the own-profile redaction failure according to this document.
>
> Do not immediately modify code.
>
> First reproduce the issue and identify the first stage where the working profile and the unmasked own profile diverge.
>
> Trace the complete pipeline:
>
> DOM/ARIA → perception → routing → visual perception → perception fusion → privacy detection → redaction decision → redaction geometry → overlay → dynamic re-perception.
>
> Fix the underlying architectural problem rather than adding a site-specific workaround.
>
> Do NOT hardcode LinkedIn, Instagram, Facebook, usernames, profile names, profile URLs, CSS selectors, DOM paths, coordinates, image URLs, component names, profile IDs, face positions, PII values, detection results, model outputs, confidence scores, or benchmark results.
>
> Do not add:
>
> `if LinkedIn`
>
> `if Instagram`
>
> `if Facebook`
>
> `if username == ...`
>
> or any equivalent special-case logic.
>
> Do not hardcode the location of the user's profile.
>
> Do not replace real detection with a fake detection.
>
> Do not replace real visual inference with mock output.
>
> Do not silently replace failed screenshots with fake images.
>
> Do not bypass the privacy pipeline.
>
> Do not bypass the egress firewall.
>
> Do not bypass origin/frame/state validation.
>
> Preserve the existing DOM/ARIA-first and confidence-driven architecture.
>
> First fix perception coverage, then coverage-gap routing, then visual inference if required, then privacy fusion, then redaction geometry, then dynamic re-perception.
>
> After each phase, STOP and test.
>
> Do not move to the next phase unless the current phase passes all required tests, regression tests, and security checks.
>
> If a test fails, remain in the current phase, determine the root cause, fix it, and rerun the complete phase test suite.
>
> The goal is not merely to make my own profile disappear.
>
> The goal is to make the privacy engine correctly protect sensitive profile information through the same generic perception and privacy architecture regardless of how the website renders that information.
>
> Stick to this plan exactly.
>
> Do not redesign the architecture.
>
> Do not introduce unrelated features.
>
> Do not hardcode anything to make the demonstration pass.
>
> Use actual runtime evidence and actual browser state.
