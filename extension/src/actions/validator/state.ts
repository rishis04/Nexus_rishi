import type { StructuredAction } from '@contracts/index.js';

export function validateState(
  action: StructuredAction,
  livePageStateHash: string
): { ok: boolean; reason?: string } {
  if (action.page_state_hash !== livePageStateHash) {
    return {
      ok: false,
      reason: `STALE_STATE: action hash "${action.page_state_hash}" does not match live page hash "${livePageStateHash}"`,
    };
  }
  return { ok: true };
}
