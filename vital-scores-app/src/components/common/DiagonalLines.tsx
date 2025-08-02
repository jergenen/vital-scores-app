import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { Theme } from '../../types';

interface DiagonalLinesProps {
  color?: string;
  spacing?: number;
  lineWidth?: number;
  opacity?: number;
}

export const DiagonalLines: React.FC<DiagonalLinesProps> = ({
  color,
  spacing = 8,
  lineWidth = 1,
  opacity = 0.3,
}) => {
  const { theme, styles } = useThemeStyles(createStyles);
  
  const lineColor = color || theme.colors.border;
  
  // Create multiple diagonal lines to fill the container
  const lines = Array.from({ length: 20 }, (_, index) => (
    <View
      key={index}
      style={[
        styles.line,
        {
          backgroundColor: lineColor,
          width: lineWidth,
          opacity,
          left: index * spacing - 100, // Start from off-screen left
          transform: [{ rotate: '45deg' }],
        },
      ]}
    />
  ));

  return (
    <View style={styles.container}>
      {lines}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: 1,
    },
    line: {
      position: 'absolute',
      height: 200, // Make lines long enough to cover the container
      top: -50, // Start from above the container
    },
  });