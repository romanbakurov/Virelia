import { defineComponentPageMetadata } from '../../metadata';

export default defineComponentPageMetadata({
  react: {
    children: `<Popover.Trigger>Open popover</Popover.Trigger>
<Popover.Content>
  <Popover.Title>Details</Popover.Title>
  <Popover.Description>Contextual information for this control.</Popover.Description>
</Popover.Content>`,
  },
  native: {
    children: `<Popover.Trigger asChild>
  <NativeButton>Open popover</NativeButton>
</Popover.Trigger>
<Popover.Content>
  <Popover.Title>Details</Popover.Title>
  <Popover.Description>Contextual information for this control.</Popover.Description>
</Popover.Content>`,
    imports: [
      `import { Button as NativeButton } from '@vellira-ui/react-native';`,
    ],
  },
  defaults: {
    shared: {
      side: 'bottom',
      align: 'center',
      sideOffset: 8,
      avoidCollisions: true,
      modal: false,
    },
    react: {
      portal: true,
      strategy: 'absolute',
    },
  },
  examples: [
    {
      title: 'Basic',
      description: 'Floating contextual content.',
      props: [],
      nativeImports: [
        `import { Button as NativeButton } from '@vellira-ui/react-native';`,
      ],
    },
    {
      title: 'Top aligned',
      description: 'Alternative content placement.',
      props: [`side='top'`, `align='start'`],
      nativeImports: [
        `import { Button as NativeButton } from '@vellira-ui/react-native';`,
      ],
    },
    {
      title: 'Modal',
      description: 'Modal interaction semantics.',
      props: ['modal'],
      nativeImports: [
        `import { Button as NativeButton } from '@vellira-ui/react-native';`,
      ],
    },
  ],
  api: {
    sections: [
      { name: 'Popover.Trigger', exportName: 'PopoverTriggerProps' },
      { name: 'Popover.Content', exportName: 'PopoverContentProps' },
      { name: 'Popover.Title', exportName: 'PopoverTitleProps' },
      { name: 'Popover.Description', exportName: 'PopoverDescriptionProps' },
      { name: 'Popover.Close', exportName: 'PopoverCloseProps' },
      { name: 'Popover.Arrow', exportName: 'PopoverArrowProps' },
      { name: 'Popover.Anchor', exportName: 'PopoverAnchorProps' },
    ],
  },
  accessibility: {
    react: [
      {
        title: 'Trigger relationship',
        description:
          'Use trigger content and popover title or description to clarify the relationship.',
        props: ['children', 'open', 'onOpenChange'],
      },
      {
        title: 'Dismissal and focus',
        description:
          'Keep focus and dismissal predictable when content contains interactive controls.',
        props: ['modal', 'side', 'align'],
      },
    ],
    native: [
      {
        title: 'Context announcement',
        description:
          'Use title and description content so screen readers can identify popover purpose.',
        props: ['children'],
      },
      {
        title: 'Placement',
        description:
          'Choose placement that keeps content near its trigger without obscuring controls.',
        props: ['side', 'align'],
      },
    ],
  },
  related: ['button', 'tooltip', 'modal'],
});
