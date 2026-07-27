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
  teal: '#14B8A6',
  
  // Neutral dark
  darkBg: '#0B0F19',
  darkCard: '#151D2A',
  darkCardBorder: '#232D3F',
  darkInput: '#1A2332',
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

export const CategoryColors: Record<string, { bg: string; text: string; icon: string; accent: string }> = {
  Workout: { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', icon: 'fitness-outline', accent: '#EF4444' },
  Coding: { bg: 'rgba(99, 102, 241, 0.15)', text: '#6366F1', icon: 'code-slash-outline', accent: '#6366F1' },
  Reading: { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', icon: 'book-outline', accent: '#F59E0B' },
  Productivity: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', icon: 'briefcase-outline', accent: '#10B981' },
  Mindfulness: { bg: 'rgba(139, 92, 246, 0.15)', text: '#8B5CF6', icon: 'heart-outline', accent: '#8B5CF6' },
  Other: { bg: 'rgba(6, 182, 212, 0.15)', text: '#06B6D4', icon: 'grid-outline', accent: '#06B6D4' },
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
    purple: Palette.purple,
    pink: Palette.pink,
    cyan: Palette.cyan,
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
    border: '#232D3F',
    primary: Palette.primaryLight,
    success: Palette.secondaryLight,
    warning: Palette.accent,
    danger: Palette.danger,
    purple: Palette.purple,
    pink: Palette.pink,
    cyan: Palette.cyan,
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
