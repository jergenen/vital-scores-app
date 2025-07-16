# Design Document - Helsekalkulator

## Overview

Helsekalkulator is a cross-platform healthcare application designed for calculating NEWS2 and q-SOFA clinical scores. The application prioritizes simplicity, accessibility, and clinical workflow integration while supporting multiple platforms (Android, iOS, iPad, web) and languages.

### Key Design Principles
- **Cross-platform consistency**: Unified user experience across all platforms
- **Clinical workflow optimization**: Fast, accurate calculations with minimal input friction
- **Accessibility**: Support for various lighting conditions and device capabilities
- **Internationalization**: Multi-language support with medical terminology accuracy
- **Data privacy**: No persistent storage of patient data, export with privacy warnings

## Architecture

### Technology Stack
- **Framework**: React Native with Expo for cross-platform development
- **Web Support**: Expo Web for responsive web application
- **State Management**: React Context API for simple state management
- **Styling**: React Native StyleSheet with theme support
- **Internationalization**: react-i18next for multi-language support
- **Export Functionality**: expo-sharing and expo-print for file generation and sharing

### Platform Deployment Strategy
- **Mobile Apps**: Expo Application Services (EAS) for building and deploying to app stores
- **Web App**: Static site deployment (Netlify/Vercel) with responsive design
- **Development**: Expo CLI for unified development experience

## Components and Interfaces

### Core Components

#### 1. MainCalculator Component
- **Purpose**: Primary interface displaying unified input fields and both score results
- **Props**: None (uses global state)
- **State**: Current vital signs and calculation results
- **Features**:
  - Real-time calculation updates
  - Unified input fields serving both NEWS2 and q-SOFA
  - Visual indicators showing which fields apply to which score
  - Responsive layout adaptation

#### 2. InputField Component
- **Purpose**: Reusable input component for vital signs
- **Props**: 
  - `label`: Field label
  - `value`: Current value
  - `onChange`: Value change handler
  - `type`: Input type (number, toggle, radio)
  - `indicators`: Array showing which scores use this field
- **Features**:
  - Large touch targets for mobile use
  - Clear validation feedback
  - Accessibility support

#### 3. ScoreDisplay Component
- **Purpose**: Shows calculated scores with risk indicators
- **Props**:
  - `scoreType`: 'NEWS2' or 'qSOFA'
  - `score`: Calculated score value
  - `riskLevel`: Risk assessment result
- **Features**:
  - Prominent score display
  - Color-coded risk indicators
  - Theme-aware styling

#### 4. ExportPanel Component
- **Purpose**: Handles result export functionality
- **Props**: Current calculation data
- **Features**:
  - Multiple export formats (image, PDF, text)
  - Privacy warning modal
  - Integration with device sharing

#### 5. SettingsScreen Component
- **Purpose**: App configuration and information
- **Features**:
  - Language selection
  - Theme override options
  - App information display
  - Immediate setting application

#### 6. ExplanationScreen Component
- **Purpose**: Detailed scoring criteria and explanations
- **Features**:
  - Tabbed interface for NEWS2 and q-SOFA
  - Medically accurate content
  - Easy navigation back to calculator

### Navigation Structure
```
MainCalculator (Tab 1)
├── ExportPanel (Modal)
└── PrivacyWarning (Modal)

Explanations (Tab 2)
├── NEWS2 Explanation
└── q-SOFA Explanation

Settings (Tab 3)
├── Language Selection
├── Theme Settings
└── App Information
```

## Data Models

### VitalSigns Interface
```typescript
interface VitalSigns {
  // Shared fields
  respiratoryRate: number | null;
  oxygenSaturation: number | null;
  systolicBP: number | null;
  heartRate: number | null;
  consciousness: 'alert' | 'voice' | 'pain' | 'unresponsive' | null;
  
  // NEWS2 specific
  temperature: number | null;
  supplementalOxygen: boolean;
  
  // q-SOFA specific (derived from shared fields)
  // alteredMentation: boolean (derived from consciousness)
  // hypotension: boolean (derived from systolicBP < 100)
  // tachypnea: boolean (derived from respiratoryRate >= 22)
}
```

### CalculationResult Interface
```typescript
interface CalculationResult {
  news2: {
    score: number;
    riskLevel: 'low' | 'medium' | 'high';
    breakdown: {
      respiratoryRate: number;
      oxygenSaturation: number;
      supplementalOxygen: number;
      temperature: number;
      systolicBP: number;
      heartRate: number;
      consciousness: number;
    };
  };
  qsofa: {
    score: number;
    riskLevel: 'low' | 'high';
    criteria: {
      alteredMentation: boolean;
      hypotension: boolean;
      tachypnea: boolean;
    };
  };
}
```

### Theme Configuration
```typescript
interface Theme {
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    small: TextStyle;
    body: TextStyle;
    heading: TextStyle;
    title: TextStyle;
  };
}
```

## Error Handling

### Input Validation
- **Real-time validation**: Immediate feedback for invalid inputs
- **Range checking**: Ensure vital signs are within physiologically reasonable ranges
- **Required field indicators**: Clear marking of incomplete calculations
- **Error messages**: Localized, user-friendly error descriptions

### Calculation Safety
- **Null handling**: Graceful handling of incomplete data sets
- **Score validation**: Verification of calculation logic against clinical standards
- **Edge case handling**: Proper behavior for extreme or unusual values

### Platform-Specific Error Handling
- **Network connectivity**: Graceful degradation when offline
- **Platform permissions**: Proper handling of export/sharing permissions
- **Storage limitations**: Error handling for export file creation failures

## Testing Strategy

### Unit Testing
- **Calculation Logic**: Comprehensive tests for NEWS2 and q-SOFA algorithms
- **Input Validation**: Tests for all validation scenarios
- **Theme Switching**: Tests for proper theme application
- **Internationalization**: Tests for translation accuracy and completeness

### Integration Testing
- **Cross-platform Consistency**: Automated tests ensuring identical behavior across platforms
- **Export Functionality**: Tests for all export formats and sharing mechanisms
- **Settings Persistence**: Tests for proper setting storage and retrieval

### User Acceptance Testing
- **Clinical Workflow**: Testing with healthcare professionals for usability
- **Accessibility**: Testing with screen readers and accessibility tools
- **Performance**: Testing calculation speed and app responsiveness

### Platform-Specific Testing
- **iOS Testing**: Device-specific testing on various iPhone and iPad models
- **Android Testing**: Testing across different Android versions and screen sizes
- **Web Testing**: Cross-browser compatibility testing
- **Responsive Design**: Testing layout adaptation across screen sizes

## Implementation Considerations

### Performance Optimization
- **Real-time Calculations**: Debounced input handling to prevent excessive calculations
- **Memory Management**: Efficient state management without persistent data storage
- **Bundle Size**: Code splitting and lazy loading for web deployment

### Accessibility Features
- **Screen Reader Support**: Proper ARIA labels and semantic markup
- **High Contrast**: Theme support for accessibility requirements
- **Touch Targets**: Minimum 44px touch targets for mobile accessibility
- **Keyboard Navigation**: Full keyboard support for web version

### Security and Privacy
- **No Data Persistence**: Calculations cleared on app close/refresh
- **Export Warnings**: Clear privacy warnings before data export
- **Secure Sharing**: Use of platform-native sharing mechanisms
- **No Analytics**: No tracking or data collection to ensure privacy

### Internationalization Architecture
- **Translation Keys**: Structured key naming for medical terminology
- **RTL Support**: Layout support for right-to-left languages (future consideration)
- **Number Formatting**: Locale-appropriate number formatting
- **Medical Accuracy**: Clinical review process for translated content