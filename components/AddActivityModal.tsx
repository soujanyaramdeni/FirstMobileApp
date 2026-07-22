import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, Activity } from '@/context/AuthContext';
import { Colors, CategoryColors } from '@/constants/theme';

interface AddActivityModalProps {
  visible: boolean;
  onClose: () => void;
}

const CATEGORIES: Activity['category'][] = [
  'Workout',
  'Coding',
  'Reading',
  'Productivity',
  'Mindfulness',
  'Other',
];

const PRESET_DURATIONS = [15, 30, 45, 60, 90, 120];

export const AddActivityModal: React.FC<AddActivityModalProps> = ({ visible, onClose }) => {
  const { addActivity, themeMode } = useAuth();
  const isDark = themeMode === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Activity['category']>('Workout');
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!title.trim()) {
      setError('Please enter an activity title');
      return;
    }

    const calculatedPoints = Math.round(duration * 2.5);

    addActivity({
      title: title.trim(),
      category,
      duration,
      points: calculatedPoints,
      date: new Date().toISOString(),
      notes: notes.trim() || undefined,
    });

    // Reset & close
    setTitle('');
    setNotes('');
    setError('');
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
            <Text style={[styles.headerTitle, { color: theme.text }]}>Log New Activity</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={theme.subtext} />
            </Pressable>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Title Input */}
            <Text style={[styles.label, { color: theme.text }]}>Activity Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
              placeholder="e.g. 5km Morning Run, React Native UI"
              placeholderTextColor={theme.subtext}
              value={title}
              onChangeText={t => {
                setTitle(t);
                setError('');
              }}
            />

            {/* Category Selector */}
            <Text style={[styles.label, { color: theme.text }]}>Category</Text>
            <View style={styles.categoryContainer}>
              {CATEGORIES.map(cat => {
                const meta = CategoryColors[cat];
                const isSelected = category === cat;
                return (
                  <Pressable
                    key={cat}
                    style={[
                      styles.categoryChip,
                      { backgroundColor: isSelected ? theme.primary : theme.input },
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Ionicons
                      name={meta.icon as any}
                      size={16}
                      color={isSelected ? '#FFF' : theme.text}
                    />
                    <Text
                      style={[
                        styles.categoryChipText,
                        { color: isSelected ? '#FFF' : theme.text },
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Duration Selector */}
            <Text style={[styles.label, { color: theme.text }]}>Duration (Minutes)</Text>
            <View style={styles.durationPresets}>
              {PRESET_DURATIONS.map(d => (
                <Pressable
                  key={d}
                  style={[
                    styles.durationChip,
                    {
                      backgroundColor: duration === d ? theme.primary : theme.input,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setDuration(d)}
                >
                  <Text style={{ color: duration === d ? '#FFF' : theme.text, fontWeight: '600' }}>
                    {d} m
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Notes */}
            <Text style={[styles.label, { color: theme.text }]}>Notes / Reflection (Optional)</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: theme.input, color: theme.text, borderColor: theme.border },
              ]}
              placeholder="What did you achieve or learn during this session?"
              placeholderTextColor={theme.subtext}
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />

            {/* Points Estimate */}
            <View style={[styles.xpEstimate, { backgroundColor: theme.primary + '15' }]}>
              <Ionicons name="sparkles" size={20} color={theme.primary} />
              <Text style={[styles.xpText, { color: theme.primary }]}>
                Estimated Reward: +{Math.round(duration * 2.5)} XP
              </Text>
            </View>
          </ScrollView>

          {/* Submit */}
          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.saveBtn,
                { backgroundColor: theme.primary },
                pressed && { opacity: 0.9 },
              ]}
              onPress={handleSave}
            >
              <Text style={styles.saveBtnText}>Save Activity</Text>
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
  errorText: {
    color: '#EF4444',
    marginBottom: 12,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
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
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  durationPresets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  xpEstimate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 14,
    marginTop: 16,
    marginBottom: 10,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
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
