import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useVitalSigns } from '../../contexts/VitalSignsContext';
import { useValidation } from '../../hooks/useValidation';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { VitalSignInput } from './VitalSignInput';
import { ConsciousnessSelector } from './ConsciousnessSelector';
import { SupplementalOxygenToggle } from './SupplementalOxygenToggle';
import { ScoringSystemIndicator } from './ScoringSystemIndicator';

/**
 * Unified input fields component that handles all vital signs input
 * with color-coded indicators showing which scoring system uses each field
 */
export function UnifiedInputFields() {
  const { state, updateVitalSign } = useVitalSigns();
  const { getFieldValidation } = useValidation();
  const { theme } = useThemeStyles();

  const handleVitalSignChange = (field: keyof typeof state.vitalSigns, value: string) => {
    // Convert string to number for numeric fields
    if (field === 'consciousnessLevel' || field === 'supplementalOxygen') {
      updateVitalSign(field, value);
    } else {
      const numericValue = value === '' ? undefined : parseFloat(value);
      updateVitalSign(field, numericValue);
    }
  };

  const handleSupplementalOxygenChange = (value: boolean) => {
    updateVitalSign('supplementalOxygen', value);
  };

  const componentStyles = StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: '700' as const,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    inputGroup: {
      marginBottom: theme.spacing.md,
      position: 'relative',
    },
  });

  return (
    <View style={componentStyles.container}>
      <Text style={componentStyles.sectionTitle}>Vital Signs Input</Text>
      
      {/* Respiratory Rate - Used by both NEWS2 and q-SOFA */}
      <View style={componentStyles.inputGroup}>
        <VitalSignInput
          label="Respiratory Rate"
          value={state.vitalSigns.respiratoryRate}
          onChangeText={(value) => handleVitalSignChange('respiratoryRate', value)}
          placeholder="breaths/min"
          validation={getFieldValidation('respiratoryRate')}
          keyboardType="numeric"
        />
        <ScoringSystemIndicator 
          systems={['news2', 'qsofa']} 
          scores={{
            news2: state.results.news2.score,
            qsofa: state.results.qsofa.score
          }}
        />
      </View>

      {/* Heart Rate - Used by NEWS2 only */}
      <View style={componentStyles.inputGroup}>
        <VitalSignInput
          label="Heart Rate"
          value={state.vitalSigns.heartRate}
          onChangeText={(value) => handleVitalSignChange('heartRate', value)}
          placeholder="bpm"
          validation={getFieldValidation('heartRate')}
          keyboardType="numeric"
        />
        <ScoringSystemIndicator 
          systems={['news2']} 
          scores={{
            news2: state.results.news2.score
          }}
        />
      </View>

      {/* Systolic Blood Pressure - Used by both NEWS2 and q-SOFA */}
      <View style={componentStyles.inputGroup}>
        <VitalSignInput
          label="Systolic Blood Pressure"
          value={state.vitalSigns.systolicBP}
          onChangeText={(value) => handleVitalSignChange('systolicBP', value)}
          placeholder="mmHg"
          validation={getFieldValidation('systolicBP')}
          keyboardType="numeric"
        />
        <ScoringSystemIndicator 
          systems={['news2', 'qsofa']} 
          scores={{
            news2: state.results.news2.score,
            qsofa: state.results.qsofa.score
          }}
        />
      </View>

      {/* Temperature - Used by NEWS2 only */}
      <View style={componentStyles.inputGroup}>
        <VitalSignInput
          label="Temperature"
          value={state.vitalSigns.temperature}
          onChangeText={(value) => handleVitalSignChange('temperature', value)}
          placeholder="°C"
          validation={getFieldValidation('temperature')}
          keyboardType="numeric"
        />
        <ScoringSystemIndicator 
          systems={['news2']} 
          scores={{
            news2: state.results.news2.score
          }}
        />
      </View>

      {/* Oxygen Saturation - Used by NEWS2 only */}
      <View style={componentStyles.inputGroup}>
        <VitalSignInput
          label="Oxygen Saturation"
          value={state.vitalSigns.oxygenSaturation}
          onChangeText={(value) => handleVitalSignChange('oxygenSaturation', value)}
          placeholder="%"
          validation={getFieldValidation('oxygenSaturation')}
          keyboardType="numeric"
        />
        <ScoringSystemIndicator 
          systems={['news2']} 
          scores={{
            news2: state.results.news2.score
          }}
        />
      </View>

      {/* Supplemental Oxygen - Used by NEWS2 only */}
      <View style={componentStyles.inputGroup}>
        <SupplementalOxygenToggle
          value={state.vitalSigns.supplementalOxygen}
          onValueChange={handleSupplementalOxygenChange}
        />
        <ScoringSystemIndicator 
          systems={['news2']} 
          scores={{
            news2: state.results.news2.score
          }}
        />
      </View>

      {/* Consciousness Level - Used by both NEWS2 and q-SOFA */}
      <View style={componentStyles.inputGroup}>
        <ConsciousnessSelector
          value={state.vitalSigns.consciousnessLevel}
          onValueChange={(value) => handleVitalSignChange('consciousnessLevel', value)}
          validation={getFieldValidation('consciousnessLevel')}
        />
        <ScoringSystemIndicator 
          systems={['news2', 'qsofa']} 
          scores={{
            news2: state.results.news2.score,
            qsofa: state.results.qsofa.score
          }}
        />
      </View>
    </View>
  );
}