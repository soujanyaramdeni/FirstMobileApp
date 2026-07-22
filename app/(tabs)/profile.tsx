import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';
import { EditProfileModal } from '@/components/EditProfileModal';
import { ChangePasswordModal } from '@/components/ChangePasswordModal';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, themeMode, toggleTheme } = useAuth();
  const isDark = themeMode === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passModalVisible, setPassModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  if (!user) {
    return (
      <View style={[styles.guestContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.guestText, { color: theme.text }]}>No user logged in.</Text>
        <Pressable style={[styles.primaryBtn, { backgroundColor: theme.primary }]} onPress={() => router.push('/login' as any)}>
          <Text style={styles.primaryBtnText}>Log In</Text>
        </Pressable>
      </View>
    );
  }

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to log out?')) {
        logout();
        router.replace('/login' as any);
      }
    } else {
      Alert.alert('Log Out', 'Are you sure you want to log out of PulseTrack?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login' as any);
          },
        },
      ]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Hero Header */}
        <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              <Pressable style={[styles.editAvatarBadge, { backgroundColor: theme.primary }]} onPress={() => setEditModalVisible(true)}>
                <Ionicons name="camera-outline" size={14} color="#FFF" />
              </Pressable>
            </View>

            <View style={styles.profileDetails}>
              <Text style={[styles.nameText, { color: theme.text }]}>{user.name}</Text>
              <Text style={[styles.roleText, { color: theme.primary }]}>{user.role || 'Member'}</Text>
              <Text style={[styles.emailText, { color: theme.subtext }]}>{user.email}</Text>
            </View>
          </View>

          {user.bio ? (
            <Text style={[styles.bioText, { color: theme.subtext }]}>{user.bio}</Text>
          ) : null}

          {/* Quick Stats Bar */}
          <View style={[styles.statsBar, { backgroundColor: theme.input }]}>
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: theme.text }]}>{user.level}</Text>
              <Text style={[styles.statLabel, { color: theme.subtext }]}>Level</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: theme.text }]}>{user.points}</Text>
              <Text style={[styles.statLabel, { color: theme.subtext }]}>Points XP</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: theme.warning }]}>{user.streak}d 🔥</Text>
              <Text style={[styles.statLabel, { color: theme.subtext }]}>Streak</Text>
            </View>
          </View>

          {/* Edit Profile Action */}
          <Pressable
            style={({ pressed }) => [
              styles.editBtn,
              { backgroundColor: theme.primary + '15' },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => setEditModalVisible(true)}
          >
            <Ionicons name="pencil-outline" size={16} color={theme.primary} />
            <Text style={[styles.editBtnText, { color: theme.primary }]}>Edit Profile Details</Text>
          </Pressable>
        </View>

        {/* Interests */}
        {user.interests && user.interests.length > 0 ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Primary Interests</Text>
            <View style={styles.interestsRow}>
              {user.interests.map((interest, idx) => (
                <View key={idx} style={[styles.interestBadge, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                  <Ionicons name="checkmark-circle-outline" size={14} color={theme.primary} />
                  <Text style={[styles.interestText, { color: theme.text }]}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Achievements & Badges */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Achievements & Badges</Text>
          <View style={styles.badgesGrid}>
            {user.badges.map(badge => (
              <View
                key={badge.id}
                style={[
                  styles.badgeCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.cardBorder,
                    opacity: badge.unlocked ? 1 : 0.5,
                  },
                ]}
              >
                <View
                  style={[
                    styles.badgeIcon,
                    { backgroundColor: badge.unlocked ? theme.primary + '20' : theme.input },
                  ]}
                >
                  <Ionicons
                    name={badge.icon as any}
                    size={22}
                    color={badge.unlocked ? theme.primary : theme.subtext}
                  />
                </View>
                <Text style={[styles.badgeName, { color: theme.text }]}>{badge.name}</Text>
                <Text style={[styles.badgeDesc, { color: theme.subtext }]} numberOfLines={2}>
                  {badge.unlocked ? badge.description : 'Locked Milestone'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Account & Settings Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences & Security</Text>
          <View style={[styles.settingsGroup, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            {/* Dark Mode Switch */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconBg, { backgroundColor: '#8B5CF6' + '20' }]}>
                  <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color="#8B5CF6" />
                </View>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
              </View>
              <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: '#CBD5E1', true: theme.primary }} />
            </View>

            <View style={[styles.settingDivider, { backgroundColor: theme.border }]} />

            {/* Notifications Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconBg, { backgroundColor: '#10B981' + '20' }]}>
                  <Ionicons name="notifications-outline" size={18} color="#10B981" />
                </View>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Push Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#CBD5E1', true: theme.primary }}
              />
            </View>

            <View style={[styles.settingDivider, { backgroundColor: theme.border }]} />

            {/* Change Password */}
            <Pressable
              style={({ pressed }) => [styles.settingRow, pressed && { opacity: 0.7 }]}
              onPress={() => setPassModalVisible(true)}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconBg, { backgroundColor: '#F59E0B' + '20' }]}>
                  <Ionicons name="lock-closed-outline" size={18} color="#F59E0B" />
                </View>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.subtext} />
            </Pressable>
          </View>
        </View>

        {/* Logout Button */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutBtn,
            { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' },
            pressed && { opacity: 0.8 },
          ]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={styles.logoutBtnText}>Log Out Account</Text>
        </Pressable>
      </ScrollView>

      {/* Modals */}
      <EditProfileModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} />
      <ChangePasswordModal visible={passModalVisible} onClose={() => setPassModalVisible(false)} />
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
    alignItems: 'center',
    padding: 24,
  },
  guestText: {
    fontSize: 16,
    marginBottom: 16,
  },
  primaryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
  profileCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 14,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDetails: {
    flex: 1,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '800',
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  emailText: {
    fontSize: 13,
    marginTop: 2,
  },
  bioText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 14,
  },
  statCol: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  interestText: {
    fontSize: 13,
    fontWeight: '600',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeCard: {
    width: '48%',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  badgeIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '700',
  },
  badgeDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  settingsGroup: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  settingDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '700',
  },
});
