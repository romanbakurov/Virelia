'use client';

import { Radio as ReactRadio } from '@vellira-ui/react';
import { Radio as NativeRadio } from '@vellira-ui/react-native';

import { ComponentExamples } from '../../components/ComponentExamples';
import type { ComponentPlatform } from '../../types';

type RadioExamplesProps = {
  platform: ComponentPlatform;
};

export function RadioExamples({ platform }: RadioExamplesProps) {
  const reactExamples = [
    {
      title: 'Basic',
      description: 'Basic component usage.',
      preview: (
        <ReactRadio
          value='option'
          label='Email notifications'
          description='Receive updates by email.'
        />
      ),
      code: "import { Radio } from '@vellira-ui/react';\n\n<Radio\n  value=\"option\"\n  label='Email notifications'\n  description='Receive updates by email.'\n/>",
    },
    {
      title: 'Disabled',
      description: 'Disabled state.',
      preview: (
        <ReactRadio
          value='option'
          label='Email notifications'
          description='Receive updates by email.'
          disabled
        />
      ),
      code: "import { Radio } from '@vellira-ui/react';\n\n<Radio\n  value=\"option\"\n  label='Email notifications'\n  description='Receive updates by email.'\n  disabled\n/>",
    },
    {
      title: 'Selected',
      description: 'Selected state.',
      preview: (
        <ReactRadio
          value='option'
          label='Email notifications'
          description='Receive updates by email.'
          checked
        />
      ),
      code: "import { Radio } from '@vellira-ui/react';\n\n<Radio\n  value=\"option\"\n  label='Email notifications'\n  description='Receive updates by email.'\n  checked\n/>",
    },
    {
      title: 'Error',
      description: 'Validation error state.',
      preview: (
        <ReactRadio
          value='option'
          label='Email notifications'
          description='Receive updates by email.'
          error='Please review this option.'
        />
      ),
      code: "import { Radio } from '@vellira-ui/react';\n\n<Radio\n  value=\"option\"\n  label='Email notifications'\n  description='Receive updates by email.'\n  error='Please review this option.'\n/>",
    },
  ] as const;

  const nativeExamples = [
    {
      title: 'Basic',
      description: 'Basic component usage.',
      preview: (
        <NativeRadio
          value='option'
          label='Email notifications'
          description='Receive updates by email.'
        />
      ),
      code: "import { Radio } from '@vellira-ui/react-native';\n\n<Radio\n  value=\"option\"\n  label='Email notifications'\n  description='Receive updates by email.'\n/>",
    },
    {
      title: 'Disabled',
      description: 'Disabled state.',
      preview: (
        <NativeRadio
          value='option'
          label='Email notifications'
          description='Receive updates by email.'
          disabled
        />
      ),
      code: "import { Radio } from '@vellira-ui/react-native';\n\n<Radio\n  value=\"option\"\n  label='Email notifications'\n  description='Receive updates by email.'\n  disabled\n/>",
    },
    {
      title: 'Selected',
      description: 'Selected state.',
      preview: (
        <NativeRadio
          value='option'
          label='Email notifications'
          description='Receive updates by email.'
          checked
        />
      ),
      code: "import { Radio } from '@vellira-ui/react-native';\n\n<Radio\n  value=\"option\"\n  label='Email notifications'\n  description='Receive updates by email.'\n  checked\n/>",
    },
    {
      title: 'Error',
      description: 'Validation error state.',
      preview: (
        <NativeRadio
          value='option'
          label='Email notifications'
          description='Receive updates by email.'
          error='Please review this option.'
        />
      ),
      code: "import { Radio } from '@vellira-ui/react-native';\n\n<Radio\n  value=\"option\"\n  label='Email notifications'\n  description='Receive updates by email.'\n  error='Please review this option.'\n/>",
    },
  ] as const;

  return (
    <ComponentExamples
      items={platform === 'react' ? reactExamples : nativeExamples}
    />
  );
}
