// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { privacyStub } from '../../extension/src/privacy.stub.js';
import { classifyDomElement } from '../../extension/src/privacy/semantic-pii-classifier.js';

describe('PAN number labeling debug', () => {
  it('tests classifyDomElement with PAN input having standard placeholder', () => {
    const el: any = {
      dom_id: 'pan-input',
      tag: 'input',
      name: 'pan',
      label: 'PAN Number',
      input: {
        type: 'text',
        name: 'pan',
        value: 'ABCPE1234F',
        placeholder: 'ABCDE1234F',
      },
      bbox: [100, 200, 250, 40],
      visible: true,
      interactable: true,
    };

    const cand = classifyDomElement(el);
    expect(cand?.specificSubtype).toBe('PAN');
  });

  it('tests classifyDomElement when placeholder contains xxxx (e.g. XXXXX1234X)', () => {
    const el: any = {
      dom_id: 'pan-input-masked',
      tag: 'input',
      name: 'pan',
      label: 'PAN Card Number',
      input: {
        type: 'text',
        name: 'pan',
        value: 'ABCPE1234F',
        placeholder: 'XXXXX1234X',
      },
      bbox: [100, 200, 250, 40],
      visible: true,
      interactable: true,
    };

    const cand = classifyDomElement(el);
    console.log('Result with xxxx placeholder:', cand?.specificSubtype);
    expect(cand?.specificSubtype).toBe('PAN');
  });

  it('tests classifyDomElement when label is neutral (ID Number) but value is PAN', () => {
    const el: any = {
      dom_id: 'id-input',
      tag: 'input',
      name: 'id_number',
      label: 'Government ID Number',
      input: {
        type: 'text',
        name: 'id_number',
        value: 'ABCPE1234F',
        placeholder: 'Enter 10-digit ID',
      },
      bbox: [100, 200, 250, 40],
      visible: true,
      interactable: true,
    };

    const cand = classifyDomElement(el);
    console.log('Result with neutral label and PAN value:', cand?.specificSubtype);
    expect(cand?.specificSubtype).toBe('PAN');
  });

  it('tests inspectAndRedact with PAN input', async () => {
    const frame: any = {
      cycle_id: 1,
      dom: {
        viewport: [1280, 800],
        frames: [],
        elements: [
          {
            dom_id: 'pan-input',
            tag: 'input',
            name: 'pan',
            label: 'PAN Number',
            input: {
              type: 'text',
              name: 'pan',
              value: 'ABCPE1234F',
              placeholder: 'ABCDE1234F',
            },
            bbox: [100, 200, 250, 40],
            visible: true,
            interactable: true,
          },
        ],
      },
      regions: [
        {
          region_id: 'r_pan',
          local_key: 'pan-input',
          semantic_type: 'input',
          text: 'PAN Number: ABCPE1234F',
          bbox: [100, 200, 250, 40],
          visible: true,
          interactable: true,
        },
      ],
      faces: [],
    };

    const res = await privacyStub.sanitize({
      cycle_id: 1,
      task: { task_id: 't1', step_index: 0, task_text: 'test' },
      frame,
      audit: { masked_boxes: 0, total_tokens_redacted: 0, ocr_regions_redacted: 0 },
    } as any);

    const debugDiv = document.getElementById('antigravity-debug-masks');
    const boxes = debugDiv ? JSON.parse(debugDiv.textContent || '[]') : [];
    console.log('inspectAndRedact with PAN input - detections:', res.detections);
    console.log('inspectAndRedact with PAN input - boxesToMask:', boxes);
    const box = boxes[0];
    expect(box?.label).toBe('PAN');
  });

  it('tests sanitize without domEl but text contains PAN number (e.g. OCR / visual text)', async () => {
    const frame: any = {
      cycle_id: 2,
      dom: {
        viewport: [1280, 800],
        frames: [],
        elements: [],
      },
      regions: [
        {
          region_id: 'r_ocr_pan',
          semantic_type: 'text',
          text: 'PAN Number: ABCPE1234F',
          bbox: [100, 200, 250, 40],
          visible: true,
          interactable: false,
        },
      ],
      faces: [],
    };

    const res = await privacyStub.sanitize({
      cycle_id: 2,
      task: { task_id: 't2', step_index: 0, task_text: 'test' },
      frame,
      audit: { masked_boxes: 0, total_tokens_redacted: 0, ocr_regions_redacted: 0 },
    } as any);

    const debugDiv = document.getElementById('antigravity-debug-masks');
    const boxes = debugDiv ? JSON.parse(debugDiv.textContent || '[]') : [];
    console.log('inspectAndRedact with OCR PAN - detections:', res.detections);
    console.log('inspectAndRedact with OCR PAN - boxesToMask:', boxes);
    const box = boxes[0];
    expect(box?.label).toBe('PAN');
  });

  it('tests sanitize when placeholder is XXXX XXXX XXXX or xxxx but value is PAN', async () => {
    const frame: any = {
      cycle_id: 3,
      dom: {
        viewport: [1280, 800],
        frames: [],
        elements: [
          {
            dom_id: 'pan-input-xxxx',
            tag: 'input',
            name: 'tax_id',
            label: 'Tax Identification Number',
            input: {
              type: 'text',
              name: 'tax_id',
              value: 'ABCPE1234F',
              placeholder: 'xxxx xxxx xxxx',
            },
            bbox: [100, 200, 250, 40],
            visible: true,
            interactable: true,
          },
        ],
      },
      regions: [
        {
          region_id: 'r_tax_id',
          local_key: 'pan-input-xxxx',
          semantic_type: 'input',
          text: 'Tax Identification Number: ABCPE1234F',
          bbox: [100, 200, 250, 40],
          visible: true,
          interactable: true,
        },
      ],
      faces: [],
    };

    const res = await privacyStub.sanitize({
      cycle_id: 3,
      task: { task_id: 't3', step_index: 0, task_text: 'test' },
      frame,
      audit: { masked_boxes: 0, total_tokens_redacted: 0, ocr_regions_redacted: 0 },
    } as any);

    const debugDiv = document.getElementById('antigravity-debug-masks');
    const boxes = debugDiv ? JSON.parse(debugDiv.textContent || '[]') : [];
    console.log('inspectAndRedact with xxxx placeholder - detections:', res.detections);
    console.log('inspectAndRedact with xxxx placeholder - boxesToMask:', boxes);
    const box = boxes[0];
    expect(box?.label).toBe('PAN');
  });

  it('tests test-site login-demo PAN input with ABCDE1234F (test entity D)', async () => {
    const frame: any = {
      cycle_id: 4,
      dom: {
        viewport: [1280, 800],
        frames: [],
        elements: [
          {
            dom_id: 'pan-input',
            tag: 'input',
            name: 'pan',
            label: 'PAN Number',
            input: {
              type: 'text',
              name: 'pan',
              value: 'ABCDE1234F',
              placeholder: 'ABCDE1234F',
            },
            bbox: [100, 200, 250, 40],
            visible: true,
            interactable: true,
          },
        ],
      },
      regions: [
        {
          region_id: 'r_pan_demo',
          local_key: 'pan-input',
          semantic_type: 'input',
          text: 'PAN Number: ABCDE1234F',
          bbox: [100, 200, 250, 40],
          visible: true,
          interactable: true,
        },
      ],
      faces: [],
    };

    const res = await privacyStub.sanitize({
      cycle_id: 4,
      task: { task_id: 't4', step_index: 0, task_text: 'test' },
      frame,
      audit: { masked_boxes: 0, total_tokens_redacted: 0, ocr_regions_redacted: 0 },
    } as any);

    const debugDiv = document.getElementById('antigravity-debug-masks');
    const boxes = debugDiv ? JSON.parse(debugDiv.textContent || '[]') : [];
    console.log('inspectAndRedact with ABCDE1234F - detections:', res.detections);
    console.log('inspectAndRedact with ABCDE1234F - boxesToMask:', boxes);
    const box = boxes[0];
    expect(box?.label).toBe('PAN');
  });

  it('CRITICAL: tests when field has aadhaar label/name but value is a PAN number', async () => {
    const frame: any = {
      cycle_id: 6,
      dom: {
        viewport: [1280, 800],
        frames: [],
        elements: [
          {
            dom_id: 'id-input',
            tag: 'input',
            name: 'aadhaar',
            label: 'Aadhaar / ID Number',
            input: {
              type: 'text',
              name: 'aadhaar',
              value: 'ABCPE1234F',
              placeholder: 'XXXX XXXX XXXX',
            },
            bbox: [100, 100, 250, 40],
            visible: true,
            interactable: true,
          },
        ],
      },
      regions: [
        {
          region_id: 'r_mixed',
          local_key: 'id-input',
          semantic_type: 'input',
          text: 'Aadhaar / ID Number: ABCPE1234F',
          bbox: [100, 100, 250, 40],
          visible: true,
          interactable: true,
        },
      ],
      faces: [],
    };

    const res = await privacyStub.sanitize({
      cycle_id: 6,
      task: { task_id: 't6', step_index: 0, task_text: 'test' },
      frame,
      audit: { masked_boxes: 0, total_tokens_redacted: 0, ocr_regions_redacted: 0 },
    } as any);

    const debugDiv = document.getElementById('antigravity-debug-masks');
    const boxes = debugDiv ? JSON.parse(debugDiv.textContent || '[]') : [];
    console.log('CRITICAL: PAN number in aadhaar field - boxesToMask:', boxes);
    const box = boxes[0];
    expect(box?.label).toBe('PAN');
  });

  it('tests full login-demo page with BOTH Aadhaar and PAN inputs together', async () => {
    const frame: any = {
      cycle_id: 5,
      dom: {
        viewport: [1280, 800],
        frames: [],
        elements: [
          {
            dom_id: 'aadhaar-input',
            tag: 'input',
            name: 'aadhaar',
            label: 'Aadhaar Number',
            input: {
              type: 'text',
              name: 'aadhaar',
              value: '5489 1234 5674',
              placeholder: 'XXXX XXXX XXXX',
            },
            bbox: [100, 100, 250, 40],
            visible: true,
            interactable: true,
          },
          {
            dom_id: 'pan-input',
            tag: 'input',
            name: 'pan',
            label: 'PAN Number',
            input: {
              type: 'text',
              name: 'pan',
              value: 'ABCPE1234F',
              placeholder: 'ABCDE1234F',
            },
            bbox: [100, 200, 250, 40],
            visible: true,
            interactable: true,
          },
        ],
      },
      regions: [
        {
          region_id: 'r_aadhaar',
          local_key: 'aadhaar-input',
          semantic_type: 'input',
          text: 'Aadhaar Number: 5489 1234 5674',
          bbox: [100, 100, 250, 40],
          visible: true,
          interactable: true,
        },
        {
          region_id: 'r_pan',
          local_key: 'pan-input',
          semantic_type: 'input',
          text: 'PAN Number: ABCPE1234F',
          bbox: [100, 200, 250, 40],
          visible: true,
          interactable: true,
        },
      ],
      faces: [],
    };

    const res = await privacyStub.sanitize({
      cycle_id: 5,
      task: { task_id: 't5', step_index: 0, task_text: 'test' },
      frame,
      audit: { masked_boxes: 0, total_tokens_redacted: 0, ocr_regions_redacted: 0 },
    } as any);

    const debugDiv = document.getElementById('antigravity-debug-masks');
    const boxes = debugDiv ? JSON.parse(debugDiv.textContent || '[]') : [];
    console.log('BOTH inputs - detections:', res.detections);
    console.log('BOTH inputs - boxesToMask:', boxes);
    
    const aadhaarBox = boxes.find((b: any) => b.y === 100);
    const panBox = boxes.find((b: any) => b.y === 200);

    expect(aadhaarBox?.label).toBe('AADHAAR');
    expect(panBox?.label).toBe('PAN');
  });

  it('masks BOTH the photo (face) and the PAN card number on a PAN card photo', async () => {
    // Simulates a PAN card image on screen:
    // 1. YuNet face detector found the face photo on the card: bbox [50, 50, 80, 80]
    // 2. OCR extracted the PAN card number: bbox [50, 160, 200, 30]
    const standardDom = {
      snapshot_id: 'snap_test',
      url_origin: 'http://localhost:5173',
      url_path: '/',
      frames: [{ frame_id: 'main', parent_frame_id: null, origin: 'http://localhost:5173', path: '/', offset: [0, 0], accessible: true }],
      elements: [],
      viewport: { w: 1280, h: 800 },
      dpr: 1,
      scroll: { x: 0, y: 0 },
      page_state_hash: 'hash_test',
      ts: Date.now(),
    };

    const frame = {
      origin: 'http://localhost:5173',
      dom: standardDom,
      regions: [
        {
          region_id: 'r_pan_ocr_token',
          local_key: 'ocr_fused_1',
          source: ['OCR'],
          semantic_type: 'text',
          text: 'ABCPE1234F',
          bbox: [50, 160, 200, 30],
          visible: true,
          interactable: false,
        },
      ],
      faces: [
        {
          face_id: 'pan_card_photo_face_0',
          bbox: [50, 50, 80, 80],
          confidence: 0.98,
        },
      ],
    };

    const res = await privacyStub.sanitize({
      cycle_id: 6,
      task: { task_id: 't6', step_index: 0, task_text: 'pan card photo test' },
      frame,
      audit: { masked_boxes: 0, total_tokens_redacted: 0, ocr_regions_redacted: 0 },
    } as any);

    const debugDiv = document.getElementById('antigravity-debug-masks');
    const boxes = debugDiv ? JSON.parse(debugDiv.textContent || '[]') : [];

    console.log('PAN card image test - detections:', res.detections);
    console.log('PAN card image test - boxesToMask:', boxes);

    // Both face and PAN number must be in boxesToMask
    const faceMask = boxes.find((b: any) => b.label === 'FACE');
    const panMask = boxes.find((b: any) => b.label === 'PAN');

    expect(faceMask).toBeDefined();
    expect(faceMask.x).toBe(50);
    expect(faceMask.y).toBe(50);
    expect(faceMask.w).toBe(80);
    expect(faceMask.h).toBe(80);

    expect(panMask).toBeDefined();
    expect(panMask.x).toBe(50);
    expect(panMask.y).toBe(160);
    expect(panMask.w).toBe(200);
    expect(panMask.h).toBe(30);
    expect(panMask.source).toBe('OCR');
  });

  it('correctly matches and masks PAN numbers from OCR even with space separation (e.g. ABCPE 1234 F)', async () => {
    const frame = {
      origin: 'http://localhost:5173',
      dom: {
        snapshot_id: 'snap_test_2',
        url_origin: 'http://localhost:5173',
        url_path: '/',
        frames: [{ frame_id: 'main', parent_frame_id: null, origin: 'http://localhost:5173', path: '/', offset: [0, 0], accessible: true }],
        elements: [],
        viewport: { w: 1280, h: 800 },
        dpr: 1,
        scroll: { x: 0, y: 0 },
        page_state_hash: 'hash_test_2',
        ts: Date.now(),
      },
      regions: [
        {
          region_id: 'r_pan_ocr_spaced',
          local_key: 'ocr_fused_2',
          source: ['OCR'],
          semantic_type: 'text',
          text: 'Permanent Account Number: ABCPE 1234 F',
          bbox: [60, 200, 220, 35],
          visible: true,
          interactable: false,
        },
      ],
      faces: [],
    };

    const res = await privacyStub.sanitize({
      cycle_id: 7,
      task: { task_id: 't7', step_index: 0, task_text: 'pan spaced test' },
      frame,
      audit: { masked_boxes: 0, total_tokens_redacted: 0, ocr_regions_redacted: 0 },
    } as any);

    const debugDiv = document.getElementById('antigravity-debug-masks');
    const boxes = debugDiv ? JSON.parse(debugDiv.textContent || '[]') : [];

    const panMask = boxes.find((b: any) => b.label === 'PAN');
    expect(panMask).toBeDefined();
    expect(panMask.x).toBe(60);
    expect(panMask.y).toBe(200);
    expect(panMask.label).toBe('PAN');
    expect(panMask.source).toBe('OCR');
  });
});
