import { useRef, useEffect, useCallback } from 'react';
import './ClickSpark.css';

export default function ClickSpark({
  sparkCount = 8,
  sparkSize = 6,
  sparkRadius = 30,
  sparkColor = '#00f2ff',
  duration = 600,
  children,
  style,
  className = '',
}) {
  const containerRef = useRef(null);

  const createSpark = useCallback(
    (x, y) => {
      const container = containerRef.current;
      if (!container) return;

      for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'click-spark-particle';

        const angle = (360 / sparkCount) * i;
        const rad = (angle * Math.PI) / 180;

        spark.style.cssText = `
          left: ${x}px;
          top: ${y}px;
          width: ${sparkSize}px;
          height: ${sparkSize}px;
          background: ${sparkColor};
          --tx: ${Math.cos(rad) * sparkRadius}px;
          --ty: ${Math.sin(rad) * sparkRadius}px;
          animation-duration: ${duration}ms;
        `;

        container.appendChild(spark);
        setTimeout(() => spark.remove(), duration);
      }
    },
    [sparkCount, sparkSize, sparkRadius, sparkColor, duration]
  );

  const handleClick = useCallback(
    (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createSpark(x, y);
    },
    [createSpark]
  );

  return (
    <div
      ref={containerRef}
      className={`click-spark-wrapper ${className}`}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
