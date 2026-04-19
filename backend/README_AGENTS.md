# HyberShield AI: Multi-Agent Integration & Collision System

This directory contains the core intelligence layer of HyberShield AI, featuring a coordinated pipeline of 7 specialized agents designed for high-velocity fraud prevention (<250ms).

## Architecture Overview

HyberShield AI uses an **Agent Factory** pattern to manage stateless agent instances, which are orchestrated through a staged pipeline.

### The 7 Specialized Agents

1.  **GhostNetAgent**: Detects UPI scanning and ghost account hits.
2.  **FingerprintCaptureAgent**: Builds cross-session device identifiers.
3.  **BlastRadiusAgent**: Predicts the next set of target victims.
4.  **ReconSignalAgent**: Uses statistical anomaly detection for low-and-slow recon.
5.  **RiskEngineAgent**: Central weighted risk scoring (0-100).
6.  **ElderShieldAgent**: Human-centric protection rules for vulnerable users.
7.  **VoiceGuardAgent**: Deepfake voice detection for KYC/verification.

## Collision Resolution Logic

When agents disagree on a transaction (a "collision"), the system follows a strict priority hierarchy:

1.  **VoiceGuard WINS**: If a deepfake is suspected (Score > 60), the transaction is immediately escalated or blocked, regardless of other agents.
2.  **ElderShield PROTECTS**: If intervention rules for elderly users are met, it overrides standard scoring to apply a security hold.
3.  **GhostNet ESCALATES**: If pre-attack scanning was detected, it boosts the risk score and requires step-up authentication (OTP).
4.  **RiskEngine DECIDES**: If no high-priority overrides are triggered, the standard weighted risk score determines the outcome.

## Examples of Collision Resolution

### Scenario A: Agent Disagreement (GhostNet + ElderShield)
*   **RiskEngine**: Score 25 (ALLOW)
*   **GhostNet**: HIGH threat (Scan detected)
*   **ElderShield**: User is 67 (Vulnerable)
*   **RESULT**: **OTP** (Escalated because scanning targeting a vulnerable user was detected).

### Scenario B: VoiceGuard Override (VoiceGuard WINS)
*   **RiskEngine**: Score 20 (ALLOW)
*   **VoiceGuard**: Score 85 (DEEPFAKE)
*   **RESULT**: **BLOCK** (VoiceGuard priority overrides the low risk score).

### Scenario C: BlastRadius Escalation
*   **RiskEngine**: Score 55 (ALERT)
*   **BlastRadius**: User is in the predicted targets for the current attacker.
*   **RESULT**: **OTP** (Risk score boosted because the user is a targeted victim).

## API Interaction

### Run Full Orchestration
```bash
POST /api/agents/orchestrate
{
  "user_id": "user_001",
  "amount": 95000,
  "location_city": "Mumbai",
  "user_age": 72,
  ...
}
```

### Test Individual Agent
```bash
POST /api/agents/ghostnet/test
{
  "ghost_upi_id": "ghost_9876543120@upi",
  "scan_velocity": 150
}
```

## Performance
The orchestrator uses `asyncio` to run independent agents in parallel, ensuring the entire decision cycle completes in roughly **180-220ms**.
