import { describe, it, expect } from 'vitest';
import { unifiedCalculationService } from '../../../services/unifiedCalculationService';
import { VitalSigns } from '../../../types';

describe('Score Display Integration', () => {
  beforeEach(() => {
    // Reset the service before each test
    unifiedCalculationService.reset();
  });

  describe('NEWS2 Score Display Integration', () => {
    it('should provide correct data for NEWS2 score display when complete', () => {
      const completeVitalSigns: VitalSigns = {
        respiratoryRate: 16,
        oxygenSaturation: 98,
        supplementalOxygen: false,
        temperature: 37.0,
        systolicBP: 120,
        heartRate: 70,
        consciousnessLevel: 'A'
      };

      unifiedCalculationService.updateVitalSigns(completeVitalSigns);
      const results = unifiedCalculationService.calculateBothScores();

      // Verify NEWS2 data for display component
      expect(results.news2.score).toBe(0);
      expect(results.news2.riskLevel).toBe('low');
      expect(results.news2.isComplete).toBe(true);
    });

    it('should provide correct data for NEWS2 score display when incomplete', () => {
      const incompleteVitalSigns: VitalSigns = {
        respiratoryRate: 16,
        supplementalOxygen: false,
        // Missing other required fields
      };

      unifiedCalculationService.updateVitalSigns(incompleteVitalSigns);
      const results = unifiedCalculationService.calculateBothScores();

      // Verify NEWS2 data for display component
      expect(results.news2.score).toBe(null);
      expect(results.news2.riskLevel).toBe(null);
      expect(results.news2.isComplete).toBe(false);
    });

    it('should provide correct data for high-risk NEWS2 score', () => {
      const highRiskVitalSigns: VitalSigns = {
        respiratoryRate: 8, // 3 points
        oxygenSaturation: 90, // 3 points
        supplementalOxygen: true, // 2 points
        temperature: 35.0, // 3 points
        systolicBP: 85, // 3 points
        heartRate: 130, // 2 points
        consciousnessLevel: 'V' // 3 points
      };

      unifiedCalculationService.updateVitalSigns(highRiskVitalSigns);
      const results = unifiedCalculationService.calculateBothScores();

      // Verify NEWS2 data for display component
      expect(results.news2.score).toBe(19);
      expect(results.news2.riskLevel).toBe('high');
      expect(results.news2.isComplete).toBe(true);
    });
  });

  describe('q-SOFA Score Display Integration', () => {
    it('should provide correct data for q-SOFA score display when complete', () => {
      const completeVitalSigns: VitalSigns = {
        respiratoryRate: 16,
        systolicBP: 120,
        consciousnessLevel: 'A',
        supplementalOxygen: false,
      };

      unifiedCalculationService.updateVitalSigns(completeVitalSigns);
      const results = unifiedCalculationService.calculateBothScores();

      // Verify q-SOFA data for display component
      expect(results.qsofa.score).toBe(0);
      expect(results.qsofa.riskLevel).toBe('low');
      expect(results.qsofa.isComplete).toBe(true);
    });

    it('should provide correct data for q-SOFA score display when incomplete', () => {
      const incompleteVitalSigns: VitalSigns = {
        respiratoryRate: 16,
        supplementalOxygen: false,
        // Missing systolicBP and consciousnessLevel
      };

      unifiedCalculationService.updateVitalSigns(incompleteVitalSigns);
      const results = unifiedCalculationService.calculateBothScores();

      // Verify q-SOFA data for display component
      expect(results.qsofa.score).toBe(null);
      expect(results.qsofa.riskLevel).toBe(null);
      expect(results.qsofa.isComplete).toBe(false);
    });

    it('should provide correct data for high-risk q-SOFA score', () => {
      const highRiskVitalSigns: VitalSigns = {
        respiratoryRate: 22, // 1 point (≥22)
        systolicBP: 95, // 1 point (≤100)
        consciousnessLevel: 'V', // 1 point (altered consciousness)
        supplementalOxygen: false,
      };

      unifiedCalculationService.updateVitalSigns(highRiskVitalSigns);
      const results = unifiedCalculationService.calculateBothScores();

      // Verify q-SOFA data for display component
      expect(results.qsofa.score).toBe(3);
      expect(results.qsofa.riskLevel).toBe('high');
      expect(results.qsofa.isComplete).toBe(true);
    });

    it('should provide correct data for sepsis concern threshold', () => {
      const sepsisRiskVitalSigns: VitalSigns = {
        respiratoryRate: 22, // 1 point (≥22)
        systolicBP: 95, // 1 point (≤100)
        consciousnessLevel: 'A', // 0 points (normal consciousness)
        supplementalOxygen: false,
      };

      unifiedCalculationService.updateVitalSigns(sepsisRiskVitalSigns);
      const results = unifiedCalculationService.calculateBothScores();

      // Verify q-SOFA data for display component (score ≥2 indicates high risk)
      expect(results.qsofa.score).toBe(2);
      expect(results.qsofa.riskLevel).toBe('high');
      expect(results.qsofa.isComplete).toBe(true);
    });
  });

  describe('Simultaneous Score Display Integration', () => {
    it('should provide correct data for both score displays simultaneously', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 22, // NEWS2: 2 points, q-SOFA: 1 point
        oxygenSaturation: 94, // NEWS2: 1 point
        supplementalOxygen: false, // NEWS2: 0 points
        temperature: 38.5, // NEWS2: 1 point
        systolicBP: 95, // NEWS2: 2 points, q-SOFA: 1 point
        heartRate: 95, // NEWS2: 1 point
        consciousnessLevel: 'A' // NEWS2: 0 points, q-SOFA: 0 points
      };

      unifiedCalculationService.updateVitalSigns(vitalSigns);
      const results = unifiedCalculationService.calculateBothScores();

      // Verify NEWS2 data
      expect(results.news2.score).toBe(7); // 2+1+0+1+2+1+0
      expect(results.news2.riskLevel).toBe('high');
      expect(results.news2.isComplete).toBe(true);

      // Verify q-SOFA data
      expect(results.qsofa.score).toBe(2); // 1+1+0
      expect(results.qsofa.riskLevel).toBe('high');
      expect(results.qsofa.isComplete).toBe(true);
    });

    it('should handle mixed completion states correctly', () => {
      const partialVitalSigns: VitalSigns = {
        respiratoryRate: 22,
        systolicBP: 95,
        consciousnessLevel: 'A',
        supplementalOxygen: false,
        // Missing oxygenSaturation, temperature, heartRate for NEWS2
      };

      unifiedCalculationService.updateVitalSigns(partialVitalSigns);
      const results = unifiedCalculationService.calculateBothScores();

      // q-SOFA should be complete
      expect(results.qsofa.score).toBe(2);
      expect(results.qsofa.riskLevel).toBe('high');
      expect(results.qsofa.isComplete).toBe(true);

      // NEWS2 should be incomplete
      expect(results.news2.score).toBe(null);
      expect(results.news2.riskLevel).toBe(null);
      expect(results.news2.isComplete).toBe(false);
    });
  });

  describe('Real-time Updates', () => {
    it('should provide updated data when vital signs change', () => {
      // Start with incomplete data
      unifiedCalculationService.updateVitalSigns({
        respiratoryRate: 16,
        supplementalOxygen: false,
      });

      let results = unifiedCalculationService.calculateBothScores();
      expect(results.news2.isComplete).toBe(false);
      expect(results.qsofa.isComplete).toBe(false);

      // Add more data to complete q-SOFA
      unifiedCalculationService.updateVitalSigns({
        systolicBP: 120,
        consciousnessLevel: 'A',
      });

      results = unifiedCalculationService.calculateBothScores();
      expect(results.news2.isComplete).toBe(false); // Still missing fields
      expect(results.qsofa.isComplete).toBe(true); // Now complete
      expect(results.qsofa.score).toBe(0);
      expect(results.qsofa.riskLevel).toBe('low');

      // Complete NEWS2 data
      unifiedCalculationService.updateVitalSigns({
        oxygenSaturation: 98,
        temperature: 37.0,
        heartRate: 70,
      });

      results = unifiedCalculationService.calculateBothScores();
      expect(results.news2.isComplete).toBe(true);
      expect(results.news2.score).toBe(0);
      expect(results.news2.riskLevel).toBe('low');
    });
  });
});