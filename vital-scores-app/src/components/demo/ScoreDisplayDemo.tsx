import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NEWS2ScoreDisplay, QSOFAScoreDisplay } from '../calculator';
import { unifiedCalculationService } from '../../services/unifiedCalculationService';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { CalculationResults, Theme } from '../../types';

/**
 * Demo component showing how the score display components work
 * This demonstrates the integration between the calculation service and display components
 */
export const ScoreDisplayDemo: React.FC = () => {
  const { theme, styles } = useThemeStyles(createStyles);
  const [results, setResults] = useState<CalculationResults>({
    news2: { score: null, riskLevel: null, isComplete: false },
    qsofa: { score: null, riskLevel: null, isComplete: false },
  });

  useEffect(() => {
    // Subscribe to calculation updates
    const unsubscribe = unifiedCalculationService.subscribe(setResults);
    return unsubscribe;
  }, []);

  const simulateCompleteData = () => {
    unifiedCalculationService.updateVitalSigns({
      respiratoryRate: 16,
      oxygenSaturation: 98,
      supplementalOxygen: false,
      temperature: 37.0,
      systolicBP: 120,
      heartRate: 70,
      consciousnessLevel: 'A',
    });
  };

  const simulateHighRiskData = () => {
    unifiedCalculationService.updateVitalSigns({
      respiratoryRate: 25, // High
      oxygenSaturation: 90, // Low
      supplementalOxygen: true,
      temperature: 35.0, // Low
      systolicBP: 85, // Low
      heartRate: 130, // High
      consciousnessLevel: 'V', // Altered
    });
  };

  const simulatePartialData = () => {
    unifiedCalculationService.updateVitalSigns({
      respiratoryRate: 22,
      systolicBP: 95,
      consciousnessLevel: 'A',
      supplementalOxygen: false,
      // Missing other fields for NEWS2
    });
  };

  const resetData = () => {
    unifiedCalculationService.reset();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Score Display Demo</Text>
      
      <View style={styles.scoresContainer}>
        <Text style={styles.sectionTitle}>NEWS2 Score</Text>
        <NEWS2ScoreDisplay
          score={results.news2.score}
          riskLevel={results.news2.riskLevel}
          isComplete={results.news2.isComplete}
        />

        <Text style={styles.sectionTitle}>q-SOFA Score</Text>
        <QSOFAScoreDisplay
          score={results.qsofa.score}
          riskLevel={results.qsofa.riskLevel}
          isComplete={results.qsofa.isComplete}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <Text style={styles.buttonLabel} onPress={simulateCompleteData}>
          Normal Vitals
        </Text>
        <Text style={styles.buttonLabel} onPress={simulateHighRiskData}>
          High Risk Vitals
        </Text>
        <Text style={styles.buttonLabel} onPress={simulatePartialData}>
          Partial Data
        </Text>
        <Text style={styles.buttonLabel} onPress={resetData}>
          Reset
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          NEWS2 Complete: {results.news2.isComplete ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.statusText}>
          q-SOFA Complete: {results.qsofa.isComplete ? 'Yes' : 'No'}
        </Text>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    scoresContainer: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    buttonsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    buttonLabel: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.background,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      textAlign: 'center',
      minWidth: 80,
    },
    statusContainer: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    statusText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
  });