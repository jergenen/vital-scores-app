import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ValidationResult } from '../../types';
import { ValidationMessage } from './ValidationMessage';

interface ValidatedInputProps {
  label: string;
  value: string | number | undefined;
  onChangeText: (text: string) => void;
  onValidate?: (fieldName: string, value: string) => ValidationResult;
  fieldName: string;
  placeholder?: string;
  keyboardType?: 'numeric' | 'default';
  validation?: ValidationResult;
  showValidation?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  multiline?: boolean;
  numberOfLines?: number;
}

/**
 * Enhanced input component with real-time validation feedback
 */
export function ValidatedInput({
  label,
  value,
  onChangeText,
  onValidate,
  fieldName,
  placeholder,
  keyboardType = 'default',
  validation,
  showValidation = true,
  disabled = false,
  style,
  inputStyle,
  labelStyle,
  multiline = false,
  numberOfLines = 1,
}: ValidatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = useCallback((text: string) => {
    onChangeText(text);
    
    // Trigger validation if provided
    if (onValidate) {
      onValidate(fieldName, text);
    }
  }, [onChangeText, onValidate, fieldName]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Determine input border color and styling based on validation state
  const getBorderColor = (): string => {
    if (disabled) return '#e9ecef';
    if (!validation) return isFocused ? '#007bff' : '#ced4da';
    
    if (!validation.isValid) return '#dc3545'; // Red for errors
    if (validation.warningMessage) return '#ffc107'; // Yellow for warnings
    return isFocused ? '#28a745' : '#ced4da'; // Green when focused and valid, normal when not focused
  };

  const getBorderWidth = (): number => {
    if (disabled) return 1;
    if (!validation) return isFocused ? 2 : 1;
    
    if (!validation.isValid) return 2; // Thicker border for errors
    if (validation.warningMessage) return 2; // Thicker border for warnings
    return isFocused ? 2 : 1;
  };

  const getBackgroundColor = (): string => {
    if (disabled) return '#e9ecef';
    if (!validation) return '#fff';
    
    if (!validation.isValid) return '#fff5f5'; // Light red background for errors
    if (validation.warningMessage) return '#fffbf0'; // Light yellow background for warnings
    return '#fff';
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
          multiline={multiline}
          numberOfLines={numberOfLines}
          placeholderTextColor="#6c757d"
        />
      </View>
      {showValidation && (
        <ValidationMessage 
          validation={validation} 
          fieldName={fieldName}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 4,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#fff',
    minHeight: 40,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#495057',
    minHeight: 40,
  },
  focused: {
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  disabled: {
    backgroundColor: '#e9ecef',
    borderColor: '#e9ecef',
  },
  disabledText: {
    color: '#6c757d',
  },
  disabledLabel: {
    color: '#6c757d',
  },
  error: {
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  warning: {
    shadowColor: '#ffc107',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default ValidatedInput;