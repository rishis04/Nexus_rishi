import type { DirtyEvent } from '@contracts/index.js';
import { bus } from '@contracts/index.js';

let mutationObserver: MutationObserver | null = null;
let lastScrollY = 0;
let scrollTimeout: any = null;

export function startDomObservers(frameId = 'main'): () => void {
  if (typeof document === 'undefined') return () => {};

  // 1. MutationObserver
  mutationObserver = new MutationObserver((mutations) => {
    let affectedBBox: [number, number, number, number] | null = null;

    for (const m of mutations) {
      const target = m.target as HTMLElement;
      if (target.closest?.('[data-agent-ui]') || target.id === '__sih_agent_ui_host__') {
        continue;
      }
      if (target.getBoundingClientRect) {
        const rect = target.getBoundingClientRect();
        affectedBBox = [rect.left, rect.top, rect.width, rect.height];
        break;
      }
    }

    const event: DirtyEvent = {
      reason: 'mutation',
      bbox: affectedBBox,
      frame_id: frameId,
      ts: Date.now(),
    };

    bus.send('dom/dirty', event).catch(() => {});
  });

  mutationObserver.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'hidden', 'aria-hidden', 'disabled'],
  });

  // 2. Scroll listener
  const onScroll = () => {
    if (Math.abs(window.scrollY - lastScrollY) < 32) return;
    lastScrollY = window.scrollY;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const event: DirtyEvent = {
        reason: 'scroll',
        bbox: null,
        frame_id: frameId,
        ts: Date.now(),
      };
      bus.send('dom/dirty', event).catch(() => {});
    }, 100);
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    mutationObserver?.disconnect();
    window.removeEventListener('scroll', onScroll);
    clearTimeout(scrollTimeout);
  };
}
