import { describe, it, expect } from 'vitest';
import {
    validateRespiratoryRate,
    validateHeartRate,
    validateSystolicBP,
    validateTemperature,
    validateOxygenSaturation,
    validateVitalSigns,
    validateQSOFAInputs,
    isQSOFAComplete,
    validateField,
    validateInputChange,
    validateConsciousnessLevel,
    getValidationMessage,
    hasValidationErrors,
    getValidationErrors,
    validateWithPhysiologicalContext,
    validateAllVitalSigns,
    getValidationSeverity,
    canSubmitWithValidation,
    getValidationSummary
} from '../validation';

describe('Validation utilities', () => {
    describe('validateRespiratoryRate', () => {
        it('should validate normal respiratory rates', () => {
            const validRates = [12, 16, 20, 24];
            validRates.forEach(rate => {
                const result = validateRespiratoryRate(rate);
                expect(result.isValid).toBe(true);
                expect(result.errorMessage).toBeUndefined();
            });
        });

        it('should validate boundary respiratory rates', () => {
            const result0 = validateRespiratoryRate(0);
            expect(result0.isValid).toBe(true);

            const result60 = validateRespiratoryRate(60);
            expect(result60.isValid).toBe(true);
        });

        it('should reject respiratory rates below 0', () => {
            const result = validateRespiratoryRate(-1);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Respiratory rate must be between 0 and 60 breaths/min');
        });

        it('should reject respiratory rates above 60', () => {
            const result = validateRespiratoryRate(61);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Respiratory rate must be between 0 and 60 breaths/min');
        });
    });

    describe('validateHeartRate', () => {
        it('should validate normal heart rates', () => {
            const validRates = [60, 70, 80, 100];
            validRates.forEach(rate => {
                const result = validateHeartRate(rate);
                expect(result.isValid).toBe(true);
                expect(result.errorMessage).toBeUndefined();
            });
        });

        it('should validate boundary heart rates', () => {
            const result0 = validateHeartRate(0);
            expect(result0.isValid).toBe(true);

            const result300 = validateHeartRate(300);
            expect(result300.isValid).toBe(true);
        });

        it('should reject heart rates below 0', () => {
            const result = validateHeartRate(-1);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Heart rate must be between 0 and 300 bpm');
        });

        it('should reject heart rates above 300', () => {
            const result = validateHeartRate(301);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Heart rate must be between 0 and 300 bpm');
        });
    });

    describe('validateSystolicBP', () => {
        it('should validate normal systolic blood pressures', () => {
            const validBPs = [90, 120, 140, 160];
            validBPs.forEach(bp => {
                const result = validateSystolicBP(bp);
                expect(result.isValid).toBe(true);
                expect(result.errorMessage).toBeUndefined();
            });
        });

        it('should validate boundary systolic blood pressures', () => {
            const result50 = validateSystolicBP(50);
            expect(result50.isValid).toBe(true);

            const result300 = validateSystolicBP(300);
            expect(result300.isValid).toBe(true);
        });

        it('should reject systolic BP below 50', () => {
            const result = validateSystolicBP(49);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Systolic blood pressure must be between 50 and 300 mmHg');
        });

        it('should reject systolic BP above 300', () => {
            const result = validateSystolicBP(301);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Systolic blood pressure must be between 50 and 300 mmHg');
        });
    });

    describe('validateTemperature', () => {
        it('should validate normal temperatures', () => {
            const validTemps = [36.0, 37.0, 38.0, 39.0];
            validTemps.forEach(temp => {
                const result = validateTemperature(temp);
                expect(result.isValid).toBe(true);
                expect(result.errorMessage).toBeUndefined();
            });
        });

        it('should validate boundary temperatures', () => {
            const result25 = validateTemperature(25);
            expect(result25.isValid).toBe(true);

            const result45 = validateTemperature(45);
            expect(result45.isValid).toBe(true);
        });

        it('should reject temperatures below 25°C', () => {
            const result = validateTemperature(24.9);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Temperature must be between 25 and 45°C');
        });

        it('should reject temperatures above 45°C', () => {
            const result = validateTemperature(45.1);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Temperature must be between 25 and 45°C');
        });
    });

    describe('validateOxygenSaturation', () => {
        it('should validate normal oxygen saturations', () => {
            const validSats = [95, 96, 97, 98, 99, 100];
            validSats.forEach(sat => {
                const result = validateOxygenSaturation(sat);
                expect(result.isValid).toBe(true);
                expect(result.errorMessage).toBeUndefined();
            });
        });

        it('should validate boundary oxygen saturations', () => {
            const result70 = validateOxygenSaturation(70);
            expect(result70.isValid).toBe(true);

            const result100 = validateOxygenSaturation(100);
            expect(result100.isValid).toBe(true);
        });

        it('should reject oxygen saturation below 70%', () => {
            const result = validateOxygenSaturation(69);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Oxygen saturation must be between 70 and 100%');
        });

        it('should reject oxygen saturation above 100%', () => {
            const result = validateOxygenSaturation(101);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Oxygen saturation must be between 70 and 100%');
        });
    });

    describe('validateVitalSigns', () => {
        it('should validate all provided vital signs', () => {
            const vitalSigns = {
                respiratoryRate: 16,
                heartRate: 70,
                systolicBP: 120,
                temperature: 37.0,
                oxygenSaturation: 98
            };

            const results = validateVitalSigns(vitalSigns);

            expect(results.respiratoryRate?.isValid).toBe(true);
            expect(results.heartRate?.isValid).toBe(true);
            expect(results.systolicBP?.isValid).toBe(true);
            expect(results.temperature?.isValid).toBe(true);
            expect(results.oxygenSaturation?.isValid).toBe(true);
        });

        it('should only validate provided vital signs', () => {
            const vitalSigns = {
                respiratoryRate: 16,
                temperature: 37.0
            };

            const results = validateVitalSigns(vitalSigns);

            expect(results.respiratoryRate?.isValid).toBe(true);
            expect(results.temperature?.isValid).toBe(true);
            expect(results.heartRate).toBeUndefined();
            expect(results.systolicBP).toBeUndefined();
            expect(results.oxygenSaturation).toBeUndefined();
        });

        it('should return validation errors for invalid values', () => {
            const vitalSigns = {
                respiratoryRate: -1,
                heartRate: 350,
                systolicBP: 30,
                temperature: 50,
                oxygenSaturation: 110
            };

            const results = validateVitalSigns(vitalSigns);

            expect(results.respiratoryRate?.isValid).toBe(false);
            expect(results.heartRate?.isValid).toBe(false);
            expect(results.systolicBP?.isValid).toBe(false);
            expect(results.temperature?.isValid).toBe(false);
            expect(results.oxygenSaturation?.isValid).toBe(false);

            expect(results.respiratoryRate?.errorMessage).toContain('Respiratory rate must be between 0 and 60');
            expect(results.heartRate?.errorMessage).toContain('Heart rate must be between 0 and 300');
            expect(results.systolicBP?.errorMessage).toContain('Systolic blood pressure must be between 50 and 300');
            expect(results.temperature?.errorMessage).toContain('Temperature must be between 25 and 45');
            expect(results.oxygenSaturation?.errorMessage).toContain('Oxygen saturation must be between 70 and 100');
        });

        it('should handle mixed valid and invalid values', () => {
            const vitalSigns = {
                respiratoryRate: 16, // valid
                heartRate: 350, // invalid
                systolicBP: 120, // valid
                temperature: 50, // invalid
                oxygenSaturation: 98 // valid
            };

            const results = validateVitalSigns(vitalSigns);

            expect(results.respiratoryRate?.isValid).toBe(true);
            expect(results.heartRate?.isValid).toBe(false);
            expect(results.systolicBP?.isValid).toBe(true);
            expect(results.temperature?.isValid).toBe(false);
            expect(results.oxygenSaturation?.isValid).toBe(true);
        });
    });

    describe('validateQSOFAInputs', () => {
        it('should validate all q-SOFA required inputs when valid', () => {
            const qsofaInputs = {
                respiratoryRate: 16,
                systolicBP: 120,
                consciousnessLevel: 'A'
            };

            const results = validateQSOFAInputs(qsofaInputs);

            expect(results.respiratoryRate?.isValid).toBe(true);
            expect(results.systolicBP?.isValid).toBe(true);
            expect(results.consciousnessLevel?.isValid).toBe(true);
        });

        it('should validate only provided q-SOFA inputs', () => {
            const qsofaInputs = {
                respiratoryRate: 16,
                consciousnessLevel: 'A'
            };

            const results = validateQSOFAInputs(qsofaInputs);

            expect(results.respiratoryRate?.isValid).toBe(true);
            expect(results.consciousnessLevel?.isValid).toBe(true);
            expect(results.systolicBP).toBeUndefined();
        });

        it('should return validation errors for invalid q-SOFA inputs', () => {
            const qsofaInputs = {
                respiratoryRate: -1,
                systolicBP: 30,
                consciousnessLevel: 'X' // Invalid consciousness level
            };

            const results = validateQSOFAInputs(qsofaInputs);

            expect(results.respiratoryRate?.isValid).toBe(false);
            expect(results.systolicBP?.isValid).toBe(false);
            expect(results.consciousnessLevel?.isValid).toBe(false);

            expect(results.respiratoryRate?.errorMessage).toContain('Respiratory rate must be between 0 and 60');
            expect(results.systolicBP?.errorMessage).toContain('Systolic blood pressure must be between 50 and 300');
            expect(results.consciousnessLevel?.errorMessage).toBe('Consciousness level must be one of: A, C, V, P, U');
        });

        it('should validate all consciousness levels correctly', () => {
            const validLevels = ['A', 'C', 'V', 'P', 'U'];

            validLevels.forEach(level => {
                const qsofaInputs = {
                    respiratoryRate: 16,
                    systolicBP: 120,
                    consciousnessLevel: level
                };

                const results = validateQSOFAInputs(qsofaInputs);
                expect(results.consciousnessLevel?.isValid).toBe(true);
            });
        });

        it('should reject invalid consciousness levels', () => {
            const invalidLevels = ['B', 'X', 'Z', '1', ''];

            invalidLevels.forEach(level => {
                const qsofaInputs = {
                    respiratoryRate: 16,
                    systolicBP: 120,
                    consciousnessLevel: level
                };

                const results = validateQSOFAInputs(qsofaInputs);
                expect(results.consciousnessLevel?.isValid).toBe(false);
                expect(results.consciousnessLevel?.errorMessage).toBe('Consciousness level must be one of: A, C, V, P, U');
            });
        });

        it('should handle mixed valid and invalid q-SOFA inputs', () => {
            const qsofaInputs = {
                respiratoryRate: 16, // valid
                systolicBP: 30, // invalid
                consciousnessLevel: 'A' // valid
            };

            const results = validateQSOFAInputs(qsofaInputs);

            expect(results.respiratoryRate?.isValid).toBe(true);
            expect(results.systolicBP?.isValid).toBe(false);
            expect(results.consciousnessLevel?.isValid).toBe(true);
        });
    });

    describe('isQSOFAComplete', () => {
        it('should return true when all q-SOFA fields are provided', () => {
            const qsofaInputs = {
                respiratoryRate: 16,
                systolicBP: 120,
                consciousnessLevel: 'A'
            };

            const result = isQSOFAComplete(qsofaInputs);
            expect(result).toBe(true);
        });

        it('should return false when respiratory rate is missing', () => {
            const qsofaInputs = {
                systolicBP: 120,
                consciousnessLevel: 'A'
            };

            const result = isQSOFAComplete(qsofaInputs);
            expect(result).toBe(false);
        });

        it('should return false when systolic BP is missing', () => {
            const qsofaInputs = {
                respiratoryRate: 16,
                consciousnessLevel: 'A'
            };

            const result = isQSOFAComplete(qsofaInputs);
            expect(result).toBe(false);
        });

        it('should return false when consciousness level is missing', () => {
            const qsofaInputs = {
                respiratoryRate: 16,
                systolicBP: 120
            };

            const result = isQSOFAComplete(qsofaInputs);
            expect(result).toBe(false);
        });

        it('should return false when all fields are missing', () => {
            const qsofaInputs = {};

            const result = isQSOFAComplete(qsofaInputs);
            expect(result).toBe(false);
        });

        it('should return false when fields are undefined', () => {
            const qsofaInputs = {
                respiratoryRate: undefined,
                systolicBP: undefined,
                consciousnessLevel: undefined
            };

            const result = isQSOFAComplete(qsofaInputs);
            expect(result).toBe(false);
        });

        it('should handle extra fields that are not required for q-SOFA', () => {
            const qsofaInputs = {
                respiratoryRate: 16,
                systolicBP: 120,
                consciousnessLevel: 'A',
                // Extra fields not required for q-SOFA
                heartRate: 70,
                temperature: 37.0,
                oxygenSaturation: 98
            };

            const result = isQSOFAComplete(qsofaInputs);
            expect(result).toBe(true);
        });
    });
});
describe(
    'validateField', () => {
        it('should handle empty values correctly', () => {
            const result = validateField('respiratoryRate', undefined);
            expect(result.isValid).toBe(true);
        });

        it('should handle required empty values', () => {
            const result = validateField('respiratoryRate', undefined, { required: true });
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('respiratoryRate is required');
        });

        it('should handle invalid number strings', () => {
            const result = validateField('respiratoryRate', 'abc');
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('respiratoryRate must be a valid number');
        });

        it('should validate numeric strings correctly', () => {
            const result = validateField('respiratoryRate', '16');
            expect(result.isValid).toBe(true);
        });

        it('should apply generic range validation', () => {
            const result = validateField('customField', 5, { min: 10, max: 20 });
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('customField must be at least 10');
        });

        it('should validate field-specific ranges', () => {
            const result = validateField('respiratoryRate', 70);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Respiratory rate must be between 0 and 60 breaths/min');
        });
    });

describe('validateInputChange', () => {
    it('should allow empty input during typing', () => {
        const result = validateInputChange('respiratoryRate', '');
        expect(result.isValid).toBe(true);
    });

    it('should handle partial numeric input', () => {
        const result = validateInputChange('respiratoryRate', '12.');
        expect(result.isValid).toBe(true);
        expect(result.warningMessage).toBe('Enter a complete number');
    });

    it('should handle negative sign during typing', () => {
        const result = validateInputChange('temperature', '-');
        expect(result.isValid).toBe(true);
        expect(result.warningMessage).toBe('Enter a complete number');
    });

    it('should validate complete input', () => {
        const result = validateInputChange('respiratoryRate', '16');
        expect(result.isValid).toBe(true);
    });

    it('should validate invalid complete input', () => {
        const result = validateInputChange('respiratoryRate', '70');
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toBe('Respiratory rate must be between 0 and 60 breaths/min');
    });

    it('should handle invalid characters in numeric fields', () => {
        const result = validateInputChange('respiratoryRate', 'abc');
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toBe('Please enter a valid number');
    });
});

describe('validateConsciousnessLevel', () => {
    it('should allow empty consciousness level', () => {
        const result = validateConsciousnessLevel(undefined);
        expect(result.isValid).toBe(true);
    });

    it('should allow empty string consciousness level', () => {
        const result = validateConsciousnessLevel('');
        expect(result.isValid).toBe(true);
    });

    it('should validate correct consciousness levels', () => {
        const validLevels = ['A', 'C', 'V', 'P', 'U'];
        validLevels.forEach(level => {
            const result = validateConsciousnessLevel(level);
            expect(result.isValid).toBe(true);
        });
    });

    it('should validate lowercase consciousness levels', () => {
        const validLevels = ['a', 'c', 'v', 'p', 'u'];
        validLevels.forEach(level => {
            const result = validateConsciousnessLevel(level);
            expect(result.isValid).toBe(true);
        });
    });

    it('should reject invalid consciousness levels', () => {
        const invalidLevels = ['B', 'X', 'Z', '1', 'invalid'];
        invalidLevels.forEach(level => {
            const result = validateConsciousnessLevel(level);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBe('Consciousness level must be A (Alert), C (Confusion), V (Voice), P (Pain), or U (Unresponsive)');
        });
    });
});

describe('getValidationMessage', () => {
    it('should return empty string for valid results', () => {
        const validation = { isValid: true };
        const message = getValidationMessage('test', validation);
        expect(message).toBe('');
    });

    it('should return warning message for valid results with warnings', () => {
        const validation = { isValid: true, warningMessage: 'Warning text' };
        const message = getValidationMessage('test', validation);
        expect(message).toBe('Warning text');
    });

    it('should return error message for invalid results', () => {
        const validation = { isValid: false, errorMessage: 'Error text' };
        const message = getValidationMessage('test', validation);
        expect(message).toBe('Error text');
    });

    it('should return default message for invalid results without error message', () => {
        const validation = { isValid: false };
        const message = getValidationMessage('testField', validation);
        expect(message).toBe('Invalid testField');
    });
});

describe('hasValidationErrors', () => {
    it('should return false for empty validation state', () => {
        const result = hasValidationErrors({});
        expect(result).toBe(false);
    });

    it('should return false when all validations are valid', () => {
        const validationState = {
            field1: { isValid: true },
            field2: { isValid: true }
        };
        const result = hasValidationErrors(validationState);
        expect(result).toBe(false);
    });

    it('should return true when any validation is invalid', () => {
        const validationState = {
            field1: { isValid: true },
            field2: { isValid: false, errorMessage: 'Error' }
        };
        const result = hasValidationErrors(validationState);
        expect(result).toBe(true);
    });
});

describe('getValidationErrors', () => {
    it('should return empty array for valid validation state', () => {
        const validationState = {
            field1: { isValid: true },
            field2: { isValid: true }
        };
        const errors = getValidationErrors(validationState);
        expect(errors).toEqual([]);
    });

    it('should return error messages for invalid validations', () => {
        const validationState = {
            field1: { isValid: true },
            field2: { isValid: false, errorMessage: 'Error 1' },
            field3: { isValid: false, errorMessage: 'Error 2' }
        };
        const errors = getValidationErrors(validationState);
        expect(errors).toEqual(['Error 1', 'Error 2']);
    });

    it('should ignore invalid validations without error messages', () => {
        const validationState = {
            field1: { isValid: false },
            field2: { isValid: false, errorMessage: 'Error 1' }
        };
        const errors = getValidationErrors(validationState);
        expect(errors).toEqual(['Error 1']);
    });
});

describe('Enhanced Validation Functions', () => {
    describe('validateWithPhysiologicalContext', () => {
        describe('respiratory rate validation', () => {
            it('should provide warnings for borderline values', () => {
                const lowResult = validateWithPhysiologicalContext('respiratoryRate', 6);
                expect(lowResult.isValid).toBe(true);
                expect(lowResult.warningMessage).toBe('Very low respiratory rate - please verify');

                const highResult = validateWithPhysiologicalContext('respiratoryRate', 35);
                expect(highResult.isValid).toBe(true);
                expect(highResult.warningMessage).toBe('High respiratory rate - please verify');
            });

            it('should reject negative values with specific message', () => {
                const result = validateWithPhysiologicalContext('respiratoryRate', -1);
                expect(result.isValid).toBe(false);
                expect(result.errorMessage).toBe('Respiratory rate cannot be negative');
            });

            it('should reject extremely high values', () => {
                const result = validateWithPhysiologicalContext('respiratoryRate', 65);
                expect(result.isValid).toBe(false);
                expect(result.errorMessage).toBe('Respiratory rate above 60 breaths/min is extremely high - please verify');
            });
        });

        describe('heart rate validation', () => {
            it('should provide warnings for borderline values', () => {
                const lowResult = validateWithPhysiologicalContext('heartRate', 25);
                expect(lowResult.isValid).toBe(true);
                expect(lowResult.warningMessage).toBe('Very low heart rate - please verify');

                const highResult = validateWithPhysiologicalContext('heartRate', 160);
                expect(highResult.isValid).toBe(true);
                expect(highResult.warningMessage).toBe('High heart rate - please verify');
            });

            it('should reject physiologically impossible values', () => {
                const result = validateWithPhysiologicalContext('heartRate', 350);
                expect(result.isValid).toBe(false);
                expect(result.errorMessage).toBe('Heart rate above 300 bpm is not physiologically possible');
            });
        });

        describe('blood pressure validation', () => {
            it('should provide warnings for borderline values', () => {
                const lowResult = validateWithPhysiologicalContext('systolicBP', 85);
                expect(lowResult.isValid).toBe(true);
                expect(lowResult.warningMessage).toBe('Low blood pressure - please verify');

                const highResult = validateWithPhysiologicalContext('systolicBP', 190);
                expect(highResult.isValid).toBe(true);
                expect(highResult.warningMessage).toBe('High blood pressure - please verify');
            });

            it('should reject critically low values', () => {
                const result = validateWithPhysiologicalContext('systolicBP', 40);
                expect(result.isValid).toBe(false);
                expect(result.errorMessage).toBe('Systolic blood pressure below 50 mmHg is critically low');
            });
        });

        describe('temperature validation', () => {
            it('should provide warnings for fever and hypothermia', () => {
                const hypothermiaResult = validateWithPhysiologicalContext('temperature', 34);
                expect(hypothermiaResult.isValid).toBe(true);
                expect(hypothermiaResult.warningMessage).toBe('Low body temperature (hypothermia) - please verify');

                const feverResult = validateWithPhysiologicalContext('temperature', 41);
                expect(feverResult.isValid).toBe(true);
                expect(feverResult.warningMessage).toBe('High fever - please verify');
            });

            it('should reject incompatible with life values', () => {
                const lowResult = validateWithPhysiologicalContext('temperature', 20);
                expect(lowResult.isValid).toBe(false);
                expect(lowResult.errorMessage).toBe('Temperature below 25°C is not compatible with life');

                const highResult = validateWithPhysiologicalContext('temperature', 50);
                expect(highResult.isValid).toBe(false);
                expect(highResult.errorMessage).toBe('Temperature above 45°C is not compatible with life');
            });
        });

        describe('oxygen saturation validation', () => {
            it('should provide warnings for low saturation', () => {
                const result = validateWithPhysiologicalContext('oxygenSaturation', 85);
                expect(result.isValid).toBe(true);
                expect(result.warningMessage).toBe('Low oxygen saturation - please verify');
            });

            it('should reject critically low values', () => {
                const result = validateWithPhysiologicalContext('oxygenSaturation', 65);
                expect(result.isValid).toBe(false);
                expect(result.errorMessage).toBe('Oxygen saturation below 70% is critically low');
            });

            it('should reject impossible values', () => {
                const result = validateWithPhysiologicalContext('oxygenSaturation', 105);
                expect(result.isValid).toBe(false);
                expect(result.errorMessage).toBe('Oxygen saturation cannot exceed 100%');
            });
        });
    });

    describe('validateAllVitalSigns', () => {
        it('should validate all provided vital signs with enhanced context', () => {
            const vitalSigns = {
                respiratoryRate: 16,
                heartRate: 70,
                systolicBP: 120,
                temperature: 37.0,
                oxygenSaturation: 98,
                consciousnessLevel: 'A',
                supplementalOxygen: false
            };

            const results = validateAllVitalSigns(vitalSigns);

            expect(results.respiratoryRate?.isValid).toBe(true);
            expect(results.heartRate?.isValid).toBe(true);
            expect(results.systolicBP?.isValid).toBe(true);
            expect(results.temperature?.isValid).toBe(true);
            expect(results.oxygenSaturation?.isValid).toBe(true);
            expect(results.consciousnessLevel?.isValid).toBe(true);
            expect(results.supplementalOxygen?.isValid).toBe(true);
        });

        it('should provide warnings for borderline values', () => {
            const vitalSigns = {
                respiratoryRate: 6, // Low
                heartRate: 160, // High
                systolicBP: 85, // Low
                temperature: 34, // Hypothermia
                oxygenSaturation: 88 // Low
            };

            const results = validateAllVitalSigns(vitalSigns);

            expect(results.respiratoryRate?.warningMessage).toBe('Very low respiratory rate - please verify');
            expect(results.heartRate?.warningMessage).toBe('High heart rate - please verify');
            expect(results.systolicBP?.warningMessage).toBe('Low blood pressure - please verify');
            expect(results.temperature?.warningMessage).toBe('Low body temperature (hypothermia) - please verify');
            expect(results.oxygenSaturation?.warningMessage).toBe('Low oxygen saturation - please verify');
        });
    });

    describe('getValidationSeverity', () => {
        it('should return correct severity levels', () => {
            expect(getValidationSeverity(undefined)).toBe('none');
            expect(getValidationSeverity({ isValid: true })).toBe('none');
            expect(getValidationSeverity({ isValid: true, warningMessage: 'Warning' })).toBe('warning');
            expect(getValidationSeverity({ isValid: false, errorMessage: 'Error' })).toBe('error');
        });
    });

    describe('canSubmitWithValidation', () => {
        it('should return true when no validation errors exist', () => {
            const validationState = {
                field1: { isValid: true },
                field2: { isValid: true, warningMessage: 'Warning' }
            };
            expect(canSubmitWithValidation(validationState)).toBe(true);
        });

        it('should return false when validation errors exist', () => {
            const validationState = {
                field1: { isValid: true },
                field2: { isValid: false, errorMessage: 'Error' }
            };
            expect(canSubmitWithValidation(validationState)).toBe(false);
        });
    });

    describe('getValidationSummary', () => {
        it('should provide correct summary of validation issues', () => {
            const validationState = {
                field1: { isValid: true },
                field2: { isValid: true, warningMessage: 'Warning 1' },
                field3: { isValid: false, errorMessage: 'Error 1' },
                field4: { isValid: false, errorMessage: 'Error 2' },
                field5: { isValid: true, warningMessage: 'Warning 2' }
            };

            const summary = getValidationSummary(validationState);

            expect(summary.errorCount).toBe(2);
            expect(summary.warningCount).toBe(2);
            expect(summary.errors).toEqual(['Error 1', 'Error 2']);
            expect(summary.warnings).toEqual(['Warning 1', 'Warning 2']);
        });

        it('should handle empty validation state', () => {
            const summary = getValidationSummary({});
            expect(summary.errorCount).toBe(0);
            expect(summary.warningCount).toBe(0);
            expect(summary.errors).toEqual([]);
            expect(summary.warnings).toEqual([]);
        });
    });
});