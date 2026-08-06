import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-native';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fn } from 'storybook/test';

import { Button } from '../../primitives/Button';
import { Input } from '../../primitives/Input';
import { useTheme } from '../../theme';

import { Popover } from '.';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Popover Component

Accessible native floating surface for contextual actions, compact forms,
settings, filters, and additional information.

**Features**

- Controlled and uncontrolled open state
- Compound Root, Trigger, Content, Title, Description, and Close parts
- Native Portal rendering above the application surface
- Positioning on the top, right, bottom, or left
- Start, center, and end alignment
- Configurable trigger offset
- Outside press dismissal
- Android Back dismissal
- Trigger and Close composition through \`asChild\`
- Custom content and surface styles

### Usage

\`\`\`tsx
<Popover>
  <Popover.Trigger asChild>
    <Button>Open popover</Button>
  </Popover.Trigger>

  <Popover.Content>
  <Popover.Arrow />
  
    <Popover.Title>Workspace settings</Popover.Title>

    <Popover.Description>
      Configure preferences for this workspace.
    </Popover.Description>

    <Popover.Close asChild>
      <Button>Done</Button>
    </Popover.Close>
  </Popover.Content>
</Popover>
\`\`\`
`,
      },
    },
  },
  args: {
    defaultOpen: false,
    side: 'bottom',
    align: 'center',
    sideOffset: 8,
    closeOnOutsidePress: true,
    onOpenChange: fn(),
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Current open state for controlled usage.',
    },

    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state for uncontrolled usage.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },

    onOpenChange: {
      action: 'open changed',
      description:
        'Called when the open state changes, together with the change reason.',
    },

    side: {
      control: 'radio',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Preferred side of the trigger for the floating content.',
      table: {
        defaultValue: { summary: "'bottom'" },
      },
    },

    align: {
      control: 'radio',
      options: ['start', 'center', 'end'],
      description: 'Alignment of the content relative to the trigger.',
      table: {
        defaultValue: { summary: "'center'" },
      },
    },

    sideOffset: {
      control: {
        type: 'number',
        min: 0,
        max: 32,
        step: 1,
      },
      description: 'Distance between the trigger and floating content.',
      table: {
        defaultValue: { summary: '8' },
      },
    },

    closeOnOutsidePress: {
      control: 'boolean',
      description: 'Closes the Popover when the outside layer is pressed.',
      table: {
        defaultValue: { summary: 'true' },
      },
    },

    children: {
      control: false,
      description: 'Popover compound parts.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Popover>;
type PopoverStoryProps = ComponentProps<typeof Popover>;

const storyStyles = StyleSheet.create({
  column: {
    width: '100%',
    gap: 16,
  },

  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    width: 280,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },

  positioning: {
    position: 'relative',
    width: '100%',
    height: 500,
  },

  positionTop: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
  },

  positionRight: {
    position: 'absolute',
    right: 24,
    top: 220,
  },

  positionBottom: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },

  positionLeft: {
    position: 'absolute',
    left: 24,
    top: 220,
  },

  positionHorizontalCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    section: {
      width: '100%',
      padding: 20,
      gap: 16,
      borderWidth: 1,
      borderColor: theme.semantic.border.muted,
      borderRadius: theme.tokens.radius.xl,
      backgroundColor: theme.semantic.surface.subtle,
    },

    subtitle: {
      color: theme.semantic.text.secondary,
      fontSize: theme.tokens.typography.size.sm,
      fontWeight: theme.tokens.typography.weight.semibold,
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.subtitle}>{title}</Text>
      {children}
    </View>
  );
}

function Demo({
  trigger = 'Open popover',
  children,
  ...args
}: PopoverStoryProps & {
  trigger?: string;
}) {
  return (
    <Popover {...args}>
      <Popover.Trigger asChild>
        <Button>{trigger}</Button>
      </Popover.Trigger>

      <Popover.Content style={storyStyles.content}>
        <Popover.Arrow />

        <Popover.Title>Workspace settings</Popover.Title>

        <Popover.Description>
          Configure preferences for this workspace.
        </Popover.Description>

        {children}

        <View style={storyStyles.actions}>
          <Popover.Close asChild>
            <Button size='sm' appearance='ghost'>
              Close
            </Button>
          </Popover.Close>
        </View>
      </Popover.Content>
    </Popover>
  );
}

function ControlledPopover({
  open,
  defaultOpen,
  onOpenChange,
  ...args
}: PopoverStoryProps) {
  const [isOpen, setIsOpen] = useState(open ?? defaultOpen ?? false);

  useEffect(() => {
    setIsOpen(open ?? defaultOpen ?? false);
  }, [defaultOpen, open]);

  return (
    <Popover
      {...args}
      open={isOpen}
      onOpenChange={(nextOpen, details) => {
        setIsOpen(nextOpen);
        onOpenChange?.(nextOpen, details);
      }}
    >
      <Popover.Trigger asChild>
        <Button>{isOpen ? 'Popover open' : 'Popover closed'}</Button>
      </Popover.Trigger>

      <Popover.Content style={storyStyles.content}>
        <Popover.Arrow />

        <Popover.Title>Controlled popover</Popover.Title>

        <Popover.Description>
          This popover is controlled by React state.
        </Popover.Description>
      </Popover.Content>
    </Popover>
  );
}

function RichContentDemo(args: React.PopoverStoryProps<typeof Popover>) {
  const [email, setEmail] = useState('');

  return (
    <Section title='Rich content'>
      <Demo {...args} align='start' trigger='Invite member'>
        <Input
          label='Email'
          value={email}
          onValueChange={setEmail}
          placeholder='name@example.com'
        />

        <Button size='sm'>Invite</Button>
      </Demo>
    </Section>
  );
}

function SeparateAnchorDemo() {
  const { theme } = useTheme();

  return (
    <Section title='Separate anchor'>
      <Popover>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <Popover.Anchor asChild>
            <View
              style={{
                padding: 16,
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: theme.semantic.border.muted,
                borderRadius: theme.tokens.radius.lg,
              }}
            >
              <Text
                style={{
                  color: theme.semantic.text.primary,
                }}
              >
                Position relative to me
              </Text>
            </View>
          </Popover.Anchor>

          <Popover.Trigger asChild>
            <Button>Toggle popover</Button>
          </Popover.Trigger>
        </View>

        <Popover.Content style={storyStyles.content}>
          <Popover.Arrow />

          <Popover.Title>Separate anchor</Popover.Title>

          <Popover.Description>
            The trigger controls the state, but the content is positioned
            relative to the anchor.
          </Popover.Description>

          <View style={storyStyles.actions}>
            <Popover.Close asChild>
              <Button size='sm' appearance='ghost'>
                Close
              </Button>
            </Popover.Close>
          </View>
        </Popover.Content>
      </Popover>
    </Section>
  );
}

function CustomStylesDemo() {
  const { theme } = useTheme();

  return (
    <Section title='CustomStyles'>
      <View style={storyStyles.centered}>
        <Popover side='right' align='start'>
          <Popover.Trigger asChild>
            <Button>Open styled popover</Button>
          </Popover.Trigger>

          <Popover.Content
            style={{
              width: 300,
              gap: 16,
              padding: 24,
              borderWidth: 2,
              borderColor: theme.semantic.border.strong,
              borderRadius: theme.tokens.radius.xl,
              backgroundColor: theme.semantic.surface.subtle,
            }}
          >
            <Popover.Title
              style={{
                color: theme.semantic.text.primary,
                fontSize: theme.tokens.typography.size.lg,
                fontWeight: theme.tokens.typography.weight.bold,
              }}
            >
              Custom surface
            </Popover.Title>

            <Popover.Description
              style={{
                color: theme.semantic.text.secondary,
                fontStyle: 'italic',
              }}
            >
              Popover content accepts native View and Text styles.
            </Popover.Description>

            <Popover.Close asChild>
              <Button appearance='outline'>Close</Button>
            </Popover.Close>
          </Popover.Content>
        </Popover>
      </View>
    </Section>
  );
}

export const Basic: Story = {
  render: (args) => (
    <Section title='Basic'>
      <View style={storyStyles.centered}>
        <Demo {...args} />
      </View>
    </Section>
  ),
};

export const Controlled: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Controlled'>
      <View style={storyStyles.centered}>
        <ControlledPopover {...args} />
      </View>
    </Section>
  ),
};

export const Positioning: Story = {
  render: () => (
    <Section title='Positioning'>
      <View style={storyStyles.positioning}>
        <View
          style={[
            storyStyles.positionHorizontalCenter,
            {
              top: 40,
            },
          ]}
        >
          <Demo side='bottom' trigger='Bottom' />
        </View>

        <View
          style={{
            position: 'absolute',
            left: 24,
            top: 220,
          }}
        >
          <Demo side='right' trigger='Right' />
        </View>

        <View
          style={{
            position: 'absolute',
            right: 24,
            top: 220,
          }}
        >
          <Demo side='left' trigger='Left' />
        </View>

        <View
          style={[
            storyStyles.positionHorizontalCenter,
            {
              bottom: 40,
            },
          ]}
        >
          <Demo side='top' trigger='Top' />
        </View>
      </View>
    </Section>
  ),
};

export const Alignment: Story = {
  render: () => (
    <Section title='Alignment'>
      <View style={storyStyles.column}>
        {(['start', 'center', 'end'] as const).map((align) => (
          <Demo key={align} side='bottom' align={align} trigger={align} />
        ))}
      </View>
    </Section>
  ),
};

export const Offsets: Story = {
  render: () => (
    <Section title='Offsets'>
      <View style={storyStyles.column}>
        {[0, 8, 24].map((sideOffset) => (
          <Demo
            key={sideOffset}
            side='bottom'
            sideOffset={sideOffset}
            trigger={`Offset ${sideOffset}`}
          />
        ))}
      </View>
    </Section>
  ),
};

export const WithoutOutsideClose: Story = {
  args: {
    closeOnOutsidePress: false,
  },
  render: (args) => (
    <Section title='Without outside close'>
      <View style={storyStyles.centered}>
        <Demo {...args} trigger='Open persistent popover' />
      </View>
    </Section>
  ),
};

export const RichContent: Story = {
  render: (args) => <RichContentDemo {...args} />,
};

export const SeparateAnchor: Story = {
  render: () => <SeparateAnchorDemo />,
};

export const CustomStyles: Story = {
  render: () => <CustomStylesDemo />,
};
