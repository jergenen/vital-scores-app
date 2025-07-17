# Design Document - Vital Scores App

## Overview

The Vital Scores App is a cross-platform healthcare application designed for calculating NEWS2 (National Early Warning Score 2) and q-SOFA (quick Sequential Organ Failure Assessment) scores. The application prioritizes clinical workflow efficiency, accessibility, and ease of use across mobile and web platforms.

### Key Design Principles
- **Unified Interface**: Single screen with shared input fields for both scoring systems
- **Real-time Calculation**: Immediate score updates as data is entered
- **Clinical Workflow Integration**: Optimized for fast-paced healthcare environments
- **Cross-platform Consistency**: Identical functionality across all supported platforms

## Architecture

### Technology Stack Selection

**Framework**: React Native with Expo
- **Rationale**: Enables true cross-platform development (iOS, Android, Web) with a single codebase
- **Benefits**: Faster development, consistent UI/UX, shared business logic
- **Trade-offs**: Slightly larger bundle size compared to native apps, but acceptable for this use case

**State Management**: React Context + useReducer
- **Rationale**: Lightweight solution suitable for the app's moderate complexity
- **Benefits**: No external dependencies, built-in React patterns
- **Alternative considered**: Redux was deemed overkill for this application's scope

**Styling**: React Native StyleSheet with theme system
- **Rationale**: Native styling approach with built-in theme switching capability
- **Benefits**: Performance optimization, easy dark/light mode implementation

**Internationalization**: react-i18next
- **Rationale**: Industry standard for React-based i18n with strong TypeScript support
- **Benefits**: Lazy loading, namespace organization, pluralization support

### Platform-Specific Considerations

**Mobile (iOS/Android)**
- Native navigation using React Navigation
- Platform-specific UI adaptations (iOS vs Material Design elements)
- Touch-optimized input controls

**Web**
- Responsive design with mobile-first approach
- Keyboard navigation support
- Progressive Web App (PWA) capabilities for offline access

**iPad**
- Optimized layout for larger screen real estate
- Enhanced typography and spacing
- Support for landscape orientation

## Components and Interfaces

### Core Components Architecture

```
App
├── ThemeProvider
├── I18nProvider
├── NavigationContainer
└── MainCalculator
    ├── ScoreDisplaySection
    │   ├── NEWS2ScoreBar
    │   └── QSOFAScoreBar
    ├── InputFieldsSection
    │   ├── VitalSignsInputs
    │   ├── ConsciousnessInput
    │   └── SupplementalOxygenInput
    ├── ActionButtonsSection
    │   ├── ResetButton
    │   └── ExportButton
    ├── NavigationSection
    │   ├── EducationalContentButton
    │   └── SettingsButton
    ├── ExportModal
    │   ├── PatientNameInput
    │   ├── FormatSelector
    │   ├── ConfidentialityWarning
    │   └── ExportActions
    └── ConfirmationModal
        └── ResetConfirmation
```

### Input Field Design

**Unified Input Strategy**
- Each input field serves both NEWS2 and q-SOFA calculations where applicable
- Color-coded indicators show which scoring system uses each field
- Real-time validation with immediate feedback
- No dropdown menus - only number inputs, toggle switches, and button groups for fast data entry

**Input Types**
- **Numeric Inputs**: Respiratory rate, heart rate, systolic BP, temperature, oxygen saturation
- **Toggle Switches**: Supplemental oxygen (binary yes/no)
- **Button Groups**: Consciousness level (ACVPU scale for NEWS2, altered consciousness for q-SOFA)

**Field Indicators**
- Small colored text labels showing "NEWS2", "q-SOFA", or both when field applies to multiple systems
- Consistent color scheme: NEWS2 (blue), q-SOFA (green), Both (purple)
- Dynamic score display next to applicable labels showing calculated values in real-time
- Touch-optimized sizing for mobile devices with adequate spacing

**Shared Field Mapping**
- Respiratory Rate: Used by both NEWS2 and q-SOFA
- Systolic Blood Pressure: Used by both NEWS2 and q-SOFA  
- Consciousness Level: Used by both (ACVPU for NEWS2, altered/normal for q-SOFA)
- Heart Rate: NEWS2 only
- Temperature: NEWS2 only
- Oxygen Saturation: NEWS2 only
- Supplemental Oxygen: NEWS2 only

### Score Display Design

**Progress Bar Implementation**
- Horizontal bars positioned above input fields
- NEWS2: 4-color gradient (neutral → yellow → orange → dark orange)
- q-SOFA: Green to red gradient (0-3 scale)
- Insufficient data state: Grey with diagonal lines pattern

**Score Text Display**
- Large, prominent score numbers
- Risk level indicators ("Low Risk", "Medium Risk", "High Risk")
- "Not enough data" messaging for incomplete inputs

## Data Models

### Core Data Structures

```typescript
interface VitalSigns {
  respiratoryRate?: number;
  oxygenSaturation?: number;
  supplementalOxygen: boolean;
  temperature?: number;
  systolicBP?: number;
  heartRate?: number;
  consciousnessLevel?: ConsciousnessLevel;
}

interface CalculationResults {
  news2: {
    score: number | null;
    riskLevel: 'low' | 'medium' | 'high' | null;
    isComplete: boolean;
  };
  qsofa: {
    score: number | null;
    riskLevel: 'low' | 'high' | null;
    isComplete: boolean;
  };
}

interface AppSettings {
  language: string;
  themeMode: 'auto' | 'light' | 'dark';
  version: string;
}

interface ExportData {
  timestamp: Date;
  patientIdentifier?: string;
  vitalSigns: VitalSigns;
  results: CalculationResults;
}
```

### Validation Rules

**Physiological Ranges**
- Respiratory Rate: 0-60 breaths/min
- Heart Rate: 0-300 bpm
- Systolic BP: 50-300 mmHg
- Temperature: 25-45°C
- Oxygen Saturation: 70-100%

**Business Rules**
- NEWS2 requires: RR, O2 sat, supplemental O2, temp, systolic BP, HR, consciousness
- q-SOFA requires: RR, systolic BP, consciousness level
- Minimum data validation before score calculation

## Error Handling

### Input Validation Strategy

**Real-time Validation**
- Immediate feedback on out-of-range values
- Visual indicators (red borders, warning icons)
- Non-blocking validation (allows continued input)

**Error States**
- Invalid input highlighting
- Clear error messages in user's language
- Graceful degradation when partial data available

### Application Error Handling

**Network Errors**
- Offline-first design (no network dependency for core functionality)
- Local storage for settings and temporary data

**Platform-Specific Errors**
- File system access errors during export
- Permission handling for file sharing
- Graceful fallbacks for unsupported features

## Testing Strategy

### Unit Testing
- **Calculation Logic**: Comprehensive tests for NEWS2 and q-SOFA algorithms
- **Validation Functions**: Edge cases and boundary value testing
- **Utility Functions**: I18n, theme switching, data formatting

### Integration Testing
- **Component Integration**: Input field to calculation pipeline
- **State Management**: Context updates and side effects
- **Export Functionality**: File generation and sharing workflows

### Platform Testing
- **Cross-platform Consistency**: UI/UX parity across iOS, Android, Web
- **Responsive Design**: Various screen sizes and orientations
- **Accessibility**: Screen reader compatibility, keyboard navigation

### User Acceptance Testing
- **Clinical Workflow**: Healthcare professional feedback on usability
- **Performance**: Load times and responsiveness benchmarks
- **Internationalization**: Translation accuracy and cultural appropriateness

## Implementation Phases

### Phase 1: Core Functionality
- Basic calculation engine for NEWS2 and q-SOFA
- Unified input interface
- Real-time score display
- Basic validation

### Phase 2: Platform Optimization
- Cross-platform deployment setup
- Theme system implementation
- Internationalization framework
- Settings management

### Phase 3: Enhanced Features
- Export functionality with multiple formats
- Educational content integration
- Advanced validation and error handling
- Performance optimization

### Phase 4: Polish and Distribution
- Comprehensive testing across platforms
- App store preparation and submission
- Documentation and user guides
- Analytics and monitoring setup

## Security and Privacy Considerations

### Data Handling
- No persistent storage of patient data
- Session-only data retention
- Clear data on app termination
- Export warnings about confidentiality

### Platform Security
- Standard platform security practices
- No network data transmission
- Local-only processing and storage
- Secure file sharing mechanisms

## Export Functionality Design

### Export Modal Interface
**Modal Trigger**: Export button positioned at the bottom of the main calculation screen
**Modal Components**:
- Patient name/title input field for file identification
- Format selection (Image, PDF, Text file)
- Prominent confidentiality warning with acknowledgment checkbox
- Export and Cancel action buttons

### Export Format Specifications
**Image Export**: PNG format with high resolution for clinical documentation
**PDF Export**: Structured document with header, patient identifier, vital signs table, and calculated scores
**Text Export**: Plain text format for easy integration with existing systems

**File Naming Convention**:
- With patient name: `[PatientName]_VitalScores_[Timestamp].[ext]`
- Without patient name: `VitalScores_[Timestamp].[ext]`

### Platform-Specific Export Handling
**Mobile (iOS/Android)**: Native sharing sheet integration for saving to files or sharing with other apps
**Web**: Browser download functionality with file save dialog
**iPad**: Enhanced sharing options including AirDrop and document apps

## Data Persistence and Session Management

### Session Data Strategy
**In-Memory Storage**: All input data maintained in React state during active session
**No Persistent Storage**: Patient data never saved to device storage for privacy compliance
**Navigation Preservation**: Data maintained when navigating between screens within the app

### Reset Functionality Design
**Reset Button Placement**: Accessible from main calculation screen alongside export button
**Confirmation Flow**: 
1. User taps reset button
2. Modal displays "Are you sure?" confirmation
3. User confirms or cancels action
4. On confirmation: all input fields cleared, scores reset to initial state

**Reset Scope**: Complete clearing of all vital signs inputs and calculated scores

## Educational Content Integration

### Content Structure
**NEWS2 Education**: Detailed scoring criteria, normal ranges, clinical significance, risk level explanations
**q-SOFA Education**: Three criteria explanations, sepsis risk indicators, clinical context

### Access Pattern
**Navigation**: Dedicated button in navigation section of main screen
**Content Display**: Full-screen educational view with easy return to calculations
**Offline Access**: All educational content bundled with app for offline availability

## Settings and Configuration Design

### Settings Screen Components
**Language Selection**: Manual override for automatic language detection
- Dropdown/picker with supported languages
- Immediate application of language changes

**Theme Control**: Manual override for automatic dark/light mode
- Toggle options: Auto, Light, Dark
- Immediate theme application

**App Information**: Version number, purpose description, developer information

### Settings Persistence
**Local Storage**: Settings saved to device using AsyncStorage (mobile) or localStorage (web)
**Cross-Session**: Settings maintained between app launches
**Default Behavior**: Automatic language and theme detection on first launch

## Source Control and Development Workflow

### Repository Structure
**GitHub Integration**: Project hosted on GitHub with comprehensive version control
**Branch Strategy**: Main branch for stable releases, feature branches for development
**Commit Standards**: Clear, descriptive commit messages following conventional commit format

### Development Environment Setup
**README Documentation**: Comprehensive setup instructions for developers
**Environment Configuration**: Clear instructions for React Native/Expo setup
**Dependency Management**: Package.json with locked versions for consistency

### Code Quality Standards
**.gitignore Configuration**: Appropriate exclusions for React Native/Expo projects
- node_modules, build artifacts, platform-specific files
- Environment files and sensitive configuration
- IDE-specific files and temporary files

**Documentation Standards**: Inline code comments, API documentation, setup guides

## Performance Considerations

### Optimization Strategies
- Lazy loading of educational content
- Efficient re-rendering with React.memo
- Optimized bundle splitting for web deployment
- Native performance for calculation-heavy operations

### Memory Management
- Minimal state footprint
- Efficient cleanup of temporary data
- Optimized image and asset loading
- Platform-specific memory considerations

### Real-time Calculation Performance
- Debounced input handling to prevent excessive calculations
- Memoized calculation functions to avoid redundant processing
- Efficient state updates to minimize re-renders