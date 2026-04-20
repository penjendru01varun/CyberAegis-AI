import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, RotateCcw, Shield, Zap, Heart, AlertOctagon, 
  CheckCircle, Info, Search, Activity, Clock, Server, 
  Fingerprint, MapPin, Tablet, UserCheck, ShieldAlert 
} from 'lucide-react';

const Simulation = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [params, setParams] = useState({
    amount: 85000,
    is_elderly: false,
    location_mismatch: false,
    device_change: false,
    ghost_hit: false,
    voice_deepfake: false,
    profile: "Balanced"
  });

  const runSim = async () => {
    setLoading(true);
    try {
      const payload = {
        user_id: "user_demo_123",
        amount: params.amount,
        location_city: params.location_mismatch ? "New York" : "Mumbai",
        device_fingerprint: params.device_change ? "fp_foreign_device" : "fp_abc",
        transaction_time: new Date().toISOString(),
        source_ip: "203.0.113." + (params.ghost_hit ? "99" : "22"),
        user_agent: params.ghost_hit ? "python-requests/2.28" : navigator.userAgent,
        ghost_upi_id: params.ghost_hit ? "ghost_9876543210@bank" : null,
        scan_velocity: params.ghost_hit ? 120 : 0,
        user_age: params.is_elderly ? 72 : 32,
        recipient_is_new: params.location_mismatch || params.ghost_hit,
        qr_code_involved: params.is_elderly,
        audio_sample_url: params.voice_deepfake ? "https://cdn.bank/synthetic_sample.wav" : "https://cdn.bank/clean_sample.wav",
        verification_context: params.voice_deepfake ? "kyc_verification" : "standard",
        lookup_patterns: params.ghost_hit ? ["ghost_9876543210@bank", "next_target@upi"] : []
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/agents/orchestrate`, payload);
      const data = res.data;
      
      setResult({
        decision: data.final_decision,
        risk_score: data.risk_score,
        trust_score: data.trust_score,
        explanation: data.explanation,
        agents: data.agents, // raw trace
        latency: data.total_time_ms,
        id: data.orchestration_id
      });
    } catch (err) {
      console.error(err);
      setResult({
        decision: "ERROR", 
        risk_score: 0, 
        trust_score: 0, 
        explanation: "Failed to connect to HyberShield AI Platform. Verify backend status.", 
        agents: [],
        id: "ERR-500"
      });
    }
    setLoading(false);
  };

  return (
    <section className="section" style={{ padding: '120px 0', background: 'radial-gradient(circle at 10% 20%, rgba(10, 12, 18, 1) 0%, rgba(20, 15, 40, 1) 100%)' }} id="simulation">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div className="badge" style={{ background: 'rgba(0, 242, 255, 0.1)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
            Live Security Sandbox
          </div>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem' }} className="glow-text">
            Attack Simulation
          </h2>
          <p className="subtitle" style={{ maxWidth: '700px', margin: '0 auto' }}>
            Trigger advanced fraud vectors like Deepfakes, Decoy Scanning, and Elderly Coercion to see our Multi-Agent Swarm in action.
          </p>
        </div>

        <div className="grid grid-2" style={{ gap: '4rem', alignItems: 'start' }}>
          {/* Left: Input Controls */}
          <div className="glass" style={{ padding: '3rem', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-1px', left: '10%', width: '80%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--primary), transparent)' }} />
            
            <h3 style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '15px', color: '#fff' }}>
              <Zap size={28} color="var(--primary)" /> Scenario Engine
            </h3>
            
            <div style={styles.controlGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Transaction Amount</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', fontWeight: 800 }}>₹</span>
                  <input 
                    type="number" 
                    value={params.amount}
                    onChange={e => setParams({...params, amount: Number(e.target.value)})}
                    style={{ ...styles.input, paddingLeft: '35px' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <ToggleItem 
                  label="GhostNet Trigger" 
                  active={params.ghost_hit} 
                  onClick={() => setParams({...params, ghost_hit: !params.ghost_hit})} 
                  icon={<Fingerprint size={18} />}
                  desc="Attacker scanning decoy accounts"
                />
                <ToggleItem 
                  label="Deepfake Voice" 
                  active={params.voice_deepfake} 
                  onClick={() => setParams({...params, voice_deepfake: !params.voice_deepfake})} 
                  icon={<Activity size={18} />}
                  desc="AI-Synthesized voice artifacts"
                />
                <ToggleItem 
                  label="Safety Hold (Elderly)" 
                  active={params.is_elderly} 
                  onClick={() => setParams({...params, is_elderly: !params.is_elderly})} 
                  icon={<Heart size={18} />}
                  desc="Age-based coercion protection"
                />
                <ToggleItem 
                  label="Device Anomaly" 
                  active={params.device_change} 
                  onClick={() => setParams({...params, device_change: !params.device_change})} 
                  icon={<Tablet size={18} />}
                  desc="Foreign OS/HW Fingerprint"
                />
              </div>

              <div style={{ ...styles.inputGroup, marginTop: '1.5rem' }}>
                <label style={styles.label}>Risk Threshold Profile</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {["Balanced", "Aggressive", "Conservative"].map(p => (
                    <button 
                      key={p}
                      onClick={() => setParams({...params, profile: p})}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        background: params.profile === p ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                        color: params.profile === p ? '#000' : '#fff',
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              className="btn-primary pulse-hover" 
              style={{ width: '100%', marginTop: '3rem', height: '70px', fontSize: '1.2rem', fontWeight: 900, borderRadius: '14px' }}
              onClick={runSim}
              disabled={loading}
            >
              {loading ? "HYBERSHIELD ANALYZING..." : <>DEPLOY AGENT SWARM <Play fill="currentColor" /></>}
            </button>
          </div>

          {/* Right: Output Visualization */}
          <div className="glass" style={{ minHeight: '650px', padding: '3rem', background: 'rgba(5,5,20,0.4)', border: '1px solid rgba(112,0,255,0.15)', overflow: 'hidden', position: 'relative' }}>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Header: Decision & Gauge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <div className="badge" style={{ color: getDecisionColor(result.decision), borderColor: getDecisionColor(result.decision), background: `${getDecisionColor(result.decision)}15` }}>
                        AGENT ARBITRATION: {result.decision}
                      </div>
                      <h3 style={{ fontSize: '3rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {result.decision === 'ALLOW' ? <CheckCircle size={40} color="var(--success)" /> : <AlertOctagon size={40} color="var(--danger)" />} 
                        {result.decision}
                      </h3>
                      <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={14} /> {result.latency}ms
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                          ID: {result.id}
                        </span>
                      </div>
                    </div>
                    
                    <div style={styles.gaugeContainer}>
                        <svg viewBox="0 0 100 100" style={{ width: '120px', transform: 'rotate(-90deg)' }}>
                           <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                           <motion.circle 
                             cx="50" cy="50" r="40" 
                             fill="transparent" 
                             stroke={getDecisionColor(result.decision)} 
                             strokeWidth="8"
                             strokeDasharray="251.2"
                             initial={{ strokeDashoffset: 251.2 }}
                             animate={{ strokeDashoffset: 251.2 - (251.2 * result.risk_score / 100) }}
                             transition={{ duration: 1.5, ease: "easeOut" }}
                             strokeLinecap="round"
                           />
                        </svg>
                        <div style={styles.gaugeValue}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>RISK</span>
                            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>{result.risk_score}</span>
                        </div>
                    </div>
                  </div>

                  {/* Multi-Agent Trace timeline */}
                  <div style={{ marginTop: '3rem' }}>
                    <h4 style={styles.sectionHeader}><Server size={14} /> Parallel Agent Execution Trace</h4>
                    <div style={styles.timeline}>
                      {result.agents.map((agent, idx) => (
                        <div key={agent.name} style={styles.timelineItem}>
                           <div style={{ ...styles.timelineDot, background: agent.status === 'SUCCESS' ? 'var(--primary)' : 'var(--danger)' }} />
                           <div style={styles.timelineContent}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{agent.name}</span>
                                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{agent.time_ms}ms</span>
                              </div>
                              <div style={{ fontSize: '0.75rem', opacity: 0.8, color: agent.name === 'RiskEngine' ? 'var(--primary)' : '#fff' }}>
                                {agent.output.reason_codes?.[0] || 'Signal Analyzed'}
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explainable AI block */}
                  <div style={styles.explanationBox}>
                    <h4 style={styles.sectionHeader}><ShieldAlert size={14} /> Cognitive Explanation</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)' }}>{result.explanation}</p>
                    
                    {params.ghost_hit && (
                      <div style={styles.intelBlock}>
                        <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Shield size={12} /> ATTACKER INTELLIGENCE RECOVERED
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
                          <code style={{ background: '#000', padding: '5px', borderRadius: '4px' }}>IP: 203.0.113.99</code>
                          <code style={{ background: '#000', padding: '5px', borderRadius: '4px' }}>SIG: BOT_SCAN_PATTERN</code>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div key="placeholder" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-dim)' }}>
                  <div style={{ padding: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
                    <Activity size={60} className="pulse" color="var(--primary)" />
                  </div>
                  <h4 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '10px' }}>System Ready</h4>
                  <p>HyberShield AI agents are standing by. <br /> Select an attack scenario to begin orchestration.</p>
                </div>
              )}
            </AnimatePresence>
            
            {loading && (
              <div style={styles.loaderCover}>
                <div style={{ width: '120px', height: '120px', position: 'relative' }}>
                   <div style={styles.spinnerCore} />
                   <div className="pulse" style={{ position: 'absolute', inset: 0, border: '2px solid var(--primary)', borderRadius: '50%' }} />
                </div>
                <p style={{ marginTop: '2rem', fontWeight: 900, letterSpacing: '4px', color: 'var(--primary)' }}>COORDINATING SWARM</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '8px' }}>Layers [1/3] → Neural Arbitration...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const ToggleItem = ({ label, active, onClick, icon, desc }) => (
  <div 
    onClick={onClick}
    style={{ 
      padding: '16px', 
      borderRadius: '16px', 
      border: `1px dotted ${active ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
      background: active ? 'rgba(0,242,255,0.08)' : 'rgba(255,255,255,0.02)',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: active ? 'translateY(-2px)' : 'none',
      boxShadow: active ? '0 10px 20px rgba(0,0,0,0.2)' : 'none'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ color: active ? 'var(--primary)' : 'var(--text-dim)', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px' }}>{icon}</span>
      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: active ? '#fff' : 'var(--text-dim)' }}>{label}</span>
    </div>
    <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>{desc}</span>
  </div>
);

const getDecisionColor = (decision) => {
  switch(decision?.toUpperCase()) {
    case 'ALLOW': return 'var(--success)';
    case 'BLOCK': return 'var(--danger)';
    case 'OTP':   return 'var(--warning)';
    case 'HOLD':  return 'var(--accent)';
    default:      return 'var(--primary)';
  }
};

const styles = {
  controlGrid: { display: 'grid', gap: '15px' },
  label: { fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' },
  inputGroup: { display: 'flex', flexDirection: 'column' },
  input: {
    background: '#0e111a',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '18px',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: 700,
    outline: 'none',
    width: '100%'
  },
  gaugeContainer: { position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  gaugeValue: { position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  sectionHeader: { fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '2px' },
  timeline: { borderLeft: '1px solid rgba(255,255,255,0.1)', marginLeft: '10px', display: 'flex', flexDirection: 'column', gap: '15px' },
  timelineItem: { position: 'relative', paddingLeft: '25px' },
  timelineDot: { position: 'absolute', left: '-5px', top: '5px', width: '9px', height: '9px', borderRadius: '50%', boxShadow: '0 0 10px currentColor' },
  timelineContent: { background: 'rgba(255,255,255,0.03)', padding: '10px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' },
  explanationBox: { marginTop: '2rem', padding: '2rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(112,0,255,0.05))', borderRadius: '20px', border: '1px solid rgba(112,0,255,0.1)' },
  intelBlock: { marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' },
  loaderCover: {
    position: 'absolute', inset: 0, background: 'rgba(5,5,15,0.95)', zIndex: 100,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
  },
  spinnerCore: {
    width: '60px', height: '60px', border: '4px solid rgba(0,242,255,0.1)', borderTopColor: 'var(--primary)',
    borderRadius: '50%', animation: 'spin 1s linear infinite'
  }
};

export default Simulation;
