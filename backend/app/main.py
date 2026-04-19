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
from datetime import datetime
from typing import Dict, Any, Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

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
    # Global mock for HITL
    app.state.reviews = {}
    # Agent factory initializes on first access or via import
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

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║                            ORCHESTRATOR                                     ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

@app.post(
    "/api/agents/orchestrate",
    tags=["Orchestrator"],
    summary="Run full agent pipeline with collision resolution",
    response_model=OrchestratorResponse
)
@limiter.limit("60/minute")
async def orchestrate_endpoint(req: OrchestratorRequest, request: Request):
    try:
        result = await orchestrator.orchestrate(req)
        
        # If HOLD is issued, create a pending review automatically
        if result.final_decision == Decision.HOLD:
            review_id = f"rev_{uuid.uuid4().hex[:8]}"
            review = ReviewItem(
                review_id=review_id,
                transaction_id=result.orchestration_id,
                user_id=req.user_id,
                amount=req.amount,
                risk_score=result.risk_score,
                reason=result.explanation,
                timestamp=datetime.now().isoformat()
            )
            app.state.reviews[review_id] = review
            logger.info(f"Transaction {result.orchestration_id} queued for HUMAN REVIEW (ID: {review_id})")
            
        return result
    except Exception as e:
        logger.error(f"Orchestration failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║                        HUMAN-IN-THE-LOOP (HITL)                             ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

@app.get("/api/reviews", tags=["HITL"])
async def get_pending_reviews():
    """List all transactions pending analyst review"""
    return list(app.state.reviews.values())

@app.post("/api/reviews/{review_id}/action", tags=["HITL"])
async def take_review_action(review_id: str, action_req: ReviewActionRequest):
    """Approve or Reject a transaction currently on hold"""
    if review_id not in app.state.reviews:
        raise HTTPException(status_code=404, detail="Review item not found")
    
    review = app.state.reviews[review_id]
    review.status = action_req.action
    review.analyst_notes = action_req.notes
    
    logger.info(f"Review {review_id} {action_req.action} by analyst. Notes: {action_req.notes}")
    return {"status": "success", "review": review}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║                         INDIVIDUAL AGENT TESTING                           ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

@app.post("/api/agents/{agent_name}/test", tags=["Testing"])
async def test_agent(agent_name: str, context: Dict[str, Any]):
    agent = agent_factory.get_agent(agent_name)
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_name}' not found")
    
    try:
        result = await agent.execute(context)
        return result
    except Exception as e:
        logger.error(f"Agent {agent_name} test failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║                           HEALTH & STATUS                                   ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

@app.get("/api/agents/status", tags=["Health"], response_model=SystemHealth)
async def system_status():
    """Health check for all registered agents"""
    agents = agent_factory.get_all_agents()
    
    async def ping_agent(name: str, agent) -> AgentHealth:
        s = time.perf_counter()
        try:
            # Execute with minimal dummy context
            await agent.execute({"user_id": "health_check", "amount": 0})
            return AgentHealth(
                name=name,
                status="healthy",
                latency_ms=round((time.perf_counter() - s) * 1000)
            )
        except Exception as e:
            return AgentHealth(
                name=name,
                status=f"degraded: {str(e)}",
                latency_ms=round((time.perf_counter() - s) * 1000)
            )

    checks = await asyncio.gather(*[
        ping_agent(name, agent) for name, agent in agents.items()
    ])
    
    healthy_count = sum(1 for a in checks if a.status == "healthy")
    
    return SystemHealth(
        system="HyberShield AI",
        status="operational" if healthy_count == len(agents) else "degraded",
        agents=list(checks),
        total_agents=len(agents),
        healthy_agents=healthy_count
    )

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║                         DEMO SCENARIO SHORTCUTS                             ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

DEMO_SCENARIOS = {
    "verashield_ghost": OrchestratorRequest(
        user_id="user_victim_001",
        amount=45000.0,
        location_city="Delhi",
        device_fingerprint="fp_unknown_x9",
        transaction_time=datetime.now().isoformat(),
        source_ip="203.0.113.77",
        user_agent="python-requests/2.28",
        ghost_upi_id="ghost_9876543210@sbi",
        scan_velocity=120,
        user_age=35,
        recipient_is_new=True,
        lookup_patterns=["9876543210@sbi", "9876543211@sbi"],
        scan_pattern=["9876543210", "9876543211"]
    ),
    "eldershield_coercion": OrchestratorRequest(
        user_id="user_elder_003",
        amount=175000.0,
        location_city="Chennai",
        device_fingerprint="fp_elder_03",
        transaction_time=datetime.now().isoformat(),
        source_ip="192.0.2.45",
        user_agent="Mozilla/5.0 Android",
        user_age=67,
        recipient_is_new=True,
        qr_code_involved=True
    ),
    "voiceguard_deepfake": OrchestratorRequest(
        user_id="user_004",
        amount=60000.0,
        location_city="Hyderabad",
        device_fingerprint="fp_abc",
        transaction_time=datetime.now().isoformat(),
        source_ip="203.0.113.99",
        user_agent="Mozilla/5.0 Chrome/120",
        user_age=42,
        audio_sample_url="https://cdn.bank/synthetic_voice_001.wav",
        verification_context="kyc_verification"
    )
}

@app.get("/api/demo/{scenario}", tags=["Demo"])
async def run_demo(scenario: str, request: Request):
    if scenario not in DEMO_SCENARIOS:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return await orchestrator.orchestrate(DEMO_SCENARIOS[scenario])
