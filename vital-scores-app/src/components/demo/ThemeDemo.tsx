import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { getNEWS2Color, getQSOFAColor } from '../../theme/utils';

/**
 * Demo component to showcase the theme system functionality
 * This component demonstrates:
 * - Theme switching
 * - Responsive styles
 * - Color utilities
 * - Typography system
 * - Spacing system
 */
export function ThemeDemo() {
  const { isDark, toggleTheme, isAutoMode, setThemeMode } = useTheme();
  const { styles, colors, spacing } = useThemeStyles();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titleText}>Theme System Demo</Text>
        
        {/* Theme Controls */}
        <View style={[styles.sectionContainer, { marginTop: spacing.lg }]}>
          <Text style={styles.subtitleText}>Theme Controls</Text>
          
          <View style={[styles.row, { marginTop: spacing.md }]}>
            <Text style={styles.bodyText}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isDark ? colors.background : colors.surface}
            />
          </View>
          
          <Text style={[styles.captionText, { marginTop: spacing.xs }]}>
            {isAutoMode ? 'Auto mode (follows system)' : `Manual mode (${isDark ? 'dark' : 'light'})`}
          </Text>
        </View>

        {/* Color Palette */}
        <View style={[styles.sectionContainer, { marginTop: spacing.lg }]}>
          <Text style={styles.subtitleText}>Color Palette</Text>
          
          <View style={[styles.row, { marginTop: spacing.md, flexWrap: 'wrap', gap: spacing.sm }]}>
            {Object.entries(colors).map(([name, color]) => (
              <View key={name} style={[styles.badge, { backgroundColor: color }]}>
                <Text style={[styles.badgeText, { fontSize: 10 }]}>{name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Typography Scale */}
        <View style={[styles.sectionContainer, { marginTop: spacing.lg }]}>
          <Text style={styles.subtitleText}>Typography Scale</Text>
          
          <Text style={[styles.bodyText, { fontSize: 32, marginTop: spacing.sm }]}>XXL Text</Text>
          <Text style={[styles.bodyText, { fontSize: 24, marginTop: spacing.xs }]}>XL Text</Text>
          <Text style={[styles.bodyText, { fontSize: 18, marginTop: spacing.xs }]}>Large Text</Text>
          <Text style={[styles.bodyText, { fontSize: 16, marginTop: spacing.xs }]}>Medium Text</Text>
          <Text style={[styles.bodyText, { fontSize: 14, marginTop: spacing.xs }]}>Small Text</Text>
          <Text style={[styles.bodyText, { fontSize: 12, marginTop: spacing.xs }]}>XS Text</Text>
        </View>

        {/* Score Color Demo */}
        <View style={[styles.sectionContainer, { marginTop: spacing.lg }]}>
          <Text style={styles.subtitleText}>Score Colors</Text>
          
          <Text style={[styles.bodyText, { marginTop: spacing.md }]}>NEWS2 Colors:</Text>
          <View style={[styles.row, { marginTop: spacing.sm, flexWrap: 'wrap', gap: spacing.xs }]}>
            {[0, 3, 5, 7, 10].map(score => (
              <View 
                key={score}
                style={[
                  styles.badge, 
                  { 
                    backgroundColor: getNEWS2Color(score),
                    minWidth: 40,
                  }
                ]}
              >
                <Text style={[styles.badgeText, { color: '#000' }]}>{score}</Text>
              </View>
            ))}
          </View>
          
          <Text style={[styles.bodyText, { marginTop: spacing.md }]}>q-SOFA Colors:</Text>
          <View style={[styles.row, { marginTop: spacing.sm, flexWrap: 'wrap', gap: spacing.xs }]}>
            {[0, 1, 2, 3].map(score => (
              <View 
                key={score}
                style={[
                  styles.badge, 
                  { 
                    backgroundColor: getQSOFAColor(score),
                    minWidth: 40,
                  }
                ]}
              >
                <Text style={[styles.badgeText, { color: '#000' }]}>{score}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Button Variants */}
        <View style={[styles.sectionContainer, { marginTop: spacing.lg }]}>
          <Text style={styles.subtitleText}>Button Variants</Text>
          
          <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.buttonText}>Primary Button</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Secondary Button</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.outlineButton}>
              <Text style={styles.outlineButtonText}>Outline Button</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme Mode Buttons */}
        <View style={[styles.sectionContainer, { marginTop: spacing.lg }]}>
          <Text style={styles.subtitleText}>Theme Mode Selection</Text>
          
          <View style={[styles.row, { marginTop: spacing.md, gap: spacing.sm }]}>
            <TouchableOpacity 
              style={[styles.secondaryButton, { flex: 1 }]}
              onPress={() => setThemeMode('auto')}
            >
              <Text style={styles.secondaryButtonText}>Auto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.secondaryButton, { flex: 1 }]}
              onPress={() => setThemeMode('light')}
            >
              <Text style={styles.secondaryButtonText}>Light</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.secondaryButton, { flex: 1 }]}
              onPress={() => setThemeMode('dark')}
            >
              <Text style={styles.secondaryButtonText}>Dark</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}