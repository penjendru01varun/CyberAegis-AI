import React from 'react';
import { Shield, Zap, Heart, Target, Users, TrendingDown } from 'lucide-react';
import MagicBento, { MagicBentoCard } from '../components/animations/MagicBento';

const LAYERS = [
  {
    name: 'VeraShield',
    label: 'Layer 1 · Pre-Attack',
    icon: <Shield size={28} />,
    color: 'var(--primary)',
    glowColor: 'rgba(0, 242, 255, 0.15)',
    borderColor: 'rgba(0, 242, 255, 0.4)',
    desc: 'Ghost accounts trap attackers during reconnaissance. We fingerprint, isolate, and predict their next target — before any real user is touched.',
    tags: ['Ghost Accounts', 'Scan Velocity', 'Blast Radius', 'Attacker Profiling'],
  },
  {
    name: 'FraudShield',
    label: 'Layer 2 · Real-Time',
    icon: <Zap size={28} />,
    color: 'var(--secondary)',
    glowColor: 'rgba(112, 0, 255, 0.15)',
    borderColor: 'rgba(112, 0, 255, 0.4)',
    desc: 'Behavioral trust scoring meets contextual risk analysis — amount anomaly, device fingerprint, location mismatch — all resolved in under 250ms.',
    tags: ['Amount Anomaly', 'Device Mismatch', 'Behavior Trust', 'Location Context'],
  },
  {
    name: 'ElderShield',
    label: 'Layer 3 · Human-Centric',
    icon: <Heart size={28} />,
    color: 'var(--accent)',
    glowColor: 'rgba(255, 0, 200, 0.15)',
    borderColor: 'rgba(255, 0, 200, 0.4)',
    desc: '30-minute transaction holds, instant family alerts, and QR scam warnings — designed for the 300M+ elderly users invisible to traditional systems.',
    tags: ['30-Min Hold', 'Family Alerts', 'QR Warnings', 'Caregiver UX'],
  },
];

const METRICS = [
  { icon: <TrendingDown size={24} />, value: '40%', label: 'Fraud Loss Reduction', color: 'var(--success)' },
  { icon: <Users size={24} />, value: '75%', label: 'Manual Review Savings', color: 'var(--primary)' },
  { icon: <Target size={24} />, value: '8%', label: 'False Positive Rate', color: 'var(--warning)' },
];

const SolutionOverview = () => {
  return (
    <section className="section" style={{ padding: '120px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <div className="badge">The Architecture</div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', marginTop: '1rem', lineHeight: 1.1 }}>
            Complete <span className="glow-text">3-Layer</span> Defense
          </h2>
          <p className="subtitle" style={{ marginTop: '1.5rem', maxWidth: '620px', margin: '1.5rem auto 0' }}>
            We don't just detect fraud. We intercept the entire attacker journey — before, during, and after the transaction attempt.
          </p>
        </div>

        {/* MagicBento: 3 layer cards */}
        <MagicBento columns={3} gap="1.5rem" style={{ marginBottom: '2rem' }}>
          {LAYERS.map((layer) => (
            <MagicBentoCard
              key={layer.name}
              glowColor={layer.glowColor}
              borderColor={layer.borderColor}
              style={{ height: '100%' }}
            >
              <div style={{ padding: '2rem' }}>
                <div style={{ color: layer.color, marginBottom: '1rem' }}>{layer.icon}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: layer.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                  {layer.label}
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1rem' }}>{layer.name}</h3>
                <p style={{ color: 'var(--text-dim)', lineHeight: 1.7, fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                  {layer.desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {layer.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        border: `1px solid ${layer.color}30`,
                        background: `${layer.color}10`,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: layer.color,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </MagicBentoCard>
          ))}
        </MagicBento>

        {/* MagicBento: metrics row */}
        <MagicBento columns={3} gap="1.5rem">
          {METRICS.map((m) => (
            <MagicBentoCard
              key={m.label}
              glowColor={`${m.color}20`}
              borderColor={`${m.color}50`}
            >
              <div
                style={{
                  padding: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                }}
              >
                <div style={{ color: m.color }}>{m.icon}</div>
                <div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 900, color: m.color, lineHeight: 1 }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.3rem' }}>
                    {m.label}
                  </div>
                </div>
              </div>
            </MagicBentoCard>
          ))}
        </MagicBento>
      </div>
    </section>
  );
};

export default SolutionOverview;
