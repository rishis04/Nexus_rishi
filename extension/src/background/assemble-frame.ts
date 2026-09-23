import type {
  CaptureMeta,
  DomSnapshot,
  PerceptionFrame,
  PerceptionRegion,
  RegionIndexEntry,
  RoutingPlan,
  VisionResult,
} from '@contracts/index.js';
import { domElementToPerceptionRegion } from '../perception/dom/to-regions.js';


function getIntersectionArea(b1: [number, number, number, number], b2: [number, number, number, number]): number {
  const xLeft = Math.max(b1[0], b2[0]);
  const yTop = Math.max(b1[1], b2[1]);
  const xRight = Math.min(b1[0] + b1[2], b2[0] + b2[2]);
  const yBottom = Math.min(b1[1] + b1[3], b2[1] + b2[3]);
  if (xRight < xLeft || yBottom < yTop) return 0;
  return (xRight - xLeft) * (yBottom - yTop);
}

export interface AssemblyResult {
  frame: PerceptionFrame;
  regionIndex: Record<string, RegionIndexEntry>;
  registryMapping: Record<string, string>; // region_id -> dom_id
}

export function assembleFrame(
  cycleId: string,
  domSnapshot: DomSnapshot,
  routingPlan: RoutingPlan,
  visionResult: VisionResult | null,
  captureMeta: CaptureMeta | null
): AssemblyResult {
  const domIdsToInclude = new Set(
    routingPlan.decisions
      .filter((d) => d.level === 'HIGH' || d.level === 'MEDIUM')
      .map((d) => d.dom_id)
  );

  const candidateRegions: PerceptionRegion[] = [];

  // 1. High and Medium-confidence DOM elements
  for (const el of domSnapshot.elements) {
    if (domIdsToInclude.has(el.dom_id) && el.visible) {
      candidateRegions.push(domElementToPerceptionRegion(el, domSnapshot));
    }
  }

  // 2. Fused Medium/Low regions from VisionResult (IoU Spatial Fusion)
  if (visionResult && visionResult.regions) {
    for (const vReg of visionResult.regions) {
      let isDuplicate = false;
      
      // Phase 3 IoU Fusion: Does this OCR/Vision region overlap highly with an existing DOM region?
      for (const dReg of candidateRegions) {
        if (!dReg.bbox || !vReg.bbox) continue;
        const intersection = getIntersectionArea(dReg.bbox, vReg.bbox);
        const vArea = vReg.bbox[2] * vReg.bbox[3];
        
        // If the vision region is > 80% inside a DOM region
        if (vArea > 0 && intersection / vArea > 0.8) {
          isDuplicate = true;
          // Merge text if DOM region lacked it
          if (!dReg.text && vReg.text) {
            dReg.text = vReg.text;
          }
          // Mark the DOM region as having an OCR source match to trigger Canvas Blackout!
          if (vReg.source?.includes('OCR')) {
            dReg.source = dReg.source || [];
            if (!dReg.source.includes('OCR')) dReg.source.push('OCR');
          }
          break;
        }
      }
      
      // Only push if it is a truly novel visual element (e.g. drawn on a canvas)
      if (!isDuplicate) {
        candidateRegions.push(vReg);
      }
    }
  }

  // 3. Sort regions strictly by reading order (y bucketed, then x) for deterministic region_id minting (Invariant I2)
  candidateRegions.sort((a, b) => {
    const lineA = Math.floor(a.bbox[1] / 16);
    const lineB = Math.floor(b.bbox[1] / 16);
    if (lineA !== lineB) {
      return lineA - lineB;
    }
    return a.bbox[0] - b.bbox[0];
  });

  // 4. Mint region_ids: r1, r2, ...
  const finalRegions: PerceptionRegion[] = [];
  const regionIndex: Record<string, RegionIndexEntry> = {};
  const registryMapping: Record<string, string> = {};

  let counter = 1;
  for (const reg of candidateRegions) {
    const regionId = `r${counter++}`;
    reg.region_id = regionId;

    finalRegions.push(reg);

    const domId = reg.dom_ref?.dom_id || (reg.local_key.startsWith('d') ? reg.local_key : null);
    if (domId) {
      registryMapping[regionId] = domId;
    }

    regionIndex[regionId] = {
      frame_id: reg.frame_id,
      origin: reg.origin,
      dom_id: domId,
      local_key: reg.local_key,
      bbox: reg.bbox,
      semantic_type: reg.semantic_type,
      interactable: reg.interactable,
      injection_suspected: false,
    };
  }

  const frame: PerceptionFrame = {
    frame_uid: `frm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    cycle_id: cycleId,
    page_state_hash: domSnapshot.page_state_hash,
    origin: domSnapshot.url_origin,
    regions: finalRegions,
    ocr_tokens: visionResult?.ocr_tokens || [],
    faces: visionResult?.faces || [],
    dom: domSnapshot,
    capture: captureMeta,
    ts: Date.now(),
  };

  return {
    frame,
    regionIndex,
    registryMapping,
  };
}
