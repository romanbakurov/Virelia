'use client';

import type { ReactNode } from 'react';

import { ComponentPlayground } from '../../components/ComponentPlayground';
import { useComponentDemoState } from '../../components/ComponentDemoStateProvider';
import { PlaygroundControlsFromSchema } from '../../components/PlaygroundControls';

import { radioPlaygroundControls } from './radioPlaygroundSchema';

export type RadioPlaygroundValue = {
  checked: boolean;
  disabled: boolean;
  error: string;
  size: 'sm' | 'md' | 'lg';
  color: 'primary' | 'neutral' | 'success' | 'warning' | 'danger';
};

type RadioPlaygroundProps = {
  renderRadio: (
    value: RadioPlaygroundValue,
    onChange: <K extends keyof RadioPlaygroundValue>(
      key: K,
      nextValue: RadioPlaygroundValue[K]
    ) => void
  ) => ReactNode;
};

export const initialRadioPlaygroundValue: RadioPlaygroundValue = {
  checked: false,
  disabled: false,
  error: '',
  size: 'md',
  color: 'primary',
};

export function RadioPlayground({ renderRadio }: RadioPlaygroundProps) {
  const [value, setValue] = useComponentDemoState<RadioPlaygroundValue>(
    initialRadioPlaygroundValue
  );

  const update = (
    key: keyof RadioPlaygroundValue,
    nextValue: RadioPlaygroundValue[keyof RadioPlaygroundValue]
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
          controls={radioPlaygroundControls}
          onChange={update}
        />
      }
    >
      {renderRadio(value, update)}
    </ComponentPlayground>
  );
}
