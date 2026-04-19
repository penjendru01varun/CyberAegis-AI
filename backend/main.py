from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
import time
import datetime

app = FastAPI(title="HyberShield AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---

class Transaction(BaseModel):
    id: str
    sender_upi: str
    receiver_upi: str
    amount: float
    timestamp: str
    location: str
    device_id: str
    is_elderly: bool = False

class SimulationRequest(BaseModel):
    amount: float
    is_elderly: bool
    location_mismatch: bool
    device_change: bool
    ghost_hit: bool
    voice_deepfake: bool = False
    profile: str = "Balanced" # Aggressive, Balanced, Conservative

class AgentSignal(BaseModel):
    agent: str
    status: str
    message: str
    timestamp: str

class FraudDecision(BaseModel):
    risk_score: int
    trust_score: int
    decision: str
    explanation: str
    agents_involved: List[str]
    signals: List[AgentSignal]

class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None

# --- Mock Data ---

GHOST_ACCOUNTS = ["user047@okaxis", "support_decoy@upi", "test_ghost_99@axis"]

# --- Helper Logic ---

def calculate_risk(req: SimulationRequest):
    score = 0
    agents = []
    signals = []
    
    now = datetime.datetime.now().isoformat()
    
    # Profile weights
    multipliers = {
        "Aggressive": 1.5,
        "Balanced": 1.0,
        "Conservative": 0.7
    }
    w = multipliers.get(req.profile, 1.0)
    
    if req.ghost_hit:
        score += 45 * w
        agents.append("GhostNet Agent")
        signals.append(AgentSignal(agent="GhostNet Agent", status="CRITICAL", message=f"Interaction with ghost account detected (Weight: {w}x)", timestamp=now))
        agents.append("FingerprintCapture Agent")
        signals.append(AgentSignal(agent="FingerprintCapture Agent", status="INFO", message="Attacker fingerprint captured: IP 103.21.x.x, Emulator detected", timestamp=now))
        agents.append("BlastRadius Agent")
        score += 15 * w
        signals.append(AgentSignal(agent="BlastRadius Agent", status="WARNING", message="Predicted target profile match: High-value salary accounts", timestamp=now))

    if req.amount > 50000:
        score += 20 * w
        signals.append(AgentSignal(agent="RiskEngine Agent", status="WARNING", message=f"High value transaction: ₹{req.amount}", timestamp=now))
    
    if req.location_mismatch:
        score += 25 * w
        signals.append(AgentSignal(agent="RiskEngine Agent", status="WARNING", message="Location mismatch: Chennai vs last known Mumbai", timestamp=now))
        
    if req.device_change:
        score += 20 * w
        signals.append(AgentSignal(agent="RiskEngine Agent", status="WARNING", message="New device ID detected for account", timestamp=now))

    if req.voice_deepfake:
        score += 30 * w
        agents.append("VoiceGuard Agent")
        signals.append(AgentSignal(agent="VoiceGuard Agent", status="CRITICAL", message="Wav2Vec 2.0 detected synthetic voice patterns", timestamp=now))

    if "RiskEngine Agent" not in agents:
        agents.append("RiskEngine Agent")
        
    # Decision Engine Orchestration
    agents.append("Decision Engine Agent")
    max_score = int(min(score, 100))
    
    # Profile-based thresholds
    thresholds = {
        "Aggressive": {"Block": 60, "OTP": 40, "Alert": 20},
        "Balanced": {"Block": 80, "OTP": 60, "Alert": 35},
        "Conservative": {"Block": 95, "OTP": 80, "Alert": 60}
    }
    t = thresholds.get(req.profile, thresholds["Balanced"])
    
    decision = "Allow"
    if max_score >= t["Block"]:
        decision = "Block"
    elif max_score >= t["OTP"]:
        decision = "OTP"
    elif max_score >= t["Alert"]:
        decision = "Alert"
        
    # Trust Score calculation (Inversely proportional to risk and sensitive to profile)
    trust_score = 100 - (max_score // 2) - (10 if req.is_elderly and max_score > 30 else 0)
    if req.profile == "Aggressive": trust_score -= 10
    if req.profile == "Conservative": trust_score += 5
    trust_score = max(0, min(100, trust_score))
    
    # ElderShield Override
    if req.is_elderly and decision in ["Allow", "Alert"] and req.amount > 10000:
        decision = "Hold"
        agents.append("ElderShield Agent")
        signals.append(AgentSignal(agent="ElderShield Agent", status="HOLD", message="Large transaction for 60+ user. 30-min cooling period activated.", timestamp=now))

    explanation = f"Strategy: {req.profile}. Logic: "
    if decision == "Block":
        explanation += f"Critical risk thresholds breached ({max_score}% > {t['Block']}%)."
    elif decision == "OTP":
        explanation += f"Identity verification required for score {max_score}%."
    elif decision == "Hold":
        explanation += "ElderShield: high-value safety hold applied."
    elif decision == "Alert":
        explanation += f"Caution advised. Composite risk at {max_score}%."
    else:
        explanation += "Transaction parameters within safety bounds."

    return FraudDecision(
        risk_score=max_score,
        trust_score=trust_score,
        decision=decision,
        explanation=explanation,
        agents_involved=list(set(agents)),
        signals=signals
    )

    return FraudDecision(
        risk_score=max_score,
        trust_score=trust_score,
        decision=decision,
        explanation=explanation,
        agents_involved=list(set(agents)),
        signals=signals
    )

# --- Routes ---

@app.get("/")
def read_root():
    return {"status": "HyberShield AI Online", "sub_250ms_decisioning": True}

@app.post("/api/simulate-transaction", response_model=FraudDecision)
def simulate_transaction(request: SimulationRequest):
    # Simulate processing time
    delay = random.uniform(0.18, 0.24) # 180ms to 240ms
    time.sleep(delay)
    return calculate_risk(request)

@app.post("/api/chat")
def chat_bot(request: ChatRequest):
    msg = request.message.lower()
    
    if "verashield" in msg:
        return {"response": "VeraShield is our proactive layer. It uses ghost accounts (decoys) to detect fraudsters during their 'scanning' phase, capturing their device fingerprints before they reach real victims."}
    elif "fraudshield" in msg:
        return {"response": "FraudShield is the real-time detection engine. It analyzes transaction context like location, amount, and behavior to compute a risk score under 250ms."}
    elif "eldershield" in msg:
        return {"response": "ElderShield focuses on social engineering. It protects users over 60 with cooling periods, family alerts, and specialized UI warnings for QR scams."}
    elif "block" in msg or "why" in msg:
        return {"response": "I can analyze specific transaction flags. Usually, a block occurs if we see high-risk signals like a ghost account hit combined with a location mismatch."}
    else:
        return {"response": "I'm the HyberShield AI Copilot. I can help you understand our 3-layer defense: VeraShield (Pre-attack), FraudShield (Real-time), and ElderShield (Vulnerable protection). What would you like to know?"}

@app.get("/api/analytics/summary")
def get_summary():
    return {
        "fraud_loss_reduction": "40%",
        "manual_review_reduction": "75%",
        "false_positive_rate": "8% (from 34%)",
        "avg_decision_time": "218ms",
        "active_ghost_accounts": 50,
        "banks_protected": 21
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
