import time
import logging
from typing import Dict, Any
from app.agents.base import BaseAgent
from app.models.schemas import FingerprintRequest, FingerprintResponse
from app.utils.hashing import build_device_fingerprint, new_visitor_id
from app.utils.patterns import is_bot

logger = logging.getLogger("fingerprint")

class FingerprintCaptureAgent(BaseAgent):
    """
    FingerprintCapture Agent
    Builds cross-session unique identifiers for attackers.
    """
    
    @property
    def name(self) -> str:
        return "fingerprint"
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        start = time.perf_counter()
        
        # Extract data
        ip_address = context.get("source_ip", "0.0.0.0")
        device_headers = context.get("device_headers", {})
        screen_resolution = context.get("screen_resolution", "unknown")
        timezone = context.get("timezone", "UTC")
        language = context.get("language", "en-US")
        platform = context.get("platform", "unknown")
        
        fp_hash = build_device_fingerprint(
            ip_address=ip_address,
            device_headers=device_headers,
            screen_resolution=screen_resolution,
            timezone=timezone,
            language=language,
            platform=platform,
        )
        
        # Bot detection
        ua_str = device_headers.get("User-Agent", device_headers.get("user-agent", context.get("user_agent", "")))
        bot_flag, bot_likelihood = is_bot(ua_str)
        header_bot_score = self._missing_headers_score(device_headers)
        
        combined_bot = min(1.0, bot_likelihood + header_bot_score)
        is_bot_flag = combined_bot > 0.5
        
        # Confidence calculation
        confidence = round(1.0 - (0.1 * len(device_headers) ** -0.5), 3) if device_headers else 0.5
        confidence = max(0.4, min(confidence, 0.99))
        
        visitor_id = new_visitor_id()
        
        elapsed = (time.perf_counter() - start) * 1000
        result = {
            "fingerprint_hash": fp_hash,
            "confidence_score": confidence,
            "is_bot": is_bot_flag,
            "bot_likelihood": round(combined_bot, 3),
            "unique_visitor_id": visitor_id,
            "_execution_time_ms": round(elapsed, 2)
        }
        
        logger.info(f"FingerprintCaptureAgent executed in {elapsed:.2f}ms")
        return result

    def _missing_headers_score(self, headers: dict) -> float:
        expected = {"Accept", "Accept-Language", "Accept-Encoding", "Connection"}
        present = {k for k in headers if k in expected}
        missing_ratio = 1 - (len(present) / len(expected)) if expected else 0
        return missing_ratio * 0.4
