import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Activity } from '@/context/AuthContext';
import { Colors, CategoryColors } from '@/constants/theme';

interface ActivityCardProps {
  activity: Activity;
  onDelete?: (id: string) => void;
  isDark?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onDelete,
  isDark = true,
}) => {
  const theme = isDark ? Colors.dark : Colors.light;
  const categoryMeta = CategoryColors[activity.category] || CategoryColors.Other;

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Delete "${activity.title}"?`)) {
        onDelete?.(activity.id);
      }
    } else {
      Alert.alert(
        'Delete Activity',
        `Are you sure you want to delete "${activity.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => onDelete?.(activity.id) },
        ]
      );
    }
  };

  const formattedDate = new Date(activity.date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryMeta.bg }]}>
            <Ionicons name={categoryMeta.icon as any} size={14} color={categoryMeta.text} />
            <Text style={[styles.categoryText, { color: categoryMeta.text }]}>
              {activity.category}
            </Text>
          </View>
          <Text style={[styles.dateText, { color: theme.subtext }]}>{formattedDate}</Text>
        </View>

        {onDelete ? (
          <Pressable
            style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.6 }]}
            onPress={handleDelete}
            hitSlop={8}
          >
            <Ionicons name="trash-outline" size={18} color={theme.danger} />
          </Pressable>
        ) : null}
      </View>

      <Text style={[styles.title, { color: theme.text }]}>{activity.title}</Text>

      {activity.notes ? (
        <Text style={[styles.notes, { color: theme.subtext }]} numberOfLines={2}>
          {activity.notes}
        </Text>
      ) : null}

      <View style={styles.bottomRow}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} color={theme.subtext} />
          <Text style={[styles.metaText, { color: theme.subtext }]}>{activity.duration} mins</Text>
        </View>

        <View style={[styles.pointsBadge, { backgroundColor: theme.primary + '18' }]}>
          <Ionicons name="sparkles" size={13} color={theme.primary} />
          <Text style={[styles.pointsText, { color: theme.primary }]}>+{activity.points} XP</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
  },
  deleteBtn: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  notes: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
