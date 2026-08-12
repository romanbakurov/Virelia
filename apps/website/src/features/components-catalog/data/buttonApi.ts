import type { ComponentApiProp } from '../components/ComponentApi';

const sharedButtonApi: readonly ComponentApiProp[] = [
  {
    name: 'color',
    type: "'primary' | 'neutral' | 'success' | 'warning' | 'danger'",
    defaultValue: "'primary'",
    description: 'Visual tone for the button action.',
  },
  {
    name: 'appearance',
    type: "'solid' | 'outline' | 'ghost' | 'soft' | 'link'",
    defaultValue: "'solid'",
    description: 'Visual style for the button surface.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    defaultValue: "'md'",
    description: 'Controls the overall button size.',
  },
  {
    name: 'shape',
    type: "'square' | 'rounded' | 'pill'",
    defaultValue: "'pill'",
    description: 'Controls the button corner shape.',
  },
  {
    name: 'fullWidth',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Makes the button fill the available container width.',
  },
  {
    name: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Shows a loading state and disables interaction.',
  },
  {
    name: 'loadingText',
    type: 'string',
    description: 'Replaces visible button content while loading.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Disables button interaction.',
  },
  {
    name: 'iconOnly',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Renders the button as an icon-only action.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Visible button content.',
  },
  {
    name: 'iconStart',
    type: 'ReactNode',
    description: 'Icon rendered before the button content.',
  },
  {
    name: 'iconEnd',
    type: 'ReactNode',
    description: 'Icon rendered after the button content.',
  },
  {
    name: 'badge',
    type: 'ReactNode',
    description: 'Compact badge rendered after the label.',
  },
  {
    name: 'shortcut',
    type: 'ReactNode',
    description: 'Keyboard shortcut hint rendered after the label.',
  },
];

const reactButtonApi: readonly ComponentApiProp[] = [
  ...sharedButtonApi,
  {
    name: 'spinner',
    type: 'ReactNode',
    description: 'Custom loading indicator rendered while loading.',
  },
  {
    name: 'tooltip',
    type: 'string',
    description: 'HTML title tooltip text for the button or composed child.',
  },
  {
    name: 'asChild',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Composes Button behavior and styling onto a single child element.',
  },
  {
    name: 'href',
    type: 'string',
    description: 'Renders the button as a link when provided.',
  },
  {
    name: 'target',
    type: 'HTMLAnchorElement target',
    description: 'Controls where a linked button opens.',
  },
  {
    name: 'rel',
    type: 'string',
    description: 'Relationship metadata for linked buttons.',
  },
  {
    name: 'download',
    type: 'HTMLAnchorElement download',
    description: 'Enables download behavior for linked buttons.',
  },
];

const nativeButtonApi: readonly ComponentApiProp[] = [
  ...sharedButtonApi.map((prop) => {
    if (prop.name === 'iconStart' || prop.name === 'iconEnd') {
      return {
        ...prop,
        type: 'ButtonIconElement',
      };
    }

    return prop;
  }),
  {
    name: 'iconSize',
    type: 'number',
    description: 'Overrides the size-derived icon size in pixels.',
  },
  {
    name: 'onPress',
    type: '(event: GestureResponderEvent) => void',
    description: 'Called when the user presses the button.',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Extra styles applied to the button root.',
  },
  {
    name: 'textStyle',
    type: 'StyleProp<TextStyle>',
    description: 'Extra styles applied to the button label.',
  },
  {
    name: 'accessibilityLabel',
    type: 'string',
    description: 'Accessible label used by screen readers.',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Identifier used by automated tests.',
  },
];

export const buttonApi = {
  react: reactButtonApi,
  'react-native': nativeButtonApi,
} as const;
