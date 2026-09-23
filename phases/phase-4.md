# Phase 4: Enterprise Security

## Objective
Fulfill the enterprise architecture specifications regarding state validation and secure local credential storage.

## Components Being Implemented
- SHA-256 State Fingerprinting (with SPA tolerance).
- AES-GCM local capability vaults (Web Crypto API).
- Action attestation.

## Components Intentionally Postponed
- Hardware event simulation.
- Red-teaming/Adversarial testing.

## Files to Modify
- `extension/src/browser/state/fingerprint.ts`
- `extension/src/security/vault.ts`
- `extension/src/actions/validator/`

## Dependencies
- Standard Web Crypto API (no external deps needed).

## Implementation Tasks
1. Re-enable state hashing but implement tolerance buffers to prevent SPA death-loops.
2. Build IndexedDB + Web Crypto AES-GCM vault to store user credentials locally.
3. Update Action Validator to verify cryptographic attestations from the server.

## Testing Gates
- **Unit Tests:** Verify AES-GCM encryption/decryption cycles.
- **Integration Tests:** Verify credentials can be injected into DOM without network exposure.
- **E2E Tests:** End-to-end login using credentials stored only in the secure vault.
- **Demo Verification:** Demonstrate that the network inspector shows zero passwords transmitted.

## Acceptance Criteria
- Secrets are stored encrypted.
- State drifts don't cause infinite loops.

## Definition of DONE
- The vault securely injects credentials and the planner only uses opaque handles (e.g., `handle_pwd_1`).

## Known Limitations
- Still using synthetic DOM events.

## Next-Phase Dependencies
- Must pass security audit before final demo.
