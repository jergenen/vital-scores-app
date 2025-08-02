import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useVitalSigns } from '../../contexts/VitalSignsContext';
import { useUnifiedCalculations } from '../../services/unifiedCalculationService';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { NEWS2ScoreDisplay } from './NEWS2ScoreDisplay';
import { QSOFAScoreDisplay } from './QSOFAScoreDisplay';
import { UnifiedInputFields } from './UnifiedInputFields';
import { ActionButtons } from './ActionButtons';

/**
 * Main calculator screen layout component
 * Integrates all calculator components in a structured layout:
 * - Score displays at the top
 * - Input fields in the middle
 * - Action buttons at the bottom
 */
export function MainCalculatorScreen() {
  const { state, updateResults } = useVitalSigns();
  const { calculateBothScores, subscribe } = useUnifiedCalculations();
  const { theme, styles } = useThemeStyles();

  // Subscribe to calculation updates and sync with context
  useEffect(() => {
    const unsubscribe = subscribe((results) => {
      updateResults(results);
    });

    return unsubscribe;
  }, [subscribe, updateResults]);

  const componentStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scoreSection: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      // Ensure score section doesn't take too much space
      maxHeight: '25%',
    },
    inputSection: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    inputSectionContent: {
      paddingBottom: theme.spacing.md,
      // Ensure content can scroll if needed but tries to fit
      flexGrow: 1,
    },
    actionSection: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      // Fixed height to ensure buttons are always visible
      minHeight: 80,
    },
  });

  return (
    <View style={componentStyles.container}>
      {/* Score Display Section - Top */}
      <View style={componentStyles.scoreSection}>
        <NEWS2ScoreDisplay
          score={state.results.news2.score}
          riskLevel={state.results.news2.riskLevel}
          isComplete={state.results.news2.isComplete}
        />
        <QSOFAScoreDisplay
          score={state.results.qsofa.score}
          riskLevel={state.results.qsofa.riskLevel}
          isComplete={state.results.qsofa.isComplete}
        />
      </View>

      {/* Input Fields Section - Middle */}
      <ScrollView 
        style={componentStyles.inputSection}
        contentContainerStyle={componentStyles.inputSectionContent}
        showsVerticalScrollIndicator={false}
      >
        <UnifiedInputFields />
      </ScrollView>

      {/* Action Buttons Section - Bottom */}
      <View style={componentStyles.actionSection}>
        <ActionButtons />
      </View>
    </View>
  );
}