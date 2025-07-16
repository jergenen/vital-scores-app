# Requirements Document

## Introduction

Helsekalkulator is a cross-platform mobile and web application designed specifically for healthcare professionals to quickly and accurately calculate NEWS2 (National Early Warning Score 2) and q-SOFA (quick Sequential Organ Failure Assessment) scores. The app prioritizes ease of use, accessibility, and clinical workflow integration while supporting multiple platforms and languages.

## Requirements

### Requirement 1

**User Story:** As a healthcare professional, I want to access the Helsekalkulator app on any device (Android, iOS, iPad, web), so that I can calculate clinical scores regardless of my available technology.

#### Acceptance Criteria

1. WHEN the app is developed THEN the system SHALL be deployable as a native Android app on Google Play Store
2. WHEN the app is developed THEN the system SHALL be deployable as a native iOS app on Apple App Store
3. WHEN the app is developed THEN the system SHALL be optimized for iPad with appropriate layout scaling
4. WHEN the app is developed THEN the system SHALL be accessible as a responsive web application
5. WHEN the app runs on any platform THEN the system SHALL maintain consistent functionality and user experience

### Requirement 2

**User Story:** As a healthcare professional, I want to calculate NEWS2 scores quickly, so that I can assess patient deterioration risk efficiently.

#### Acceptance Criteria

1. WHEN I open the app THEN the system SHALL display NEWS2 calculation fields on the main screen
2. WHEN I input patient vital signs THEN the system SHALL automatically calculate the NEWS2 score in real-time
3. WHEN the NEWS2 score is calculated THEN the system SHALL display the total score prominently
4. WHEN the NEWS2 score is calculated THEN the system SHALL indicate the clinical risk level (low, medium, high)
5. WHEN I need to understand NEWS2 scoring THEN the system SHALL provide access to detailed scoring explanations
6. WHEN vital signs are entered THEN the system SHALL validate inputs are within physiologically reasonable ranges

### Requirement 3

**User Story:** As a healthcare professional, I want to calculate q-SOFA scores quickly, so that I can identify patients at risk of sepsis-related complications.

#### Acceptance Criteria

1. WHEN I access q-SOFA calculation THEN the system SHALL display the three q-SOFA criteria on the main screen
2. WHEN I input q-SOFA parameters THEN the system SHALL automatically calculate the total score
3. WHEN the q-SOFA score is calculated THEN the system SHALL display the result clearly
4. WHEN the q-SOFA score is ≥2 THEN the system SHALL highlight the increased sepsis risk
5. WHEN I need to understand q-SOFA criteria THEN the system SHALL provide access to detailed explanations

### Requirement 4

**User Story:** As a Norwegian healthcare professional, I want the app interface in Norwegian, so that I can use it efficiently in my native language.

#### Acceptance Criteria

1. WHEN the app launches THEN it SHALL display all interface elements in Norwegian by default
2. WHEN the app detects the device language THEN it SHALL automatically switch to that language if supported
3. WHEN the app is translated THEN it SHALL maintain medical terminology accuracy across languages
4. WHEN new languages are added THEN the system SHALL support easy translation file management
5. WHEN language switching occurs THEN it SHALL not affect calculated scores or functionality

### Requirement 5

**User Story:** As a healthcare professional working in various lighting conditions, I want automatic dark mode support, so that the app is comfortable to use in different environments.

#### Acceptance Criteria

1. WHEN the device is set to dark mode THEN the app SHALL automatically switch to dark theme
2. WHEN the device is set to light mode THEN the app SHALL automatically switch to light theme
3. WHEN in dark mode THEN all text SHALL remain clearly readable with appropriate contrast
4. WHEN in dark mode THEN clinical risk indicators SHALL remain visually distinct
5. WHEN theme switching occurs THEN it SHALL happen seamlessly without data loss

### Requirement 6

**User Story:** As a healthcare professional in a fast-paced environment, I want simple input methods without dropdowns, so that I can enter data quickly and accurately.

#### Acceptance Criteria

1. WHEN I need to input vital signs THEN the system SHALL use number input fields or simple button selections
2. WHEN I need to select binary options THEN the system SHALL use toggle switches or radio buttons
3. WHEN I interact with input fields THEN they SHALL be large enough for easy touch interaction
4. WHEN I make input errors THEN the system SHALL provide clear validation feedback
5. WHEN input fields are displayed THEN they SHALL be logically grouped and clearly labeled

### Requirement 7

**User Story:** As a healthcare professional, I want to calculate both NEWS2 and q-SOFA scores simultaneously using shared input fields, so that I can efficiently assess multiple clinical indicators at once.

#### Acceptance Criteria

1. WHEN I open the app THEN it SHALL display a unified set of input fields that serve both NEWS2 and q-SOFA calculations
2. WHEN I view input fields THEN each field SHALL display an indicator showing whether it's used for NEWS2, q-SOFA, or both
3. WHEN I enter patient data THEN both NEWS2 and q-SOFA scores SHALL be calculated and displayed simultaneously
4. WHEN I perform calculations THEN all input fields and both score results SHALL be visible on the main screen
5. WHEN the screen space is limited THEN the layout SHALL adapt while maintaining all essential information visibility

### Requirement 8

**User Story:** As a healthcare professional learning or verifying scoring methods, I want access to detailed explanations, so that I can understand and validate the calculations.

#### Acceptance Criteria

1. WHEN I need scoring explanations THEN the system SHALL provide detailed NEWS2 scoring criteria
2. WHEN I need scoring explanations THEN the system SHALL provide detailed q-SOFA criteria explanations
3. WHEN I access explanations THEN they SHALL include normal ranges and clinical significance
4. WHEN I view explanations THEN they SHALL be medically accurate and up-to-date
5. WHEN I finish reading explanations THEN I SHALL be able to return to calculations easily

### Requirement 9

**User Story:** As a healthcare professional, I want access to app settings and information, so that I can customize the app behavior and access general information.

#### Acceptance Criteria

1. WHEN I access the settings page THEN it SHALL provide an option to manually switch between supported languages
2. WHEN I access the settings page THEN it SHALL provide an option to manually override automatic dark/light mode switching
3. WHEN I access the settings page THEN it SHALL display general information about the app including version and purpose
4. WHEN I change language settings THEN the app SHALL immediately reflect the new language choice
5. WHEN I change theme settings THEN the app SHALL immediately apply the selected theme

### Requirement 10

**User Story:** As a healthcare professional, I want to export calculation results for documentation purposes, so that I can include scores in patient records or share with colleagues while maintaining patient confidentiality.

#### Acceptance Criteria

1. WHEN I complete calculations THEN the app SHALL provide an export option at the bottom of the screen
2. WHEN I select export THEN the system SHALL offer format options including image, PDF, and text file
3. WHEN I select an export format THEN the system SHALL display a prominent warning about patient data confidentiality risks
4. WHEN I proceed with export after acknowledging the warning THEN the system SHALL generate the file with calculated scores and input values
5. WHEN the export is complete THEN the system SHALL use the device's standard sharing mechanism to save or share the file

### Requirement 11

**User Story:** As a developer, I want the project to be managed with GitHub source control, so that I can maintain version history, collaborate effectively, and ensure code quality.

#### Acceptance Criteria

1. WHEN the project is initialized THEN it SHALL be set up as a GitHub repository
2. WHEN code changes are made THEN they SHALL be committed with clear, descriptive commit messages
3. WHEN the project structure is established THEN it SHALL include appropriate .gitignore files for the chosen technology stack
4. WHEN the repository is created THEN it SHALL include a comprehensive README.md with project setup instructions
5. WHEN development progresses THEN the repository SHALL maintain a clean commit history with logical grouping of changes