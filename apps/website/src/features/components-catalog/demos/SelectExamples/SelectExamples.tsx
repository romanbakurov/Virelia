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
        />
      ),
      code: 'import { Select } from \'@vellira-ui/react\';\n\n<Select\n  label="Favorite framework"\n  description="Choose one option."\n/>',
    },
    {
      title: 'Disabled',
      description: 'Disabled state.',
      preview: (
        <ReactSelect
          label='Favorite framework'
          description='Choose one option.'
          disabled
        />
      ),
      code: 'import { Select } from \'@vellira-ui/react\';\n\n<Select\n  label="Favorite framework"\n  description="Choose one option."\n  disabled\n/>',
    },
    {
      title: 'Loading',
      description: 'Loading state.',
      preview: (
        <ReactSelect
          label='Favorite framework'
          description='Choose one option.'
          loading
        />
      ),
      code: 'import { Select } from \'@vellira-ui/react\';\n\n<Select\n  label="Favorite framework"\n  description="Choose one option."\n  loading\n/>',
    },
    {
      title: 'Error',
      description: 'Validation error state.',
      preview: (
        <ReactSelect
          label='Favorite framework'
          description='Choose one option.'
          error='Please review this option.'
        />
      ),
      code: 'import { Select } from \'@vellira-ui/react\';\n\n<Select\n  label="Favorite framework"\n  description="Choose one option."\n  error=\'Please review this option.\'\n/>',
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
        />
      ),
      code: 'import { Select } from \'@vellira-ui/react-native\';\n\n<Select\n  label="Favorite framework"\n  description="Choose one option."\n/>',
    },
    {
      title: 'Disabled',
      description: 'Disabled state.',
      preview: (
        <NativeSelect
          label='Favorite framework'
          description='Choose one option.'
          disabled
        />
      ),
      code: 'import { Select } from \'@vellira-ui/react-native\';\n\n<Select\n  label="Favorite framework"\n  description="Choose one option."\n  disabled\n/>',
    },
    {
      title: 'Loading',
      description: 'Loading state.',
      preview: (
        <NativeSelect
          label='Favorite framework'
          description='Choose one option.'
          loading
        />
      ),
      code: 'import { Select } from \'@vellira-ui/react-native\';\n\n<Select\n  label="Favorite framework"\n  description="Choose one option."\n  loading\n/>',
    },
    {
      title: 'Error',
      description: 'Validation error state.',
      preview: (
        <NativeSelect
          label='Favorite framework'
          description='Choose one option.'
          error='Please review this option.'
        />
      ),
      code: 'import { Select } from \'@vellira-ui/react-native\';\n\n<Select\n  label="Favorite framework"\n  description="Choose one option."\n  error=\'Please review this option.\'\n/>',
    },
  ] as const;

  return (
    <ComponentExamples
      items={platform === 'react' ? reactExamples : nativeExamples}
    />
  );
}
