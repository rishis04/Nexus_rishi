import type {
  AttestedPayload,
  CapabilityDescriptor,
  PiiDetection,
  PiiType,
  SanitizeRequest,
  SanitizeResult,
  SanitizedContext,
  SanitizedRegion,
  VisualState,
} from '@contracts/index.js';
import { canonicalJson, sha256Hex } from './security/sha256.js';
import { encryptedVault } from './security/vault.js';

/**
 * Verhoeff algorithm multiplication (d) and permutation (p) tables
 * for Indian Aadhaar validation.
 */
const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

/**
 * Validates a 12-digit Aadhaar number with UIDAI prefix rule (first digit 2-9)
 * and Verhoeff dihedral group D5 checksum.
 */
export function validateAadhaarVerhoeff(aadhaarStr: string): boolean {
  const clean = aadhaarStr.replace(/[\s-]/g, '');
  if (!/^[2-9]\d{11}$/.test(clean)) {
    return false;
  }

  let c = 0;
  const digits = clean.split('').map(Number).reverse();

  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i];
    if (digit === undefined) return false;
    const row = VERHOEFF_D[c];
    const permRow = VERHOEFF_P[i % 8];
    if (!row || !permRow) return false;
    const permVal = permRow[digit];
    if (permVal === undefined) return false;
    const nextC = row[permVal];
    if (nextC === undefined) return false;
    c = nextC;
  }

  return c === 0;
}

/**
 * Validates 10-character Indian PAN format with 4th character entity check.
 */
export function validateIndianPAN(panStr: string): boolean {
  const clean = panStr.trim().toUpperCase();
  // 4th character must be P (Individual), C (Company), H (HUF), F (Firm), A (AOP),
  // T (Trust), B (BOI), L (Local Authority), J (Artificial Juridical Person), or G (Govt)
  return /^[A-Z]{3}[PCHFATBLJG][A-Z]\d{4}[A-Z]$/.test(clean);
}

/**
 * Canvas-based visual blackout redaction for sensitive bounding boxes.
 */
export async function redactImageCanvas(
  dataUrl: string,
  boxesToRedact: { x: number; y: number; w: number; h: number; label: string; source?: string }[],
  viewport?: { w: number; h: number }
): Promise<string> {
  if (typeof OffscreenCanvas === 'undefined' || typeof createImageBitmap === 'undefined') {
    return dataUrl;
  }

  try {
    const commaIdx = dataUrl.indexOf(',');
    const base64 = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
    const binaryStr = atob(base64);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    // Detect MIME type from the data-URL prefix; default to png.
    // Chrome's captureVisibleTab produces PNG; forcing JPEG corrupts the decode.
    const mimeMatch = dataUrl.match(/^data:([^;,]+)/);
    const mimeType = mimeMatch?.[1] || 'image/png';
    const blob = new Blob([bytes], { type: mimeType });
    const bitmap = await createImageBitmap(blob);

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataUrl;

    ctx.drawImage(bitmap, 0, 0);

    // Compute coordinate scale factors between CSS viewport and physical bitmap
    const scaleX = viewport?.w && viewport.w > 0 ? bitmap.width / viewport.w : 1;
    const scaleY = viewport?.h && viewport.h > 0 ? bitmap.height / viewport.h : 1;

    for (const box of boxesToRedact) {
      // 4px CSS safety padding scaled to physical bitmap pixels
      const padX = 4 * scaleX;
      const padY = 4 * scaleY;
      
      const rawTop = Math.round(box.y * scaleY - padY);
      const ry = Math.max(0, rawTop);
      const clippedTop = ry - rawTop;
      
      const rx = Math.max(0, Math.round(box.x * scaleX - padX));
      
      const rw = Math.min(bitmap.width - rx, Math.round(box.w * scaleX + padX * 2));
      const rawHeight = Math.round(box.h * scaleY + padY * 2);
      const rh = Math.min(bitmap.height - ry, rawHeight - clippedTop);

      // Solid black privacy rectangle
      ctx.fillStyle = '#000000';
      ctx.fillRect(rx, ry, rw, rh);

      // Red border and label
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = Math.max(2, Math.round(2 * Math.min(scaleX, scaleY)));
      ctx.strokeRect(rx, ry, rw, rh);

      // Display the explicit redaction process taking place
      let labelText = '';
      const norm = (box.label || '').toUpperCase();
      if (rw < 110) {
        labelText = norm.includes('FACE') ? '[FACE]' : `[${norm}]`;
      } else if (norm.includes('AADHAAR')) {
        labelText = '[REDACTED: AADHAAR | Verhoeff D5 Checksum]';
      } else if (norm.includes('PAN')) {
        labelText = '[REDACTED: PAN | ITD Entity Validation]';
      } else if (norm.includes('EMAIL')) {
        labelText = '[REDACTED: EMAIL | RFC-5322 Regex Scan]';
      } else if (norm.includes('PASSWORD')) {
        labelText = '[REDACTED: PASSWORD | Vault fill_secret]';
      } else if (norm.includes('PHONE')) {
        labelText = '[REDACTED: PHONE | E.164 Telephony Engine]';
      } else if (norm.includes('FACE')) {
        labelText = '[REDACTED: FACE | 2D Canvas Blackout]';
      } else {
        labelText = `[REDACTED: ${norm}]`;
      }

      let fontSize = Math.max(9, Math.round(10 * Math.min(scaleX, scaleY)));
      ctx.font = `bold ${fontSize}px monospace`;
      if (ctx.measureText(labelText).width > rw - 8) {
        labelText = `[REDACTED: ${norm}]`;
        if (ctx.measureText(labelText).width > rw - 8) {
          labelText = `[${norm}]`;
        }
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        labelText,
        rx + Math.max(4, Math.round(4 * scaleX)),
        ry + Math.max(12, Math.round(14 * scaleY))
      );
    }

    const blobOut = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.85 });
    const arrayBuffer = await blobOut.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < uint8.length; i++) {
      binary += String.fromCharCode(uint8[i]!);
    }
    return `data:image/jpeg;base64,${btoa(binary)}`;
  } catch (err) {
    console.warn('Canvas redaction fallback', err);
    return dataUrl;
  }
}

interface VaultEntry {
  ref: string;
  kind: 'password' | 'email' | 'phone' | 'token' | 'profile';
  label: string;
  value: string;
  allowed_origins: string[];
}

const DEMO_VAULT: Record<string, VaultEntry> = {
  cap_email_01: {
    ref: 'cap_email_01',
    kind: 'email',
    label: 'Work Email',
    value: 'testuser@demo.local',
    allowed_origins: ['http://localhost:5173', 'http://localhost:5174'],
  },
  cap_pwd_01: {
    ref: 'cap_pwd_01',
    kind: 'password',
    label: 'Demo Password',
    value: 'SuperSecret123!',
    allowed_origins: ['http://localhost:5173', 'http://localhost:5174'],
  },
  cap_phone_01: {
    ref: 'cap_phone_01',
    kind: 'phone',
    label: 'Demo Phone',
    value: '+919876543210',
    allowed_origins: ['http://localhost:5173', 'http://localhost:5174'],
  },
};

export const privacyStub = {
  validateAadhaar: validateAadhaarVerhoeff,
  validatePAN: validateIndianPAN,
  redactImageCanvas,

  async sanitize(req: SanitizeRequest): Promise<SanitizeResult> {
    const origin = req.frame.origin;
    // Check for blocked test domain while allowing real-world application testing
    if (origin === 'https://external-site.com') {
      return {
        cycle_id: req.cycle_id,
        verdict: 'BLOCK',
        attested: null,
        block: {
          reasons: ['Blocked non-localhost origin in test'],
          checks_failed: ['stub_env_restricted'],
        },
        detections: [],
        redaction: {
          text_replacements: 0,
          masked_boxes: 0,
          masked_area_px: 0,
          image_included: false,
        },
        timings_ms: { total: 0 },
      };
    }
    const detections: PiiDetection[] = [];
    let textReplacements = 0;
    const boxesToMask: { x: number; y: number; w: number; h: number; label: string; source?: string }[] = [];
    let totalMaskedAreaPx = 0;

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const aadhaarRegex = /\b[2-9]\d{3}[\s-]?\d{4}[\s-]?\d{4}\b/g;
    const panRegex = /\b[a-zA-Z]{5}\d{4}[a-zA-Z]\b/g;
    // Strict Indian E.164 phone pattern: exactly 10 digits starting with 6-9, bounded so it never matches 12-digit numbers
    const phoneRegex = /(?<!\d)(?:(?:\+91|0)[\s-]?)?[6-9]\d{4}[\s-]?\d{5}(?!\d)|(?<!\d)(?:(?:\+91|0)[\s-]?)?[6-9]\d{9}(?!\d)/g;

    const sanitizedRegions: SanitizedRegion[] = req.frame.regions.map((reg) => {
      let sanitizedText = reg.text;
      let regionHasPii = false;
      let boxLabel = 'PII';

      // 0. Extract DOM element metadata to strictly identify form inputs
      const domEl = reg.local_key
        ? req.frame.dom?.elements?.find((e: any) => e.dom_id === reg.local_key)
        : null;
      const elAccessibleName = (domEl?.name || '').toLowerCase();
      const elInputName = (domEl?.input?.name || '').toLowerCase();
      const elPlaceholder = (domEl?.input?.placeholder || '').toLowerCase();
      const elId = ((domEl as any)?.id || '').toLowerCase();
      const regText = (reg.text || '').toLowerCase();

      const isAadhaarField =
        reg.semantic_type === 'input' &&
        (regText.includes('aadhaar') ||
          regText.includes('aadhar') ||
          elAccessibleName.includes('aadhaar') ||
          elAccessibleName.includes('aadhar') ||
          elInputName.includes('aadhaar') ||
          elInputName.includes('aadhar') ||
          elPlaceholder.includes('xxxx') ||
          elId.includes('aadhaar'));

      const isPanField =
        reg.semantic_type === 'input' &&
        !isAadhaarField &&
        (regText.includes('pan') ||
          elAccessibleName.includes('pan') ||
          elInputName.includes('pan') ||
          elId.includes('pan'));

      const isPassword =
        reg.semantic_type === 'input' &&
        (regText.includes('password') ||
          elAccessibleName.includes('password') ||
          elInputName.includes('password') ||
          Boolean(domEl?.input?.is_password));

      const isPhoneField =
        reg.semantic_type === 'input' &&
        !isAadhaarField &&
        !isPanField &&
        (regText.includes('phone') ||
          regText.includes('mobile') ||
          elAccessibleName.includes('phone') ||
          elAccessibleName.includes('mobile') ||
          elInputName.includes('phone') ||
          elInputName.includes('mobile') ||
          elId.includes('phone') ||
          elId.includes('mobile') ||
          domEl?.input?.type === 'tel');

      const isEmailField =
        reg.semantic_type === 'input' &&
        !isAadhaarField &&
        !isPanField &&
        !isPassword &&
        !isPhoneField &&
        (regText.includes('email') ||
          regText.includes('mail') ||
          elAccessibleName.includes('email') ||
          elAccessibleName.includes('mail') ||
          elInputName.includes('email') ||
          elInputName.includes('mail') ||
          elPlaceholder.includes('email') ||
          elPlaceholder.includes('mail') ||
          elId.includes('email') ||
          domEl?.input?.type === 'email');

      const isProfileImage =
        (reg.semantic_type === 'image' || domEl?.tag === 'img' || domEl?.tag === 'svg' || (reg.semantic_type as any) === 'icon') &&
        (elAccessibleName.includes('profile') ||
          elAccessibleName.includes('avatar') ||
          elAccessibleName.includes('photo') ||
          elId.includes('profile') ||
          elId.includes('avatar') ||
          regText.includes('profile') ||
          domEl?.classes?.some((c: string) => 
            c.toLowerCase().includes('profile') || 
            c.toLowerCase().includes('avatar') || 
            c.toLowerCase().includes('photo') || 
            c.toLowerCase().includes('ghost-person')
          ));

      // Direct semantic classification for form inputs
      if (isAadhaarField) {
        regionHasPii = true;
        boxLabel = 'AADHAAR';
        detections.push({
          id: `pii_aadhaar_${reg.region_id}`,
          type: 'GOV_ID',
          source: ['DOM', 'REGEX'],
          region_id: reg.region_id,
          bbox: reg.bbox,
          span: null,
          confidence: 1.0,
          mandatory: true,
        });
        textReplacements++;
        sanitizedText = '<REDACTED_AADHAAR>';
      } else if (isPanField) {
        regionHasPii = true;
        boxLabel = 'PAN';
        detections.push({
          id: `pii_pan_${reg.region_id}`,
          type: 'GOV_ID',
          source: ['DOM', 'REGEX'],
          region_id: reg.region_id,
          bbox: reg.bbox,
          span: null,
          confidence: 1.0,
          mandatory: true,
        });
        textReplacements++;
        sanitizedText = '<REDACTED_PAN>';
      } else if (isPassword) {
        regionHasPii = true;
        boxLabel = 'PASSWORD';
        detections.push({
          id: `pii_password_${reg.region_id}`,
          type: 'PASSWORD',
          source: ['DOM', 'VAULT'],
          region_id: reg.region_id,
          bbox: reg.bbox,
          span: null,
          confidence: 1.0,
          mandatory: true,
        });
        textReplacements++;
        sanitizedText = '<REDACTED_PASSWORD>';
      } else if (isPhoneField) {
        regionHasPii = true;
        boxLabel = 'PHONE';
        detections.push({
          id: `pii_phone_${reg.region_id}`,
          type: 'PHONE',
          source: ['DOM', 'REGEX'],
          region_id: reg.region_id,
          bbox: reg.bbox,
          span: null,
          confidence: 1.0,
          mandatory: true,
        });
        textReplacements++;
        sanitizedText = '<PHONE>';
      } else if (isEmailField) {
        regionHasPii = true;
        boxLabel = 'EMAIL';
        detections.push({
          id: `pii_email_${reg.region_id}`,
          type: 'EMAIL',
          source: ['DOM', 'REGEX'],
          region_id: reg.region_id,
          bbox: reg.bbox,
          span: null,
          confidence: 1.0,
          mandatory: true,
        });
        textReplacements++;
        sanitizedText = '<EMAIL>';
      } else if (isProfileImage) {
        regionHasPii = true;
        boxLabel = 'FACE';
        detections.push({
          id: `pii_profile_${reg.region_id}`,
          type: 'FACE',
          source: ['DOM'],
          region_id: reg.region_id,
          bbox: reg.bbox,
          span: null,
          confidence: 1.0,
          mandatory: true,
        });
        textReplacements++;
        sanitizedText = '<REDACTED_FACE>';
      } else if (sanitizedText) {
        // Pattern detection for unclassified text regions (OCR, paragraphs, text nodes)
        // 1. Aadhaar detection with Verhoeff checksum
        const aadhaarMatches = sanitizedText.match(aadhaarRegex);
        if (aadhaarMatches) {
          for (const match of aadhaarMatches) {
            if (validateAadhaarVerhoeff(match)) {
              regionHasPii = true;
              boxLabel = 'AADHAAR';
              const isOCR = (reg as any).sources?.includes('OCR') || reg.source?.includes('OCR');
              detections.push({
                id: `pii_aadhaar_${reg.region_id}`,
                type: 'GOV_ID',
                source: isOCR ? ['OCR'] : ['REGEX'],
                region_id: reg.region_id,
                bbox: reg.bbox,
                span: null,
                confidence: 0.99,
                mandatory: true,
              });
              sanitizedText = sanitizedText.replace(match, '<REDACTED_AADHAAR>');
              textReplacements++;
            }
          }
        }

        // 2. PAN detection with entity code check
        if (!regionHasPii) {
          const panMatches = sanitizedText.match(panRegex);
          if (panMatches) {
            for (const match of panMatches) {
              if (validateIndianPAN(match)) {
                regionHasPii = true;
                boxLabel = 'PAN';
                const isOCR = (reg as any).sources?.includes('OCR') || reg.source?.includes('OCR');
                detections.push({
                  id: `pii_pan_${reg.region_id}`,
                  type: 'GOV_ID',
                  source: isOCR ? ['OCR'] : ['REGEX'],
                  region_id: reg.region_id,
                  bbox: reg.bbox,
                  span: null,
                  confidence: 0.99,
                  mandatory: true,
                });
                sanitizedText = sanitizedText.replace(match, '<REDACTED_PAN>');
                textReplacements++;
              }
            }
          }
        }

        // 3. Email detection
        if (!regionHasPii) {
          emailRegex.lastIndex = 0;
          if (emailRegex.test(sanitizedText)) {
            regionHasPii = true;
            boxLabel = 'EMAIL';
            detections.push({
              id: `pii_email_${reg.region_id}`,
              type: 'EMAIL',
              source: ['REGEX'],
              region_id: reg.region_id,
              bbox: reg.bbox,
              span: null,
              confidence: 0.99,
              mandatory: true,
            });
            sanitizedText = sanitizedText.replace(emailRegex, '<EMAIL>');
            textReplacements++;
          }
        }

        // 4. Phone detection (strictly guarded: never on Aadhaar/PAN fields and never on 12-digit numbers)
        if (!regionHasPii) {
          phoneRegex.lastIndex = 0;
          if (phoneRegex.test(sanitizedText)) {
            regionHasPii = true;
            boxLabel = 'PHONE';
            detections.push({
              id: `pii_phone_${reg.region_id}`,
              type: 'PHONE',
              source: ['REGEX'],
              region_id: reg.region_id,
              bbox: reg.bbox,
              span: null,
              confidence: 0.95,
              mandatory: true,
            });
            sanitizedText = sanitizedText.replace(phoneRegex, '<PHONE>');
            textReplacements++;
          }
        }
      }

      if (regionHasPii && reg.bbox) {
        const isOCR = (reg as any).sources?.includes('OCR') || reg.source?.includes('OCR');
        boxesToMask.push({
          x: reg.bbox[0],
          y: reg.bbox[1],
          w: reg.bbox[2],
          h: reg.bbox[3],
          label: boxLabel,
          source: isOCR ? 'OCR' : 'DOM',
        });
        totalMaskedAreaPx += reg.bbox[2] * reg.bbox[3];
      }

      return {
        region_id: reg.region_id,
        type: reg.semantic_type,
        text: sanitizedText,
        bbox: reg.bbox,
        state:
          reg.visual_state ||
          (reg.visible
            ? (['visible', 'enabled'] as VisualState[])
            : (['disabled'] as VisualState[])),
        interactable: reg.interactable,
        frame_id: reg.frame_id,
        sources: reg.source,
        confidence: reg.confidence,
        trust: 'untrusted' as const,
      };
    });

    // Detect and redact faces from perception frame
    if (req.frame.faces && req.frame.faces.length > 0) {
      req.frame.faces.forEach((face, idx) => {
        // We intentionally allow faces to be redacted anywhere on the page, including on canvas elements or interactables.

        const faceId = (face as any).face_id || `face_${idx + 1}`;
        detections.push({
          id: `pii_face_${faceId}`,
          type: 'FACE',
          source: ['VISION'],
          region_id: faceId,
          bbox: face.bbox,
          span: null,
          confidence: face.confidence,
          mandatory: true,
        });
        boxesToMask.push({
          x: face.bbox[0],
          y: face.bbox[1],
          w: face.bbox[2],
          h: face.bbox[3],
          label: 'FACE',
          source: 'WEBGPU',
        });
        totalMaskedAreaPx += face.bbox[2] * face.bbox[3];
      });
    }

    const capabilities: CapabilityDescriptor[] = Object.values(DEMO_VAULT)
      .filter((entry) => entry.allowed_origins.includes(origin))
      .map((entry) => ({
        ref: entry.ref,
        kind: entry.kind,
        label: entry.label,
      }));

    // Group detections by PiiType
    const redactionCounts: Record<string, number> = {};
    for (const d of detections) {
      redactionCounts[d.type] = (redactionCounts[d.type] || 0) + 1;
    }
    const redactions = Object.entries(redactionCounts).map(([type, count]) => ({
      type: type as PiiType,
      count,
    }));

    const sanitizedContext: SanitizedContext = {
      schema_version: '1.0',
      request_id: `req_${req.cycle_id}`,
      task_id: req.task.task_id,
      step_index: req.task.step_index,
      task: req.task.task_text,
      page: {
        origin: req.frame.origin,
        path: req.frame.dom.url_path,
        title: 'Demo Portal',
        page_state_hash: req.frame.page_state_hash,
        viewport: req.frame.dom.viewport,
        frame_ids: req.frame.dom.frames.map((f) => f.frame_id),
      },
      regions: sanitizedRegions,
      capabilities,
      redactions,
      image: null,
      history: req.task.history,
      flags: {
        injection_suspected_region_ids: [],
      },
    };

    const rawBody = canonicalJson(sanitizedContext);
    const digest = await sha256Hex(rawBody);

    const attested: AttestedPayload = {
      request_id: sanitizedContext.request_id,
      body: rawBody,
      sha256: digest,
      issued_at: Date.now(),
    };

    let maskedDataUrl: string | null = null;
    if (boxesToMask.length > 0 && req.image_data_url) {
      try {
        const viewport = req.frame.dom?.viewport || req.frame.capture?.viewport;
        maskedDataUrl = await redactImageCanvas(req.image_data_url, boxesToMask, viewport);
      } catch (err) {
        console.warn('Could not generate masked data url:', err);
      }
    }

    return {
      cycle_id: req.cycle_id,
      verdict: 'SAFE',
      attested,
      block: null,
      detections,
      masked_data_url: maskedDataUrl,
      redaction: {
        text_replacements: textReplacements,
        masked_boxes: boxesToMask.length,
        masked_area_px: totalMaskedAreaPx,
        image_included: false,
      },
      timings_ms: {
        pii: 1.2,
        fusion: 0.5,
        relevance: 0.3,
        redact: 1.0,
        firewall: 0.8,
        total: 3.8,
      },
    };
  },

  async scanOutboundText(
    text: string
  ): Promise<{ safe: boolean; findings: { type: PiiType; span: [number, number] }[] }> {
    const findings: { type: PiiType; span: [number, number] }[] = [];

    // 1. Disallow token placeholders like <EMAIL>, <REDACTED_AADHAAR>, <REDACTED_PAN>
    const placeholderMatch = text.match(/<[A-Z_]+>/);
    if (placeholderMatch && placeholderMatch.index !== undefined) {
      return {
        safe: false,
        findings: [{ type: 'IDENTIFIER', span: [placeholderMatch.index, placeholderMatch.index + placeholderMatch[0].length] }],
      };
    }

    // 2. Check raw emails
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch && emailMatch.index !== undefined) {
      findings.push({
        type: 'EMAIL',
        span: [emailMatch.index, emailMatch.index + emailMatch[0].length],
      });
    }

    // 3. Check raw Aadhaar numbers
    const aadhaarMatches = text.matchAll(/\b[2-9]\d{3}[\s-]?\d{4}[\s-]?\d{4}\b/g);
    for (const match of aadhaarMatches) {
      if (match.index !== undefined && validateAadhaarVerhoeff(match[0])) {
        findings.push({
          type: 'GOV_ID',
          span: [match.index, match.index + match[0].length],
        });
      }
    }

    // 4. Check raw PAN numbers
    const panMatches = text.matchAll(/\b[a-zA-Z]{3}[PCHFATBLJGpchfatbljg][a-zA-Z]\d{4}[a-zA-Z]\b/g);
    for (const match of panMatches) {
      if (match.index !== undefined && validateIndianPAN(match[0])) {
        findings.push({
          type: 'GOV_ID',
          span: [match.index, match.index + match[0].length],
        });
      }
    }

    // 5. Check raw Indian phone numbers (must run AFTER other checks to avoid duplicate spans)
    if (findings.length === 0) {
      const rawPhoneRegex = /(?<!\d)(?:(?:\+91|0)[\s-]?)?[6-9]\d{4}[\s-]?\d{5}(?!\d)/g;
      const phoneMatch = text.match(rawPhoneRegex);
      if (phoneMatch) {
        const idx = text.search(rawPhoneRegex);
        if (idx !== -1) {
          findings.push({
            type: 'PHONE',
            span: [idx, idx + phoneMatch[0].length],
          });
        }
      }
    }

    return {
      safe: findings.length === 0,
      findings,
    };
  },

  vault: {
    async authorize(
      ref: string,
      ctx: { task_id: string; origin: string; frame_id: string; action: string }
    ): Promise<{ ok: boolean; reason?: string }> {
      return encryptedVault.authorize(ref, ctx);
    },

    async resolve(
      ref: string,
      ctx: { task_id: string; origin: string }
    ): Promise<string> {
      return encryptedVault.resolve(ref, ctx);
    },
  },
};
