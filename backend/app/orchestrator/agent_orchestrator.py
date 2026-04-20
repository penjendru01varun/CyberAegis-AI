import asyncio
import time
import logging
import uuid
from datetime import datetime
from typing import Any, Dict, List, Tuple

from app.agents import agent_factory
from app.models.schemas import (
    OrchestratorRequest, OrchestratorResponse, AgentTrace, Decision
)

logger = logging.getLogger("orchestrator")

class AgentOrchestrator:
    """Coordinates all agents to work together and resolves conflicts"""
    
    async def orchestrate(self, req: OrchestratorRequest) -> OrchestratorResponse:
        """
        Run all agents in coordinated sequence.
        Agents that can run in parallel do so.
        Agents that depend on outputs run sequentially.
        """
        start_time = time.perf_counter()
        orchestration_id = f"orch_{uuid.uuid4().hex[:12]}"
        agent_results: Dict[str, Dict[str, Any]] = {}
        agent_traces: List[AgentTrace] = []
        
        # ============================================================
        # STAGE 1: PARALLEL EXECUTION (No dependencies)
        # GhostNet, FingerprintCapture, ReconSignal, VoiceGuard
        # ============================================================
        
        parallel_agents = ["ghostnet", "fingerprint", "reconsignal", "voiceguard"]
        parallel_tasks = [
            self._run_agent(name, req.model_dump()) 
            for name in parallel_agents
        ]
        
        parallel_outputs = await asyncio.gather(*parallel_tasks)
        
        for name, output in zip(parallel_agents, parallel_outputs):
            agent_results[name] = output
            agent_traces.append(AgentTrace(
                name=name,
                time_ms=int(output.get("_execution_time_ms", 0)),
                status="ok",
                output=output
            ))
        
        # ============================================================
        # STAGE 2: BLASTRADIUS (Depends on GhostNet output)
        # ============================================================
        
        blastradius_context = {
            **req.model_dump(),
            "attacker_fingerprint": agent_results["ghostnet"].get("attacker_fingerprint"),
            "scan_pattern": agent_results["ghostnet"].get("scan_pattern", [])
        }
        
        blastradius_out = await self._run_agent("blastradius", blastradius_context)
        agent_results["blastradius"] = blastradius_out
        agent_traces.append(AgentTrace(
            name="blastradius",
            time_ms=int(blastradius_out.get("_execution_time_ms", 0)),
            status="ok",
            output=blastradius_out
        ))
        
        # ============================================================
        # STAGE 3: RISK ENGINE (Depends on ALL previous agents)
        # ============================================================
        
        riskengine_context = {
            **req.model_dump(),
            "attacker_signal_score": agent_results["ghostnet"].get("threat_level_score", 0),
            "fingerprint_risk": agent_results["fingerprint"].get("bot_likelihood", 0),
            "recon_confidence": agent_results["reconsignal"].get("recon_confidence", 0),
            "voice_risk_score": agent_results["voiceguard"].get("voice_risk_score", 0),
            "blast_radius_risk": len(agent_results["blastradius"].get("predicted_targets", [])) > 0,
            "elderly_flag": req.user_age >= 55
        }
        
        riskengine_out = await self._run_agent("riskengine", riskengine_context)
        agent_results["riskengine"] = riskengine_out
        agent_traces.append(AgentTrace(
            name="riskengine",
            time_ms=int(riskengine_out.get("_execution_time_ms", 0)),
            status="ok",
            output=riskengine_out
        ))
        
        # ============================================================
        # STAGE 4: ELDERSHIELD (Depends on RiskEngine score)
        # ============================================================
        
        eldershield_context = {
            **req.model_dump(),
            "risk_score": float(agent_results["riskengine"].get("risk_score", 0)),
            "attacker_detected": agent_results["ghostnet"].get("scan_detected", False)
        }
        
        eldershield_out = await self._run_agent("eldershield", eldershield_context)
        agent_results["eldershield"] = eldershield_out
        agent_traces.append(AgentTrace(
            name="eldershield",
            time_ms=int(eldershield_out.get("_execution_time_ms", 0)),
            status="ok",
            output=eldershield_out
        ))
        
        # ============================================================
        # STAGE 5: FINAL DECISION COLLISION RESOLUTION
        # ============================================================
        
        final_decision_data = self._resolve_agent_conflicts(agent_results)
        
        total_time_ms = round((time.perf_counter() - start_time) * 1000)
        
        return OrchestratorResponse(
            orchestration_id=orchestration_id,
            status="completed",
            total_time_ms=total_time_ms,
            agents=agent_traces,
            final_decision=Decision(final_decision_data["decision"]),
            risk_score=agent_results["riskengine"].get("risk_score", 0),
            trust_score=agent_results["riskengine"].get("trust_score", 0),
            explanation=final_decision_data["explanation"]
        )

    async def _run_agent(self, agent_name: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a single agent and return results"""
        agent = agent_factory.get_agent(agent_name)
        if not agent:
            return {"error": f"Agent {agent_name} not found"}
        return await agent.execute(context)

    def _resolve_agent_conflicts(self, agent_results: Dict[str, Dict[str, Any]]) -> Dict[str, str]:
        """
        COLLISION RESOLUTION: When agents disagree, decide who wins.
        
        Priority Order:
        1. VoiceGuard (deepfake detection overrides everything)
        2. ElderShield (elder protection overrides standard scoring)
        3. GhostNet (pre-attack detection raises suspicion)
        4. RiskEngine (standard scoring)
        """
        
        # Priority 1: VoiceGuard deepfake detection
        vg = agent_results.get("voiceguard", {})
        voice_risk = vg.get("voice_risk_score", 0)
        if voice_risk > 80:
            return {
                "decision": "BLOCK",
                "explanation": "🚨 CRITICAL: Deepfake voice detected by VoiceGuard. Transaction blocked for account security."
            }
        elif voice_risk > 60:
            return {
                "decision": "OTP",
                "explanation": "⚠️ WARNING: Suspicious voice pattern detected. Step-up verification required."
            }
            
        # Priority 2: ElderShield intervention
        es = agent_results.get("eldershield", {})
        if es.get("protection_triggered"):
            if es.get("hold_required"):
                return {
                    "decision": "HOLD", 
                    "explanation": f"👵 ElderShield Protected: {', '.join(es.get('reasons', []))}. 30-min safety hold applied for manual review."
                }
        
        # Priority 3: GhostNet pre-attack escalation
        gn = agent_results.get("ghostnet", {})
        re = agent_results.get("riskengine", {})
        risk_decision = re.get("decision", "ALLOW")
        
        if gn.get("scan_detected"):
            threat = gn.get("threat_level", "LOW")
            if threat in ["HIGH", "CRITICAL"] and risk_decision in ["ALLOW", "ALERT"]:
                return {
                    "decision": "OTP",
                    "explanation": f"🔍 ESCALATED: Pre-attack reconnaissance detected by GhostNet ({threat} threat). Verification required."
                }
        
        # Priority 4: RiskEngine default decision
        return {
            "decision": str(risk_decision),
            "explanation": f"✅ {re.get('explanation', 'Standard risk scoring applied.')}"
        }

# Global instance for use in main.py
orchestrator = AgentOrchestrator()
