import { defineComponentPageMetadata } from '../../metadata';

const reactTriggerImports = [
  `import { Button as ReactButton, Portal as ReactPortal } from '@vellira-ui/react';`,
] as const;

const nativeTriggerImports = [
  `import { Button as NativeButton } from '@vellira-ui/react-native';`,
] as const;

const reactModalChildren = `<Modal.Trigger asChild>
  <ReactButton>Open modal</ReactButton>
</Modal.Trigger>
<ReactPortal>
  <Modal.Overlay />
  <Modal.Content>
    <Modal.Header>
      <div>
        <Modal.Title>Delete file</Modal.Title>
        <Modal.Description>This action cannot be undone.</Modal.Description>
      </div>
      <Modal.Close />
    </Modal.Header>
    <Modal.Body>Are you sure you want to continue?</Modal.Body>
    <Modal.Footer>
      <Modal.Close asChild>
        <ReactButton color='neutral' appearance='ghost'>Cancel</ReactButton>
      </Modal.Close>
      <ReactButton color='danger'>Delete</ReactButton>
    </Modal.Footer>
  </Modal.Content>
</ReactPortal>`;

const nativeModalChildren = `<Modal.Trigger asChild>
  <NativeButton>Open Modal</NativeButton>
</Modal.Trigger>
<Modal.Overlay>
  <Modal.Content>
    <Modal.Header>
      <Modal.Title>Delete file</Modal.Title>
      <Modal.Description>This action uses the native overlay stack and focus restore.</Modal.Description>
    </Modal.Header>
    <Modal.Body>Are you sure you want to continue?</Modal.Body>
    <Modal.Footer>
      <Modal.Close>
        <NativeButton color='neutral' appearance='solid'>Cancel</NativeButton>
      </Modal.Close>
      <Modal.Close>
        <NativeButton color='danger' appearance='solid'>Delete</NativeButton>
      </Modal.Close>
    </Modal.Footer>
  </Modal.Content>
</Modal.Overlay>`;

export default defineComponentPageMetadata({
  react: {
    children: reactModalChildren,
    imports: reactTriggerImports,
  },
  native: {
    children: nativeModalChildren,
    imports: nativeTriggerImports,
  },
  defaults: {
    shared: {
      closeOnOutsidePress: true,
      closeOnEscape: true,
      animation: 'scale',
      restoreFocus: true,
    },
    react: {
      modal: true,
      preventScroll: true,
      trapFocus: true,
      role: 'dialog',
    },
  },
  examples: [
    {
      title: 'Basic',
      description: 'Dialog with trigger and content.',
      props: [],
      reactImports: reactTriggerImports,
      nativeImports: nativeTriggerImports,
      reactChildren: reactModalChildren,
      nativeChildren: nativeModalChildren,
    },
    {
      title: 'No outside dismissal',
      description: 'Requires an explicit close action.',
      props: ['closeOnOutsidePress={false}'],
      reactImports: reactTriggerImports,
      nativeImports: nativeTriggerImports,
      reactChildren: reactModalChildren,
      nativeChildren: nativeModalChildren,
    },
    {
      title: 'Fade animation',
      description: 'Uses an alternate transition for modal entry and exit.',
      props: [`animation='fade'`],
      reactImports: reactTriggerImports,
      nativeImports: nativeTriggerImports,
    },
    {
      title: 'Large scrollable content',
      description:
        'Uses a larger panel with inside scrolling for long content.',
      props: [],
      reactImports: reactTriggerImports,
      reactChildren: `<Modal.Trigger asChild>
  <ReactButton>Review details</ReactButton>
</Modal.Trigger>
<Modal.Overlay />
<Modal.Content size='lg' scrollBehavior='inside'>
  <Modal.Header>
    <Modal.Title>Release notes</Modal.Title>
    <Modal.Description>Review changes before publishing.</Modal.Description>
  </Modal.Header>
  <Modal.Body>Long-form modal content can scroll inside the panel.</Modal.Body>
  <Modal.Footer>
    <Modal.Close aria-label='Close' />
  </Modal.Footer>
</Modal.Content>`,
      platforms: ['react'],
    },
    {
      title: 'Alert dialog',
      description: 'Uses alert dialog semantics for destructive confirmation.',
      props: [`role='alertdialog'`],
      reactImports: reactTriggerImports,
      reactChildren: `<Modal.Trigger asChild>
  <ReactButton color='danger'>Delete project</ReactButton>
</Modal.Trigger>
<Modal.Overlay />
<Modal.Content>
  <Modal.Header>
    <Modal.Title>Delete project?</Modal.Title>
    <Modal.Description>This action cannot be undone.</Modal.Description>
  </Modal.Header>
  <Modal.Body>All project data will be permanently removed.</Modal.Body>
  <Modal.Footer>
    <Modal.Close aria-label='Cancel' />
  </Modal.Footer>
</Modal.Content>`,
      platforms: ['react'],
    },
  ],
  api: {
    sections: [
      { name: 'Modal.Trigger', exportName: 'ModalTriggerProps' },
      { name: 'Modal.Overlay', exportName: 'ModalOverlayProps' },
      { name: 'Modal.Content', exportName: 'ModalContentProps' },
      { name: 'Modal.Header', exportName: 'ModalHeaderProps' },
      { name: 'Modal.Body', exportName: 'ModalBodyProps' },
      { name: 'Modal.Footer', exportName: 'ModalFooterProps' },
      { name: 'Modal.Close', exportName: 'ModalCloseProps' },
    ],
  },
  accessibility: {
    react: [
      {
        title: 'Focus management',
        description:
          'Trap focus while open and restore focus to the trigger when the modal closes.',
        props: ['trapFocus', 'restoreFocus', 'initialFocus', 'finalFocus'],
      },
      {
        title: 'Dialog labelling',
        description:
          'Use title and description content so assistive technology can announce the dialog purpose.',
        props: ['role', 'children'],
      },
      {
        title: 'Dismissal',
        description:
          'Choose outside press and Escape dismissal behavior based on task criticality.',
        props: ['closeOnOutsidePress', 'closeOnEscape'],
      },
      {
        title: 'Destructive confirmations',
        description:
          'Use alert dialog semantics only for urgent decisions that require immediate attention.',
        props: ['role'],
      },
      {
        title: 'Scrollable content',
        description:
          'Keep title, description, and final actions reachable when modal content is long.',
        props: ['scrollBehavior', 'size'],
      },
    ],
    native: [
      {
        title: 'Modal announcement',
        description:
          'Use title and description content so the modal purpose is announced clearly.',
        props: ['children'],
      },
      {
        title: 'Dismissal',
        description:
          'Provide an explicit close action when outside dismissal is disabled.',
        props: ['closeOnOutsidePress'],
      },
    ],
  },
  related: ['button', 'popover', 'tooltip'],
});
