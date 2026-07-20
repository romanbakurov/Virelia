import { useEffect, useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import { Button } from '../../primitives/Button';
import { Radio } from '../../primitives/Radio';
import { RadioGroup } from '../RadioGroup';

import { Modal } from './Modal';

const noop = () => undefined;

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Modal Component

Compound-first dialog for focused tasks and confirmations.

**Features**
- Root, Trigger, Portal, Overlay, Content, Header, Title, Description, Body,
  Footer, and Close parts
- Controlled and uncontrolled open state
- Trigger and Close composition through asChild
- Dialog and alertdialog roles
- Escape and outside-press dismissal controls
- Focus trap, initial focus, final focus, focus restoration, and scroll lock
- Content sizes and inside/outside scroll behavior
- data-state hooks for animation libraries

### Usage

\`\`\`tsx
<Modal>
  <Modal.Trigger asChild>
    <Button>Open settings</Button>
  </Modal.Trigger>

  <Modal.Portal>
    <Modal.Overlay />
    <Modal.Content size='md' scrollBehavior='inside'>
      <Modal.Header>
        <div>
          <Modal.Title>Workspace settings</Modal.Title>
          <Modal.Description>
            Configure your workspace preferences.
          </Modal.Description>
        </div>
        <Modal.Close />
      </Modal.Header>

      <Modal.Body>...</Modal.Body>

      <Modal.Footer>
        <Modal.Close asChild>
          <Button appearance='ghost'>Cancel</Button>
        </Modal.Close>
        <Button>Save changes</Button>
      </Modal.Footer>
    </Modal.Content>
  </Modal.Portal>
</Modal>
\`\`\`
`,
      },
    },
  },
  args: {
    onOpenChange: noop,
  },
  argTypes: {
    children: {
      control: false,
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    open: {
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      },
    },
    defaultOpen: {
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onOpenChange: {
      action: 'open changed',
      table: {
        type: { summary: '(open: boolean) => void' },
      },
    },
    closeOnEscape: {
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    closeOnOutsidePress: {
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    className: {
      control: false,
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Modal>;

const subtitleStyle = {
  margin: 0,
  color: 'var(--text-secondary)',
  fontSize: 13,
  fontWeight: 600,
} satisfies CSSProperties;

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  minWidth: 0,
  maxWidth: 760,
  padding: 20,
  border: '1px solid var(--border-muted)',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--surface-subtle)',
} satisfies CSSProperties;

const matrixStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, max-content))',
  gap: 12,
  alignItems: 'start',
} satisfies CSSProperties;

const fieldGridStyle = {
  display: 'grid',
  gap: 12,
} satisfies CSSProperties;

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: 'var(--space-3)',
  color: 'var(--text-primary)',
  background: 'var(--surface-default)',
  border: '1px solid var(--border-muted)',
  borderRadius: 'var(--radius-md)',
} satisfies CSSProperties;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={sectionStyle}>
      <h3 style={subtitleStyle}>{title}</h3>
      {children}
    </section>
  );
}

export default meta;

type Story = StoryObj<typeof meta>;
type ModalStoryProps = ComponentProps<typeof Modal>;

function ProductModal({
  trigger = 'Open modal',
  title = 'Workspace settings',
  description = 'Configure your workspace preferences.',
  children,
  footer,
  size = 'md',
  scrollBehavior = 'inside',
  ...args
}: ModalStoryProps & {
  trigger?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  scrollBehavior?: 'inside' | 'outside';
}) {
  return (
    <Modal {...args}>
      <Modal.Trigger asChild>
        <Button>{trigger}</Button>
      </Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay />
        <Modal.Content size={size} scrollBehavior={scrollBehavior}>
          <Modal.Header>
            <div>
              <Modal.Title>{title}</Modal.Title>
              <Modal.Description>{description}</Modal.Description>
            </div>
            <Modal.Close />
          </Modal.Header>
          <Modal.Body>
            {children ?? (
              <p>
                Update public information, notification preferences, and
                workspace defaults.
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            {footer ?? (
              <>
                <Modal.Close asChild>
                  <Button color='neutral' appearance='ghost'>
                    Cancel
                  </Button>
                </Modal.Close>
                <Button>Save changes</Button>
              </>
            )}
          </Modal.Footer>
        </Modal.Content>
      </Modal.Portal>
    </Modal>
  );
}

function ModalWithOpenState({ defaultOpen, open, ...args }: ModalStoryProps) {
  const [isOpen, setIsOpen] = useState(open ?? defaultOpen ?? false);

  useEffect(() => {
    setIsOpen(open ?? defaultOpen ?? false);
  }, [open, defaultOpen]);

  return (
    <ProductModal
      {...args}
      open={isOpen}
      onOpenChange={(nextOpen) => {
        setIsOpen(nextOpen);
        args.onOpenChange?.(nextOpen);
      }}
    />
  );
}

function PreferencesFormModal(args: ModalStoryProps) {
  const [density, setDensity] = useState('comfortable');
  const [email, setEmail] = useState('team@vellira.dev');

  return (
    <ProductModal
      {...args}
      trigger='Edit preferences'
      title='Workspace preferences'
      description='Choose default settings for this workspace.'
    >
      <div style={fieldGridStyle}>
        <label>
          Workspace email
          <input
            aria-label='Workspace email'
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            style={inputStyle}
          />
        </label>

        <RadioGroup
          label='Density'
          name='modal-density'
          value={density}
          onValueChange={setDensity}
        >
          <Radio value='comfortable' label='Comfortable' />
          <Radio value='compact' label='Compact' />
          <Radio value='dense' label='Dense' />
        </RadioGroup>
      </div>
    </ProductModal>
  );
}

export const Default: Story = {
  render: (args) => (
    <Section title='Default'>
      <ProductModal {...args} />
    </Section>
  ),
};

export const Uncontrolled: Story = {
  args: {
    defaultOpen: false,
  },
  render: (args) => (
    <Section title='Uncontrolled'>
      <ProductModal {...args} />
    </Section>
  ),
};

export const Controlled: Story = {
  render: (args) => (
    <Section title='Controlled'>
      <ModalWithOpenState {...args} />
    </Section>
  ),
};

export const AsChildTrigger: Story = {
  render: () => (
    <Section title='asChild trigger'>
      <ProductModal trigger='Open settings' />
    </Section>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section title='Sizes'>
      <div style={matrixStyle}>
        {(['sm', 'md', 'lg', 'xl', 'full'] as const).map((size) => (
          <ProductModal
            key={size}
            trigger={size}
            title={`Size ${size}`}
            size={size}
          />
        ))}
      </div>
    </Section>
  ),
};

export const FormControls: Story = {
  render: (args) => (
    <Section title='Form controls'>
      <PreferencesFormModal {...args} />
    </Section>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Section title='Long content'>
      <ProductModal title='Terms and conditions'>
        {Array.from({ length: 16 }, (_, index) => (
          <p key={index}>
            Section {index + 1}: Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
          </p>
        ))}
      </ProductModal>
    </Section>
  ),
};

export const ScrollOutside: Story = {
  render: () => (
    <Section title='Scroll outside'>
      <ProductModal title='Outside scroll' scrollBehavior='outside'>
        {Array.from({ length: 16 }, (_, index) => (
          <p key={index}>
            Section {index + 1}: The whole dialog surface scrolls in this mode.
          </p>
        ))}
      </ProductModal>
    </Section>
  ),
};

export const PreventOutsideClose: Story = {
  render: () => (
    <Section title='Prevent outside close'>
      <ProductModal
        closeOnOutsidePress={false}
        title='Important notice'
        description='Use an explicit action to close this dialog.'
      />
    </Section>
  ),
};

function InitialFocusDemo() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Section title='Initial focus'>
      <Modal initialFocus={inputRef}>
        <Modal.Trigger asChild>
          <Button>Edit profile</Button>
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Header title='Edit profile' showClose />
            <Modal.Body>
              <input
                ref={inputRef}
                aria-label='Display name'
                style={inputStyle}
              />
            </Modal.Body>
          </Modal.Content>
        </Modal.Portal>
      </Modal>
    </Section>
  );
}

export const InitialFocus: Story = {
  render: () => <InitialFocusDemo />,
};

export const NestedModal: Story = {
  render: () => (
    <Section title='Nested modal'>
      <ProductModal
        title='Parent modal'
        description='Open a second modal from this dialog.'
        footer={
          <Modal.Close asChild>
            <Button>Done</Button>
          </Modal.Close>
        }
      >
        <Modal>
          <Modal.Trigger asChild>
            <Button appearance='soft' color='neutral'>
              Open nested modal
            </Button>
          </Modal.Trigger>
          <Modal.Portal>
            <Modal.Overlay />
            <Modal.Content size='sm'>
              <Modal.Header title='Nested modal' showClose />
              <Modal.Body>This dialog sits above the parent modal.</Modal.Body>
            </Modal.Content>
          </Modal.Portal>
        </Modal>
      </ProductModal>
    </Section>
  ),
};

export const AlertDialog: Story = {
  render: () => (
    <Section title='Alert dialog'>
      <ProductModal
        role='alertdialog'
        closeOnOutsidePress={false}
        trigger='Delete project'
        title='Delete project?'
        description='This action cannot be undone.'
        footer={
          <>
            <Modal.Close asChild>
              <Button color='neutral' appearance='ghost'>
                Cancel
              </Button>
            </Modal.Close>
            <Button color='danger'>Delete</Button>
          </>
        }
      >
        Project data will be permanently removed.
      </ProductModal>
    </Section>
  ),
};
