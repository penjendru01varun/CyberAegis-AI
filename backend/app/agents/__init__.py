from typing import Dict, Any
from app.agents.ghostnet import GhostNetAgent
from app.agents.fingerprint import FingerprintCaptureAgent
from app.agents.blastradius import BlastRadiusAgent
from app.agents.reconsignal import ReconSignalAgent
from app.agents.riskengine import RiskEngineAgent
from app.agents.eldershield import ElderShieldAgent
from app.agents.voiceguard import VoiceGuardAgent

class AgentFactory:
    """Singleton factory that generates and holds all agents"""
    
    _instance = None
    _agents: Dict[str, Any] = {}
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize_agents()
        return cls._instance
    
    def _initialize_agents(self):
        """Generate all agents once at startup"""
        self._agents = {
            "ghostnet": GhostNetAgent(),
            "fingerprint": FingerprintCaptureAgent(),
            "blastradius": BlastRadiusAgent(),
            "reconsignal": ReconSignalAgent(),
            "riskengine": RiskEngineAgent(),
            "eldershield": ElderShieldAgent(),
            "voiceguard": VoiceGuardAgent()
        }
        print(f"[AgentFactory] Generated {len(self._agents)} agents")
    
    def get_agent(self, name: str):
        return self._agents.get(name)
    
    def get_all_agents(self):
        return self._agents

# Singleton instance
agent_factory = AgentFactory()

__all__ = ["agent_factory", "AgentFactory"]
