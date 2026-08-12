'use client';

import { Checkbox } from '@vellira-ui/react';

import { CheckboxPlayground } from '../CheckboxPlayground';

export function CheckboxDemo() {
  return (
    <CheckboxPlayground
      renderCheckbox={({ color, size, labelPosition, state, required }) => (
        <Checkbox
          label='Accept terms'
          description='Example checkbox.'
          color={color}
          size={size}
          labelPosition={labelPosition}
          required={required}
          disabled={state === 'disabled'}
          indeterminate={state === 'indeterminate'}
          error={state === 'error' ? 'Please confirm this option.' : undefined}
        />
      )}
    />
  );
}
