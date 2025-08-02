import { describe, it, expect } from 'vitest';
import { calculateNEWS2 } from '../news2Calculator';
import { VitalSigns } from '../../types';

describe('NEWS2 Calculator', () => {
  describe('Complete vital signs calculation', () => {
    it('should calculate NEWS2 score for normal vital signs', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 16,
        oxygenSaturation: 98,
        supplementalOxygen: false,
        temperature: 37.0,
        systolicBP: 120,
        heartRate: 70,
        consciousnessLevel: 'A'
      };

      const result = calculateNEWS2(vitalSigns);

      expect(result.score).toBe(0);
      expect(result.riskLevel).toBe('low');
      expect(result.isComplete).toBe(true);
      expect(result.breakdown).toEqual({
        respiratoryRate: 0,
        oxygenSaturation: 0,
        supplementalOxygen: 0,
        temperature: 0,
        systolicBP: 0,
        heartRate: 0,
        consciousnessLevel: 0
      });
    });

    it('should calculate NEWS2 score for high-risk vital signs', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 8, // 3 points
        oxygenSaturation: 90, // 3 points
        supplementalOxygen: true, // 2 points
        temperature: 35.0, // 3 points
        systolicBP: 85, // 3 points
        heartRate: 130, // 2 points
        consciousnessLevel: 'V' // 3 points
      };

      const result = calculateNEWS2(vitalSigns);

      expect(result.score).toBe(19);
      expect(result.riskLevel).toBe('high');
      expect(result.isComplete).toBe(true);
      expect(result.breakdown).toEqual({
        respiratoryRate: 3,
        oxygenSaturation: 3,
        supplementalOxygen: 2,
        temperature: 3,
        systolicBP: 3,
        heartRate: 2,
        consciousnessLevel: 3
      });
    });

    it('should calculate NEWS2 score for medium-risk vital signs', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 22, // 2 points
        oxygenSaturation: 94, // 1 point
        supplementalOxygen: false, // 0 points
        temperature: 38.5, // 1 point
        systolicBP: 105, // 1 point
        heartRate: 95, // 1 point
        consciousnessLevel: 'A' // 0 points
      };

      const result = calculateNEWS2(vitalSigns);

      expect(result.score).toBe(6);
      expect(result.riskLevel).toBe('medium');
      expect(result.isComplete).toBe(true);
    });
  });

  describe('Incomplete vital signs', () => {
    it('should return incomplete result when respiratory rate is missing', () => {
      const vitalSigns: VitalSigns = {
        oxygenSaturation: 98,
        supplementalOxygen: false,
        temperature: 37.0,
        systolicBP: 120,
        heartRate: 70,
        consciousnessLevel: 'A'
      };

      const result = calculateNEWS2(vitalSigns);

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

      const result = calculateNEWS2(vitalSigns);

      expect(result.score).toBe(null);
      expect(result.riskLevel).toBe(null);
      expect(result.isComplete).toBe(false);
      expect(result.breakdown).toBe(null);
    });
  });

  describe('Individual component scoring', () => {
    describe('Respiratory Rate scoring', () => {
      it('should score respiratory rate correctly for all ranges', () => {
        const testCases = [
          { rr: 8, expectedScore: 3 },
          { rr: 9, expectedScore: 1 },
          { rr: 11, expectedScore: 1 },
          { rr: 12, expectedScore: 0 },
          { rr: 20, expectedScore: 0 },
          { rr: 21, expectedScore: 2 },
          { rr: 24, expectedScore: 2 },
          { rr: 25, expectedScore: 3 },
          { rr: 30, expectedScore: 3 }
        ];

        testCases.forEach(({ rr, expectedScore }) => {
          const vitalSigns: VitalSigns = {
            respiratoryRate: rr,
            oxygenSaturation: 98,
            supplementalOxygen: false,
            temperature: 37.0,
            systolicBP: 120,
            heartRate: 70,
            consciousnessLevel: 'A'
          };

          const result = calculateNEWS2(vitalSigns);
          expect(result.breakdown?.respiratoryRate).toBe(expectedScore);
        });
      });
    });

    describe('Oxygen Saturation scoring', () => {
      it('should score oxygen saturation correctly for all ranges', () => {
        const testCases = [
          { spo2: 91, expectedScore: 3 },
          { spo2: 92, expectedScore: 2 },
          { spo2: 93, expectedScore: 2 },
          { spo2: 94, expectedScore: 1 },
          { spo2: 95, expectedScore: 1 },
          { spo2: 96, expectedScore: 0 },
          { spo2: 100, expectedScore: 0 }
        ];

        testCases.forEach(({ spo2, expectedScore }) => {
          const vitalSigns: VitalSigns = {
            respiratoryRate: 16,
            oxygenSaturation: spo2,
            supplementalOxygen: false,
            temperature: 37.0,
            systolicBP: 120,
            heartRate: 70,
            consciousnessLevel: 'A'
          };

          const result = calculateNEWS2(vitalSigns);
          expect(result.breakdown?.oxygenSaturation).toBe(expectedScore);
        });
      });
    });

    describe('Temperature scoring', () => {
      it('should score temperature correctly for all ranges', () => {
        const testCases = [
          { temp: 35.0, expectedScore: 3 },
          { temp: 35.1, expectedScore: 1 },
          { temp: 36.0, expectedScore: 1 },
          { temp: 36.1, expectedScore: 0 },
          { temp: 38.0, expectedScore: 0 },
          { temp: 38.1, expectedScore: 1 },
          { temp: 39.0, expectedScore: 1 },
          { temp: 39.1, expectedScore: 2 },
          { temp: 40.0, expectedScore: 2 }
        ];

        testCases.forEach(({ temp, expectedScore }) => {
          const vitalSigns: VitalSigns = {
            respiratoryRate: 16,
            oxygenSaturation: 98,
            supplementalOxygen: false,
            temperature: temp,
            systolicBP: 120,
            heartRate: 70,
            consciousnessLevel: 'A'
          };

          const result = calculateNEWS2(vitalSigns);
          expect(result.breakdown?.temperature).toBe(expectedScore);
        });
      });
    });

    describe('Systolic Blood Pressure scoring', () => {
      it('should score systolic BP correctly for all ranges', () => {
        const testCases = [
          { sbp: 90, expectedScore: 3 },
          { sbp: 91, expectedScore: 2 },
          { sbp: 100, expectedScore: 2 },
          { sbp: 101, expectedScore: 1 },
          { sbp: 110, expectedScore: 1 },
          { sbp: 111, expectedScore: 0 },
          { sbp: 219, expectedScore: 0 },
          { sbp: 220, expectedScore: 3 },
          { sbp: 250, expectedScore: 3 }
        ];

        testCases.forEach(({ sbp, expectedScore }) => {
          const vitalSigns: VitalSigns = {
            respiratoryRate: 16,
            oxygenSaturation: 98,
            supplementalOxygen: false,
            temperature: 37.0,
            systolicBP: sbp,
            heartRate: 70,
            consciousnessLevel: 'A'
          };

          const result = calculateNEWS2(vitalSigns);
          expect(result.breakdown?.systolicBP).toBe(expectedScore);
        });
      });
    });

    describe('Heart Rate scoring', () => {
      it('should score heart rate correctly for all ranges', () => {
        const testCases = [
          { hr: 40, expectedScore: 3 },
          { hr: 41, expectedScore: 1 },
          { hr: 50, expectedScore: 1 },
          { hr: 51, expectedScore: 0 },
          { hr: 90, expectedScore: 0 },
          { hr: 91, expectedScore: 1 },
          { hr: 110, expectedScore: 1 },
          { hr: 111, expectedScore: 2 },
          { hr: 130, expectedScore: 2 },
          { hr: 131, expectedScore: 3 },
          { hr: 150, expectedScore: 3 }
        ];

        testCases.forEach(({ hr, expectedScore }) => {
          const vitalSigns: VitalSigns = {
            respiratoryRate: 16,
            oxygenSaturation: 98,
            supplementalOxygen: false,
            temperature: 37.0,
            systolicBP: 120,
            heartRate: hr,
            consciousnessLevel: 'A'
          };

          const result = calculateNEWS2(vitalSigns);
          expect(result.breakdown?.heartRate).toBe(expectedScore);
        });
      });
    });

    describe('Consciousness Level scoring', () => {
      it('should score consciousness level correctly', () => {
        const testCases = [
          { level: 'A' as const, expectedScore: 0 },
          { level: 'C' as const, expectedScore: 3 },
          { level: 'V' as const, expectedScore: 3 },
          { level: 'P' as const, expectedScore: 3 },
          { level: 'U' as const, expectedScore: 3 }
        ];

        testCases.forEach(({ level, expectedScore }) => {
          const vitalSigns: VitalSigns = {
            respiratoryRate: 16,
            oxygenSaturation: 98,
            supplementalOxygen: false,
            temperature: 37.0,
            systolicBP: 120,
            heartRate: 70,
            consciousnessLevel: level
          };

          const result = calculateNEWS2(vitalSigns);
          expect(result.breakdown?.consciousnessLevel).toBe(expectedScore);
        });
      });
    });

    describe('Supplemental Oxygen scoring', () => {
      it('should score supplemental oxygen correctly', () => {
        const vitalSignsWithO2: VitalSigns = {
          respiratoryRate: 16,
          oxygenSaturation: 98,
          supplementalOxygen: true,
          temperature: 37.0,
          systolicBP: 120,
          heartRate: 70,
          consciousnessLevel: 'A'
        };

        const vitalSignsWithoutO2: VitalSigns = {
          ...vitalSignsWithO2,
          supplementalOxygen: false
        };

        const resultWithO2 = calculateNEWS2(vitalSignsWithO2);
        const resultWithoutO2 = calculateNEWS2(vitalSignsWithoutO2);

        expect(resultWithO2.breakdown?.supplementalOxygen).toBe(2);
        expect(resultWithoutO2.breakdown?.supplementalOxygen).toBe(0);
      });
    });
  });

  describe('Risk Level determination', () => {
    it('should determine low risk for scores 0-4', () => {
      const testScores = [0, 1, 2, 3, 4];
      
      testScores.forEach(targetScore => {
        // Create vital signs that result in the target score
        const vitalSigns: VitalSigns = {
          respiratoryRate: 16, // 0 points
          oxygenSaturation: 98, // 0 points
          supplementalOxygen: false, // 0 points
          temperature: 37.0, // 0 points
          systolicBP: 120, // 0 points
          heartRate: targetScore <= 2 ? 70 : (targetScore === 3 ? 95 : 100), // 0, 1, or 2 points
          consciousnessLevel: targetScore >= 3 ? 'V' : 'A' // 0 or 3 points
        };

        // Adjust to get exact target score
        if (targetScore === 1) {
          vitalSigns.heartRate = 95; // 1 point
        } else if (targetScore === 2) {
          vitalSigns.heartRate = 115; // 2 points
        } else if (targetScore === 4) {
          vitalSigns.heartRate = 95; // 1 point
          vitalSigns.consciousnessLevel = 'V'; // 3 points
        }

        const result = calculateNEWS2(vitalSigns);
        expect(result.riskLevel).toBe('low');
      });
    });

    it('should determine medium risk for scores 5-6', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 22, // 2 points
        oxygenSaturation: 94, // 1 point
        supplementalOxygen: false, // 0 points
        temperature: 38.5, // 1 point
        systolicBP: 105, // 1 point
        heartRate: 70, // 0 points
        consciousnessLevel: 'A' // 0 points
      };

      const result = calculateNEWS2(vitalSigns);
      expect(result.score).toBe(5);
      expect(result.riskLevel).toBe('medium');

      // Test score 6
      vitalSigns.heartRate = 95; // 1 point
      const result6 = calculateNEWS2(vitalSigns);
      expect(result6.score).toBe(6);
      expect(result6.riskLevel).toBe('medium');
    });

    it('should determine high risk for scores 7+', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 25, // 3 points
        oxygenSaturation: 92, // 2 points
        supplementalOxygen: true, // 2 points
        temperature: 37.0, // 0 points
        systolicBP: 120, // 0 points
        heartRate: 70, // 0 points
        consciousnessLevel: 'A' // 0 points
      };

      const result = calculateNEWS2(vitalSigns);
      expect(result.score).toBe(7);
      expect(result.riskLevel).toBe('high');
    });
  });

  describe('Edge cases', () => {
    it('should handle boundary values correctly', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 12, // Boundary between 1 and 0 points
        oxygenSaturation: 96, // Boundary between 1 and 0 points
        supplementalOxygen: false,
        temperature: 36.1, // Boundary between 1 and 0 points
        systolicBP: 111, // Boundary between 1 and 0 points
        heartRate: 51, // Boundary between 1 and 0 points
        consciousnessLevel: 'A'
      };

      const result = calculateNEWS2(vitalSigns);
      expect(result.score).toBe(0);
      expect(result.riskLevel).toBe('low');
    });

    it('should handle extreme values correctly', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 1, // Very low
        oxygenSaturation: 70, // Very low
        supplementalOxygen: true,
        temperature: 45, // Very high
        systolicBP: 300, // Very high
        heartRate: 300, // Very high
        consciousnessLevel: 'U'
      };

      const result = calculateNEWS2(vitalSigns);
      expect(result.isComplete).toBe(true);
      expect(result.score).toBeGreaterThan(10);
      expect(result.riskLevel).toBe('high');
    });
  });
});