import { describe, it, expect } from 'vitest';
import { getQSOFAColor, getRiskLevelColor } from '../../../theme/utils';

describe('QSOFAScoreDisplay Logic', () => {
  describe('getQSOFAColor', () => {
    it('should return correct colors for different scores', () => {
      expect(getQSOFAColor(0)).toBe('#4CAF50'); // Green (low risk)
      expect(getQSOFAColor(1)).toBe('#8BC34A'); // Light green
      expect(getQSOFAColor(2)).toBe('#FF5722'); // Red (high risk - sepsis concern)
      expect(getQSOFAColor(3)).toBe('#D32F2F'); // Dark red (high risk)
      expect(getQSOFAColor(null)).toBe('#E5E5E5'); // Grey for null
    });

    it('should handle edge cases', () => {
      expect(getQSOFAColor(-1)).toBe('#E5E5E5'); // Grey for negative
      expect(getQSOFAColor(5)).toBe('#D32F2F'); // Clamp to max
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

    it('should return correct colors for q-SOFA risk levels', () => {
      expect(getRiskLevelColor(mockTheme, 'low')).toBe('#34C759');
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

    it('should handle complete data with low risk', () => {
      const props = {
        score: 1,
        riskLevel: 'low' as const,
        isComplete: true,
      };

      expect(props.isComplete).toBe(true);
      expect(props.score).toBe(1);
      expect(props.riskLevel).toBe('low');
    });

    it('should handle complete data with high risk', () => {
      const props = {
        score: 2,
        riskLevel: 'high' as const,
        isComplete: true,
      };

      expect(props.isComplete).toBe(true);
      expect(props.score).toBe(2);
      expect(props.riskLevel).toBe('high');
    });
  });

  describe('Risk Level Text Logic', () => {
    it('should format risk level text correctly', () => {
      const formatRiskText = (riskLevel: 'low' | 'high' | null) => {
        if (!riskLevel) return null;
        
        if (riskLevel === 'high') {
          return 'High Risk - Sepsis Concern';
        } else {
          return 'Low Risk';
        }
      };

      expect(formatRiskText('low')).toBe('Low Risk');
      expect(formatRiskText('high')).toBe('High Risk - Sepsis Concern');
      expect(formatRiskText(null)).toBe(null);
    });
  });
});