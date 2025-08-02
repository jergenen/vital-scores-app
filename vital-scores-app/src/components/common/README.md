# Validation System Usage

This document explains how to use the input validation and error handling system implemented in the Vital Scores App.

## Overview

The validation system provides:
- Real-time validation feedback as users type
- Visual indicators for validation states (valid, invalid, warning)
- User-friendly error messages
- Physiological range validation for all vital signs

## Components

### ValidatedInput

A text input component with built-in validation feedback.

```tsx
import { ValidatedInput } from '../common';
import { useValidation } from '../../hooks';

function MyComponent() {
  const { validateInput, getFieldValidation } = useValidation();
  const [respiratoryRate, setRespiratoryRate] = useState('');

  return (
    <ValidatedInput
      label="Respiratory Rate (breaths/min)"
      value={respiratoryRate}
      onChangeText={setRespiratoryRate}
      onValidate={validateInput}
      fieldName="respiratoryRate"
      keyboardType="numeric"
      placeholder="Enter respiratory rate"
      validation={getFieldValidation('respiratoryRate')}
    />
  );
}
```

### ValidationMessage

A component for displaying validation messages with appropriate styling.

```tsx
import { ValidationMessage } from '../common';

function MyComponent() {
  const validation = { isValid: false, errorMessage: 'Value out of range' };
  
  return (
    <ValidationMessage 
      validation={validation} 
      fieldName="respiratoryRate"
    />
  );
}
```

## Hooks

### useValidation

A custom hook for handling input validation with real-time feedback.

```tsx
import { useValidation } from '../../hooks';

function MyComponent() {
  const {
    validateInput,
    getFieldValidation,
    getFieldValidationMessage,
    hasFieldError,
    hasFieldWarning,
    clearFieldValidation,
    getValidationState
  } = useValidation();

  // Validate input as user types
  const handleInputChange = (fieldName: string, value: string) => {
    const validation = validateInput(fieldName, value);
    console.log('Validation result:', validation);
  };

  // Check validation state
  const isValid = !hasFieldError('respiratoryRate');
  const hasWarning = hasFieldWarning('respiratoryRate');
  const message = getFieldValidationMessage('respiratoryRate');
  const state = getValidationState('respiratoryRate'); // 'valid' | 'invalid' | 'warning' | 'none'
}
```

## Validation Rules

### Physiological Ranges

- **Respiratory Rate**: 0-60 breaths/min
- **Heart Rate**: 0-300 bpm
- **Systolic Blood Pressure**: 50-300 mmHg
- **Temperature**: 25-45°C
- **Oxygen Saturation**: 70-100%
- **Consciousness Level**: A, C, V, P, U (case insensitive)

### Real-time Validation

The system provides different types of feedback:

1. **Valid**: Input is within acceptable range
2. **Invalid**: Input is outside acceptable range (shows error message)
3. **Warning**: Input is incomplete but potentially valid (e.g., "12." while typing)
4. **None**: No validation has been performed yet

### Error Messages

Error messages are user-friendly and specific:
- "Respiratory rate must be between 0 and 60 breaths/min"
- "Heart rate must be between 0 and 300 bpm"
- "Enter a complete number" (for partial input)

## Integration with VitalSignsContext

The validation system is integrated with the VitalSignsContext:

```tsx
import { useVitalSigns } from '../../contexts/VitalSignsContext';

function MyComponent() {
  const { updateVitalSign, state } = useVitalSigns();

  // When updating vital signs, validation is automatically performed
  const handleChange = (field: keyof VitalSigns, value: any) => {
    updateVitalSign(field, value); // This triggers automatic validation
  };

  // Access validation state
  const validationState = state.validationState;
}
```

## Visual Indicators

The ValidatedInput component provides visual feedback:

- **Border Colors**:
  - Blue: Focused input
  - Green: Valid input
  - Red: Invalid input
  - Yellow/Orange: Warning state
  - Gray: Disabled input

- **Message Colors**:
  - Red: Error messages
  - Yellow/Orange: Warning messages

## Best Practices

1. **Use ValidatedInput for all user inputs** that require validation
2. **Provide clear labels** that indicate the expected input format
3. **Use appropriate keyboard types** (numeric for numbers)
4. **Handle validation state** in your component logic
5. **Clear validation** when appropriate (e.g., on form reset)

## Testing

The validation system is thoroughly tested:
- Unit tests for all validation functions
- Integration tests for the validation hook
- Context tests for validation state management

Run tests with:
```bash
npm test
```