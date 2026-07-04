import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { Text } from 'react-native';

import { Button } from '../../primitives/Button';

import { Modal } from '.';

type ModalDemoProps = {
  defaultOpen?: boolean;
  closeOnBackdrop?: boolean;
  title?: string;
};

function ModalDemo({
  defaultOpen = false,
  closeOnBackdrop = true,
  title = 'Delete file',
}: ModalDemoProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closeOnBackdrop={closeOnBackdrop}
      >
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <Text>Are you sure you want to continue?</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onPress={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant='danger' onPress={() => setIsOpen(false)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    isOpen: false,
    closeOnBackdrop: true,
  },
  parameters: {
    docs: {
      description: {
        component: `
### Modal Component

Accessible modal dialog for React Native.

**Features**
- Backdrop close support
- Compound API
- Header, Body and Footer sections
- Native modal overlay

### Usage

\`\`\`tsx
<Modal isOpen={isOpen} onClose={handleClose}>
  <Modal.Header>Delete file</Modal.Header>
  <Modal.Body>
    <Text>Are you sure?</Text>
  </Modal.Body>
  <Modal.Footer>
    <Button onPress={handleClose}>Cancel</Button>
  </Modal.Footer>
</Modal>
\`\`\`
`,
      },
    },
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls whether the modal is open.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onClose: {
      action: 'closed',
      description: 'Called when the modal requests to close.',
      table: {
        type: { summary: '() => void' },
      },
    },
    closeOnBackdrop: {
      control: 'boolean',
      description: 'Allows closing the modal by tapping the backdrop.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    closeOnEsc: {
      control: false,
      description: 'Web-only. Not used by the native Modal.',
      table: {
        type: { summary: 'boolean' },
      },
    },
    children: {
      control: false,
      description: 'Modal content.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    overlayStyle: {
      control: false,
      description: 'Custom style for the modal overlay.',
    },
    contentStyle: {
      control: false,
      description: 'Custom style for the modal content container.',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <ModalDemo closeOnBackdrop={args.closeOnBackdrop} />,
};

export const WithoutBackdropClose: Story = {
  args: {
    closeOnBackdrop: false,
  },
  render: (args) => (
    <ModalDemo
      closeOnBackdrop={args.closeOnBackdrop}
      title='Important notice'
    />
  ),
};
