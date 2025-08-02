/**
 * Validation utilities for vital signs input
 * Ensures physiological ranges are within acceptable limits
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  warningMessage?: string;
}

export interface ValidationState {
  [key: string]: ValidationResult;
}

export interface FieldValidationConfig {
  required?: boolean;
  min?: number;
  max?: number;
  allowEmpty?: boolean;
}

/**
 * Validate respiratory rate input
 */
export function validateRespiratoryRate(value: number): ValidationResult {
  if (value < 0 || value > 60) {
    return {
      isValid: false,
      errorMessage: 'Respiratory rate must be between 0 and 60 breaths/min'
    };
  }
  return { isValid: true };
}

/**
 * Validate heart rate input
 */
export function validateHeartRate(value: number): ValidationResult {
  if (value < 0 || value > 300) {
    return {
      isValid: false,
      errorMessage: 'Heart rate must be between 0 and 300 bpm'
    };
  }
  return { isValid: true };
}

/**
 * Validate systolic blood pressure input
 */
export function validateSystolicBP(value: number): ValidationResult {
  if (value < 50 || value > 300) {
    return {
      isValid: false,
      errorMessage: 'Systolic blood pressure must be between 50 and 300 mmHg'
    };
  }
  return { isValid: true };
}

/**
 * Validate temperature input
 */
export function validateTemperature(value: number): ValidationResult {
  if (value < 25 || value > 45) {
    return {
      isValid: false,
      errorMessage: 'Temperature must be between 25 and 45°C'
    };
  }
  return { isValid: true };
}

/**
 * Validate oxygen saturation input
 */
export function validateOxygenSaturation(value: number): ValidationResult {
  if (value < 70 || value > 100) {
    return {
      isValid: false,
      errorMessage: 'Oxygen saturation must be between 70 and 100%'
    };
  }
  return { isValid: true };
}

/**
 * Validate q-SOFA specific inputs
 * q-SOFA only requires respiratory rate, systolic BP, and consciousness level
 */
export function validateQSOFAInputs(vitalSigns: {
  respiratoryRate?: number;
  systolicBP?: number;
  consciousnessLevel?: string;
}): { [key: string]: ValidationResult } {
  const results: { [key: string]: ValidationResult } = {};

  if (vitalSigns.respiratoryRate !== undefined) {
    results.respiratoryRate = validateRespiratoryRate(vitalSigns.respiratoryRate);
  }

  if (vitalSigns.systolicBP !== undefined) {
    results.systolicBP = validateSystolicBP(vitalSigns.systolicBP);
  }

  // Consciousness level validation for q-SOFA
  if (vitalSigns.consciousnessLevel !== undefined) {
    const validLevels = ['A', 'C', 'V', 'P', 'U'];
    if (!validLevels.includes(vitalSigns.consciousnessLevel)) {
      results.consciousnessLevel = {
        isValid: false,
        errorMessage: 'Consciousness level must be one of: A, C, V, P, U'
      };
    } else {
      results.consciousnessLevel = { isValid: true };
    }
  }

  return results;
}

/**
 * Check if q-SOFA inputs are complete
 */
export function isQSOFAComplete(vitalSigns: {
  respiratoryRate?: number;
  systolicBP?: number;
  consciousnessLevel?: string;
}): boolean {
  return vitalSigns.respiratoryRate !== undefined &&
         vitalSigns.systolicBP !== undefined &&
         vitalSigns.consciousnessLevel !== undefined;
}

/**
 * Validate all vital signs at once
 */
export function validateVitalSigns(vitalSigns: {
  respiratoryRate?: number;
  heartRate?: number;
  systolicBP?: number;
  temperature?: number;
  oxygenSaturation?: number;
}): { [key: string]: ValidationResult } {
  const results: { [key: string]: ValidationResult } = {};

  if (vitalSigns.respiratoryRate !== undefined) {
    results.respiratoryRate = validateRespiratoryRate(vitalSigns.respiratoryRate);
  }

  if (vitalSigns.heartRate !== undefined) {
    results.heartRate = validateHeartRate(vitalSigns.heartRate);
  }

  if (vitalSigns.systolicBP !== undefined) {
    results.systolicBP = validateSystolicBP(vitalSigns.systolicBP);
  }

  if (vitalSigns.temperature !== undefined) {
    results.temperature = validateTemperature(vitalSigns.temperature);
  }

  if (vitalSigns.oxygenSaturation !== undefined) {
    results.oxygenSaturation = validateOxygenSaturation(vitalSigns.oxygenSaturation);
  }

  return results;
}

/**
 * Enhanced validation function that handles empty values and provides better error messages
 */
export function validateField(
  fieldName: string,
  value: number | string | undefined,
  config: FieldValidationConfig = {}
): ValidationResult {
  // Handle empty/undefined values
  if (value === undefined || value === null || value === '') {
    if (config.required) {
      return {
        isValid: false,
        errorMessage: `${fieldName} is required`
      };
    }
    return { isValid: true }; // Empty values are valid if not required
  }

  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(numValue)) {
    return {
      isValid: false,
      errorMessage: `${fieldName} must be a valid number`
    };
  }

  // Apply specific validation based on field name
  switch (fieldName.toLowerCase()) {
    case 'respiratoryrate':
    case 'respiratory rate':
      return validateRespiratoryRate(numValue);
    case 'heartrate':
    case 'heart rate':
      return validateHeartRate(numValue);
    case 'systolicbp':
    case 'systolic bp':
    case 'blood pressure':
      return validateSystolicBP(numValue);
    case 'temperature':
      return validateTemperature(numValue);
    case 'oxygensaturation':
    case 'oxygen saturation':
      return validateOxygenSaturation(numValue);
    default:
      // Generic range validation
      if (config.min !== undefined && numValue < config.min) {
        return {
          isValid: false,
          errorMessage: `${fieldName} must be at least ${config.min}`
        };
      }
      if (config.max !== undefined && numValue > config.max) {
        return {
          isValid: false,
          errorMessage: `${fieldName} must be no more than ${config.max}`
        };
      }
      return { isValid: true };
  }
}

/**
 * Real-time validation for input changes
 * Provides immediate feedback as user types
 */
export function validateInputChange(
  fieldName: string,
  value: string
): ValidationResult {
  // Allow empty input during typing
  if (value === '') {
    return { isValid: true };
  }

  // Check for partial numeric input (e.g., "12." or "-")
  if (value === '.' || value === '-' || value.endsWith('.')) {
    return { 
      isValid: true,
      warningMessage: 'Enter a complete number'
    };
  }

  // Check for invalid characters in numeric fields
  const numericFields = ['respiratoryRate', 'heartRate', 'systolicBP', 'temperature', 'oxygenSaturation'];
  if (numericFields.some(field => fieldName.toLowerCase().includes(field.toLowerCase()))) {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return {
        isValid: false,
        errorMessage: 'Please enter a valid number'
      };
    }
  }

  // Validate the current input
  return validateField(fieldName, value);
}

/**
 * Get user-friendly error messages for validation results
 */
export function getValidationMessage(
  fieldName: string,
  validation: ValidationResult
): string {
  if (validation.isValid) {
    return validation.warningMessage || '';
  }
  
  return validation.errorMessage || `Invalid ${fieldName}`;
}

/**
 * Check if any validation results contain errors
 */
export function hasValidationErrors(validationState: ValidationState): boolean {
  return Object.values(validationState).some(result => !result.isValid);
}

/**
 * Get all error messages from validation state
 */
export function getValidationErrors(validationState: ValidationState): string[] {
  return Object.values(validationState)
    .filter(result => !result.isValid && result.errorMessage)
    .map(result => result.errorMessage!);
}

/**
 * Validate consciousness level with enhanced error messages
 */
export function validateConsciousnessLevel(value: string | undefined): ValidationResult {
  if (value === undefined || value === '') {
    return { isValid: true }; // Optional field
  }

  const validLevels = ['A', 'C', 'V', 'P', 'U'];
  if (!validLevels.includes(value.toUpperCase())) {
    return {
      isValid: false,
      errorMessage: 'Consciousness level must be A (Alert), C (Confusion), V (Voice), P (Pain), or U (Unresponsive)'
    };
  }

  return { isValid: true };
}

/**
 * Enhanced validation with detailed physiological context
 */
export function validateWithPhysiologicalContext(
  fieldName: string,
  value: number | string | undefined,
  config: FieldValidationConfig = {}
): ValidationResult {
  // Handle empty/undefined values
  if (value === undefined || value === null || value === '') {
    if (config.required) {
      return {
        isValid: false,
        errorMessage: `${fieldName} is required for accurate calculation`
      };
    }
    return { isValid: true };
  }

  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(numValue)) {
    return {
      isValid: false,
      errorMessage: `${fieldName} must be a valid number`
    };
  }

  // Enhanced field-specific validation with physiological context
  switch (fieldName.toLowerCase()) {
    case 'respiratoryrate':
    case 'respiratory rate':
      if (numValue < 0) {
        return {
          isValid: false,
          errorMessage: 'Respiratory rate cannot be negative'
        };
      }
      if (numValue > 60) {
        return {
          isValid: false,
          errorMessage: 'Respiratory rate above 60 breaths/min is extremely high - please verify'
        };
      }
      if (numValue < 8 && numValue > 0) {
        return {
          isValid: true,
          warningMessage: 'Very low respiratory rate - please verify'
        };
      }
      if (numValue > 30) {
        return {
          isValid: true,
          warningMessage: 'High respiratory rate - please verify'
        };
      }
      return { isValid: true };

    case 'heartrate':
    case 'heart rate':
      if (numValue < 0) {
        return {
          isValid: false,
          errorMessage: 'Heart rate cannot be negative'
        };
      }
      if (numValue > 300) {
        return {
          isValid: false,
          errorMessage: 'Heart rate above 300 bpm is not physiologically possible'
        };
      }
      if (numValue < 30 && numValue > 0) {
        return {
          isValid: true,
          warningMessage: 'Very low heart rate - please verify'
        };
      }
      if (numValue > 150) {
        return {
          isValid: true,
          warningMessage: 'High heart rate - please verify'
        };
      }
      return { isValid: true };

    case 'systolicbp':
    case 'systolic bp':
    case 'blood pressure':
      if (numValue < 50) {
        return {
          isValid: false,
          errorMessage: 'Systolic blood pressure below 50 mmHg is critically low'
        };
      }
      if (numValue > 300) {
        return {
          isValid: false,
          errorMessage: 'Systolic blood pressure above 300 mmHg is not physiologically possible'
        };
      }
      if (numValue < 90) {
        return {
          isValid: true,
          warningMessage: 'Low blood pressure - please verify'
        };
      }
      if (numValue > 180) {
        return {
          isValid: true,
          warningMessage: 'High blood pressure - please verify'
        };
      }
      return { isValid: true };

    case 'temperature':
      if (numValue < 25) {
        return {
          isValid: false,
          errorMessage: 'Temperature below 25°C is not compatible with life'
        };
      }
      if (numValue > 45) {
        return {
          isValid: false,
          errorMessage: 'Temperature above 45°C is not compatible with life'
        };
      }
      if (numValue < 35) {
        return {
          isValid: true,
          warningMessage: 'Low body temperature (hypothermia) - please verify'
        };
      }
      if (numValue > 40) {
        return {
          isValid: true,
          warningMessage: 'High fever - please verify'
        };
      }
      return { isValid: true };

    case 'oxygensaturation':
    case 'oxygen saturation':
      if (numValue < 70) {
        return {
          isValid: false,
          errorMessage: 'Oxygen saturation below 70% is critically low'
        };
      }
      if (numValue > 100) {
        return {
          isValid: false,
          errorMessage: 'Oxygen saturation cannot exceed 100%'
        };
      }
      if (numValue < 90) {
        return {
          isValid: true,
          warningMessage: 'Low oxygen saturation - please verify'
        };
      }
      return { isValid: true };

    default:
      // Generic range validation
      if (config.min !== undefined && numValue < config.min) {
        return {
          isValid: false,
          errorMessage: `${fieldName} must be at least ${config.min}`
        };
      }
      if (config.max !== undefined && numValue > config.max) {
        return {
          isValid: false,
          errorMessage: `${fieldName} must be no more than ${config.max}`
        };
      }
      return { isValid: true };
  }
}

/**
 * Comprehensive validation for all vital signs with enhanced error handling
 */
export function validateAllVitalSigns(vitalSigns: {
  respiratoryRate?: number;
  heartRate?: number;
  systolicBP?: number;
  temperature?: number;
  oxygenSaturation?: number;
  consciousnessLevel?: string;
  supplementalOxygen?: boolean;
}): { [key: string]: ValidationResult } {
  const results: { [key: string]: ValidationResult } = {};

  if (vitalSigns.respiratoryRate !== undefined) {
    results.respiratoryRate = validateWithPhysiologicalContext('respiratoryRate', vitalSigns.respiratoryRate);
  }

  if (vitalSigns.heartRate !== undefined) {
    results.heartRate = validateWithPhysiologicalContext('heartRate', vitalSigns.heartRate);
  }

  if (vitalSigns.systolicBP !== undefined) {
    results.systolicBP = validateWithPhysiologicalContext('systolicBP', vitalSigns.systolicBP);
  }

  if (vitalSigns.temperature !== undefined) {
    results.temperature = validateWithPhysiologicalContext('temperature', vitalSigns.temperature);
  }

  if (vitalSigns.oxygenSaturation !== undefined) {
    results.oxygenSaturation = validateWithPhysiologicalContext('oxygenSaturation', vitalSigns.oxygenSaturation);
  }

  if (vitalSigns.consciousnessLevel !== undefined) {
    results.consciousnessLevel = validateConsciousnessLevel(vitalSigns.consciousnessLevel);
  }

  // Supplemental oxygen is always valid (boolean)
  if (vitalSigns.supplementalOxygen !== undefined) {
    results.supplementalOxygen = { isValid: true };
  }

  return results;
}

/**
 * Get validation severity level for UI styling
 */
export function getValidationSeverity(validation: ValidationResult): 'none' | 'warning' | 'error' {
  if (!validation) return 'none';
  if (!validation.isValid) return 'error';
  if (validation.warningMessage) return 'warning';
  return 'none';
}

/**
 * Check if validation allows form submission
 */
export function canSubmitWithValidation(validationState: ValidationState): boolean {
  return !Object.values(validationState).some(result => !result.isValid);
}

/**
 * Get summary of validation issues
 */
export function getValidationSummary(validationState: ValidationState): {
  errorCount: number;
  warningCount: number;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  Object.values(validationState).forEach(result => {
    if (!result.isValid && result.errorMessage) {
      errors.push(result.errorMessage);
    } else if (result.isValid && result.warningMessage) {
      warnings.push(result.warningMessage);
    }
  });

  return {
    errorCount: errors.length,
    warningCount: warnings.length,
    errors,
    warnings
  };
}