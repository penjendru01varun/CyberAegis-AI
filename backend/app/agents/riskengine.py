import time
import logging
from typing import Dict, Any
from app.agents.base import BaseAgent
from app.models.schemas import RiskEngineRequest, RiskEngineResponse, Decision
from app.utils.scoring import compute_risk_score, risk_to_decision, WEIGHTS

logger = logging.getLogger("riskengine")

class RiskEngineAgent(BaseAgent):
    """
    RiskEngine Agent
    The central decision-maker that aggregates weighted risk signals.
    """
    
    @property
    def name(self) -> str:
        return "riskengine"
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        start = time.perf_counter()
        
        # Extract data
        user_id = context.get("user_id", "unknown")
        amount = context.get("amount", 0.0)
        location_city = context.get("location_city", "unknown")
        device_fingerprint = context.get("device_fingerprint", "unknown")
        transaction_time = context.get("transaction_time", "")
        attacker_signal_score = context.get("attacker_signal_score", 0.0)
        elderly_flag = context.get("elderly_flag", False)
        voice_risk_score = context.get("voice_risk_score", 0.0)
        
        # Additional logic from prompt: if in blast radius, boost score
        blast_radius_risk = context.get("blast_radius_risk", False)
        
        risk_score, trust_score, factors, sub_scores = compute_risk_score(
            amount=amount,
            location_city=location_city,
            device_fingerprint=device_fingerprint,
            transaction_time=transaction_time,
            attacker_signal_score=attacker_signal_score,
            elderly_flag=elderly_flag,
            voice_risk_score=voice_risk_score,
            user_id=user_id,
        )
        
        # Apply Blast Radius boost if applicable
        if blast_radius_risk:
            risk_score = min(100, risk_score + 15)
            factors.append("User identified as high-risk target in predicted Blast Radius")
        
        decision_str = risk_to_decision(risk_score)
        decision = Decision(decision_str)
        
        weights_applied = {k: WEIGHTS[k] for k in WEIGHTS}
        
        elapsed = (time.perf_counter() - start) * 1000
        result = {
            "risk_score": risk_score,
            "trust_score": trust_score,
            "decision": decision,
            "explanation": f"Score calculated at {risk_score}/100. " + (factors[0] if factors else "Standard scoring."),
            "contributing_factors": factors,
            "weights_applied": weights_applied,
            "_execution_time_ms": round(elapsed, 2)
        }
        
        logger.info(f"RiskEngineAgent executed in {elapsed:.2f}ms")
        return result
