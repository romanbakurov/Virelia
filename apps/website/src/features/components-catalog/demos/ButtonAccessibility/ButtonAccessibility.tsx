'use client';

import type { ComponentPlatform } from '../../types';

import { ComponentAccessibility } from '../../components/ComponentAccessibility';

type ButtonAccessibilityProps = {
  platform: ComponentPlatform;
};

export function ButtonAccessibility({ platform }: ButtonAccessibilityProps) {
  const reactItems = [
    {
      title: 'Disabled state',
      description:
        'Disabled controls should remain identifiable while preventing interaction.',
    },
    {
      title: 'Keyboard and focus',
      description:
        'Preserve expected keyboard interaction and visible focus behavior.',
    },
  ] as const;

  const nativeItems = [
    {
      title: 'Disabled state',
      description:
        'Disabled controls should remain identifiable while preventing interaction.',
    },
    {
      title: 'Keyboard and focus',
      description:
        'Verify focus and screen reader interaction on supported React Native platforms.',
    },
  ] as const;

  return (
    <ComponentAccessibility
      items={platform === 'react' ? reactItems : nativeItems}
    />
  );
}
