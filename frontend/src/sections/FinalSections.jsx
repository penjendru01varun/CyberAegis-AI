import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ShieldCheck, Lock, Globe, Mail, Rocket, MapPin } from 'lucide-react';

export const Roadmap = () => {
  return (
    <section className="section" style={{ padding: '100px 0' }}>
      <div className="container">
        <div className="grid grid-2" style={{ gap: '4rem' }}>
          <div>
            <div className="badge">Next Steps</div>
            <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }} className="glow-text">Implementation</h2>
            <div style={{ marginTop: '2rem' }}>
              <Step item="MVP in 24 Hours" sub="Core simulation and risk engine live." checked />
              <Step item="Bank Integration" sub="3-4 week middleware deployment cycle." />
              <Step item="Training Loop" sub="Weekly adaptive retraining based on bank feedback." />
            </div>
          </div>
          <div className="glass" style={{ padding: '2.5rem' }}>
             <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
               <ShieldCheck color="var(--success)" /> Compliance & Trust
             </h3>
             <div style={{ display: 'grid', gap: '1.5rem' }}>
               <ComplianceItem icon={<Lock size={18} />} title="DPDP Aligned" desc="Privacy-by-design architecture." />
               <ComplianceItem icon={<Globe size={18} />} title="RBI Readiness" desc="Meets proactive monitoring guidelines." />
               <ComplianceItem icon={<Rocket size={18} />} title="Scalability" desc="Handles festival-season transaction spikes." />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Contact = () => {
  return (
    <footer style={{ padding: '100px 0', borderTop: '1px solid var(--border)', background: '#050510' }}>
      <div className="container">
        <div className="grid grid-2" style={{ alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem' }} className="glow-text">HyberShield AI</h2>
            <p style={{ color: 'var(--text-dim)', marginTop: '1rem', maxWidth: '400px' }}>
              Building the future of proactive payment defense for India.
            </p>
            <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem' }}>
               <div style={{ display: 'flex', gap: '10px', color: 'var(--text-dim)' }}><Mail size={20} /> contact@hybershield.ai</div>
               <div style={{ display: 'flex', gap: '10px', color: 'var(--text-dim)' }}><MapPin size={20} /> Bengaluru, India</div>
            </div>
          </div>
          <div className="glass" style={{ padding: '2rem' }}>
            <h4 style={{ marginBottom: '1.5rem' }}>Ready for a deep dive?</h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <input type="email" placeholder="Enterprise Email" style={styles.input} />
              <button className="btn-primary" style={{ width: '100%' }}>Request Full Demo</button>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
           © 2026 HyberShield AI. All rights reserved. | NPCI & RBI Framework Aligned.
        </div>
      </div>
    </footer>
  );
};

const Step = ({ item, sub, checked }) => (
  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
    <div style={{ 
      width: '24px', height: '24px', 
      borderRadius: '50%', background: checked ? 'var(--success)' : 'transparent',
      border: `2px solid ${checked ? 'var(--success)' : 'var(--border)'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {checked && <ShieldCheck size={14} color="#000" />}
    </div>
    <div>
      <div style={{ fontWeight: 800 }}>{item}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{sub}</div>
    </div>
  </div>
);

const ComplianceItem = ({ icon, title, desc }) => (
  <div style={{ display: 'flex', gap: '15px' }}>
    <div style={{ color: 'var(--primary)' }}>{icon}</div>
    <div>
      <div style={{ fontWeight: 800 }}>{title}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>{desc}</div>
    </div>
  </div>
);

const styles = {
  input: {
    padding: '12px 20px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border)',
    color: '#fff',
    outline: 'none'
  }
};
