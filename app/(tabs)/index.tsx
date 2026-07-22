import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';
import { StatCard } from '@/components/StatCard';
import { ActivityCard } from '@/components/ActivityCard';
import { GoalItem } from '@/components/GoalItem';
import { AddActivityModal } from '@/components/AddActivityModal';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, activities, goals, toggleGoal, deleteActivity, themeMode, toggleTheme } = useAuth();
  const isDark = themeMode === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [addModalVisible, setAddModalVisible] = useState(false);

  // If user is not logged in, render guest banner
  if (!user) {
    return (
      <View style={[styles.guestContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.guestCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Ionicons name="lock-closed" size={48} color={theme.primary} />
          <Text style={[styles.guestTitle, { color: theme.text }]}>Authentication Required</Text>
          <Text style={[styles.guestSubtitle, { color: theme.subtext }]}>
            Please log in or create an account to access your personal dashboard and track activities.
          </Text>
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/login' as any)}
          >
            <Text style={styles.primaryBtnText}>Log In Now</Text>
          </Pressable>
          <Pressable
            style={[styles.secondaryBtn, { borderColor: theme.border }]}
            onPress={() => router.push('/register' as any)}
          >
            <Text style={[styles.secondaryBtnText, { color: theme.text }]}>Create New Account</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Calculate statistics
  const totalActivitiesCount = activities.length;
  const totalMinutes = activities.reduce((acc, curr) => acc + curr.duration, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const recentActivities = activities.slice(0, 3);

  // Dummy weekly bar data
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekData = [1.2, 2.5, 0.8, 3.0, 1.8, 2.2, 1.5]; // in hours
  const maxHours = Math.max(...weekData);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.userMeta}>
            <Pressable onPress={() => router.push('/profile' as any)}>
              <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
            </Pressable>
            <View>
              <Text style={[styles.greetingText, { color: theme.subtext }]}>Welcome back 👋</Text>
              <Text style={[styles.userNameText, { color: theme.text }]}>{user.name}</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            {/* Streak Badge */}
            <View style={[styles.streakBadge, { backgroundColor: theme.warning + '20' }]}>
              <Ionicons name="flame" size={18} color={theme.warning} />
              <Text style={[styles.streakText, { color: theme.warning }]}>{user.streak}d</Text>
            </View>

            {/* Theme Toggle */}
            <Pressable
              style={[styles.iconBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              onPress={toggleTheme}
            >
              <Ionicons
                name={isDark ? 'sunny-outline' : 'moon-outline'}
                size={20}
                color={theme.text}
              />
            </Pressable>
          </View>
        </View>

        {/* Level & XP Banner */}
        <View style={[styles.levelCard, { backgroundColor: theme.primary }]}>
          <View style={styles.levelRow}>
            <View>
              <Text style={styles.levelTag}>LEVEL {user.level}</Text>
              <Text style={styles.levelTitle}>{user.role || 'Active Achiever'}</Text>
            </View>
            <View style={styles.xpBox}>
              <Ionicons name="sparkles" size={16} color="#FFE066" />
              <Text style={styles.xpNumber}>{user.points} Total XP</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.fillTrack,
                { width: `${Math.min(100, (user.points % 300) / 3)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {(user.points % 300)} / 300 XP to Level {user.level + 1}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: theme.primary },
              pressed && { opacity: 0.9 },
            ]}
            onPress={() => setAddModalVisible(true)}
          >
            <Ionicons name="add-circle" size={20} color="#FFF" />
            <Text style={styles.actionBtnText}>Log Activity</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionBtnOutline,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
              pressed && { opacity: 0.9 },
            ]}
            onPress={() => router.push('/activities' as any)}
          >
            <Ionicons name="list" size={18} color={theme.text} />
            <Text style={[styles.actionBtnOutlineText, { color: theme.text }]}>View All</Text>
          </Pressable>
        </View>

        {/* Stats Overview Grid */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Overview Metrics</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Activities"
            value={totalActivitiesCount}
            icon="checkmark-done-circle-outline"
            color="#6366F1"
            isDark={isDark}
          />
          <StatCard
            title="Hours Logged"
            value={`${totalHours}h`}
            icon="time-outline"
            color="#10B981"
            isDark={isDark}
          />
          <StatCard
            title="Daily Streak"
            value={`${user.streak} Days`}
            icon="flame-outline"
            color="#F59E0B"
            isDark={isDark}
          />
        </View>

        {/* Interactive Goals Checklist */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Goals</Text>
          <Text style={[styles.subTextRight, { color: theme.subtext }]}>Tap to complete</Text>
        </View>
        <View style={styles.goalsContainer}>
          {goals.map(goal => (
            <GoalItem key={goal.id} goal={goal} onToggle={toggleGoal} isDark={isDark} />
          ))}
        </View>

        {/* Weekly Activity Bar Chart Visualizer */}
        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 12 }]}>
          Weekly Activity Breakdown
        </Text>
        <View style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.barsRow}>
            {days.map((day, idx) => {
              const h = weekData[idx];
              const heightPct = Math.round((h / maxHours) * 100);
              const isToday = idx === 3; // e.g. Thu / today highlight
              return (
                <View key={day} style={styles.barColumn}>
                  <Text style={[styles.barValText, { color: theme.subtext }]}>{h}h</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${heightPct}%`,
                          backgroundColor: isToday ? theme.primary : theme.primary + '50',
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barDayText, { color: isToday ? theme.primary : theme.subtext, fontWeight: isToday ? '700' : '500' }]}>
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 12 }]}>
            Recent Activities
          </Text>
          <Pressable onPress={() => router.push('/activities' as any)}>
            <Text style={[styles.linkText, { color: theme.primary }]}>See All</Text>
          </Pressable>
        </View>

        {recentActivities.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Ionicons name="journal-outline" size={36} color={theme.subtext} />
            <Text style={[styles.emptyText, { color: theme.subtext }]}>No activities logged yet today.</Text>
          </View>
        ) : (
          recentActivities.map(act => (
            <ActivityCard key={act.id} activity={act} onDelete={deleteActivity} isDark={isDark} />
          ))
        )}
      </ScrollView>

      {/* Modal for adding activity */}
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
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  guestCard: {
    padding: 28,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  guestTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  guestSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  primaryBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  greetingText: {
    fontSize: 13,
    fontWeight: '500',
  },
  userNameText: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '700',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 18,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  levelTag: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  levelTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
  },
  xpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  xpNumber: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  fillTrack: {
    height: '100%',
    backgroundColor: '#FFE066',
    borderRadius: 4,
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  actionBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  actionBtnOutlineText: {
    fontSize: 15,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subTextRight: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  goalsContainer: {
    marginBottom: 20,
  },
  chartCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingTop: 16,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barValText: {
    fontSize: 10,
    marginBottom: 4,
  },
  barTrack: {
    height: 70,
    width: 14,
    backgroundColor: 'rgba(150,150,150,0.1)',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
  },
  barDayText: {
    fontSize: 12,
    marginTop: 6,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
  },
});
