'use client';

import type { ReactNode } from 'react';
import { ComponentPlayground } from '../../components/ComponentPlayground';
import { useComponentDemoState } from '../../components/ComponentDemoStateProvider';
import { PlaygroundControlsFromSchema } from '../../components/PlaygroundControls';
import { buttonPlaygroundControls } from './buttonPlaygroundSchema';

export type ButtonPlaygroundAppearance =
  'solid' | 'outline' | 'ghost' | 'soft' | 'link';

export type ButtonPlaygroundColor =
  'primary' | 'neutral' | 'success' | 'warning' | 'danger';

export type ButtonPlaygroundSize = 'sm' | 'md' | 'lg';
export type ButtonPlaygroundShape = 'square' | 'rounded' | 'pill';
export type ButtonPlaygroundState = 'default' | 'disabled' | 'loading';

export type ButtonPlaygroundValue = {
  appearance: ButtonPlaygroundAppearance;
  color: ButtonPlaygroundColor;
  size: ButtonPlaygroundSize;
  shape: ButtonPlaygroundShape;
  state: ButtonPlaygroundState;
};

type ButtonPlaygroundProps = {
  renderButton: (value: ButtonPlaygroundValue) => ReactNode;
};

const initialValue: ButtonPlaygroundValue = {
  appearance: 'solid',
  color: 'primary',
  size: 'md',
  shape: 'pill',
  state: 'default',
};

export function ButtonPlayground({ renderButton }: ButtonPlaygroundProps) {
  const [value, setValue] =
    useComponentDemoState<ButtonPlaygroundValue>(initialValue);

  const updateValue = <K extends keyof ButtonPlaygroundValue>(
    key: K,
    nextValue: ButtonPlaygroundValue[K]
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
          controls={buttonPlaygroundControls}
          onChange={updateValue}
        />
      }
    >
      {renderButton(value)}
    </ComponentPlayground>
  );
}
