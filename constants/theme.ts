import { Platform } from 'react-native';

export const Palette = {
  primary: '#6366F1', // Indigo primary accent
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',
  secondary: '#10B981', // Emerald green
  secondaryLight: '#34D399',
  accent: '#F59E0B', // Amber
  danger: '#EF4444', // Red / Rose
  dangerLight: '#FCA5A5',
  purple: '#8B5CF6',
  pink: '#EC4899',
  cyan: '#06B6D4',
  
  // Neutral dark
  darkBg: '#0F172A',
  darkCard: '#1E293B',
  darkCardBorder: '#334155',
  darkInput: '#1E293B',
  darkText: '#F8FAFC',
  darkSubtext: '#94A3B8',

  // Neutral light
  lightBg: '#F8FAFC',
  lightCard: '#FFFFFF',
  lightCardBorder: '#E2E8F0',
  lightInput: '#F1F5F9',
  lightText: '#0F172A',
  lightSubtext: '#64748B',
};

export const CategoryColors: Record<string, { bg: string; text: string; icon: string }> = {
  Workout: { bg: '#FEE2E2', text: '#DC2626', icon: 'fitness-outline' },
  Coding: { bg: '#E0E7FF', text: '#4338CA', icon: 'code-slash-outline' },
  Reading: { bg: '#FEF3C7', text: '#D97706', icon: 'book-outline' },
  Productivity: { bg: '#D1FAE5', text: '#059669', icon: 'briefcase-outline' },
  Mindfulness: { bg: '#F3E8FF', text: '#7C3AED', icon: 'heart-outline' },
  Other: { bg: '#E2E8F0', text: '#475569', icon: 'grid-outline' },
};

export const Colors = {
  light: {
    text: Palette.lightText,
    subtext: Palette.lightSubtext,
    background: Palette.lightBg,
    card: Palette.lightCard,
    cardBorder: Palette.lightCardBorder,
    input: Palette.lightInput,
    tint: Palette.primary,
    tabIconDefault: '#94A3B8',
    tabIconSelected: Palette.primary,
    border: '#E2E8F0',
    primary: Palette.primary,
    success: Palette.secondary,
    warning: Palette.accent,
    danger: Palette.danger,
  },
  dark: {
    text: Palette.darkText,
    subtext: Palette.darkSubtext,
    background: Palette.darkBg,
    card: Palette.darkCard,
    cardBorder: Palette.darkCardBorder,
    input: Palette.darkInput,
    tint: Palette.primaryLight,
    tabIconDefault: '#64748B',
    tabIconSelected: Palette.primaryLight,
    border: '#334155',
    primary: Palette.primaryLight,
    success: Palette.secondaryLight,
    warning: Palette.accent,
    danger: Palette.danger,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', sans-serif",
    mono: "Consolas, 'Courier New', monospace",
  },
});
