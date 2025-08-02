// Export all contexts and their related types
export {
  VitalSignsProvider,
  useVitalSigns,
  type VitalSignsAction,
  type VitalSignsState,
} from './VitalSignsContext';

export {
  SettingsProvider,
  useSettings,
  type SettingsAction,
} from './SettingsContext';

export {
  ThemeProvider,
  useTheme,
} from './ThemeContext';

export { AppProviders } from './AppProviders';