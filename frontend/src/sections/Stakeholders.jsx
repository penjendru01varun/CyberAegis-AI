import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Landmark, Wallet, ShieldCheck, Heart, UserCheck } from 'lucide-react';

const Stakeholders = () => {
  return (
    <section className="section" style={{ padding: '80px 0', background: 'rgba(255,255,255,0.01)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="badge">Ecosystem Impact</div>
          <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }} className="glow-text">Who we solve for.</h2>
        </div>

        <div className="grid grid-3">
          <StakeholderCard 
            icon={<Landmark size={32} />} 
            title="Banks & Aggregators" 
            desc="Reduce multi-crore fraud losses and cut operational costs for manual identity verification."
          />
          <StakeholderCard 
            icon={<Building2 size={32} />} 
            title="Fraud Ops Teams" 
            desc="Move from reactive investigation to proactive policy enforcement with high-fidelity signals."
          />
          <StakeholderCard 
            icon={<UserCheck size={32} />} 
            title="Individual Users" 
            desc="Seamless high-value transactions without the friction of wrongful automated blocks."
          />
          <StakeholderCard 
            icon={<Heart size={32} color="#ff4d4d" />} 
            title="Elderly Citizens" 
            desc="Dedicated safety layer against social engineering scams and high-pressure manipulation."
          />
          <StakeholderCard 
            icon={<ShieldCheck size={32} color="var(--success)" />} 
            title="Compliance Officers" 
            desc="Ensure RBI-aligned proactive monitoring and detailed logic explainability for every block."
          />
          <StakeholderCard 
            icon={<Wallet size={32} />} 
            title="Fintech Ecosystem" 
            desc="Maintain the growth of UPI by ensuring it remains a trusted, secure payment rail."
          />
        </div>
      </div>
    </section>
  );
};

const StakeholderCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass" 
    style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
  >
    <div style={{ color: 'var(--primary)' }}>{icon}</div>
    <h3 style={{ fontSize: '1.4rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: 1.6 }}>{desc}</p>
  </motion.div>
);

export default Stakeholders;
