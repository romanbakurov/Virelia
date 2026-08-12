'use client';

import type { ComponentPlatform } from '../../types';

import { ComponentAccessibility } from '../../components/ComponentAccessibility';

type CheckboxAccessibilityProps = {
  platform: ComponentPlatform;
};

export function CheckboxAccessibility({
  platform,
}: CheckboxAccessibilityProps) {
  const reactItems = [
    {
      title: 'Accessible usage',
      description:
        'Review semantic markup, keyboard interaction, and accessible naming for this component.',
    },
  ] as const;

  const nativeItems = [
    {
      title: 'Accessible usage',
      description:
        'Review React Native accessibility semantics and labels for this component.',
    },
  ] as const;

  return (
    <ComponentAccessibility
      items={platform === 'react' ? reactItems : nativeItems}
    />
  );
}
