import React from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Fingerprint, Map, AlertTriangle } from 'lucide-react';

const VeraShield = () => {
  return (
    <section className="section" style={{ padding: '100px 0', background: 'radial-gradient(circle at 10% 10%, rgba(0, 242, 255, 0.03), transparent)' }}>
      <div className="container">
        <div className="grid grid-2" style={{ alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="badge">Layer 1: Pre-Attack</div>
            <h2 style={{ fontSize: '3rem', marginTop: '1.5rem' }} className="glow-text">VeraShield</h2>
            <h3 style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Interception before contact.</h3>
            
            <p className="subtitle" style={{ marginBottom: '2rem' }}>
              Most fraud systems wait for a transaction to start. VeraShield detects fraudsters during their 
              reconnaissance phase—when they are scanning bulk UPI IDs to find active targets.
            </p>

            <div className="grid grid-2" style={{ gap: '1.5rem' }}>
              <div className="glass" style={{ padding: '1.5rem' }}>
                <h4 style={{ color: 'var(--primary)', display: 'flex', gap: '8px' }}><Search size={20} /> Ghost Entities</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                  Decoy accounts that, when scanned, instantly flag the source as an attacker.
                </p>
              </div>
              <div className="glass" style={{ padding: '1.5rem' }}>
                <h4 style={{ color: 'var(--primary)', display: 'flex', gap: '8px' }}><Fingerprint size={20} /> Fingerprinting</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                  Captures unique device/IP signatures of the fraudster before they reach real victims.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Functional UI Mockup */}
          <div className="glass" style={styles.mockup}>
            <div style={styles.mockupHeader}>
               <div className="badge" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                 <AlertTriangle size={12} /> Reconnaissance Detected
               </div>
               <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>IP: 103.221.X.X (Chennai Hub)</div>
            </div>
            <div style={{ padding: '20px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span>Ghost Entity Hit:</span>
                  <span style={{ color: 'var(--danger)', fontWeight: 800 }}>user921@upi (Decoy)</span>
               </div>
               <div style={styles.scanMap}>
                  <div style={styles.radar} />
                  <div style={{ position: 'absolute', top: '30%', left: '40%', color: 'var(--danger)' }}><Map size={24} /></div>
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '0.7rem' }}>Scanning at 45 IDs/sec</div>
               </div>
               <div style={{ marginTop: '20px' }}>
                  <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Predicted Target Profile:</div>
                  <div className="glass" style={{ padding: '10px', fontSize: '0.8rem', borderColor: 'var(--primary)' }}>
                    High-value Salary Accounts | Retired Profiles
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
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 0 40px rgba(0, 242, 255, 0.1)'
  },
  mockupHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  scanMap: {
    height: '240px',
    background: '#0a0a20',
    borderRadius: '16px',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(0, 242, 255, 0.2)'
  },
  radar: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    height: '400px',
    background: 'conic-gradient(from 0deg, rgba(0, 242, 255, 0.1) 0deg, transparent 90deg)',
    borderRadius: '50%',
    animation: 'rotateRadar 4s linear infinite'
  }
};

export default VeraShield;
