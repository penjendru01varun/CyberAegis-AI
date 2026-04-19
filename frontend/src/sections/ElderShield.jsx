import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Bell, Shield, Clock, Phone, AlertCircle } from 'lucide-react';

const ElderShield = () => {
  return (
    <section className="section" style={{ padding: '100px 0', background: 'radial-gradient(circle at 10% 90%, rgba(255, 0, 85, 0.03), transparent)' }}>
      <div className="container">
        <div className="grid grid-2" style={{ alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="badge" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>Layer 3: Human-Centric</div>
            <h2 style={{ fontSize: '3rem', marginTop: '1.5rem' }} className="glow-text">ElderShield</h2>
            <h3 style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Dignity in defense.</h3>
            
            <p className="subtitle" style={{ marginBottom: '2rem' }}>
              Fraud against the elderly is often social manipulation—they are told to 'click' or 'scan'. 
              ElderShield adds human-centered safety nets that standard engines ignore.
            </p>

            <div className="grid grid-2" style={{ gap: '1.5rem' }}>
              <div className="glass" style={{ padding: '1.5rem' }}>
                <h4 style={{ color: '#ff4d4d', display: 'flex', gap: '8px' }}><Clock size={20} /> Cooling Periods</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                  Risk-based 30-minute holds on large transfers to allow clarity and family intervention.
                </p>
              </div>
              <div className="glass" style={{ padding: '1.5rem' }}>
                <h4 style={{ color: '#ff4d4d', display: 'flex', gap: '8px' }}><Bell size={20} /> Family Alerts</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                  Instantly notify registered family members or caregivers of high-risk activity.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Functional UI Mockup: Family Alert */}
          <div className="glass" style={styles.mockup}>
            <div style={styles.phoneFrame}>
               <div style={styles.phoneHeader}>
                  <div style={{ fontSize: '0.7rem' }}>10:42 AM</div>
                  <div style={{ display: 'flex', gap: '5px' }}><Activity size={10} /><Shield size={10} /></div>
               </div>
               <div style={{ padding: '20px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                     <div className="badge" style={{ background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d' }}>🚨 EMERGENCY ALERT</div>
                  </div>
                  <div className="glass" style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                     <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '10px' }}>ElderShield Risk Hold</h4>
                     <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                        A suspicious transfer of <strong>₹45,000</strong> was initiated from <strong>Dad's Account</strong>.
                     </p>
                     <div style={{ margin: '15px 0', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>REASON:</div>
                        <div style={{ fontSize: '0.75rem', color: '#ff4d4d' }}>Potential Social Engineering / QR Scam</div>
                     </div>
                     <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{ flex: 1, background: '#ff4d4d', padding: '10px', fontSize: '0.8rem', borderRadius: '10px' }}>Block Tx</button>
                        <button style={{ flex: 1, background: 'rgba(255,255,255,0.1)', padding: '10px', fontSize: '0.8rem', borderRadius: '10px' }}>Call Dad</button>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  mockup: {
    height: '500px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 0 40px rgba(255, 0, 85, 0.1)'
  },
  phoneFrame: {
    width: '280px',
    height: '450px',
    background: '#0a0a1a',
    borderRadius: '40px',
    border: '8px solid #1a1a2e',
    overflow: 'hidden',
    position: 'relative'
  },
  phoneHeader: {
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(0,0,0,0.2)'
  }
};

export default ElderShield;
