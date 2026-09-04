import { defineComponentPageMetadata } from '../../metadata';

const nativeImports = [
  `import { Text as NativeText } from 'react-native';`,
  `import { useTheme } from '@vellira-ui/react-native';`,
  `import { controlSizes } from '@vellira-ui/tokens';`,
] as const;

const nativeTriggerChildren = `<Tooltip.Trigger
  style={{
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: controlSizes.md.height,
    paddingLeft: nativeTheme.tokens.spacing[6],
    paddingRight: nativeTheme.tokens.spacing[6],
    borderRadius: nativeTheme.tokens.radius.full,
    backgroundColor:
      nativeTheme.components.button.primary.solid.default.bg,
  }}
>
  <NativeText
    style={{
      color: nativeTheme.components.button.primary.solid.default.fg,
      fontFamily: nativeTheme.tokens.typography.family.regular,
      fontSize: nativeTheme.tokens.typography.size.md,
      lineHeight: nativeTheme.tokens.typography.lineHeight.md,
    }}
  >
    Press and hold
  </NativeText>
</Tooltip.Trigger>
<Tooltip.Content withArrow>Helpful contextual label.</Tooltip.Content>`;

export default defineComponentPageMetadata({
  react: {
    children: `<Tooltip.Trigger asChild>
  <ReactButton>Hover for details</ReactButton>
</Tooltip.Trigger>
<Tooltip.Content withArrow>Helpful contextual label.</Tooltip.Content>`,
    imports: [`import { Button as ReactButton } from '@vellira-ui/react';`],
  },
  native: {
    children: nativeTriggerChildren,
    imports: nativeImports,
    setup: ['const { theme: nativeTheme } = useTheme();'],
  },
  defaults: {
    shared: {
      placement: 'top',
      disabled: false,
    },
  },
  examples: [
    {
      title: 'Basic',
      description: 'Contextual label for a trigger.',
      props: [],
      reactImports: [
        `import { Button as ReactButton } from '@vellira-ui/react';`,
      ],
      nativeImports,
    },
    {
      title: 'Placement',
      description: 'Alternative tooltip placement.',
      props: [`placement='bottom'`],
      reactImports: [
        `import { Button as ReactButton } from '@vellira-ui/react';`,
      ],
      nativeImports,
    },
    {
      title: 'Disabled',
      description: 'Disabled tooltip behavior.',
      props: ['disabled'],
      reactImports: [
        `import { Button as ReactButton } from '@vellira-ui/react';`,
      ],
      nativeImports,
    },
    {
      title: 'Without arrow',
      description: 'Omits the arrow when a simpler bubble is preferred.',
      props: [],
      reactImports: [
        `import { Button as ReactButton } from '@vellira-ui/react';`,
      ],
      nativeImports,
      reactChildren: `<Tooltip.Trigger asChild>
  <ReactButton>No arrow</ReactButton>
</Tooltip.Trigger>
<Tooltip.Content>Tooltip without arrow</Tooltip.Content>`,
      nativeChildren: `<Tooltip.Trigger
  style={{
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: controlSizes.md.height,
    paddingLeft: nativeTheme.tokens.spacing[6],
    paddingRight: nativeTheme.tokens.spacing[6],
    borderRadius: nativeTheme.tokens.radius.full,
    backgroundColor:
      nativeTheme.components.button.primary.solid.default.bg,
  }}
>
  <NativeText
    style={{
      color: nativeTheme.components.button.primary.solid.default.fg,
      fontFamily: nativeTheme.tokens.typography.family.regular,
      fontSize: nativeTheme.tokens.typography.size.md,
      lineHeight: nativeTheme.tokens.typography.lineHeight.md,
    }}
  >
    No arrow
  </NativeText>
</Tooltip.Trigger>
<Tooltip.Content>Tooltip without arrow</Tooltip.Content>`,
    },
  ],
  api: {
    sections: [
      { name: 'Tooltip.Trigger', exportName: 'TooltipTriggerProps' },
      { name: 'Tooltip.Content', exportName: 'TooltipContentProps' },
    ],
  },
  accessibility: {
    react: [
      {
        title: 'Supplemental text',
        description:
          'Use tooltips for supplemental labels, not as the only way to complete a task.',
        props: ['children', 'disabled'],
      },
      {
        title: 'Delay behavior',
        description:
          'Choose open and close delays that keep hover and focus behavior predictable.',
        props: ['delay', 'onOpenChange'],
      },
    ],
    native: [
      {
        title: 'Supplemental text',
        description:
          'Keep tooltip content concise and make critical information available outside the tooltip.',
        props: ['children', 'disabled'],
      },
      {
        title: 'Placement',
        description:
          'Use placement that keeps the tooltip near its trigger without covering the control.',
        props: ['placement'],
      },
    ],
  },
  related: ['button', 'popover'],
});
