# Memory / Changelog

This file is used to track updates, important context, and milestones for the project.

## Updates
- **[2026-09-27]**: Initialized `memory.md` to keep track of important project updates and contexts.
- **[2026-09-30]**: Comprehensive BrowserOS agent stability, MV3 cross-world preload repair, and binary screenshot privacy integrity fixes.

---

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

---

## Fix: WXT Dev Server WebSocket & CSP Mismatch
- **Date**: 2026-09-28
- **Issue**: `WebSocket connection to 'ws://localhost:3002/' failed` and Content Security Policy violations blocking WXT scripts.
- **Root Cause**: The WXT/Vite dev server silently fell back to port `3002` because port `3000` was occupied by zombie node processes (or another app). This caused a mismatch where the HTML script tags were generated pointing to `3000`, but the injected CSP allowed `3002`.
- **Resolution**: 
  - Explicitly configured `vite.server.port: 3333` and `strictPort: true` in `extension/wxt.config.ts` to prevent silent fallback and port collisions.
  - Cleared the `.wxt` and `.output` cache to eliminate lingering hardcoded ports.
  - Killed zombie node processes occupying `localhost:3000`.

---

## Fix: Missing bun:test Type Definitions & Server Test tsconfig
- **Date**: 2026-09-30
- **Issue**: `bun:test` imports failed type checking in `apps/server/tests/privacy/*`, causing TypeScript errors across test suites.
- **Root Cause**: `apps/server/tests/tsconfig.json` was missing appropriate module resolution and types configuration for Bun tests.
- **Resolution**:
  - Added `bun-types` (`^1.4.2`) to root and server dependencies.
  - Added and configured `apps/server/tests/tsconfig.json` with `"extends": "../tsconfig.json"` and `"moduleResolution": "bundler"`.
  - All test files now pass strict `tsc --noEmit`.

---

## Fix: Test Screenshot Leakage to User Data Directory
- **Date**: 2026-09-30
- **Issue**: Running unit tests populated the user's permanent capture directory (`~/.browseros/ai-captures/` and `~/.browseros-dev/ai-captures/`) with mock synthetic test strings.
- **Root Cause**: `apps/server/tests/privacy/phase15-extension-regression.test.ts` was invoking `session.screenshot()` without passing an isolated temporary storage instance.
- **Resolution**:
  - Updated `phase15-extension-regression.test.ts` to redirect captures to an isolated OS temp directory (`/tmp/browseros-phase15-test`), preventing test pollution of real user capture directories.

---

## Fix: Cross-World Extension Resource Mismatch on app.html (Line 13)
- **Date**: 2026-09-30
- **Issue**: Chrome logged extension runtime error: *"A preload for 'chrome-extension://.../chunks/reload-html-...js' is found, but is not used because it is a cross-world extension resource mismatch."* at line 13 of `app.html`.
- **Root Cause**:
  1. An inline `<script type="module">` in `apps/app/entrypoints/app/index.html` was parsed by Vite into a separate chunk (`app-*.js`) that imported WXT's reload client.
  2. Vite injected `<link rel="modulepreload" crossorigin="" href="/chunks/reload-html-...js">` into `app.html`.
  3. Chromium MV3 security blocks module preloads with `crossorigin=""` on `chrome-extension://` resources.
- **Resolution**:
  - Removed the inline script from `entrypoints/app/index.html`.
  - Initialized the theme directly in `entrypoints/app/main.tsx` before React mount to prevent theme flash without HTML chunks.
  - Added `modulePreload: false` to the Vite build config in `apps/app/wxt.config.ts`.
  - Verified error clearing: `chrome://extensions/?errors=...` now shows 0 errors.

---

## Fix: Binary Screenshot File Corruption in Privacy Sanitizer
- **Date**: 2026-09-30
- **Issue**: Screenshots taken by BrowserOS were showing up corrupted or failed to open in image viewers.
- **Root Cause**:
  - `packages/browser-core/src/core/screenshot-privacy/sanitizer.ts` converted raw binary image data into a UTF-8 string with `rawBuffer.toString('utf-8')`.
  - Invalid UTF-8 bytes were replaced with `\uFFFD`, and text-based regex patterns accidentally matched random byte sequences in compressed PNG/JPEG bitstreams.
  - Re-encoding with `Buffer.from(modifiedText, 'utf-8')` permanently corrupted the binary PNG/JPEG structures.
- **Resolution**:
  - Added binary magic-byte detection for `PNG` (`89 50 4E 47`), `JPEG` (`FF D8 FF`), and `WebP` (`RIFF...WEBP`) in `sanitizer.ts`.
  - Binary image formats now preserve their original byte stream intact without corrupting conversions.
  - Text-based regex redactions are strictly limited to non-binary text payloads (SVGs and synthetic test strings).
  - Verified live: Captured an uncorrupted, crystal-clear 1148x1474 PNG at `~/.browseros-dev/ai-captures/2026-09-30/SS-000001.png`.

---

## Fix: Dedicated Capture Storage Diverted to Development Directory
- **Date**: 2026-09-30
- **Issue**: Captured screenshots were written to `~/.browseros-dev/ai-captures/` instead of the canonical dedicated audit directory `~/.browseros/ai-captures/`.
- **Root Cause**:
  - `getCapturesBaseDir()` in `packages/browser-core/src/core/screenshot-privacy/storage.ts` inspected `process.env.NODE_ENV === 'development'` and `process.env.BROWSEROS_DIR`. In dev mode, `BROWSEROS_DIR` was set to `~/.browseros-dev`, causing all AI capture saves to be diverted away from the user's canonical dedicated capture directory `~/.browseros/ai-captures`.
- **Resolution**:
  - Updated `getCapturesBaseDir()` to pin the dedicated capture base to the canonical `~/.browseros` application data directory (unless explicitly overridden by `BROWSEROS_CAPTURES_DIR` for test isolation).
  - Updated `ScreenshotStorage` to dynamically resolve `getBaseDir()` and record optional `request_id` correlation in `manifest.jsonl`.
  - Added focused unit tests in `apps/server/tests/privacy/dedicated-storage.test.ts` covering all 12 test invariants (valid PNG, dedicated directory, SS-XXXXXX naming, manifest sanitized=true, byte-level SHA-256 equivalence, fail-closed behavior, and test isolation).
  - Verified live: Captured screenshot is written directly to `/Users/rishis/.browseros/ai-captures/2026-09-30/SS-000001.png` with SHA-256 exactly matching the AI-bound payload.
