import { defineComponentPageMetadata } from '../../metadata';

export default defineComponentPageMetadata({
  react: {
    children: `<Popover.Trigger asChild>
  <ReactButton>Open popover</ReactButton>
</Popover.Trigger>
<Popover.Content>
  <Popover.Arrow />
  <Popover.Title>Details</Popover.Title>
  <Popover.Description>Contextual information for this control.</Popover.Description>
</Popover.Content>`,
    imports: [`import { Button as ReactButton } from '@vellira-ui/react';`],
  },
  native: {
    children: `<Popover.Trigger asChild>
  <NativeButton>Open popover</NativeButton>
</Popover.Trigger>
<Popover.Content>
  <Popover.Arrow />
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
  demo: {
    initialValues: {
      open: false,
      modal: false,
    },
    previewWidth: 'field',
  },
  examples: [
    {
      title: 'Basic',
      description: 'Floating contextual content.',
      props: [],
      reactImports: [
        `import { Button as ReactButton } from '@vellira-ui/react';`,
      ],
      nativeImports: [
        `import { Button as NativeButton } from '@vellira-ui/react-native';`,
      ],
    },
    {
      title: 'Placement',
      description: 'Positions content relative to the trigger.',
      props: [`side='top'`, `align='start'`, 'sideOffset={12}'],
      reactImports: [
        `import { Button as ReactButton } from '@vellira-ui/react';`,
      ],
      nativeImports: [
        `import { Button as NativeButton } from '@vellira-ui/react-native';`,
      ],
    },
    {
      title: 'Open change handler',
      description: 'Observes popover visibility from application state.',
      props: ['onOpenChange={() => {}}'],
      reactImports: [
        `import { Button as ReactButton } from '@vellira-ui/react';`,
      ],
      nativeImports: [
        `import { Button as NativeButton } from '@vellira-ui/react-native';`,
      ],
    },
    {
      title: 'Modal',
      description: 'Modal interaction semantics.',
      props: ['modal'],
      reactImports: [
        `import { Button as ReactButton } from '@vellira-ui/react';`,
      ],
      nativeImports: [
        `import { Button as NativeButton } from '@vellira-ui/react-native';`,
      ],
    },
    {
      title: 'Arrow and close action',
      description:
        'Adds an arrow and an explicit close control inside the popover.',
      props: [],
      reactImports: [
        `import { Button as ReactButton } from '@vellira-ui/react';`,
      ],
      reactChildren: `<Popover.Trigger asChild>
  <ReactButton>Open popover</ReactButton>
</Popover.Trigger>
<Popover.Content>
  <Popover.Arrow />
  <Popover.Title>Details</Popover.Title>
  <Popover.Description>Contextual information for this control.</Popover.Description>
  <Popover.Close asChild>
    <ReactButton appearance='outline'>Close</ReactButton>
  </Popover.Close>
</Popover.Content>`,
      nativeChildren: `<Popover.Trigger asChild>
  <NativeButton>Open popover</NativeButton>
</Popover.Trigger>
<Popover.Content>
  <Popover.Arrow />
  <Popover.Title>Details</Popover.Title>
  <Popover.Description>Contextual information for this control.</Popover.Description>
  <Popover.Close asChild>
    <NativeButton>Close</NativeButton>
  </Popover.Close>
</Popover.Content>`,
      nativeImports: [
        `import { Button as NativeButton } from '@vellira-ui/react-native';`,
      ],
    },
    {
      title: 'Separate anchor',
      description:
        'Positions content from an anchor while using a separate trigger.',
      props: [],
      reactImports: [
        `import { Button as ReactButton } from '@vellira-ui/react';`,
      ],
      reactChildren: `<div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  }}
>
  <Popover.Anchor asChild>
    <div
      style={{
        padding: 16,
        border: '1px dashed var(--border-muted)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      Position relative to me
    </div>
  </Popover.Anchor>

  <Popover.Trigger asChild>
    <ReactButton>Toggle popover</ReactButton>
  </Popover.Trigger>
</div>

<Popover.Content>
  <Popover.Arrow />
  <Popover.Title>Separate anchor</Popover.Title>
  <Popover.Description>
    The trigger controls the state, but the content is positioned relative to the anchor.
  </Popover.Description>

  <Popover.Close asChild>
    <ReactButton size='sm' appearance='ghost'>
      Close
    </ReactButton>
  </Popover.Close>
</Popover.Content>`,
      nativeChildren: `<NativeView
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  }}
>
  <Popover.Anchor asChild>
    <NativeView
      style={{
        padding: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#d8d2f0',
        borderRadius: 16,
      }}
    >
      <NativeText>Position relative to me</NativeText>
    </NativeView>
  </Popover.Anchor>

  <Popover.Trigger asChild>
    <NativeButton>Toggle popover</NativeButton>
  </Popover.Trigger>
</NativeView>

<Popover.Content>
  <Popover.Arrow />
  <Popover.Title>Separate anchor</Popover.Title>
  <Popover.Description>
    The trigger controls the state, but the content is positioned relative to the anchor.
  </Popover.Description>

  <Popover.Close asChild>
    <NativeButton size='sm' appearance='ghost'>
      Close
    </NativeButton>
  </Popover.Close>
</Popover.Content>`,
      nativeImports: [
        `import { Button as NativeButton } from '@vellira-ui/react-native';`,
        `import { Text as NativeText, View as NativeView } from 'react-native';`,
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
        props: ['modal', 'side', 'align', 'onOpenChange'],
      },
      {
        title: 'Explicit close controls',
        description:
          'Provide a close action when popover content contains interactive or multi-step content.',
        props: ['children'],
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
      {
        title: 'Explicit close controls',
        description:
          'Use a clearly labelled close action when the popover stays open for task content.',
        props: ['children'],
      },
    ],
  },
  related: ['button', 'tooltip', 'modal'],
});
