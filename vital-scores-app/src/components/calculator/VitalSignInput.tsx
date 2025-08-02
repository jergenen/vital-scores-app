import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ValidationResult } from '../../types';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { ValidationMessage } from '../common/ValidationMessage';

interface VitalSignInputProps {
  label: string;
  value: number | undefined;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'numeric' | 'default';
  validation?: ValidationResult;
  showValidation?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

/**
 * Specialized input component for vital signs with enhanced validation feedback
 */
export function VitalSignInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'numeric',
  validation,
  showValidation = true,
  disabled = false,
  style,
  inputStyle,
  labelStyle,
}: VitalSignInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useThemeStyles();

  const styles = createStyles(theme);

  const handleChangeText = useCallback((text: string) => {
    onChangeText(text);
  }, [onChangeText]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Determine input border color and styling based on validation state
  const getBorderColor = (): string => {
    if (disabled) return theme.colors.border;
    if (!validation) return isFocused ? theme.colors.primary : theme.colors.border;
    
    if (!validation.isValid) return theme.colors.error;
    if (validation.warningMessage) return theme.colors.warning;
    return isFocused ? theme.colors.success : theme.colors.border;
  };

  const getBorderWidth = (): number => {
    if (disabled) return 1;
    if (!validation) return isFocused ? 2 : 1;
    
    if (!validation.isValid) return 2;
    if (validation.warningMessage) return 2;
    return isFocused ? 2 : 1;
  };

  const getBackgroundColor = (): string => {
    if (disabled) return theme.colors.surface;
    if (!validation) return theme.colors.background;
    
    if (!validation.isValid) return theme.colors.background;
    if (validation.warningMessage) return theme.colors.background;
    return theme.colors.background;
  };

  // Convert value to string for TextInput
  const displayValue = value !== undefined ? String(value) : '';

  const containerStyle = [styles.container, style];
  const inputContainerStyle = [
    styles.inputContainer,
    { 
      borderColor: getBorderColor(),
      borderWidth: getBorderWidth(),
      backgroundColor: getBackgroundColor()
    },
    isFocused && styles.focused,
    disabled && styles.disabled,
    !validation?.isValid && styles.error,
    validation?.isValid && validation?.warningMessage && styles.warning,
  ];
  const textInputStyle = [
    styles.input,
    disabled && styles.disabledText,
    inputStyle,
  ];
  const labelTextStyle = [
    styles.label,
    disabled && styles.disabledLabel,
    labelStyle,
  ];

  return (
    <View style={containerStyle}>
      <Text style={labelTextStyle}>{label}</Text>
      <View style={inputContainerStyle}>
        <TextInput
          style={textInputStyle}
          value={displayValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          keyboardType={keyboardType}
          editable={!disabled}
          placeholderTextColor={theme.colors.textSecondary}
          selectionColor={theme.colors.primary}
        />
      </View>
      {showValidation && validation && (
        <ValidationMessage 
          validation={validation} 
          fieldName={label}
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
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    minHeight: 48, // Touch-optimized height
  },
  input: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    minHeight: 48,
  },
  focused: {
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  disabled: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  disabledText: {
    color: theme.colors.textSecondary,
  },
  disabledLabel: {
    color: theme.colors.textSecondary,
  },
  error: {
    shadowColor: theme.colors.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  warning: {
    shadowColor: theme.colors.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
});