# Requirements Document

## Introduction

Vital-scores-app is a cross-platform mobile and web application designed specifically for healthcare professionals to quickly and accurately calculate NEWS2 (National Early Warning Score 2) and q-SOFA (quick Sequential Organ Failure Assessment) scores. The app prioritizes ease of use, accessibility, and clinical workflow integration while supporting multiple platforms and languages.

## Requirements

### Requirement 1: Cross-Platform Accessibility

**User Story:** As a healthcare professional, I want to access the vital-scores-app on any device (Android, iOS, iPad, web), so that I can calculate clinical scores regardless of my available technology.

#### Acceptance Criteria

1. WHEN the app is developed THEN the system SHALL be deployable as a native Android app on Google Play Store
2. WHEN the app is developed THEN the system SHALL be deployable as a native iOS app on Apple App Store
3. WHEN the app is developed THEN the system SHALL be optimized for iPad with appropriate layout scaling
4. WHEN the app is developed THEN the system SHALL be accessible as a responsive web application
5. WHEN the app runs on any platform THEN the system SHALL maintain consistent functionality and user experience

### Requirement 2: NEWS2 Score Calculation

**User Story:** As a healthcare professional, I want to calculate NEWS2 scores quickly, so that I can assess patient deterioration risk efficiently.

#### Acceptance Criteria

1. WHEN I open the app THEN the system SHALL display NEWS2 calculation fields on the main screen
2. WHEN I input patient vital signs THEN the system SHALL automatically calculate the NEWS2 score in real-time
3. WHEN the NEWS2 score is calculated THEN the system SHALL display the total score prominently above the input fields
4. WHEN the NEWS2 score is calculated THEN the system SHALL display the score as a horizontal progress bar with colors following the official NEWS2 reference sheet (neutral, yellow, orange, dark orange) representing patient risk level, including text showing "NEWS2" and the calculated score value
5. WHEN insufficient data is available for NEWS2 calculation THEN the system SHALL display the progress bar with white/grey diagonal lines and text indicating "Not enough data submitted" instead of a calculated score
6. WHEN the NEWS2 score is calculated THEN the system SHALL indicate the clinical risk level (low, medium, high)
7. WHEN I need to understand NEWS2 scoring THEN the system SHALL provide access to detailed scoring explanations
8. WHEN vital signs are entered THEN the system SHALL validate inputs are within physiologically reasonable ranges

### Requirement 3: q-SOFA Score Calculation

**User Story:** As a healthcare professional, I want to calculate q-SOFA scores quickly, so that I can identify patients at risk of sepsis-related complications.

#### Acceptance Criteria

1. WHEN I access q-SOFA calculation THEN the system SHALL display the three q-SOFA criteria on the main screen
2. WHEN I input q-SOFA parameters THEN the system SHALL automatically calculate the total score
3. WHEN the q-SOFA score is calculated THEN the system SHALL display the result clearly above the input fields
4. WHEN the q-SOFA score is calculated THEN the system SHALL display the score as a horizontal progress bar with colors from green to red representing sepsis risk level, including text showing "q-SOFA" and the calculated score value
5. WHEN insufficient data is available for q-SOFA calculation THEN the system SHALL display the progress bar in grey color
6. WHEN the q-SOFA score is ≥2 THEN the system SHALL highlight the increased sepsis risk
7. WHEN I need to understand q-SOFA criteria THEN the system SHALL provide access to detailed explanations

### Requirement 4: Internationalization Support

**User Story:** As a Norwegian healthcare professional, I want the app interface in Norwegian, so that I can use it efficiently in my native language.

#### Acceptance Criteria

1. WHEN the app launches THEN it SHALL display all interface elements in Norwegian by default
2. WHEN the app detects the device language THEN it SHALL automatically switch to that language if supported
3. WHEN the app is translated THEN it SHALL maintain medical terminology accuracy across languages
4. WHEN new languages are added THEN the system SHALL support easy translation file management
5. WHEN language switching occurs THEN it SHALL not affect calculated scores or functionality

### Requirement 5: Theme Support

**User Story:** As a healthcare professional working in various lighting conditions, I want automatic dark mode support, so that the app is comfortable to use in different environments.

#### Acceptance Criteria

1. WHEN the device is set to dark mode THEN the app SHALL automatically switch to dark theme
2. WHEN the device is set to light mode THEN the app SHALL automatically switch to light theme
3. WHEN in dark mode THEN all text SHALL remain clearly readable with appropriate contrast
4. WHEN in dark mode THEN clinical risk indicators SHALL remain visually distinct
5. WHEN theme switching occurs THEN it SHALL happen seamlessly without data loss

### Requirement 6: Simplified Input Interface

**User Story:** As a healthcare professional in a fast-paced environment, I want simple input methods without dropdowns, so that I can enter data quickly and accurately.

#### Acceptance Criteria

1. WHEN I need to input vital signs THEN the system SHALL use number input fields or simple button selections
2. WHEN I need to select binary options THEN the system SHALL use toggle switches or radio buttons
3. WHEN I interact with input fields THEN they SHALL be large enough for easy touch interaction
4. WHEN I make input errors THEN the system SHALL provide clear validation feedback
5. WHEN input fields are displayed THEN they SHALL be logically grouped and clearly labeled

### Requirement 7: Unified Score Calculation

**User Story:** As a healthcare professional, I want to calculate both NEWS2 and q-SOFA scores simultaneously using shared input fields, so that I can efficiently assess multiple clinical indicators at once.

#### Acceptance Criteria

1. WHEN I open the app THEN it SHALL display a unified set of input fields that serve both NEWS2 and q-SOFA calculations
2. WHEN I view input fields THEN each field SHALL display small text with color coding indicating whether it's used for NEWS2, q-SOFA, or both, with consistent color coding for "NEWS2" and "q-SOFA" text throughout the app
3. WHEN an input field is used for both scoring systems THEN the indicator text SHALL always display both "NEWS2" and "q-SOFA" labels
3. WHEN I enter patient data THEN both NEWS2 and q-SOFA scores SHALL be calculated and displayed simultaneously
4. WHEN I input data into any field THEN the indicator text SHALL show the calculated score for each applicable scoring system (NEWS2, q-SOFA) next to each name
5. WHEN scores are calculated THEN the single value calculated score SHALL change color based on the calculated score value
6. WHEN I perform calculations THEN all input fields and both score results SHALL be visible on the main screen
7. WHEN the screen space is limited THEN the layout SHALL adapt while maintaining all essential information visibility

### Requirement 8: Educational Content

**User Story:** As a healthcare professional learning or verifying scoring methods, I want access to detailed explanations, so that I can understand and validate the calculations.

#### Acceptance Criteria

1. WHEN I need scoring explanations THEN the system SHALL provide detailed NEWS2 scoring criteria
2. WHEN I need scoring explanations THEN the system SHALL provide detailed q-SOFA criteria explanations
3. WHEN I access explanations THEN they SHALL include normal ranges and clinical significance
4. WHEN I view explanations THEN they SHALL be medically accurate and up-to-date
5. WHEN I finish reading explanations THEN I SHALL be able to return to calculations easily

### Requirement 9: Settings and Configuration

**User Story:** As a healthcare professional, I want access to app settings and information, so that I can customize the app behavior and access general information.

#### Acceptance Criteria

1. WHEN I access the settings page THEN it SHALL provide an option to manually switch between supported languages
2. WHEN I access the settings page THEN it SHALL provide an option to manually override automatic dark/light mode switching
3. WHEN I access the settings page THEN it SHALL display general information about the app including version and purpose
4. WHEN I change language settings THEN the app SHALL immediately reflect the new language choice
5. WHEN I change theme settings THEN the app SHALL immediately apply the selected theme

### Requirement 10: Data Export Functionality

**User Story:** As a healthcare professional, I want to export calculation results for documentation purposes, so that I can include scores in patient records or share with colleagues while maintaining patient confidentiality.

#### Acceptance Criteria

1. WHEN I complete calculations THEN the app SHALL provide an export option at the bottom of the screen
2. WHEN I select export THEN the system SHALL offer format options including image, PDF, and text file
3. WHEN I select an export format THEN the system SHALL display a prominent warning about patient data confidentiality risks
4. WHEN I proceed with export after acknowledging the warning THEN the system SHALL generate the file with calculated scores and input values
5. WHEN the export is complete THEN the system SHALL use the device's standard sharing mechanism to save or share the file

### Requirement 11: Data Persistence and Reset Functionality

**User Story:** As a healthcare professional, I want the app to remember my input data during the session and provide a safe way to clear all data, so that I can continue working efficiently while having control over when to start fresh.

#### Acceptance Criteria

1. WHEN I enter data into input fields THEN the system SHALL keep all input data in memory during the app session
2. WHEN I navigate between screens THEN the system SHALL preserve all entered data
3. WHEN I want to clear all data THEN the system SHALL provide a reset button accessible from the main calculation screen
4. WHEN I press the reset button THEN the system SHALL display a confirmation prompt asking "Are you sure?" before clearing data
5. WHEN I confirm the reset action THEN the system SHALL clear all input fields and reset both score calculations

### Requirement 12: Enhanced Export Functionality

**User Story:** As a healthcare professional, I want to add a name or title to my exports, so that I can properly identify and organize exported calculation results.

#### Acceptance Criteria

1. WHEN I access the export screen THEN the system SHALL provide an input field for adding a name or title to the export
2. WHEN I enter a name/title THEN the system SHALL use this text as the filename for the exported file
3. WHEN I export the calculation results THEN the system SHALL display the entered name/title prominently in the exported file content
4. WHEN no name/title is provided THEN the system SHALL use a default filename with timestamp
5. WHEN the name/title is displayed in exported content THEN it SHALL be clearly visible at the top of the exported document/image

### Requirement 13: Source Control Management

**User Story:** As a developer, I want the project to be managed with GitHub source control, so that I can maintain version history, collaborate effectively, and ensure code quality.

#### Acceptance Criteria

1. WHEN the project is initialized THEN it SHALL be set up as a GitHub repository
2. WHEN code changes are made THEN they SHALL be committed with clear, descriptive commit messages
3. WHEN the project structure is established THEN it SHALL include appropriate .gitignore files for the chosen technology stack
4. WHEN the repository is created THEN it SHALL include a comprehensive README.md with project setup instructions
5. WHEN development progresses THEN the repository SHALL maintain a clean commit history with logical grouping of changes