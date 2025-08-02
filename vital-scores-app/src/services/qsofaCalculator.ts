import { VitalSigns, ConsciousnessLevel } from '../types';

export interface QSOFAScore {
  score: number | null;
  riskLevel: 'low' | 'high' | null;
  isComplete: boolean;
  breakdown: {
    respiratoryRate: number;
    systolicBP: number;
    consciousnessLevel: number;
  } | null;
}

/**
 * Calculate q-SOFA score based on vital signs
 * q-SOFA (quick Sequential Organ Failure Assessment) is a bedside scoring system
 * used to identify patients at risk of sepsis-related complications
 * 
 * Criteria:
 * - Respiratory rate ≥22 breaths/min (1 point)
 * - Systolic blood pressure ≤100 mmHg (1 point)
 * - Altered consciousness (any level other than Alert) (1 point)
 * 
 * Score ≥2 indicates high risk of sepsis-related complications
 */
export function calculateQSOFA(vitalSigns: VitalSigns): QSOFAScore {
  // Check if we have all required fields for q-SOFA
  const requiredFields = [
    'respiratoryRate',
    'systolicBP',
    'consciousnessLevel'
  ] as const;

  const hasAllRequiredFields = requiredFields.every(field => 
    vitalSigns[field] !== undefined && vitalSigns[field] !== null
  );

  if (!hasAllRequiredFields) {
    return {
      score: null,
      riskLevel: null,
      isComplete: false,
      breakdown: null
    };
  }

  // Calculate individual component scores
  const respiratoryRateScore = calculateQSOFARespiratoryRateScore(vitalSigns.respiratoryRate!);
  const systolicBPScore = calculateQSOFASystolicBPScore(vitalSigns.systolicBP!);
  const consciousnessScore = calculateQSOFAConsciousnessScore(vitalSigns.consciousnessLevel!);

  const totalScore = respiratoryRateScore + systolicBPScore + consciousnessScore;
  const riskLevel = determineQSOFARiskLevel(totalScore);

  return {
    score: totalScore,
    riskLevel,
    isComplete: true,
    breakdown: {
      respiratoryRate: respiratoryRateScore,
      systolicBP: systolicBPScore,
      consciousnessLevel: consciousnessScore
    }
  };
}

/**
 * Calculate respiratory rate score according to q-SOFA criteria
 * ≥22 breaths/min = 1 point, <22 breaths/min = 0 points
 */
function calculateQSOFARespiratoryRateScore(respiratoryRate: number): number {
  return respiratoryRate >= 22 ? 1 : 0;
}

/**
 * Calculate systolic blood pressure score according to q-SOFA criteria
 * ≤100 mmHg = 1 point, >100 mmHg = 0 points
 */
function calculateQSOFASystolicBPScore(systolicBP: number): number {
  return systolicBP <= 100 ? 1 : 0;
}

/**
 * Calculate consciousness level score according to q-SOFA criteria
 * Any altered consciousness (C, V, P, U) = 1 point, Alert (A) = 0 points
 */
function calculateQSOFAConsciousnessScore(consciousnessLevel: ConsciousnessLevel): number {
  return consciousnessLevel === 'A' ? 0 : 1;
}

/**
 * Determine risk level based on total q-SOFA score
 * Score ≥2 indicates high risk of sepsis-related complications
 * Score <2 indicates low risk
 */
function determineQSOFARiskLevel(score: number): 'low' | 'high' {
  return score >= 2 ? 'high' : 'low';
}