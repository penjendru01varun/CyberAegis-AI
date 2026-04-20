import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Users, Zap, ShieldCheck, Wallet } from 'lucide-react';

const BusinessImpactStrip = () => {
    const metrics = [
        { label: 'Fraud reduction', value: '40% ↓', icon: <TrendingDown size={20} />, color: '#00ff88', sub: 'Core Value Prop' },
        { label: 'Manual reviews', value: '75% ↓', icon: <Users size={20} />, color: '#00f2ff', sub: 'Operational Savings' },
        { label: 'False positives', value: '34% → 8%', icon: <Zap size={20} />, color: '#ffaa00', sub: 'Customer Experience' },
        { label: 'Per Bank Value', value: '₹18-26Cr', icon: <Wallet size={20} />, color: '#7000ff', sub: 'Annual Business Case' },
        { label: 'Avg Latency', value: '<250ms', icon: <ShieldCheck size={20} />, color: '#00ff88', sub: 'Technical Excellence' }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    📊 Business Impact Metrics
                </h4>
            </div>
            <div className="grid grid-5" style={styles.metricsGrid}>
                {metrics.map((m, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass card"
                        style={styles.metricCard}
                    >
                        <div style={{ ...styles.iconBox, color: m.color, background: `${m.color}15` }}>
                            {m.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: m.color }}>{m.value}</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white', marginTop: '2px' }}>{m.label}</div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginTop: '2px' }}>{m.sub}</div>
                        </div>
                    </motion.div>
                ))}
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                .grid-5 {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 15px;
                }
                @media (max-width: 1200px) {
                    .grid-5 { grid-template-columns: repeat(3, 1fr); }
                }
                @media (max-width: 768px) {
                    .grid-5 { grid-template-columns: repeat(2, 1fr); }
                }
            `}} />
        </div>
    );
};

const styles = {
    container: {
        marginBottom: '30px',
    },
    header: {
        marginBottom: '12px',
        paddingLeft: '5px'
    },
    metricsGrid: {
        gap: '15px'
    },
    metricCard: {
        padding: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        borderRadius: '16px'
    },
    iconBox: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    }
};

export default BusinessImpactStrip;
