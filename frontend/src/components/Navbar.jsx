import React from 'react';
import { Shield, LayoutDashboard, Activity, Terminal } from 'lucide-react';

const Navbar = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="glass" style={styles.nav}>
      <div style={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <Shield size={28} color="var(--primary)" />
        <span style={styles.logoText}>HyberShield <span style={{ color: 'var(--primary)' }}>AI</span></span>
      </div>
      
      <div style={styles.links}>
        <button style={styles.btn} onClick={() => scrollTo('simulation')}>
          <Terminal size={16} /> Live Demo
        </button>
        <button style={styles.btn} onClick={() => scrollTo('architecture')}>
          <Activity size={16} /> Architecture
        </button>
        <button style={styles.btnPrimary} onClick={() => scrollTo('simulation')}>
           Get Started
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    maxWidth: '1200px',
    height: '70px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 30px',
    zIndex: 1000,
    borderRadius: '20px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer'
  },
  logoText: {
    fontSize: '1.2rem',
    fontWeight: '900',
    letterSpacing: '1px'
  },
  links: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  btn: {
    background: 'transparent',
    color: 'var(--text-dim)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    padding: '8px 12px',
    border: 'none',
    fontWeight: 600
  },
  btnPrimary: {
    background: 'var(--primary)',
    color: '#000',
    padding: '10px 24px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: 800,
    boxShadow: '0 0 15px var(--primary-glow)'
  }
};

export default Navbar;
