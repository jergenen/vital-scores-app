import { describe, it, expect } from 'vitest';
import { lightTheme, darkTheme, NEWS2_COLORS, QSOFA_COLORS } from '../constants';
import { 
  getNEWS2Color, 
  getQSOFAColor, 
  getRiskLevelColor, 
  getContrastTextColor,
  interpolateColor,
  createProgressGradient,
} from '../utils';

describe('Theme System', () => {
  describe('Theme Constants', () => {
    it('should have light theme with all required properties', () => {
      expect(lightTheme).toBeDefined();
      expect(lightTheme.colors).toBeDefined();
      expect(lightTheme.spacing).toBeDefined();
      expect(lightTheme.typography).toBeDefined();
      expect(lightTheme.borderRadius).toBeDefined();
      expect(lightTheme.animation).toBeDefined();
    });

    it('should have dark theme with all required properties', () => {
      expect(darkTheme).toBeDefined();
      expect(darkTheme.colors).toBeDefined();
      expect(darkTheme.spacing).toBeDefined();
      expect(darkTheme.typography).toBeDefined();
      expect(darkTheme.borderRadius).toBeDefined();
      expect(darkTheme.animation).toBeDefined();
    });

    it('should have consistent structure between light and dark themes', () => {
      expect(Object.keys(lightTheme)).toEqual(Object.keys(darkTheme));
      expect(Object.keys(lightTheme.colors)).toEqual(Object.keys(darkTheme.colors));
      expect(Object.keys(lightTheme.spacing)).toEqual(Object.keys(darkTheme.spacing));
      expect(Object.keys(lightTheme.typography)).toEqual(Object.keys(darkTheme.typography));
      expect(Object.keys(lightTheme.borderRadius)).toEqual(Object.keys(darkTheme.borderRadius));
    });

    it('should have NEWS2 color mappings for all score ranges', () => {
      expect(NEWS2_COLORS[0]).toBeDefined();
      expect(NEWS2_COLORS[7]).toBeDefined();
      expect(NEWS2_COLORS[20]).toBeDefined();
    });

    it('should have q-SOFA color mappings for all score ranges', () => {
      expect(QSOFA_COLORS[0]).toBeDefined();
      expect(QSOFA_COLORS[1]).toBeDefined();
      expect(QSOFA_COLORS[2]).toBeDefined();
      expect(QSOFA_COLORS[3]).toBeDefined();
    });
  });

  describe('Color Utilities', () => {
    it('should return correct NEWS2 colors for different scores', () => {
      expect(getNEWS2Color(0)).toBe(NEWS2_COLORS[0]);
      expect(getNEWS2Color(5)).toBe(NEWS2_COLORS[5]);
      expect(getNEWS2Color(7)).toBe(NEWS2_COLORS[7]);
      expect(getNEWS2Color(null)).toBe('#E5E5E5');
      expect(getNEWS2Color(-1)).toBe('#E5E5E5');
      expect(getNEWS2Color(25)).toBe(NEWS2_COLORS[20]); // Should clamp to max
    });

    it('should return correct q-SOFA colors for different scores', () => {
      expect(getQSOFAColor(0)).toBe(QSOFA_COLORS[0]);
      expect(getQSOFAColor(2)).toBe(QSOFA_COLORS[2]);
      expect(getQSOFAColor(3)).toBe(QSOFA_COLORS[3]);
      expect(getQSOFAColor(null)).toBe('#E5E5E5');
      expect(getQSOFAColor(-1)).toBe('#E5E5E5');
      expect(getQSOFAColor(5)).toBe(QSOFA_COLORS[3]); // Should clamp to max
    });

    it('should return correct risk level colors', () => {
      const theme = lightTheme;
      expect(getRiskLevelColor(theme, 'low')).toBe(theme.colors.success);
      expect(getRiskLevelColor(theme, 'medium')).toBe(theme.colors.warning);
      expect(getRiskLevelColor(theme, 'high')).toBe(theme.colors.error);
      expect(getRiskLevelColor(theme, null)).toBe(theme.colors.textSecondary);
    });

    it('should calculate contrast text color correctly', () => {
      const theme = lightTheme;
      // Light background should use dark text
      expect(getContrastTextColor('#FFFFFF', theme)).toBe(theme.colors.text);
      // Dark background should use light text
      expect(getContrastTextColor('#000000', theme)).toBe(theme.colors.background);
    });

    it('should interpolate colors correctly', () => {
      const color1 = '#FF0000'; // Red
      const color2 = '#0000FF'; // Blue
      const midColor = interpolateColor(color1, color2, 0.5);
      
      // Should be a valid hex color
      expect(midColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      
      // At 0 progress, should return first color (lowercase)
      expect(interpolateColor(color1, color2, 0)).toBe('#ff0000');
      
      // At 1 progress, should return second color (lowercase)
      expect(interpolateColor(color1, color2, 1)).toBe('#0000ff');
    });

    it('should create progress gradients correctly', () => {
      const gradient = createProgressGradient('#FF0000', '#0000FF', 5);
      
      expect(gradient).toHaveLength(5);
      expect(gradient[0]).toBe('#ff0000');
      expect(gradient[4]).toBe('#0000ff');
      
      // All colors should be valid hex colors
      gradient.forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  describe('Theme Properties', () => {
    it('should have consistent spacing values', () => {
      const { spacing } = lightTheme;
      expect(spacing.xs).toBeLessThan(spacing.sm);
      expect(spacing.sm).toBeLessThan(spacing.md);
      expect(spacing.md).toBeLessThan(spacing.lg);
      expect(spacing.lg).toBeLessThan(spacing.xl);
    });

    it('should have consistent font sizes', () => {
      const { typography } = lightTheme;
      expect(typography.fontSize.xs).toBeLessThan(typography.fontSize.sm);
      expect(typography.fontSize.sm).toBeLessThan(typography.fontSize.md);
      expect(typography.fontSize.md).toBeLessThan(typography.fontSize.lg);
      expect(typography.fontSize.lg).toBeLessThan(typography.fontSize.xl);
      expect(typography.fontSize.xl).toBeLessThan(typography.fontSize.xxl);
    });

    it('should have consistent border radius values', () => {
      const { borderRadius } = lightTheme;
      expect(borderRadius.sm).toBeLessThan(borderRadius.md);
      expect(borderRadius.md).toBeLessThan(borderRadius.lg);
      expect(borderRadius.lg).toBeLessThan(borderRadius.xl);
    });

    it('should have animation duration values', () => {
      const { animation } = lightTheme;
      expect(animation.duration.fast).toBeLessThan(animation.duration.normal);
      expect(animation.duration.normal).toBeLessThan(animation.duration.slow);
    });

    it('should have line height values', () => {
      const { typography } = lightTheme;
      expect(typography.lineHeight.tight).toBeLessThan(typography.lineHeight.normal);
      expect(typography.lineHeight.normal).toBeLessThan(typography.lineHeight.relaxed);
    });
  });
});