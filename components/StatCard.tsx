import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { AnimatedCounter } from '@/components/AnimatedCounter';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  isDark?: boolean;
  /** Index in a row/grid, used to stagger the entrance animation */
  index?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  isDark = true,
  index = 0,
}) => {
  const theme = isDark ? Colors.dark : Colors.light;
  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // If the value is purely numeric (e.g. 12) animate the count-up.
  // If it's a formatted string like "2.5h" or "3 Days", extract the leading
  // number and animate that portion while keeping the trailing label intact.
  const numericMatch = typeof value === 'string' ? value.match(/^(-?\d+(\.\d+)?)(.*)$/) : null;

  let valueNode: React.ReactNode;
  if (typeof value === 'number') {
    valueNode = <AnimatedCounter value={value} style={[styles.value, { color: theme.text }]} />;
  } else if (numericMatch) {
    const num = parseFloat(numericMatch[1]);
    const decimals = numericMatch[1].includes('.') ? 1 : 0;
    const rest = numericMatch[3] ?? '';
    valueNode = (
      <AnimatedCounter
        value={num}
        decimals={decimals}
        suffix={rest}
        style={[styles.value, { color: theme.text }]}
      />
    );
  } else {
    valueNode = <Text style={[styles.value, { color: theme.text }]}>{value}</Text>;
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 90).springify().damping(14)}
      style={styles.flexWrap}
    >
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 12 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 10 });
        }}
      >
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
            pressStyle,
          ]}
        >
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
              <Ionicons name={icon} size={22} color={color} />
            </View>
            {subtitle ? <Text style={[styles.subtitle, { color: theme.subtext }]}>{subtitle}</Text> : null}
          </View>
          {valueNode}
          <Text style={[styles.title, { color: theme.subtext }]}>{title}</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flexWrap: {
    flex: 1,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '600',
  },
});