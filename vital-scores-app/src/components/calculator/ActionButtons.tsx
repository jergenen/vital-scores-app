import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useVitalSigns } from '../../contexts/VitalSignsContext';
import { useThemeStyles } from '../../hooks/useThemeStyles';

/**
 * Action buttons component for reset and export functionality
 * Positioned at the bottom of the main calculator screen
 */
export function ActionButtons() {
  const { resetAll } = useVitalSigns();
  const { theme } = useThemeStyles();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = () => {
    if (isResetting) return;

    Alert.alert(
      'Reset All Data',
      'Are you sure you want to clear all input fields and reset both score calculations?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setIsResetting(true);
            resetAll();
            // Brief delay to show visual feedback
            setTimeout(() => setIsResetting(false), 200);
          },
        },
      ]
    );
  };

  const handleExport = () => {
    // TODO: Implement export functionality in future task
    Alert.alert(
      'Export Feature',
      'Export functionality will be implemented in a future update.',
      [{ text: 'OK' }]
    );
  };

  const componentStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    button: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48, // Ensure touch target is adequate
    },
    resetButton: {
      backgroundColor: theme.colors.error,
      borderWidth: 1,
      borderColor: theme.colors.error,
    },
    exportButton: {
      backgroundColor: theme.colors.primary,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    buttonText: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: '500' as const,
    },
    resetButtonText: {
      color: theme.colors.onError,
    },
    exportButtonText: {
      color: theme.colors.onPrimary,
    },
  });

  return (
    <View style={componentStyles.container}>
      <TouchableOpacity
        style={[componentStyles.button, componentStyles.resetButton]}
        onPress={handleReset}
        disabled={isResetting}
        activeOpacity={0.7}
      >
        <Text style={[componentStyles.buttonText, componentStyles.resetButtonText]}>
          {isResetting ? 'Resetting...' : 'Reset'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[componentStyles.button, componentStyles.exportButton]}
        onPress={handleExport}
        activeOpacity={0.7}
      >
        <Text style={[componentStyles.buttonText, componentStyles.exportButtonText]}>
          Export
        </Text>
      </TouchableOpacity>
    </View>
  );
}