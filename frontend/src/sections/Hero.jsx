import React, { Suspense } from 'react';
import { ArrowRight, Shield, Zap } from 'lucide-react';
import ClickSpark from '../components/animations/ClickSpark';

// Lazy-load the heavy Three.js background so it never blocks render
const Hyperspeed = React.lazy(() =>
  import('../components/animations/Hyperspeed')
);

const Hero = ({ onStart, onExplore }) => {
  return (
    <section className="section" style={styles.hero}>
      {/* ── Hyperspeed warp-speed background ── */}
      <div style={styles.canvas}>
        <Suspense fallback={null}>
          <Hyperspeed speed={0.8} />
        </Suspense>
      </div>

      {/* ── Radial glow backdrop ── */}
      <div style={styles.bgGlow} />

      {/* ── Hero Content ── */}
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={styles.content}>
          <div className="badge animate-shimmer">
            <Shield size={14} /> Next-Gen UPI Security
          </div>

          <h1
            style={{
              fontSize: 'clamp(3.2rem, 8vw, 5.5rem)',
              marginTop: '1.5rem',
              lineHeight: 1.08,
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: '#fff',
            }}
          >
            HyberShield AI
          </h1>

          <h2
            className="glow-text"
            style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', marginBottom: '2rem' }}
          >
            Proactive. Contextual. Human-Centric.
          </h2>

          <p
            className="subtitle"
            style={{ maxWidth: '780px', margin: '0 auto 3rem auto', fontSize: '1.15rem' }}
          >
            The world's first 3-layer AI fraud prevention platform for India's UPI ecosystem.
            Stop fraud before it reaches users — and intelligently block it if it does.
          </p>

          {/* CTA Buttons wrapped in ClickSpark */}
          <div style={styles.actions}>
            <ClickSpark sparkColor="#00f2ff" sparkCount={10} sparkRadius={36}>
              <button className="btn-primary" onClick={onStart} style={{ fontSize: '1rem', padding: '14px 32px' }}>
                Launch Live Simulation <ArrowRight size={20} />
              </button>
            </ClickSpark>

            <ClickSpark sparkColor="#7000ff" sparkCount={10} sparkRadius={36}>
              <button className="btn-outline" onClick={onExplore} style={{ fontSize: '1rem', padding: '14px 32px' }}>
                Explore Architecture <Zap size={20} />
              </button>
            </ClickSpark>
          </div>

          {/* ── KPI Cards ── */}
          <div className="grid grid-4" style={{ marginTop: '5rem', width: '100%' }}>
            <KPI value="40% ↓" label="Fraud Loss reduction" color="var(--primary)" />
            <KPI value="75% ↑" label="Analyst Efficiency" color="#7000ff" />
            <KPI value="12% ↓" label="False Positive Rate" color="var(--success)" />
            <KPI value="<250ms" label="Decision Latency" color="var(--warning)" />
          </div>
        </div>
      </div>
    </section>
  );
};

const KPI = ({ value, label, color }) => (
  <div
    className="glass"
    style={{
      padding: '1.75rem 1.5rem',
      textAlign: 'center',
      borderTop: `2px solid ${color}`,
      transition: 'all 0.35s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.boxShadow = `0 16px 40px -8px ${color}40`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '';
    }}
  >
    <div style={{ fontSize: '2.2rem', fontWeight: 900, color }}>{value}</div>
    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.4rem' }}>
      {label}
    </div>
  </div>
);

const styles = {
  hero: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '120px 0 80px',
    position: 'relative',
    overflow: 'hidden',
  },
  canvas: {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
  },
  bgGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '120%',
    height: '120%',
    background:
      'radial-gradient(ellipse at 50% 50%, rgba(0, 242, 255, 0.07) 0%, rgba(112, 0, 255, 0.05) 40%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  actions: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
};

export default Hero;
