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

export default function LoginScreen() {
  const router = useRouter();
  const { login, quickLogin, themeMode } = useAuth();
  const isDark = themeMode === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const res = await login(email, password);
    if (!res.success) {
      setError(res.message);
    } else {
      setError('');
      router.replace('/(tabs)' as any);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    quickLogin(demoEmail);
    router.replace('/(tabs)' as any);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Banner */}
        <View style={styles.brandHeader}>
          <View style={[styles.logoBadge, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="flash" size={32} color={theme.primary} />
          </View>
          <Text style={[styles.brandTitle, { color: theme.text }]}>PulseTrack</Text>
          <Text style={[styles.brandSubtitle, { color: theme.subtext }]}>
            Welcome back! Sign in to continue your streak.
          </Text>
        </View>

        {/* Card Form */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Sign In</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={18} color="#DC2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Email Input */}
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

          {/* Password Input */}
          <Text style={[styles.label, { color: theme.text }]}>Password</Text>
          <View style={[styles.inputGroup, { backgroundColor: theme.input, borderColor: theme.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.subtext} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Enter your password"
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

          {/* Options Row */}
          <View style={styles.optionsRow}>
            <Pressable style={styles.rememberGroup} onPress={() => setRememberMe(!rememberMe)}>
              <Ionicons
                name={rememberMe ? 'checkbox' : 'square-outline'}
                size={20}
                color={rememberMe ? theme.primary : theme.subtext}
              />
              <Text style={[styles.rememberText, { color: theme.subtext }]}>Remember me</Text>
            </Pressable>

            <Pressable onPress={() => setError('Password reset instructions sent to your email.')}>
              <Text style={[styles.forgotText, { color: theme.primary }]}>Forgot password?</Text>
            </Pressable>
          </View>

          {/* Submit Button */}
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: theme.primary },
              pressed && { opacity: 0.9 },
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.primaryBtnText}>Sign In</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFF" />
          </Pressable>
        </View>

        {/* Demo Accounts Bar */}
        <View style={[styles.demoBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.demoHeader, { color: theme.subtext }]}>⚡ Quick Demo Sign-In</Text>
          <View style={styles.demoButtons}>
            <Pressable
              style={[styles.demoBtn, { backgroundColor: theme.primary + '15' }]}
              onPress={() => handleQuickLogin('alex@example.com')}
            >
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                }}
                style={styles.demoAvatar}
              />
              <Text style={[styles.demoBtnText, { color: theme.primary }]}>Alex (Designer)</Text>
            </Pressable>

            <Pressable
              style={[styles.demoBtn, { backgroundColor: theme.success + '15' }]}
              onPress={() => handleQuickLogin('sarah@example.com')}
            >
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                }}
                style={styles.demoAvatar}
              />
              <Text style={[styles.demoBtnText, { color: theme.success }]}>Sarah (Dev)</Text>
            </Pressable>
          </View>
        </View>

        {/* Register Switch Link */}
        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: theme.subtext }]}>
            Don't have an account yet?{' '}
          </Text>
          <Pressable onPress={() => router.push('/register' as any)}>
            <Text style={[styles.linkText, { color: theme.primary }]}>Create Account</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  brandSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
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
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
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
    marginTop: 6,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  rememberGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rememberText: {
    fontSize: 13,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 16,
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  demoBox: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  demoHeader: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  demoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
  },
  demoAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  demoBtnText: {
    fontSize: 13,
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
