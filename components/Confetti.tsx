import React, { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface ConfettiProps {
  /** Bump this value (e.g. Date.now()) every time you want a new burst to fire */
  trigger: number;
  count?: number;
  colors?: string[];
  originX?: number;
  originY?: number;
}

const DEFAULT_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#FFE066'];

function ConfettiPiece({
  active,
  color,
  angle,
  distance,
  originX,
  originY,
}: {
  active: boolean;
  color: string;
  angle: number;
  distance: number;
  originX: number;
  originY: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (active) {
      progress.value = 0;
      progress.value = withDelay(
        Math.random() * 80,
        withTiming(1, { duration: 750 + Math.random() * 350, easing: Easing.out(Easing.cubic) })
      );
    }
  }, [active]);

  const style = useAnimatedStyle(() => {
    const dx = Math.cos(angle) * distance * progress.value;
    const dy = Math.sin(angle) * distance * progress.value - 40 * progress.value; // slight upward bias
    const rotate = `${progress.value * (angle > Math.PI ? -540 : 540)}deg`;
    const opacity = progress.value < 0.85 ? 1 : 1 - (progress.value - 0.85) / 0.15;
    const scale = 0.6 + progress.value * 0.6;

    return {
      opacity,
      transform: [
        { translateX: originX + dx },
        { translateY: originY + dy },
        { rotate },
        { scale },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.piece, { backgroundColor: color }, style]}
    />
  );
}

export const Confetti: React.FC<ConfettiProps> = ({
  trigger,
  count = 18,
  colors = DEFAULT_COLORS,
  originX,
  originY,
}) => {
  const { width, height } = useWindowDimensions();
  const ox = originX ?? width / 2;
  const oy = originY ?? height * 0.3;

  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: `${trigger}-${i}`,
        color: colors[i % colors.length],
        angle: (Math.PI * 2 * i) / count + Math.random() * 0.4,
        distance: 60 + Math.random() * 90,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trigger]
  );

  if (!trigger) return null;

  return (
    <>
      {pieces.map(p => (
        <ConfettiPiece
          key={p.id}
          active={!!trigger}
          color={p.color}
          angle={p.angle}
          distance={p.distance}
          originX={ox}
          originY={oy}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 2,
  },
});