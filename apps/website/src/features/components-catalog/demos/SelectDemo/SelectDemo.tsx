'use client';

import { Select } from '@vellira-ui/react';

import { SelectPlayground } from '../SelectPlayground';

export function SelectDemo() {
  return (
    <SelectPlayground
      renderSelect={(value) => (
        <Select
          placeholder={value.placeholder || undefined}
          size={value.size}
          color={value.color}
          variant={value.variant}
          invalid={value.invalid}
          loading={value.loading}
          clearable={value.clearable}
          searchable={value.searchable}
          error={value.error || undefined}
          disabled={value.disabled}
          label='Favorite framework'
          description='Choose one option.'
        >
          <Select.Item value='react'>React</Select.Item>
          <Select.Item value='vue'>Vue</Select.Item>
          <Select.Item value='svelte'>Svelte</Select.Item>
        </Select>
      )}
    />
  );
}
