import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Zap, Users, BarChart3, Lock, Cpu, 
  ArrowRight, CheckCircle2, Globe, TrendingUp, DollarSign
} from 'lucide-react';
import ArchitectureView from './ArchitectureView';

const LandingPage = ({ onStart }) => {
  const scrollToArchitecture = () => {
    const el = document.getElementById('architecture-section');
    if (el) {
        window.scrollTo({
            top: el.offsetTop - 80,
            behavior: 'smooth'
        });
    }
  };

  return (
    <div className="section">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={styles.hero}
      >
        <div style={styles.badge}>
          <SparkleIcon /> Trusted by 21+ Mid-Size Indian Banks
        </div>
        <h1 className="title" style={{ fontSize: '4.5rem', textAlign: 'center', lineHeight: '1.1' }}>
          Real-Time Defense <br /> For The <span className="glow-text">UPI Era</span>
        </h1>
        <p style={styles.subtitle}>
          The world's first proactive fraud prevention system. 
          Trap attackers with Ghost Entities, detect anomalies in 250ms, 
          and protect the elderly with human-centric safety nets.
        </p>
        
        <div style={styles.heroBtns}>
          <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '15px 35px' }} onClick={onStart}>
            Launch Live Demo <ArrowRight size={20} style={{ marginLeft: '8px' }} />
          </button>
          <button style={styles.btnOutline} onClick={scrollToArchitecture}>View Architecture</button>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-3" style={{ marginTop: '100px' }}>
        <StatCard icon={<ShieldCheck />} value="40%" label="Reduction in Fraud Loss" color="var(--primary)" />
        <StatCard icon={<Zap />} value="&lt;250ms" label="Decision Latency" color="var(--secondary)" />
        <StatCard icon={<TrendingUp />} value="₹26 Cr" label="Annual Value Per Bank" color="var(--success)" />
      </div>

      {/* 3-Layer Section */}
      <div style={{ marginTop: '120px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={styles.sectionTitle}>One Core. Three Shields.</h2>
          <p style={{ color: 'var(--text-dim)', maxWidth: '600px', margin: '0 auto' }}>
            A modular approach that covers the entire fraud journey—from reconnaissance to transaction approval.
          </p>
        </div>

        <div className="grid grid-3">
          <LayerCard 
            title="VeraShield" 
            tag="Proactive"
            icon={<Cpu />} 
            color="var(--primary)"
            desc="Detects scammers before they reach customers. Uses Ghost Transaction Fabric to capture attacker fingerprints during scanning phase."
          />
          <LayerCard 
            title="FraudShield AI+" 
            tag="Real-Time"
            icon={<Zap />} 
            color="var(--secondary)"
            desc="Context-aware transaction scoring. Fusion of 8 signals (Amount, Location, Device, Time) for split-second precision."
          />
          <LayerCard 
            title="ElderShield" 
            tag="Human-Centric"
            icon={<Users />} 
            color="var(--success)"
            desc="Dedicated safety for vulnerable users. AI hold triggers, family SMS alerts, and semantic 'Give vs Get' UI clarity."
          />
        </div>
      </div>

      {/* Architecture Section */}
      <ArchitectureView />

      {/* Innovation Section */}
      <div className="glass" style={styles.innovationBox}>
        <div className="grid grid-2" style={{ alignItems: 'center' }}>
          <div>
            <div style={styles.badge}>Innovation Spotlight</div>
            <h2 style={{ fontSize: '2.5rem', margin: '20px 0' }}>Why We Are Different.</h2>
            <div style={styles.featureList}>
                <FeatureItem title="Decoy Intelligence" desc="First platform to use Ghost Accounts as a primary detection signal." />
                <FeatureItem title="Multi-Agent Mesh" desc="8 specialized AI agents coordinating via a high-speed stateful graph." />
                <FeatureItem title="Social Impact" desc="Specifically solves the 'Elderly Scam' problem that rules-engines ignore." />
                <FeatureItem title="Zero Latency" desc="Built for UPI scale. Decisions happen before the money even leaves the bank." />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="glow-border" style={styles.architectureImage}>
                <div style={styles.codeLine}>[AGENT] FingerprintCapture: Device_ID logged</div>
                <div style={styles.codeLine}>[AGENT] VeraShield: Ghost Hit detected</div>
                <div style={styles.codeLine}>[AGENT] FraudShield: Score computed (92/100)</div>
                <div style={styles.codeLine}>[SYSTEM] TRANSACTION BLOCKED</div>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Section */}
      <div style={{ marginTop: '100px', textAlign: 'center' }}>
         <h2 style={styles.sectionTitle}>Economics of Security</h2>
         <div className="grid grid-3" style={{ marginTop: '40px' }}>
            <div className="glass card">
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>8%</div>
                <div style={{ color: 'var(--text-dim)' }}>False Positive Rate</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>(Reduced from 34%)</div>
            </div>
            <div className="glass card">
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>14 Mo</div>
                <div style={{ color: 'var(--text-dim)' }}>Time to Positive ROI</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Full Payback Period</div>
            </div>
            <div className="glass card">
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>50%</div>
                <div style={{ color: 'var(--text-dim)' }}>Cheaper than Legacy</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Cloud-native efficiency</div>
            </div>
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label, color }) => (
  <div className="glass card" style={{ textAlign: 'center', borderTop: `4px solid ${color}` }}>
    <div style={{ color, marginBottom: '10px' }}>{icon}</div>
    <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{value}</div>
    <div style={{ color: 'var(--text-dim)', fontWeight: 600 }}>{label}</div>
  </div>
);

const LayerCard = ({ title, tag, icon, color, desc }) => (
  <div className="glass card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px', color }}>{icon}</div>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color, border: `1px solid ${color}`, padding: '4px 8px', borderRadius: '4px' }}>{tag}</span>
    </div>
    <div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{title}</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: '1.5' }}>{desc}</p>
    </div>
  </div>
);

const FeatureItem = ({ title, desc }) => (
    <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
        <CheckCircle2 color="var(--primary)" size={24} style={{ flexShrink: 0 }} />
        <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{title}</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{desc}</div>
        </div>
    </div>
);

const SparkleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
        <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z" />
        <path d="m19 10.5 2 2" /><path d="m19 13.5 2-2" />
    </svg>
);

const styles = {
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '30px',
    padding: '40px 0'
  },
  badge: {
    padding: '10px 20px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border)',
    borderRadius: '30px',
    fontSize: '0.85rem',
    color: 'var(--primary)',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center'
  },
  subtitle: {
    fontSize: '1.3rem',
    color: 'var(--text-dim)',
    maxWidth: '850px',
    lineHeight: '1.6'
  },
  heroBtns: {
    display: 'flex',
    gap: '20px',
    marginTop: '20px'
  },
  btnOutline: {
    background: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    fontSize: '1.1rem',
    padding: '15px 35px'
  },
  sectionTitle: {
    fontSize: '2.8rem',
    fontWeight: 800,
    marginBottom: '10px'
  },
  innovationBox: {
      marginTop: '120px',
      padding: '80px 60px',
      background: 'linear-gradient(135deg, rgba(20, 20, 40, 0.8) 0%, rgba(5, 5, 16, 1) 100%)'
  },
  architectureImage: {
      width: '100%',
      maxWidth: '450px',
      height: '300px',
      background: '#0a0a1a',
      borderRadius: '20px',
      padding: '30px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: '15px',
      border: '1px solid var(--primary-glow)'
  },
  codeLine: {
      fontFamily: 'monospace',
      fontSize: '0.85rem',
      color: 'var(--text-dim)',
      paddingLeft: '20px',
      borderLeft: '2px solid rgba(255,255,255,0.1)'
  },
  featureList: {
      marginTop: '30px'
  }
};

export default LandingPage;
