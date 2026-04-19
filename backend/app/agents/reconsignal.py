import time
import logging
from typing import Dict, Any
from app.agents.base import BaseAgent
from app.models.schemas import ReconSignalRequest, ReconSignalResponse
from app.utils.patterns import classify_recon_signal

logger = logging.getLogger("reconsignal")

class ReconSignalAgent(BaseAgent):
    """
    ReconSignal Agent
    Detects subtle reconnaissance activity using statistical anomaly detection.
    """
    
    @property
    def name(self) -> str:
        return "reconsignal"
    
    ACTION_MAP = {
        "normal_activity":           "monitor",
        "medium_anomaly":            "flag_for_review",
        "sequential_numeric_scan":   "alert_and_rate_limit",
        "dictionary_name_attack":    "alert_and_rate_limit",
        "high_velocity_bulk_scan":   "block_ip_immediately",
        "low_and_slow_recon":        "shadow_monitor_and_alert",
    }
    
    RECON_CONFIDENCE_THRESHOLD = 45.0
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        start = time.perf_counter()
        
        # Extract data
        lookup_patterns = context.get("lookup_patterns", [])
        time_window_seconds = context.get("time_window_seconds", 60)
        source_ip = context.get("source_ip", "0.0.0.0")
        
        count = len(lookup_patterns)
        signal_type, anomaly_score = classify_recon_signal(
            count, time_window_seconds, lookup_patterns
        )
        
        recon_confidence = round(min(anomaly_score / 100, 1.0), 3)
        recon_detected = anomaly_score >= self.RECON_CONFIDENCE_THRESHOLD
        
        action = self.ACTION_MAP.get(signal_type, "monitor")
        
        elapsed = (time.perf_counter() - start) * 1000
        result = {
            "recon_detected": recon_detected,
            "recon_confidence": recon_confidence,
            "signal_type": signal_type,
            "anomaly_score": round(anomaly_score, 2),
            "recommended_action": action,
            "_execution_time_ms": round(elapsed, 2)
        }
        
        logger.info(f"ReconSignalAgent executed in {elapsed:.2f}ms")
        return result
