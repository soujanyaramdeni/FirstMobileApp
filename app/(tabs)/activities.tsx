import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useAuth, Activity } from '@/context/AuthContext';
import { Colors, CategoryColors } from '@/constants/theme';
import { ActivityCard } from '@/components/ActivityCard';
import { AddActivityModal } from '@/components/AddActivityModal';

/** Filter chip that gives a satisfying little bounce when selected. */
function FilterChip({
  selected,
  onPress,
  children,
}: {
  selected: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 12 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 8 });
      }}
      onPress={onPress}
    >
      <Animated.View style={style}>{children}</Animated.View>
    </Pressable>
  );
}

const CATEGORIES: (Activity['category'] | 'All')[] = [
  'All',
  'Workout',
  'Coding',
  'Reading',
  'Productivity',
  'Mindfulness',
  'Other',
];

export default function ActivitiesScreen() {
  const { activities, deleteActivity, themeMode } = useAuth();
  const isDark = themeMode === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Activity['category'] | 'All'>('All');
  const [addModalVisible, setAddModalVisible] = useState(false);

  // Filter activities
  const filteredActivities = activities.filter(act => {
    const matchesCategory = selectedCategory === 'All' || act.category === selectedCategory;
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.notes && act.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Calculate statistics
  const totalMinutes = activities.reduce((acc, curr) => acc + curr.duration, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const totalXP = activities.reduce((acc, curr) => acc + curr.points, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Activity Logs</Text>
            <Text style={[styles.headerSubtitle, { color: theme.subtext }]}>
              {activities.length} total entries recorded
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.addBtn,
              { backgroundColor: theme.primary },
              pressed && { opacity: 0.9 },
            ]}
            onPress={() => setAddModalVisible(true)}
          >
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.addBtnText}>Log New</Text>
          </Pressable>
        </View>

        {/* Stats Summary Banner */}
        <Animated.View
          entering={FadeInDown.springify().damping(16)}
          style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
        >
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: theme.primary }]}>{activities.length}</Text>
            <Text style={[styles.summaryLabel, { color: theme.subtext }]}>Total Logs</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: theme.success }]}>{totalHours}h</Text>
            <Text style={[styles.summaryLabel, { color: theme.subtext }]}>Time Spent</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: theme.warning }]}>+{totalXP}</Text>
            <Text style={[styles.summaryLabel, { color: theme.subtext }]}>XP Earned</Text>
          </View>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View
          entering={FadeInDown.delay(80).springify().damping(16)}
          style={[styles.searchBox, { backgroundColor: theme.input, borderColor: theme.border }]}
        >
          <Ionicons name="search-outline" size={20} color={theme.subtext} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search activities or notes..."
            placeholderTextColor={theme.subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.subtext} />
            </Pressable>
          ) : null}
        </Animated.View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            const meta = cat !== 'All' ? CategoryColors[cat] : null;

            return (
              <FilterChip key={cat} selected={isSelected} onPress={() => setSelectedCategory(cat)}>
                <View
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.card,
                      borderColor: isSelected ? theme.primary : theme.cardBorder,
                    },
                  ]}
                >
                  {meta ? (
                    <Ionicons
                      name={meta.icon as any}
                      size={14}
                      color={isSelected ? '#FFF' : theme.text}
                    />
                  ) : (
                    <Ionicons name="grid-outline" size={14} color={isSelected ? '#FFF' : theme.text} />
                  )}
                  <Text style={[styles.filterText, { color: isSelected ? '#FFF' : theme.text }]}>
                    {cat}
                  </Text>
                </View>
              </FilterChip>
            );
          })}
        </ScrollView>

        {/* Activity List */}
        <View style={styles.listSection}>
          {filteredActivities.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Ionicons name="search-outline" size={40} color={theme.subtext} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No activities found</Text>
              <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>
                Try adjusting your search terms or filter criteria.
              </Text>
              <Pressable
                style={[styles.resetBtn, { backgroundColor: theme.primary + '15' }]}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                <Text style={[styles.resetBtnText, { color: theme.primary }]}>Reset Filters</Text>
              </Pressable>
            </View>
          ) : (
            filteredActivities.map((act, idx) => (
              <ActivityCard key={act.id} activity={act} onDelete={deleteActivity} isDark={isDark} index={idx} />
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal to add activity */}
      <AddActivityModal visible={addModalVisible} onClose={() => setAddModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 18,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryVal: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 32,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  filterScroll: {
    marginBottom: 18,
  },
  filterContainer: {
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listSection: {
    marginTop: 4,
  },
  emptyState: {
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
  resetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 6,
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});