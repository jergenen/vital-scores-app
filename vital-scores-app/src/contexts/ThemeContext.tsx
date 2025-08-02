import React, { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { useColorScheme, StatusBar, Platform } from 'react-native';
import { Theme, ThemeMode } from '../types';
import { lightTheme, darkTheme } from '../theme/constants';
import { useSettings } from './SettingsContext';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  effectiveThemeMode: ThemeMode;
  isAutoMode: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: 'auto' | 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { settings, updateSettings } = useSettings();
  const systemColorScheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState<Theme>(lightTheme);
  const [effectiveThemeMode, setEffectiveThemeMode] = useState<ThemeMode>('light');

  // Determine effective theme mode based on settings and system preference
  const determineEffectiveTheme = useCallback(() => {
    let newEffectiveMode: ThemeMode;

    if (settings.themeMode === 'auto') {
      // Use system preference when set to auto
      newEffectiveMode = systemColorScheme === 'dark' ? 'dark' : 'light';
    } else {
      // Use manual setting
      newEffectiveMode = settings.themeMode as ThemeMode;
    }

    return newEffectiveMode;
  }, [settings.themeMode, systemColorScheme]);

  // Update theme when settings or system preference changes
  useEffect(() => {
    const newEffectiveMode = determineEffectiveTheme();
    setEffectiveThemeMode(newEffectiveMode);
    setCurrentTheme(newEffectiveMode === 'dark' ? darkTheme : lightTheme);

    // Update status bar style based on theme
    if (Platform.OS !== 'web') {
      StatusBar.setBarStyle(newEffectiveMode === 'dark' ? 'light-content' : 'dark-content', true);
    }
  }, [determineEffectiveTheme]);

  // Toggle between light and dark themes (when not in auto mode)
  const toggleTheme = useCallback(() => {
    if (settings.themeMode === 'auto') {
      // If in auto mode, switch to manual mode with opposite of current effective theme
      const newMode = effectiveThemeMode === 'dark' ? 'light' : 'dark';
      updateSettings({ themeMode: newMode });
    } else {
      // Toggle between light and dark
      const newMode = settings.themeMode === 'dark' ? 'light' : 'dark';
      updateSettings({ themeMode: newMode });
    }
  }, [settings.themeMode, effectiveThemeMode, updateSettings]);

  // Set specific theme mode
  const setThemeMode = useCallback((mode: 'auto' | 'light' | 'dark') => {
    updateSettings({ themeMode: mode });
  }, [updateSettings]);

  const contextValue: ThemeContextType = {
    theme: currentTheme,
    themeMode: settings.themeMode as ThemeMode,
    isDark: effectiveThemeMode === 'dark',
    effectiveThemeMode,
    isAutoMode: settings.themeMode === 'auto',
    toggleTheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}