import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, AlertTriangle, ShieldX, Clock, 
  Smartphone, MapPin, IndianRupee, User, Users,
  Network, Fingerprint, Activity, Terminal, BrainCircuit,
  AlertCircle, CheckCircle, Info, ChevronRight, Lock, ArrowRight
} from 'lucide-react';
import MultiAgentView from './MultiAgentView';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('sim'); // 'sim', 'vera', 'fraud', 'elder', 'agents'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // Simulation State
  const [simForm, setSimForm] = useState({
    amount: 5000,
    is_elderly: false,
    location_mismatch: false,
    device_change: false,
    ghost_hit: false,
    voice_deepfake: false,
    profile: "Balanced"
  });

  const runSimulation = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('http://localhost:8000/api/simulate-transaction', simForm);
      setResult(res.data);
    } catch (err) {
      console.warn("Backend not reached, using frontend simulation fallback.");
      // Frontend Fallback Logic
      setTimeout(() => {
        let score = 0;
        const signals = [];
        const now = new Date().toISOString();
        const agents = ["Decision Engine Agent", "RiskEngine Agent"];

        const multipliers = { Aggressive: 1.5, Balanced: 1.0, Conservative: 0.7 };
        const w = multipliers[simForm.profile] || 1.0;

        if (simForm.ghost_hit) {
          score += 45 * w;
          agents.push("GhostNet Agent", "FingerprintCapture Agent", "BlastRadius Agent");
          signals.push({ agent: "GhostNet Agent", status: "CRITICAL", message: `Interaction with ghost account detected (Weight: ${w}x)`, timestamp: now });
        }
        if (simForm.amount > 50000) {
          score += 20 * w;
          signals.push({ agent: "RiskEngine Agent", status: "WARNING", message: `High value transaction: ₹${simForm.amount}`, timestamp: now });
        }
        if (simForm.location_mismatch) {
          score += 25 * w;
          signals.push({ agent: "RiskEngine Agent", status: "WARNING", message: "Location mismatch detected", timestamp: now });
        }
        if (simForm.device_change) {
          score += 20 * w;
          signals.push({ agent: "RiskEngine Agent", status: "WARNING", message: "New device ID detected", timestamp: now });
        }
        if (simForm.voice_deepfake) {
          score += 30 * w;
          agents.push("VoiceGuard Agent");
          signals.push({ agent: "VoiceGuard Agent", status: "CRITICAL", message: "Synthetic voice patterns detected", timestamp: now });
        }

        const risk_score = Math.min(Math.round(score), 100);
        
        const thresholds = {
          Aggressive: { Block: 60, OTP: 40, Alert: 20 },
          Balanced: { Block: 80, OTP: 60, Alert: 35 },
          Conservative: { Block: 95, OTP: 80, Alert: 60 }
        };
        const t = thresholds[simForm.profile] || thresholds.Balanced;

        let decision = "Allow";
        if (risk_score >= t.Block) decision = "Block";
        else if (risk_score >= t.OTP) decision = "OTP";
        else if (risk_score >= t.Alert) decision = "Alert";

        if (simForm.is_elderly && (decision === "Allow" || decision === "Alert") && simForm.amount > 10000) {
          decision = "Hold";
          agents.push("ElderShield Agent");
          signals.push({ agent: "ElderShield Agent", status: "HOLD", message: "ElderShield: 30-min cooling period for high-value transfer", timestamp: now });
        }

        setResult({
          risk_score,
          trust_score: Math.max(0, Math.min(100, 100 - (risk_score / 2) - (simForm.profile === 'Aggressive' ? 10 : 0))),
          decision,
          explanation: `Strategy: ${simForm.profile}. Transaction analyzed with dynamic thresholds.`,
          agents_involved: [...new Set(agents)],
          signals
        });
        setLoading(false);
      }, 800);
      return;
    }
    setLoading(false);
  };

  return (
    <div className="section" style={{ maxWidth: '1400px' }}>
      <div style={styles.tabBar}>
        <TabButton icon={<Activity />} label="Simulation Lab" id="sim" activeTab={activeTab} onClick={setActiveTab} />
        <TabButton icon={<Network />} label="VeraShield Console" id="vera" activeTab={activeTab} onClick={setActiveTab} />
        <TabButton icon={<ShieldCheck />} label="FraudShield Hub" id="fraud" activeTab={activeTab} onClick={setActiveTab} />
        <TabButton icon={<User />} label="ElderShield Safety" id="elder" activeTab={activeTab} onClick={setActiveTab} />
        <TabButton icon={<BrainCircuit />} label="Multi-Agent Brain" id="agents" activeTab={activeTab} onClick={setActiveTab} />
      </div>

      <div style={{ marginTop: '30px' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'sim' && <SimulationView simForm={simForm} setSimForm={setSimForm} runSimulation={runSimulation} loading={loading} result={result} />}
          {activeTab === 'vera' && <VeraShieldView />}
          {activeTab === 'fraud' && <FraudShieldView />}
          {activeTab === 'elder' && <ElderShieldView />}
          {activeTab === 'agents' && <MultiAgentView />}
        </AnimatePresence>
      </div>
    </div>
  );
};

const TabButton = ({ icon, label, id, activeTab, onClick }) => (
    <button 
      className={activeTab === id ? 'btn-primary' : ''} 
      style={activeTab === id ? {} : styles.tabBtn}
      onClick={() => onClick(id)}
    >
      {icon} {label}
    </button>
);

const SimulationView = ({ simForm, setSimForm, runSimulation, loading, result }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-2">
        {/* Simulation Controls */}
        <div className="glass card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Transaction Parameters</h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800 }}>MOCK MIDDLEWARE ACTIVE</span>
          </div>
          <div style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Risk Strategy (Weight Profile)</label>
              <div style={styles.selector}>
                {['Conservative', 'Balanced', 'Aggressive'].map(p => (
                  <button 
                    key={p}
                    onClick={() => setSimForm({...simForm, profile: p})}
                    style={{
                      ...styles.selectorBtn,
                      background: simForm.profile === p ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                      color: simForm.profile === p ? 'black' : 'white',
                      borderColor: simForm.profile === p ? 'var(--primary)' : 'var(--border)'
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Amount (₹)</label>
              <input 
                type="number" 
                value={simForm.amount} 
                onChange={e => setSimForm({...simForm, amount: parseFloat(e.target.value)})}
                style={styles.input}
              />
            </div>
            
            <div style={styles.toggleRow}>
              <ToggleItem label="Elderly User (60+)" checked={simForm.is_elderly} onChange={val => setSimForm({...simForm, is_elderly: val})} />
              <ToggleItem label="Location Mismatch" checked={simForm.location_mismatch} onChange={val => setSimForm({...simForm, location_mismatch: val})} />
            </div>

            <div style={styles.toggleRow}>
              <ToggleItem label="New Device detected" checked={simForm.device_change} onChange={val => setSimForm({...simForm, device_change: val})} />
              <ToggleItem label="Ghost Account Probed" checked={simForm.ghost_hit} onChange={val => setSimForm({...simForm, ghost_hit: val})} />
            </div>

            <div style={styles.toggleItem}>
                <ToggleItem label="Deepfake Voice Suspected (KYC Phase)" checked={simForm.voice_deepfake} onChange={val => setSimForm({...simForm, voice_deepfake: val})} />
            </div>

            <button 
              className="btn-primary" 
              onClick={runSimulation} 
              disabled={loading}
              style={{ width: '100%', marginTop: '20px', height: '50px', fontSize: '1rem' }}
            >
              {loading ? 'Analyzing Transactions...' : 'Run Fraud Analysis'}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div>
          {result ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass card">
              <div style={styles.resultHeader}>
                <div style={{ ...styles.scoreCircle, borderColor: getDecisionColor(result.decision) }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800 }}>RISK SCORE</span>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: getDecisionColor(result.decision) }}>{result.risk_score}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontSize: '2rem', color: getDecisionColor(result.decision), fontWeight: 900 }}>{result.decision.toUpperCase()}</h2>
                    {result.decision === 'Block' && <ShieldX color="var(--danger)" size={32} />}
                    {result.decision === 'Allow' && <ShieldCheck color="var(--success)" size={32} />}
                  </div>
                  <p style={{ color: 'var(--text)', fontSize: '1rem', marginTop: '5px', fontWeight: 600 }}>{result.explanation}</p>
                </div>
              </div>

              {result.decision === 'Hold' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ 
                    marginTop: '20px', 
                    padding: '15px', 
                    background: 'rgba(57, 107, 255, 0.1)', 
                    border: '1px solid var(--primary)', 
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                  }}
                >
                  <div className="pulse" style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%' }}></div>
                  <div>
                    <strong style={{ color: 'var(--primary)', display: 'block' }}>ElderShield Safety Active</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Reason: High-value transaction for vulnerable profile. Family alert sent via SMS.</span>
                  </div>
                </motion.div>
              )}

              <div style={{ marginTop: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h4 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BrainCircuit size={18} color="var(--primary)" /> Agent Decision Logic
                    </h4>
                    <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>ORCHESTRATION: LANGGRAPH</span>
                </div>
                <div style={styles.signalList}>
                  {result.signals.map((s, i) => (
                    <div key={i} style={styles.signalItem}>
                      <div style={{ ...styles.signalStatus, background: getStatusColor(s.status), boxShadow: `0 0 10px ${getStatusColor(s.status)}` }}></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{s.agent}</span>
                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{new Date(s.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>{s.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={styles.trustFooter}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Lock size={14} color="var(--primary)" />
                        <span>Behavioral Trust: <strong>{result.trust_score}/100</strong></span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', flex: 1, borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${result.trust_score}%`, height: '100%', background: 'var(--primary)' }}></div>
                    </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="glass card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.5 }}>
                <Terminal size={64} style={{ marginBottom: '20px' }} />
                <h3>Awaiting Simulation...</h3>
                <p>Select parameters on the left and run analysis to see the <br /> multi-agent decision engine in action.</p>
            </div>
          )}
        </div>
    </motion.div>
);

const ToggleItem = ({ label, checked, onChange }) => (
    <div style={styles.toggleItem} onClick={() => onChange(!checked)}>
        <div style={{ ...styles.checkbox, background: checked ? 'var(--primary)' : 'rgba(0,0,0,0.3)', border: checked ? 'none' : '1px solid var(--border)' }}>
            {checked && <CheckCircle size={16} color="black" />}
        </div>
        <span>{label}</span>
    </div>
);

const VeraShieldView = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="grid grid-2">
        <div className="glass card">
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
                <Network color="var(--primary)" />
                <h3>Ghost Transaction Fabric</h3>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '25px' }}>50 synthetic accounts embedded in the UPI namespace. No QR, no public ID. Only automated bots can find them.</p>
            
            <div className="grid grid-3" style={{ gap: '10px', marginBottom: '25px' }}>
                <MiniStat label="Active Decoys" value="50" />
                <MiniStat label="Hits (24h)" value="12" color="var(--warning)" />
                <MiniStat label="Unique IPs" value="8" />
            </div>

            <div style={styles.console}>
                <div style={{ color: 'var(--primary)', marginBottom: '5px' }}>[SYSTEM] GHOST_NET_LISTENER ACTIVE</div>
                <div style={styles.consoleMsg}><ChevronRight size={14} /> 09:12:01 - Hit detected: <span style={{ color: 'var(--warning)' }}>user047@okaxis</span></div>
                <div style={styles.consoleMsg}><ChevronRight size={14} /> 09:12:01 - Capturing Device Fingerprint...</div>
                <div style={styles.consoleMsg}><ChevronRight size={14} /> 09:12:02 - Scan speed: <span style={{ color: 'var(--danger)' }}>45 calls/sec</span> (Bot Confirmed)</div>
                <div style={styles.consoleMsg}><ChevronRight size={14} /> 09:12:03 - BlastRadius: Protected 1,402 accounts matching victim profile.</div>
            </div>
        </div>
        <div className="glass card">
            <h3>Attacker Intelligence Map</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '20px' }}>Geospatial origin of reconnaissance activity.</p>
            <div style={styles.mapContainer}>
                <div style={{ ...styles.mapDot, top: '40%', left: '30%', boxShadow: '0 0 15px var(--danger)' }}></div>
                <div style={{ ...styles.mapDot, top: '60%', left: '70%', background: 'var(--warning)', boxShadow: '0 0 15px var(--warning)' }}></div>
                <MapPin size={40} color="var(--danger)" style={{ opacity: 0.3 }} />
                <div style={styles.mapOverlay}>
                    <div style={{ fontSize: '0.8rem' }}><AlertCircle size={14} color="var(--danger)" /> Recon Cluster: Chennai Region</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Avg Scan Velocity: 120 calls/min</div>
                </div>
            </div>
        </div>
    </motion.div>
);

const FraudShieldView = () => (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3>Transaction Defense Stream</h3>
            <div style={styles.badge}>Live Feed - 218ms Avg Latency</div>
        </div>
        <table style={styles.table}>
            <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                    <th style={{ padding: '15px' }}>TXN ID</th>
                    <th>User Profile</th>
                    <th>Amount</th>
                    <th>Location</th>
                    <th>Risk</th>
                    <th>Decision</th>
                </tr>
            </thead>
            <tbody>
                <TableRow id="TXN-3421" user="A. Sharma" amt="₹12,400" loc="Mumbai" risk={12} decision="Allow" />
                <TableRow id="TXN-3422" user="M. Reddy" amt="₹45,000" loc="Chennai" risk={68} decision="OTP" />
                <TableRow id="TXN-3423" user="P. Gupta" amt="₹8,000" loc="Delhi (VPN)" risk={92} decision="Block" />
                <TableRow id="TXN-3424" user="S. Varma" amt="₹150,000" loc="Unknown" risk={75} decision="OTP" />
            </tbody>
        </table>
    </motion.div>
);

const TableRow = ({ id, user, amt, loc, risk, decision }) => (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
        <td style={{ padding: '15px', fontFamily: 'monospace' }}>{id}</td>
        <td>{user}</td>
        <td>{amt}</td>
        <td><div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} /> {loc}</div></td>
        <td><div style={{ ...styles.riskBadge, background: risk > 70 ? 'var(--danger)' : risk > 30 ? 'var(--warning)' : 'var(--success)' }}>{risk}</div></td>
        <td><DecisionBadge decision={decision} /></td>
    </tr>
);

const DecisionBadge = ({ decision }) => {
    const color = getDecisionColor(decision);
    return (
        <span style={{ 
            color, 
            background: `${color}15`, 
            padding: '4px 10px', 
            borderRadius: '4px', 
            fontSize: '0.75rem', 
            fontWeight: 800,
            border: `1px solid ${color}30`
        }}>
            {decision.toUpperCase()}
        </span>
    );
};

const ElderShieldView = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-2">
        <div className="glass card" style={{ padding: '40px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '30px' }}>
                <Users color="var(--success)" size={32} />
                <div>
                   <h3>Social Engineering Defense</h3>
                   <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 800 }}>PROTECTING 4,200+ ELDERLY ACCOUNTS</span>
                </div>
            </div>
            
            <div style={styles.elderFeature}>
                <Clock color="var(--warning)" size={32} />
                <div>
                    <h4>30-Min Cooling Period</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>Large transfers to new recipients are held temporarily. Gives the user time to rethink and family time to intervene.</p>
                </div>
            </div>

            <div style={styles.elderFeature}>
                <AlertCircle color="var(--primary)" size={32} />
                <div>
                    <h4>Family Bridge (Twilio)</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>Automated SMS alerts to trusted circle. "Stop" reply from family instantly cancels risky transfers.</p>
                </div>
            </div>

            <div style={{ marginTop: '30px', background: 'rgba(0, 255, 136, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid var(--success)' }}>
                <h4 style={{ color: 'var(--success)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={18} /> Social Impact
                </h4>
                <p style={{ fontSize: '0.8rem' }}>Reduces elderly fraud victimization by 68% by introducing meaningful friction during coercive scam cycles.</p>
            </div>
        </div>

        <div className="glass card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
                <h3>Semantic UI Override</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Clarity-first interface for vulnerable accounts.</p>
            </div>
            <div style={styles.phoneFrame}>
                <div style={styles.phoneHeader}>
                    <ShieldCheck size={20} color="var(--success)" />
                    <span>ElderShield SafePay</span>
                </div>
                <div style={styles.phoneBody}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Are you GIVING or GETTING money?</h2>
                    <div style={styles.elderBtn}>
                        <ArrowRight color="var(--danger)" />
                        <div>
                            <div style={{ fontWeight: 800 }}>I am paying someone</div>
                            <div style={{ fontSize: '0.6rem' }}>Money will leave my account</div>
                        </div>
                    </div>
                    <div style={{ ...styles.elderBtn, border: '1px solid var(--success)50' }}>
                        <ArrowRight color="var(--success)" style={{ transform: 'rotate(180deg)' }} />
                        <div>
                            <div style={{ fontWeight: 800 }}>I am receiving money</div>
                            <div style={{ fontSize: '0.6rem' }}>You NEVER scan or use PIN to get money</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

const MiniStat = ({ label, value, color }) => (
    <div style={{ ...styles.miniStat, borderBottom: `2px solid ${color || 'var(--border)'}` }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{label}</span>
        <strong style={{ fontSize: '1.2rem', color: color || 'white' }}>{value}</strong>
    </div>
);

const getDecisionColor = (dec) => {
    switch(dec) {
        case 'Allow': return 'var(--success)';
        case 'Alert': return 'var(--warning)';
        case 'OTP': return 'var(--warning)';
        case 'Block': return 'var(--danger)';
        case 'Hold': return 'var(--primary)';
        default: return 'var(--text)';
    }
}

const getStatusColor = (status) => {
    switch(status) {
        case 'CRITICAL': return 'var(--danger)';
        case 'WARNING': return 'var(--warning)';
        case 'HOLD': return 'var(--primary)';
        case 'INFO': return 'var(--primary-glow)';
        default: return 'var(--border)';
    }
}

const styles = {
  selector: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px'
  },
  selectorBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: 800,
    border: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  tabBar: {
    display: 'flex',
    gap: '10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border)',
    padding: '8px',
    borderRadius: '16px',
    overflowX: 'auto'
  },
  tabBtn: {
    background: 'transparent',
    color: 'var(--text-dim)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid transparent',
    padding: '10px 18px',
    fontSize: '0.9rem',
    borderRadius: '12px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  label: {
      fontSize: '0.8rem',
      fontWeight: 800,
      color: 'var(--text-dim)',
      textTransform: 'uppercase'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  input: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    padding: '14px',
    borderRadius: '10px',
    outline: 'none',
    fontSize: '1.1rem',
    fontWeight: 600
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px'
  },
  toggleItem: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.9rem',
    color: 'var(--text)',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.03)',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--border)'
  },
  checkbox: {
      width: '20px',
      height: '20px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    paddingBottom: '30px',
    borderBottom: '1px solid var(--border)'
  },
  scoreCircle: {
      width: '110px',
      height: '110px',
      borderRadius: '50%',
      border: '6px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.3)',
      flexShrink: 0,
      boxShadow: '0 0 20px rgba(0,0,0,0.5)'
  },
  signalList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
  },
  signalItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '14px',
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '10px',
      border: '1px solid rgba(255,255,255,0.05)'
  },
  signalStatus: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
  },
  trustFooter: {
      marginTop: '25px',
      padding: '15px',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      fontSize: '0.8rem'
  },
  miniStat: {
      padding: '15px',
      background: 'rgba(0,0,0,0.2)',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
  },
  console: {
      background: '#04040a',
      padding: '20px',
      borderRadius: '12px',
      fontFamily: 'monospace',
      fontSize: '0.85rem',
      border: '1px solid var(--border)',
      minHeight: '150px'
  },
  consoleMsg: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '8px',
      color: 'rgba(255,255,255,0.6)'
  },
  mapContainer: {
      height: '300px',
      background: 'radial-gradient(circle, rgba(112,0,255,0.1) 0%, transparent 70%)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      border: '1px solid var(--border)',
      overflow: 'hidden'
  },
  mapDot: {
      position: 'absolute',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: 'var(--danger)'
  },
  mapOverlay: {
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      padding: '15px',
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(5px)',
      borderRadius: '10px',
      border: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
  },
  table: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left'
  },
  riskBadge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: 800,
      width: 'fit-content'
  },
  badge: {
    padding: '6px 14px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    fontSize: '0.75rem',
    color: 'var(--primary)',
    fontWeight: '700'
  },
  elderFeature: {
      display: 'flex',
      gap: '20px',
      alignItems: 'flex-start',
      marginBottom: '30px'
  },
  phoneFrame: {
      width: '300px',
      height: '550px',
      background: 'var(--bg)',
      margin: '20px auto',
      borderRadius: '30px',
      border: '10px solid #1a1a2e',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
  },
  phoneHeader: {
      padding: '20px',
      background: 'rgba(255,255,255,0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '0.8rem',
      fontWeight: 800
  },
  phoneBody: {
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
  },
  elderBtn: {
      padding: '20px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      cursor: 'pointer'
  }
};

export default Dashboard;
