import { defineComponentPageMetadata } from '../../metadata';

export default defineComponentPageMetadata({
  react: {
    children: 'Add item',
    demoProps: `iconStart={<Plus />}
aria-label='Add item'`,
    imports: [`import { Plus } from '@vellira-ui/icons';`],
  },
  native: {
    children: 'Add item',
    demoProps: `iconStart={<Plus />}
accessibilityLabel='Add item'`,
    imports: [`import { Plus } from '@vellira-ui/icons';`],
  },
  demo: {
    initialValues: {
      color: 'primary',
      appearance: 'solid',
      size: 'md',
      shape: 'pill',
      fullWidth: false,
      loading: false,
      disabled: false,
      iconOnly: false,
    },
  },

  defaults: {
    shared: {
      color: 'primary',
      appearance: 'solid',
      size: 'md',
      shape: 'pill',
      fullWidth: false,
      loading: false,
      disabled: false,
      iconOnly: false,
    },

    react: {
      asChild: false,
    },
  },

  examples: [
    {
      title: 'Basic',
      description: 'Primary action button.',
      props: [],
    },
    {
      title: 'Appearance and color',
      description: 'Alternative surface and semantic action tone.',
      props: [`appearance='outline'`, `color='danger'`],
    },
    {
      title: 'Icons',
      description: 'Icons clarify the action without replacing the label.',
      imports: [`import { ArrowRight } from '@vellira-ui/icons';`],
      props: ['iconEnd={<ArrowRight />}'],
    },
    {
      title: 'Icon-only',
      description: 'Compact action with an accessible name.',
      props: ['iconOnly'],
      reactChildren: '',
      nativeChildren: '',
    },
    {
      title: 'Loading',
      description: 'Shows progress and prevents interaction.',
      props: ['loading', `loadingText='Saving...'`],
    },
    {
      title: 'Disabled',
      description: 'Disabled action state.',
      props: ['disabled'],
    },
    {
      title: 'Full width',
      description: 'Button expands to fill its container.',
      props: ['fullWidth'],
    },
    {
      title: 'Size and shape',
      description: 'Large rounded button treatment.',
      props: [`size='lg'`, `shape='rounded'`],
    },
    {
      title: 'Composed link',
      description: 'Composes button styling onto a custom React link.',
      props: ['asChild'],
      reactChildren: `<a href='/components/button'>Button</a>`,
      platforms: ['react'],
    },
    {
      title: 'Press handler',
      description: 'Handles native press interaction.',
      props: [],
      nativeProps: ['onPress={() => {}}'],
      platforms: ['react-native'],
    },
  ],

  accessibility: {
    react: [
      {
        title: 'Accessible names',
        description:
          'Use visible text for normal buttons and aria-label or aria-labelledby for icon-only actions.',
        props: ['children', 'iconOnly', 'aria-label', 'aria-labelledby'],
      },
      {
        title: 'Loading and disabled state',
        description:
          'Loading buttons expose busy state and prevent interaction while preserving the button label.',
        props: ['loading', 'loadingText', 'disabled'],
      },
      {
        title: 'Composed semantics',
        description:
          'When using asChild, pass semantic attributes and href to the child element.',
        props: ['asChild', 'href', 'type'],
      },
    ],
    native: [
      {
        title: 'Accessible names',
        description:
          'Use visible text for normal buttons and accessibilityLabel for icon-only actions.',
        props: ['children', 'iconOnly', 'accessibilityLabel'],
      },
      {
        title: 'Loading and disabled state',
        description:
          'Loading buttons announce disabled interaction through React Native accessibility state.',
        props: ['loading', 'loadingText', 'disabled'],
      },
      {
        title: 'Press handling',
        description:
          'Keep onPress actions predictable and provide an accessibilityHint when the result is not obvious.',
        props: ['onPress', 'accessibilityHint'],
      },
    ],
  },

  related: ['input', 'checkbox', 'modal'],
});
