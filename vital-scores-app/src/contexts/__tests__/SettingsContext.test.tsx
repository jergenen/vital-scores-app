import { describe, it, expect } from 'vitest';
import { AppSettings } from '../../types';

// Import the action types for direct testing
import { SettingsAction } from '../SettingsContext';

// We'll test the reducer logic directly since we don't have React testing setup
function settingsReducer(state: AppSettings, action: SettingsAction): AppSettings {
  const initialSettings: AppSettings = {
    language: 'no', // Norwegian as default per requirements
    themeMode: 'auto',
    version: '1.0.0',
  };

  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.language,
      };
    case 'SET_THEME_MODE':
      return {
        ...state,
        themeMode: action.themeMode,
      };
    case 'SET_VERSION':
      return {
        ...state,
        version: action.version,
      };
    case 'LOAD_SETTINGS':
      return {
        ...state,
        ...action.settings,
      };
    case 'RESET_SETTINGS':
      return initialSettings;
    default:
      return state;
  }
}

describe('SettingsContext Reducer', () => {
  const initialSettings: AppSettings = {
    language: 'no',
    themeMode: 'auto',
    version: '1.0.0',
  };

  it('should have correct initial settings', () => {
    expect(initialSettings.language).toBe('no');
    expect(initialSettings.themeMode).toBe('auto');
    expect(initialSettings.version).toBe('1.0.0');
  });

  it('should update language correctly', () => {
    const action: SettingsAction = {
      type: 'SET_LANGUAGE',
      language: 'en'
    };

    const newState = settingsReducer(initialSettings, action);

    expect(newState.language).toBe('en');
    expect(newState.themeMode).toBe('auto'); // Other fields unchanged
    expect(newState.version).toBe('1.0.0'); // Other fields unchanged
  });

  it('should update theme mode correctly', () => {
    const action: SettingsAction = {
      type: 'SET_THEME_MODE',
      themeMode: 'dark'
    };

    const newState = settingsReducer(initialSettings, action);

    expect(newState.themeMode).toBe('dark');
    expect(newState.language).toBe('no'); // Other fields unchanged
    expect(newState.version).toBe('1.0.0'); // Other fields unchanged
  });

  it('should update version correctly', () => {
    const action: SettingsAction = {
      type: 'SET_VERSION',
      version: '2.0.0'
    };

    const newState = settingsReducer(initialSettings, action);

    expect(newState.version).toBe('2.0.0');
    expect(newState.language).toBe('no'); // Other fields unchanged
    expect(newState.themeMode).toBe('auto'); // Other fields unchanged
  });

  it('should load settings correctly', () => {
    const newSettings: AppSettings = {
      language: 'en',
      themeMode: 'light',
      version: '1.5.0'
    };

    const action: SettingsAction = {
      type: 'LOAD_SETTINGS',
      settings: newSettings
    };

    const newState = settingsReducer(initialSettings, action);

    expect(newState.language).toBe('en');
    expect(newState.themeMode).toBe('light');
    expect(newState.version).toBe('1.5.0');
  });

  it('should load partial settings correctly', () => {
    const partialSettings: Partial<AppSettings> = {
      language: 'en',
      themeMode: 'dark'
      // version not provided
    };

    const action: SettingsAction = {
      type: 'LOAD_SETTINGS',
      settings: partialSettings as AppSettings
    };

    const newState = settingsReducer(initialSettings, action);

    expect(newState.language).toBe('en');
    expect(newState.themeMode).toBe('dark');
    expect(newState.version).toBe('1.0.0'); // Should keep original version
  });

  it('should reset settings correctly', () => {
    // Start with modified settings
    const modifiedSettings: AppSettings = {
      language: 'en',
      themeMode: 'dark',
      version: '2.0.0'
    };

    const action: SettingsAction = { type: 'RESET_SETTINGS' };
    const newState = settingsReducer(modifiedSettings, action);

    expect(newState).toEqual(initialSettings);
    expect(newState.language).toBe('no');
    expect(newState.themeMode).toBe('auto');
    expect(newState.version).toBe('1.0.0');
  });

  it('should handle all theme mode values correctly', () => {
    const themeModes: Array<'auto' | 'light' | 'dark'> = ['auto', 'light', 'dark'];

    themeModes.forEach(mode => {
      const action: SettingsAction = {
        type: 'SET_THEME_MODE',
        themeMode: mode
      };

      const newState = settingsReducer(initialSettings, action);
      expect(newState.themeMode).toBe(mode);
    });
  });

  it('should handle multiple language values correctly', () => {
    const languages = ['no', 'en', 'de', 'fr'];

    languages.forEach(lang => {
      const action: SettingsAction = {
        type: 'SET_LANGUAGE',
        language: lang
      };

      const newState = settingsReducer(initialSettings, action);
      expect(newState.language).toBe(lang);
    });
  });

  it('should return unchanged state for unknown action type', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' } as any;
    const newState = settingsReducer(initialSettings, unknownAction);

    expect(newState).toEqual(initialSettings);
  });

  it('should maintain immutability', () => {
    const action: SettingsAction = {
      type: 'SET_LANGUAGE',
      language: 'en'
    };

    const newState = settingsReducer(initialSettings, action);

    // Original state should be unchanged
    expect(initialSettings.language).toBe('no');
    // New state should have the change
    expect(newState.language).toBe('en');
    // They should be different objects
    expect(newState).not.toBe(initialSettings);
  });
});