'use client';

import type { ComponentPlatform } from '../../types';

import { ComponentAccessibility } from '../../components/ComponentAccessibility';

type SelectAccessibilityProps = {
  platform: ComponentPlatform;
};

export function SelectAccessibility({ platform }: SelectAccessibilityProps) {
  const reactItems = [
    {
      title: 'Accessible naming',
      description:
        'Provide a visible label or another accessible name for the select trigger.',
      props: ['label', 'description'],
    },
    {
      title: 'Keyboard interaction',
      description:
        'Preserve expected keyboard navigation, focus management, and option selection behavior.',
      props: ['open', 'defaultOpen', 'searchable'],
    },
    {
      title: 'Selection state',
      description:
        'Keep selected values and expanded state synchronized with the visual interface.',
      props: ['value', 'defaultValue', 'multiple'],
    },
    {
      title: 'Validation feedback',
      description:
        'Associate validation feedback with the control and expose invalid and required state.',
      props: ['error', 'invalid', 'required', 'disabled'],
    },
  ] as const;

  const nativeItems = [
    {
      title: 'Accessible naming',
      description:
        'Provide a visible label or accessibilityLabel so screen readers can identify the control.',
      props: ['label', 'accessibilityLabel', 'accessibilityHint'],
    },
    {
      title: 'Screen reader interaction',
      description:
        'Expose expanded, selected, disabled, and busy state through React Native accessibility semantics.',
      props: ['value', 'multiple', 'disabled', 'loading'],
    },
    {
      title: 'Search and selection',
      description:
        'Keep search, active option, and selected values understandable when using assistive technologies.',
      props: ['searchable', 'searchPlaceholder', 'multiple'],
    },
    {
      title: 'Validation feedback',
      description:
        'Expose validation errors and required state without relying only on visual styling.',
      props: ['error', 'invalid', 'required'],
    },
  ] as const;

  return (
    <ComponentAccessibility
      items={platform === 'react' ? reactItems : nativeItems}
    />
  );
}
