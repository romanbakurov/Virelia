import { defineComponentPageMetadata } from '../../metadata';

export default defineComponentPageMetadata({
  react: {
    children: `<Modal.Trigger>Open modal</Modal.Trigger>
<Modal.Overlay />
<Modal.Content>
  <Modal.Header>
    <Modal.Title>Confirm action</Modal.Title>
    <Modal.Description>This action can be reviewed before continuing.</Modal.Description>
  </Modal.Header>
  <Modal.Body>Modal body content.</Modal.Body>
  <Modal.Footer>
    <Modal.Close aria-label='Cancel' />
  </Modal.Footer>
</Modal.Content>`,
  },
  native: {
    children: `<Modal.Trigger>Open modal</Modal.Trigger>
<Modal.Overlay>
  <Modal.Content>
    <Modal.Header>
      <Modal.Title>Confirm action</Modal.Title>
      <Modal.Description>This action can be reviewed before continuing.</Modal.Description>
    </Modal.Header>
    <Modal.Body>Modal body content.</Modal.Body>
    <Modal.Footer>
      <Modal.Close accessibilityLabel='Cancel' />
    </Modal.Footer>
  </Modal.Content>
</Modal.Overlay>`,
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
      reactChildren: `<Modal.Trigger>Open modal</Modal.Trigger>
<Modal.Overlay />
<Modal.Content>
  <Modal.Header>
    <Modal.Title>Confirm action</Modal.Title>
    <Modal.Description>This action can be reviewed before continuing.</Modal.Description>
  </Modal.Header>
  <Modal.Body>Modal body content.</Modal.Body>
  <Modal.Footer>
    <Modal.Close aria-label='Cancel' />
  </Modal.Footer>
</Modal.Content>`,
      nativeChildren: `<Modal.Trigger>Open modal</Modal.Trigger>
<Modal.Overlay>
  <Modal.Content>
    <Modal.Header>
      <Modal.Title>Confirm action</Modal.Title>
      <Modal.Description>This action can be reviewed before continuing.</Modal.Description>
    </Modal.Header>
    <Modal.Body>Modal body content.</Modal.Body>
    <Modal.Footer>
      <Modal.Close accessibilityLabel='Cancel' />
    </Modal.Footer>
  </Modal.Content>
</Modal.Overlay>`,
    },
    {
      title: 'No outside dismissal',
      description: 'Requires an explicit close action.',
      props: ['closeOnOutsidePress={false}'],
      reactChildren: `<Modal.Trigger>Open modal</Modal.Trigger>
<Modal.Overlay />
<Modal.Content>
  <Modal.Header>
    <Modal.Title>Confirm action</Modal.Title>
    <Modal.Description>This action can be reviewed before continuing.</Modal.Description>
  </Modal.Header>
  <Modal.Body>Modal body content.</Modal.Body>
  <Modal.Footer>
    <Modal.Close aria-label='Cancel' />
  </Modal.Footer>
</Modal.Content>`,
      nativeChildren: `<Modal.Trigger>Open modal</Modal.Trigger>
<Modal.Overlay>
  <Modal.Content>
    <Modal.Header>
      <Modal.Title>Confirm action</Modal.Title>
      <Modal.Description>This action can be reviewed before continuing.</Modal.Description>
    </Modal.Header>
    <Modal.Body>Modal body content.</Modal.Body>
    <Modal.Footer>
      <Modal.Close accessibilityLabel='Cancel' />
    </Modal.Footer>
  </Modal.Content>
</Modal.Overlay>`,
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
