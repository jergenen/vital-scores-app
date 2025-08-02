import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeStyles } from '../../hooks/useThemeStyles';

interface SupplementalOxygenToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

/**
 * Toggle switch component for supplemental oxygen selection
 * Provides clear yes/no selection without dropdown menus
 */
export function SupplementalOxygenToggle({
  value,
  onValueChange,
  disabled = false,
}: SupplementalOxygenToggleProps) {
  const { theme } = useThemeStyles();
  const styles = createStyles(theme);

  const handleToggle = (newValue: boolean) => {
    if (!disabled) {
      onValueChange(newValue);
    }
  };

  const getButtonStyle = (buttonValue: boolean) => {
    const isSelected = value === buttonValue;
    
    return [
      styles.toggleButton,
      isSelected && styles.selectedButton,
      disabled && styles.disabledButton,
    ];
  };

  const getButtonTextStyle = (buttonValue: boolean) => {
    const isSelected = value === buttonValue;
    
    return [
      styles.toggleText,
      isSelected && styles.selectedText,
      disabled && styles.disabledText,
    ];
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, disabled && styles.disabledLabel]}>
        Supplemental Oxygen
      </Text>
      
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={getButtonStyle(false)}
          onPress={() => handleToggle(false)}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text style={getButtonTextStyle(false)}>
            No
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={getButtonStyle(true)}
          onPress={() => handleToggle(true)}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text style={getButtonTextStyle(true)}>
            Yes
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.helpText, disabled && styles.disabledText]}>
        Is the patient receiving supplemental oxygen?
      </Text>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  disabledLabel: {
    color: theme.colors.textSecondary,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  toggleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48, // Touch-optimized height
  },
  selectedButton: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    opacity: 0.6,
  },
  toggleText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  selectedText: {
    color: theme.colors.background,
    fontWeight: theme.typography.fontWeight.bold,
  },
  disabledText: {
    color: theme.colors.textSecondary,
  },
  helpText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
  },
});