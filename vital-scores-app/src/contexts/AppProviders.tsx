import React, { ReactNode } from 'react';
import { VitalSignsProvider } from './VitalSignsContext';
import { SettingsProvider } from './SettingsContext';
import { ThemeProvider } from './ThemeContext';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Combined provider component that wraps the entire app with all necessary contexts.
 * This provides a clean way to set up all global state management in one place.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <VitalSignsProvider>
          {children}
        </VitalSignsProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}