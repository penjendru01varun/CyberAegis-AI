from typing import List, Tuple, Dict
from datetime import datetime


# ── Weight table (must sum to 1.0) ───────────────────────────────────────────
WEIGHTS: Dict[str, float] = {
    "amount":          0.12,
    "location":        0.12,
    "device":          0.12,
    "time":            0.08,
    "behavior":        0.18,
    "attacker_signal": 0.24,
    "elderly":         0.10,
    "voice":           0.04,
}

# Thresholds ─────────────────────────────────────────────────────────────────
ALLOW_MAX  = 30
ALERT_MAX  = 60
OTP_MAX    = 80
# > 80 → BLOCK


def compute_risk_score(
    amount: float,
    location_city: str,
    device_fingerprint: str,
    transaction_time: str,
    attacker_signal_score: float,
    elderly_flag: bool,
    voice_risk_score: float,
    user_id: str,
) -> Tuple[int, int, List[str], Dict[str, float]]:
    """
    Returns (risk_score, trust_score, contributing_factors, weights_applied).

    Each sub-score is normalised 0→100 before weighting.
    """
    factors: List[str] = []
    sub_scores: Dict[str, float] = {}

    # Amount anomaly ----------------------------------------------------------
    # Heuristic: amounts >50k are elevated; >2L are high risk
    if amount > 200_000:
        sub_scores["amount"] = 90.0
        factors.append("amount: extremely large transfer")
    elif amount > 50_000:
        sub_scores["amount"] = 65.0
        factors.append("amount: above normal range")
    else:
        sub_scores["amount"] = 10.0

    # Location ----------------------------------------------------------------
    # Simulate mismatch by checking city against a "home city" derived
    # from user_id (deterministic for repeatability in demo)
    known_cities = ["Mumbai", "Pune", "Nagpur"]
    if location_city not in known_cities:
        sub_scores["location"] = 70.0
        factors.append(f"location: transaction from '{location_city}' (mismatch)")
    else:
        sub_scores["location"] = 15.0

    # Device ------------------------------------------------------------------
    # Unknown / freshly-seen fingerprints score high
    known_fps = ["fp_abc", "fp_def", "fp_ghi"]
    if device_fingerprint not in known_fps:
        sub_scores["device"] = 75.0
        factors.append("device: unrecognised fingerprint")
    else:
        sub_scores["device"] = 10.0

    # Time-of-day anomaly -----------------------------------------------------
    try:
        dt = datetime.fromisoformat(transaction_time)
        hour = dt.hour
    except ValueError:
        hour = 12

    if 1 <= hour < 5:
        sub_scores["time"] = 85.0
        factors.append("time: transaction between 01:00-05:00")
    elif 22 <= hour or hour < 7:
        sub_scores["time"] = 50.0
        factors.append("time: off-hours transaction")
    else:
        sub_scores["time"] = 5.0

    # Behaviour (placeholder — simulated baseline drift) ─────────────────────
    # In production this queries the user behaviour profile
    behaviour_score = 20.0  # Default: known user, normal behaviour
    sub_scores["behavior"] = behaviour_score

    # Attacker signal (passed from GhostNet/ReconSignal orchestration) ────────
    sub_scores["attacker_signal"] = min(attacker_signal_score, 100.0)
    if attacker_signal_score > 50:
        factors.append(f"attacker_signal: VeraShield score {attacker_signal_score:.0f}/100")

    # Elderly flag ─────────────────────────────────────────────────────────────
    sub_scores["elderly"] = 80.0 if elderly_flag else 0.0
    if elderly_flag:
        factors.append("elderly: user flagged as vulnerable")

    # Voice risk ──────────────────────────────────────────────────────────────
    sub_scores["voice"] = min(voice_risk_score, 100.0)
    if voice_risk_score > 60:
        factors.append(f"voice: deepfake risk {voice_risk_score:.0f}/100")

    # Weighted sum ────────────────────────────────────────────────────────────
    risk_score = sum(sub_scores[k] * WEIGHTS[k] for k in WEIGHTS)
    risk_score = max(0, min(100, round(risk_score)))

    # Trust score is the inverse, anchored at 100 − risk with a small floor
    trust_score = max(0, min(100, 100 - risk_score + 8))

    return risk_score, trust_score, factors, {k: round(v, 4) for k, v in sub_scores.items()}


def risk_to_decision(risk_score: int) -> str:
    if risk_score <= ALLOW_MAX:
        return "ALLOW"
    elif risk_score <= ALERT_MAX:
        return "ALERT"
    elif risk_score <= OTP_MAX:
        return "OTP"
    else:
        return "BLOCK"
