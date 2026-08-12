'use client';

import type { ReactNode } from 'react';

import { ComponentPlayground } from '../../components/ComponentPlayground';
import { useComponentDemoState } from '../../components/ComponentDemoStateProvider';
import { PlaygroundControlsFromSchema } from '../../components/PlaygroundControls';
import { checkboxPlaygroundControls } from './checkboxPlaygroundSchema';

export type CheckboxPlaygroundSize = 'sm' | 'md' | 'lg';

export type CheckboxPlaygroundColor =
  'primary' | 'neutral' | 'success' | 'warning' | 'danger';

export type CheckboxPlaygroundLabelPosition = 'start' | 'end';

export type CheckboxPlaygroundState =
  'default' | 'disabled' | 'indeterminate' | 'error';

export type CheckboxPlaygroundValue = {
  size: CheckboxPlaygroundSize;
  color: CheckboxPlaygroundColor;
  labelPosition: CheckboxPlaygroundLabelPosition;
  state: CheckboxPlaygroundState;
  required: boolean;
};

type CheckboxPlaygroundProps = {
  renderCheckbox: (value: CheckboxPlaygroundValue) => ReactNode;
};

export const initialCheckboxPlaygroundValue: CheckboxPlaygroundValue = {
  size: 'md',
  color: 'primary',
  labelPosition: 'end',
  state: 'default',
  required: false,
};

export function CheckboxPlayground({
  renderCheckbox,
}: CheckboxPlaygroundProps) {
  const [value, setValue] = useComponentDemoState<CheckboxPlaygroundValue>(
    initialCheckboxPlaygroundValue
  );

  const update = <K extends keyof CheckboxPlaygroundValue>(
    key: K,
    nextValue: CheckboxPlaygroundValue[K]
  ) => {
    setValue({
      ...value,
      [key]: nextValue,
    });
  };

  return (
    <ComponentPlayground
      controls={
        <PlaygroundControlsFromSchema
          value={value}
          controls={checkboxPlaygroundControls}
          onChange={update}
        />
      }
    >
      {renderCheckbox(value)}
    </ComponentPlayground>
  );
}
