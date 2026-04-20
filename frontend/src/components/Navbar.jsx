import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Shield } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <motion.div
                className="scroll-progress"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                    transformOrigin: '0%',
                    zIndex: 2000,
                    scaleX
                }}
            />
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: isScrolled ? '15px 0' : '25px 0',
                background: isScrolled ? 'rgba(5, 7, 15, 0.85)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(15px)' : 'none',
                borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                zIndex: 1000,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                        <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Shield size={20} color="#000" strokeWidth={3} />
                        </div>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>HyberShield<span style={{ color: 'var(--primary)' }}>AI</span></span>
                    </div>

                    <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                        <NavItem label="Solution" onClick={() => scrollTo('solution')} />
                        <NavItem label="Architecture" onClick={() => scrollTo('architecture')} />
                        <NavItem label="Simulation" onClick={() => scrollTo('simulation')} />
                        <button 
                            className="btn-primary" 
                            style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                            onClick={() => scrollTo('simulation')}
                        >
                            TRY LIVE SWARM
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
};

const NavItem = ({ label, onClick }) => (
    <span 
        onClick={onClick}
        style={{ 
            fontSize: '0.9rem', 
            fontWeight: 600, 
            color: 'rgba(255,255,255,0.6)', 
            cursor: 'pointer',
            transition: 'color 0.2s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px'
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
    >
        {label}
    </span>
);

export default Navbar;
