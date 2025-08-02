import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ConsciousnessLevel, ValidationResult } from '../../types';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { ValidationMessage } from '../common/ValidationMessage';

interface ConsciousnessSelectorProps {
  value: ConsciousnessLevel | undefined;
  onValueChange: (value: ConsciousnessLevel) => void;
  validation?: ValidationResult;
  showValidation?: boolean;
  disabled?: boolean;
}

const CONSCIOUSNESS_OPTIONS: Array<{
  value: ConsciousnessLevel;
  label: string;
  description: string;
}> = [
  { value: 'A', label: 'A - Alert', description: 'Alert and responsive' },
  { value: 'C', label: 'C - Confusion', description: 'Confused or disoriented' },
  { value: 'V', label: 'V - Voice', description: 'Responds to voice' },
  { value: 'P', label: 'P - Pain', description: 'Responds to pain only' },
  { value: 'U', label: 'U - Unresponsive', description: 'Unresponsive to all stimuli' },
];

/**
 * Consciousness level selector using ACVPU scale
 * Provides button-based selection for fast input without dropdowns
 */
export function ConsciousnessSelector({
  value,
  onValueChange,
  validation,
  showValidation = true,
  disabled = false,
}: ConsciousnessSelectorProps) {
  const { theme } = useThemeStyles();
  const styles = createStyles(theme);

  const handleOptionPress = (optionValue: ConsciousnessLevel) => {
    if (!disabled) {
      onValueChange(optionValue);
    }
  };

  const getButtonStyle = (optionValue: ConsciousnessLevel) => {
    const isSelected = value === optionValue;
    const hasError = validation && !validation.isValid;
    
    return [
      styles.optionButton,
      isSelected && styles.selectedButton,
      hasError && styles.errorButton,
      disabled && styles.disabledButton,
    ];
  };

  const getButtonTextStyle = (optionValue: ConsciousnessLevel) => {
    const isSelected = value === optionValue;
    
    return [
      styles.optionText,
      isSelected && styles.selectedText,
      disabled && styles.disabledText,
    ];
  };

  const getDescriptionTextStyle = (optionValue: ConsciousnessLevel) => {
    const isSelected = value === optionValue;
    
    return [
      styles.descriptionText,
      isSelected && styles.selectedDescriptionText,
      disabled && styles.disabledText,
    ];
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, disabled && styles.disabledLabel]}>
        Consciousness Level (ACVPU Scale)
      </Text>
      
      <View style={styles.optionsContainer}>
        {CONSCIOUSNESS_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={getButtonStyle(option.value)}
            onPress={() => handleOptionPress(option.value)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Text style={getButtonTextStyle(option.value)}>
              {option.label}
            </Text>
            <Text style={getDescriptionTextStyle(option.value)}>
              {option.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {showValidation && validation && (
        <ValidationMessage 
          validation={validation} 
          fieldName="Consciousness Level"
        />
      )}
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
  optionsContainer: {
    gap: theme.spacing.xs,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    minHeight: 56, // Touch-optimized height
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
  errorButton: {
    borderColor: theme.colors.error,
    shadowColor: theme.colors.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    opacity: 0.6,
  },
  optionText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs / 2,
  },
  selectedText: {
    color: theme.colors.background,
    fontWeight: theme.typography.fontWeight.bold,
  },
  disabledText: {
    color: theme.colors.textSecondary,
  },
  descriptionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.tight * theme.typography.fontSize.sm,
  },
  selectedDescriptionText: {
    color: theme.colors.background,
    opacity: 0.9,
  },
});