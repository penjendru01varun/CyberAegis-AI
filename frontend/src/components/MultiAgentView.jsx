import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Fingerprint, Network, UserCheck, ShieldCheck, Database, Mic2, HardDrive } from 'lucide-react';

const MultiAgentView = () => {
  const agents = [
    { name: 'GhostNet Agent', icon: <Network />, color: '#00f2ff', status: 'Monitoring', desc: 'Manages decoy endpoints / synthetic entities' },
    { name: 'FingerprintCapture Agent', icon: <Fingerprint />, color: '#00f2ff', status: 'Standby', desc: 'Captures attacker metadata & device intelligence' },
    { name: 'BlastRadius Agent', icon: <Zap />, color: '#7000ff', status: 'Monitoring', desc: 'Predicts affected users via scanning patterns' },
    { name: 'RiskEngine Agent', icon: <Cpu />, color: '#7000ff', status: 'Active', desc: 'Computes transaction risk and trust scores' },
    { name: 'VoiceGuard Agent', icon: <Mic2 />, color: '#ff0055', status: 'Standby', desc: 'Analyzes audio for deepfake/synthetic patterns' },
    { name: 'Decision Engine Agent', icon: <ShieldCheck />, color: '#00ff88', status: 'Active', desc: 'Final action orchestration Layer' },
    { name: 'Learning Loop Agent', icon: <HardDrive />, color: '#00ff88', status: 'Updating', desc: 'Feedback collection and monthly retraining' },
    { name: 'UserTrust Agent', icon: <UserCheck />, color: '#00f2ff', status: 'Active', desc: 'Maintains historical behavioral trust profiles' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>Multi-Agent Intelligence Mesh</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Real-time coordination across 8 specialized fraud prevention agents.</p>
      </div>

      <div className="grid grid-2" style={{ gap: '25px', marginTop: '30px' }}>
        {agents.map((agent, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass card"
            style={styles.agentCard}
          >
            <div style={{ ...styles.iconBox, color: agent.color, background: `${agent.color}15` }}>
              {agent.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1.1rem' }}>{agent.name}</h4>
                <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 800, 
                    color: agent.status === 'Active' ? 'var(--success)' : 'var(--text-dim)',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                }}>{agent.status.toUpperCase()}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '5px' }}>{agent.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sophisticated Orchestration Timeline */}
      <div className="glass card" style={{ marginTop: '40px', padding: '40px' }}>
        <h4 style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <BrainCircuit color="var(--primary)" /> 
            LangGraph Multi-Agent Orchestration Trace
        </h4>
        
        <div style={styles.timelineContainer}>
            {/* Input Sources */}
            <div style={styles.agentSources}>
                <AgentNode name="GhostNet" latency="18ms" color="#00f2ff" />
                <AgentNode name="Fingerprint" latency="22ms" color="#00f2ff" />
                <AgentNode name="BlastRadius" latency="15ms" color="#7000ff" />
            </div>

            {/* Connectors */}
            <div style={styles.verticalConnectorBox}>
                <div style={{ ...styles.verticalLine, height: '120px' }}></div>
                <div style={styles.horizontalConnector}></div>
            </div>

            {/* Core Engine */}
            <div style={styles.centerNode}>
                <AgentNode name="RiskEngine" latency="30ms" color="#7000ff" active pulse />
            </div>

            {/* Connectors */}
            <div style={styles.decisionArrows}>
                <div style={styles.horizontalConnector}></div>
            </div>

            {/* Output Layers */}
            <div style={styles.outputStack}>
                <AgentNode name="DecisionEngine" latency="12ms" color="#00ff88" active />
                <div style={styles.decisionResult}>
                    <div className="pulse" style={{ width: '10px', height: '10px', background: 'var(--danger)', borderRadius: '50%' }}></div>
                    <strong style={{ color: 'var(--danger)', fontSize: '1.2rem' }}>BLOCK</strong>
                </div>
            </div>
            
            {/* Branch to ElderShield */}
            <div style={styles.branchLine}>
                <div style={styles.cornerConnector}></div>
                <AgentNode name="ElderShield" latency="12ms" color="#00ff88" />
                <div style={{ fontSize: '0.7rem', color: 'var(--success)', marginTop: '5px' }}>HOLD + Family Alert</div>
            </div>
        </div>

        <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                TOTAL EXECUTION TIME: <strong style={{ color: 'var(--success)' }}>212ms ✅</strong>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <span className="badge" style={{ fontSize: '0.6rem' }}>Parallel Flow</span>
                <span className="badge" style={{ fontSize: '0.6rem' }}>Deterministic State</span>
            </div>
        </div>
      </div>
    </div>
  );
};

const AgentNode = ({ name, latency, color, active, pulse }) => (
    <motion.div 
        animate={pulse ? { boxShadow: [`0 0 0px ${color}00`, `0 0 20px ${color}40`, `0 0 0px ${color}00`] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ 
            padding: '12px 20px', 
            background: active ? `${color}15` : 'rgba(255,255,255,0.03)', 
            border: `1px solid ${active ? color : 'var(--border)'}`,
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '120px',
            zIndex: 2
        }}
    >
        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: active ? 'white' : 'var(--text-dim)' }}>{name}</span>
        <span style={{ fontSize: '0.7rem', color, fontWeight: 700 }}>({latency})</span>
    </motion.div>
);

const styles = {
  container: {
    padding: '20px'
  },
  header: {
    marginBottom: '30px'
  },
  agentCard: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    padding: '20px'
  },
  iconBox: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  timelineContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      minHeight: '200px'
  },
  agentSources: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
  },
  verticalConnectorBox: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      marginLeft: '20px'
  },
  verticalLine: {
      width: '2px',
      background: 'var(--border)',
      position: 'relative'
  },
  horizontalConnector: {
      width: '40px',
      height: '2px',
      background: 'var(--border)'
  },
  centerNode: {
      margin: '0 10px'
  },
  decisionArrows: {
      display: 'flex',
      alignItems: 'center'
  },
  outputStack: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      marginLeft: '20px'
  },
  decisionResult: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 20px',
      background: 'rgba(255,0,85,0.1)',
      border: '1px solid var(--danger)',
      borderRadius: '8px'
  },
  branchLine: {
      position: 'absolute',
      bottom: '-80px',
      left: '50%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
  },
  cornerConnector: {
      width: '2px',
      height: '40px',
      background: 'var(--border)',
      marginBottom: '10px'
  }
};

export default MultiAgentView;
