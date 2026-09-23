import type { DomElementInfo, DomSnapshot, FrameInfo } from '@contracts/index.js';
import { isElementOccluded, isElementVisible } from './visibility.js';
import { detectRenderingKind } from './rendering-kind.js';
import { computeAriaRole, extractAriaStates } from '../accessibility/role.js';
import { computeElementAccessibleName } from '../accessibility/name.js';
import { getLocalFrameOffset } from '../../content/frame-offsets.js';
import { elementRegistry } from '../../content/registry.js';
import { computePageStateHash } from '../../browser/state/fingerprint.js';

const CANDIDATE_SELECTOR = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  'details',
  'summary',
  'dialog',
  '[role]',
  '[tabindex]',
  '[contenteditable]',
  'label',
  'h1, h2, h3, h4, h5, h6',
  'canvas',
  'svg',
  'img',
  'video',
  'iframe',
].join(',');

export async function extractDomSnapshot(
  frameId = 'main',
  parentFrameId: string | null = null
): Promise<DomSnapshot> {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return {
      snapshot_id: `snap_${Date.now()}`,
      url_origin: 'http://localhost:5173',
      url_path: '/',
      frames: [
        {
          frame_id: frameId,
          parent_frame_id: parentFrameId,
          origin: 'http://localhost:5173',
          path: '/',
          offset: [0, 0],
          accessible: true,
        },
      ],
      elements: [],
      viewport: { w: 1280, h: 800 },
      dpr: 1,
      scroll: { x: 0, y: 0 },
      page_state_hash: '0000000000000000',
      ts: Date.now(),
    };
  }

  const urlOrigin = window.location.origin;
  const urlPath = window.location.pathname; // Stripped of query and hash
  const frameOffset = getLocalFrameOffset();

  const viewport = {
    w: window.innerWidth,
    h: window.innerHeight,
  };

  const frames: FrameInfo[] = [
    {
      frame_id: frameId,
      parent_frame_id: parentFrameId,
      origin: urlOrigin,
      path: urlPath,
      offset: frameOffset,
      accessible: true,
    },
  ];

  // Query candidates
  const rawElements = Array.from(document.querySelectorAll(CANDIDATE_SELECTOR));

  // Add elements with pointer cursor or onclick heuristic
  const allNodes = document.querySelectorAll('*');
  for (let i = 0; i < allNodes.length; i++) {
    const el = allNodes[i];
    if (!el) continue;
    if ((el as any).onclick || (el as HTMLElement).style?.cursor === 'pointer') {
      if (!rawElements.includes(el)) {
        rawElements.push(el);
      }
    }
  }

  // Filter out any agent UI host
  const filtered = rawElements.filter(
    (el) => !el.closest('[data-agent-ui]') && el.id !== '__sih_agent_ui_host__'
  );

  let nextId = 1;
  const elements: DomElementInfo[] = [];

  for (const el of filtered) {
    const domId = `d${nextId++}`;
    elementRegistry.register(domId, el);

    const rect = el.getBoundingClientRect();
    const tag = el.tagName.toLowerCase();
    const role = computeAriaRole(el);
    const name = computeElementAccessibleName(el);
    const aria = extractAriaStates(el);
    const { rendering, has_bg_image, handlers_hint } = detectRenderingKind(el);

    const bbox: [number, number, number, number] = [
      Math.round(rect.left + frameOffset[0]),
      Math.round(rect.top + frameOffset[1]),
      Math.round(rect.width),
      Math.round(rect.height),
    ];

    const visible = isElementVisible(el);
    const inViewport =
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top <= viewport.h &&
      rect.left <= viewport.w;

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const occluded = isElementOccluded(el, cx, cy);
    const interactable = visible && !aria.disabled && !occluded;

    let inputInfo: DomElementInfo['input'] = undefined;
    if (tag === 'input' || tag === 'textarea' || tag === 'select') {
      const inputEl = el as HTMLInputElement;
      const type = (inputEl.type || 'text').toLowerCase();
      const isPassword = type === 'password';
      const hasValue = Boolean(inputEl.value && inputEl.value.length > 0);

      inputInfo = {
        type,
        autocomplete: inputEl.autocomplete || null,
        name: inputEl.name || null,
        placeholder: inputEl.placeholder || null,
        is_password: isPassword,
        has_value: hasValue,
        value: isPassword ? null : inputEl.value || null, // Password value is NEVER captured
      };
    }

    const text = (el.textContent || '').trim().slice(0, 300);

    elements.push({
      dom_id: domId,
      frame_id: frameId,
      origin: urlOrigin,
      tag,
      role,
      name,
      text,
      aria,
      input: inputInfo,
      bbox,
      visible,
      in_viewport: inViewport,
      occluded,
      interactable,
      rendering,
      has_bg_image,
      handlers_hint,
      parent_dom_id: null,
    });
  }

  const pageStateHash = await computePageStateHash(
    urlOrigin,
    urlPath,
    frames,
    elements,
    window.scrollY
  );

  return {
    snapshot_id: `snap_${Date.now()}`,
    url_origin: urlOrigin,
    url_path: urlPath,
    frames,
    elements,
    viewport,
    dpr: window.devicePixelRatio || 1,
    scroll: { x: window.scrollX, y: window.scrollY },
    page_state_hash: pageStateHash,
    ts: Date.now(),
  };
}
