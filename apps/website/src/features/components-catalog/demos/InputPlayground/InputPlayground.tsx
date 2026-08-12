'use client';

import type { ReactNode } from 'react';

import { ComponentPlayground } from '../../components/ComponentPlayground';
import { useComponentDemoState } from '../../components/ComponentDemoStateProvider';
import { PlaygroundControlsFromSchema } from '../../components/PlaygroundControls';
import { inputPlaygroundControls } from './inputPlaygroundSchema';

export type InputPlaygroundType =
  'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

export type InputPlaygroundSize = 'sm' | 'md' | 'lg';

export type InputPlaygroundColor =
  'primary' | 'neutral' | 'success' | 'warning' | 'danger';

export type InputPlaygroundVariant = 'outline' | 'filled' | 'soft';

export type InputPlaygroundState =
  'default' | 'disabled' | 'loading' | 'invalid' | 'readOnly';

export type InputPlaygroundValue = {
  type: InputPlaygroundType;
  size: InputPlaygroundSize;
  color: InputPlaygroundColor;
  variant: InputPlaygroundVariant;
  state: InputPlaygroundState;
  clearable: boolean;
  required: boolean;
};

type InputPlaygroundProps = {
  renderInput: (value: InputPlaygroundValue) => ReactNode;
};

export const initialInputPlaygroundValue: InputPlaygroundValue = {
  type: 'text',
  size: 'md',
  color: 'primary',
  variant: 'outline',
  state: 'default',
  clearable: false,
  required: false,
};

export function InputPlayground({ renderInput }: InputPlaygroundProps) {
  const [value, setValue] = useComponentDemoState<InputPlaygroundValue>(
    initialInputPlaygroundValue
  );

  const update = <K extends keyof InputPlaygroundValue>(
    key: K,
    nextValue: InputPlaygroundValue[K]
  ) => {
    setValue({
      ...value,
      [key]: nextValue,
    });
  };

  return (
    <ComponentPlayground
      previewAlign='start'
      controls={
        <PlaygroundControlsFromSchema
          value={value}
          controls={inputPlaygroundControls}
          onChange={update}
        />
      }
    >
      {renderInput(value)}
    </ComponentPlayground>
  );
}
