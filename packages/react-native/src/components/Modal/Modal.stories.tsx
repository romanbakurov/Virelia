import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { Text, TextInput, View } from 'react-native';

import { Button } from '../../primitives/Button';
import { useTheme } from '../../theme';

import { Modal } from '.';

const noop = () => undefined;

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    animation: 'scale',
    defaultOpen: false,
    duration: {
      close: 150,
      open: 180,
    },
    easing: 'standard',
    closeOnOutsidePress: true,
    onOpenChange: noop,
  },
  parameters: {
    docs: {
      description: {
        component: `
### Modal Component

Compound-first native dialog with Root, Trigger, Overlay, Content, Header,
Body, Footer, and Close parts. Use the shared Portal primitive for explicit
stacking composition.

**Features**

- Token-driven overlay, content surface, shadow, spacing, and close button states
- Configurable animations: scale, slide, fade, or none
- Controlled and uncontrolled open state
- Trigger and Close composition through asChild

### Usage

\`\`\`tsx
<Modal>
  <Modal.Trigger asChild>
    <Button>Open modal</Button>
  </Modal.Trigger>

    <Modal.Overlay>
      <Modal.Content>
        <Modal.Header>Delete file</Modal.Header>
        <Modal.Body>
          <Text>Are you sure?</Text>
        </Modal.Body>
      </Modal.Content>
    </Modal.Overlay>
</Modal>
\`\`\`
`,
      },
    },
  },
  argTypes: {
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
    closeOnOutsidePress: {
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    animation: {
      control: 'radio',
      options: ['scale', 'slide', 'fade', 'none'],
      table: {
        type: { summary: "'scale' | 'slide' | 'fade' | 'none'" },
        defaultValue: { summary: "'scale'" },
      },
    },
    duration: {
      control: 'object',
      table: {
        type: { summary: 'number | { open?: number; close?: number }' },
        defaultValue: { summary: '{ open: 180, close: 150 }' },
      },
    },
    easing: {
      control: 'radio',
      options: [
        'standard',
        'linear',
        'ease',
        'ease-in',
        'ease-out',
        'ease-in-out',
      ],
      table: {
        type: {
          summary:
            "'standard' | 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'",
        },
        defaultValue: { summary: "'standard'" },
      },
    },
    children: {
      control: false,
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

function NativeModalDemo({
  title = 'Delete file',
  closeOnOutsidePress = true,
}: {
  title?: string;
  closeOnOutsidePress?: boolean;
}) {
  return (
    <Modal closeOnOutsidePress={closeOnOutsidePress}>
      <Modal.Trigger asChild>
        <Button>Open Modal</Button>
      </Modal.Trigger>
      <Modal.Overlay>
        <Modal.Content>
          <Modal.Header>{title}</Modal.Header>
          <Modal.Body>
            <Text>Are you sure you want to continue?</Text>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button color='neutral' appearance='solid'>
                Cancel
              </Button>
            </Modal.Close>
            <Modal.Close>
              <Button color='danger' appearance='solid'>
                Delete
              </Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Overlay>
    </Modal>
  );
}

function NativeFormModal() {
  const [density, setDensity] = useState('comfortable');
  const { theme } = useTheme();

  return (
    <Modal>
      <Modal.Trigger asChild>
        <Button>Edit preferences</Button>
      </Modal.Trigger>
      <Modal.Overlay>
        <Modal.Content>
          <Modal.Header>Workspace preferences</Modal.Header>
          <Modal.Body>
            <View style={{ gap: 12 }}>
              <TextInput
                accessibilityLabel='Workspace email'
                defaultValue='team@vellira.dev'
                style={{
                  backgroundColor: theme.semantic.surface.default,
                  borderWidth: 1,
                  borderColor: theme.semantic.border.muted,
                  borderRadius: theme.tokens.radius.md,
                  color: theme.semantic.text.primary,
                  padding: theme.tokens.spacing[3],
                }}
              />
              {(['comfortable', 'compact', 'dense'] as const).map((value) => (
                <Button
                  key={value}
                  appearance={density === value ? 'solid' : 'outline'}
                  color='neutral'
                  onPress={() => setDensity(value)}
                >
                  {value}
                </Button>
              ))}
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal.Overlay>
    </Modal>
  );
}

export const Default: Story = {
  render: () => <NativeModalDemo />,
};

export const Uncontrolled: Story = {
  args: {
    defaultOpen: false,
  },
  render: (args) => (
    <Modal defaultOpen={args.defaultOpen}>
      <Modal.Trigger asChild>
        <Button>Open Modal</Button>
      </Modal.Trigger>
      <Modal.Overlay>
        <Modal.Content>
          <Modal.Header>Uncontrolled modal</Modal.Header>
          <Modal.Body>
            <Text>This modal starts open from defaultOpen.</Text>
          </Modal.Body>
        </Modal.Content>
      </Modal.Overlay>
    </Modal>
  ),
};

export const WithoutOutsideClose: Story = {
  args: {
    closeOnOutsidePress: false,
  },
  render: (args) => (
    <NativeModalDemo
      closeOnOutsidePress={args.closeOnOutsidePress}
      title='Important notice'
    />
  ),
};

export const FormControls: Story = {
  render: () => <NativeFormModal />,
};
