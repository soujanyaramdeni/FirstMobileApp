import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose }) => {
  const { user, updateProfile, themeMode } = useAuth();
  const isDark = themeMode === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [role, setRole] = useState(user?.role || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || AVATAR_PRESETS[0]);

  const handleSave = () => {
    if (!name.trim()) return;
    updateProfile({
      name: name.trim(),
      bio: bio.trim(),
      role: role.trim(),
      avatar: selectedAvatar,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[styles.content, { backgroundColor: theme.card }]}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Profile</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={theme.subtext} />
            </Pressable>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Avatar Selector */}
            <Text style={[styles.label, { color: theme.text }]}>Choose Avatar</Text>
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

            {/* Name */}
            <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={theme.subtext}
            />

            {/* Role / Occupation */}
            <Text style={[styles.label, { color: theme.text }]}>Title / Profession</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
              value={role}
              onChangeText={setRole}
              placeholder="e.g. Software Engineer, Designer, Student"
              placeholderTextColor={theme.subtext}
            />

            {/* Bio */}
            <Text style={[styles.label, { color: theme.text }]}>Short Bio</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: theme.input, color: theme.text, borderColor: theme.border },
              ]}
              value={bio}
              onChangeText={setBio}
              placeholder="Share a quick line about yourself..."
              placeholderTextColor={theme.subtext}
              multiline
              numberOfLines={3}
            />
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.saveBtn,
                { backgroundColor: theme.primary },
                pressed && { opacity: 0.9 },
              ]}
              onPress={handleSave}
            >
              <Text style={styles.saveBtnText}>Save Profile Changes</Text>
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
    maxHeight: '90%',
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  avatarWrapper: {
    borderRadius: 30,
    padding: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
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
