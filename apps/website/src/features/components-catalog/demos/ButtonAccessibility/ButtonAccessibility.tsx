'use client';

import type { ComponentPlatform } from '../../types';

import { ComponentAccessibility } from '../../components/ComponentAccessibility';

type ButtonAccessibilityProps = {
  platform: ComponentPlatform;
};

export function ButtonAccessibility({ platform }: ButtonAccessibilityProps) {
  const reactItems = [
    {
      title: 'Accessible names',
      description: (
        <>
          Icon-only buttons should provide an <code>aria-label</code> or
          <code> aria-labelledby</code> so assistive technologies can identify
          the action.
        </>
      ),
    },
    {
      title: 'Disabled and loading states',
      description: (
        <>
          Loading buttons expose busy and disabled semantics and prevent
          duplicate interaction while an action is pending.
        </>
      ),
    },
    {
      title: 'Keyboard interaction',
      description:
        'Buttons remain reachable and operable through standard keyboard interaction when enabled.',
    },
    {
      title: 'Links and actions',
      description: (
        <>
          Use <code>href</code> for navigation and regular button behavior for
          in-place actions.
        </>
      ),
    },
  ] as const;

  const nativeItems = [
    {
      title: 'Accessible names',
      description: (
        <>
          Icon-only buttons should provide an <code>accessibilityLabel</code> so
          screen readers can announce the action.
        </>
      ),
    },
    {
      title: 'Disabled and loading states',
      description:
        'Loading and disabled buttons expose the corresponding accessibility state and block repeated presses.',
    },
    {
      title: 'Press interaction',
      description: (
        <>
          Use <code>onPress</code> for actions and preserve a clear accessible
          label for controls without visible text.
        </>
      ),
    },
    {
      title: 'Platform behavior',
      description:
        'The native implementation uses React Native accessibility semantics while keeping the same visual system as the React Button.',
    },
  ] as const;

  return (
    <ComponentAccessibility
      items={platform === 'react' ? reactItems : nativeItems}
    />
  );
}
