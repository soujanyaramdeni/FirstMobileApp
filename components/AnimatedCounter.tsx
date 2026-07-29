import React, { useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  style?: TextStyle | TextStyle[];
}

/**
 * Counts up from 0 (or its previous value) to `value` whenever `value` changes.
 * Kept intentionally simple (JS timer based) so it works the same on every
 * platform, including web, without needing native driver support for text.
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 700,
  decimals = 0,
  prefix = '',
  suffix = '',
  style,
}) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf: ReturnType<typeof setTimeout>;
    const start = display;
    const delta = value - start;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(1, elapsed / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const next = start + delta * eased;
      setDisplay(next);

      if (t < 1) {
        raf = setTimeout(tick, 16);
      }
    };

    raf = setTimeout(tick, 16);
    return () => clearTimeout(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();

  return (
    <Text style={style}>
      {prefix}
      {formatted}
      {suffix}
    </Text>
  );
};