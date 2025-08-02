import { Dimensions, Platform } from 'react-native';
import { Theme } from '../types';

// Get device dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Breakpoints for responsive design
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
} as const;

// Device type detection
export const getDeviceType = () => {
  if (Platform.OS === 'web') {
    if (screenWidth >= BREAKPOINTS.desktop) return 'desktop';
    if (screenWidth >= BREAKPOINTS.tablet) return 'tablet';
    return 'mobile';
  }
  
  // For native platforms, use screen dimensions
  if (screenWidth >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
};

// Responsive value selector
export const responsive = <T>(values: {
  mobile: T;
  tablet?: T;
  desktop?: T;
}): T => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'desktop':
      return values.desktop ?? values.tablet ?? values.mobile;
    case 'tablet':
      return values.tablet ?? values.mobile;
    default:
      return values.mobile;
  }
};

// Scale function for responsive sizing
export const scale = (size: number, factor: number = 1): number => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'desktop':
      return size * factor * 1.2;
    case 'tablet':
      return size * factor * 1.1;
    default:
      return size * factor;
  }
};

// Responsive spacing helper
export const getResponsiveSpacing = (theme: Theme, size: keyof Theme['spacing']) => {
  const baseSpacing = theme.spacing[size];
  return responsive({
    mobile: baseSpacing,
    tablet: baseSpacing * 1.2,
    desktop: baseSpacing * 1.4,
  });
};

// Responsive font size helper
export const getResponsiveFontSize = (theme: Theme, size: keyof Theme['typography']['fontSize']) => {
  const baseFontSize = theme.typography.fontSize[size];
  return responsive({
    mobile: baseFontSize,
    tablet: baseFontSize * 1.1,
    desktop: baseFontSize * 1.2,
  });
};

// Platform-specific styling helpers
export const platformStyles = {
  // Shadow styles that work across platforms
  shadow: (elevation: number = 2) => {
    if (Platform.OS === 'ios') {
      return {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: elevation,
        },
        shadowOpacity: 0.1,
        shadowRadius: elevation * 2,
      };
    } else {
      return {
        elevation,
      };
    }
  },
  
  // Border radius that adapts to platform conventions
  borderRadius: (theme: Theme, size: keyof Theme['borderRadius'] = 'md') => {
    const baseRadius = theme.borderRadius[size];
    return Platform.select({
      ios: baseRadius,
      android: baseRadius * 0.8,
      web: baseRadius,
      default: baseRadius,
    });
  },
  
  // Touch target sizing for accessibility
  touchTarget: {
    minHeight: Platform.select({
      ios: 44,
      android: 48,
      web: 44,
      default: 44,
    }),
    minWidth: Platform.select({
      ios: 44,
      android: 48,
      web: 44,
      default: 44,
    }),
  },
};

// Utility for creating theme-aware styles
export const createThemedStyles = <T extends Record<string, any>>(
  styleFactory: (theme: Theme) => T
) => {
  return (theme: Theme): T => styleFactory(theme);
};

// Enhanced responsive layout creator with better theme integration
export const createEnhancedResponsiveLayout = (theme: Theme) => {
  const baseLayout = createResponsiveLayout(theme);
  
  return {
    ...baseLayout,
    
    // Enhanced container with safe area support
    safeContainer: {
      ...baseLayout.container,
      paddingTop: getSafeAreaInsets().top,
      paddingBottom: getSafeAreaInsets().bottom,
    },
    
    // Floating action button
    fab: {
      position: 'absolute' as const,
      bottom: getResponsiveSpacing(theme, 'lg'),
      right: getResponsiveSpacing(theme, 'lg'),
      backgroundColor: theme.colors.primary,
      borderRadius: 28,
      width: 56,
      height: 56,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      ...platformStyles.shadow(4),
    },
    
    // Enhanced card with better spacing
    enhancedCard: {
      ...baseLayout.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    
    // Section divider
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: getResponsiveSpacing(theme, 'md'),
    },
    
    // List item
    listItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingVertical: getResponsiveSpacing(theme, 'md'),
      paddingHorizontal: getResponsiveSpacing(theme, 'lg'),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    
    // Badge
    badge: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: getResponsiveSpacing(theme, 'sm'),
      paddingVertical: getResponsiveSpacing(theme, 'xs'),
      minWidth: 20,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    
    // Badge text
    badgeText: {
      color: theme.colors.background,
      fontSize: getResponsiveFontSize(theme, 'xs'),
      fontWeight: theme.typography.fontWeight.bold,
    },
  };
};

// Helper for creating responsive layouts
export const createResponsiveLayout = (theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: getResponsiveSpacing(theme, 'md'),
    paddingVertical: getResponsiveSpacing(theme, 'sm'),
  },
  
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: platformStyles.borderRadius(theme),
    padding: getResponsiveSpacing(theme, 'md'),
    marginVertical: getResponsiveSpacing(theme, 'sm'),
    ...platformStyles.shadow(2),
  },
  
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: platformStyles.borderRadius(theme, 'sm'),
    paddingHorizontal: getResponsiveSpacing(theme, 'lg'),
    paddingVertical: getResponsiveSpacing(theme, 'md'),
    ...platformStyles.touchTarget,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  buttonText: {
    color: theme.colors.background,
    fontSize: getResponsiveFontSize(theme, 'md'),
    fontWeight: theme.typography.fontWeight.medium,
  },
  
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: platformStyles.borderRadius(theme, 'sm'),
    paddingHorizontal: getResponsiveSpacing(theme, 'md'),
    paddingVertical: getResponsiveSpacing(theme, 'sm'),
    fontSize: getResponsiveFontSize(theme, 'md'),
    color: theme.colors.text,
    ...platformStyles.touchTarget,
  },
  
  text: {
    color: theme.colors.text,
    fontSize: getResponsiveFontSize(theme, 'md'),
  },
  
  textSecondary: {
    color: theme.colors.textSecondary,
    fontSize: getResponsiveFontSize(theme, 'sm'),
  },
  
  title: {
    color: theme.colors.text,
    fontSize: getResponsiveFontSize(theme, 'xl'),
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: getResponsiveSpacing(theme, 'md'),
  },
  
  subtitle: {
    color: theme.colors.text,
    fontSize: getResponsiveFontSize(theme, 'lg'),
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: getResponsiveSpacing(theme, 'sm'),
  },
});

// Screen dimension utilities
export const screenDimensions = {
  width: screenWidth,
  height: screenHeight,
  isSmallScreen: screenWidth < 375,
  isLargeScreen: screenWidth >= BREAKPOINTS.tablet,
  isLandscape: screenWidth > screenHeight,
  isPortrait: screenHeight > screenWidth,
};

// Safe area utilities for different platforms
export const getSafeAreaInsets = () => {
  // This would typically use react-native-safe-area-context
  // For now, providing default values
  return responsive({
    mobile: {
      top: Platform.OS === 'ios' ? 44 : 24,
      bottom: Platform.OS === 'ios' ? 34 : 0,
      left: 0,
      right: 0,
    },
    tablet: {
      top: Platform.OS === 'ios' ? 24 : 24,
      bottom: Platform.OS === 'ios' ? 20 : 0,
      left: 0,
      right: 0,
    },
  });
};