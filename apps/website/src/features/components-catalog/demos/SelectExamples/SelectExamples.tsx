'use client';

import { Select as ReactSelect } from '@vellira-ui/react';
import { Select as NativeSelect } from '@vellira-ui/react-native';

import { ComponentExamples } from '../../components/ComponentExamples';
import type { ComponentPlatform } from '../../types';

type SelectExamplesProps = {
  platform: ComponentPlatform;
};

export function SelectExamples({ platform }: SelectExamplesProps) {
  const reactExamples = [
    {
      title: 'Basic',
      description: 'Basic component usage.',
      preview: (
        <ReactSelect
          label='Favorite framework'
          description='Choose one option.'
        >
          <ReactSelect.Item value='react'>React</ReactSelect.Item>
          <ReactSelect.Item value='vue'>Vue</ReactSelect.Item>
          <ReactSelect.Item value='svelte'>Svelte</ReactSelect.Item>
        </ReactSelect>
      ),
      code: "import { Select } from '@vellira-ui/react';\n\n<Select\n  label='Favorite framework'\n  description='Choose one option.'\n>\n  <Select.Item value='react'>React</Select.Item>\n  <Select.Item value='vue'>Vue</Select.Item>\n  <Select.Item value='svelte'>Svelte</Select.Item>\n</Select>",
    },
    {
      title: 'Searchable',
      description: 'Filter options by typing a search query.',
      preview: (
        <ReactSelect
          label='Favorite framework'
          description='Choose one option.'
          searchable
        >
          <ReactSelect.Item value='react'>React</ReactSelect.Item>
          <ReactSelect.Item value='vue'>Vue</ReactSelect.Item>
          <ReactSelect.Item value='svelte'>Svelte</ReactSelect.Item>
        </ReactSelect>
      ),
      code: "import { Select } from '@vellira-ui/react';\n\n<Select\n  label='Favorite framework'\n  description='Choose one option.'\n  searchable\n>\n  <Select.Item value='react'>React</Select.Item>\n  <Select.Item value='vue'>Vue</Select.Item>\n  <Select.Item value='svelte'>Svelte</Select.Item>\n</Select>",
    },
    {
      title: 'Multiple',
      description: 'Select more than one option.',
      preview: (
        <ReactSelect
          label='Favorite framework'
          description='Choose one option.'
          multiple
        >
          <ReactSelect.Item value='react'>React</ReactSelect.Item>
          <ReactSelect.Item value='vue'>Vue</ReactSelect.Item>
          <ReactSelect.Item value='svelte'>Svelte</ReactSelect.Item>
        </ReactSelect>
      ),
      code: "import { Select } from '@vellira-ui/react';\n\n<Select\n  label='Favorite framework'\n  description='Choose one option.'\n  multiple\n>\n  <Select.Item value='react'>React</Select.Item>\n  <Select.Item value='vue'>Vue</Select.Item>\n  <Select.Item value='svelte'>Svelte</Select.Item>\n</Select>",
    },
    {
      title: 'Error',
      description: 'Validation error state.',
      preview: (
        <ReactSelect
          label='Favorite framework'
          description='Choose one option.'
          error='Please review this option.'
        >
          <ReactSelect.Item value='react'>React</ReactSelect.Item>
          <ReactSelect.Item value='vue'>Vue</ReactSelect.Item>
          <ReactSelect.Item value='svelte'>Svelte</ReactSelect.Item>
        </ReactSelect>
      ),
      code: "import { Select } from '@vellira-ui/react';\n\n<Select\n  label='Favorite framework'\n  description='Choose one option.'\n  error='Please review this option.'\n>\n  <Select.Item value='react'>React</Select.Item>\n  <Select.Item value='vue'>Vue</Select.Item>\n  <Select.Item value='svelte'>Svelte</Select.Item>\n</Select>",
    },
    {
      title: 'Disabled',
      description: 'Disabled select state.',
      preview: (
        <ReactSelect
          label='Favorite framework'
          description='Choose one option.'
          disabled
        >
          <ReactSelect.Item value='react'>React</ReactSelect.Item>
          <ReactSelect.Item value='vue'>Vue</ReactSelect.Item>
          <ReactSelect.Item value='svelte'>Svelte</ReactSelect.Item>
        </ReactSelect>
      ),
      code: "import { Select } from '@vellira-ui/react';\n\n<Select\n  label='Favorite framework'\n  description='Choose one option.'\n  disabled\n>\n  <Select.Item value='react'>React</Select.Item>\n  <Select.Item value='vue'>Vue</Select.Item>\n  <Select.Item value='svelte'>Svelte</Select.Item>\n</Select>",
    },
    {
      title: 'Loading',
      description: 'Loading state while options are being resolved.',
      preview: (
        <ReactSelect
          label='Favorite framework'
          description='Choose one option.'
          loading
        >
          <ReactSelect.Item value='react'>React</ReactSelect.Item>
          <ReactSelect.Item value='vue'>Vue</ReactSelect.Item>
          <ReactSelect.Item value='svelte'>Svelte</ReactSelect.Item>
        </ReactSelect>
      ),
      code: "import { Select } from '@vellira-ui/react';\n\n<Select\n  label='Favorite framework'\n  description='Choose one option.'\n  loading\n>\n  <Select.Item value='react'>React</Select.Item>\n  <Select.Item value='vue'>Vue</Select.Item>\n  <Select.Item value='svelte'>Svelte</Select.Item>\n</Select>",
    },
  ] as const;

  const nativeExamples = [
    {
      title: 'Basic',
      description: 'Basic component usage.',
      preview: (
        <NativeSelect
          label='Favorite framework'
          description='Choose one option.'
        >
          <NativeSelect.Item value='react' label='React' />
          <NativeSelect.Item value='vue' label='Vue' />
          <NativeSelect.Item value='svelte' label='Svelte' />
        </NativeSelect>
      ),
      code: "import { Select } from '@vellira-ui/react-native';\n\n<Select\n  label='Favorite framework'\n  description='Choose one option.'\n>\n  <Select.Item value='react' label='React' />\n  <Select.Item value='vue' label='Vue' />\n  <Select.Item value='svelte' label='Svelte' />\n</Select>",
    },
    {
      title: 'Searchable',
      description: 'Filter options by typing a search query.',
      preview: (
        <NativeSelect
          label='Favorite framework'
          description='Choose one option.'
          searchable
        >
          <NativeSelect.Item value='react' label='React' />
          <NativeSelect.Item value='vue' label='Vue' />
          <NativeSelect.Item value='svelte' label='Svelte' />
        </NativeSelect>
      ),
      code: "import { Select } from '@vellira-ui/react-native';\n\n<Select\n  label='Favorite framework'\n  description='Choose one option.'\n  searchable\n>\n  <Select.Item value='react' label='React' />\n  <Select.Item value='vue' label='Vue' />\n  <Select.Item value='svelte' label='Svelte' />\n</Select>",
    },
    {
      title: 'Multiple',
      description: 'Select more than one option.',
      preview: (
        <NativeSelect
          label='Favorite framework'
          description='Choose one option.'
          multiple
        >
          <NativeSelect.Item value='react' label='React' />
          <NativeSelect.Item value='vue' label='Vue' />
          <NativeSelect.Item value='svelte' label='Svelte' />
        </NativeSelect>
      ),
      code: "import { Select } from '@vellira-ui/react-native';\n\n<Select\n  label='Favorite framework'\n  description='Choose one option.'\n  multiple\n>\n  <Select.Item value='react' label='React' />\n  <Select.Item value='vue' label='Vue' />\n  <Select.Item value='svelte' label='Svelte' />\n</Select>",
    },
    {
      title: 'Error',
      description: 'Validation error state.',
      preview: (
        <NativeSelect
          label='Favorite framework'
          description='Choose one option.'
          error='Please review this option.'
        >
          <NativeSelect.Item value='react' label='React' />
          <NativeSelect.Item value='vue' label='Vue' />
          <NativeSelect.Item value='svelte' label='Svelte' />
        </NativeSelect>
      ),
      code: "import { Select } from '@vellira-ui/react-native';\n\n<Select\n  label='Favorite framework'\n  description='Choose one option.'\n  error='Please review this option.'\n>\n  <Select.Item value='react' label='React' />\n  <Select.Item value='vue' label='Vue' />\n  <Select.Item value='svelte' label='Svelte' />\n</Select>",
    },
    {
      title: 'Disabled',
      description: 'Disabled select state.',
      preview: (
        <NativeSelect
          label='Favorite framework'
          description='Choose one option.'
          disabled
        >
          <NativeSelect.Item value='react' label='React' />
          <NativeSelect.Item value='vue' label='Vue' />
          <NativeSelect.Item value='svelte' label='Svelte' />
        </NativeSelect>
      ),
      code: "import { Select } from '@vellira-ui/react-native';\n\n<Select\n  label='Favorite framework'\n  description='Choose one option.'\n  disabled\n>\n  <Select.Item value='react' label='React' />\n  <Select.Item value='vue' label='Vue' />\n  <Select.Item value='svelte' label='Svelte' />\n</Select>",
    },
    {
      title: 'Loading',
      description: 'Loading state while options are being resolved.',
      preview: (
        <NativeSelect
          label='Favorite framework'
          description='Choose one option.'
          loading
        >
          <NativeSelect.Item value='react' label='React' />
          <NativeSelect.Item value='vue' label='Vue' />
          <NativeSelect.Item value='svelte' label='Svelte' />
        </NativeSelect>
      ),
      code: "import { Select } from '@vellira-ui/react-native';\n\n<Select\n  label='Favorite framework'\n  description='Choose one option.'\n  loading\n>\n  <Select.Item value='react' label='React' />\n  <Select.Item value='vue' label='Vue' />\n  <Select.Item value='svelte' label='Svelte' />\n</Select>",
    },
  ] as const;

  return (
    <ComponentExamples
      items={platform === 'react' ? reactExamples : nativeExamples}
    />
  );
}
