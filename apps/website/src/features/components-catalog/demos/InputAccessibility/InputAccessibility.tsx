'use client';

import type { ComponentPlatform } from '../../types';

import { ComponentAccessibility } from '../../components/ComponentAccessibility';

type InputAccessibilityProps = {
  platform: ComponentPlatform;
};

export function InputAccessibility({ platform }: InputAccessibilityProps) {
  const reactItems = [
    {
      title: 'Labels and descriptions',
      description: (
        <>
          Provide a visible <code>label</code> whenever possible. Supporting
          <code> description</code> and <code>error</code> text are associated
          with the input so assistive technologies can announce the field
          context.
        </>
      ),
    },
    {
      title: 'Invalid and required states',
      description: (
        <>
          Use <code>required</code> for required fields and <code>invalid</code>
          or <code>error</code> to expose invalid state with the corresponding
          accessibility semantics.
        </>
      ),
    },
    {
      title: 'Disabled and read-only',
      description: (
        <>
          <code>disabled</code> prevents interaction, while{' '}
          <code>readOnly</code>
          keeps the field focusable and preserves its value semantics.
        </>
      ),
    },
    {
      title: 'Clear and password actions',
      description:
        'Clear and password visibility controls expose accessible action labels while remaining keyboard operable.',
    },
  ] as const;

  const nativeItems = [
    {
      title: 'Labels and descriptions',
      description:
        'Provide clear field labels and supporting text so screen readers can understand the purpose and context of the input.',
    },
    {
      title: 'Invalid and required states',
      description:
        'Required and invalid states are exposed through React Native accessibility semantics while preserving the shared visual treatment.',
    },
    {
      title: 'Disabled and read-only',
      description:
        'Disabled inputs block editing, while read-only inputs preserve the displayed value without allowing changes.',
    },
    {
      title: 'Clear and password actions',
      description:
        'Clear and password visibility actions preserve accessible labels and native interaction behavior.',
    },
  ] as const;

  return (
    <ComponentAccessibility
      items={platform === 'react' ? reactItems : nativeItems}
    />
  );
}
