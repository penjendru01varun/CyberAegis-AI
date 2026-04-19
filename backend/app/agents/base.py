from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseAgent(ABC):
    """All agents must inherit from this"""
    
    @abstractmethod
    async def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agent logic and return results"""
        pass
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Return the unique name of the agent"""
        pass
