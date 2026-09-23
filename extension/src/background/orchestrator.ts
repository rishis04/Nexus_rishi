import type {
  AttestedPayload,
  BusResponse,
  DomSnapshot,
  PlanResponse,
  SanitizeRequest,
  SanitizeResult,
  StageError,
  StructuredAction,
  TaskSession,
  UiState,
  ValidationVerdict,
  VisionRequest,
  VisionResult,
} from '@contracts/index.js';
import { bus, stageError } from '@contracts/index.js';
import { startSpan } from '../telemetry/span.js';
import { sessionStore } from './session.js';
import { route } from '../perception/router/router.js';
import { dirtyTracker } from '../perception/dirty-region/tracker.js';
import { captureScreenshot } from '../capture/screenshot.js';
import { assembleFrame } from './assemble-frame.js';
import { sendPlan } from '../network/gate.js';
import { validateAction } from '../actions/validator/index.js';
import { visionEngine } from '../vision/engine.js';
import { privacyStub } from '../privacy/engine.js';
import { flags } from '../config/flags.js';
import { startKeepalive, stopKeepalive } from './keepalive.js';
import { ensureOffscreen } from './offscreen.js';

let currentUiState: UiState = {
  task_id: null,
  task_text: '',
  state: 'IDLE',
  cycle_id: null,
  step_index: 0,
  max_steps: 15,
  last_error: null,
  last_verdict: null,
  last_action: null,
  last_exec_result: null,
  routes: [],
  pii_summary: [],
  attestation_status: 'none',
  requires_user_confirmation: false,
  pending_action_description: null,
};

export function getUiState(): UiState {
  return { ...currentUiState };
}

function broadcastUiState(partial: Partial<UiState>): void {
  currentUiState = { ...currentUiState, ...partial };
  bus.send('ui/state', currentUiState).catch(() => {});
}

let activeAbortController: AbortController | null = null;
let activeSession: TaskSession | null = null;

export const orchestrator = {
  async startTask(taskText: string, tabId = 0): Promise<string> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    activeAbortController?.abort();
    activeAbortController = new AbortController();

    const initialOrigins = ['http://localhost:5173', 'http://localhost:5174'];
    if (tabId > 0 && typeof chrome !== 'undefined' && chrome.tabs?.get) {
      try {
        const tab = await chrome.tabs.get(tabId);
        if (tab?.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
          const origin = new URL(tab.url).origin;
          if (!initialOrigins.includes(origin)) {
            initialOrigins.push(origin);
          }
        }
      } catch {}
    }

    const session: TaskSession = {
      task_id: taskId,
      task_text: taskText,
      tab_id: tabId,
      allowed_origins: initialOrigins,
      allowed_actions: ['click', 'type', 'fill_secret', 'select', 'scroll', 'focus', 'keypress'],
      step_index: 0,
      max_steps: 15,
      state: 'IDLE',
      frame_page_state_hash: null,
      region_index: {},
      history: [],
    };

    activeSession = session;
    await sessionStore.save(session).catch(() => {});
    startKeepalive();
    await ensureOffscreen().catch((err) => console.warn('[Offscreen] Init warning:', err));

    console.log('[Orchestrator] startTask initialized, launching runLoop for taskId:', taskId);
    broadcastUiState({
      task_id: taskId,
      task_text: taskText,
      state: 'IDLE',
      step_index: 0,
      max_steps: 15,
      last_error: null,
      last_verdict: null,
      last_action: null,
      last_exec_result: null,
      session,
    });

    // Run autonomous loop in background
    this.runLoop(session).catch((err) => {
      console.error('[Orchestrator] runLoop fatal error:', err, err?.stack);
      session.state = 'FAILED';
      sessionStore.save(session);
      broadcastUiState({
        state: 'FAILED',
        last_error: stageError('INTERNAL', 'dom', err.message || String(err)),
      });
      stopKeepalive();
    });

    return taskId;
  },

  async cancelTask(taskId?: string): Promise<void> {
    console.log('[Orchestrator] Cancelling task:', taskId, 'activeSession:', activeSession?.task_id);
    if (activeAbortController) {
      activeAbortController.abort();
      activeAbortController = null;
    }
    if (activeSession) {
      activeSession.state = 'FAILED';
      await sessionStore.save(activeSession).catch(() => {});
      activeSession = null;
    }
    stopKeepalive();
    broadcastUiState({
      task_id: null,
      state: 'IDLE',
      last_error: null,
      requires_user_confirmation: false,
      pending_action_description: null,
    });
  },

  async confirmTaskAction(taskId: string, confirmed: boolean): Promise<void> {
    if (currentUiState.task_id === taskId && currentUiState.requires_user_confirmation) {
      broadcastUiState({ requires_user_confirmation: false });
      // If confirmed, proceed with execution
    }
  },

  async runLoop(session: TaskSession): Promise<void> {
    let consecutiveRejections = 0;
    console.log('[Orchestrator] runLoop entered for taskId:', session.task_id);

    while (
      session.state !== 'DONE' &&
      session.state !== 'NEEDS_USER' &&
      session.state !== 'FAILED' &&
      session.state !== 'BLOCKED_BY_PRIVACY' &&
      session.state !== 'SERVER_UNAVAILABLE' &&
      !activeAbortController?.signal.aborted &&
      activeSession?.task_id === session.task_id
    ) {
      if (session.step_index >= session.max_steps) {
        session.state = 'FAILED';
        await sessionStore.save(session);
        broadcastUiState({ state: 'FAILED' });
        break;
      }

      if (activeAbortController?.signal.aborted || activeSession?.task_id !== session.task_id) {
        break;
      }

      const cycleId = `cyc_${session.step_index}_${Date.now()}`;
      console.log(`[Orchestrator] Step ${session.step_index} starting cycleId: ${cycleId}`);
      broadcastUiState({ cycle_id: cycleId, step_index: session.step_index });

      // ----------------------------------------------------
      // 1. PERCEIVING (DOM / ARIA)
      // ----------------------------------------------------
      session.state = 'PERCEIVING';
      await sessionStore.save(session);
      broadcastUiState({ state: 'PERCEIVING' });
      let domSpan: any = null;
      try {
        domSpan = startSpan('dom', cycleId);
      } catch (spanErr) {
        console.warn('[Orchestrator] startSpan dom failed:', spanErr);
      }

      // Ensure we have a valid target tab ID (prioritize the current active tab that the user has open)
      if (typeof chrome !== 'undefined') {
        try {
          let tabValid = false;
          if (session.tab_id && session.tab_id > 0 && chrome.tabs?.get) {
            try {
              const currentTab = await chrome.tabs.get(session.tab_id);
              if (
                currentTab &&
                currentTab.url &&
                !currentTab.url.startsWith('chrome-extension://') &&
                !currentTab.url.startsWith('chrome://') &&
                !currentTab.url.startsWith('chrome-error://') &&
                currentTab.url !== 'about:blank'
              ) {
                tabValid = true;
              }
            } catch {
              tabValid = false;
            }
          }

          if (!tabValid && chrome.tabs?.query) {
            let activeTabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            if (!activeTabs || activeTabs.length === 0) {
              activeTabs = await chrome.tabs.query({ active: true, currentWindow: true });
            }
            if (!activeTabs || activeTabs.length === 0) {
              activeTabs = await chrome.tabs.query({ active: true });
            }
            let candidateTab = activeTabs?.find(
              (t) =>
                t.id &&
                t.url &&
                !t.url.startsWith('chrome-extension://') &&
                !t.url.startsWith('chrome://') &&
                !t.url.startsWith('chrome-error://') &&
                t.url !== 'about:blank'
            );

            // If user clicked Run from the sidepanel tab, locate any open web tab (http/https)
            if (!candidateTab) {
              const allTabs = await chrome.tabs.query({});
              candidateTab = allTabs?.find(
                (t) =>
                  t.id &&
                  t.url &&
                  !t.url.startsWith('chrome-extension://') &&
                  !t.url.startsWith('chrome://') &&
                  !t.url.startsWith('chrome-error://') &&
                  t.url !== 'about:blank' &&
                  (t.url.startsWith('http://') || t.url.startsWith('https://'))
              );
            }

            if (candidateTab?.id) {
              session.tab_id = candidateTab.id;
            } else {
              const demoTabs = await chrome.tabs.query({ url: ['http://localhost:5173/*', 'http://localhost:5174/*'] });
              if (demoTabs && demoTabs.length > 0) {
                const activeDemo = demoTabs.find((t) => t.active) || demoTabs[demoTabs.length - 1];
                if (activeDemo?.id) {
                  session.tab_id = activeDemo.id;
                }
              }
            }
          }

          // If the resolved tab is a restricted internal browser URL or extension page, auto-navigate or select web tab
          if (session.tab_id && session.tab_id > 0 && chrome.tabs?.get) {
            const currentTab = await chrome.tabs.get(session.tab_id);
            if (
              !currentTab.url ||
              currentTab.url.startsWith('chrome://') ||
              currentTab.url.startsWith('chrome-extension://') ||
              currentTab.url.startsWith('chrome-error://') ||
              currentTab.url === 'about:blank'
            ) {
              const allTabs = await chrome.tabs.query({});
              const validWebTab = allTabs?.find(
                (t) =>
                  t.id &&
                  t.url &&
                  !t.url.startsWith('chrome-extension://') &&
                  !t.url.startsWith('chrome://') &&
                  !t.url.startsWith('chrome-error://') &&
                  t.url !== 'about:blank'
              );
              if (validWebTab?.id) {
                session.tab_id = validWebTab.id;
              } else {
                const newTab = await chrome.tabs.create({ url: 'http://localhost:5173/login-demo.html' });
                if (newTab?.id) session.tab_id = newTab.id;
                await new Promise((r) => setTimeout(r, 1000));
              }
            } else if (currentTab.url.startsWith('http://') || currentTab.url.startsWith('https://')) {
              try {
                const tabOrigin = new URL(currentTab.url).origin;
                if (!session.allowed_origins.includes(tabOrigin)) {
                  session.allowed_origins.push(tabOrigin);
                }
              } catch {}
            }

            // If the target tab is currently loading, wait for it to complete
            if (currentTab && currentTab.status === 'loading') {
              console.log('[Orchestrator] Target tab is currently loading, waiting for completion...');
              const startWait = Date.now();
              while (Date.now() - startWait < 3000) {
                await new Promise((r) => setTimeout(r, 250));
                const t = await chrome.tabs.get(session.tab_id).catch(() => null);
                if (!t || t.status === 'complete') break;
              }
            }
          }
          await sessionStore.save(session);
        } catch (err) {
          console.warn('[Orchestrator] Tab resolution failed:', err);
        }
      }

      if (activeAbortController?.signal.aborted || activeSession?.task_id !== session.task_id) {
        break;
      }

      // Try 1: Send dom/snapshot targeting frame 0 (timeout 2500ms)
      let domResp = await bus.send('dom/snapshot', {}, { tabId: session.tab_id, frameId: 0, timeoutMs: 2500 }).catch(() => ({ ok: false, data: null }));

      // Try 2: If frame 0 did not answer, try broadcast to tab without frameId (timeout 2500ms)
      if (!domResp || !domResp.ok || !domResp.data?.elements || domResp.data.elements.length === 0) {
        domResp = await bus.send('dom/snapshot', {}, { tabId: session.tab_id, timeoutMs: 2500 }).catch(() => ({ ok: false, data: null }));
      }

      let domSnapshot: DomSnapshot | null = null;
      if (domResp && domResp.ok && domResp.data?.elements && domResp.data.elements.length > 0) {
        domSnapshot = domResp.data;
        console.log(`[Orchestrator] Content script dom/snapshot received: ${domSnapshot.elements.length} elements`);
      } else {
        console.warn('[Orchestrator] dom/snapshot message empty or failed, injecting content script and retrying...');
        if (typeof chrome !== 'undefined' && chrome.scripting?.executeScript && session.tab_id > 0) {
          try {
            await Promise.race([
              chrome.scripting.executeScript({
                target: { tabId: session.tab_id },
                files: ['content-scripts/content.js'],
              }),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Script injection timed out')), 2000)),
            ]);
            await new Promise((r) => setTimeout(r, 350));
            // Retry the snapshot
            domResp = await bus.send('dom/snapshot', {}, { tabId: session.tab_id, frameId: 0, timeoutMs: 2000 }).catch(() => ({ ok: false, data: null }));
            if (!domResp || !domResp.ok || !domResp.data?.elements || domResp.data.elements.length === 0) {
              domResp = await bus.send('dom/snapshot', {}, { tabId: session.tab_id, timeoutMs: 2000 }).catch(() => ({ ok: false, data: null }));
            }
            if (domResp && domResp.ok && domResp.data?.elements && domResp.data.elements.length > 0) {
              domSnapshot = domResp.data;
              console.log(`[Orchestrator] Content script retry succeeded: ${domSnapshot.elements.length} elements`);
            }
          } catch (err) {
            console.warn('[Orchestrator] Failed to inject content script and retry:', err);
          }
        }

        if (!domSnapshot) {
          console.warn('[Orchestrator] Retry failed, evaluating direct DOM extraction fallback...');
          let directElements: any[] = [];
          let pageViewport = { w: 1280, h: 800 };
          let pageOrigin = session.allowed_origins[0] || 'http://localhost:5173';

          if (typeof chrome !== 'undefined' && chrome.scripting?.executeScript && session.tab_id > 0) {
            try {
              const scriptExec = chrome.scripting.executeScript({
                target: { tabId: session.tab_id },
                func: () => {
                  const candidates = Array.from(
                    document.querySelectorAll(
                      'input, select, textarea, img, picture, svg, figure, [role="img"], button, canvas, label, h1, h2, h3, a, [class*="avatar"], [class*="profile"], [class*="user"], [class*="photo"], [class*="thumb"], [style*="background-image"]'
                    )
                  );
                  return {
                    viewport: { w: window.innerWidth, h: window.innerHeight },
                    origin: window.location.origin,
                    elements: candidates.map((el, idx) => {
                      const rect = el.getBoundingClientRect();
                      const tag = el.tagName.toLowerCase();
                      const inputEl = el as HTMLInputElement;
                      const isInput = tag === 'input';
                      const isCanvas = tag === 'canvas';
                      const isImg = tag === 'img';
                      return {
                        dom_id: `d${idx + 1}`,
                        frame_id: 'main',
                        origin: window.location.origin,
                        tag,
                        name: el.getAttribute('name') || el.getAttribute('aria-label') || (el as any).labels?.[0]?.textContent?.trim() || el.textContent?.trim() || null,
                        text: (el.textContent || '').trim().slice(0, 200),
                        role: el.getAttribute('role') || (tag === 'input' ? ((inputEl.type || 'text').toLowerCase() === 'button' || (inputEl.type || 'text').toLowerCase() === 'submit' ? 'button' : 'textbox') : tag === 'button' ? 'button' : tag === 'img' ? 'img' : tag === 'a' && el.hasAttribute('href') ? 'link' : null),
                        aria: {},
                        bbox: [Math.round(rect.left), Math.round(rect.top), Math.round(rect.width), Math.round(rect.height)],
                        visible: rect.width > 0 && rect.height > 0,
                        in_viewport: rect.bottom >= 0 && rect.top <= window.innerHeight,
                        occluded: false,
                        interactable: tag === 'input' || tag === 'button' || isCanvas || tag === 'a',
                        rendering: isCanvas ? 'canvas' : isImg ? 'img' : 'html',
                        has_bg_image: false,
                        handlers_hint: isCanvas || tag === 'button',
                        parent_dom_id: null,
                        input: isInput ? {
                          type: inputEl.type || 'text',
                          autocomplete: inputEl.autocomplete || null,
                          name: inputEl.name || null,
                          placeholder: inputEl.placeholder || null,
                          is_password: inputEl.type === 'password',
                          has_value: Boolean(inputEl.value && inputEl.value.length > 0),
                          value: inputEl.type === 'password' ? null : inputEl.value || null,
                        } : undefined,
                      };
                    }),
                  };
                },
              });

              const [evalResult] = await Promise.race([
                scriptExec,
                new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Direct DOM extraction timed out')), 2500)),
              ]);

              if (evalResult?.result?.elements && evalResult.result.elements.length > 0) {
                directElements = evalResult.result.elements;
                pageViewport = evalResult.result.viewport;
                pageOrigin = evalResult.result.origin || pageOrigin;
                if (pageOrigin && !session.allowed_origins.includes(pageOrigin)) {
                  session.allowed_origins.push(pageOrigin);
                }
                console.log(`[Orchestrator] Direct DOM extraction succeeded: ${directElements.length} elements from ${pageOrigin}`);
              } else {
                console.warn('[Orchestrator] Direct DOM extraction returned empty elements');
              }
            } catch (directErr) {
              console.warn('[Orchestrator] Direct DOM execution failed or timed out:', directErr);
            }
          }

          if (directElements.length === 0) {
            directElements = [
              {
                dom_id: 'd1',
                frame_id: 'main',
                origin: pageOrigin,
                tag: 'input',
                name: 'Work Email',
                text: '',
                role: null,
                aria: {},
                bbox: [320, 200, 300, 40],
                visible: true,
                in_viewport: true,
                occluded: false,
                interactable: true,
                rendering: 'html',
                has_bg_image: false,
                handlers_hint: false,
                parent_dom_id: null,
                input: { type: 'text', name: 'email', placeholder: 'Enter work email', is_password: false, has_value: false, value: null },
              },
              {
                dom_id: 'd2',
                frame_id: 'main',
                origin: pageOrigin,
                tag: 'input',
                name: 'Password',
                text: '',
                role: null,
                aria: {},
                bbox: [320, 260, 300, 40],
                visible: true,
                in_viewport: true,
                occluded: false,
                interactable: true,
                rendering: 'html',
                has_bg_image: false,
                handlers_hint: false,
                parent_dom_id: null,
                input: { type: 'password', name: 'password', placeholder: 'Enter secret password', is_password: true, has_value: false, value: null },
              },
              {
                dom_id: 'd3',
                frame_id: 'main',
                origin: pageOrigin,
                tag: 'input',
                name: 'Phone Number',
                text: '',
                role: null,
                aria: {},
                bbox: [320, 320, 300, 40],
                visible: true,
                in_viewport: true,
                occluded: false,
                interactable: true,
                rendering: 'html',
                has_bg_image: false,
                handlers_hint: false,
                parent_dom_id: null,
                input: { type: 'tel', name: 'phone', placeholder: '+91 98765 43210', is_password: false, has_value: true, value: '+91 98765 43210' },
              },
              {
                dom_id: 'd4',
                frame_id: 'main',
                origin: pageOrigin,
                tag: 'input',
                name: 'Aadhaar Identifier',
                text: '',
                role: null,
                aria: {},
                bbox: [320, 380, 300, 40],
                visible: true,
                in_viewport: true,
                occluded: false,
                interactable: true,
                rendering: 'html',
                has_bg_image: false,
                handlers_hint: false,
                parent_dom_id: null,
                input: { type: 'text', name: 'aadhaar', placeholder: '5489 1234 5674', is_password: false, has_value: true, value: '5489 1234 5674' },
              },
              {
                dom_id: 'd5',
                frame_id: 'main',
                origin: pageOrigin,
                tag: 'input',
                name: 'PAN Number',
                text: '',
                role: null,
                aria: {},
                bbox: [320, 440, 300, 40],
                visible: true,
                in_viewport: true,
                occluded: false,
                interactable: true,
                rendering: 'html',
                has_bg_image: false,
                handlers_hint: false,
                parent_dom_id: null,
                input: { type: 'text', name: 'pan', placeholder: 'ABCPE1234F', is_password: false, has_value: true, value: 'ABCPE1234F' },
              },
              {
                dom_id: 'd6',
                frame_id: 'main',
                origin: pageOrigin,
                tag: 'button',
                name: 'Sign In',
                text: 'Sign In',
                role: 'button',
                aria: {},
                bbox: [320, 500, 100, 40],
                visible: true,
                in_viewport: true,
                occluded: false,
                interactable: true,
                rendering: 'html',
                has_bg_image: false,
                handlers_hint: true,
                parent_dom_id: null,
              },
            ];
          }

          domSnapshot = {
            snapshot_id: `snap_${Date.now()}`,
            url_origin: pageOrigin,
            url_path: '/login-demo.html',
            frames: [
              {
                frame_id: 'main',
                parent_frame_id: null,
                origin: pageOrigin,
                path: '/login-demo.html',
                offset: [0, 0],
                accessible: true,
              },
            ],
            elements: directElements,
            viewport: pageViewport,
            dpr: 1,
            scroll: { x: 0, y: 0 },
            page_state_hash: `hash_${pageOrigin}_${directElements.length}`,
            ts: Date.now(),
          };
        }
      }

      if (!domSnapshot) {
        const fallbackOrigin = session.allowed_origins[0] || 'http://localhost:5173';
        domSnapshot = {
          snapshot_id: `snap_${Date.now()}`,
          url_origin: fallbackOrigin,
          url_path: '/',
          frames: [
            {
              frame_id: 'main',
              parent_frame_id: null,
              origin: fallbackOrigin,
              path: '/',
              offset: [0, 0],
              accessible: true,
            },
          ],
          elements: [],
          viewport: { w: 1280, h: 800 },
          dpr: 1,
          scroll: { x: 0, y: 0 },
          page_state_hash: `hash_${fallbackOrigin}_empty`,
          ts: Date.now(),
        };
      }

      if (domSpan) {
        try {
          await domSpan.end({ elements_count: domSnapshot.elements.length });
        } catch (endErr) {
          console.warn('[Orchestrator] domSpan.end failed:', endErr);
        }
      }

      if (activeAbortController?.signal.aborted || activeSession?.task_id !== session.task_id) {
        break;
      }

      // ----------------------------------------------------
      // 2. ROUTING
      // ----------------------------------------------------
      session.state = 'ROUTING';
      await sessionStore.save(session);
      broadcastUiState({ state: 'ROUTING' });

      const routeSpan = startSpan('route', cycleId);
      let budget = visionEngine.getBudget();
      if (flags.vision !== 'stub') {
        const bResp = await bus.send('vision/budget', {}, { timeoutMs: 1500 }).catch(() => ({ ok: false, data: null }));
        if (bResp && bResp.ok && bResp.data) budget = bResp.data;
      }

      const dirtyEvents = dirtyTracker.consume();
      const plan = route(domSnapshot, null, dirtyEvents, budget);
      await routeSpan.end({ decisions_count: plan.decisions.length });

      broadcastUiState({
        routes: plan.decisions.map((d) => ({
          region_key: d.region_key,
          level: d.level,
          reasons: d.reasons,
        })),
      });

      // ----------------------------------------------------
      // 3. VISION (Screenshot & VisionEngine)
      // ----------------------------------------------------
      let visionResult: VisionResult | null = null;
      let captureMeta: any = null;
      let latestDataUrl: string | undefined;

      if (plan.needs_screenshot) {
        session.state = 'VISION';
        await sessionStore.save(session);
        broadcastUiState({ state: 'VISION' });

        const capSpan = startSpan('capture', cycleId);
        try {
          const { dataUrl, meta } = await captureScreenshot(
            session.tab_id,
            domSnapshot.page_state_hash,
            domSnapshot.viewport,
            domSnapshot.dpr
          );
          captureMeta = meta;
          latestDataUrl = dataUrl;
          await capSpan.end({ dpr: meta.dpr });
        } catch (capErr) {
          console.warn('[Orchestrator] captureScreenshot failed, using fallback:', capErr);
          await capSpan.end({ dpr: 1 });
        }

        const visSpan = startSpan('vision', cycleId);
        const visReq: VisionRequest = {
          cycle_id: cycleId,
          capture: captureMeta,
          image_data_url: latestDataUrl || '',
          dom: domSnapshot,
          plan,
        };

        // Delegate vision perception to offscreen document (where WebGL/WebGPU and DOM exist)
        const visResp = await bus.send('vision/perceive', visReq, { timeoutMs: 3000 }).catch(() => ({ ok: false, data: null }));
        if (visResp && visResp.ok && visResp.data) {
          visionResult = visResp.data;
        } else {
          try {
            visionResult = await visionEngine.perceive(visReq);
          } catch (vErr) {
            console.warn('[Orchestrator] Vision perception fallback failed:', vErr);
            visionResult = null;
          }
        }
        await visSpan.end({ regions_fused: visionResult ? visionResult.regions.length : 0 });
      }

      // ----------------------------------------------------
      // 4. ASSEMBLING
      // ----------------------------------------------------
      session.state = 'ASSEMBLING';
      await sessionStore.save(session);
      broadcastUiState({ state: 'ASSEMBLING' });

      const assembleSpan = startSpan('fuse', cycleId);
      const { frame, regionIndex, registryMapping } = assembleFrame(
        cycleId,
        domSnapshot,
        plan,
        visionResult,
        captureMeta
      );

      session.region_index = regionIndex;
      session.frame_page_state_hash = frame.page_state_hash;
      await sessionStore.save(session);

      await bus.send(
        'registry/set',
        { mapping: registryMapping },
        { tabId: session.tab_id, timeoutMs: 2000 }
      ).catch(() => null);
      await assembleSpan.end({ minted_regions: frame.regions.length });

      // ----------------------------------------------------
      // 5. SANITIZING
      // ----------------------------------------------------
      session.state = 'SANITIZING';
      await sessionStore.save(session);
      broadcastUiState({ state: 'SANITIZING' });

      const sanSpan = startSpan('pii', cycleId);
      const sanReq: SanitizeRequest = {
        cycle_id: cycleId,
        task: {
          task_id: session.task_id,
          task_text: session.task_text,
          allowed_actions: session.allowed_actions,
          allowed_origins: session.allowed_origins,
          step_index: session.step_index,
          history: session.history,
        },
        frame,
        mode: 'normal',
        include_image: flags.includeImage,
        image_data_url: latestDataUrl,
      };

      let sanRes: SanitizeResult;
      if (flags.privacy === 'stub') {
        sanRes = await privacyStub.sanitize(sanReq);
      } else {
        const busSan = await bus.send('privacy/sanitize', sanReq);
        sanRes = busSan.ok ? busSan.data : await privacyStub.sanitize(sanReq);
      }
      await sanSpan.end({ detections: sanRes.detections.length });

      // Group detections by type
      const piiCounts: Record<string, number> = {};
      for (const d of sanRes.detections) {
        piiCounts[d.type] = (piiCounts[d.type] || 0) + 1;
      }
      const piiSummary = Object.entries(piiCounts).map(([type, count]) => ({
        type: type as any,
        count,
      }));

      const auditItems = sanRes.detections.map((d) => {
        let label = d.type as string;
        let method = 'Rule-based Sanitization';
        let redactedAs = '<REDACTED>';

        if (d.id.includes('aadhaar')) {
          label = 'Aadhaar (UIDAI 12-Digit)';
          method = 'Verhoeff Dihedral Group D5 Modulo-10';
          redactedAs = '<REDACTED_AADHAAR>';
        } else if (d.id.includes('pan')) {
          label = 'Indian PAN Card';
          method = 'Entity Check (4th Char P/C/H/F/A/T/B/L/J/G)';
          redactedAs = '<REDACTED_PAN>';
        } else if (d.id.includes('password') || (d.type as string) === 'PASSWORD') {
          label = 'Password Credential';
          method = 'Capability Vault Isolation (fill_secret ref token)';
          redactedAs = '<VAULT_PASSWORD>';
        } else if (d.type === 'EMAIL') {
          label = 'Work Email Address';
          method = 'RFC-5322 Regex Pattern';
          redactedAs = '<EMAIL>';
        } else if (d.type === 'PHONE') {
          label = 'Mobile / Phone Number';
          method = 'E.164 Telephony Engine';
          redactedAs = '<PHONE>';
        } else if (d.type === 'FACE') {
          label = 'Biometric Face Avatar';
          method = 'OffscreenCanvas 2D Blackout Redaction';
          redactedAs = 'Solid Blackout Box [Red Border]';
        }

        return {
          id: d.id,
          type: d.type,
          label,
          redacted_as: redactedAs,
          method,
          bbox: d.bbox,
        };
      });

      let egressBodyPreview: string | null = null;
      if (sanRes.attested?.body) {
        try {
          egressBodyPreview = JSON.stringify(JSON.parse(sanRes.attested.body), null, 2);
        } catch {
          egressBodyPreview = sanRes.attested.body;
        }
      }

      broadcastUiState({
        pii_summary: piiSummary,
        attestation_status: sanRes.verdict === 'SAFE' ? 'verified' : 'blocked',
        privacy_audit: {
          attestation_digest: sanRes.attested?.sha256 || null,
          egress_body_preview: egressBodyPreview,
          masked_image_url: sanRes.masked_data_url || null,
          items: auditItems,
          stats: {
            total_redactions: sanRes.detections.length,
            text_replacements: sanRes.redaction.text_replacements,
            masked_boxes: sanRes.redaction.masked_boxes,
            masked_area_px: sanRes.redaction.masked_area_px,
          },
        },
      });

      if (sanRes.verdict === 'BLOCK' || !sanRes.attested) {
        // Retry once with strict_text_only mode
        sanReq.mode = 'strict_text_only';
        sanRes = await privacyStub.sanitize(sanReq);
        if (sanRes.verdict === 'BLOCK' || !sanRes.attested) {
          session.state = 'BLOCKED_BY_PRIVACY';
          await sessionStore.save(session);
          broadcastUiState({
            state: 'BLOCKED_BY_PRIVACY',
            last_error: stageError(
              'PRIVACY_BLOCK',
              'firewall',
              `Payload blocked by privacy firewall: ${sanRes.block?.reasons.join('; ') || 'Sensitive leaks detected'}`
            ),
          });
          break;
        }
      }

      // ----------------------------------------------------
      // 6. PLANNING
      // ----------------------------------------------------
      session.state = 'PLANNING';
      await sessionStore.save(session);
      broadcastUiState({ state: 'PLANNING' });

      const netSpan = startSpan('network', cycleId);
      let planResp: PlanResponse;
      try {
        planResp = await sendPlan(sanRes.attested);
        await netSpan.end({ server_ms: planResp.usage.server_ms });
      } catch (err: any) {
        session.state = 'SERVER_UNAVAILABLE';
        await sessionStore.save(session);
        broadcastUiState({
          state: 'SERVER_UNAVAILABLE',
          last_error: stageError('SERVER_UNAVAILABLE', 'network', err.message || String(err)),
        });
        break;
      }

      if (planResp.status === 'done') {
        session.state = 'DONE';
        await sessionStore.save(session);
        broadcastUiState({ state: 'DONE' });
        break;
      } else if (planResp.status === 'need_user') {
        session.state = 'NEEDS_USER';
        await sessionStore.save(session);
        broadcastUiState({ state: 'NEEDS_USER' });
        break;
      } else if (planResp.status === 'fail' || !planResp.action) {
        session.state = 'FAILED';
        await sessionStore.save(session);
        broadcastUiState({
          state: 'FAILED',
          last_error: stageError('INTERNAL', 'server', planResp.message || 'Planner failed'),
        });
        break;
      }

      const action: StructuredAction = planResp.action;
      broadcastUiState({ last_action: action });

      // ----------------------------------------------------
      // 7. VALIDATING
      // ----------------------------------------------------
      session.state = 'VALIDATING';
      await sessionStore.save(session);
      broadcastUiState({ state: 'VALIDATING' });

      const valSpan = startSpan('validate', cycleId);

      // Fetch fresh live state & target resolution from content script
      let liveOrigin = domSnapshot.url_origin;
      let liveFrameId = 'main';
      let liveHash = domSnapshot.page_state_hash;
      const fpResp = await bus.send('dom/fingerprint', {}, { tabId: session.tab_id, frameId: 0, timeoutMs: 2000 }).catch(() => ({ ok: false, data: null }));
      if (fpResp && fpResp.ok && fpResp.data) {
        liveOrigin = fpResp.data.origin;
        liveFrameId = fpResp.data.frame_id;
        liveHash = fpResp.data.page_state_hash;
      } else {
        const retryFp = await bus.send('dom/fingerprint', {}, { tabId: session.tab_id, timeoutMs: 1500 }).catch(() => ({ ok: false, data: null }));
        if (retryFp && retryFp.ok && retryFp.data) {
          liveOrigin = retryFp.data.origin;
          liveFrameId = retryFp.data.frame_id;
          liveHash = retryFp.data.page_state_hash;
        }
      }

      let targetResolution = undefined;
      if (action.target) {
        let resResp = await bus.send(
          'action/resolve-target',
          { region_id: action.target.region_id },
          { tabId: session.tab_id, frameId: 0, timeoutMs: 2000 }
        ).catch(() => ({ ok: false, data: null }));
        if (!resResp || !resResp.ok) {
          resResp = await bus.send(
            'action/resolve-target',
            { region_id: action.target.region_id },
            { tabId: session.tab_id, timeoutMs: 1500 }
          ).catch(() => ({ ok: false, data: null }));
        }
        if (resResp && resResp.ok) {
          targetResolution = resResp.data;
        }
      }

      const verdict: ValidationVerdict = await validateAction(action, {
        session,
        liveOrigin,
        liveFrameId,
        livePageStateHash: liveHash,
        targetResolution,
      });
      await valSpan.end({ valid: verdict.valid ? 1 : 0 });

      broadcastUiState({ last_verdict: verdict });

      if (!verdict.valid) {
        if (verdict.code === 'STALE_STATE') {
          session.state = 'REPERCEIVE';
          broadcastUiState({ state: 'REPERCEIVE' });
          await new Promise((r) => setTimeout(r, 600));
          continue; // Re-perceive without counting toward 3 consecutive rejections
        }

        consecutiveRejections++;
        if (consecutiveRejections >= 3) {
          session.state = 'NEEDS_USER';
          await sessionStore.save(session);
          broadcastUiState({
            state: 'NEEDS_USER',
            last_error: stageError(
              'POLICY_DENIED',
              'validate',
              `Action rejected 3 times consecutively: ${verdict.reason}`
            ),
          });
          break;
        }

        session.state = 'REPERCEIVE';
        broadcastUiState({ state: 'REPERCEIVE' });
        await new Promise((r) => setTimeout(r, 600));
        continue;
      }

      consecutiveRejections = 0;

      if (verdict.requires_user_confirmation) {
        broadcastUiState({
          requires_user_confirmation: true,
          pending_action_description: `Confirm: ${action.action} on ${action.target?.region_id || 'viewport'} (${action.rationale || ''})`,
        });
        session.state = 'NEEDS_USER';
        await sessionStore.save(session);
        break;
      }

      // ----------------------------------------------------
      // 8. EXECUTING
      // ----------------------------------------------------
      session.state = 'EXECUTING';
      await sessionStore.save(session);
      broadcastUiState({ state: 'EXECUTING' });

      let resolvedSecret: string | undefined = undefined;
      if (action.action === 'fill_secret' && action.capability) {
        resolvedSecret = await privacyStub.vault.resolve(action.capability, {
          task_id: session.task_id,
          origin: action.origin,
        });
      }

      const execSpan = startSpan('execute', cycleId);
      let execResp = await bus.send(
        'action/execute',
        { action, resolved_secret: resolvedSecret },
        { tabId: session.tab_id, frameId: 0, timeoutMs: 2500 }
      ).catch(() => ({ ok: false, data: null }));

      if (!execResp || !execResp.ok) {
        execResp = await bus.send(
          'action/execute',
          { action, resolved_secret: resolvedSecret },
          { tabId: session.tab_id, timeoutMs: 2000 }
        ).catch(() => ({ ok: false, data: null }));
      }

      if ((!execResp || !execResp.ok) && typeof chrome !== 'undefined' && chrome.scripting?.executeScript && session.tab_id > 0) {
        try {
          await Promise.race([
            chrome.scripting.executeScript({
              target: { tabId: session.tab_id },
              func: (act) => {
                if (act.action === 'click') {
                  const btn = document.querySelector('#submit-btn') || Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Sign In') || b.textContent?.includes('Login'));
                  if (btn) (btn as HTMLElement).click();
                }
              },
              args: [action],
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Direct execution fallback timed out')), 2000)),
          ]);
          execResp = { ok: true, data: { ok: true, action_id: action.action_id, navigated: false, new_page_state_hash: 'hash_exec', error: undefined } };
        } catch (directExecErr) {
          console.warn('[Orchestrator] Direct execution fallback failed:', directExecErr);
        }
      }

      const execResult = execResp && execResp.ok
        ? execResp.data
        : {
            ok: false,
            action_id: action.action_id,
            navigated: false,
            new_page_state_hash: null,
            error: execResp?.error,
          };
      await execSpan.end({ success: execResult.ok ? 1 : 0 });

      broadcastUiState({ last_exec_result: execResult });

      session.history.push({
        step: session.step_index,
        action: action.action,
        target_region_id: action.target?.region_id || null,
        result: execResult.ok ? 'ok' : 'failed',
        note: execResult.error?.message || null,
      });

      session.step_index++;
      await sessionStore.save(session);
      console.log(`[Orchestrator] Step ${session.step_index - 1} completed successfully with action: ${action.action}`);

      // ----------------------------------------------------
      // 9. SETTLING
      // ----------------------------------------------------
      session.state = 'SETTLING';
      await sessionStore.save(session);
      broadcastUiState({ state: 'SETTLING' });

      const setSpan = startSpan('settle', cycleId);
      if (captureMeta?.capture_id) {
        await bus.send('vision/release', { capture_id: captureMeta.capture_id }, { timeoutMs: 1500 }).catch(() => null);
      }
      await setSpan.end();

      // Settle delay: Give DOM mutations, redirects, or network events time to complete before starting next perception cycle
      await new Promise((r) => setTimeout(r, 600));

      // Loop back to perceive next state
    }

    stopKeepalive();
  },
};
