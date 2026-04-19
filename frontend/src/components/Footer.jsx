import React from 'react';
import { Shield, Globe, Info, Mail, Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={styles.footer} className="glass">
      <div className="section" style={styles.container}>
        <div style={styles.brandSection}>
          <div style={styles.logo}>
            <Shield size={24} color="var(--primary)" />
            <span style={styles.logoText}>HyberShield <span style={{ color: 'var(--primary)' }}>AI</span></span>
          </div>
          <p style={styles.desc}>The unified fraud prevention framework for India's digital payment revolution.</p>
        </div>
        
        <div style={styles.linksGrid}>
          <div style={styles.linkCol}>
            <h4>Products</h4>
            <a href="#">VeraShield</a>
            <a href="#">FraudShield</a>
            <a href="#">ElderShield</a>
          </div>
          <div style={styles.linkCol}>
            <h4>Resources</h4>
            <a href="#">API Docs</a>
            <a href="#">Compliance</a>
            <a href="#">ROI Calculator</a>
          </div>
          <div style={styles.linkCol}>
            <h4>Contact</h4>
            <div style={styles.socials}>
              <Globe size={18} />
              <Activity size={18} />
              <Info size={18} />
              <Mail size={18} />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '10px' }}>support@hybershield.ai</p>
          </div>
        </div>
      </div>
      <div style={styles.bottom}>
        <p>© 2026 HyberShield AI. All rights reserved. Middleware for the Digital India Era.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    marginTop: '100px',
    borderTop: '1px solid var(--border)',
    borderRadius: '0'
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '40px',
    padding: '60px 20px'
  },
  brandSection: {
    maxWidth: '300px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px'
  },
  logoText: {
    fontSize: '1.2rem',
    fontWeight: 800
  },
  desc: {
    fontSize: '0.9rem',
    color: 'var(--text-dim)',
    lineHeight: '1.5'
  },
  linksGrid: {
    display: 'flex',
    gap: '60px'
  },
  linkCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  socials: {
    display: 'flex',
    gap: '15px',
    color: 'var(--text-dim)'
  },
  bottom: {
    textAlign: 'center',
    padding: '20px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    fontSize: '0.8rem',
    color: 'var(--text-dim)'
  }
};

export default Footer;
