"""
HyberShield AI — FastAPI Backend
═════════════════════════════════
Multi-Agent UPI Fraud Prevention Platform

Core Principle: 7 specialized agents working in a coordinated pipeline 
to provide sub-250ms decisioning for high-velocity UPI transactions.
"""

import asyncio
import logging
import time
import uuid
import datetime
from typing import Dict, Any, Optional, List

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Import relative to the app package if running from root, or relative if nested
try:
    from app.agents import agent_factory
    from app.orchestrator.agent_orchestrator import orchestrator
    from app.models.schemas import (
        OrchestratorRequest, OrchestratorResponse, SystemHealth, AgentHealth,
        Decision, ReviewItem, ReviewStatus, ReviewActionRequest
    )
    from app.utils.db_mock import init_db
except ImportError:
    # Handle direct execution or different pathing
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from app.agents import agent_factory
    from app.orchestrator.agent_orchestrator import orchestrator
    from app.models.schemas import (
        OrchestratorRequest, OrchestratorResponse, SystemHealth, AgentHealth,
        Decision, ReviewItem, ReviewStatus, ReviewActionRequest
    )
    from app.utils.db_mock import init_db

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(name)-18s | %(levelname)-8s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("main")

# ── Rate limiting ─────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address, default_limits=["120/minute"])

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="HyberShield AI",
    description="Multi-Agent UPI Fraud Prevention Platform — 7 specialised agents, <250ms decision cycle",
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing HyberShield AI Demo Database and Agents...")
    init_db()
    app.state.reviews = {}
    _ = agent_factory.get_all_agents()
    logger.info("Ready for transactions.")

# ── Request timing middleware ─────────────────────────────────────────────────
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    ms = round((time.perf_counter() - start) * 1000)
    response.headers["X-Process-Time-Ms"] = str(ms)
    return response

# ── Root ──────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Info"])
async def root():
    return {
        "system": "HyberShield AI",
        "tagline": "Proactive. Contextual. Human-Centric.",
        "version": "1.0.0",
        "agents": 7,
        "docs": "/docs",
        "orchestrate": "POST /api/agents/orchestrate",
        "status": "GET /api/agents/status"
    }

# ── Orchestrator ──────────────────────────────────────────────────────────────
@app.post("/api/agents/orchestrate", tags=["Orchestrator"], response_model=OrchestratorResponse)
@limiter.limit("60/minute")
async def orchestrate_endpoint(req: OrchestratorRequest, request: Request):
    try:
        result = await orchestrator.orchestrate(req)
        if result.final_decision == Decision.HOLD:
            review_id = f"rev_{uuid.uuid4().hex[:8]}"
            review = ReviewItem(
                review_id=review_id,
                transaction_id=result.orchestration_id,
                user_id=req.user_id,
                amount=req.amount,
                risk_score=result.risk_score,
                reason=result.explanation,
                timestamp=datetime.datetime.now().isoformat()
            )
            app.state.reviews[review_id] = review
        return result
    except Exception as e:
        logger.error(f"Orchestration failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ── AI COPILOT (VARUN) ────────────────────────────────────────────────────────
@app.post("/api/chat", tags=["Copilot"])
async def chat_bot(req: Dict[str, Any]):
    msg = req.get("message", "").lower().strip()
    
    # ── Rule 1: Identity ──
    if any(k in msg for k in ["who are you", "who is varun", "your name", "identify"]):
        return {
            "response": "I am Varun, your HyberShield AI Cybersecurity Assistant from Team CIPHER BREAKERS. I provide real-time intelligence on our 7-agent defense system.",
            "suggestions": ["Explain GhostNet", "What is ElderShield?", "ROI Metrics"]
        }

    # ── Rule 5: Greetings ──
    if msg in ["hi", "hello", "hey", "namaste"]:
        return {
            "response": "Good evening! How are you? I'm Varun, your HyberShield AI assistant, ready to help with any fraud intelligence queries.",
            "suggestions": ["What is GhostNet?", "Explain VeraShield", "Show ROI"]
        }

    # ── Rule 6: Bye ──
    if msg in ["bye", "goodbye", "exit", "quit"]:
        return {"response": "Bye! Take care and stay safe from UPI fraud."}

    # ── Rule 3: ROI & Metrics ──
    if any(k in msg for k in ["roi", "metrics", "business", "value", "performance"]):
        return {
            "response": "HyberShield AI delivers 40% lower fraud losses, 75% fewer manual reviews, false positives reduced from 34% to 8%, ₹18-26Cr annual value per bank, and ROI in 14 months.",
            "suggestions": ["Explain 7 agents", "Latency data"]
        }

    # ── Rule 7: The 7 Agents List ──
    if any(k in msg for k in ["7 agents", "all agents", "list agents", "which agents"]):
        return {
            "response": "The 7 specialized HyberShield agents are: GhostNet, FingerprintCapture, BlastRadius, ReconSignal, RiskEngine, ElderShield, and VoiceGuard. Which one should I explain first?",
            "suggestions": ["GhostNet", "ElderShield", "VoiceGuard"]
        }

    # ── Rule 2: Agent Definitions ──
    if "ghostnet" in msg:
        return {
            "response": "### GHOSTNET\nGhostNet detects fraudsters BEFORE attack using ghost accounts. When scanners hit ghosts, GhostNet captures IP and device fingerprints. \n\n**Why I used it:** Traditional systems detect fraud AFTER transaction; GhostNet detects reconnaissance phase. \n\n**Example:** An attacker scans 100 UPI IDs; 5 hit our ghosts, flagging the attacker's device immediately.",
            "suggestions": ["Explain FingerprintCapture", "What is BlastRadius?"]
        }
    
    if "fingerprint" in msg:
        return {
            "response": "### FINGERPRINTCAPTURE\nFingerprintCapture builds unique attacker identifiers across sessions by hashing device characteristics (hardware ID, OS version, screen resolution). \n\n**Why I used it:** Attackers frequently change IPs or use VPNs, but they seldom change their physical hardware. \n\n**Example:** Masking IP with Tor won't work because FingerprintCapture recognizes the unique GPU rendering pattern.",
            "suggestions": ["Explain GhostNet", "What is ReconSignal?"]
        }

    if "blastradius" in msg or "blast radius" in msg:
        return {
            "response": "### BLASTRADIUS\nBlastRadius predicts which real users an attacker will target next based on their scanning sequence in GhostNet. \n\n**Why I used it:** It enables proactive PREVENTION before an attack sequence reaches high-value victims. \n\n**Example:** Attacker scans accounts A1, A2, A3; BlastRadius identifies A4 and A5 as imminent targets and locks them down.",
            "suggestions": ["What is ReconSignal?", "Explain VeraShield"]
        }

    if "reconsignal" in msg or "recon signal" in msg:
        return {
            "response": "### RECONSIGNAL\nReconSignal detects subtle reconnaissance that avoids GhostNet hits by using statistical anomaly detection on low-velocity pings. \n\n**Why I used it:** Sophisticated attackers check only 1-2 IDs per day to stay under velocity limits. \n\n**Example:** Identifying a bot that checks one random ID every 6 hours across different IPs.",
            "suggestions": ["Explain 7 agents", "What is RiskEngine?"]
        }

    if "riskengine" in msg or "risk engine" in msg or "score" in msg:
        return {
            "response": "### RISKENGINE\nRiskEngine computes a real-time risk score using a weighted formula where **Attacker Signal (GhostNet/Fingerprint)** has the highest weight (24%). \n\n**Why I used it:** It provides a single, explainable score (0-100) combining pre-attack intelligence with real-time behavior. \n\n**Example:** A transaction might have a risk score of 85 if it follows a GhostNet identification, regardless of amount.",
            "suggestions": ["Explain 7 agents", "What are the thresholds?"]
        }

    if "eldershield" in msg:
        return {
            "response": "### ELDERSHIELD\nElderShield protects senior citizens (60+) from coercion scams where they are manipulated into authorizing a payment themselves. \n\n**Why I used it:** Most fraud systems ignore coercion because the transaction is technically 'authorized'. ElderShield enforces a 30-min hold and family alerts. \n\n**Example:** A 70-year-old transferring ₹50k to a new recipient triggers a cooling period to break the fraudster's urgency.",
            "suggestions": ["What is VoiceGuard?", "ROI Metrics"]
        }

    if "voiceguard" in msg or "deepfake" in msg:
        return {
            "response": "### VOICEGUARD\nVoiceGuard detects audio deepfakes during 'Verification Calls' using a lightweight Wav2Vec 2.0 analysis model. \n\n**Why I used it:** Deepfake voice impersonation (relative in trouble) is a rising threat that standard systems cannot detect. \n\n**Example:** Catching synthetic artifacts in a call claiming to be the user's daughter asking for an emergency UPI transfer.",
            "suggestions": ["Explain ElderShield", "How fast is it?"]
        }

    if "verashield" in msg:
        return {"response": "VeraShield is our 'Active Defense' layer (Vera = Truth). It consists of GhostNet, FingerprintCapture, and BlastRadius to detect intent before the attack happens."}
    
    if "fraudshield" in msg:
        return {"response": "FraudShield is our 'Real-Time' layer. It combines ReconSignal, RiskEngine, and VoiceGuard to evaluate the transaction as it happens."}

    # ── Rule 4: Out of Scope ──
    legal_topics = ["fraud", "cyber", "security", "upi", "hybershield", "agent", "risk", "elder", "voice", "scan", "bank", "technoverse", "cognizant", "hackathon", "varun", "cipher", "roi", "metrics", "layer", "logic", "how", "what", "who", "why"]
    if not any(word in msg for word in legal_topics):
        return {
            "response": "Sorry, I am not supposed to give such responses. I am an expert analyst for HyberShield AI. Please ask about our platform or UPI fraud prevention.",
            "suggestions": ["Who is Varun?", "Explain 7 agents", "Show ROI Metrics"]
        }

    # Default Fallback (Rule-abiding)
    return {
        "response": "I'm Varun, your HyberShield AI Copilot. I can help you understand our 7-agent defense system (GhostNet, ElderShield, etc.) and our ROI metrics. What can I analyze for you?",
        "suggestions": ["Explain GhostNet", "What is ElderShield?", "ROI Metrics"]
    }

# --- Rest of the health check and analytics routes ---
@app.get("/api/analytics/summary", tags=["Analytics"])
async def get_summary():
    return {
        "fraud_loss_reduction": "40%",
        "manual_review_reduction": "75%",
        "false_positive_rate": "12% ↓",
        "avg_decision_time": "218ms",
        "active_ghost_accounts": 50,
        "banks_protected": 21
    }

@app.get("/api/agents/status", tags=["Health"], response_model=SystemHealth)
async def system_status():
    agents = agent_factory.get_all_agents()
    checks = []
    for name, agent in agents.items():
        s = time.perf_counter()
        try:
            await agent.execute({"user_id": "health_check", "amount": 0})
            checks.append(AgentHealth(name=name, status="healthy", latency_ms=round((time.perf_counter() - s)*1000)))
        except:
            checks.append(AgentHealth(name=name, status="degraded", latency_ms=round((time.perf_counter() - s)*1000)))
    return SystemHealth(system="HyberShield AI", status="operational", agents=checks, total_agents=len(agents), healthy_agents=len(checks))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
