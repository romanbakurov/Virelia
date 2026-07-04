import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from '../../primitives/Button';
import { Modal } from '../Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Modal Component

Accessible dialog displayed above the page content.

**Features**
- Header, body, and footer composition
- Closes on Escape key when enabled
- Closes on backdrop click when enabled
- Focus management
- Scroll lock while open
- Portal rendering

### Accessibility

For proper accessibility, include a clear title in \`Modal.Header\`.
The modal uses \`Modal.Header\` and \`Modal.Body\` to connect
\`aria-labelledby\` and \`aria-describedby\`.

Correct usage:

\`\`\`tsx
<Modal isOpen={isOpen} onClose={handleClose}>
  <Modal.Header>Delete file</Modal.Header>

  <Modal.Body>
    Are you sure you want to delete this file?
  </Modal.Body>

  <Modal.Footer>
    <Button onClick={handleClose}>Cancel</Button>
    <Button variant="danger" onClick={handleDelete}>Delete</Button>
  </Modal.Footer>
</Modal>
\`\`\`
`,
      },
    },
  },
  args: {
    onClose: fn(),
  },
  argTypes: {
    children: {
      description: 'Modal content.',
      control: false,
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    isOpen: {
      description: 'Controls whether the modal is open.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onClose: {
      description: 'Called when the modal requests to close.',
      action: 'closed',
      table: {
        type: { summary: '() => void' },
      },
    },
    closeOnEsc: {
      description: 'Allows closing the modal with the Escape key.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    closeOnBackdrop: {
      description: 'Allows closing the modal by clicking the backdrop.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    closeOnClick: {
      description:
        'Deprecated. Use closeOnBackdrop instead. Allows closing the modal by clicking the backdrop.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicModalDemo = ({ onClose }: { onClose?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <Modal.Header>Delete file</Modal.Header>
        <Modal.Body>Are you sure you want to delete this file?</Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='danger' onClick={handleClose}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const WithoutBackdropCloseDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closeOnBackdrop={false}
      >
        <Modal.Header>Important Notice</Modal.Header>
        <Modal.Body>
          You cannot close this modal by clicking on the backdrop.
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={() => setIsOpen(false)}>
            Got it
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const LongContentDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Terms</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Header>Terms and Conditions</Modal.Header>
        <Modal.Body>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {Array.from({ length: 15 }, (_, i) => (
              <p key={i}>
                Section {i + 1}: Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </p>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={() => setIsOpen(false)}>
            Accept
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export const Basic: Story = {
  render: (args) => <BasicModalDemo onClose={args.onClose} />,
};

export const WithoutBackdropClose: Story = {
  render: () => <WithoutBackdropCloseDemo />,
};

export const LongContent: Story = {
  render: () => <LongContentDemo />,
};
