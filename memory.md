# Memory / Changelog

This file is used to track updates, important context, and milestones for the project.

## Updates
- **[2026-09-27]**: Initialized `memory.md` to keep track of important project updates and contexts.

## Fix: Face Masking Disappearing on Scroll
- **Date**: 2026-09-27
- **Issue**: Masks were failing to render on faces when scrolling down the page.
- **Root Cause**:
  1. `MAX_TILES` budget exhaustion in YuNet. `extension/src/vision/engine.ts` was forwarding ALL DOM images to YuNet, including those far above the viewport. The 64-tile budget was exhausted by off-screen images before visible images were scanned.
  2. Nested scroll containers were evading the `dom/dirty` observer.
- **Resolution**:
  - Filtered `selectiveRegions` in `engine.ts` using `!el.in_viewport` check to ensure only visible bounding boxes are sent to YuNet.
  - Calculated precise intersecting viewport bounding boxes for tiles.
  - Added `capture: true` to the global scroll event listener in `observers.ts` to track nested container scrolling.
