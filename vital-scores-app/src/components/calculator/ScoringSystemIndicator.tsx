import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStyles } from '../../hooks/useThemeStyles';

interface ScoringSystemIndicatorProps {
  systems: Array<'news2' | 'qsofa'>;
  scores?: {
    news2?: number | null;
    qsofa?: number | null;
  };
}

/**
 * Color-coded indicator showing which scoring system uses each field
 * Displays real-time calculated scores next to applicable labels
 */
export function ScoringSystemIndicator({
  systems,
  scores = {},
}: ScoringSystemIndicatorProps) {
  const { theme } = useThemeStyles();
  const styles = createStyles(theme);

  const getSystemColor = (system: 'news2' | 'qsofa') => {
    switch (system) {
      case 'news2':
        return theme.colors.news2;
      case 'qsofa':
        return theme.colors.qsofa;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getSystemLabel = (system: 'news2' | 'qsofa') => {
    switch (system) {
      case 'news2':
        return 'NEWS2';
      case 'qsofa':
        return 'q-SOFA';
      default:
        return system;
    }
  };

  const formatScore = (score: number | null | undefined) => {
    if (score === null || score === undefined) {
      return '';
    }
    return ` (${score})`;
  };

  // If both systems are used, show "both" color
  const shouldUseBothColor = systems.length > 1;

  return (
    <View style={styles.container}>
      {shouldUseBothColor ? (
        <View style={[styles.indicator, { backgroundColor: theme.colors.both }]}>
          <Text style={styles.indicatorText}>
            {systems.map(system => getSystemLabel(system)).join(' & ')}
            {systems.map(system => formatScore(scores[system])).join('')}
          </Text>
        </View>
      ) : (
        systems.map((system) => (
          <View 
            key={system}
            style={[styles.indicator, { backgroundColor: getSystemColor(system) }]}
          >
            <Text style={styles.indicatorText}>
              {getSystemLabel(system)}{formatScore(scores[system])}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    gap: theme.spacing.xs / 2,
    zIndex: 1,
  },
  indicator: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm,
    minWidth: 60,
    alignItems: 'center',
  },
  indicatorText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.background,
    textAlign: 'center',
  },
});