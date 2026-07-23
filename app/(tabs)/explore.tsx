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
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';

interface CommunityFeedItem {
  id: string;
  userName: string;
  userAvatar: string;
  userRole: string;
  actionTitle: string;
  category: string;
  timeAgo: string;
  kudosCount: number;
}

const COMMUNITY_FEED: CommunityFeedItem[] = [
  // {
  //   id: 'f1',
  //   userName: 'Sarah Chen',
  //   userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  //   userRole: 'Lead Developer',
  //   actionTitle: 'Completed 120m TypeScript Performance Tuning & Refactoring 🚀',
  //   category: 'Coding',
  //   timeAgo: '2 hours ago',
  //   kudosCount: 14,
  // },
  // {
  //   id: 'f2',
  //   userName: 'Marcus Vance',
  //   userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  //   userRole: 'Marathon Runner',
  //   actionTitle: 'Logged 10km Trail Run in under 48 minutes 🏃‍♂️🔥',
  //   category: 'Workout',
  //   timeAgo: '4 hours ago',
  //   kudosCount: 29,
  // },
  // {
  //   id: 'f3',
  //   userName: 'Elena Rostova',
  //   userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  //   userRole: 'Product Manager',
  //   actionTitle: 'Finished reading "Deep Work" by Cal Newport 📖',
  //   category: 'Reading',
  //   timeAgo: '6 hours ago',
  //   kudosCount: 19,
  // },
];

export default function ExploreScreen() {
  const { allUsers, user, themeMode } = useAuth();
  const isDark = themeMode === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [feed, setFeed] = useState<CommunityFeedItem[]>(COMMUNITY_FEED);
  const [kudosGiven, setKudosGiven] = useState<Record<string, boolean>>({});

  const handleToggleKudos = (id: string) => {
    setKudosGiven(prev => {
      const alreadyGave = !!prev[id];
      const nextState = { ...prev, [id]: !alreadyGave };

      setFeed(currentFeed =>
        currentFeed.map(item => {
          if (item.id === id) {
            return {
              ...item,
              kudosCount: alreadyGave ? item.kudosCount - 1 : item.kudosCount + 1,
            };
          }
          return item;
        })
      );

      return nextState;
    });
  };

  // Sort users by points for Leaderboard
  const leaderboardUsers = [...allUsers].sort((a, b) => b.points - a.points);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Discover & Community</Text>
          <Text style={[styles.headerSubtitle, { color: theme.subtext }]}>
            Connect with active achievers and celebrate progress
          </Text>
        </View>

        {/* Daily Motivation Card */}
        <View style={[styles.quoteCard, { backgroundColor: theme.primary }]}>
          <Ionicons name="bulb-outline" size={24} color="#FFE066" />
          <Text style={styles.quoteText}>
            "Success is the sum of small efforts, repeated day in and day out."
          </Text>
          <Text style={styles.quoteAuthor}>— Robert Collier</Text>
        </View>

        {/* Leaderboard Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Global Leaderboard</Text>
            <Text style={[styles.subTextRight, { color: theme.subtext }]}>Top XP Performers</Text>
          </View>

          <View style={[styles.leaderboardCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            {leaderboardUsers.map((u, index) => {
              const isCurrentUser = user && user.id === u.id;
              const rank = index + 1;
              const rankIcon =
                rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

              return (
                <View
                  key={u.id}
                  style={[
                    styles.leaderboardRow,
                    isCurrentUser && { backgroundColor: theme.primary + '10' },
                    index < leaderboardUsers.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.border,
                    },
                  ]}
                >
                  <Text style={styles.rankBadge}>{rankIcon}</Text>
                  <Image source={{ uri: u.avatar }} style={styles.leaderAvatar} />
                  <View style={styles.leaderMeta}>
                    <Text style={[styles.leaderName, { color: theme.text }]}>
                      {u.name} {isCurrentUser ? '(You)' : ''}
                    </Text>
                    <Text style={[styles.leaderRole, { color: theme.subtext }]}>{u.role}</Text>
                  </View>
                  <View style={[styles.xpBadge, { backgroundColor: theme.warning + '20' }]}>
                    <Ionicons name="sparkles" size={13} color={theme.warning} />
                    <Text style={[styles.xpText, { color: theme.warning }]}>{u.points} XP</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Community Activity Feed */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Community Live Feed</Text>

          {feed.map(item => {
            const hasKudos = kudosGiven[item.id];
            return (
              <View
                key={item.id}
                style={[styles.feedCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              >
                <View style={styles.feedHeader}>
                  <Image source={{ uri: item.userAvatar }} style={styles.feedAvatar} />
                  <View style={styles.feedUserMeta}>
                    <Text style={[styles.feedUserName, { color: theme.text }]}>
                      {item.userName}
                    </Text>
                    <Text style={[styles.feedTimeAgo, { color: theme.subtext }]}>
                      {item.timeAgo} • {item.userRole}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.feedActionTitle, { color: theme.text }]}>
                  {item.actionTitle}
                </Text>

                <View style={styles.feedFooter}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.kudosBtn,
                      { backgroundColor: hasKudos ? theme.primary : theme.input },
                      pressed && { opacity: 0.8 },
                    ]}
                    onPress={() => handleToggleKudos(item.id)}
                  >
                    <Ionicons
                      name={hasKudos ? 'thumbs-up' : 'thumbs-up-outline'}
                      size={16}
                      color={hasKudos ? '#FFF' : theme.text}
                    />
                    <Text
                      style={[
                        styles.kudosText,
                        { color: hasKudos ? '#FFF' : theme.text },
                      ]}
                    >
                      {item.kudosCount} Kudos
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
  header: {
    marginBottom: 18,
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
  quoteCard: {
    padding: 18,
    borderRadius: 20,
    marginBottom: 20,
    gap: 8,
  },
  quoteText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  quoteAuthor: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  subTextRight: {
    fontSize: 12,
    fontWeight: '500',
  },
  leaderboardCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  rankBadge: {
    fontSize: 16,
    fontWeight: '800',
    width: 28,
    textAlign: 'center',
  },
  leaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  leaderMeta: {
    flex: 1,
  },
  leaderName: {
    fontSize: 15,
    fontWeight: '700',
  },
  leaderRole: {
    fontSize: 12,
    marginTop: 1,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpText: {
    fontSize: 13,
    fontWeight: '700',
  },
  feedCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  feedAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  feedUserMeta: {
    flex: 1,
  },
  feedUserName: {
    fontSize: 15,
    fontWeight: '700',
  },
  feedTimeAgo: {
    fontSize: 12,
    marginTop: 1,
  },
  feedActionTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
    marginBottom: 12,
  },
  feedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kudosBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  kudosText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
