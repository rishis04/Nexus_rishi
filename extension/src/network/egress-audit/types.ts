/**
 * Types and interfaces for Phase 6 Cross-Repository Egress Audit Integration.
 * 
 * The Egress Audit Layer is an external observability service implemented in
 * a separate repository. This interface defines the clean boundary through which
 * only already-sanitized, cryptographically attested payloads are observed.
 */

export interface EgressAuditMetadata {
  egress_destination?: string;
  correlation_id?: string;
  origin?: string;
  observed_at?: number;
}

export interface EgressAuditPayload {
  /** Unique request ID correlated with perception/sanitization cycle */
  readonly request_id: string;
  /** Web Crypto SHA-256 digest of the canonical sanitized body (Invariant I5) */
  readonly sha256: string;
  /** Exact sanitized body string being transmitted to the planner/network */
  readonly body: string;
  /** Timestamp when attestation was generated */
  readonly issued_at: number;
  /** Optional metadata regarding the egress destination (contains NO raw PII) */
  readonly metadata?: EgressAuditMetadata;
}

export interface EgressAuditAdapter {
  /**
   * Observe a finalized, sanitized outbound payload immediately before network egress.
   * This operation must be read-only and non-invasive.
   * 
   * If the external audit service is unavailable or errors, the implementation
   * MUST fail safely without throwing, blocking, or corrupting the outgoing request.
   */
  observe(payload: EgressAuditPayload): Promise<void>;

  /** Whether the adapter is actively configured and listening/transmitting */
  isEnabled(): boolean;

  /** Allows configuring or overriding the external audit destination */
  configure(config: { endpointUrl?: string | null; enabled?: boolean }): void;
}
