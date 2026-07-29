import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Goal } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';

interface GoalItemProps {
  goal: Goal;
  onToggle: (id: string) => void;
  isDark?: boolean;
  index?: number;
  /** Called right when a goal transitions from incomplete -> complete, for confetti/celebrations */
  onComplete?: () => void;
}

export const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  onToggle,
  isDark = true,
  index = 0,
  onComplete,
}) => {
  const theme = isDark ? Colors.dark : Colors.light;

  const checkScale = useSharedValue(goal.completed ? 1 : 0);
  const rowScale = useSharedValue(1);

  useEffect(() => {
    checkScale.value = goal.completed
      ? withSequence(withSpring(1.25, { damping: 8 }), withSpring(1, { damping: 10 }))
      : withTiming(0, { duration: 150 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goal.completed]);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rowScale.value }],
  }));

  const handlePress = () => {
    rowScale.value = withSequence(withTiming(0.98, { duration: 80 }), withSpring(1, { damping: 9 }));

    if (!goal.completed) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      onComplete?.();
    } else {
      Haptics.selectionAsync().catch(() => {});
    }

    onToggle(goal.id);
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 70).springify().damping(15)}>
      <Pressable
        style={({ pressed }) => [pressed && { opacity: 0.9 }]}
        onPress={handlePress}
      >
        <Animated.View
          style={[
            styles.container,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
            rowStyle,
          ]}
        >
          <View style={styles.left}>
            <View
              style={[
                styles.checkbox,
                goal.completed
                  ? { backgroundColor: theme.success, borderColor: theme.success }
                  : { borderColor: theme.subtext, backgroundColor: 'transparent' },
              ]}
            >
              <Animated.View style={checkStyle}>
                <Ionicons name="checkmark" size={16} color="#FFF" />
              </Animated.View>
            </View>

            <Text
              style={[
                styles.title,
                { color: goal.completed ? theme.subtext : theme.text },
                goal.completed && styles.completedText,
              ]}
            >
              {goal.title}
            </Text>
          </View>

          <View style={[styles.badge, { backgroundColor: theme.primary + '15' }]}>
            <Text style={[styles.points, { color: theme.primary }]}>+{goal.points} XP</Text>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  points: {
    fontSize: 12,
    fontWeight: '700',
  },
});