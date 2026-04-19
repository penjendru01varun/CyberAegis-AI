import { useEffect, useRef } from 'react';
import './ScrollReveal.css';

export default function ScrollReveal({
  children,
  threshold = 0.15,
  delay = 0,
  duration = 700,
  direction = 'up',   // 'up' | 'down' | 'left' | 'right' | 'none'
  distance = 40,
  once = true,
  className = '',
  style,
}) {
  const ref = useRef(null);
  const hasRevealed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial hidden state via inline style
    const dirMap = {
      up:    `0px, ${distance}px, 0`,
      down:  `0px, -${distance}px, 0`,
      left:  `${distance}px, 0px, 0`,
      right: `-${distance}px, 0px, 0`,
      none:  '0px, 0px, 0',
    };

    el.style.opacity = '0';
    el.style.transform = `translate3d(${dirMap[direction] || dirMap.up})`;
    el.style.transition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (once && hasRevealed.current) return;
            hasRevealed.current = true;
            el.style.opacity = '1';
            el.style.transform = 'translate3d(0, 0, 0)';
            if (once) observer.unobserve(el);
          } else if (!once) {
            el.style.opacity = '0';
            el.style.transform = `translate3d(${dirMap[direction] || dirMap.up})`;
            hasRevealed.current = false;
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, delay, duration, direction, distance, once]);

  return (
    <div ref={ref} className={`scroll-reveal ${className}`} style={style}>
      {children}
    </div>
  );
}
