'use client';

import { useState } from 'react';

import { Button } from '@vellira-ui/react-native';

import { ComponentPlayground } from '../../components/ComponentPlayground';

import styles from '../ButtonDemo/ButtonDemo.module.css';

type Appearance = 'solid' | 'outline' | 'ghost' | 'soft' | 'link';
type Color = 'primary' | 'neutral' | 'success' | 'warning' | 'danger';
type Size = 'sm' | 'md' | 'lg';
type Shape = 'square' | 'rounded' | 'pill';
type State = 'default' | 'disabled' | 'loading';

const appearances: Appearance[] = ['solid', 'outline', 'soft', 'ghost', 'link'];

const colors: Color[] = ['primary', 'neutral', 'success', 'warning', 'danger'];

const sizes: Size[] = ['sm', 'md', 'lg'];
const shapes: Shape[] = ['square', 'rounded', 'pill'];
const states: State[] = ['default', 'disabled', 'loading'];

type ControlGroupProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

function ControlGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: ControlGroupProps<T>) {
  return (
    <div className={styles.controlGroup}>
      <span className={styles.controlLabel}>{label}</span>

      <div className={styles.segmented}>
        {options.map((option) => (
          <button
            key={option}
            type='button'
            className={styles.control}
            data-active={value === option || undefined}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function NativeButtonDemo() {
  const [appearance, setAppearance] = useState<Appearance>('solid');
  const [color, setColor] = useState<Color>('primary');
  const [size, setSize] = useState<Size>('md');
  const [shape, setShape] = useState<Shape>('pill');
  const [state, setState] = useState<State>('default');

  return (
    <ComponentPlayground
      controls={
        <div className={styles.controls}>
          <ControlGroup
            label='Appearance'
            value={appearance}
            options={appearances}
            onChange={setAppearance}
          />

          <ControlGroup
            label='Color'
            value={color}
            options={colors}
            onChange={setColor}
          />

          <ControlGroup
            label='Size'
            value={size}
            options={sizes}
            onChange={setSize}
          />

          <ControlGroup
            label='Shape'
            value={shape}
            options={shapes}
            onChange={setShape}
          />

          <ControlGroup
            label='State'
            value={state}
            options={states}
            onChange={setState}
          />
        </div>
      }
    >
      <Button
        appearance={appearance}
        color={color}
        size={size}
        shape={shape}
        disabled={state === 'disabled'}
        loading={state === 'loading'}
        loadingText='Loading'
      >
        Button
      </Button>
    </ComponentPlayground>
  );
}
