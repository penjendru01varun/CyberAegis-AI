import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, ShieldCheck, MapPin, Tablet, Clock } from 'lucide-react';

const FraudShield = () => {
  return (
    <section className="section" style={{ padding: '100px 0', background: 'radial-gradient(circle at 90% 90%, rgba(112, 0, 255, 0.03), transparent)' }}>
      <div className="container">
        <div className="grid grid-2" style={{ alignItems: 'center' }}>
           {/* Functional UI Mockup */}
           <div className="glass" style={styles.mockup}>
            <div style={styles.mockupHeader}>
               <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={18} color="var(--secondary)" /> Real-Time Risk Score</h4>
               <div className="badge" style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}>Processing: 182ms</div>
            </div>
            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', fontWeight: 900, color: '#ff4d4d' }}>92<span style={{ fontSize: '1.2rem', opacity: 0.6 }}>/100</span></div>
                  <div style={{ color: '#ff4d4d', fontWeight: 800, textTransform: 'uppercase' }}>High Risk Detected</div>
               </div>

               <div className="grid grid-2" style={{ gap: '15px' }}>
                  <SignalItem icon={<MapPin size={16} />} label="Location" val="Mismatch" status="danger" />
                  <SignalItem icon={<Tablet size={16} />} label="Device" val="New ID" status="danger" />
                  <SignalItem icon={<Clock size={16} />} label="Time" val="2:00 AM" status="warning" />
                  <SignalItem icon={<ShieldCheck size={16} />} label="VeraShield" val="Threat Match" status="danger" />
               </div>

               <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '5px' }}>REASON CODE: ANOMALY_LOCATION_NEW_DEVICE</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Transaction initiated from Chennai on a device associated with multiple failed recon attempts.</div>
               </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ paddingLeft: '2rem' }}
          >
            <div className="badge" style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}>Layer 2: Real-Time</div>
            <h2 style={{ fontSize: '3rem', marginTop: '1.5rem' }} className="glow-text">FraudShield</h2>
            <h3 style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Context-aware intelligence.</h3>
            
            <p className="subtitle" style={{ marginBottom: '2rem' }}>
              When a transaction is initiated, FraudShield analyzes the behavior within 250ms. 
              We don't just look at common rules—we fuse 32+ data points into an explainable risk score.
            </p>

            <ul style={styles.list}>
              <li style={styles.listItem}><strong>8 Core Signals:</strong> Amount, Location, Device, Time, History, Behavior, Vera-Threat, and Trust Score.</li>
              <li style={styles.listItem}><strong>Explainable AI:</strong> Every decision comes with a human-readable justification for bank fraud teams.</li>
              <li style={styles.listItem}><strong>Sub-250ms Speed:</strong> Engineered for the massive scale of NPCI's core switches.</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const SignalItem = ({ icon, label, val, status }) => {
  const color = status === 'danger' ? '#ff4d4d' : status === 'warning' ? 'var(--warning)' : 'var(--success)';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
         <span style={{ color }}>{icon}</span> {label}
      </div>
      <div style={{ fontSize: '0.8rem', fontWeight: 700, color }}>{val}</div>
    </div>
  );
};

const styles = {
  mockup: {
    height: '500px',
    overflow: 'hidden',
    boxShadow: '0 0 40px rgba(112, 0, 255, 0.1)'
  },
  mockupHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  listItem: {
    paddingLeft: '20px',
    borderLeft: '2px solid var(--secondary)',
    fontSize: '0.95rem'
  }
};

export default FraudShield;
