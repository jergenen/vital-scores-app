import { describe, it, expect } from 'vitest';
import { calculateQSOFA } from '../qsofaCalculator';
import { VitalSigns } from '../../types';

describe('q-SOFA Calculator', () => {
  describe('Complete vital signs calculation', () => {
    it('should calculate q-SOFA score for normal vital signs (low risk)', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 16, // <22, 0 points
        systolicBP: 120, // >100, 0 points
        consciousnessLevel: 'A', // Alert, 0 points
        supplementalOxygen: false
      };

      const result = calculateQSOFA(vitalSigns);

      expect(result.score).toBe(0);
      expect(result.riskLevel).toBe('low');
      expect(result.isComplete).toBe(true);
      expect(result.breakdown).toEqual({
        respiratoryRate: 0,
        systolicBP: 0,
        consciousnessLevel: 0
      });
    });

    it('should calculate q-SOFA score for high-risk vital signs (score = 3)', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 25, // ≥22, 1 point
        systolicBP: 90, // ≤100, 1 point
        consciousnessLevel: 'V', // Altered, 1 point
        supplementalOxygen: false
      };

      const result = calculateQSOFA(vitalSigns);

      expect(result.score).toBe(3);
      expect(result.riskLevel).toBe('high');
      expect(result.isComplete).toBe(true);
      expect(result.breakdown).toEqual({
        respiratoryRate: 1,
        systolicBP: 1,
        consciousnessLevel: 1
      });
    });

    it('should calculate q-SOFA score for borderline high-risk (score = 2)', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 22, // ≥22, 1 point
        systolicBP: 100, // ≤100, 1 point
        consciousnessLevel: 'A', // Alert, 0 points
        supplementalOxygen: false
      };

      const result = calculateQSOFA(vitalSigns);

      expect(result.score).toBe(2);
      expect(result.riskLevel).toBe('high');
      expect(result.isComplete).toBe(true);
      expect(result.breakdown).toEqual({
        respiratoryRate: 1,
        systolicBP: 1,
        consciousnessLevel: 0
      });
    });

    it('should calculate q-SOFA score for borderline low-risk (score = 1)', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 21, // <22, 0 points
        systolicBP: 95, // ≤100, 1 point
        consciousnessLevel: 'A', // Alert, 0 points
        supplementalOxygen: false
      };

      const result = calculateQSOFA(vitalSigns);

      expect(result.score).toBe(1);
      expect(result.riskLevel).toBe('low');
      expect(result.isComplete).toBe(true);
      expect(result.breakdown).toEqual({
        respiratoryRate: 0,
        systolicBP: 1,
        consciousnessLevel: 0
      });
    });
  });

  describe('Incomplete vital signs', () => {
    it('should return incomplete result when respiratory rate is missing', () => {
      const vitalSigns: VitalSigns = {
        systolicBP: 120,
        consciousnessLevel: 'A',
        supplementalOxygen: false
      };

      const result = calculateQSOFA(vitalSigns);

      expect(result.score).toBe(null);
      expect(result.riskLevel).toBe(null);
      expect(result.isComplete).toBe(false);
      expect(result.breakdown).toBe(null);
    });

    it('should return incomplete result when systolic BP is missing', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 16,
        consciousnessLevel: 'A',
        supplementalOxygen: false
      };

      const result = calculateQSOFA(vitalSigns);

      expect(result.score).toBe(null);
      expect(result.riskLevel).toBe(null);
      expect(result.isComplete).toBe(false);
      expect(result.breakdown).toBe(null);
    });

    it('should return incomplete result when consciousness level is missing', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 16,
        systolicBP: 120,
        supplementalOxygen: false
      };

      const result = calculateQSOFA(vitalSigns);

      expect(result.score).toBe(null);
      expect(result.riskLevel).toBe(null);
      expect(result.isComplete).toBe(false);
      expect(result.breakdown).toBe(null);
    });

    it('should return incomplete result when multiple fields are missing', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 16,
        supplementalOxygen: false
      };

      const result = calculateQSOFA(vitalSigns);

      expect(result.score).toBe(null);
      expect(result.riskLevel).toBe(null);
      expect(result.isComplete).toBe(false);
      expect(result.breakdown).toBe(null);
    });

    it('should work with extra fields that are not used in q-SOFA', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 16,
        systolicBP: 120,
        consciousnessLevel: 'A',
        supplementalOxygen: false,
        // Extra fields not used in q-SOFA
        heartRate: 70,
        temperature: 37.0,
        oxygenSaturation: 98
      };

      const result = calculateQSOFA(vitalSigns);

      expect(result.score).toBe(0);
      expect(result.riskLevel).toBe('low');
      expect(result.isComplete).toBe(true);
    });
  });

  describe('Individual component scoring', () => {
    describe('Respiratory Rate scoring', () => {
      it('should score respiratory rate correctly for boundary values', () => {
        const testCases = [
          { rr: 21, expectedScore: 0, description: 'just below threshold' },
          { rr: 22, expectedScore: 1, description: 'at threshold' },
          { rr: 23, expectedScore: 1, description: 'above threshold' },
          { rr: 30, expectedScore: 1, description: 'well above threshold' },
          { rr: 10, expectedScore: 0, description: 'well below threshold' }
        ];

        testCases.forEach(({ rr, expectedScore, description }) => {
          const vitalSigns: VitalSigns = {
            respiratoryRate: rr,
            systolicBP: 120,
            consciousnessLevel: 'A',
            supplementalOxygen: false
          };

          const result = calculateQSOFA(vitalSigns);
          expect(result.breakdown?.respiratoryRate).toBe(expectedScore);
        });
      });
    });

    describe('Systolic Blood Pressure scoring', () => {
      it('should score systolic BP correctly for boundary values', () => {
        const testCases = [
          { sbp: 99, expectedScore: 1, description: 'below threshold' },
          { sbp: 100, expectedScore: 1, description: 'at threshold' },
          { sbp: 101, expectedScore: 0, description: 'above threshold' },
          { sbp: 120, expectedScore: 0, description: 'well above threshold' },
          { sbp: 80, expectedScore: 1, description: 'well below threshold' }
        ];

        testCases.forEach(({ sbp, expectedScore, description }) => {
          const vitalSigns: VitalSigns = {
            respiratoryRate: 16,
            systolicBP: sbp,
            consciousnessLevel: 'A',
            supplementalOxygen: false
          };

          const result = calculateQSOFA(vitalSigns);
          expect(result.breakdown?.systolicBP).toBe(expectedScore);
        });
      });
    });

    describe('Consciousness Level scoring', () => {
      it('should score consciousness level correctly for all ACVPU levels', () => {
        const testCases = [
          { level: 'A' as const, expectedScore: 0, description: 'Alert' },
          { level: 'C' as const, expectedScore: 1, description: 'Confusion' },
          { level: 'V' as const, expectedScore: 1, description: 'Voice' },
          { level: 'P' as const, expectedScore: 1, description: 'Pain' },
          { level: 'U' as const, expectedScore: 1, description: 'Unresponsive' }
        ];

        testCases.forEach(({ level, expectedScore, description }) => {
          const vitalSigns: VitalSigns = {
            respiratoryRate: 16,
            systolicBP: 120,
            consciousnessLevel: level,
            supplementalOxygen: false
          };

          const result = calculateQSOFA(vitalSigns);
          expect(result.breakdown?.consciousnessLevel).toBe(expectedScore);
        });
      });
    });
  });

  describe('Risk Level determination', () => {
    it('should determine low risk for scores 0-1', () => {
      const testCases = [
        {
          vitalSigns: {
            respiratoryRate: 16, // 0 points
            systolicBP: 120, // 0 points
            consciousnessLevel: 'A' as const, // 0 points
            supplementalOxygen: false
          },
          expectedScore: 0
        },
        {
          vitalSigns: {
            respiratoryRate: 16, // 0 points
            systolicBP: 95, // 1 point
            consciousnessLevel: 'A' as const, // 0 points
            supplementalOxygen: false
          },
          expectedScore: 1
        }
      ];

      testCases.forEach(({ vitalSigns, expectedScore }) => {
        const result = calculateQSOFA(vitalSigns);
        expect(result.score).toBe(expectedScore);
        expect(result.riskLevel).toBe('low');
      });
    });

    it('should determine high risk for scores 2-3', () => {
      const testCases = [
        {
          vitalSigns: {
            respiratoryRate: 22, // 1 point
            systolicBP: 95, // 1 point
            consciousnessLevel: 'A' as const, // 0 points
            supplementalOxygen: false
          },
          expectedScore: 2
        },
        {
          vitalSigns: {
            respiratoryRate: 25, // 1 point
            systolicBP: 90, // 1 point
            consciousnessLevel: 'V' as const, // 1 point
            supplementalOxygen: false
          },
          expectedScore: 3
        }
      ];

      testCases.forEach(({ vitalSigns, expectedScore }) => {
        const result = calculateQSOFA(vitalSigns);
        expect(result.score).toBe(expectedScore);
        expect(result.riskLevel).toBe('high');
      });
    });
  });

  describe('Edge cases and boundary conditions', () => {
    it('should handle exact boundary values correctly', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 22, // Exactly at threshold (1 point)
        systolicBP: 100, // Exactly at threshold (1 point)
        consciousnessLevel: 'A', // Alert (0 points)
        supplementalOxygen: false
      };

      const result = calculateQSOFA(vitalSigns);
      expect(result.score).toBe(2);
      expect(result.riskLevel).toBe('high');
      expect(result.breakdown).toEqual({
        respiratoryRate: 1,
        systolicBP: 1,
        consciousnessLevel: 0
      });
    });

    it('should handle extreme values correctly', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 60, // Very high
        systolicBP: 50, // Very low
        consciousnessLevel: 'U', // Unresponsive
        supplementalOxygen: false
      };

      const result = calculateQSOFA(vitalSigns);
      expect(result.score).toBe(3);
      expect(result.riskLevel).toBe('high');
      expect(result.isComplete).toBe(true);
    });

    it('should handle minimum valid values', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 1, // Very low but valid
        systolicBP: 300, // Very high but valid
        consciousnessLevel: 'A', // Alert
        supplementalOxygen: false
      };

      const result = calculateQSOFA(vitalSigns);
      expect(result.score).toBe(0);
      expect(result.riskLevel).toBe('low');
      expect(result.isComplete).toBe(true);
    });
  });

  describe('Clinical scenarios', () => {
    it('should correctly identify sepsis risk scenario', () => {
      // Clinical scenario: Patient with suspected sepsis
      const vitalSigns: VitalSigns = {
        respiratoryRate: 24, // Tachypneic (1 point)
        systolicBP: 85, // Hypotensive (1 point)
        consciousnessLevel: 'C', // Confused (1 point)
        supplementalOxygen: false
      };

      const result = calculateQSOFA(vitalSigns);
      expect(result.score).toBe(3);
      expect(result.riskLevel).toBe('high');
      expect(result.isComplete).toBe(true);
    });

    it('should correctly identify low-risk scenario', () => {
      // Clinical scenario: Stable patient
      const vitalSigns: VitalSigns = {
        respiratoryRate: 18, // Normal (0 points)
        systolicBP: 130, // Normal (0 points)
        consciousnessLevel: 'A', // Alert (0 points)
        supplementalOxygen: false
      };

      const result = calculateQSOFA(vitalSigns);
      expect(result.score).toBe(0);
      expect(result.riskLevel).toBe('low');
      expect(result.isComplete).toBe(true);
    });

    it('should correctly identify borderline risk scenario', () => {
      // Clinical scenario: Patient with one concerning vital sign
      const vitalSigns: VitalSigns = {
        respiratoryRate: 20, // Normal (0 points)
        systolicBP: 95, // Low-normal/hypotensive (1 point)
        consciousnessLevel: 'A', // Alert (0 points)
        supplementalOxygen: false
      };

      const result = calculateQSOFA(vitalSigns);
      expect(result.score).toBe(1);
      expect(result.riskLevel).toBe('low');
      expect(result.isComplete).toBe(true);
    });
  });
});