import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { AttestedPayload, SanitizeRequest, PerceptionFrame } from '@contracts/index.js';
import { sendPlan } from '../../extension/src/network/gate.js';
import { egressAuditAdapter, ExternalEgressAuditAdapter } from '../../extension/src/network/egress-audit/index.js';
import type { EgressAuditPayload } from '../../extension/src/network/egress-audit/types.js';
import { sha256Hex } from '../../extension/src/security/sha256.js';
import { privacyStub } from '../../extension/src/privacy/engine.js';

describe('Phase 6 — Cross-Repository Egress Audit Integration', () => {
  beforeEach(() => {
    egressAuditAdapter.setObserver(null);
    egressAuditAdapter.configure({ endpointUrl: null, enabled: false });
  });

  afterEach(() => {
    egressAuditAdapter.setObserver(null);
    egressAuditAdapter.configure({ endpointUrl: null, enabled: false });
    vi.restoreAllMocks();
  });

  // Scenario 1: Sanitized payload reaches adapter
  it('1. Sanitized payload reaches adapter with correct correlation attributes', async () => {
    let capturedPayload: EgressAuditPayload | null = null;
    egressAuditAdapter.setObserver((p) => {
      capturedPayload = p;
    });

    const bodyObj = {
      schema_version: '1.0',
      request_id: 'req_audit_test_01',
      task: 'navigate and audit',
      page: {
        origin: 'http://localhost:5173',
        path: '/dashboard',
        page_state_hash: 'hash_test_1',
        viewport: { w: 1280, h: 720 },
        frame_ids: ['main'],
      },
      regions: [
        {
          region_id: 'r_btn',
          type: 'button',
          text: 'Submit Safe Form',
          bbox: [10, 10, 100, 30],
          interactable: true,
        },
      ],
      capabilities: [],
      redactions: [],
      image: null,
      history: [],
      flags: { injection_suspected_region_ids: [] },
    };

    const rawBody = JSON.stringify(bodyObj);
    const digest = await sha256Hex(rawBody);
    const attested: AttestedPayload = {
      request_id: 'req_audit_test_01',
      body: rawBody,
      sha256: digest,
      issued_at: 1727650000000,
    };

    const resp = await sendPlan(attested);

    expect(resp).toBeDefined();
    expect(capturedPayload).not.toBeNull();
    expect(capturedPayload!.request_id).toBe('req_audit_test_01');
    expect(capturedPayload!.sha256).toBe(digest);
    expect(capturedPayload!.body).toBe(rawBody);
    expect(capturedPayload!.issued_at).toBe(1727650000000);
    expect(capturedPayload!.metadata?.egress_destination).toContain('/v1/plan');
  });

  // Scenario 2: Adapter does not modify the payload
  it('2. Adapter does not modify the attested payload (strictly immutable observation)', async () => {
    const originalBody = JSON.stringify({
      schema_version: '1.0',
      request_id: 'req_immutable_02',
      task: 'verify immutability',
      page: { origin: 'http://localhost:5173', path: '/', page_state_hash: 'hash_2', viewport: { w: 800, h: 600 }, frame_ids: ['main'] },
      regions: [{ region_id: 'r1', type: 'input', text: 'Safe placeholder', bbox: [0, 0, 50, 20], interactable: true }],
      capabilities: [],
      redactions: [],
      image: null,
      history: [],
      flags: { injection_suspected_region_ids: [] },
    });
    const originalDigest = await sha256Hex(originalBody);
    const originalIssuedAt = Date.now();

    const attested: AttestedPayload = {
      request_id: 'req_immutable_02',
      body: originalBody,
      sha256: originalDigest,
      issued_at: originalIssuedAt,
    };

    let observedBody = '';
    let observedDigest = '';
    egressAuditAdapter.setObserver((p) => {
      observedBody = p.body;
      observedDigest = p.sha256;
    });

    await sendPlan(attested);

    // Verify properties on input attested payload were not mutated in place
    expect(attested.body).toBe(originalBody);
    expect(attested.sha256).toBe(originalDigest);
    expect(attested.request_id).toBe('req_immutable_02');
    expect(attested.issued_at).toBe(originalIssuedAt);

    // Verify observed values match exactly
    expect(observedBody).toBe(originalBody);
    expect(observedDigest).toBe(originalDigest);
  });

  // Scenario 3: Adapter receives no raw PII when upstream privacy pipeline sanitizes it
  it('3. Adapter receives no raw PII when upstream privacy pipeline has sanitized it', async () => {
    const rawAadhaar = '5489 1234 5674';
    const rawPan = 'ABCDE1234F';
    const rawEmail = 'sensitive-test-user@domain.in';

    const testFrame: PerceptionFrame = {
      frame_uid: 'f_test_egress',
      cycle_id: 'c_test_egress',
      origin: 'http://localhost:5173',
      page_state_hash: 'hash_privacy_flow',
      ocr_tokens: [],
      capture: null,
      ts: Date.now(),
      dom: {
        snapshot_id: 'snap_test',
        url_origin: 'http://localhost:5173',
        url_path: '/kyc-form',
        viewport: { w: 1000, h: 800 },
        elements: [],
        frames: [],
        dpr: 1,
        scroll: { x: 0, y: 0 },
        page_state_hash: 'hash_privacy_flow',
        ts: Date.now(),
      },
      regions: [
        {
          region_id: 'r_email',
          local_key: 'd_email',
          source: ['DOM'],
          semantic_type: 'input',
          text: rawEmail,
          bbox: [10, 10, 200, 30],
          confidence: 1.0,
          visible: true,
          interactable: true,
          dom_ref: { dom_id: 'd_email', role: 'textbox', tag: 'input' },
          route: 'HIGH',
          sensitivity: 'pii',
          origin: 'http://localhost:5173',
          frame_id: 'main',
          page_state_hash: 'hash_privacy_flow',
          timestamp: Date.now(),
        } as any,
        {
          region_id: 'r_aadhaar',
          local_key: 'd_aadhaar',
          source: ['DOM'],
          semantic_type: 'input',
          text: `Aadhaar: ${rawAadhaar}`,
          bbox: [10, 50, 200, 30],
          confidence: 1.0,
          visible: true,
          interactable: true,
          dom_ref: { dom_id: 'd_aadhaar', role: 'textbox', tag: 'input' },
          route: 'HIGH',
          sensitivity: 'pii',
          origin: 'http://localhost:5173',
          frame_id: 'main',
          page_state_hash: 'hash_privacy_flow',
          timestamp: Date.now(),
        } as any,
        {
          region_id: 'r_pan',
          local_key: 'd_pan',
          source: ['DOM'],
          semantic_type: 'input',
          text: `PAN: ${rawPan}`,
          bbox: [10, 90, 200, 30],
          confidence: 1.0,
          visible: true,
          interactable: true,
          dom_ref: { dom_id: 'd_pan', role: 'textbox', tag: 'input' },
          route: 'HIGH',
          sensitivity: 'pii',
          origin: 'http://localhost:5173',
          frame_id: 'main',
          page_state_hash: 'hash_privacy_flow',
          timestamp: Date.now(),
        } as any,
      ],
      faces: [],
    };

    const sanReq: SanitizeRequest = {
      cycle_id: 'cyc_pii_flow',
      task: {
        task_id: 'task_pii',
        task_text: 'Complete KYC verification',
        allowed_actions: ['click', 'type'],
        allowed_origins: ['http://localhost:5173'],
        step_index: 0,
        history: [],
      },
      frame: testFrame,
      mode: 'normal',
      include_image: false,
    };

    const sanRes = await privacyStub.sanitize(sanReq);
    expect(sanRes.verdict).toBe('SAFE');
    expect(sanRes.attested).not.toBeNull();

    let auditedPayloadText = '';
    egressAuditAdapter.setObserver((p) => {
      auditedPayloadText = p.body;
    });

    await sendPlan(sanRes.attested!);

    // Ensure raw PII is scrubbed and not delivered to audit layer
    expect(auditedPayloadText).not.toContain(rawAadhaar);
    expect(auditedPayloadText).not.toContain(rawPan);
    expect(auditedPayloadText).not.toContain(rawEmail);

    // Verify that replacement tokens ARE present
    expect(auditedPayloadText).toContain('<REDACTED_AADHAAR>');
    expect(auditedPayloadText).toContain('<REDACTED_PAN>');
    expect(auditedPayloadText).toContain('<EMAIL>');
  });

  // Scenario 4: Screenshot bytes are unchanged
  it('4. Screenshot bytes and image payload remain completely unchanged', async () => {
    const syntheticImageDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

    const bodyObj = {
      schema_version: '1.0',
      request_id: 'req_img_04',
      task: 'screenshot task',
      page: { origin: 'http://localhost:5173', path: '/', page_state_hash: 'hash_img', viewport: { w: 1, h: 1 }, frame_ids: ['main'] },
      regions: [],
      capabilities: [],
      redactions: [],
      image: syntheticImageDataUrl,
      history: [],
      flags: { injection_suspected_region_ids: [] },
    };

    const rawBody = JSON.stringify(bodyObj);
    const digest = await sha256Hex(rawBody);
    const attested: AttestedPayload = {
      request_id: 'req_img_04',
      body: rawBody,
      sha256: digest,
      issued_at: Date.now(),
    };

    let capturedImage: string | null = null;
    egressAuditAdapter.setObserver((p) => {
      const parsed = JSON.parse(p.body);
      capturedImage = parsed.image;
    });

    await sendPlan(attested);

    expect(capturedImage).toBe(syntheticImageDataUrl);
    expect(JSON.parse(attested.body).image).toBe(syntheticImageDataUrl);
  });

  // Scenario 5: DOM/ARIA information is unchanged
  it('5. Structured DOM/ARIA region data is preserved verbatim across the boundary', async () => {
    const originalRegions = [
      {
        region_id: 'r_nav',
        type: 'navigation',
        text: 'Main Menu',
        bbox: [0, 0, 100, 40],
        interactable: true,
      },
      {
        region_id: 'r_table',
        type: 'table',
        text: 'Balance: [MASKED]',
        bbox: [0, 50, 400, 200],
        interactable: false,
      },
    ];

    const bodyObj = {
      schema_version: '1.0',
      request_id: 'req_dom_05',
      task: 'verify dom aria verbatim',
      page: { origin: 'http://localhost:5173', path: '/menu', page_state_hash: 'hash_menu', viewport: { w: 800, h: 600 }, frame_ids: ['main'] },
      regions: originalRegions,
      capabilities: [],
      redactions: [],
      image: null,
      history: [],
      flags: { injection_suspected_region_ids: [] },
    };

    const rawBody = JSON.stringify(bodyObj);
    const digest = await sha256Hex(rawBody);
    const attested: AttestedPayload = {
      request_id: 'req_dom_05',
      body: rawBody,
      sha256: digest,
      issued_at: Date.now(),
    };

    let receivedRegions: any = null;
    egressAuditAdapter.setObserver((p) => {
      receivedRegions = JSON.parse(p.body).regions;
    });

    await sendPlan(attested);

    expect(receivedRegions).toEqual(originalRegions);
  });

  // Scenario 6: Face-masking output is unchanged
  it('6. Face masking output and redaction metadata remain preserved and untouched', async () => {
    const faceRedactions = [
      { type: 'FACE', count: 2 },
      { type: 'AADHAAR', count: 1 },
    ];

    const bodyObj = {
      schema_version: '1.0',
      request_id: 'req_face_06',
      task: 'verify face redaction untouched',
      page: { origin: 'http://localhost:5173', path: '/profile', page_state_hash: 'h_face', viewport: { w: 1000, h: 800 }, frame_ids: ['main'] },
      regions: [{ region_id: 'r_face_profile', type: 'image', text: '[FACE_AVATAR_MASKED]', bbox: [50, 50, 120, 120], interactable: false }],
      capabilities: [],
      redactions: faceRedactions,
      image: 'data:image/png;base64,masked_face_image_bytes',
      history: [],
      flags: { injection_suspected_region_ids: [] },
    };

    const rawBody = JSON.stringify(bodyObj);
    const digest = await sha256Hex(rawBody);
    const attested: AttestedPayload = {
      request_id: 'req_face_06',
      body: rawBody,
      sha256: digest,
      issued_at: Date.now(),
    };

    let observedRedactions: any = null;
    let observedImage: any = null;
    egressAuditAdapter.setObserver((p) => {
      const parsed = JSON.parse(p.body);
      observedRedactions = parsed.redactions;
      observedImage = parsed.image;
    });

    await sendPlan(attested);

    expect(observedRedactions).toEqual(faceRedactions);
    expect(observedImage).toBe('data:image/png;base64,masked_face_image_bytes');
  });

  // Scenario 7: Audit service failure does not corrupt normal request
  it('7. External audit service failure or throwing observer does not crash or corrupt the request', async () => {
    // Adapter throwing an error simulated as a catastrophic audit service failure
    egressAuditAdapter.setObserver(() => {
      throw new Error('Connection refused: external audit service port 8001 offline');
    });

    const bodyObj = {
      schema_version: '1.0',
      request_id: 'req_fail_safe_07',
      task: 'safe failure test',
      page: { origin: 'http://localhost:5173', path: '/', page_state_hash: 'hash_safe', viewport: { w: 500, h: 500 }, frame_ids: ['main'] },
      regions: [{ region_id: 'r_btn', type: 'button', text: 'Continue', bbox: [0, 0, 50, 20], interactable: true }],
      capabilities: [],
      redactions: [],
      image: null,
      history: [],
      flags: { injection_suspected_region_ids: [] },
    };

    const rawBody = JSON.stringify(bodyObj);
    const digest = await sha256Hex(rawBody);
    const attested: AttestedPayload = {
      request_id: 'req_fail_safe_07',
      body: rawBody,
      sha256: digest,
      issued_at: Date.now(),
    };

    // sendPlan must succeed without propagating the error
    const resp = await sendPlan(attested);
    expect(resp).toBeDefined();
    expect(resp.status).toBe('action');
    expect(resp.action?.target?.region_id).toBe('r_btn');
  });

  // Scenario 8: Audit integration does not bypass Privacy Verifier
  it('8. Tampered payload is rejected by Privacy Verifier before reaching network egress', async () => {
    let adapterInvoked = false;
    egressAuditAdapter.setObserver(() => {
      adapterInvoked = true;
    });

    const validBody = JSON.stringify({ schema_version: '1.0', content: 'untampered' });
    const originalDigest = await sha256Hex(validBody);

    const tamperedPayload: AttestedPayload = {
      request_id: 'req_tampered_08',
      body: JSON.stringify({ schema_version: '1.0', content: 'tampered after hash' }),
      sha256: originalDigest, // Mismatched digest
      issued_at: Date.now(),
    };

    await expect(sendPlan(tamperedPayload)).rejects.toMatchObject({
      code: 'PRIVACY_BLOCK',
      stage: 'network',
    });

    // Adapter should NOT be called if verification fails
    expect(adapterInvoked).toBe(false);
  });

  // Scenario 9: Adapter is called at the correct pre-egress boundary
  it('9. Adapter is called at the exact pre-egress boundary with destination metadata', async () => {
    const callOrder: string[] = [];

    egressAuditAdapter.setObserver((p) => {
      callOrder.push('egress_audit_observe');
      expect(p.metadata?.egress_destination).toBeDefined();
    });

    const bodyObj = {
      schema_version: '1.0',
      request_id: 'req_boundary_09',
      task: 'boundary order test',
      page: { origin: 'http://localhost:5173', path: '/', page_state_hash: 'h_b', viewport: { w: 100, h: 100 }, frame_ids: ['main'] },
      regions: [{ region_id: 'r_b', type: 'button', text: 'Step', bbox: [0, 0, 10, 10], interactable: true }],
      capabilities: [],
      redactions: [],
      image: null,
      history: [],
      flags: { injection_suspected_region_ids: [] },
    };

    const rawBody = JSON.stringify(bodyObj);
    const digest = await sha256Hex(rawBody);
    const attested: AttestedPayload = {
      request_id: 'req_boundary_09',
      body: rawBody,
      sha256: digest,
      issued_at: Date.now(),
    };

    callOrder.push('before_send_plan');
    const resp = await sendPlan(attested);
    callOrder.push('after_send_plan');

    expect(callOrder).toEqual(['before_send_plan', 'egress_audit_observe', 'after_send_plan']);
    expect(resp.status).toBe('action');
  });

  // Scenario 10: Standalone adapter network failure simulation
  it('10. HTTP endpoint failure in adapter logs warning without unhandled rejection', async () => {
    const adapter = new ExternalEgressAuditAdapter();
    adapter.configure({
      endpointUrl: 'http://127.0.0.1:59999/non-existent-audit-service',
      enabled: true,
    });

    // Mock fetch to simulate network connection error
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('ECONNREFUSED'));

    const testPayload: EgressAuditPayload = {
      request_id: 'req_net_fail_10',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      body: '{}',
      issued_at: Date.now(),
    };

    // Must resolve gracefully without throwing
    await expect(adapter.observe(testPayload)).resolves.toBeUndefined();
    expect(fetchSpy).toHaveBeenCalled();
  });
});
