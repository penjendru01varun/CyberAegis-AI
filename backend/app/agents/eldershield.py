import time
import logging
from typing import Dict, Any, Tuple, List
from app.agents.base import BaseAgent
from app.models.schemas import ElderShieldRequest, ElderShieldResponse, InterventionStatus

logger = logging.getLogger("eldershield")

class ElderShieldAgent(BaseAgent):
    """
    ElderShield Agent
    Protects elderly and vulnerable users from coercion-based scams.
    """
    
    @property
    def name(self) -> str:
        return "eldershield"
    
    ELDERLY_AGE_THRESHOLD       = 60
    PRE_ELDERLY_AGE_THRESHOLD   = 55
    HOLD_DURATION_MINUTES       = 30
    LARGE_AMOUNT_THRESHOLD      = 50_000
    MEDIUM_AMOUNT_THRESHOLD     = 10_000
    QR_AMOUNT_THRESHOLD         = 5_000
    
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        start = time.perf_counter()
        
        # Build pseudo-request for logic reuse
        user_id = context.get("user_id", "unknown")
        user_age = context.get("user_age", 35)
        transaction_amount = context.get("amount", 0.0)
        recipient_is_new = context.get("recipient_is_new", False)
        qr_code_involved = context.get("qr_code_involved", False)
        risk_score = context.get("risk_score", 0.0)
        behavior_change_detected = context.get("behavior_change_detected", False)
        attacker_detected = context.get("attacker_detected", False)
        
        protection, reasons = self._should_trigger(
            user_age, transaction_amount, behavior_change_detected, 
            qr_code_involved, recipient_is_new, risk_score, attacker_detected
        )
        
        hold_required           = protection
        hold_duration_minutes   = self.HOLD_DURATION_MINUTES if hold_required else 0
        family_alert_sent       = hold_required and user_age >= self.PRE_ELDERLY_AGE_THRESHOLD
        warning_shown           = protection
        status                  = InterventionStatus.PENDING if hold_required else InterventionStatus.NONE
        
        elapsed = (time.perf_counter() - start) * 1000
        result = {
            "protection_triggered": protection,
            "hold_required": hold_required,
            "hold_duration_minutes": hold_duration_minutes,
            "family_alert_sent": family_alert_sent,
            "warning_shown": warning_shown,
            "intervention_status": status,
            "reasons": reasons,
            "_execution_time_ms": round(elapsed, 2)
        }
        
        logger.info(f"ElderShieldAgent executed in {elapsed:.2f}ms")
        return result

    def _should_trigger(self, age: int, amount: float, behavior_change: bool, 
                       qr: bool, new_recipient: bool, risk_score: float, 
                       attacker_detected: bool) -> Tuple[bool, List[str]]:
        reasons = []

        if age >= self.ELDERLY_AGE_THRESHOLD:
            reasons.append("User in elderly age bracket (≥60)")

        if age >= self.PRE_ELDERLY_AGE_THRESHOLD and amount > self.LARGE_AMOUNT_THRESHOLD:
            reasons.append(f"Vulnerable age bracket + large transaction value (₹{amount:,.0f})")

        if behavior_change and amount > self.MEDIUM_AMOUNT_THRESHOLD:
            reasons.append("Significant behavioral shift detected for this amount range")

        if qr and new_recipient and amount > self.QR_AMOUNT_THRESHOLD:
            reasons.append("High-risk QR payment to unknown recipient")

        if risk_score > 70:
            reasons.append(f"Aggregated risk score high ({risk_score}/100)")
            
        if attacker_detected and age >= self.PRE_ELDERLY_AGE_THRESHOLD:
             reasons.append("Active attacker scan detected targeting this vulnerable user")

        return len(reasons) > 0, reasons
