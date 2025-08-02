# Vital Scores App

**Version: 1.0.0-alpha**

A cross-platform mobile and web application designed for healthcare professionals to quickly and accurately calculate NEWS2 (National Early Warning Score 2) and q-SOFA (quick Sequential Organ Failure Assessment) scores.

## Features

- **Cross-Platform Support**: Native iOS, Android, and responsive web application
- **Unified Interface**: Single screen with shared input fields for both scoring systems
- **Real-time Calculations**: Immediate score updates as data is entered
- **Internationalization**: Multi-language support with Norwegian as default
- **Dark/Light Theme**: Automatic theme switching based on device settings
- **Export Functionality**: Export results as images, PDFs, or text files
- **Clinical Workflow Optimized**: Designed for fast-paced healthcare environments

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: React Context + useReducer
- **Internationalization**: react-i18next
- **Navigation**: React Navigation
- **Testing**: Vitest

## Platform Configuration

The app is configured to support multiple platforms with the following settings:

- **App Name**: Vital Scores App
- **Bundle ID**: com.vitalscores.app
- **Supported Platforms**: iOS, Android, Web
- **Orientation**: Default (supports both portrait and landscape)
- **Theme**: Automatic (follows device theme)
- **iPad Support**: Optimized for tablet use

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- For iOS development: Xcode
- For Android development: Android Studio

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vital-scores-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

### Running on Different Platforms

- **iOS Simulator**: Press `i` in the terminal or scan QR code with Expo Go
- **Android Emulator**: Press `a` in the terminal or scan QR code with Expo Go
- **Web Browser**: Press `w` in the terminal or visit the provided localhost URL

## Project Structure

```
vital-scores-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── calculator/      # Calculator-specific components
│   │   ├── common/          # Common UI components
│   │   └── navigation/      # Navigation components
│   ├── contexts/           # React Context providers and state management
│   ├── i18n/               # Internationalization setup
│   │   └── locales/        # Translation files
│   ├── services/           # Business logic and calculations
│   │   ├── news2Calculator.ts      # NEWS2 scoring algorithm
│   │   ├── qsofaCalculator.ts      # q-SOFA scoring algorithm
│   │   └── unifiedCalculationService.ts  # Combined calculation service
│   ├── theme/              # Theme constants and styling
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions and validation
├── assets/                 # Images, icons, and static assets
├── locales/               # Additional locale files
└── docs/                  # Documentation files
```

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
# Build for all platforms
npx expo build

# Build for specific platform
npx expo build:ios
npx expo build:android
npx expo build:web
```

### Development Environment

The project includes VS Code configuration for optimal development experience:

- **TypeScript Auto-Closing Tags**: Disabled for better control over JSX/TSX tag completion
- **Recommended Extensions**: TypeScript, React Native Tools, Expo Tools

### Code Quality

The project uses TypeScript with strict mode enabled and includes comprehensive unit tests for all calculation logic and utility functions.

## Clinical Scoring Systems

### NEWS2 (National Early Warning Score 2)
- Respiratory Rate
- Oxygen Saturation
- Supplemental Oxygen
- Temperature
- Systolic Blood Pressure
- Heart Rate
- Consciousness Level (ACVPU)

### q-SOFA (quick Sequential Organ Failure Assessment)
- Respiratory Rate (≥22/min = 1 point)
- Systolic Blood Pressure (≤100 mmHg = 1 point)
- Altered Consciousness (any level other than Alert = 1 point)
- Score ≥2 indicates high risk of sepsis-related complications

## Calculation Services

The app includes robust calculation engines for both scoring systems:

- **NEWS2 Calculator**: Implements the full NEWS2 scoring algorithm with proper point assignments and risk level determination
- **q-SOFA Calculator**: Implements the three-criteria q-SOFA scoring with sepsis risk assessment
- **Unified Calculation Service**: Handles both calculations simultaneously with real-time updates
- **Input Validation**: Comprehensive validation for physiological ranges and data completeness
- **TypeScript Support**: Fully typed interfaces for all calculation inputs and outputs

For detailed information about the calculation algorithms and API reference, see [Calculation Services Documentation](docs/calculation-services.md).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is open source under a non-commercial license. You are free to use, modify, and distribute this software for personal, educational, and non-commercial purposes only. Commercial use, including but not limited to selling, licensing, or using this software in commercial products or services, is strictly prohibited without explicit written permission from the project maintainers.

## Support

For support and questions, please refer to the project documentation or create an issue in the repository.