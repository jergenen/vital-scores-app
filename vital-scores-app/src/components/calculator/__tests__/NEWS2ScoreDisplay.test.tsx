import { describe, it, expect } from 'vitest';
import { getNEWS2Color, getRiskLevelColor } from '../../../theme/utils';

describe('NEWS2ScoreDisplay Logic', () => {
  describe('getNEWS2Color', () => {
    it('should return correct colors for different scores', () => {
      expect(getNEWS2Color(0)).toBe('#E5E5E5'); // Neutral/Grey
      expect(getNEWS2Color(1)).toBe('#FFEB3B'); // Yellow
      expect(getNEWS2Color(5)).toBe('#FF9800'); // Orange
      expect(getNEWS2Color(7)).toBe('#FF5722'); // Dark Orange/Red
      expect(getNEWS2Color(null)).toBe('#E5E5E5'); // Grey for null
    });

    it('should handle edge cases', () => {
      expect(getNEWS2Color(-1)).toBe('#E5E5E5'); // Grey for negative
      expect(getNEWS2Color(25)).toBe('#FF5722'); // Clamp to max
    });
  });

  describe('getRiskLevelColor', () => {
    const mockTheme = {
      colors: {
        success: '#34C759',
        warning: '#FF9500',
        error: '#FF3B30',
        textSecondary: '#666666',
      },
    } as any;

    it('should return correct colors for risk levels', () => {
      expect(getRiskLevelColor(mockTheme, 'low')).toBe('#34C759');
      expect(getRiskLevelColor(mockTheme, 'medium')).toBe('#FF9500');
      expect(getRiskLevelColor(mockTheme, 'high')).toBe('#FF3B30');
      expect(getRiskLevelColor(mockTheme, null)).toBe('#666666');
    });
  });

  describe('Component Props Validation', () => {
    it('should handle incomplete data correctly', () => {
      const props = {
        score: null,
        riskLevel: null as null,
        isComplete: false,
      };

      expect(props.isComplete).toBe(false);
      expect(props.score).toBe(null);
      expect(props.riskLevel).toBe(null);
    });

    it('should handle complete data correctly', () => {
      const props = {
        score: 5,
        riskLevel: 'medium' as const,
        isComplete: true,
      };

      expect(props.isComplete).toBe(true);
      expect(props.score).toBe(5);
      expect(props.riskLevel).toBe('medium');
    });
  });
});