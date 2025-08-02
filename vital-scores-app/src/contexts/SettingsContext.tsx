import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppSettings } from '../types';

// Action types for Settings reducer
export type SettingsAction =
  | { type: 'SET_LANGUAGE'; language: string }
  | { type: 'SET_THEME_MODE'; themeMode: 'auto' | 'light' | 'dark' }
  | { type: 'SET_VERSION'; version: string }
  | { type: 'LOAD_SETTINGS'; settings: AppSettings }
  | { type: 'RESET_SETTINGS' };

// Context interface
interface SettingsContextType {
  settings: AppSettings;
  dispatch: React.Dispatch<SettingsAction>;
  setLanguage: (language: string) => void;
  setThemeMode: (themeMode: 'auto' | 'light' | 'dark') => void;
  setVersion: (version: string) => void;
  loadSettings: (settings: AppSettings) => void;
  resetSettings: () => void;
}

// Initial settings
const initialSettings: AppSettings = {
  language: 'no', // Norwegian as default per requirements
  themeMode: 'auto',
  version: '1.0.0',
};

// Reducer function
function settingsReducer(state: AppSettings, action: SettingsAction): AppSettings {
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

// Create context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component
interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, dispatch] = useReducer(settingsReducer, initialSettings);

  // Helper functions for common actions
  const setLanguage = (language: string) => {
    dispatch({ type: 'SET_LANGUAGE', language });
  };

  const setThemeMode = (themeMode: 'auto' | 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME_MODE', themeMode });
  };

  const setVersion = (version: string) => {
    dispatch({ type: 'SET_VERSION', version });
  };

  const loadSettings = (settings: AppSettings) => {
    dispatch({ type: 'LOAD_SETTINGS', settings });
  };

  const resetSettings = () => {
    dispatch({ type: 'RESET_SETTINGS' });
  };

  // Session-based persistence (in-memory only)
  // Settings are maintained during the app session but not persisted to storage
  // This satisfies the requirement for session-based data persistence
  useEffect(() => {
    // In a real implementation, you might want to detect device language here
    // For now, we'll use the default Norwegian setting
  }, []);

  const contextValue: SettingsContextType = {
    settings,
    dispatch,
    setLanguage,
    setThemeMode,
    setVersion,
    loadSettings,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use the context
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}