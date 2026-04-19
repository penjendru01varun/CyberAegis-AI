import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Shield, Zap, Heart, AlertOctagon, CheckCircle, Info, Search, Activity } from 'lucide-react';

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
      // Map frontend params to backend OrchestratorRequest
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
        qr_code_involved: params.is_elderly, // simulate common coercion vector
        audio_sample_url: params.voice_deepfake ? "https://cdn.bank/synthetic_sample.wav" : "https://cdn.bank/clean_sample.wav",
        verification_context: params.voice_deepfake ? "kyc_verification" : "standard",
        lookup_patterns: params.ghost_hit ? ["ghost_9876543210@bank", "next_target@upi"] : []
      };

      const res = await axios.post('http://localhost:8000/api/agents/orchestrate', payload);
      const data = res.data;
      
      setResult({
        decision: data.final_decision.charAt(0) + data.final_decision.slice(1).toLowerCase(), // Normalize: BLOCK -> Block
        risk_score: data.risk_score,
        trust_score: data.trust_score,
        explanation: data.explanation,
        agents_involved: data.agents.map(a => a.name),
        latency: data.total_time_ms
      });
    } catch (err) {
      console.error(err);
      setResult({
        decision: "Error", 
        risk_score: 0, 
        trust_score: 0, 
        explanation: "Failed to connect to HyberShield Backend. Ensure FastAPI is running on port 8000.", 
        agents_involved: ["ConnectivityAgent"]
      });
    }
    setLoading(false);
  };

  return (
    <section className="section" style={{ padding: '100px 0' }} id="simulation">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="badge">Interactive Demo</div>
          <h2 style={{ fontSize: '3rem', marginTop: '1rem' }} className="glow-text">Fraud Simulation</h2>
          <p className="subtitle">Stress test our 3-layer system with custom attack scenarios using live agents.</p>
        </div>

        <div className="grid grid-2" style={{ gap: '3rem' }}>
          {/* Input Panel */}
          <div className="glass" style={{ padding: '2.5rem' }}>
            <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={24} color="var(--primary)" /> Scenario Controls
            </h3>
            
            <div style={styles.controlGrid}>
              <div style={styles.inputGroup}>
                <label>Transaction Amount (₹)</label>
                <input 
                  type="number" 
                  value={params.amount}
                  onChange={e => setParams({...params, amount: Number(e.target.value)})}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label>Strategy Profile</label>
                <select 
                  value={params.profile}
                  onChange={e => setParams({...params, profile: e.target.value})}
                  style={styles.input}
                >
                  <option>Balanced</option>
                  <option>Aggressive</option>
                  <option>Conservative</option>
                </select>
              </div>

              <ToggleItem 
                label="VeraShield: Ghost Hit" 
                active={params.ghost_hit} 
                onClick={() => setParams({...params, ghost_hit: !params.ghost_hit})} 
                icon={<Search size={16} />}
              />
              <ToggleItem 
                label="Location Mismatch" 
                active={params.location_mismatch} 
                onClick={() => setParams({...params, location_mismatch: !params.location_mismatch})} 
                icon={<MapPinIcon />}
              />
              <ToggleItem 
                label="New Device Anomaly" 
                active={params.device_change} 
                onClick={() => setParams({...params, device_change: !params.device_change})} 
                icon={<Shield size={16} />}
              />
              <ToggleItem 
                label="Elderly User (65+)" 
                active={params.is_elderly} 
                onClick={() => setParams({...params, is_elderly: !params.is_elderly})} 
                icon={<Heart size={16} />}
              />
              <ToggleItem 
                label="Voice Deepfake Detection" 
                active={params.voice_deepfake} 
                onClick={() => setParams({...params, voice_deepfake: !params.voice_deepfake})} 
                icon={<Activity size={16} />}
              />
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '2rem', height: '60px', fontSize: '1.2rem' }}
              onClick={runSim}
              disabled={loading}
            >
              {loading ? "Analyzing..." : <>Run Simulation <Play /></>}
            </button>
          </div>

          {/* Output Panel */}
          <div className="glass" style={{ padding: '2.5rem', background: 'rgba(5,5,15,0.6)', position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div className="badge" style={{ color: getDecisionColor(result.decision), borderColor: getDecisionColor(result.decision) }}>
                         {result.decision} Issued
                      </div>
                      <h3 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>
                        {result.decision === 'Allow' ? <CheckCircle color="var(--success)" /> : <AlertOctagon color="var(--danger)" />} 
                        {result.decision}
                      </h3>
                      {result.latency && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginTop: '4px' }}>
                          ⚡ Decision in {result.latency}ms
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Risk Score</div>
                       <div style={{ fontSize: '2.5rem', fontWeight: 900, color: getDecisionColor(result.decision) }}>{result.risk_score}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                       <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Trust Level</span>
                       <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>{result.trust_score}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${result.trust_score}%` }}
                         style={{ 
                            height: '100%', 
                            background: result.trust_score < 30 ? 'var(--danger)' : 'var(--primary)', 
                            borderRadius: '10px' 
                         }} 
                       />
                    </div>
                  </div>

                  <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Info size={16} color="var(--primary)" /> Explainable AI Reasoning
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{result.explanation}</p>
                  </div>

                  <div style={{ marginTop: '2rem' }}>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Agents Involved in Decision</h4>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {result.agents_involved.map(agent => (
                        <span key={agent} className="badge" style={{ textTransform: 'none', background: 'rgba(112,0,255,0.05)', borderColor: 'rgba(112,0,255,0.2)', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>{agent}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div key="placeholder" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-dim)' }}>
                  <RotateCcw size={48} className="pulse" style={{ marginBottom: '1rem' }} />
                  <p>Configure parameters and <br /> click 'Run Simulation' to see AI logic in action.</p>
                </div>
              )}
            </AnimatePresence>
            
            {loading && (
              <div style={styles.loaderCover}>
                <div className="pulse" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(var(--primary), var(--secondary))' }} />
                <p style={{ marginTop: '1rem', fontWeight: 800 }}>ORCHESTRATING AGENTS...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const ToggleItem = ({ label, active, onClick, icon }) => (
  <div 
    onClick={onClick}
    style={{ 
      padding: '12px 16px', 
      borderRadius: '12px', 
      border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
      background: active ? 'rgba(0,242,255,0.05)' : 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.2s ease'
    }}
  >
    <span style={{ color: active ? 'var(--primary)' : 'var(--text-dim)' }}>{icon}</span>
    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: active ? '#fff' : 'var(--text-dim)' }}>{label}</span>
  </div>
);

const MapPinIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
);

const getDecisionColor = (decision) => {
  switch(decision) {
    case 'Allow': return 'var(--success)';
    case 'Block': return 'var(--danger)';
    case 'OTP': return 'var(--warning)';
    case 'Hold': return 'var(--accent)';
    default: return 'var(--primary)';
  }
};

const styles = {
  controlGrid: {
    display: 'grid',
    gap: '12px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '10px'
  },
  input: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--border)',
    padding: '12px',
    borderRadius: '10px',
    color: '#fff',
    outline: 'none'
  },
  loaderCover: {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(5,5,15,0.9)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default Simulation;
