'use client';

import type { ReactNode } from 'react';

import { ComponentPlayground } from '../../components/ComponentPlayground';
import { useComponentDemoState } from '../../components/ComponentDemoStateProvider';
import { PlaygroundControlsFromSchema } from '../../components/PlaygroundControls';

import { inputPlaygroundControls } from './inputPlaygroundSchema';

export type InputPlaygroundValue = {
  label: string;
  description: string;
  placeholder: string;
  size: 'sm' | 'md' | 'lg';
  color: 'primary' | 'neutral' | 'success' | 'warning' | 'danger';
  variant: 'outline' | 'filled' | 'soft';
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  invalid: boolean;
  loading: boolean;
  clearable: boolean;
  revealPassword: boolean;
  showCounter: boolean;
  error: string;
};

type InputPlaygroundProps = {
  renderInput: (
    value: InputPlaygroundValue,
    onChange: <K extends keyof InputPlaygroundValue>(
      key: K,
      nextValue: InputPlaygroundValue[K]
    ) => void
  ) => ReactNode;
};

export const initialInputPlaygroundValue: InputPlaygroundValue = {
  label: '',
  description: '',
  placeholder: 'name@example.com',
  size: 'md',
  color: 'primary',
  variant: 'outline',
  disabled: false,
  readOnly: false,
  required: false,
  invalid: false,
  loading: false,
  clearable: false,
  revealPassword: false,
  showCounter: false,
  error: '',
};

export function InputPlayground({ renderInput }: InputPlaygroundProps) {
  const [value, setValue] = useComponentDemoState<InputPlaygroundValue>(
    initialInputPlaygroundValue
  );

  const update = (
    key: keyof InputPlaygroundValue,
    nextValue: InputPlaygroundValue[keyof InputPlaygroundValue]
  ) => {
    setValue({
      ...value,
      [key]: nextValue,
    });
  };

  return (
    <ComponentPlayground
      previewWidth='field'
      controls={
        <PlaygroundControlsFromSchema
          value={value}
          controls={inputPlaygroundControls}
          onChange={update}
        />
      }
    >
      {renderInput(value, update)}
    </ComponentPlayground>
  );
}
