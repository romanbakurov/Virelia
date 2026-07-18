import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search } from '@vellira-ui/icons';
const noop = () => undefined;

import { Button } from '../../primitives/Button';
import { Tooltip } from '../Tooltip';

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
- Placement: top, bottom, left, and right
- Opens on hover or focus
- Disabled state
- Custom open and close delay
- Maximum width control
- Rich content support

### Usage

Use Tooltip for brief explanations. Keep content short and avoid putting required information only inside a tooltip.

Correct usage:

\`\`\`tsx
<Tooltip content='Search all projects' placement='top'>
  <Button aria-label='Search' iconStart={<Search />} />
</Tooltip>
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
      description: 'Trigger element that the tooltip is attached to.',
      control: false,
      table: { type: { summary: 'ReactNode' } },
    },
    content: {
      description: 'Tooltip content.',
      control: 'text',
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
    disabled: {
      description: 'Disables tooltip behavior.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    delay: {
      description: 'Open and close delay in milliseconds.',
      control: 'object',
      table: {
        type: { summary: '{ open?: number; close?: number }' },
      },
    },
    maxWidth: {
      description: 'Maximum tooltip width in pixels.',
      control: 'number',
      table: {
        type: { summary: 'number | string' },
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

export const Basic: Story = {
  args: {
    content: 'This is a tooltip',
    placement: 'top',
  },
  render: (args) => {
    return (
      <Tooltip {...args}>
        <Button>Hover me</Button>
      </Tooltip>
    );
  },
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
        <Tooltip
          key={placement}
          content={`${placement} tooltip`}
          placement={placement}
          delay={{ open: 0, close: 0 }}
        >
          <Button>{placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const LongContent: Story = {
  args: {
    content:
      'This is a very very very long tooltip content that will wrap to multiple lines automatically',
    placement: 'top',
  },
  render: (args) => {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}
      >
        <Tooltip {...args}>
          <Button>Hover for long text</Button>
        </Tooltip>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    content: 'This tooltip is disabled',
    disabled: true,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button disabled>Disabled Button</Button>
    </Tooltip>
  ),
};

export const CustomDelay: Story = {
  args: {
    content: 'Appears after 500ms',
    delay: { open: 500, close: 200 },
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Slow Tooltip</Button>
    </Tooltip>
  ),
};

export const NoDelay: Story = {
  args: {
    content: 'Appears instantly',
    delay: { open: 0, close: 0 },
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Instant Tooltip</Button>
    </Tooltip>
  ),
};

export const RichContent: Story = {
  args: {
    content: (
      <div>
        <strong>Rich content</strong>
        <p style={{ margin: 0 }}>Can contain any React node</p>
        <code>Even code blocks</code>
      </div>
    ),
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Rich Tooltip</Button>
    </Tooltip>
  ),
};

export const DifferentTriggers: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Tooltip content='Small button'>
        <Button size='sm'>Small</Button>
      </Tooltip>

      <Tooltip content='Medium button'>
        <Button size='md'>Medium</Button>
      </Tooltip>

      <Tooltip content='Large button'>
        <Button size='lg'>Large</Button>
      </Tooltip>

      <Tooltip content='Icon only'>
        <Button aria-label='Search' iconStart={<Search />} />
      </Tooltip>
    </div>
  ),
};
