import { useCallback } from 'react';
import { useVitalSigns } from '../contexts/VitalSignsContext';
import { 
  ValidationResult, 
  validateInputChange, 
  getValidationMessage, 
  validateWithPhysiologicalContext,
  getValidationSeverity,
  canSubmitWithValidation,
  getValidationSummary
} from '../utils/validation';

/**
 * Custom hook for handling input validation with real-time feedback
 */
export function useValidation() {
  const { state, updateValidation, clearValidation } = useVitalSigns();

  /**
   * Validate input as user types with real-time feedback
   */
  const validateInput = useCallback((fieldName: string, value: string): ValidationResult => {
    const validation = validateInputChange(fieldName, value);
    updateValidation(fieldName, validation);
    return validation;
  }, [updateValidation]);

  /**
   * Get validation result for a specific field
   */
  const getFieldValidation = useCallback((fieldName: string): ValidationResult | undefined => {
    return state.validationState[fieldName];
  }, [state.validationState]);

  /**
   * Get validation message for a specific field
   */
  const getFieldValidationMessage = useCallback((fieldName: string): string => {
    const validation = state.validationState[fieldName];
    if (!validation) return '';
    return getValidationMessage(fieldName, validation);
  }, [state.validationState]);

  /**
   * Check if a field has validation errors
   */
  const hasFieldError = useCallback((fieldName: string): boolean => {
    const validation = state.validationState[fieldName];
    return validation ? !validation.isValid : false;
  }, [state.validationState]);

  /**
   * Check if a field has validation warnings
   */
  const hasFieldWarning = useCallback((fieldName: string): boolean => {
    const validation = state.validationState[fieldName];
    return validation ? validation.isValid && !!validation.warningMessage : false;
  }, [state.validationState]);

  /**
   * Clear validation for a specific field
   */
  const clearFieldValidation = useCallback((fieldName: string) => {
    clearValidation(fieldName);
  }, [clearValidation]);

  /**
   * Clear all validation
   */
  const clearAllValidation = useCallback(() => {
    clearValidation();
  }, [clearValidation]);

  /**
   * Get validation state for visual indicators
   */
  const getValidationState = useCallback((fieldName: string): 'valid' | 'invalid' | 'warning' | 'none' => {
    const validation = state.validationState[fieldName];
    if (!validation) return 'none';
    
    if (!validation.isValid) return 'invalid';
    if (validation.warningMessage) return 'warning';
    return 'valid';
  }, [state.validationState]);

  /**
   * Validate input with enhanced physiological context
   */
  const validateWithContext = useCallback((fieldName: string, value: string | number): ValidationResult => {
    const validation = validateWithPhysiologicalContext(fieldName, value);
    updateValidation(fieldName, validation);
    return validation;
  }, [updateValidation]);

  /**
   * Get validation severity for styling
   */
  const getFieldValidationSeverity = useCallback((fieldName: string): 'none' | 'warning' | 'error' => {
    const validation = state.validationState[fieldName];
    return getValidationSeverity(validation);
  }, [state.validationState]);

  /**
   * Check if form can be submitted (no validation errors)
   */
  const canSubmit = useCallback((): boolean => {
    return canSubmitWithValidation(state.validationState);
  }, [state.validationState]);

  /**
   * Get validation summary for display
   */
  const getValidationSummaryData = useCallback(() => {
    return getValidationSummary(state.validationState);
  }, [state.validationState]);

  /**
   * Validate all current vital signs
   */
  const validateAllFields = useCallback(() => {
    const vitalSigns = state.vitalSigns;
    const validationResults: { [key: string]: ValidationResult } = {};

    // Validate each field that has a value
    Object.entries(vitalSigns).forEach(([fieldName, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (fieldName === 'consciousnessLevel') {
          validationResults[fieldName] = validateWithPhysiologicalContext(fieldName, value as string);
        } else if (typeof value === 'number') {
          validationResults[fieldName] = validateWithPhysiologicalContext(fieldName, value);
        }
      }
    });

    // Update all validations at once
    Object.entries(validationResults).forEach(([fieldName, validation]) => {
      updateValidation(fieldName, validation);
    });

    return validationResults;
  }, [state.vitalSigns, updateValidation]);

  return {
    validateInput,
    validateWithContext,
    validateAllFields,
    getFieldValidation,
    getFieldValidationMessage,
    getFieldValidationSeverity,
    hasFieldError,
    hasFieldWarning,
    clearFieldValidation,
    clearAllValidation,
    getValidationState,
    canSubmit,
    getValidationSummaryData,
    validationState: state.validationState
  };
}