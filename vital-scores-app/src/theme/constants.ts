import { Theme, ThemeColors } from '../types';

// Light theme colors
const lightColors: ThemeColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textSecondary: '#6D6D70',
  border: '#C6C6C8',
  error: '#FF3B30',
  warning: '#FF9500',
  success: '#34C759',
  news2: '#007AFF',    // Blue for NEWS2
  qsofa: '#34C759',    // Green for q-SOFA
  both: '#5856D6',     // Purple for fields used by both
  onPrimary: '#FFFFFF',
  onError: '#FFFFFF',
};

// Dark theme colors
const darkColors: ThemeColors = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  error: '#FF453A',
  warning: '#FF9F0A',
  success: '#30D158',
  news2: '#0A84FF',    // Blue for NEWS2
  qsofa: '#30D158',    // Green for q-SOFA
  both: '#5E5CE6',     // Purple for fields used by both
  onPrimary: '#FFFFFF',
  onError: '#FFFFFF',
};

// Common theme properties
const commonTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      bold: '700',
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  animation: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 350,
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
};

// Light theme
export const lightTheme: Theme = {
  colors: lightColors,
  ...commonTheme,
};

// Dark theme
export const darkTheme: Theme = {
  colors: darkColors,
  ...commonTheme,
};

// NEWS2 score color mapping (based on official NEWS2 reference sheet)
export const NEWS2_COLORS = {
  0: '#E5E5E5',      // Neutral/Grey
  1: '#FFEB3B',      // Yellow
  2: '#FFEB3B',      // Yellow
  3: '#FFEB3B',      // Yellow
  4: '#FFEB3B',      // Yellow
  5: '#FF9800',      // Orange
  6: '#FF9800',      // Orange
  7: '#FF5722',      // Dark Orange/Red
  8: '#FF5722',      // Dark Orange/Red
  9: '#FF5722',      // Dark Orange/Red
  10: '#FF5722',     // Dark Orange/Red
  11: '#FF5722',     // Dark Orange/Red
  12: '#FF5722',     // Dark Orange/Red
  13: '#FF5722',     // Dark Orange/Red
  14: '#FF5722',     // Dark Orange/Red
  15: '#FF5722',     // Dark Orange/Red
  16: '#FF5722',     // Dark Orange/Red
  17: '#FF5722',     // Dark Orange/Red
  18: '#FF5722',     // Dark Orange/Red
  19: '#FF5722',     // Dark Orange/Red
  20: '#FF5722',     // Dark Orange/Red
};

// q-SOFA score color mapping (green to red gradient)
export const QSOFA_COLORS = {
  0: '#4CAF50',      // Green (low risk)
  1: '#8BC34A',      // Light green
  2: '#FF5722',      // Red (high risk - sepsis concern)
  3: '#D32F2F',      // Dark red (high risk)
};

// Physiological validation ranges
export const VALIDATION_RANGES = {
  respiratoryRate: { min: 0, max: 60 },
  heartRate: { min: 0, max: 300 },
  systolicBP: { min: 50, max: 300 },
  temperature: { min: 25, max: 45 },
  oxygenSaturation: { min: 70, max: 100 },
};

// Insufficient data pattern (for progress bars)
export const INSUFFICIENT_DATA_PATTERN = 'diagonal-lines';

// Export theme utilities
export * from './utils';