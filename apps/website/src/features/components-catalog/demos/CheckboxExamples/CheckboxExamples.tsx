'use client';

import { Checkbox as ReactCheckbox } from '@vellira-ui/react';
import { Checkbox as NativeCheckbox } from '@vellira-ui/react-native';

import { ComponentExamples } from '../../components/ComponentExamples';
import type { ComponentPlatform } from '../../types';

type CheckboxExamplesProps = {
  platform: ComponentPlatform;
};

export function CheckboxExamples({ platform }: CheckboxExamplesProps) {
  const reactExamples = [
    {
      title: 'Basic',
      description: 'Basic React example.',
      preview: <ReactCheckbox label='Accept terms' />,
      code: `import { Checkbox } from '@vellira-ui/react';

<Checkbox />`,
    },
  ] as const;

  const nativeExamples = [
    {
      title: 'Basic',
      description: 'Basic React Native example.',
      preview: <NativeCheckbox label='Accept terms' />,
      code: `import { Checkbox } from '@vellira-ui/react-native';

<Checkbox />`,
    },
  ] as const;

  return (
    <ComponentExamples
      items={platform === 'react' ? reactExamples : nativeExamples}
    />
  );
}
