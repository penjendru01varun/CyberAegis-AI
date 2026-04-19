from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum


# ── Shared Enums ──────────────────────────────────────────────────────────────

class ThreatLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class Decision(str, Enum):
    ALLOW = "ALLOW"
    ALERT = "ALERT"
    OTP = "OTP"
    HOLD = "HOLD"
    BLOCK = "BLOCK"


class InterventionStatus(str, Enum):
    NONE = "NONE"
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    RESOLVED = "RESOLVED"


# ── Agent 1: GhostNet ─────────────────────────────────────────────────────────

class GhostNetRequest(BaseModel):
    ghost_upi_id: str = Field(..., example="ghost_9876543210@bank")
    scan_velocity: int = Field(..., ge=0, example=85)
    source_ip: str = Field(..., example="203.0.113.22")
    user_agent: str = Field(..., example="python-requests/2.28")
    session_id: str = Field(..., example="sess_abc123")


class GhostNetResponse(BaseModel):
    scan_detected: bool
    attacker_fingerprint: str
    threat_level: ThreatLevel
    confidence: float = Field(..., ge=0.0, le=1.0)
    scan_pattern: str


# ── Agent 2: FingerprintCapture ───────────────────────────────────────────────

class FingerprintRequest(BaseModel):
    ip_address: str = Field(..., example="203.0.113.22")
    device_headers: Dict[str, str] = Field(..., example={"Accept-Language": "en-US"})
    screen_resolution: str = Field(..., example="1920x1080")
    timezone: str = Field(..., example="Asia/Kolkata")
    language: str = Field(..., example="en-US")
    platform: str = Field(..., example="Win32")


class FingerprintResponse(BaseModel):
    fingerprint_hash: str
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    is_bot: bool
    bot_likelihood: float = Field(..., ge=0.0, le=1.0)
    unique_visitor_id: str


# ── Agent 3: BlastRadius ──────────────────────────────────────────────────────

class BlastRadiusRequest(BaseModel):
    attacker_fingerprint: str = Field(..., example="a1b2c3d4e5")
    scan_pattern: List[str] = Field(..., example=["9876543210", "9876543211"])
    targeted_upi_pattern: str = Field(..., example="sequential_numeric")


class BlastRadiusResponse(BaseModel):
    predicted_targets: List[str]
    confidence_scores: List[float]
    estimated_blast_radius: int
    risk_distribution: Dict[str, Any]


# ── Agent 4: ReconSignal ──────────────────────────────────────────────────────

class ReconSignalRequest(BaseModel):
    lookup_patterns: List[str] = Field(..., example=["9876543210@upi", "9876543211@upi"])
    time_window_seconds: int = Field(..., ge=1, example=60)
    source_ip: str = Field(..., example="203.0.113.22")


class ReconSignalResponse(BaseModel):
    recon_detected: bool
    recon_confidence: float = Field(..., ge=0.0, le=1.0)
    signal_type: str
    anomaly_score: float
    recommended_action: str


# ── Agent 5: RiskEngine ───────────────────────────────────────────────────────

class RiskEngineRequest(BaseModel):
    user_id: str = Field(..., example="user_001")
    amount: float = Field(..., gt=0, example=95000.0)
    location_city: str = Field(..., example="Delhi")
    device_fingerprint: str = Field(..., example="fp_xyz789")
    transaction_time: str = Field(..., example="2026-04-19T02:15:00")
    attacker_signal_score: float = Field(default=0.0, ge=0.0, le=100.0)
    elderly_flag: bool = Field(default=False)
    voice_risk_score: float = Field(default=0.0, ge=0.0, le=100.0)


class RiskEngineResponse(BaseModel):
    risk_score: int = Field(..., ge=0, le=100)
    trust_score: int = Field(..., ge=0, le=100)
    decision: Decision
    contributing_factors: List[str]
    weights_applied: Dict[str, float]


# ── Agent 6: ElderShield ──────────────────────────────────────────────────────

class ElderShieldRequest(BaseModel):
    user_id: str = Field(..., example="user_001")
    user_age: int = Field(..., ge=0, le=130, example=68)
    transaction_amount: float = Field(..., gt=0, example=80000.0)
    recipient_is_new: bool = Field(..., example=True)
    qr_code_involved: bool = Field(..., example=True)
    risk_score: float = Field(..., ge=0.0, le=100.0, example=72.0)
    behavior_change_detected: bool = Field(..., example=True)


class ElderShieldResponse(BaseModel):
    protection_triggered: bool
    hold_required: bool
    hold_duration_minutes: int
    family_alert_sent: bool
    warning_shown: bool
    intervention_status: InterventionStatus


# ── Agent 7: VoiceGuard ───────────────────────────────────────────────────────

class VoiceGuardRequest(BaseModel):
    audio_sample_url: str = Field(..., example="https://cdn.bank/kyc_call_001.wav")
    verification_context: str = Field(..., example="kyc_verification")
    user_id: str = Field(..., example="user_001")


class VoiceGuardResponse(BaseModel):
    voice_risk_score: int = Field(..., ge=0, le=100)
    deepfake_suspected: bool
    confidence: float = Field(..., ge=0.0, le=1.0)
    anomaly_type: str
    recommended_action: str


# ── Orchestrator ──────────────────────────────────────────────────────────────

class AgentTrace(BaseModel):
    name: str
    time_ms: int
    status: str
    output: Dict[str, Any]


class OrchestratorRequest(BaseModel):
    user_id: str = Field(..., example="user_001")
    amount: float = Field(..., example=95000.0)
    location_city: str = Field(..., example="Mumbai")
    device_fingerprint: str = Field(..., example="fp_xyz789")
    transaction_time: str = Field(..., example="2026-04-19T02:15:00")
    source_ip: str = Field(..., example="203.0.113.22")
    user_agent: str = Field(..., example="python-requests/2.28")
    ghost_upi_id: Optional[str] = Field(default=None)
    scan_velocity: int = Field(default=0)
    user_age: int = Field(default=35)
    recipient_is_new: bool = Field(default=False)
    qr_code_involved: bool = Field(default=False)
    audio_sample_url: Optional[str] = Field(default=None)
    verification_context: str = Field(default="standard")
    lookup_patterns: List[str] = Field(default=[])
    scan_pattern: List[str] = Field(default=[])


class OrchestratorResponse(BaseModel):
    orchestration_id: str
    status: str
    total_time_ms: int
    agents: List[AgentTrace]
    final_decision: Decision
    risk_score: int
    trust_score: int
    explanation: str


# ── Health ────────────────────────────────────────────────────────────────────

class AgentHealth(BaseModel):
    name: str
    status: str
    latency_ms: int
    version: str = "1.0.0"


class SystemHealth(BaseModel):
    system: str
    status: str
    agents: List[AgentHealth]
    total_agents: int
    healthy_agents: int
# ── Human-in-the-loop (HITL) ──────────────────────────────────────────────────

class ReviewStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class ReviewItem(BaseModel):
    review_id: str
    transaction_id: str
    user_id: str
    amount: float
    risk_score: int
    reason: str
    timestamp: str
    status: ReviewStatus = ReviewStatus.PENDING
    analyst_notes: Optional[str] = None

class ReviewActionRequest(BaseModel):
    action: ReviewStatus # APPROVED or REJECTED
    notes: str
