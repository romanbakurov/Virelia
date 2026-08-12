'use client';

import type { ComponentPlatform } from '../../types';

import { ComponentAccessibility } from '../../components/ComponentAccessibility';

type InputAccessibilityProps = {
  platform: ComponentPlatform;
};

export function InputAccessibility({ platform }: InputAccessibilityProps) {
  const reactItems = [
    {
      title: 'Accessible naming',
      description:
        'Provide a visible label or another accessible name that clearly identifies the control.',
    },
    {
      title: 'Disabled state',
      description:
        'Disabled controls should remain identifiable while preventing interaction.',
    },
    {
      title: 'Validation feedback',
      description:
        'Associate validation feedback with the control and expose its invalid state to assistive technologies.',
    },
    {
      title: 'Required fields',
      description:
        'Required state should be communicated semantically and not rely only on visual styling.',
    },
  ] as const;

  const nativeItems = [
    {
      title: 'Accessible naming',
      description:
        'Provide a visible label or accessibilityLabel so screen readers can identify the control.',
    },
    {
      title: 'Disabled state',
      description:
        'Disabled controls should remain identifiable while preventing interaction.',
    },
    {
      title: 'Validation feedback',
      description:
        'Expose validation feedback through accessible text or hints and preserve the invalid state for assistive technologies.',
    },
    {
      title: 'Required fields',
      description:
        'Required state should be communicated semantically and not rely only on visual styling.',
    },
  ] as const;

  return (
    <ComponentAccessibility
      items={platform === 'react' ? reactItems : nativeItems}
    />
  );
}
