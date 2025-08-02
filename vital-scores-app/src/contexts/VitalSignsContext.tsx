import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { VitalSigns, CalculationResults } from '../types';
import { ValidationState, ValidationResult, validateWithPhysiologicalContext, validateConsciousnessLevel } from '../utils/validation';

// Action types for VitalSigns reducer
export type VitalSignsAction =
  | { type: 'UPDATE_VITAL_SIGN'; field: keyof VitalSigns; value: any }
  | { type: 'UPDATE_RESULTS'; results: CalculationResults }
  | { type: 'UPDATE_VALIDATION'; field: string; validation: ValidationResult }
  | { type: 'SET_VALIDATION_STATE'; validationState: ValidationState }
  | { type: 'CLEAR_VALIDATION'; field?: string }
  | { type: 'RESET_ALL' };

// State interface for VitalSigns context
export interface VitalSignsState {
  vitalSigns: VitalSigns;
  results: CalculationResults;
  validationState: ValidationState;
}

// Context interface
interface VitalSignsContextType {
  state: VitalSignsState;
  dispatch: React.Dispatch<VitalSignsAction>;
  updateVitalSign: (field: keyof VitalSigns, value: any) => void;
  updateResults: (results: CalculationResults) => void;
  updateValidation: (field: string, validation: ValidationResult) => void;
  setValidationState: (validationState: ValidationState) => void;
  clearValidation: (field?: string) => void;
  validateVitalSign: (field: keyof VitalSigns, value: any) => ValidationResult;
  resetAll: () => void;
}

// Initial state
const initialVitalSigns: VitalSigns = {
  respiratoryRate: undefined,
  oxygenSaturation: undefined,
  supplementalOxygen: false,
  temperature: undefined,
  systolicBP: undefined,
  heartRate: undefined,
  consciousnessLevel: undefined,
};

const initialResults: CalculationResults = {
  news2: {
    score: null,
    riskLevel: null,
    isComplete: false,
  },
  qsofa: {
    score: null,
    riskLevel: null,
    isComplete: false,
  },
};

const initialValidationState: ValidationState = {};

const initialState: VitalSignsState = {
  vitalSigns: initialVitalSigns,
  results: initialResults,
  validationState: initialValidationState,
};

// Reducer function
function vitalSignsReducer(state: VitalSignsState, action: VitalSignsAction): VitalSignsState {
  switch (action.type) {
    case 'UPDATE_VITAL_SIGN':
      return {
        ...state,
        vitalSigns: {
          ...state.vitalSigns,
          [action.field]: action.value,
        },
      };
    case 'UPDATE_RESULTS':
      return {
        ...state,
        results: action.results,
      };
    case 'UPDATE_VALIDATION':
      return {
        ...state,
        validationState: {
          ...state.validationState,
          [action.field]: action.validation,
        },
      };
    case 'SET_VALIDATION_STATE':
      return {
        ...state,
        validationState: action.validationState,
      };
    case 'CLEAR_VALIDATION':
      if (action.field) {
        const newValidationState = { ...state.validationState };
        delete newValidationState[action.field];
        return {
          ...state,
          validationState: newValidationState,
        };
      } else {
        return {
          ...state,
          validationState: {},
        };
      }
    case 'RESET_ALL':
      return initialState;
    default:
      return state;
  }
}

// Create context
const VitalSignsContext = createContext<VitalSignsContextType | undefined>(undefined);

// Provider component
interface VitalSignsProviderProps {
  children: ReactNode;
}

export function VitalSignsProvider({ children }: VitalSignsProviderProps) {
  const [state, dispatch] = useReducer(vitalSignsReducer, initialState);

  // Helper functions for common actions
  const updateVitalSign = (field: keyof VitalSigns, value: any) => {
    dispatch({ type: 'UPDATE_VITAL_SIGN', field, value });
    
    // Automatically validate the field when it's updated
    const validation = validateVitalSign(field, value);
    dispatch({ type: 'UPDATE_VALIDATION', field: field as string, validation });
  };

  const updateResults = (results: CalculationResults) => {
    dispatch({ type: 'UPDATE_RESULTS', results });
  };

  const updateValidation = (field: string, validation: ValidationResult) => {
    dispatch({ type: 'UPDATE_VALIDATION', field, validation });
  };

  const setValidationState = (validationState: ValidationState) => {
    dispatch({ type: 'SET_VALIDATION_STATE', validationState });
  };

  const clearValidation = (field?: string) => {
    dispatch({ type: 'CLEAR_VALIDATION', field });
  };

  const validateVitalSign = (field: keyof VitalSigns, value: any): ValidationResult => {
    // Handle consciousness level separately
    if (field === 'consciousnessLevel') {
      return validateConsciousnessLevel(value);
    }
    
    // Handle boolean fields (supplementalOxygen)
    if (typeof value === 'boolean') {
      return { isValid: true };
    }
    
    // Validate numeric fields with enhanced physiological context
    return validateWithPhysiologicalContext(field as string, value);
  };

  const resetAll = () => {
    dispatch({ type: 'RESET_ALL' });
  };

  const contextValue: VitalSignsContextType = {
    state,
    dispatch,
    updateVitalSign,
    updateResults,
    updateValidation,
    setValidationState,
    clearValidation,
    validateVitalSign,
    resetAll,
  };

  return (
    <VitalSignsContext.Provider value={contextValue}>
      {children}
    </VitalSignsContext.Provider>
  );
}

// Custom hook to use the context
export function useVitalSigns() {
  const context = useContext(VitalSignsContext);
  if (context === undefined) {
    throw new Error('useVitalSigns must be used within a VitalSignsProvider');
  }
  return context;
}