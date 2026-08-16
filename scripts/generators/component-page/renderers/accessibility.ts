import { toTsString } from '../helpers/format';
import type { ComponentPageMetadata } from '../metadata/metadata';
import type {
  AccessibilityItem,
  ExtractedProp,
  Platform,
} from '../model/types';
import type { ComponentProfile } from '../profiles/profiles';

export function buildAccessibilityItems(params: {
  platform: Platform;
  componentConfig: ComponentPageMetadata;
  componentProfile: ComponentProfile;
  extractedProps: readonly ExtractedProp[];
  reactApiProps: readonly ExtractedProp[];
  nativeApiProps: readonly ExtractedProp[];
}): AccessibilityItem[] {
  const {
    platform,
    componentConfig,
    componentProfile,
    extractedProps,
    reactApiProps,
    nativeApiProps,
  } = params;
  const configuredItems =
    platform === 'react'
      ? componentConfig.accessibility?.react
      : componentConfig.accessibility?.native;

  if (configuredItems) {
    return [...configuredItems];
  }

  const items: AccessibilityItem[] = [];
  const platformProps =
    platform === 'react'
      ? reactApiProps.length > 0
        ? reactApiProps
        : extractedProps
      : nativeApiProps.length > 0
        ? nativeApiProps
        : extractedProps;

  const hasProp = (name: string) =>
    platformProps.some((prop) => prop.name === name);

  const isInteractive =
    hasProp('disabled') ||
    hasProp('checked') ||
    hasProp('selected') ||
    hasProp('open') ||
    hasProp('onPress') ||
    hasProp('onClick') ||
    extractedProps.some((prop) => prop.name.startsWith('on'));

  if (
    componentConfig.demo?.label ||
    hasProp('label') ||
    hasProp('accessibilityLabel')
  ) {
    items.push({
      title: 'Accessible naming',
      description:
        platform === 'react'
          ? 'Provide a visible label or another accessible name that clearly identifies the control.'
          : 'Provide a visible label or accessibilityLabel so screen readers can identify the control.',
      props:
        platform === 'react'
          ? ['label', 'children', 'aria-label', 'aria-labelledby'].filter(
              hasProp
            )
          : ['label', 'children', 'accessibilityLabel'].filter(hasProp),
    });
  }

  if (
    hasProp('checked') ||
    hasProp('selected') ||
    hasProp('open') ||
    hasProp('expanded')
  ) {
    items.push({
      title: 'State communication',
      description:
        platform === 'react'
          ? 'Expose the current interactive state through the appropriate native semantics and keep it synchronized with the visual state.'
          : 'Expose the current interactive state through React Native accessibilityState and keep it synchronized with the visual state.',
      props: ['checked', 'selected', 'open', 'expanded'].filter(hasProp),
    });
  }

  if (hasProp('disabled')) {
    items.push({
      title: 'Disabled state',
      description:
        'Disabled controls should remain identifiable while preventing interaction.',
      props: ['disabled'],
    });
  }

  if (hasProp('error')) {
    items.push({
      title: 'Validation feedback',
      description:
        platform === 'react'
          ? 'Associate validation feedback with the control and expose its invalid state to assistive technologies.'
          : 'Announce validation feedback through accessible text or hints without relying only on visual styling.',
      props: ['error', 'invalid'].filter(hasProp),
    });
  }

  if (hasProp('required')) {
    items.push({
      title: 'Required fields',
      description:
        'Required state should be communicated semantically and not rely only on visual styling.',
      props: ['required'],
    });
  }

  if (isInteractive) {
    items.push({
      title: 'Keyboard and focus',
      description:
        platform === 'react'
          ? 'Preserve expected keyboard interaction and visible focus behavior.'
          : 'Verify focus and screen reader interaction on supported React Native platforms.',
      props: ['onKeyDown', 'onFocus', 'onBlur', 'onPress', 'onClick'].filter(
        hasProp
      ),
    });
  }

  if (items.length === 0) {
    items.push({
      title: 'Accessible usage',
      description:
        platform === 'react'
          ? 'Use semantic markup, accessible naming, and predictable keyboard behavior.'
          : 'Expose meaningful accessibility roles, labels, states, and interaction behavior.',
    });
  }

  if (componentProfile === 'overlay') {
    items.push({
      title: 'Dismissal',
      description:
        platform === 'react'
          ? 'Keep dismissal, focus return, and Escape behavior predictable for overlay interactions.'
          : 'Keep dismissal, back navigation, and screen reader focus predictable for overlay interactions.',
      props: ['open', 'defaultOpen', 'onOpenChange'].filter(hasProp),
    });
  }

  return items;
}

export function renderAccessibility(params: {
  componentName: string;
  reactAccessibilityItems: readonly AccessibilityItem[];
  nativeAccessibilityItems: readonly AccessibilityItem[];
  generatedFileHeader: string;
}) {
  const {
    componentName,
    reactAccessibilityItems,
    nativeAccessibilityItems,
    generatedFileHeader,
  } = params;

  const reactItems = reactAccessibilityItems
    .map(
      (item) => `    {
      title: ${toTsString(item.title)},
      description: ${toTsString(item.description)},${
        item.props?.length
          ? `\n      props: [${item.props.map(toTsString).join(', ')}],`
          : ''
      }
    },`
    )
    .join('\n');

  const nativeItems = nativeAccessibilityItems
    .map(
      (item) => `    {
      title: ${toTsString(item.title)},
      description: ${toTsString(item.description)},${
        item.props?.length
          ? `\n      props: [${item.props.map(toTsString).join(', ')}],`
          : ''
      }
    },`
    )
    .join('\n');

  return `${generatedFileHeader}'use client';

import type { ComponentPlatform } from '../../types';

import { ComponentAccessibility } from '../../shared/ComponentAccessibility';

type ${componentName}AccessibilityProps = {
  platform: ComponentPlatform;
};

export function ${componentName}Accessibility({
  platform,
}: ${componentName}AccessibilityProps) {
  const reactItems = [
${reactItems}
  ] as const;

  const nativeItems = [
${nativeItems}
  ] as const;

  return (
    <ComponentAccessibility
      items={platform === 'react' ? reactItems : nativeItems}
    />
  );
}
`;
}
