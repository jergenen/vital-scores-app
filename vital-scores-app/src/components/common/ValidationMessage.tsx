import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ValidationResult } from '../../types';

interface ValidationMessageProps {
  validation?: ValidationResult;
  fieldName?: string;
  style?: any;
  showIcon?: boolean;
}

/**
 * Component for displaying validation messages with appropriate styling and icons
 */
export function ValidationMessage({ validation, fieldName, style, showIcon = true }: ValidationMessageProps) {
  if (!validation) {
    return null;
  }

  const getMessage = (): string => {
    if (!validation.isValid && validation.errorMessage) {
      return validation.errorMessage;
    }
    if (validation.isValid && validation.warningMessage) {
      return validation.warningMessage;
    }
    return '';
  };

  const getIcon = (): string => {
    if (!showIcon) return '';
    if (!validation.isValid) return '⚠️ ';
    if (validation.warningMessage) return '⚠️ ';
    return '';
  };

  const message = getMessage();
  if (!message) {
    return <View style={styles.container} />; // Maintain consistent spacing
  }

  const messageStyle = [
    styles.message,
    validation.isValid ? styles.warning : styles.error,
    style
  ];

  const containerStyle = [
    styles.container,
    validation.isValid ? styles.warningContainer : styles.errorContainer
  ];

  return (
    <View style={containerStyle}>
      <Text style={messageStyle}>
        {getIcon()}{message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    minHeight: 18,
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  errorContainer: {
    backgroundColor: '#fff5f5',
    borderLeftWidth: 3,
    borderLeftColor: '#dc3545',
  },
  warningContainer: {
    backgroundColor: '#fffbf0',
    borderLeftWidth: 3,
    borderLeftColor: '#ffc107',
  },
  message: {
    fontSize: 12,
    fontWeight: '400',
    paddingVertical: 2,
    lineHeight: 16,
  },
  error: {
    color: '#dc3545', // Red color for errors
  },
  warning: {
    color: '#856404', // Darker yellow for better readability
  },
});

export default ValidationMessage;