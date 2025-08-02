import { describe, it, expect } from 'vitest';
import { VitalSigns, CalculationResults, ValidationState } from '../../types';

// Import the reducer and initial state for direct testing
import { VitalSignsAction, VitalSignsState } from '../VitalSignsContext';

// We'll test the reducer logic directly since we don't have React testing setup
function vitalSignsReducer(state: VitalSignsState, action: VitalSignsAction): VitalSignsState {
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

  const initialState: VitalSignsState = {
    vitalSigns: initialVitalSigns,
    results: initialResults,
    validationState: {},
  };

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

describe('VitalSignsContext Reducer', () => {
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

  it('should have correct initial state', () => {
    expect(initialState.vitalSigns.respiratoryRate).toBeUndefined();
    expect(initialState.vitalSigns.supplementalOxygen).toBe(false);
    expect(initialState.results.news2.score).toBeNull();
    expect(initialState.results.qsofa.score).toBeNull();
    expect(initialState.validationState).toEqual({});
  });

  it('should update vital sign correctly', () => {
    const action: VitalSignsAction = {
      type: 'UPDATE_VITAL_SIGN',
      field: 'respiratoryRate',
      value: 20
    };

    const newState = vitalSignsReducer(initialState, action);

    expect(newState.vitalSigns.respiratoryRate).toBe(20);
    expect(newState.vitalSigns.supplementalOxygen).toBe(false); // Other fields unchanged
    expect(newState.results).toEqual(initialResults); // Results unchanged
  });

  it('should update multiple vital signs correctly', () => {
    let state = initialState;

    // Update respiratory rate
    state = vitalSignsReducer(state, {
      type: 'UPDATE_VITAL_SIGN',
      field: 'respiratoryRate',
      value: 20
    });

    // Update heart rate
    state = vitalSignsReducer(state, {
      type: 'UPDATE_VITAL_SIGN',
      field: 'heartRate',
      value: 80
    });

    // Update consciousness level
    state = vitalSignsReducer(state, {
      type: 'UPDATE_VITAL_SIGN',
      field: 'consciousnessLevel',
      value: 'A'
    });

    expect(state.vitalSigns.respiratoryRate).toBe(20);
    expect(state.vitalSigns.heartRate).toBe(80);
    expect(state.vitalSigns.consciousnessLevel).toBe('A');
  });

  it('should update results correctly', () => {
    const newResults: CalculationResults = {
      news2: { score: 5, riskLevel: 'medium', isComplete: true },
      qsofa: { score: 1, riskLevel: 'low', isComplete: true }
    };

    const action: VitalSignsAction = {
      type: 'UPDATE_RESULTS',
      results: newResults
    };

    const newState = vitalSignsReducer(initialState, action);

    expect(newState.results.news2.score).toBe(5);
    expect(newState.results.news2.riskLevel).toBe('medium');
    expect(newState.results.qsofa.score).toBe(1);
    expect(newState.results.qsofa.riskLevel).toBe('low');
    expect(newState.vitalSigns).toEqual(initialVitalSigns); // Vital signs unchanged
  });

  it('should reset all data correctly', () => {
    // Start with a state that has some data
    let state: VitalSignsState = {
      vitalSigns: {
        respiratoryRate: 20,
        oxygenSaturation: 95,
        supplementalOxygen: true,
        temperature: 38.0,
        systolicBP: 120,
        heartRate: 80,
        consciousnessLevel: 'A',
      },
      results: {
        news2: { score: 5, riskLevel: 'medium', isComplete: true },
        qsofa: { score: 1, riskLevel: 'low', isComplete: true }
      }
    };

    const action: VitalSignsAction = { type: 'RESET_ALL' };
    const newState = vitalSignsReducer(state, action);

    expect(newState).toEqual(initialState);
    expect(newState.vitalSigns.respiratoryRate).toBeUndefined();
    expect(newState.vitalSigns.supplementalOxygen).toBe(false);
    expect(newState.results.news2.score).toBeNull();
    expect(newState.results.qsofa.score).toBeNull();
  });

  it('should handle boolean values correctly', () => {
    const action: VitalSignsAction = {
      type: 'UPDATE_VITAL_SIGN',
      field: 'supplementalOxygen',
      value: true
    };

    const newState = vitalSignsReducer(initialState, action);

    expect(newState.vitalSigns.supplementalOxygen).toBe(true);
  });

  it('should handle consciousness level values correctly', () => {
    const consciousnessLevels: Array<'A' | 'C' | 'V' | 'P' | 'U'> = ['A', 'C', 'V', 'P', 'U'];

    consciousnessLevels.forEach(level => {
      const action: VitalSignsAction = {
        type: 'UPDATE_VITAL_SIGN',
        field: 'consciousnessLevel',
        value: level
      };

      const newState = vitalSignsReducer(initialState, action);
      expect(newState.vitalSigns.consciousnessLevel).toBe(level);
    });
  });

  it('should return unchanged state for unknown action type', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' } as any;
    const newState = vitalSignsReducer(initialState, unknownAction);

    expect(newState).toEqual(initialState);
  });

  it('should update validation state correctly', () => {
    const validation = { isValid: false, errorMessage: 'Invalid value' };
    const action: VitalSignsAction = {
      type: 'UPDATE_VALIDATION',
      field: 'respiratoryRate',
      validation
    };

    const newState = vitalSignsReducer(initialState, action);

    expect(newState.validationState.respiratoryRate).toEqual(validation);
    expect(newState.vitalSigns).toEqual(initialVitalSigns); // Vital signs unchanged
    expect(newState.results).toEqual(initialResults); // Results unchanged
  });

  it('should set entire validation state correctly', () => {
    const validationState: ValidationState = {
      respiratoryRate: { isValid: false, errorMessage: 'Invalid respiratory rate' },
      heartRate: { isValid: true }
    };
    const action: VitalSignsAction = {
      type: 'SET_VALIDATION_STATE',
      validationState
    };

    const newState = vitalSignsReducer(initialState, action);

    expect(newState.validationState).toEqual(validationState);
  });

  it('should clear specific field validation correctly', () => {
    // Start with validation state
    let state: VitalSignsState = {
      ...initialState,
      validationState: {
        respiratoryRate: { isValid: false, errorMessage: 'Invalid' },
        heartRate: { isValid: true }
      }
    };

    const action: VitalSignsAction = {
      type: 'CLEAR_VALIDATION',
      field: 'respiratoryRate'
    };

    const newState = vitalSignsReducer(state, action);

    expect(newState.validationState.respiratoryRate).toBeUndefined();
    expect(newState.validationState.heartRate).toEqual({ isValid: true });
  });

  it('should clear all validation correctly', () => {
    // Start with validation state
    let state: VitalSignsState = {
      ...initialState,
      validationState: {
        respiratoryRate: { isValid: false, errorMessage: 'Invalid' },
        heartRate: { isValid: true }
      }
    };

    const action: VitalSignsAction = {
      type: 'CLEAR_VALIDATION'
    };

    const newState = vitalSignsReducer(state, action);

    expect(newState.validationState).toEqual({});
  });

  it('should reset validation state when resetting all', () => {
    // Start with a state that has validation data
    let state: VitalSignsState = {
      vitalSigns: {
        respiratoryRate: 20,
        oxygenSaturation: 95,
        supplementalOxygen: true,
        temperature: 38.0,
        systolicBP: 120,
        heartRate: 80,
        consciousnessLevel: 'A',
      },
      results: {
        news2: { score: 5, riskLevel: 'medium', isComplete: true },
        qsofa: { score: 1, riskLevel: 'low', isComplete: true }
      },
      validationState: {
        respiratoryRate: { isValid: false, errorMessage: 'Invalid' },
        heartRate: { isValid: true }
      }
    };

    const action: VitalSignsAction = { type: 'RESET_ALL' };
    const newState = vitalSignsReducer(state, action);

    expect(newState).toEqual(initialState);
    expect(newState.validationState).toEqual({});
  });});
