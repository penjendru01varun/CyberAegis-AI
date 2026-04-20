import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Network, UserCheck, ArrowRight, Activity, Zap, Search } from 'lucide-react';

const ArchitectureFlow = ({ activeLayer = 'none' }) => {
    const layers = [
        { 
            id: 'vera', 
            name: 'VeraShield', 
            tag: 'PRE-ATTACK', 
            icon: <Network size={24} />, 
            color: '#00f2ff',
            features: ['Ghost Hit Check', 'Attacker Fingerprint', 'Recon Detection'],
            desc: 'Detects the attacker before the transaction starts.'
        },
        { 
            id: 'fraud', 
            name: 'FraudShield', 
            tag: 'REAL-TIME', 
            icon: <ShieldCheck size={24} />, 
            color: '#7000ff',
            features: ['Risk Scoring', 'Anomaly Engine', 'Device Intelligence'],
            desc: 'Analyzes transaction patterns in <250ms.'
        },
        { 
            id: 'elder', 
            name: 'ElderShield', 
            tag: 'HUMAN-CENTRIC', 
            icon: <UserCheck size={24} />, 
            color: '#00ff88',
            features: ['Social Eng. Defense', 'Family Alert', 'Cognitive Friction'],
            desc: 'Protects vulnerable users from coercion.'
        }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>3-Layer Proactive Architecture</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>A unified defense system covering the entire attack lifecycle.</p>
            </div>
            
            <div style={styles.flowContainer}>
                {layers.map((layer, i) => (
                    <React.Fragment key={layer.id}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ 
                                opacity: 1, 
                                scale: activeLayer === layer.id ? 1.05 : 1,
                                borderColor: activeLayer === layer.id ? layer.color : 'var(--border)',
                                boxShadow: activeLayer === layer.id ? `0 0 30px ${layer.color}30` : 'none'
                            }}
                            className="glass card"
                            style={{ 
                                ...styles.layerCard,
                                background: activeLayer === layer.id ? `${layer.color}05` : 'var(--card-bg)'
                            }}
                        >
                            <div style={{ ...styles.iconCircle, background: `${layer.color}15`, color: layer.color }}>
                                {layer.icon}
                            </div>
                            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                <span style={{ fontSize: '0.6rem', fontWeight: 900, color: layer.color, letterSpacing: '0.1em' }}>{layer.tag}</span>
                                <h4 style={{ fontSize: '1.1rem', marginTop: '2px' }}>{layer.name}</h4>
                            </div>
                            <ul style={styles.featureList}>
                                {layer.features.map((f, j) => (
                                    <li key={j} style={{ ...styles.featureItem, color: activeLayer === layer.id ? 'white' : 'var(--text-dim)' }}>
                                        {activeLayer === layer.id ? <Zap size={10} color={layer.color} /> : <Activity size={10} />}
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        {i < layers.length - 1 && (
                            <div style={styles.connector}>
                                <ArrowRight color={activeLayer === layers[i].id || activeLayer === layers[i+1].id ? layers[i+1].color : 'var(--border)'} size={24} />
                                {activeLayer !== 'none' && (
                                    <motion.div 
                                        animate={{ x: [0, 40], opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        style={{ ...styles.dataPulse, background: layers[i+1].color }}
                                    />
                                )}
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Orchestration Latency Footer */}
            <div style={styles.latencyStrip}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Search size={16} color="var(--primary)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>ORCHESTRATION LATENCY: </span>
                    <span style={{ color: 'var(--success)', fontWeight: 900, fontSize: '0.9rem' }}>212ms ✅ (Target: &lt;250ms)</span>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>• LangGraph Parallel Execution</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>• sub-50ms Agent Inference</span>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        marginBottom: '40px',
        padding: '25px',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '24px',
        border: '1px solid var(--border)'
    },
    header: {
        marginBottom: '30px',
        textAlign: 'center'
    },
    flowContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0px',
        position: 'relative'
    },
    layerCard: {
        width: '260px',
        padding: '25px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '20px',
        zIndex: 2
    },
    iconCircle: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 0 10px rgba(255,255,255,0.05)'
    },
    featureList: {
        marginTop: '20px',
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%'
    },
    featureItem: {
        fontSize: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 10px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '6px'
    },
    connector: {
        width: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    dataPulse: {
        position: 'absolute',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        top: '50%',
        marginTop: '-4px',
        left: '10px'
    },
    latencyStrip: {
        marginTop: '30px',
        padding: '15px 25px',
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
};

export default ArchitectureFlow;
