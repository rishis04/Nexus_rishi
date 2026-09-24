import type { ExecResult, StructuredAction } from '@contracts/index.js';
import { stageError } from '@contracts/common.js';
import { elementRegistry } from '../../content/registry.js';
import { executeClick } from './click.js';
import { executeFillSecret, executeType } from './type.js';
import { executeSelect } from './select.js';
import { executeScroll } from './scroll.js';
import { executeKeypress } from './keypress.js';
import { waitForSettle } from './settle.js';
import { extractDomSnapshot } from '../../perception/dom/snapshot.js';

export async function executeAction(
  action: StructuredAction,
  resolvedSecret?: string
): Promise<ExecResult> {
  let targetEl: Element | null = null;

  if (action.target) {
    targetEl = elementRegistry.getByRegionId(action.target.region_id);
    if (!targetEl) {
      return {
        ok: false,
        action_id: action.action_id,
        navigated: false,
        new_page_state_hash: null,
        error: stageError(
          'TARGET_NOT_FOUND',
          'execute',
          `Cannot execute: element for region "${action.target.region_id}" is disconnected or not found`
        ),
      };
    }
  }

  try {
    switch (action.action) {
      case 'click': {
        if (!targetEl) throw new Error('Click requires a target element');
        await executeClick(targetEl);
        break;
      }

      case 'type': {
        if (!targetEl) throw new Error('Type requires a target element');
        await executeType(targetEl, action.params?.text || '');
        break;
      }

      case 'fill_secret': {
        if (!targetEl) throw new Error('fill_secret requires a target element');
        if (!resolvedSecret) throw new Error('fill_secret requires a resolved secret value');
        await executeFillSecret(targetEl, resolvedSecret);
        break;
      }

      case 'select': {
        if (!targetEl) throw new Error('Select requires a target element');
        await executeSelect(targetEl, action.params?.option || '');
        break;
      }

      case 'scroll': {
        await executeScroll(action.params?.direction, action.params?.amount);
        break;
      }

      case 'focus': {
        if (!targetEl) throw new Error('Focus requires a target element');
        (targetEl as HTMLElement).focus();
        break;
      }

      case 'keypress': {
        if (!action.params?.key) throw new Error('Keypress requires a key parameter');
        await executeKeypress(action.params.key);
        break;
      }

      case 'navigate': {
        if (!action.params?.url) throw new Error('Navigate requires a url parameter');
        window.location.href = action.params.url;
        break;
      }

      case 'back': {
        window.history.back();
        break;
      }

      default:
        throw new Error(`Unsupported action type: ${(action as any).action}`);
    }

    // Wait for DOM mutations to settle
    await waitForSettle();

    // Compute fresh state hash after execution
    const freshSnapshot = await extractDomSnapshot();

    return {
      ok: true,
      action_id: action.action_id,
      navigated: false,
      new_page_state_hash: freshSnapshot.page_state_hash,
    };
  } catch (err: any) {
    return {
      ok: false,
      action_id: action.action_id,
      navigated: false,
      new_page_state_hash: null,
      error: stageError('INTERNAL', 'execute', err.message || String(err)),
    };
  }
}
