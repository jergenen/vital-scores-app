import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { 
  createButtonStyles,
  createInputStyles,
  createCardStyles,
  createTextStyles,
  createModalStyles,
  createProgressBarStyles,
  createToggleStyles,
  createValidationStyles,
  createFieldIndicatorStyles,
  createSectionStyles,
} from '../theme/utils';
import { 
  createResponsiveLayout,
  createEnhancedResponsiveLayout,
  getResponsiveSpacing,
  getResponsiveFontSize,
  platformStyles,
} from '../utils/responsive';

/**
 * Custom hook that provides comprehensive theme-aware styles
 * This hook memoizes all style objects to prevent unnecessary re-renders
 */
export function useThemeStyles() {
  const { theme, isDark } = useTheme();

  const styles = useMemo(() => {
    const buttonStyles = createButtonStyles(theme);
    const textStyles = createTextStyles(theme);
    const modalStyles = createModalStyles(theme);
    const progressBarStyles = createProgressBarStyles(theme);
    const toggleStyles = createToggleStyles(theme);
    const validationStyles = createValidationStyles(theme);
    const fieldIndicatorStyles = createFieldIndicatorStyles(theme);
    const sectionStyles = createSectionStyles(theme);
    const responsiveLayout = createResponsiveLayout(theme);
    const enhancedLayout = createEnhancedResponsiveLayout(theme);

    return StyleSheet.create({
      // Layout styles
      container: responsiveLayout.container,
      safeContainer: enhancedLayout.safeContainer,
      card: responsiveLayout.card,
      enhancedCard: enhancedLayout.enhancedCard,
      divider: enhancedLayout.divider,
      listItem: enhancedLayout.listItem,
      
      // Button styles
      primaryButton: buttonStyles.primary,
      secondaryButton: buttonStyles.secondary,
      outlineButton: buttonStyles.outline,
      buttonText: {
        color: theme.colors.background,
        fontSize: getResponsiveFontSize(theme, 'md'),
        fontWeight: theme.typography.fontWeight.medium,
      },
      secondaryButtonText: {
        color: theme.colors.text,
        fontSize: getResponsiveFontSize(theme, 'md'),
        fontWeight: theme.typography.fontWeight.medium,
      },
      outlineButtonText: {
        color: theme.colors.primary,
        fontSize: getResponsiveFontSize(theme, 'md'),
        fontWeight: theme.typography.fontWeight.medium,
      },
      
      // Input styles
      input: createInputStyles(theme),
      inputError: createInputStyles(theme, true),
      inputLabel: {
        fontSize: getResponsiveFontSize(theme, 'sm'),
        fontWeight: theme.typography.fontWeight.medium,
        color: theme.colors.text,
        marginBottom: getResponsiveSpacing(theme, 'xs'),
      },
      
      // Text styles
      bodyText: textStyles.body,
      bodySecondaryText: textStyles.bodySecondary,
      titleText: textStyles.title,
      subtitleText: textStyles.subtitle,
      captionText: textStyles.caption,
      
      // Modal styles
      modalOverlay: modalStyles.overlay,
      modalContainer: modalStyles.container,
      modalHeader: modalStyles.header,
      modalTitle: modalStyles.title,
      modalContent: modalStyles.content,
      modalActions: modalStyles.actions,
      
      // Progress bar styles
      progressBarContainer: progressBarStyles.container,
      progressBarFill: progressBarStyles.fill,
      progressBarText: progressBarStyles.text,
      progressBarInsufficientData: progressBarStyles.insufficientData,
      progressBarInsufficientDataText: progressBarStyles.insufficientDataText,
      
      // Toggle styles
      toggleContainer: toggleStyles.container,
      toggleLabel: toggleStyles.label,
      toggleSwitch: toggleStyles.switch,
      
      // Validation styles
      validationContainer: validationStyles.container,
      validationError: validationStyles.errorText,
      validationWarning: validationStyles.warningText,
      validationSuccess: validationStyles.successText,
      
      // Field indicator styles
      fieldIndicatorContainer: fieldIndicatorStyles.container,
      fieldIndicator: fieldIndicatorStyles.indicator,
      fieldIndicatorNews2: {
        ...fieldIndicatorStyles.indicator,
        ...fieldIndicatorStyles.news2,
      },
      fieldIndicatorQsofa: {
        ...fieldIndicatorStyles.indicator,
        ...fieldIndicatorStyles.qsofa,
      },
      fieldIndicatorBoth: {
        ...fieldIndicatorStyles.indicator,
        ...fieldIndicatorStyles.both,
      },
      
      // Section styles
      sectionContainer: sectionStyles.container,
      sectionHeader: sectionStyles.header,
      sectionTitle: sectionStyles.title,
      sectionSubtitle: sectionStyles.subtitle,
      sectionContent: sectionStyles.content,
      
      // Badge styles
      badge: enhancedLayout.badge,
      badgeText: enhancedLayout.badgeText,
      
      // Floating action button
      fab: enhancedLayout.fab,
      
      // Utility styles
      centerContent: {
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      },
      row: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
      },
      spaceBetween: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
      },
      flex1: {
        flex: 1,
      },
      
      // Spacing utilities
      marginXs: { margin: getResponsiveSpacing(theme, 'xs') },
      marginSm: { margin: getResponsiveSpacing(theme, 'sm') },
      marginMd: { margin: getResponsiveSpacing(theme, 'md') },
      marginLg: { margin: getResponsiveSpacing(theme, 'lg') },
      marginXl: { margin: getResponsiveSpacing(theme, 'xl') },
      
      paddingXs: { padding: getResponsiveSpacing(theme, 'xs') },
      paddingSm: { padding: getResponsiveSpacing(theme, 'sm') },
      paddingMd: { padding: getResponsiveSpacing(theme, 'md') },
      paddingLg: { padding: getResponsiveSpacing(theme, 'lg') },
      paddingXl: { padding: getResponsiveSpacing(theme, 'xl') },
      
      // Shadow utilities
      shadowSm: platformStyles.shadow(1),
      shadowMd: platformStyles.shadow(2),
      shadowLg: platformStyles.shadow(4),
      shadowXl: platformStyles.shadow(8),
    });
  }, [theme, isDark]);

  // Return styles along with theme utilities
  return {
    styles,
    theme,
    isDark,
    spacing: {
      xs: getResponsiveSpacing(theme, 'xs'),
      sm: getResponsiveSpacing(theme, 'sm'),
      md: getResponsiveSpacing(theme, 'md'),
      lg: getResponsiveSpacing(theme, 'lg'),
      xl: getResponsiveSpacing(theme, 'xl'),
    },
    fontSize: {
      xs: getResponsiveFontSize(theme, 'xs'),
      sm: getResponsiveFontSize(theme, 'sm'),
      md: getResponsiveFontSize(theme, 'md'),
      lg: getResponsiveFontSize(theme, 'lg'),
      xl: getResponsiveFontSize(theme, 'xl'),
      xxl: getResponsiveFontSize(theme, 'xxl'),
    },
    colors: theme.colors,
    borderRadius: theme.borderRadius,
  };
}

/**
 * Simplified hook for just getting theme colors
 */
export function useThemeColors() {
  const { theme } = useTheme();
  return theme.colors;
}

/**
 * Hook for getting responsive spacing values
 */
export function useResponsiveSpacing() {
  const { theme } = useTheme();
  return {
    xs: getResponsiveSpacing(theme, 'xs'),
    sm: getResponsiveSpacing(theme, 'sm'),
    md: getResponsiveSpacing(theme, 'md'),
    lg: getResponsiveSpacing(theme, 'lg'),
    xl: getResponsiveSpacing(theme, 'xl'),
  };
}

/**
 * Hook for getting responsive font sizes
 */
export function useResponsiveFontSizes() {
  const { theme } = useTheme();
  return {
    xs: getResponsiveFontSize(theme, 'xs'),
    sm: getResponsiveFontSize(theme, 'sm'),
    md: getResponsiveFontSize(theme, 'md'),
    lg: getResponsiveFontSize(theme, 'lg'),
    xl: getResponsiveFontSize(theme, 'xl'),
    xxl: getResponsiveFontSize(theme, 'xxl'),
  };
}