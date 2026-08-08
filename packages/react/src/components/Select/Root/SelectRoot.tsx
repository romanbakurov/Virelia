import { useMemo } from 'react';

import { FormField } from '@patterns/FormField';

import { SelectContent, SelectContentSurface } from '../Content/SelectContent';
import { SelectProvider } from '../internal/SelectContext';
import { SelectTrigger, SelectTriggerSurface } from '../Trigger/SelectTrigger';
import type { SelectProps } from '../types';

import { useSelectRootState } from './useSelectRootState';

export const SelectRoot = (props: SelectProps) => {
  const {
    children,
    className,
    contentProps,
    contextValue,
    description,
    error,
    hasCompoundLayout,
    hasExternalField,
    hiddenInputs,
    isDisabled,
    isRequired,
    label,
    triggerId,
    triggerProps,
  } = useSelectRootState(props);

  const control = useMemo(
    () => (
      <SelectProvider value={contextValue}>
        {hiddenInputs}
        {hasCompoundLayout ? (
          children
        ) : (
          <>
            <SelectTrigger />
            <SelectContent>{children}</SelectContent>
          </>
        )}
      </SelectProvider>
    ),
    [children, contextValue, hasCompoundLayout, hiddenInputs]
  );

  const defaultControl = useMemo(
    () => (
      <SelectProvider value={contextValue}>
        {hiddenInputs}
        <SelectTriggerSurface {...triggerProps} />
        <SelectContentSurface {...contentProps} />
      </SelectProvider>
    ),
    [contentProps, contextValue, hiddenInputs, triggerProps]
  );

  if (hasExternalField) {
    return children ? control : defaultControl;
  }

  return (
    <FormField
      id={triggerId}
      label={label}
      description={description}
      error={error}
      required={isRequired}
      disabled={isDisabled}
      bindControl={false}
      className={className}
    >
      {children ? control : defaultControl}
    </FormField>
  );
};

SelectRoot.displayName = 'SelectRoot';
