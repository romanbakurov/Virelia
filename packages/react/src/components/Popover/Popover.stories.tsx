import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import { Popover } from './Popover';

import { Button } from '#primitives/Button';

const noop = () => undefined;

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 16,
  minWidth: 0,
  maxWidth: 760,
  padding: 20,
  border: '1px solid var(--border-muted)',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--surface-subtle)',
} satisfies CSSProperties;

const subtitleStyle = {
  margin: 0,
  color: 'var(--text-secondary)',
  fontSize: 13,
  fontWeight: 600,
} satisfies CSSProperties;

const contentStackStyle = {
  display: 'grid',
  gap: 12,
} satisfies CSSProperties;

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        // language=Markdown
        component: `
### Popover Component

Floating interactive content attached to a trigger.

**Current features**
- Compound API with Trigger and Content
- Controlled and uncontrolled open state
- Trigger composition through asChild
- Floating positioning and collision handling
- Portal rendering
- Escape and outside-press dismissal
- Optional modal focus, scroll lock, and aria isolation

### Usage

\`\`\`tsx
<Popover>
  <Popover.Trigger asChild>
    <Button>Open popover</Button>
  </Popover.Trigger>

  <Popover.Content>
    Popover content
  </Popover.Content>
</Popover>
\`\`\`
`,
      },
    },
  },
  args: {
    children: null,
    side: 'bottom',
    align: 'center',
    sideOffset: 8,
    collisionPadding: 8,
    avoidCollisions: true,
    portal: true,
    modal: false,
    defaultOpen: false,
    onOpenChange: noop,
  },
  argTypes: {
    children: {
      control: false,
    },
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
    sideOffset: {
      control: 'number',
    },
    collisionPadding: {
      control: 'number',
    },
    avoidCollisions: {
      control: 'boolean',
    },
    portal: {
      control: 'boolean',
    },
    modal: {
      control: 'boolean',
    },
    open: {
      control: false,
    },
    defaultOpen: {
      control: 'boolean',
    },
    onOpenChange: {
      action: 'open changed',
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

type PopoverDemoProps = Omit<ComponentProps<typeof Popover>, 'children'> & {
  trigger?: ReactNode;
  children?: ReactNode;
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={sectionStyle}>
      <h3 style={subtitleStyle}>{title}</h3>
      {children}
    </section>
  );
}

function Demo({
  trigger = 'Open popover',
  children,
  ...args
}: PopoverDemoProps) {
  return (
    <Popover {...args}>
      <Popover.Trigger asChild>
        <Button>{trigger}</Button>
      </Popover.Trigger>

      <Popover.Content>
        <Popover.Arrow />

        <div style={contentStackStyle}>
          <Popover.Title>Workspace settings</Popover.Title>

          <Popover.Description>
            Configure preferences for this workspace.
          </Popover.Description>

          {children}

          <Popover.Close asChild>
            <Button size='sm' appearance='ghost'>
              Close
            </Button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover>
  );
}

function ControlledPopover({
  open,
  defaultOpen,
  onOpenChange,
  ...args
}: ComponentProps<typeof Popover>) {
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

      <Popover.Content>
        <div style={contentStackStyle}>
          <Popover.Title>Controlled popover</Popover.Title>
          <Popover.Description>
            This popover is controlled by React state.
          </Popover.Description>
        </div>
      </Popover.Content>
    </Popover>
  );
}

const position = (style: CSSProperties): CSSProperties => ({
  position: 'absolute',
  ...style,
});

export const Basic: Story = {
  render: (args) => (
    <Section title='Basic'>
      <Demo {...args} />
    </Section>
  ),
};

export const Controlled: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Controlled'>
      <ControlledPopover {...args} />
    </Section>
  ),
};

export const Modal: Story = {
  args: {
    modal: true,
  },
  render: (args) => (
    <Section title='Modal behavior'>
      <Demo {...args}>
        <Button size='sm'>Focusable action</Button>
      </Demo>
    </Section>
  ),
};

export const Positioning: Story = {
  render: () => (
    <Section title='Positioning'>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 500,
          margin: '0 auto',
        }}
      >
        <div
          style={position({
            top: 60,
            left: '50%',
            transform: 'translateX(-50%)',
          })}
        >
          <Demo side='bottom' avoidCollisions={false} trigger='Bottom' />
        </div>

        <div
          style={position({
            left: 80,
            top: '50%',
            transform: 'translateY(-50%)',
          })}
        >
          <Demo side='right' avoidCollisions={false} trigger='Right' />
        </div>

        <div
          style={position({
            right: 80,
            top: '50%',
            transform: 'translateY(-50%)',
          })}
        >
          <Demo side='left' avoidCollisions={false} trigger='Left' />
        </div>

        <div
          style={position({
            bottom: 60,
            left: '50%',
            transform: 'translateX(-50%)',
          })}
        >
          <Demo side='top' avoidCollisions={false} trigger='Top' />
        </div>
      </div>
    </Section>
  ),
};

export const WithoutPortal: Story = {
  args: {
    portal: false,
  },
  render: (args) => (
    <Section title='Without portal'>
      <Demo {...args} />
    </Section>
  ),
};

export const ArrowAlignment: Story = {
  render: () => (
    <Section title='Arrow alignment'>
      <div
        style={{
          display: 'flex',
          gap: 48,
          padding: 120,
        }}
      >
        {(['start', 'center', 'end'] as const).map((align) => (
          <Popover key={align} defaultOpen side='top'>
            <Popover.Trigger asChild>
              <Button>{align}</Button>
            </Popover.Trigger>

            <Popover.Content>
              <Popover.Arrow align={align} />

              <div style={contentStackStyle}>
                <Popover.Title>{align} arrow</Popover.Title>
                <Popover.Description>
                  Arrow aligned to {align}.
                </Popover.Description>
              </div>
            </Popover.Content>
          </Popover>
        ))}
      </div>
    </Section>
  ),
};

export const SeparateAnchor: Story = {
  render: () => (
    <Section title='Separate anchor'>
      <Popover>
        <div
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
            <Button>Toggle popover</Button>
          </Popover.Trigger>
        </div>

        <Popover.Content>
          <Popover.Arrow />
          <div style={contentStackStyle}>
            <Popover.Title>Separate anchor</Popover.Title>
            <Popover.Description>
              The trigger controls the state, but the content is positioned
              relative to the anchor.
            </Popover.Description>

            <Popover.Close asChild>
              <Button size='sm' appearance='ghost'>
                Close
              </Button>
            </Popover.Close>
          </div>
        </Popover.Content>
      </Popover>
    </Section>
  ),
};
