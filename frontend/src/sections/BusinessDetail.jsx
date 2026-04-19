import React from 'react';
import { BarChart3, TrendingUp, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import MagicBento, { MagicBentoCard } from '../components/animations/MagicBento';

const weekData = [
  { name: 'Mon', fraud: 400,  saved: 2400 },
  { name: 'Tue', fraud: 300,  saved: 1398 },
  { name: 'Wed', fraud: 200,  saved: 9800 },
  { name: 'Thu', fraud: 278,  saved: 3908 },
  { name: 'Fri', fraud: 189,  saved: 4800 },
  { name: 'Sat', fraud: 239,  saved: 3800 },
  { name: 'Sun', fraud: 349,  saved: 4300 },
];

const STATUS_CARDS = [
  { label: 'Fraud Stopped Today', value: '1,247', icon: <Shield size={22} />,       color: 'var(--primary)' },
  { label: 'Active Threats',       value: '89',    icon: <AlertCircle size={22} />,   color: 'var(--danger)' },
  { label: 'False Positive Rate',  value: '7.2%',  icon: <CheckCircle size={22} />,   color: 'var(--success)' },
  { label: 'Manual Savings',       value: '82%',   icon: <TrendingUp size={22} />,    color: 'var(--warning)' },
];

export const Analytics = () => (
  <section className="section" style={{ padding: '120px 0' }}>
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '72px' }}>
        <div className="badge">Operations</div>
        <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', marginTop: '1rem' }} className="glow-text">
          Impact Monitoring
        </h2>
        <p className="subtitle" style={{ marginTop: '1rem' }}>
          Real-time metrics at a glance — fraud stopped, savings generated, efficiency gained.
        </p>
      </div>

      <div className="grid grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
        {/* Chart */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 color="var(--primary)" size={20} /> Savings vs Fraud Losses (₹ 000s)
          </h4>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} />
                <YAxis stroke="var(--text-dim)" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: 'rgba(13,13,23,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="saved" name="Saved" fill="var(--primary)"  radius={[6, 6, 0, 0]} />
                <Bar dataKey="fraud" name="Loss"  fill="var(--danger)"   radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status bento cards */}
        <MagicBento columns={2} gap="1rem">
          {STATUS_CARDS.map((c) => (
            <MagicBentoCard
              key={c.label}
              glowColor={`${c.color === 'var(--primary)' ? 'rgba(0,242,255' : c.color === 'var(--danger)' ? 'rgba(255,0,85' : c.color === 'var(--success)' ? 'rgba(0,255,136' : 'rgba(255,170,0'},0.12)`}
              borderColor={`${c.color === 'var(--primary)' ? 'rgba(0,242,255' : c.color === 'var(--danger)' ? 'rgba(255,0,85' : c.color === 'var(--success)' ? 'rgba(0,255,136' : 'rgba(255,170,0'},0.35)`}
            >
              <div style={{ padding: '1.75rem' }}>
                <div style={{ color: c.color, marginBottom: '12px' }}>{c.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: c.color, lineHeight: 1 }}>{c.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {c.label}
                </div>
              </div>
            </MagicBentoCard>
          ))}
        </MagicBento>
      </div>
    </div>
  </section>
);

const VALUE_CARDS = [
  { val: '₹26 Cr',    label: 'Saved per Bank / Year', desc: '40% reduction in typical mid-size bank fraud exposure.' },
  { val: '14 Mo',     label: 'Payback Period',         desc: 'Rapid ROI through operational efficiency and loss reduction.' },
  { val: '50% Less',  label: 'Cost vs Legacy',         desc: 'Cloud-native serverless cuts infrastructure overhead drastically.' },
];

export const BusinessValue = () => (
  <section className="section" style={{ padding: '120px 0', background: 'rgba(0,255,136,0.02)' }}>
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '72px' }}>
        <div className="badge">ROI</div>
        <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', marginTop: '1rem' }} className="glow-text">
          Commercial Value
        </h2>
        <p className="subtitle" style={{ marginTop: '1rem' }}>
          Clear, defensible numbers that justify board-level investment decisions.
        </p>
      </div>

      <MagicBento columns={3} gap="1.5rem" style={{ marginBottom: '2.5rem' }}>
        {VALUE_CARDS.map((c) => (
          <MagicBentoCard key={c.label} glowColor="rgba(0,255,136,0.12)" borderColor="rgba(0,255,136,0.3)">
            <div style={{ padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--success)', lineHeight: 1 }}>{c.val}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, margin: '14px 0 10px', color: '#fff' }}>{c.label}</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: 1.65 }}>{c.desc}</p>
            </div>
          </MagicBentoCard>
        ))}
      </MagicBento>

      {/* Market opportunity banner */}
      <MagicBentoCard glowColor="rgba(0,242,255,0.1)" borderColor="rgba(0,242,255,0.25)">
        <div style={{ padding: '3rem', display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Market Opportunity</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: 1.75 }}>
              India has <strong style={{ color: '#fff' }}>21 mid-size banks</strong> currently struggling with legacy fraud rules.
              HyberShield offers a scalable SaaS deployment model that captures the full addressable market.
            </p>
          </div>
          <div style={{ textAlign: 'center', minWidth: '200px' }}>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>₹420 Cr</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Annual Addressable Market
            </div>
            <div style={{ marginTop: '12px', padding: '6px 16px', background: 'rgba(0,242,255,0.08)', border: '1px solid rgba(0,242,255,0.2)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', display: 'inline-block' }}>
              21 Banks · SaaS Model
            </div>
          </div>
        </div>
      </MagicBentoCard>
    </div>
  </section>
);

export default Analytics;
