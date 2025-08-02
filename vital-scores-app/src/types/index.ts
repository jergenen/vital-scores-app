// Core TypeScript interfaces for the Vital Scores App

export type ConsciousnessLevel = 'A' | 'C' | 'V' | 'P' | 'U';

export interface VitalSigns {
  respiratoryRate?: number;
  oxygenSaturation?: number;
  supplementalOxygen: boolean;
  temperature?: number;
  systolicBP?: number;
  heartRate?: number;
  consciousnessLevel?: ConsciousnessLevel;
}

export interface CalculationResults {
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

export interface AppSettings {
  language: string;
  themeMode: 'auto' | 'light' | 'dark';
  version: string;
}

export interface ExportData {
  timestamp: Date;
  patientIdentifier?: string;
  vitalSigns: VitalSigns;
  results: CalculationResults;
}

// Theme system interfaces
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  news2: string;
  qsofa: string;
  both: string;
  onPrimary: string;
  onError: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    fontWeight: {
      normal: string;
      medium: string;
      bold: string;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  animation: {
    duration: {
      fast: number;
      normal: number;
      slow: number;
    };
    easing: {
      ease: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
}

export type ThemeMode = 'light' | 'dark';

// Validation interfaces
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  warningMessage?: string;
}

export interface ValidationState {
  [key: string]: ValidationResult;
}

export interface InputFieldProps {
  label: string;
  value: number | string | undefined;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'numeric' | 'default';
  validation?: ValidationResult;
  showValidation?: boolean;
  disabled?: boolean;
}