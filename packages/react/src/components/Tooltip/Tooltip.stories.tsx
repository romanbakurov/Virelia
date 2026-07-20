import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search } from '@vellira-ui/icons';
import type { ComponentProps, ReactNode } from 'react';

import { Button } from '../../primitives/Button';
import { Portal } from '../../primitives/Portal';

import { Tooltip } from './Tooltip';

const noop = () => undefined;

const placements = [
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
] as const;

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Tooltip Component

Short helper overlay attached to a trigger element.

**Features**
- Compound-first API
- Trigger composition through asChild
- Placement: top, bottom, left and right
- Opens on hover or focus
- Controlled and uncontrolled usage
- Optional arrow
- Provider-level default delay

### Usage

\`\`\`tsx
<Tooltip delay={500} placement='top'>
  <Tooltip.Trigger asChild>
    <Button aria-label='Search' iconStart={<Search />} />
  </Tooltip.Trigger>

  <Portal>
    <Tooltip.Content>
      Search all projects
      <Tooltip.Arrow />
    </Tooltip.Content>
  </Portal>
</Tooltip>
\`\`\`
`,
      },
    },
  },
  args: {
    placement: 'top',
    delay: 300,
    disabled: false,
    interactive: false,
    avoidCollisions: true,
    matchTriggerWidth: false,
    defaultOpen: false,
    onOpenChange: noop,
  },
  argTypes: {
    children: {
      control: false,
      description: 'Compound tooltip children.',
      table: { type: { summary: 'ReactNode' } },
    },
    placement: {
      description: 'Tooltip position relative to the trigger.',
      control: 'select',
      options: placements,
      table: {
        type: {
          summary:
            "'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end'",
        },
        defaultValue: { summary: 'top' },
      },
    },
    delay: {
      description: 'Open delay in milliseconds, or open/close delay object.',
      control: 'number',
      table: {
        type: { summary: 'number | { open?: number; close?: number }' },
      },
    },
    defaultOpen: {
      description: 'Initial uncontrolled open state.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    open: {
      description: 'Controlled open state.',
      control: false,
      table: {
        type: { summary: 'boolean' },
      },
    },
    disabled: {
      description: 'Disables tooltip behavior.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    interactive: {
      description: 'Keeps pointer events available for interactive content.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    avoidCollisions: {
      description: 'Allows the tooltip to flip or shift to stay in viewport.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    matchTriggerWidth: {
      description: 'Matches tooltip content width to the trigger width.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onOpenChange: {
      description: 'Called when tooltip open state changes.',
      action: 'open changed',
      table: {
        type: { summary: '(open: boolean) => void' },
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

function TooltipDemo({
  children,
  tooltipContent,
  withArrow = true,
  ...args
}: ComponentProps<typeof Tooltip> & {
  tooltipContent: ReactNode;
  withArrow?: boolean;
}) {
  return (
    <Tooltip {...args}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Portal>
        <Tooltip.Content>
          {tooltipContent}
          {withArrow && <Tooltip.Arrow />}
        </Tooltip.Content>
      </Portal>
    </Tooltip>
  );
}

function ControlledTooltip({
  defaultOpen,
  open,
  ...args
}: ComponentProps<typeof Tooltip>) {
  const [isOpen, setIsOpen] = useState(open ?? defaultOpen ?? false);

  useEffect(() => {
    setIsOpen(open ?? defaultOpen ?? false);
  }, [open, defaultOpen]);

  return (
    <Tooltip
      {...args}
      open={isOpen}
      onOpenChange={(nextOpen) => {
        setIsOpen(nextOpen);
        args.onOpenChange?.(nextOpen);
      }}
    >
      <Tooltip.Trigger asChild>
        <Button>{isOpen ? 'Tooltip open' : 'Tooltip closed'}</Button>
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Content>
          Controlled tooltip
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Portal>
    </Tooltip>
  );
}

export const Default: Story = {
  render: (args) => (
    <TooltipDemo {...args} tooltipContent='This is a tooltip'>
      <Button>Hover me</Button>
    </TooltipDemo>
  ),
};

export const Controlled: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => <ControlledTooltip {...args} />,
};

export const TriggerAsChild: Story = {
  render: (args) => (
    <TooltipDemo {...args} tooltipContent='Composed with Button via asChild'>
      <Button color='neutral' appearance='outline'>
        asChild trigger
      </Button>
    </TooltipDemo>
  ),
};

export const Placement: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(120px, 1fr))',
        gap: '48px',
        padding: '80px',
        placeItems: 'center',
      }}
    >
      {placements.map((placement) => (
        <TooltipDemo
          key={placement}
          tooltipContent={`${placement} tooltip`}
          placement={placement}
          delay={0}
        >
          <Button>{placement}</Button>
        </TooltipDemo>
      ))}
    </div>
  ),
};

export const LongContent: Story = {
  render: (args) => (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}>
      <TooltipDemo
        {...args}
        tooltipContent='This is a very very very long tooltip content that will wrap to multiple lines automatically'
      >
        <Button>Hover for long text</Button>
      </TooltipDemo>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <TooltipDemo {...args} tooltipContent='This tooltip is disabled'>
      <Button disabled>Disabled Button</Button>
    </TooltipDemo>
  ),
};

export const CustomDelay: Story = {
  args: {
    delay: 500,
  },
  render: (args) => (
    <TooltipDemo {...args} tooltipContent='Appears after 500ms'>
      <Button>Slow Tooltip</Button>
    </TooltipDemo>
  ),
};

export const NoDelay: Story = {
  args: {
    delay: 0,
  },
  render: (args) => (
    <TooltipDemo {...args} tooltipContent='Appears instantly'>
      <Button>Instant Tooltip</Button>
    </TooltipDemo>
  ),
};

export const WithoutArrow: Story = {
  render: (args) => (
    <TooltipDemo
      {...args}
      tooltipContent='Tooltip without arrow'
      withArrow={false}
    >
      <Button>No arrow</Button>
    </TooltipDemo>
  ),
};

export const MatchTriggerWidth: Story = {
  args: {
    matchTriggerWidth: true,
    placement: 'bottom',
  },
  render: (args) => (
    <Tooltip {...args}>
      <Tooltip.Trigger asChild>
        <Button style={{ width: 240 }}>Matched width trigger</Button>
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Content>
          Matches trigger width
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Portal>
    </Tooltip>
  ),
};

export const RichContent: Story = {
  render: (args) => (
    <TooltipDemo
      {...args}
      tooltipContent={
        <div>
          <strong>Rich content</strong>
          <p style={{ margin: 0 }}>Can contain any React node</p>
          <code>Even code blocks</code>
        </div>
      }
    >
      <Button>Rich Tooltip</Button>
    </TooltipDemo>
  ),
};

export const Triggers: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 20,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <TooltipDemo tooltipContent='Small button'>
        <Button size='sm'>Small</Button>
      </TooltipDemo>

      <TooltipDemo tooltipContent='Medium button'>
        <Button size='md'>Medium</Button>
      </TooltipDemo>

      <TooltipDemo tooltipContent='Large button'>
        <Button size='lg'>Large</Button>
      </TooltipDemo>

      <TooltipDemo tooltipContent='Icon only'>
        <Button aria-label='Search' iconStart={<Search />} />
      </TooltipDemo>
    </div>
  ),
};

export const ProviderDelay: Story = {
  render: () => (
    <Tooltip.Provider delay={700} skipDelay={300}>
      <TooltipDemo tooltipContent='Uses provider delay'>
        <Button>Provider delay</Button>
      </TooltipDemo>
    </Tooltip.Provider>
  ),
};

export const ForceMount: Story = {
  args: {
    open: false,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Tooltip.Trigger asChild>
        <Button>Force mounted</Button>
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Content forceMount>
          Mounted with closed state
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Portal>
    </Tooltip>
  ),
};
