import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UnifiedCalculationService, unifiedCalculationService, useUnifiedCalculations } from '../unifiedCalculationService';
import { VitalSigns, CalculationResults } from '../../types';

describe('UnifiedCalculationService', () => {
  let service: UnifiedCalculationService;

  beforeEach(() => {
    service = new UnifiedCalculationService();
  });

  describe('Basic functionality', () => {
    it('should initialize with default vital signs', () => {
      const vitalSigns = service.getCurrentVitalSigns();
      expect(vitalSigns.supplementalOxygen).toBe(false);
      expect(vitalSigns.respiratoryRate).toBeUndefined();
      expect(vitalSigns.heartRate).toBeUndefined();
    });

    it('should update vital signs correctly', () => {
      const updates: Partial<VitalSigns> = {
        respiratoryRate: 20,
        heartRate: 80,
        systolicBP: 120
      };

      service.updateVitalSigns(updates);
      const vitalSigns = service.getCurrentVitalSigns();

      expect(vitalSigns.respiratoryRate).toBe(20);
      expect(vitalSigns.heartRate).toBe(80);
      expect(vitalSigns.systolicBP).toBe(120);
      expect(vitalSigns.supplementalOxygen).toBe(false); // Should preserve existing values
    });

    it('should reset vital signs to initial state', () => {
      service.updateVitalSigns({
        respiratoryRate: 25,
        heartRate: 100,
        systolicBP: 90
      });

      service.reset();
      const vitalSigns = service.getCurrentVitalSigns();

      expect(vitalSigns.supplementalOxygen).toBe(false);
      expect(vitalSigns.respiratoryRate).toBeUndefined();
      expect(vitalSigns.heartRate).toBeUndefined();
      expect(vitalSigns.systolicBP).toBeUndefined();
    });
  });

  describe('Real-time calculation updates', () => {
    it('should notify subscribers when vital signs are updated', () => {
      const mockCallback = vi.fn();
      const unsubscribe = service.subscribe(mockCallback);

      // Should call immediately with initial results
      expect(mockCallback).toHaveBeenCalledTimes(1);

      // Update vital signs
      service.updateVitalSigns({ respiratoryRate: 20 });

      // Should call again with updated results
      expect(mockCallback).toHaveBeenCalledTimes(2);

      unsubscribe();
    });

    it('should notify subscribers when reset is called', () => {
      const mockCallback = vi.fn();
      service.subscribe(mockCallback);

      // Clear the initial call
      mockCallback.mockClear();

      service.reset();

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('should allow multiple subscribers', () => {
      const mockCallback1 = vi.fn();
      const mockCallback2 = vi.fn();

      service.subscribe(mockCallback1);
      service.subscribe(mockCallback2);

      // Clear initial calls
      mockCallback1.mockClear();
      mockCallback2.mockClear();

      service.updateVitalSigns({ respiratoryRate: 15 });

      expect(mockCallback1).toHaveBeenCalledTimes(1);
      expect(mockCallback2).toHaveBeenCalledTimes(1);
    });

    it('should properly unsubscribe listeners', () => {
      const mockCallback = vi.fn();
      const unsubscribe = service.subscribe(mockCallback);

      // Clear initial call
      mockCallback.mockClear();

      unsubscribe();
      service.updateVitalSigns({ respiratoryRate: 18 });

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('Simultaneous calculations', () => {
    it('should calculate both NEWS2 and q-SOFA scores with complete data', () => {
      const completeVitalSigns: VitalSigns = {
        respiratoryRate: 16, // 12-20 = 0 points
        oxygenSaturation: 98, // ≥96 = 0 points
        supplementalOxygen: false, // false = 0 points
        temperature: 37.0, // 36.1-38.0 = 0 points
        systolicBP: 120, // 111-219 = 0 points
        heartRate: 70, // 51-90 = 0 points
        consciousnessLevel: 'A' // Alert = 0 points
      };

      service.updateVitalSigns(completeVitalSigns);
      const results = service.calculateBothScores();

      expect(results.news2.isComplete).toBe(true);
      expect(results.news2.score).toBe(0); // All normal values should give score 0
      expect(results.news2.riskLevel).toBe('low');

      expect(results.qsofa.isComplete).toBe(true);
      expect(results.qsofa.score).toBe(0); // All normal values should give score 0
      expect(results.qsofa.riskLevel).toBe('low');
    });

    it('should handle incomplete data for NEWS2 but complete for q-SOFA', () => {
      const partialVitalSigns: VitalSigns = {
        respiratoryRate: 25, // High RR
        systolicBP: 90, // Low BP
        consciousnessLevel: 'C', // Altered consciousness
        supplementalOxygen: false
        // Missing: oxygenSaturation, temperature, heartRate for NEWS2
      };

      service.updateVitalSigns(partialVitalSigns);
      const results = service.calculateBothScores();

      expect(results.news2.isComplete).toBe(false);
      expect(results.news2.score).toBeNull();
      expect(results.news2.riskLevel).toBeNull();

      expect(results.qsofa.isComplete).toBe(true);
      expect(results.qsofa.score).toBe(3); // All three q-SOFA criteria met
      expect(results.qsofa.riskLevel).toBe('high');
    });

    it('should handle complete NEWS2 but incomplete q-SOFA', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 18,
        oxygenSaturation: 98,
        supplementalOxygen: false,
        temperature: 36.5,
        systolicBP: 130,
        heartRate: 75,
        // Missing consciousnessLevel for q-SOFA
      };

      service.updateVitalSigns(vitalSigns);
      const results = service.calculateBothScores();

      expect(results.news2.isComplete).toBe(false); // Missing consciousnessLevel
      expect(results.qsofa.isComplete).toBe(false); // Missing consciousnessLevel
    });
  });

  describe('Data completeness checking', () => {
    it('should correctly identify missing fields for NEWS2', () => {
      service.updateVitalSigns({
        respiratoryRate: 20,
        heartRate: 80
        // Missing: oxygenSaturation, temperature, systolicBP, consciousnessLevel
      });

      const completeness = service.getDataCompleteness();

      expect(completeness.news2.isComplete).toBe(false);
      expect(completeness.news2.missingFields).toEqual([
        'oxygenSaturation',
        'temperature',
        'systolicBP',
        'consciousnessLevel'
      ]);
      expect(completeness.news2.completionPercentage).toBe(33); // 2 out of 6 fields
    });

    it('should correctly identify missing fields for q-SOFA', () => {
      service.updateVitalSigns({
        respiratoryRate: 20
        // Missing: systolicBP, consciousnessLevel
      });

      const completeness = service.getDataCompleteness();

      expect(completeness.qsofa.isComplete).toBe(false);
      expect(completeness.qsofa.missingFields).toEqual([
        'systolicBP',
        'consciousnessLevel'
      ]);
      expect(completeness.qsofa.completionPercentage).toBe(33); // 1 out of 3 fields
    });

    it('should show 100% completion when all fields are present', () => {
      const completeVitalSigns: VitalSigns = {
        respiratoryRate: 20,
        oxygenSaturation: 95,
        supplementalOxygen: false,
        temperature: 37.0,
        systolicBP: 120,
        heartRate: 80,
        consciousnessLevel: 'A'
      };

      service.updateVitalSigns(completeVitalSigns);
      const completeness = service.getDataCompleteness();

      expect(completeness.news2.isComplete).toBe(true);
      expect(completeness.news2.completionPercentage).toBe(100);
      expect(completeness.qsofa.isComplete).toBe(true);
      expect(completeness.qsofa.completionPercentage).toBe(100);
    });
  });

  describe('Field requirements', () => {
    it('should return correct field requirements', () => {
      const requirements = service.getFieldRequirements();

      expect(requirements.news2).toEqual([
        'respiratoryRate',
        'oxygenSaturation',
        'supplementalOxygen',
        'temperature',
        'systolicBP',
        'heartRate',
        'consciousnessLevel'
      ]);

      expect(requirements.qsofa).toEqual([
        'respiratoryRate',
        'systolicBP',
        'consciousnessLevel'
      ]);

      expect(requirements.shared).toEqual([
        'respiratoryRate',
        'systolicBP',
        'consciousnessLevel'
      ]);
    });
  });

  describe('Detailed results', () => {
    it('should return detailed results with breakdowns', () => {
      const vitalSigns: VitalSigns = {
        respiratoryRate: 25, // 3 points for NEWS2
        oxygenSaturation: 92, // 2 points for NEWS2
        supplementalOxygen: true, // 2 points for NEWS2
        temperature: 39.5, // 2 points for NEWS2
        systolicBP: 85, // 3 points for NEWS2, 1 point for q-SOFA
        heartRate: 120, // 2 points for NEWS2
        consciousnessLevel: 'V' // 3 points for NEWS2, 1 point for q-SOFA
      };

      service.updateVitalSigns(vitalSigns);
      const detailed = service.getDetailedResults();

      expect(detailed.news2.breakdown).toBeDefined();
      expect(detailed.news2.breakdown?.respiratoryRate).toBe(3);
      expect(detailed.news2.breakdown?.oxygenSaturation).toBe(2);
      expect(detailed.news2.breakdown?.supplementalOxygen).toBe(2);

      expect(detailed.qsofa.breakdown).toBeDefined();
      expect(detailed.qsofa.breakdown?.respiratoryRate).toBe(1); // ≥22
      expect(detailed.qsofa.breakdown?.systolicBP).toBe(1); // ≤100
      expect(detailed.qsofa.breakdown?.consciousnessLevel).toBe(1); // Altered
    });
  });

  describe('Utility methods', () => {
    it('should correctly identify if any calculations can be performed', () => {
      // No data
      expect(service.hasAnyCalculableData()).toBe(false);

      // Partial data sufficient for q-SOFA
      service.updateVitalSigns({
        respiratoryRate: 20,
        systolicBP: 120,
        consciousnessLevel: 'A'
      });
      expect(service.hasAnyCalculableData()).toBe(true);
    });

    it('should return minimum data requirements', () => {
      const requirements = service.getMinimumDataRequirements();

      expect(requirements.forNews2).toHaveLength(6);
      expect(requirements.forQsofa).toHaveLength(3);
      expect(requirements.forEither).toHaveLength(3);
      expect(requirements.forEither).toEqual([
        'respiratoryRate',
        'systolicBP',
        'consciousnessLevel'
      ]);
    });
  });
});

describe('Singleton instance', () => {
  it('should provide a singleton instance', () => {
    expect(unifiedCalculationService).toBeInstanceOf(UnifiedCalculationService);
  });

  it('should maintain state across multiple accesses', () => {
    unifiedCalculationService.updateVitalSigns({ respiratoryRate: 22 });
    
    const vitalSigns1 = unifiedCalculationService.getCurrentVitalSigns();
    const vitalSigns2 = unifiedCalculationService.getCurrentVitalSigns();
    
    expect(vitalSigns1.respiratoryRate).toBe(22);
    expect(vitalSigns2.respiratoryRate).toBe(22);
  });
});

describe('useUnifiedCalculations hook', () => {
  it('should provide all necessary methods', () => {
    const hook = useUnifiedCalculations();

    expect(typeof hook.updateVitalSigns).toBe('function');
    expect(typeof hook.getCurrentVitalSigns).toBe('function');
    expect(typeof hook.calculateBothScores).toBe('function');
    expect(typeof hook.getDataCompleteness).toBe('function');
    expect(typeof hook.getFieldRequirements).toBe('function');
    expect(typeof hook.getDetailedResults).toBe('function');
    expect(typeof hook.hasAnyCalculableData).toBe('function');
    expect(typeof hook.getMinimumDataRequirements).toBe('function');
    expect(typeof hook.reset).toBe('function');
    expect(typeof hook.subscribe).toBe('function');
  });

  it('should work with the singleton instance', () => {
    const hook = useUnifiedCalculations();
    
    hook.updateVitalSigns({ respiratoryRate: 18 });
    const vitalSigns = hook.getCurrentVitalSigns();
    
    expect(vitalSigns.respiratoryRate).toBe(18);
  });
});