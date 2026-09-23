import { defineBackground } from 'wxt/sandbox';
import { bus } from '@contracts/index.js';
import { getUiState, orchestrator } from '../src/background/orchestrator.js';
import { dirtyTracker } from '../src/perception/dirty-region/tracker.js';
import { telemetrySink } from '../src/telemetry/sink.js';

export default defineBackground(() => {
  // Top-level synchronous message listener registration (MV3 requirement)
  bus.on('task/start', async (payload, sender) => {
    let tabId = payload.tab_id;

    if (!tabId && typeof chrome !== 'undefined' && chrome.tabs?.query) {
      try {
        const allTabs = await chrome.tabs.query({});
        const webTabs = allTabs.filter(
          (t) =>
            t.id &&
            t.url &&
            !t.url.startsWith('chrome-extension://') &&
            !t.url.startsWith('chrome://') &&
            !t.url.startsWith('chrome-error://') &&
            t.url !== 'about:blank'
        );
        let activeTabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const candidateActive = activeTabs?.find((t) => t.id && t.url && !t.url.startsWith('chrome-extension://') && !t.url.startsWith('chrome://'));
        tabId = candidateActive?.id || webTabs.find((t) => t.active)?.id || webTabs[0]?.id;
      } catch (err) {
        console.warn('[SW] Could not query active tab:', err);
      }
    }

    console.log('[SW] Starting task:', payload.task_text, 'on tabId:', tabId);
    const taskId = await orchestrator.startTask(payload.task_text, tabId || 0);
    return { task_id: taskId };
  });

  bus.on('task/cancel', async (payload) => {
    await orchestrator.cancelTask(payload.task_id);
    return { cancelled: true };
  });

  bus.on('task/confirm', async (payload) => {
    await orchestrator.confirmTaskAction(payload.task_id, payload.confirmed);
    return { acknowledged: true };
  });

  bus.on('ui/get-state', async () => {
    return getUiState();
  });

  bus.on('dom/dirty', async (payload) => {
    dirtyTracker.add(payload as any);
    return { received: true };
  });

  bus.on('telemetry/event', async (payload) => {
    await telemetrySink.record(payload);
    return { recorded: true };
  });
});
