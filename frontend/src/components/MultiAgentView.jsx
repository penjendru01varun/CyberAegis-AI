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

      {/* Orchestration View */}
      <div className="glass card" style={{ marginTop: '40px', padding: '40px', textAlign: 'center' }}>
        <h4 style={{ marginBottom: '30px' }}>LangGraph Orchestration Trace</h4>
        <div style={styles.traceLine}>
            <TraceNode label="Input" />
            <TraceConnector active />
            <TraceNode label="VeraShield" active />
            <TraceConnector active />
            <TraceNode label="RiskEngine" active />
            <TraceConnector active />
            <TraceNode label="Decision" active />
            <TraceConnector />
            <TraceNode label="Output" />
        </div>
      </div>
    </div>
  );
};

const TraceNode = ({ label, active }) => (
    <div style={{ 
        width: '100px', 
        height: '40px', 
        borderRadius: '8px', 
        background: active ? 'var(--primary-glow)' : 'rgba(255,255,255,0.05)',
        border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        fontWeight: 700,
        color: active ? 'white' : 'var(--text-dim)'
    }}>
        {label}
    </div>
);

const TraceConnector = ({ active }) => (
    <div style={{ 
        flex: 1, 
        height: '2px', 
        background: active ? 'var(--primary)' : 'var(--border)',
        position: 'relative'
    }}>
        {active && <motion.div 
            animate={{ x: [0, 50, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'white', position: 'absolute', top: '-4px' }}
        />}
    </div>
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
  traceLine: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      maxWidth: '800px',
      margin: '0 auto'
  }
};

export default MultiAgentView;
