'use client';

import type { ReactNode } from 'react';

import styles from '../../demos/ButtonPlayground/ButtonPlayground.module.css';

type PlaygroundControlGroupProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

export function PlaygroundControlGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: PlaygroundControlGroupProps<T>) {
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

type PlaygroundToggleProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function PlaygroundToggle({
  label,
  checked,
  onChange,
}: PlaygroundToggleProps) {
  return (
    <button
      type='button'
      className={styles.control}
      data-active={checked || undefined}
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
    >
      {label}
    </button>
  );
}

type PlaygroundTextInputProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export function PlaygroundTextInput({
  label,
  value,
  placeholder,
  onChange,
}: PlaygroundTextInputProps) {
  return (
    <label className={styles.controlGroup}>
      <span className={styles.controlLabel}>{label}</span>

      <input
        className={styles.textInput}
        type='text'
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

type PlaygroundNumberInputProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
};

export function PlaygroundNumberInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: PlaygroundNumberInputProps) {
  return (
    <label className={styles.controlGroup}>
      <span className={styles.controlLabel}>{label}</span>

      <input
        className={styles.textInput}
        type='number'
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

type PlaygroundOptionsProps = {
  label?: string;
  children: ReactNode;
};

export function PlaygroundOptions({
  label = 'Options',
  children,
}: PlaygroundOptionsProps) {
  return (
    <div className={styles.controlGroup}>
      <span className={styles.controlLabel}>{label}</span>

      <div className={styles.segmented}>{children}</div>
    </div>
  );
}

type PlaygroundControlsProps = {
  children: ReactNode;
};

export function PlaygroundControls({ children }: PlaygroundControlsProps) {
  return <div className={styles.controls}>{children}</div>;
}

export type PlaygroundSelectControl<T extends Record<string, unknown>> = {
  type: 'select';
  key: keyof T;
  label: string;
  options: readonly string[];
};

export type PlaygroundToggleControl<T extends Record<string, unknown>> = {
  type: 'toggle';
  key: keyof T;
  label: string;
  group?: string;
};

export type PlaygroundTextControl<T extends Record<string, unknown>> = {
  type: 'text';
  key: keyof T;
  label: string;
  placeholder?: string;
};

export type PlaygroundNumberControl<T extends Record<string, unknown>> = {
  type: 'number';
  key: keyof T;
  label: string;
  min?: number;
  max?: number;
  step?: number;
};

export type PlaygroundControl<T extends Record<string, unknown>> =
  | PlaygroundSelectControl<T>
  | PlaygroundToggleControl<T>
  | PlaygroundTextControl<T>
  | PlaygroundNumberControl<T>;

type PlaygroundControlsFromSchemaProps<T extends Record<string, unknown>> = {
  value: T;
  controls: readonly PlaygroundControl<T>[];
  onChange: <K extends keyof T>(key: K, value: T[K]) => void;
};

export function PlaygroundControlsFromSchema<
  T extends Record<string, unknown>,
>({ value, controls, onChange }: PlaygroundControlsFromSchemaProps<T>) {
  const selectControls = controls.filter(
    (control) => control.type === 'select'
  );

  const toggleGroups = new Map<string, PlaygroundToggleControl<T>[]>();

  for (const control of controls) {
    if (control.type !== 'toggle') {
      continue;
    }

    const group = control.group ?? 'Options';
    const current = toggleGroups.get(group) ?? [];

    current.push(control);
    toggleGroups.set(group, current);
  }

  return (
    <PlaygroundControls>
      {selectControls.map((control) => (
        <PlaygroundControlGroup
          key={String(control.key)}
          label={control.label}
          value={String(value[control.key])}
          options={control.options}
          onChange={(nextValue) =>
            onChange(control.key, nextValue as T[typeof control.key])
          }
        />
      ))}

      {controls
        .filter((control) => control.type === 'text')
        .map((control) => (
          <PlaygroundTextInput
            key={String(control.key)}
            label={control.label}
            value={String(value[control.key] ?? '')}
            placeholder={control.placeholder}
            onChange={(nextValue) =>
              onChange(control.key, nextValue as T[typeof control.key])
            }
          />
        ))}

      {controls
        .filter((control) => control.type === 'number')
        .map((control) => (
          <PlaygroundNumberInput
            key={String(control.key)}
            label={control.label}
            value={Number(value[control.key] ?? 0)}
            min={control.min}
            max={control.max}
            step={control.step}
            onChange={(nextValue) =>
              onChange(control.key, nextValue as T[typeof control.key])
            }
          />
        ))}

      {[...toggleGroups.entries()].map(([group, toggles]) => (
        <PlaygroundOptions key={group} label={group}>
          {toggles.map((control) => (
            <PlaygroundToggle
              key={String(control.key)}
              label={control.label}
              checked={Boolean(value[control.key])}
              onChange={(checked) =>
                onChange(control.key, checked as T[typeof control.key])
              }
            />
          ))}
        </PlaygroundOptions>
      ))}
    </PlaygroundControls>
  );
}
