import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Goal } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';

interface GoalItemProps {
  goal: Goal;
  onToggle: (id: string) => void;
  isDark?: boolean;
}

export const GoalItem: React.FC<GoalItemProps> = ({ goal, onToggle, isDark = true }) => {
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.card, borderColor: theme.cardBorder },
        pressed && { opacity: 0.8 },
      ]}
      onPress={() => onToggle(goal.id)}
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
          {goal.completed ? <Ionicons name="checkmark" size={16} color="#FFF" /> : null}
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
    </Pressable>
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
