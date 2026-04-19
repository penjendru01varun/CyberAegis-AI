import React from 'react';
import { motion } from 'framer-motion';
import { Server, Database, Cloud, Zap, Shield, ArrowRight, Layers, Cpu, Globe } from 'lucide-react';

const ArchitectureView = () => {
  return (
    <div id="architecture-section" className="section" style={{ marginTop: '100px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 800 }}>Seamless Middleware Integration</h2>
        <p style={{ color: 'var(--text-dim)', maxWidth: '700px', margin: '10px auto' }}>
          HyberShield AI sits between your Bank App and the NPCI payment rails. 
          No core banking replacement needed. Deploy in weeks, not years.
        </p>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'center', gap: '60px' }}>
        <div style={styles.stackDesc}>
          <div style={styles.stackItem}>
            <div style={styles.iconBox}><Layers color="var(--primary)" /></div>
            <div>
              <h4 style={{ fontSize: '1.2rem' }}>Event-Driven Middleware</h4>
              <p style={styles.text}>Intercepts UPI requests at the API gateway. Decisions are made in parallel to the transaction flow to maintain &lt;250ms latency.</p>
            </div>
          </div>
          <div style={styles.stackItem}>
            <div style={styles.iconBox}><Cloud color="var(--secondary)" /></div>
            <div>
              <h4 style={{ fontSize: '1.2rem' }}>Serverless Scaling (AWS)</h4>
              <p style={styles.text}>Leverages AWS Lambda and RDS to handle 4x festival transaction spikes without pre-provisioning overhead.</p>
            </div>
          </div>
          <div style={styles.stackItem}>
            <div style={styles.iconBox}><Database color="var(--success)" /></div>
            <div>
              <h4 style={{ fontSize: '1.2rem' }}>Hybrid Data Layer</h4>
              <p style={styles.text}>PostgreSQL for transactional integrity, Neo4j for fraud-graph relationships, and MongoDB for behavioral trust profiles.</p>
            </div>
          </div>
          <div style={styles.stackItem}>
            <div style={styles.iconBox}><Cpu color="#ffaa00" /></div>
            <div>
              <h4 style={{ fontSize: '1.2rem' }}>Multimodal AI</h4>
              <p style={styles.text}>Combines Wav2Vec 2.0 for voice deepfake detection with LangGraph for stateful agent orchestration.</p>
            </div>
          </div>
        </div>

        <div style={styles.diagramContainer}>
          <div className="glass" style={styles.diagramBox}>
            <div style={styles.node}>User Device</div>
            <ArrowRight size={20} color="var(--border)" />
            <div style={{ ...styles.node, border: '2px solid var(--primary)', color: 'var(--primary)' }}>HyberShield Middleware</div>
            <ArrowRight size={20} color="var(--border)" />
            <div style={styles.node}>NPCI / Payment Rail</div>
            
            <div style={styles.verticalArrow}>|</div>
            <div className="glass" style={styles.internalBox}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '10px' }}>INTELLIGENCE CLOUD</div>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <div style={styles.miniTag}>VeraShield</div>
                    <div style={styles.miniTag}>FraudShield</div>
                    <div style={styles.miniTag}>ElderShield</div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  stackDesc: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  stackItem: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start'
  },
  iconBox: {
    padding: '12px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    flexShrink: 0
  },
  text: {
    fontSize: '0.9rem',
    color: 'var(--text-dim)',
    lineHeight: '1.5',
    marginTop: '5px'
  },
  diagramContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center'
  },
  diagramBox: {
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    width: '100%',
    maxWidth: '400px'
  },
  node: {
    padding: '12px 20px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    width: '100%',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: 700
  },
  verticalArrow: {
      color: 'var(--border)',
      fontSize: '20px'
  },
  internalBox: {
      padding: '20px',
      width: '100%',
      textAlign: 'center'
  },
  miniTag: {
      fontSize: '0.65rem',
      padding: '4px 8px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '4px',
      flex: 1
  }
};

export default ArchitectureView;
