import { Theme } from '../types';
import { NEWS2_COLORS, QSOFA_COLORS } from './constants';

/**
 * Get the appropriate color for a NEWS2 score
 */
export const getNEWS2Color = (score: number | null): string => {
  if (score === null || score < 0) {
    return '#E5E5E5'; // Grey for invalid/null scores
  }
  
  // Clamp score to valid range
  const clampedScore = Math.min(Math.max(Math.floor(score), 0), 20);
  return NEWS2_COLORS[clampedScore as keyof typeof NEWS2_COLORS] || NEWS2_COLORS[0];
};

/**
 * Get the appropriate color for a q-SOFA score
 */
export const getQSOFAColor = (score: number | null): string => {
  if (score === null || score < 0) {
    return '#E5E5E5'; // Grey for invalid/null scores
  }
  
  // Clamp score to valid range
  const clampedScore = Math.min(Math.max(Math.floor(score), 0), 3);
  return QSOFA_COLORS[clampedScore as keyof typeof QSOFA_COLORS] || QSOFA_COLORS[0];
};

/**
 * Get risk level text color based on theme and risk level
 */
export const getRiskLevelColor = (
  theme: Theme,
  riskLevel: 'low' | 'medium' | 'high' | null
): string => {
  switch (riskLevel) {
    case 'low':
      return theme.colors.success;
    case 'medium':
      return theme.colors.warning;
    case 'high':
      return theme.colors.error;
    default:
      return theme.colors.textSecondary;
  }
};

/**
 * Create a gradient pattern for insufficient data display
 */
export const createInsufficientDataPattern = (theme: Theme) => ({
  backgroundColor: theme.colors.surface,
  borderColor: theme.colors.border,
  borderWidth: 1,
  borderStyle: 'dashed' as const,
  opacity: 0.6,
});

/**
 * Get appropriate text color for a given background color
 * Uses a simple luminance calculation to determine if text should be light or dark
 */
export const getContrastTextColor = (backgroundColor: string, theme: Theme): string => {
  // Remove # if present
  const hex = backgroundColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return appropriate text color
  return luminance > 0.5 ? theme.colors.text : theme.colors.background;
};

/**
 * Create theme-aware button styles
 */
export const createButtonStyles = (theme: Theme, variant: 'primary' | 'secondary' | 'outline' = 'primary') => {
  const baseStyle = {
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 44, // Accessibility touch target
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: theme.colors.primary,
      };
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
      };
    case 'outline':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
      };
    default:
      return baseStyle;
  }
};

/**
 * Create theme-aware input styles
 */
export const createInputStyles = (theme: Theme, hasError: boolean = false) => ({
  backgroundColor: theme.colors.surface,
  borderColor: hasError ? theme.colors.error : theme.colors.border,
  borderWidth: 1,
  borderRadius: theme.borderRadius.sm,
  paddingHorizontal: theme.spacing.md,
  paddingVertical: theme.spacing.sm,
  fontSize: theme.typography.fontSize.md,
  color: theme.colors.text,
  minHeight: 44, // Accessibility touch target
});

/**
 * Create theme-aware card styles
 */
export const createCardStyles = (theme: Theme, elevated: boolean = true) => ({
  backgroundColor: theme.colors.surface,
  borderRadius: theme.borderRadius.md,
  padding: theme.spacing.md,
  marginVertical: theme.spacing.sm,
  ...(elevated && {
    shadowColor: theme.colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }),
});

/**
 * Create theme-aware text styles
 */
export const createTextStyles = (theme: Theme) => ({
  body: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.normal,
  },
  bodySecondary: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
  },
  subtitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
  },
  caption: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
  },
});

/**
 * Interpolate between two colors based on a progress value (0-1)
 */
export const interpolateColor = (color1: string, color2: string, progress: number): string => {
  // Simple linear interpolation between two hex colors
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  
  const r = Math.round(r1 + (r2 - r1) * progress);
  const g = Math.round(g1 + (g2 - g1) * progress);
  const b = Math.round(b1 + (b2 - b1) * progress);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Create a gradient array for progress bars
 */
export const createProgressGradient = (startColor: string, endColor: string, steps: number = 10): string[] => {
  const gradient: string[] = [];
  
  for (let i = 0; i < steps; i++) {
    const progress = i / (steps - 1);
    gradient.push(interpolateColor(startColor, endColor, progress));
  }
  
  return gradient;
};

/**
 * Create theme-aware modal styles
 */
export const createModalStyles = (theme: Theme) => ({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.lg,
  },
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    maxWidth: 400,
    width: '100%',
    maxHeight: '80%',
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center' as const,
  },
  content: {
    marginBottom: theme.spacing.lg,
  },
  actions: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    gap: theme.spacing.md,
  },
});

/**
 * Create theme-aware progress bar styles
 */
export const createProgressBarStyles = (theme: Theme) => ({
  container: {
    height: 40,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden' as const,
    marginVertical: theme.spacing.sm,
  },
  fill: {
    height: '100%',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  text: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center' as const,
  },
  insufficientData: {
    backgroundColor: '#F5F5F5',
    borderStyle: 'dashed' as const,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    position: 'relative' as const,
  },
  insufficientDataText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
    fontStyle: 'italic' as const,
    zIndex: 2,
  },
});

/**
 * Create theme-aware toggle switch styles
 */
export const createToggleStyles = (theme: Theme) => ({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: theme.spacing.sm,
  },
  label: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginRight: theme.spacing.md,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
});

/**
 * Create theme-aware validation message styles
 */
export const createValidationStyles = (theme: Theme) => ({
  container: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error,
    fontWeight: theme.typography.fontWeight.medium,
  },
  warningText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.warning,
    fontWeight: theme.typography.fontWeight.medium,
  },
  successText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.success,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

/**
 * Create theme-aware field indicator styles
 */
export const createFieldIndicatorStyles = (theme: Theme) => ({
  container: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginTop: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  indicator: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  news2: {
    backgroundColor: theme.colors.news2,
    color: getContrastTextColor(theme.colors.news2, theme),
  },
  qsofa: {
    backgroundColor: theme.colors.qsofa,
    color: getContrastTextColor(theme.colors.qsofa, theme),
  },
  both: {
    backgroundColor: theme.colors.both,
    color: getContrastTextColor(theme.colors.both, theme),
  },
});

/**
 * Create theme-aware section styles
 */
export const createSectionStyles = (theme: Theme) => ({
  container: {
    marginVertical: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  content: {
    gap: theme.spacing.sm,
  },
});

/**
 * Utility to create theme-aware styles with proper typing
 */
export const createThemeStyles = <T extends Record<string, any>>(
  styleFactory: (theme: Theme) => T
) => {
  return styleFactory;
};