# App Configuration

## Expo Configuration (app.json)

The Vital Scores App is configured for cross-platform deployment with the following key settings:

### Basic App Information
- **Name**: "Vital Scores App" (display name)
- **Slug**: "vital-scores-app" (URL-friendly identifier)
- **Version**: "1.0.0-alpha" (pre-release version)
- **Bundle ID**: "com.vitalscores.app" (iOS and Android)

### Platform Support
- **iOS**: Native app with iPad support enabled
- **Android**: Native app with adaptive icon and edge-to-edge display
- **Web**: Progressive web app with Metro bundler

### User Experience Settings
- **Orientation**: Default (supports both portrait and landscape)
- **Theme**: Automatic (follows device dark/light mode preference)
- **New Architecture**: Enabled for improved performance

### Assets Configuration
- **Icon**: `./assets/icon.png` (app icon)
- **Splash Screen**: `./assets/splash-icon.png` (loading screen)
- **Favicon**: `./assets/favicon.png` (web browser tab icon)
- **Adaptive Icon**: `./assets/adaptive-icon.png` (Android adaptive icon)

### Build Configuration
- **iOS Build Number**: 1
- **Android Version Code**: 1
- **Asset Bundle Patterns**: All assets included (`**/*`)

### Development Features
- **New Architecture**: Enabled for React Native's new architecture
- **Edge-to-Edge**: Enabled on Android for modern UI experience

## Platform-Specific Notes

### iOS
- Supports both iPhone and iPad devices
- Uses bundle identifier `com.vitalscores.app`
- Configured for App Store distribution

### Android
- Uses adaptive icon system for better integration with device themes
- Edge-to-edge display for modern Android experience
- Package name `com.vitalscores.app`

### Web
- Uses Metro bundler for optimal web performance
- Configured as Progressive Web App (PWA)
- Responsive design for various screen sizes

## Development vs Production

The current configuration is set up for both development and production builds. The EAS (Expo Application Services) project ID is configured for streamlined build and deployment processes.