'use client';

import { Input as ReactInput } from '@vellira-ui/react';
import { Input as NativeInput } from '@vellira-ui/react-native';

import { ComponentExamples } from '../../components/ComponentExamples';
import type { ComponentPlatform } from '../../types';

type InputExamplesProps = {
  platform: ComponentPlatform;
};

export function InputExamples({ platform }: InputExamplesProps) {
  const reactExamples = [
    {
      title: 'Search',
      description: 'Create a searchable field with a built-in clear action.',
      preview: (
        <ReactInput
          type='search'
          placeholder='Search components'
          clearable
          defaultValue='Button'
        />
      ),
      code: `import { Input } from '@vellira-ui/react';

<Input
  type='search'
  placeholder='Search components'
  clearable
  defaultValue='Button'
/>`,
    },
    {
      title: 'Password',
      description: 'Let users reveal or hide sensitive input when needed.',
      preview: (
        <ReactInput
          type='password'
          placeholder='Enter password'
          revealPassword
        />
      ),
      code: `import { Input } from '@vellira-ui/react';

<Input
  type='password'
  placeholder='Enter password'
  revealPassword
/>`,
    },
    {
      title: 'Validation',
      description:
        'Communicate invalid input with an accessible error message.',
      preview: (
        <ReactInput
          type='email'
          defaultValue='hello@'
          invalid
          error='Enter a valid email address.'
        />
      ),
      code: `import { Input } from '@vellira-ui/react';

<Input
  type='email'
  defaultValue='hello@'
  invalid
  error='Enter a valid email address.'
/>`,
    },
    {
      title: 'Prefix and suffix',
      description: 'Add contextual content inside the input chrome.',
      preview: <ReactInput placeholder='0.00' prefix='$' suffix='USD' />,
      code: `import { Input } from '@vellira-ui/react';

<Input
  placeholder='0.00'
  prefix='$'
  suffix='USD'
/>`,
    },
  ] as const;

  const nativeExamples = [
    {
      title: 'Search',
      description: 'Create a native search field with a clear action.',
      preview: (
        <NativeInput
          type='search'
          placeholder='Search components'
          clearable
          defaultValue='Button'
        />
      ),
      code: `import { Input } from '@vellira-ui/react-native';

<Input
  type='search'
  placeholder='Search components'
  clearable
  defaultValue='Button'
/>`,
    },
    {
      title: 'Loading',
      description: 'Communicate that the field is temporarily processing.',
      preview: (
        <NativeInput
          placeholder='Checking availability'
          defaultValue='vellira'
          loading
        />
      ),
      code: `import { Input } from '@vellira-ui/react-native';

<Input
  placeholder='Checking availability'
  defaultValue='vellira'
  loading
/>`,
    },
    {
      title: 'Validation',
      description: 'Present an invalid native input with an error message.',
      preview: (
        <NativeInput
          type='email'
          defaultValue='hello@'
          invalid
          error='Enter a valid email address.'
        />
      ),
      code: `import { Input } from '@vellira-ui/react-native';

<Input
  type='email'
  defaultValue='hello@'
  invalid
  error='Enter a valid email address.'
/>`,
    },
    {
      title: 'Password',
      description: 'Configure secure text entry for sensitive values.',
      preview: <NativeInput type='password' placeholder='Enter password' />,
      code: `import { Input } from '@vellira-ui/react-native';

<Input
  type='password'
  placeholder='Enter password'
/>`,
    },
  ] as const;

  return (
    <ComponentExamples
      items={platform === 'react' ? reactExamples : nativeExamples}
    />
  );
}
