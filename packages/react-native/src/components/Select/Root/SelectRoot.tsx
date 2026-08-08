import { View } from 'react-native';

import { FormField } from '../../../patterns/FormField';
import { SelectContentSurface } from '../Content';
import { SelectContext } from '../internal/SelectContext';
import { SelectTrigger } from '../Trigger';
import type { SelectProps } from '../types';

import { useSelectRootState } from './useSelectRootState';

export function SelectRoot(props: SelectProps) {
  const state = useSelectRootState(props);
  const {
    contextValue,
    controlProps,
    displayValue,
    field,
    formFieldProps,
    hasOwnField,
    hasValue,
    isDisabled,
    isInvalid,
    isOpen,
    isRequired,
    resolvedHint,
    resolvedLabel,
    resolvedSize,
    triggerRef,
    clearValue,
    openDropdown,
    setTriggerWidth,
  } = state;

  const control = (
    <SelectContext.Provider value={contextValue}>
      <View
        ref={triggerRef}
        testID={controlProps.testID}
        onLayout={(event) => setTriggerWidth(event.nativeEvent.layout.width)}
      >
        <SelectTrigger
          displayText={displayValue}
          isPlaceholder={!hasValue}
          isOpen={isOpen}
          hasValue={hasValue}
          size={resolvedSize}
          color={controlProps.color}
          variant={controlProps.variant}
          disabled={isDisabled}
          required={isRequired}
          hasError={isInvalid}
          loading={controlProps.loading}
          clearable={controlProps.clearable}
          startIcon={controlProps.startIcon}
          endIcon={controlProps.endIcon}
          prefix={controlProps.prefix}
          suffix={controlProps.suffix}
          nativeID={!hasOwnField ? field?.controlId : undefined}
          accessibilityLabel={resolvedLabel}
          accessibilityHint={resolvedHint}
          accessibilityLabelledBy={!hasOwnField ? field?.labelId : undefined}
          ariaDescribedBy={!hasOwnField ? field?.ariaDescribedBy : undefined}
          triggerStyle={controlProps.triggerStyle}
          textStyle={controlProps.textStyle}
          onPress={openDropdown}
          onClear={clearValue}
        />
        <SelectContentSurface />
      </View>
    </SelectContext.Provider>
  );

  if (!hasOwnField && field) {
    return control;
  }

  return (
    <FormField
      label={formFieldProps.label}
      description={formFieldProps.description}
      error={formFieldProps.error}
      required={isRequired}
      disabled={isDisabled}
      invalid={isInvalid}
      size={resolvedSize}
      style={formFieldProps.style}
    >
      {control}
    </FormField>
  );
}

SelectRoot.displayName = 'Select';
