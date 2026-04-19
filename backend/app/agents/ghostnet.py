import time
import logging
from typing import Dict, Any
from app.agents.base import BaseAgent
from app.models.schemas import GhostNetRequest, GhostNetResponse, ThreatLevel
from app.utils.hashing import build_attacker_fingerprint
from app.utils.patterns import classify_scan_pattern, is_bot, SCAN_VELOCITY_THRESHOLD
from app.utils.db_mock import update_attacker_signal

logger = logging.getLogger("ghostnet")

class GhostNetAgent(BaseAgent):
    """
    GhostNet Agent
    Detects UPI scanning and ghost account hits.
    Captures attacker fingerprint and flags threat level.
    """
    
    @property
    def name(self) -> str:
        return "ghostnet"
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        start = time.perf_counter()
        
        # Extract data from context
        ghost_upi_id = context.get("ghost_upi_id", "")
        scan_velocity = context.get("scan_velocity", 0)
        source_ip = context.get("source_ip", "0.0.0.0")
        user_agent = context.get("user_agent", "unknown")
        session_id = context.get("session_id", "unknown")
        
        # Determine if this is a ghost account hit
        known_ghost_prefixes = ["ghost_", "decoy_", "trap_", "honeypot_"]
        ghost_hit = any(ghost_upi_id.startswith(p) for p in known_ghost_prefixes)
        
        bot_detected, bot_likelihood = is_bot(user_agent)
        scan_detected = ghost_hit or scan_velocity > SCAN_VELOCITY_THRESHOLD or bot_detected
        
        attacker_fp = build_attacker_fingerprint(source_ip, user_agent, session_id)
        pattern = classify_scan_pattern(scan_velocity, ghost_upi_id)
        
        # Confidence calculation
        confidence = 0.0
        if ghost_hit: confidence += 0.45
        if scan_velocity > SCAN_VELOCITY_THRESHOLD: confidence += 0.30
        if bot_detected: confidence += bot_likelihood * 0.25
        confidence = round(min(confidence, 1.0), 3)
        
        # Determine threat level
        threat = self._compute_threat_level(scan_velocity, bot_detected, confidence)
        
        # Store attacker signal for orchestration
        update_attacker_signal(attacker_fp, float(scan_velocity), bot_detected)
        
        elapsed = (time.perf_counter() - start) * 1000
        result = {
            "scan_detected": scan_detected,
            "attacker_fingerprint": attacker_fp,
            "threat_level": threat,
            "threat_level_score": self._threat_to_score(threat),
            "confidence": confidence,
            "scan_pattern": pattern,
            "_execution_time_ms": round(elapsed, 2)
        }
        
        logger.info(f"GhostNetAgent executed in {elapsed:.2f}ms")
        return result

    def _compute_threat_level(self, velocity: int, bot: bool, confidence: float) -> ThreatLevel:
        if velocity > 200 or (bot and confidence > 0.85):
            return ThreatLevel.CRITICAL
        elif velocity > SCAN_VELOCITY_THRESHOLD or (bot and confidence > 0.6):
            return ThreatLevel.HIGH
        elif velocity > 20:
            return ThreatLevel.MEDIUM
        return ThreatLevel.LOW

    def _threat_to_score(self, threat: ThreatLevel) -> int:
        mapping = {
            ThreatLevel.LOW: 10,
            ThreatLevel.MEDIUM: 40,
            ThreatLevel.HIGH: 75,
            ThreatLevel.CRITICAL: 100
        }
        return mapping.get(threat, 0)
