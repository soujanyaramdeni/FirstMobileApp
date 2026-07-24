import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ visible, onClose }) => {
  const { themeMode, user, updateProfile } = useAuth();
  const isDark = themeMode === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ isError: boolean; text: string } | null>(null);

  const handleSubmit = () => {
    if (!currentPass || !newPass || !confirmPass) {
      setStatusMsg({ isError: true, text: 'Please fill in all password fields.' });
      return;
    }

    if (currentPass !== user?.password) {
      setStatusMsg({ isError: true, text: 'Current password is incorrect.' });
      return;
    }

    if (newPass.length < 6) {
      setStatusMsg({ isError: true, text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPass !== confirmPass) {
      setStatusMsg({ isError: true, text: 'New password and confirmation do not match.' });
      return;
    }

    updateProfile({ password: newPass });
    setStatusMsg({ isError: false, text: 'Password successfully updated!' });
    setTimeout(() => {
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setStatusMsg(null);
      onClose();
    }, 1200);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[styles.content, { backgroundColor: theme.card }]}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Security & Password</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={theme.subtext} />
            </Pressable>
          </View>

          <View style={styles.body}>
            {statusMsg ? (
              <View
                style={[
                  styles.msgContainer,
                  { backgroundColor: statusMsg.isError ? '#FEE2E2' : '#D1FAE5' },
                ]}
              >
                <Text
                  style={[
                    styles.msgText,
                    { color: statusMsg.isError ? '#DC2626' : '#059669' },
                  ]}
                >
                  {statusMsg.text}
                </Text>
              </View>
            ) : null}

            <Text style={[styles.label, { color: theme.text }]}>Current Password</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.input, borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                secureTextEntry={!showPass}
                value={currentPass}
                onChangeText={setCurrentPass}
                placeholder="••••••••"
                placeholderTextColor={theme.subtext}
              />
              <Pressable onPress={() => setShowPass(!showPass)}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.subtext} />
              </Pressable>
            </View>

            <Text style={[styles.label, { color: theme.text }]}>New Password</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.input, borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                secureTextEntry={!showPass}
                value={newPass}
                onChangeText={setNewPass}
                placeholder="At least 6 characters"
                placeholderTextColor={theme.subtext}
              />
            </View>

            <Text style={[styles.label, { color: theme.text }]}>Confirm New Password</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.input, borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                secureTextEntry={!showPass}
                value={confirmPass}
                onChangeText={setConfirmPass}
                placeholder="Re-enter new password"
                placeholderTextColor={theme.subtext}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.saveBtn,
                { backgroundColor: theme.primary },
                pressed && { opacity: 0.9 },
              ]}
              onPress={handleSubmit}
            >
              <Text style={styles.saveBtnText}>Update Password</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150,150,150,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  msgContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  msgText: {
    fontSize: 14,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
