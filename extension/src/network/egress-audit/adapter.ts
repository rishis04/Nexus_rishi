import type { EgressAuditAdapter, EgressAuditPayload } from './types.js';

export function getAuditEndpointUrl(): string | null {
  const proc = typeof globalThis !== 'undefined' ? (globalThis as any).process : undefined;
  return (proc && proc.env?.WXT_EGRESS_AUDIT_URL) || null;
}

export type AuditObserverCallback = (payload: EgressAuditPayload) => Promise<void> | void;

export class ExternalEgressAuditAdapter implements EgressAuditAdapter {
  private endpointUrl: string | null = null;
  private enabled: boolean = false;
  private customObserver: AuditObserverCallback | null = null;

  constructor() {
    this.endpointUrl = getAuditEndpointUrl();
    this.enabled = Boolean(this.endpointUrl);
  }

  public isEnabled(): boolean {
    return this.enabled || Boolean(this.customObserver);
  }

  public configure(config: { endpointUrl?: string | null; enabled?: boolean }): void {
    if (config.endpointUrl !== undefined) {
      this.endpointUrl = config.endpointUrl;
    }
    if (config.enabled !== undefined) {
      this.enabled = config.enabled;
    } else if (config.endpointUrl !== undefined) {
      this.enabled = Boolean(config.endpointUrl);
    }
  }

  /**
   * Register a custom observer callback (e.g., for test inspection or local daemon binding).
   */
  public setObserver(callback: AuditObserverCallback | null): void {
    this.customObserver = callback;
  }

  /**
   * Observe a finalized, sanitized outbound payload immediately before network egress.
   * 
   * NON-NEGOTIABLE GUARANTEES:
   * 1. The payload is observed as-is; it is never mutated or re-encoded.
   * 2. If the external audit service fails or times out, it is caught safely.
   * 3. This function NEVER throws an error to the caller.
   */
  public async observe(payload: EgressAuditPayload): Promise<void> {
    if (!this.isEnabled()) {
      return;
    }

    // 1. Invoke custom programmatic observer if registered
    if (this.customObserver) {
      try {
        await this.customObserver(payload);
      } catch (err: any) {
        console.warn('[EgressAuditAdapter] Custom observer failed (non-blocking):', err?.message || err);
      }
    }

    // 2. Dispatch to external audit service endpoint if configured
    if (this.endpointUrl && this.enabled) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(this.endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Audit-Source': 'browser-agent-main',
          },
          body: JSON.stringify({
            request_id: payload.request_id,
            sha256: payload.sha256,
            body: payload.body,
            issued_at: payload.issued_at,
            metadata: {
              ...payload.metadata,
              observed_at: Date.now(),
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.warn(`[EgressAuditAdapter] Audit service returned HTTP ${response.status} (non-blocking)`);
        }
      } catch (err: any) {
        // Non-blocking failure: external audit repo availability must never disrupt agent execution
        console.warn('[EgressAuditAdapter] Failed to contact external audit service (non-blocking):', err?.message || err);
      }
    }
  }
}

export const egressAuditAdapter = new ExternalEgressAuditAdapter();
