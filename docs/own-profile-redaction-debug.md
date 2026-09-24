# Own-Profile Redaction Debug

## Overview
This document records the findings during Phase A of fixing the own-profile redaction bug as detailed in SIH 26171.

## 1. Test Setup
We modified the local test-site (`test-site/shared/login-demo.html`) to include:
1. **Other person's profile**: An `img` tag with `id="user-avatar"` and `class="avatar"`.
2. **User's own profile**: A generic `div` with class `.header-icon-342` and an inline CSS background image, but no obvious semantic tags, aria-labels, or IDs containing keywords like `profile` or `avatar`. This is a common pattern for "own profile" headers on modern social platforms (e.g., LinkedIn).

## 2. Perception Pipeline Comparison

| Step | Other Profile (`<img id="user-avatar">`) | Own Profile (`<div class="header-icon-342">`) |
|------|-----------------------------------------|-----------------------------------------------|
| DOM perception layer | Discovered | TBD |
| Semantic routing | Routed to privacy inference | TBD |
| Vision fallback needed | No (caught by DOM metadata) | TBD |
| Privacy classifier | Caught by `isProfileImage` due to `avatar` keywords | TBD |
| Redaction overlay | Applied | TBD |

## 3. Findings
1. **DOM Perception Drop**: The generic own-profile `div` is initially completely missed by the `CANDIDATE_SELECTOR` in `extension/src/perception/dom/snapshot.ts`. The loop over `allNodes` only picks up elements with `onclick` or `cursor: pointer`. Since a purely visual header icon might lack these, it's dropped before even reaching the router.
2. **Privacy Classification Hardcoding**: Even if the region makes it to the Privacy Engine (e.g., after fixing the DOM to pick up CSS background images), `privacyStub.sanitize` in `extension/src/privacy.stub.ts` calculates `isProfileImage` purely using string matching (`classes.includes('profile')`, `id.includes('avatar')`). Because our own-profile div uses `.header-icon-342`, it fails this check despite the vision engine potentially detecting a face.

## 4. Conclusion
The own-profile redaction bug is caused by a chain of rigid, hardcoded heuristics:
1. Missing DOM discovery for generic regions.
2. Rigid semantic routing that doesn't request vision for non-obvious containers.
3. A privacy classifier that ignores visual face detections unless accompanied by metadata keywords.
