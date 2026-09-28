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

## Fix: WXT Dev Server WebSocket & CSP Mismatch
- **Date**: 2026-09-28
- **Issue**: `WebSocket connection to 'ws://localhost:3002/' failed` and Content Security Policy violations blocking WXT scripts.
- **Root Cause**: The WXT/Vite dev server silently fell back to port `3002` because port `3000` was occupied by zombie node processes (or another app). This caused a mismatch where the HTML script tags were generated pointing to `3000`, but the injected CSP allowed `3002`.
- **Resolution**: 
  - Explicitly configured `vite.server.port: 3333` and `strictPort: true` in `extension/wxt.config.ts` to prevent silent fallback and port collisions.
  - Cleared the `.wxt` and `.output` cache to eliminate lingering hardcoded ports.
  - Killed zombie node processes occupying `localhost:3000`.
