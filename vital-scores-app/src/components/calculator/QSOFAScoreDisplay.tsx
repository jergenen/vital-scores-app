import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { getQSOFAColor, getRiskLevelColor, createProgressBarStyles } from '../../theme/utils';
import { DiagonalLines } from '../common/DiagonalLines';

interface QSOFAScoreDisplayProps {
  score: number | null;
  riskLevel: 'low' | 'high' | null;
  isComplete: boolean;
}

export const QSOFAScoreDisplay: React.FC<QSOFAScoreDisplayProps> = ({
  score,
  riskLevel,
  isComplete,
}) => {
  const { theme } = useThemeStyles();
  const progressBarStyles = createProgressBarStyles(theme);

  const componentStyles = StyleSheet.create({
    container: {
      marginVertical: theme.spacing.sm,
    },
    progressContainer: {
      ...progressBarStyles.container,
      position: 'relative',
    },
    progressFill: {
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      left: 0,
      top: 0,
      minWidth: 80, // Ensure text is always visible
    },
    scoreTextContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    scoreLabel: {
      ...progressBarStyles.text,
      color: theme.colors.text,
      fontWeight: '700' as const,
    },
    scoreValue: {
      ...progressBarStyles.text,
      color: theme.colors.text,
      fontWeight: '700' as const,
      fontSize: theme.typography.fontSize.lg,
    },
    insufficientData: {
      ...progressBarStyles.insufficientData,
    },
    insufficientDataText: {
      ...progressBarStyles.insufficientDataText,
    },
    riskContainer: {
      alignItems: 'center',
      marginTop: theme.spacing.xs,
    },
    riskText: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: '500' as const,
    },
  });

  const renderInsufficientData = () => (
    <View style={[componentStyles.progressContainer, componentStyles.insufficientData]}>
      <DiagonalLines />
      <Text style={componentStyles.insufficientDataText}>
        Not enough data submitted
      </Text>
    </View>
  );

  const renderScoreBar = () => {
    const backgroundColor = getQSOFAColor(score);
    const maxScore = 3; // q-SOFA maximum score
    const progressWidth = score ? Math.min((score / maxScore) * 100, 100) : 0;

    return (
      <View style={componentStyles.progressContainer}>
        <View 
          style={[
            componentStyles.progressFill,
            {
              backgroundColor,
              width: `${progressWidth}%`,
            }
          ]}
        />
        <View style={componentStyles.scoreTextContainer}>
          <Text style={componentStyles.scoreLabel}>q-SOFA</Text>
          <Text style={componentStyles.scoreValue}>{score}</Text>
        </View>
      </View>
    );
  };

  const renderRiskLevel = () => {
    if (!riskLevel) return null;

    const riskColor = getRiskLevelColor(theme, riskLevel);
    let riskText = '';
    
    if (riskLevel === 'high') {
      riskText = 'High Risk - Sepsis Concern';
    } else {
      riskText = 'Low Risk';
    }

    return (
      <View style={componentStyles.riskContainer}>
        <Text style={[componentStyles.riskText, { color: riskColor }]}>
          {riskText}
        </Text>
      </View>
    );
  };

  return (
    <View style={componentStyles.container}>
      {!isComplete ? renderInsufficientData() : renderScoreBar()}
      {renderRiskLevel()}
    </View>
  );
};