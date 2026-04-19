import { useRef, useCallback, Children, cloneElement, isValidElement } from 'react';
import './MagicBento.css';

/* ───────────────────────────────────────────────────
   MagicBentoCard — a single bento tile with glow follow
─────────────────────────────────────────────────── */
export function MagicBentoCard({
  children,
  className = '',
  glowColor = 'rgba(0, 242, 255, 0.18)',
  borderColor = 'rgba(0, 242, 255, 0.35)',
  style,
}) {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback(
    (e) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.setProperty('--glow-color', glowColor);
      card.style.setProperty('--border-color', borderColor);
    },
    [glowColor, borderColor]
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--mouse-x', '-9999px');
    card.style.setProperty('--mouse-y', '-9999px');
  }, []);

  return (
    <div
      ref={cardRef}
      className={`magic-bento-card ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="magic-bento-glow" />
      <div className="magic-bento-content">{children}</div>
    </div>
  );
}

/* ───────────────────────────────────────────────────
   MagicBento — the bento grid container
─────────────────────────────────────────────────── */
export default function MagicBento({
  children,
  columns = 3,
  gap = '1.5rem',
  className = '',
  style,
}) {
  return (
    <div
      className={`magic-bento-grid ${className}`}
      style={{
        '--bento-cols': columns,
        '--bento-gap': gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
