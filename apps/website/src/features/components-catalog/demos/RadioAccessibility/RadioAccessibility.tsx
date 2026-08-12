'use client';

import type { ComponentPlatform } from '../../types';

import { ComponentAccessibility } from '../../components/ComponentAccessibility';

type RadioAccessibilityProps = {
  platform: ComponentPlatform;
};

export function RadioAccessibility({ platform }: RadioAccessibilityProps) {
  const reactItems = [
    {
      title: 'Accessible naming',
      description:
        'Provide a visible label or another accessible name that clearly identifies the control.',
    },
    {
      title: 'State communication',
      description:
        'Expose the current interactive state through the appropriate native semantics and keep it synchronized with the visual state.',
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
  ] as const;

  const nativeItems = [
    {
      title: 'Accessible naming',
      description:
        'Provide a visible label or accessibilityLabel so screen readers can identify the control.',
    },
    {
      title: 'State communication',
      description:
        'Expose the current interactive state through React Native accessibilityState and keep it synchronized with the visual state.',
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
  ] as const;

  return (
    <ComponentAccessibility
      items={platform === 'react' ? reactItems : nativeItems}
    />
  );
}
