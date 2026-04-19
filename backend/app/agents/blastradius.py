import time
import logging
from typing import Dict, Any, List
from app.agents.base import BaseAgent
from app.models.schemas import BlastRadiusRequest, BlastRadiusResponse
from app.utils.patterns import predict_blast_targets

logger = logging.getLogger("blastradius")

class BlastRadiusAgent(BaseAgent):
    """
    BlastRadius Agent
    Predicts which users will be targeted next based on attacker fingerprint.
    """
    
    @property
    def name(self) -> str:
        return "blastradius"
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        start = time.perf_counter()
        
        # Extract data from context
        attacker_fp = context.get("attacker_fingerprint", "unknown")
        scan_pattern = context.get("scan_pattern", [])
        targeted_upi_pattern = context.get("targeted_upi_pattern", "numeric_step")
        
        targets, confidences = predict_blast_targets(
            attacker_fp,
            scan_pattern,
            targeted_upi_pattern,
        )
        
        dist = self._risk_distribution(targets, confidences)
        
        elapsed = (time.perf_counter() - start) * 1000
        result = {
            "predicted_targets": targets,
            "confidence_scores": confidences,
            "estimated_blast_radius": len(targets),
            "risk_distribution": dist,
            "_execution_time_ms": round(elapsed, 2)
        }
        
        logger.info(f"BlastRadiusAgent executed in {elapsed:.2f}ms")
        return result

    def _risk_distribution(self, targets: List[str], scores: List[float]) -> Dict[str, int]:
        high    = sum(1 for s in scores if s >= 0.80)
        medium  = sum(1 for s in scores if 0.50 <= s < 0.80)
        low     = sum(1 for s in scores if s < 0.50)
        return {"HIGH": high, "MEDIUM": medium, "LOW": low}
