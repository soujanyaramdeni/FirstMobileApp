import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
];

const INTEREST_OPTIONS = ['Coding', 'Fitness', 'Productivity', 'Reading', 'Mindfulness'];

export default function RegisterScreen() {
  const router = useRouter();
  const { register, themeMode } = useAuth();
  const isDark = themeMode === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Coding', 'Fitness']);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleRegister = () => {
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreedTerms) {
      setError('You must agree to the Terms of Service to register.');
      return;
    }

    const res = register({
      name,
      email,
      password,
      bio,
      avatar: selectedAvatar,
      interests: selectedInterests,
    });

    if (!res.success) {
      setError(res.message);
    } else {
      setError('');
      router.replace('/(tabs)' as any);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </Pressable>
          <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.subtext }]}>
            Join thousands tracking daily growth and habits
          </Text>
        </View>

        {/* Card Form */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={18} color="#DC2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Avatar Choice */}
          <Text style={[styles.label, { color: theme.text }]}>Pick Avatar</Text>
          <View style={styles.avatarRow}>
            {AVATAR_PRESETS.map((url, idx) => {
              const isSelected = selectedAvatar === url;
              return (
                <Pressable
                  key={idx}
                  onPress={() => setSelectedAvatar(url)}
                  style={[
                    styles.avatarWrapper,
                    isSelected && { borderColor: theme.primary, borderWidth: 3 },
                  ]}
                >
                  <Image source={{ uri: url }} style={styles.avatarImage} />
                </Pressable>
              );
            })}
          </View>

          {/* Full Name */}
          <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
          <View style={[styles.inputGroup, { backgroundColor: theme.input, borderColor: theme.border }]}>
            <Ionicons name="person-outline" size={20} color={theme.subtext} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="e.g. Alex Morgan"
              placeholderTextColor={theme.subtext}
              value={name}
              onChangeText={t => {
                setName(t);
                setError('');
              }}
            />
          </View>

          {/* Email */}
          <Text style={[styles.label, { color: theme.text }]}>Email Address</Text>
          <View style={[styles.inputGroup, { backgroundColor: theme.input, borderColor: theme.border }]}>
            <Ionicons name="mail-outline" size={20} color={theme.subtext} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="alex@example.com"
              placeholderTextColor={theme.subtext}
              value={email}
              onChangeText={t => {
                setEmail(t);
                setError('');
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <Text style={[styles.label, { color: theme.text }]}>Password</Text>
          <View style={[styles.inputGroup, { backgroundColor: theme.input, borderColor: theme.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.subtext} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Minimum 6 characters"
              placeholderTextColor={theme.subtext}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={t => {
                setPassword(t);
                setError('');
              }}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={theme.subtext}
              />
            </Pressable>
          </View>

          {/* Confirm Password */}
          <Text style={[styles.label, { color: theme.text }]}>Confirm Password</Text>
          <View style={[styles.inputGroup, { backgroundColor: theme.input, borderColor: theme.border }]}>
            <Ionicons name="shield-checkmark-outline" size={20} color={theme.subtext} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Re-enter password"
              placeholderTextColor={theme.subtext}
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={t => {
                setConfirmPassword(t);
                setError('');
              }}
            />
          </View>

          {/* Interests selection */}
          <Text style={[styles.label, { color: theme.text }]}>Primary Focus / Interests</Text>
          <View style={styles.interestsRow}>
            {INTEREST_OPTIONS.map(interest => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <Pressable
                  key={interest}
                  style={[
                    styles.interestChip,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.input,
                    },
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text style={{ color: isSelected ? '#FFF' : theme.text, fontWeight: '600', fontSize: 13 }}>
                    {interest}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Bio */}
          <Text style={[styles.label, { color: theme.text }]}>Personal Goal / Bio (Optional)</Text>
          <View style={[styles.inputGroup, { backgroundColor: theme.input, borderColor: theme.border }]}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="e.g. Aiming for 30 days of consistent coding & workouts"
              placeholderTextColor={theme.subtext}
              value={bio}
              onChangeText={setBio}
            />
          </View>

          {/* Terms checkbox */}
          <Pressable style={styles.termsGroup} onPress={() => setAgreedTerms(!agreedTerms)}>
            <Ionicons
              name={agreedTerms ? 'checkbox' : 'square-outline'}
              size={20}
              color={agreedTerms ? theme.primary : theme.subtext}
            />
            <Text style={[styles.termsText, { color: theme.subtext }]}>
              I agree to the <Text style={{ color: theme.primary, fontWeight: '600' }}>Terms of Service</Text> and Privacy Policy
            </Text>
          </Pressable>

          {/* Submit button */}
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: theme.primary },
              pressed && { opacity: 0.9 },
            ]}
            onPress={handleRegister}
          >
            <Text style={styles.primaryBtnText}>Register & Get Started</Text>
            <Ionicons name="sparkles" size={18} color="#FFF" />
          </Pressable>
        </View>

        {/* Login Switch Link */}
        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: theme.subtext }]}>Already have an account? </Text>
          <Pressable onPress={() => router.push('/login' as any)}>
            <Text style={[styles.linkText, { color: theme.primary }]}>Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  backBtn: {
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
  },
  card: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 20,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  avatarWrapper: {
    borderRadius: 26,
    padding: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  interestChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  termsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 14,
  },
  termsText: {
    fontSize: 13,
    flex: 1,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 8,
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
