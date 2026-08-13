import { defineComponentPageMetadata } from '../../metadata';

const nativeImports = [
  `import { Text as NativeText, View as NativeView } from 'react-native';`,
] as const;

const nativeTriggerChildren = `<Tooltip.Trigger>
  <NativeView
    style={{
      padding: 12,
      borderRadius: 8,
      backgroundColor: '#eee',
    }}
  >
    <NativeText>Press and hold</NativeText>
  </NativeView>
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
      nativeChildren: `<Tooltip.Trigger>
  <NativeView
    style={{
      padding: 12,
      borderRadius: 8,
      backgroundColor: '#eee',
    }}
  >
    <NativeText>No arrow</NativeText>
  </NativeView>
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
