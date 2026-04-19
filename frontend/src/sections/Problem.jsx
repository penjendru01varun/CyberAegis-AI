import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingUp, XCircle, Search, Users, Activity } from 'lucide-react';

const Problem = () => {
  return (
    <section className="section" style={{ padding: '100px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div className="badge">Problem Context</div>
          <h2 style={{ fontSize: '3rem', marginTop: '1rem' }} className="glow-text">The UPI Fraud Crisis</h2>
          <p className="subtitle" style={{ maxWidth: '700px', margin: '1rem auto' }}>
            As UPI transaction volume explodes, traditional reactive systems are failing to keep pace with sophisticated social engineering and automated attacks.
          </p>
        </div>

        <div className="grid grid-2" style={{ gap: '4rem' }}>
          <div className="glass" style={{ padding: '2.5rem' }}>
            <h3 style={{ color: 'var(--danger)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <XCircle /> Current System Gaps
            </h3>
            <ul style={styles.list}>
              <li><strong>Reactive Detection:</strong> Only checks for fraud after the money has left.</li>
              <li><strong>Laggy Decisions:</strong> 4–6 minute lag in traditional manual review cycles.</li>
              <li><strong>High False Positives:</strong> Legacy rules block 34% of legitimate high-value users.</li>
              <li><strong>Context Blindness:</strong> Systems don't see attacker reconnaissance patterns.</li>
            </ul>
          </div>

          <div className="glass" style={{ padding: '2.5rem' }}>
            <h3 style={{ color: 'var(--warning)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle /> Rising Attack Vectors
            </h3>
            <div className="grid grid-2" style={{ gap: '1.5rem' }}>
              <AttackType icon={<Search size={18} />} label="Reconnaissance Scan" />
              <AttackType icon={<Users size={18} />} label="Social Engineering" />
              <AttackType icon={<Activity size={18} />} label="Deepfake Voice" />
              <AttackType icon={<TrendingUp size={18} />} label="QR Phishing" />
            </div>
          </div>
        </div>

        <div className="glass" style={{ marginTop: '4rem', padding: '3rem', textAlign: 'center', border: '1px dashed var(--danger)' }}>
          <h3 style={{ fontSize: '1.8rem', color: '#ff4d4d' }}>Business Impact: ₹2,000 Cr+ lost annually in UPI app fraud.</h3>
          <p style={{ color: 'var(--text-dim)', marginTop: '0.5rem' }}>Trust is the currency of payments—and it's under attack.</p>
        </div>
      </div>
    </section>
  );
};

const AttackType = ({ icon, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
    <span style={{ color: 'var(--primary)' }}>{icon}</span>
    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</span>
  </div>
);

const styles = {
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  }
};

export default Problem;
