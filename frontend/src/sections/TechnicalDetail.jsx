import React from 'react';
import { Brain, Network, Database, Server, Cpu, ChevronRight } from 'lucide-react';
import MagicBento, { MagicBentoCard } from '../components/animations/MagicBento';

const agents = [
  { name: 'GhostNet',     role: 'Decoy Hunter',  desc: 'Manages decoy accounts to catch reconnaissance scanning BEFORE the attack.', color: '#00ff88', glow: 'rgba(0,255,136,0.12)', border: 'rgba(0,255,136,0.35)' },
  { name: 'Fingerprint',  role: 'Profiler',      desc: 'Builds unique attacker identifiers using hardware and behavioral markers.', color: 'var(--primary)', glow: 'rgba(0,242,255,0.12)', border: 'rgba(0,242,255,0.35)' },
  { name: 'BlastRadius',  role: 'Predictor',     desc: 'Predicts potential victims by analyzing attacker scan patterns patterns.', color: '#7000ff', glow: 'rgba(112,0,255,0.12)', border: 'rgba(112,0,255,0.35)' },
  { name: 'ReconSignal',  role: 'Sentinel',      desc: 'Detects "low and slow" scanning signals that evade standard filters.', color: '#ffaa00', glow: 'rgba(255,170,0,0.12)', border: 'rgba(255,170,0,0.35)' },
  { name: 'RiskEngine',   role: 'Brain',         desc: 'Central decision aggregator using a weighted multi-factor scoring formula.', color: 'var(--secondary)', glow: 'rgba(112,0,255,0.12)', border: 'rgba(112,0,255,0.38)' },
  { name: 'ElderShield',  role: 'Guardian',      desc: 'Protects elderly users from coercion scams via nudge-logic and safety holds.', color: 'var(--accent)', glow: 'rgba(255,0,200,0.12)', border: 'rgba(255,0,200,0.35)' },
  { name: 'VoiceGuard',   role: 'Deepfake Det.', desc: 'Analyzes spectral artifacts to identify AI-generated or synthetic voices.', color: '#F24E5E', glow: 'rgba(242,78,94,0.12)', border: 'rgba(242,78,94,0.35)' },
];

const techStack = [
  { icon: <Cpu size={20} />,      title: 'Processing',   desc: 'Python FastAPI / Go' },
  { icon: <Database size={20} />, title: 'Storage',      desc: 'Neo4j + MongoDB' },
  { icon: <Server size={20} />,   title: 'Cloud',        desc: 'AWS Lambda / SageMaker' },
  { icon: <Network size={20} />,  title: 'Orchestrator', desc: 'Native Multi-Agent Bus' },
];

export const MultiAgentView = () => (
  <section className="section" style={{ padding: '120px 0', background: 'rgba(5,5,20,0.5)' }}>
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '72px' }}>
        <div className="badge">AI Intelligence</div>
        <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', marginTop: '1rem' }} className="glow-text">
          Multi-Agent Orchestration
        </h2>
        <p className="subtitle" style={{ marginTop: '1rem' }}>
          6 specialized internal agents collaborating in real-time under a unified orchestrator.
        </p>
      </div>

      <MagicBento columns={3} gap="1.5rem">
        {agents.map((a) => (
          <MagicBentoCard key={a.name} glowColor={a.glow} borderColor={a.border}>
            <div style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '42px', height: '42px',
                  background: `${a.color}20`,
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: a.color, marginBottom: '1.25rem',
                }}
              >
                <Brain size={20} />
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: a.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                {a.role}
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '10px' }}>{a.name}</h4>
              <p style={{ fontSize: '0.87rem', color: 'var(--text-dim)', lineHeight: 1.65 }}>{a.desc}</p>
            </div>
          </MagicBentoCard>
        ))}
      </MagicBento>
    </div>
  </section>
);

const STEPS = [
  { label: 'Ingress',     time: '8ms',  task: 'API Auth',    color: 'var(--text-dim)' },
  { label: 'VeraShield',  time: '42ms', task: 'Pre-flight',   color: 'var(--primary)' },
  { label: 'FraudShield', time: '115ms',task: 'ML Scoring',   color: 'var(--secondary)' },
  { label: 'ElderShield', time: '25ms', task: 'Contextual',  color: 'var(--accent)' },
  { label: 'Database',    time: '15ms', task: 'Neo4j Graph',  color: '#ffaa00' },
  { label: 'Egress',      time: '12ms', task: 'Decision',    color: '#00ff88' },
];

export const PipelineView = () => (
  <section className="section" style={{ padding: '120px 0' }}>
    <div className="container" style={{ textAlign: 'center' }}>
      <div className="badge">Performance</div>
      <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', marginTop: '1rem' }} className="glow-text">
        The sub-250ms Decision Cycle
      </h2>

      <div className="glass" style={{ padding: '4rem 2rem', marginTop: '4rem', overflowX: 'auto' }}>
        {/* Timeline bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', minWidth: '800px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '49px', left: '40px', right: '40px', height: '2px', background: 'var(--border)', zIndex: 0 }} />
          {STEPS.map((s, i) => (
            <div key={i} style={{ position: 'relative', zIndex: 1, width: '120px' }}>
              <div
                style={{
                  width: '100px', height: '100px', borderRadius: '50%',
                  background: 'var(--bg)',
                  border: `2px solid ${s.color}`,
                  margin: '0 auto',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 24px ${s.color}50`,
                  transition: 'transform 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <span style={{ fontWeight: 900, color: s.color, fontSize: '1rem' }}>{s.time}</span>
              </div>
              <div style={{ marginTop: '1.5rem', fontWeight: 800, fontSize: '0.9rem' }}>{s.label}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>{s.task}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '4rem', color: 'var(--success)', fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
          ✓ Total Latency: <span style={{ color: 'var(--primary)' }}>217ms</span>
        </div>
      </div>
    </div>
  </section>
);

export const Architecture = () => (
  <section className="section" style={{ padding: '120px 0' }} id="architecture">
    <div className="container">
      <div className="grid grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
        <div>
          <div className="badge">System Flow</div>
          <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', marginTop: '1rem' }} className="glow-text">
            Cloud Architecture
          </h2>
          <p className="subtitle" style={{ textAlign: 'left', marginLeft: 0, marginTop: '1rem', marginBottom: '2rem' }}>
            Built for infinite scale and zero-downtime banking operations.
          </p>

          <MagicBento columns={2} gap="1rem">
            {techStack.map((t) => (
              <MagicBentoCard key={t.title} glowColor="rgba(0,242,255,0.1)" borderColor="rgba(0,242,255,0.25)">
                <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ color: 'var(--primary)', marginBottom: '10px' }}>{t.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{t.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>{t.desc}</div>
                </div>
              </MagicBentoCard>
            ))}
          </MagicBento>
        </div>

        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <h4 style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>Middleware Integration</h4>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <Node title="User App" />
            <ChevronRight color="var(--primary)" />
            <Node title="HyberShield" primary />
            <ChevronRight color="var(--primary)" />
            <Node title="Core Bank" />
          </div>
          <p style={{ marginTop: '3rem', fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.7 }}>
            Simple API interceptor integration. No changes required to core banking transaction logic.
            Deploy in under 2 weeks via standard REST hooks.
          </p>
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,255,136,0.05)', borderRadius: '12px', border: '1px solid rgba(0,255,136,0.15)' }}>
            <span style={{ color: 'var(--success)', fontWeight: 800 }}>📋 Drop-in middleware · No core banking changes</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Node = ({ title, primary }) => (
  <div style={{
    padding: '14px 24px',
    borderRadius: '12px',
    background: primary ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--glass)',
    color: primary ? '#000' : '#fff',
    border: `1px solid ${primary ? 'var(--primary)' : 'var(--border)'}`,
    fontWeight: primary ? 900 : 600,
    fontSize: '0.9rem',
    boxShadow: primary ? '0 0 20px var(--primary-glow)' : 'none',
  }}>
    {title}
  </div>
);
