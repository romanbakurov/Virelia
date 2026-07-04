import type { Meta, StoryObj } from '@storybook/react-vite';
import { Download, Filter, Save } from '@vellira-ui/icons';
import { fn } from 'storybook/test';

import { Button } from '../Button';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Button Component

Clickable action primitive for web interfaces.

**Features**
- Visual variants: primary, secondary, and danger
- Sizes: sm, md, and lg
- Disabled and full-width states
- Left and right icon support
- Icon-only actions with accessible labels

### Accessibility

Use a clear text label whenever possible. For icon-only buttons, provide an accessible label so screen readers can announce the action.

Correct usage:

\`\`\`tsx
<Button variant='primary' onClick={handleSave}>
  Save changes
</Button>

<Button ariaLabel='Search' leftIcon={<Search />} />
\`\`\`
`,
      },
    },
  },
  args: {
    onClick: fn(),
  },
  argTypes: {
    variant: {
      description: 'Visual style of the button.',
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
      table: {
        type: { summary: `'primary' | 'secondary' | 'danger'` },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      description: 'Button size.',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: `'sm' | 'md' | 'lg'` },
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      description: 'Disables user interaction and applies disabled styling.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      description: 'Makes the button fill the width of its parent container.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    ariaLabel: {
      description: 'Accessible label for icon-only or non-text buttons.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      description: 'Visible button content.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    onClick: {
      description: 'Click event handler.',
      action: 'clicked',
      table: {
        type: { summary: 'MouseEventHandler<HTMLButtonElement>' },
      },
    },
    leftIcon: {
      description: 'Icon rendered before the button content.',
      control: false,
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    rightIcon: {
      description: 'Icon rendered after the button content.',
      control: false,
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: 'Download',
    variant: 'primary',
    size: 'md',
    disabled: false,
    ariaLabel: 'Download',
    leftIcon: <Download />,
  },
};

export const Variants: Story = {
  args: {
    size: 'md',
    disabled: false,
  },

  render: (args) => {
    return (
      <div style={{ display: 'flex', gap: 12 }}>
        <Button ariaLabel='Profile' {...args} variant='primary'>
          Primary
        </Button>
        <Button ariaLabel='Search' {...args} variant='secondary'>
          Secondary
        </Button>
        <Button ariaLabel='Delete' {...args} variant='danger'>
          Delete
        </Button>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: (args) => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          alignItems: 'flex-start',
        }}
      >
        <Button {...args} size='sm'>
          Small
        </Button>
        <Button {...args} size='md'>
          Medium
        </Button>
        <Button {...args} size='lg'>
          Large
        </Button>
      </div>
    );
  },
};

export const WidthComparison: Story = {
  render: (args) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 400 }}
    >
      <div style={{ border: '1px dashed #ccc', padding: 16 }}>
        <p>Default (inline)</p>
        <Button {...args}>Normal Width</Button>
      </div>
      <div style={{ border: '1px dashed #ccc', padding: 16 }}>
        <p>Full Width</p>
        <Button {...args} fullWidth>
          Full Width
        </Button>
      </div>
    </div>
  ),
};

export const WithoutIcons: Story = {
  args: {
    children: 'Save',
    variant: 'primary',
    size: 'md',
  },
};

export const OnlyIcon: Story = {
  argTypes: {
    children: { table: { disable: true } },
  },
  args: {
    variant: 'primary',
    size: 'md',
    ariaLabel: 'Filter',
  },
  render: (args) => {
    return <Button {...args} leftIcon={<Filter />} />;
  },
};

export const WithLeftIcon: Story = {
  args: {
    children: 'Download',
    leftIcon: <Download />,
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'Download',
    rightIcon: <Download />,
  },
};

export const WithBothIcons: Story = {
  args: {
    children: 'Download',
    rightIcon: <Download />,
    leftIcon: <Save />,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    variant: 'primary',
    size: 'md',
    disabled: true,
  },
};
