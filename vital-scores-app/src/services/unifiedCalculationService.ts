import { VitalSigns, CalculationResults } from '../types';
import { calculateNEWS2, NEWS2Score } from './news2Calculator';
import { calculateQSOFA, QSOFAScore } from './qsofaCalculator';

/**
 * Unified calculation service that handles both NEWS2 and q-SOFA calculations simultaneously
 * Provides real-time calculation updates and data completeness checking
 */
export class UnifiedCalculationService {
  private currentVitalSigns: VitalSigns;
  private listeners: Set<(results: CalculationResults) => void>;

  constructor() {
    this.currentVitalSigns = {
      supplementalOxygen: false
    };
    this.listeners = new Set();
  }

  /**
   * Subscribe to real-time calculation updates
   * @param callback Function to call when calculations are updated
   * @returns Unsubscribe function
   */
  subscribe(callback: (results: CalculationResults) => void): () => void {
    this.listeners.add(callback);
    
    // Immediately call with current results
    callback(this.calculateBothScores());
    
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Update vital signs and trigger real-time calculation updates
   * @param updates Partial vital signs to update
   */
  updateVitalSigns(updates: Partial<VitalSigns>): void {
    this.currentVitalSigns = {
      ...this.currentVitalSigns,
      ...updates
    };

    // Notify all listeners of the updated calculations
    const results = this.calculateBothScores();
    this.listeners.forEach(callback => callback(results));
  }

  /**
   * Get current vital signs
   */
  getCurrentVitalSigns(): VitalSigns {
    return { ...this.currentVitalSigns };
  }

  /**
   * Reset all vital signs to initial state
   */
  reset(): void {
    this.currentVitalSigns = {
      supplementalOxygen: false
    };

    // Notify all listeners of the reset
    const results = this.calculateBothScores();
    this.listeners.forEach(callback => callback(results));
  }

  /**
   * Calculate both NEWS2 and q-SOFA scores simultaneously
   */
  calculateBothScores(): CalculationResults {
    const news2Result = calculateNEWS2(this.currentVitalSigns);
    const qsofaResult = calculateQSOFA(this.currentVitalSigns);

    return {
      news2: {
        score: news2Result.score,
        riskLevel: news2Result.riskLevel,
        isComplete: news2Result.isComplete
      },
      qsofa: {
        score: qsofaResult.score,
        riskLevel: qsofaResult.riskLevel,
        isComplete: qsofaResult.isComplete
      }
    };
  }

  /**
   * Check data completeness for both scoring systems
   */
  getDataCompleteness(): {
    news2: {
      isComplete: boolean;
      missingFields: string[];
      completionPercentage: number;
    };
    qsofa: {
      isComplete: boolean;
      missingFields: string[];
      completionPercentage: number;
    };
  } {
    const news2Completeness = this.checkNEWS2Completeness();
    const qsofaCompleteness = this.checkQSOFACompleteness();

    return {
      news2: news2Completeness,
      qsofa: qsofaCompleteness
    };
  }

  /**
   * Check which fields are required for each scoring system
   */
  getFieldRequirements(): {
    news2: string[];
    qsofa: string[];
    shared: string[];
  } {
    const news2Fields = [
      'respiratoryRate',
      'oxygenSaturation',
      'supplementalOxygen',
      'temperature',
      'systolicBP',
      'heartRate',
      'consciousnessLevel'
    ];

    const qsofaFields = [
      'respiratoryRate',
      'systolicBP',
      'consciousnessLevel'
    ];

    const sharedFields = news2Fields.filter(field => qsofaFields.includes(field));

    return {
      news2: news2Fields,
      qsofa: qsofaFields,
      shared: sharedFields
    };
  }

  /**
   * Get detailed calculation results including breakdowns
   */
  getDetailedResults(): {
    news2: NEWS2Score;
    qsofa: QSOFAScore;
  } {
    return {
      news2: calculateNEWS2(this.currentVitalSigns),
      qsofa: calculateQSOFA(this.currentVitalSigns)
    };
  }

  /**
   * Check if any calculations can be performed with current data
   */
  hasAnyCalculableData(): boolean {
    const results = this.calculateBothScores();
    return results.news2.isComplete || results.qsofa.isComplete;
  }

  /**
   * Get the minimum data needed to start calculations
   */
  getMinimumDataRequirements(): {
    forNews2: string[];
    forQsofa: string[];
    forEither: string[];
  } {
    return {
      forNews2: [
        'respiratoryRate',
        'oxygenSaturation',
        'temperature',
        'systolicBP',
        'heartRate',
        'consciousnessLevel'
      ],
      forQsofa: [
        'respiratoryRate',
        'systolicBP',
        'consciousnessLevel'
      ],
      forEither: [
        'respiratoryRate',
        'systolicBP',
        'consciousnessLevel'
      ]
    };
  }

  private checkNEWS2Completeness(): {
    isComplete: boolean;
    missingFields: string[];
    completionPercentage: number;
  } {
    const requiredFields = [
      'respiratoryRate',
      'oxygenSaturation',
      'temperature',
      'systolicBP',
      'heartRate',
      'consciousnessLevel'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = this.currentVitalSigns[field as keyof VitalSigns];
      return value === undefined || value === null;
    });

    const completedFields = requiredFields.length - missingFields.length;
    const completionPercentage = Math.round((completedFields / requiredFields.length) * 100);

    return {
      isComplete: missingFields.length === 0,
      missingFields,
      completionPercentage
    };
  }

  private checkQSOFACompleteness(): {
    isComplete: boolean;
    missingFields: string[];
    completionPercentage: number;
  } {
    const requiredFields = [
      'respiratoryRate',
      'systolicBP',
      'consciousnessLevel'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = this.currentVitalSigns[field as keyof VitalSigns];
      return value === undefined || value === null;
    });

    const completedFields = requiredFields.length - missingFields.length;
    const completionPercentage = Math.round((completedFields / requiredFields.length) * 100);

    return {
      isComplete: missingFields.length === 0,
      missingFields,
      completionPercentage
    };
  }
}

/**
 * Singleton instance of the unified calculation service
 * This ensures consistent state across the application
 */
export const unifiedCalculationService = new UnifiedCalculationService();

/**
 * Hook-like function for React components to use the unified calculation service
 * This provides a clean interface for components to interact with the service
 */
export function useUnifiedCalculations() {
  return {
    updateVitalSigns: (updates: Partial<VitalSigns>) => 
      unifiedCalculationService.updateVitalSigns(updates),
    
    getCurrentVitalSigns: () => 
      unifiedCalculationService.getCurrentVitalSigns(),
    
    calculateBothScores: () => 
      unifiedCalculationService.calculateBothScores(),
    
    getDataCompleteness: () => 
      unifiedCalculationService.getDataCompleteness(),
    
    getFieldRequirements: () => 
      unifiedCalculationService.getFieldRequirements(),
    
    getDetailedResults: () => 
      unifiedCalculationService.getDetailedResults(),
    
    hasAnyCalculableData: () => 
      unifiedCalculationService.hasAnyCalculableData(),
    
    getMinimumDataRequirements: () => 
      unifiedCalculationService.getMinimumDataRequirements(),
    
    reset: () => 
      unifiedCalculationService.reset(),
    
    subscribe: (callback: (results: CalculationResults) => void) => 
      unifiedCalculationService.subscribe(callback)
  };
}