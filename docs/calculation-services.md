# Calculation Services Documentation

## Overview

The Vital Scores App includes robust calculation engines for both NEWS2 and q-SOFA scoring systems. These services are implemented as pure TypeScript functions with comprehensive validation and error handling.

## q-SOFA Calculator

### Implementation

The q-SOFA (quick Sequential Organ Failure Assessment) calculator is implemented in `src/services/qsofaCalculator.ts` and provides a bedside scoring system to identify patients at risk of sepsis-related complications.

### Scoring Criteria

The q-SOFA score is calculated based on three criteria:

1. **Respiratory Rate**: ≥22 breaths/min = 1 point, <22 breaths/min = 0 points
2. **Systolic Blood Pressure**: ≤100 mmHg = 1 point, >100 mmHg = 0 points  
3. **Consciousness Level**: Any altered consciousness (C, V, P, U) = 1 point, Alert (A) = 0 points

### Risk Assessment

- **Score ≥2**: High risk of sepsis-related complications
- **Score <2**: Low risk

### API Reference

#### `calculateQSOFA(vitalSigns: VitalSigns): QSOFAScore`

Calculates the q-SOFA score based on provided vital signs.

**Parameters:**
- `vitalSigns`: Object containing vital signs data

**Returns:**
- `QSOFAScore` object with the following properties:
  - `score`: Total q-SOFA score (0-3) or null if incomplete
  - `riskLevel`: 'low' | 'high' | null
  - `isComplete`: Boolean indicating if all required fields are present
  - `breakdown`: Individual component scores or null if incomplete

**Example Usage:**

```typescript
import { calculateQSOFA } from '../services/qsofaCalculator';

const vitalSigns = {
  respiratoryRate: 24,
  systolicBP: 95,
  consciousnessLevel: 'V'
};

const result = calculateQSOFA(vitalSigns);
// Result: { score: 3, riskLevel: 'high', isComplete: true, breakdown: { respiratoryRate: 1, systolicBP: 1, consciousnessLevel: 1 } }
```

### Required Fields

The q-SOFA calculator requires the following fields to be present:
- `respiratoryRate` (number)
- `systolicBP` (number)
- `consciousnessLevel` (ConsciousnessLevel: 'A' | 'C' | 'V' | 'P' | 'U')

If any required field is missing, the calculator returns:
```typescript
{
  score: null,
  riskLevel: null,
  isComplete: false,
  breakdown: null
}
```

## Input Validation

### Validation Services

The app includes comprehensive input validation in `src/utils/validation.ts`:

#### q-SOFA Specific Validation

- **`validateQSOFAInputs()`**: Validates all q-SOFA required inputs
- **`isQSOFAComplete()`**: Checks if all required q-SOFA fields are present

#### General Validation Functions

- **`validateRespiratoryRate()`**: 0-60 breaths/min
- **`validateSystolicBP()`**: 50-300 mmHg
- **Consciousness level validation**: Must be one of A, C, V, P, U

### Physiological Ranges

All validation functions enforce clinically appropriate ranges:

| Parameter | Range | Unit |
|-----------|-------|------|
| Respiratory Rate | 0-60 | breaths/min |
| Systolic Blood Pressure | 50-300 | mmHg |
| Heart Rate | 0-300 | bpm |
| Temperature | 25-45 | °C |
| Oxygen Saturation | 70-100 | % |

## Error Handling

### Validation Results

All validation functions return a `ValidationResult` object:

```typescript
interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}
```

### Incomplete Data Handling

When required data is missing:
- Calculation functions return null values for scores and risk levels
- `isComplete` flag is set to false
- UI displays "Not enough data" state

## Testing

### Unit Tests

Comprehensive unit tests are provided in `src/utils/__tests__/validation.test.ts`:

- **Boundary value testing**: Tests edge cases and limits
- **Invalid input handling**: Tests error conditions and messages
- **Completeness checking**: Tests data completeness validation
- **Mixed scenarios**: Tests combinations of valid and invalid inputs

### Test Coverage

The test suite covers:
- All individual validation functions
- q-SOFA specific validation logic
- Data completeness checking
- Error message accuracy
- Edge cases and boundary conditions

## Integration with UI

### Real-time Calculation

The calculation services integrate with the React Context system to provide:
- Immediate score updates as data is entered
- Real-time validation feedback
- Dynamic UI state based on data completeness

### Shared Input Fields

The unified interface design allows:
- Single input fields serving both NEWS2 and q-SOFA
- Color-coded indicators showing which systems use each field
- Simultaneous calculation of both scores

## Performance Considerations

### Optimization Features

- **Pure functions**: All calculation functions are pure with no side effects
- **Memoization ready**: Functions can be easily memoized for performance
- **Minimal dependencies**: No external calculation libraries required
- **TypeScript optimization**: Full type safety with compile-time checking

### Memory Efficiency

- Lightweight calculation algorithms
- No persistent state in calculation services
- Efficient validation with early returns
- Minimal object creation during calculations