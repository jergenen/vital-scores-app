import { VitalSigns, ConsciousnessLevel } from '../types';

export interface NEWS2Score {
  score: number | null;
  riskLevel: 'low' | 'medium' | 'high' | null;
  isComplete: boolean;
  breakdown: {
    respiratoryRate: number;
    oxygenSaturation: number;
    supplementalOxygen: number;
    temperature: number;
    systolicBP: number;
    heartRate: number;
    consciousnessLevel: number;
  } | null;
}

/**
 * Calculate NEWS2 score based on vital signs
 * NEWS2 (National Early Warning Score 2) is a standardized scoring system
 * used to identify deteriorating patients in healthcare settings
 */
export function calculateNEWS2(vitalSigns: VitalSigns): NEWS2Score {
  // Check if we have all required fields for NEWS2
  const requiredFields = [
    'respiratoryRate',
    'oxygenSaturation', 
    'temperature',
    'systolicBP',
    'heartRate',
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
  const respiratoryRateScore = calculateRespiratoryRateScore(vitalSigns.respiratoryRate!);
  const oxygenSaturationScore = calculateOxygenSaturationScore(vitalSigns.oxygenSaturation!);
  const supplementalOxygenScore = vitalSigns.supplementalOxygen ? 2 : 0;
  const temperatureScore = calculateTemperatureScore(vitalSigns.temperature!);
  const systolicBPScore = calculateSystolicBPScore(vitalSigns.systolicBP!);
  const heartRateScore = calculateHeartRateScore(vitalSigns.heartRate!);
  const consciousnessScore = calculateConsciousnessScore(vitalSigns.consciousnessLevel!);

  const totalScore = respiratoryRateScore + oxygenSaturationScore + supplementalOxygenScore + 
                    temperatureScore + systolicBPScore + heartRateScore + consciousnessScore;

  const riskLevel = determineNEWS2RiskLevel(totalScore);

  return {
    score: totalScore,
    riskLevel,
    isComplete: true,
    breakdown: {
      respiratoryRate: respiratoryRateScore,
      oxygenSaturation: oxygenSaturationScore,
      supplementalOxygen: supplementalOxygenScore,
      temperature: temperatureScore,
      systolicBP: systolicBPScore,
      heartRate: heartRateScore,
      consciousnessLevel: consciousnessScore
    }
  };
}

/**
 * Calculate respiratory rate score according to NEWS2 criteria
 */
function calculateRespiratoryRateScore(respiratoryRate: number): number {
  if (respiratoryRate <= 8) return 3;
  if (respiratoryRate >= 9 && respiratoryRate <= 11) return 1;
  if (respiratoryRate >= 12 && respiratoryRate <= 20) return 0;
  if (respiratoryRate >= 21 && respiratoryRate <= 24) return 2;
  if (respiratoryRate >= 25) return 3;
  return 0;
}

/**
 * Calculate oxygen saturation score according to NEWS2 criteria
 */
function calculateOxygenSaturationScore(oxygenSaturation: number): number {
  if (oxygenSaturation <= 91) return 3;
  if (oxygenSaturation >= 92 && oxygenSaturation <= 93) return 2;
  if (oxygenSaturation >= 94 && oxygenSaturation <= 95) return 1;
  if (oxygenSaturation >= 96) return 0;
  return 0;
}

/**
 * Calculate temperature score according to NEWS2 criteria
 */
function calculateTemperatureScore(temperature: number): number {
  if (temperature <= 35.0) return 3;
  if (temperature >= 35.1 && temperature <= 36.0) return 1;
  if (temperature >= 36.1 && temperature <= 38.0) return 0;
  if (temperature >= 38.1 && temperature <= 39.0) return 1;
  if (temperature >= 39.1) return 2;
  return 0;
}

/**
 * Calculate systolic blood pressure score according to NEWS2 criteria
 */
function calculateSystolicBPScore(systolicBP: number): number {
  if (systolicBP <= 90) return 3;
  if (systolicBP >= 91 && systolicBP <= 100) return 2;
  if (systolicBP >= 101 && systolicBP <= 110) return 1;
  if (systolicBP >= 111 && systolicBP <= 219) return 0;
  if (systolicBP >= 220) return 3;
  return 0;
}

/**
 * Calculate heart rate score according to NEWS2 criteria
 */
function calculateHeartRateScore(heartRate: number): number {
  if (heartRate <= 40) return 3;
  if (heartRate >= 41 && heartRate <= 50) return 1;
  if (heartRate >= 51 && heartRate <= 90) return 0;
  if (heartRate >= 91 && heartRate <= 110) return 1;
  if (heartRate >= 111 && heartRate <= 130) return 2;
  if (heartRate >= 131) return 3;
  return 0;
}

/**
 * Calculate consciousness level score according to NEWS2 criteria
 */
function calculateConsciousnessScore(consciousnessLevel: ConsciousnessLevel): number {
  // A = Alert (0 points)
  // C, V, P, U = Any altered consciousness (3 points)
  return consciousnessLevel === 'A' ? 0 : 3;
}

/**
 * Determine risk level based on total NEWS2 score
 */
function determineNEWS2RiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 7) return 'high';
  if (score >= 5) return 'medium';
  return 'low';
}