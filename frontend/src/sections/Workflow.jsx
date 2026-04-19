import React from 'react';
import { motion } from 'framer-motion';
import { Play, Check, ChevronRight, Search, Activity, Zap, CheckCircle2 } from 'lucide-react';

const Workflow = () => {
  const steps = [
    { icon: <Search />, title: "Reconnaissance", layer: "VeraShield", desc: "Attacker scans for active UPI IDs." },
    { icon: <Activity />, title: "Signal Capture", layer: "Hybrid", desc: "Middleware captures device & context metadata." },
    { icon: <Zap />, title: "Risk Scoring", layer: "FraudShield", desc: "8 signals fused via multi-agent AI." },
    { icon: <CheckCircle2 />, title: "Decision", layer: "Orchestrator", desc: "Allow, OTP, Hold, or Block issued in <250ms." }
  ];

  return (
    <section className="section" style={{ padding: '100px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div className="badge">Transaction Journey</div>
          <h2 style={{ fontSize: '3rem', marginTop: '1rem' }} className="glow-text">The End‑to‑End Flow</h2>
        </div>

        <div style={styles.workflowContainer}>
           {steps.map((step, index) => (
             <React.Fragment key={index}>
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.2 }}
                 className="glass" 
                 style={styles.stepCard}
               >
                 <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{step.icon}</div>
                 <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', opacity: 0.7 }}>{step.layer}</div>
                 <h4 style={{ fontSize: '1.2rem', margin: '5px 0' }}>{step.title}</h4>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>{step.desc}</p>
                 {index === steps.length - 1 && <div style={styles.latencyPulse}>&lt;250ms</div>}
               </motion.div>
               {index < steps.length - 1 && (
                 <div style={styles.arrow}><ChevronRight size={32} color="var(--border)" /></div>
               )}
             </React.Fragment>
           ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  workflowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    flexWrap: 'wrap'
  },
  stepCard: {
    width: '240px',
    padding: '2rem',
    position: 'relative',
    textAlign: 'center'
  },
  arrow: {
    display: 'flex',
    alignItems: 'center'
  },
  latencyPulse: {
    position: 'absolute',
    bottom: '-15px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'var(--success)',
    color: '#000',
    fontSize: '0.65rem',
    fontWeight: 900,
    padding: '4px 10px',
    borderRadius: '20px',
    boxShadow: '0 0 10px var(--success)'
  }
};

export default Workflow;
