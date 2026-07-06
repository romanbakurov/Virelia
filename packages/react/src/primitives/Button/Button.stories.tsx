import type { Meta, StoryObj } from '@storybook/react-vite';
import { Download, Filter, Save, Search } from '@vellira-ui/icons';
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
- Colors: primary, secondary, close, and danger
- Variants: solid, outline, and ghost
- Sizes: sm, md, and lg
- Disabled, loading, icon-only, and full-width states
- Left and right icon support

### Accessibility

Use a clear text label whenever possible. For icon-only buttons, provide an accessible label so screen readers can announce the action.

Correct usage:

\`\`\`tsx
<Button color='primary' onClick={handleSave}>
  Save changes
</Button>

<Button ariaLabel='Search' leftIcon={<Search />} />
\`\`\`
`,
      },
    },
  },
  args: {
    children: 'Button',
    color: 'primary',
    variant: 'solid',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
    onClick: fn(),
  },
  argTypes: {
    color: {
      description: 'Button color.',
      control: 'select',
      options: ['primary', 'secondary', 'close', 'danger'],
      table: {
        type: { summary: `'primary' | 'secondary' | 'close' | 'danger'` },
        defaultValue: { summary: 'primary' },
      },
    },
    variant: {
      description: 'Button visual variant.',
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
      table: {
        type: { summary: `'solid' | 'outline' | 'ghost'` },
        defaultValue: { summary: 'solid' },
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
    type: {
      description: 'Native button type.',
      control: 'select',
      options: ['button', 'submit', 'reset'],
      table: {
        type: { summary: `'button' | 'submit' | 'reset'` },
        defaultValue: { summary: 'button' },
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
    loading: {
      description: 'Shows a loading spinner and disables interaction.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loadingText: {
      description: 'Optional text shown while loading.',
      control: 'text',
      table: {
        type: { summary: 'string' },
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
    iconOnly: {
      description: 'Renders the button as an icon-only action.',
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
    className: {
      control: false,
      table: {
        disable: true,
      },
    },
    id: {
      control: false,
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const stackStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  alignItems: 'flex-start',
} as const;

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  alignItems: 'center',
} as const;

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  minWidth: 0,
  padding: 20,
  border: '1px solid var(--border-muted)',
  borderRadius: 8,
  background: 'var(--surface-subtle)',
} satisfies CSSProperties;

function Section({ children }: { title: string; children: ReactNode }) {
  return <section style={sectionStyle}>{children}</section>;
}

export const Basic: Story = {
  args: {
    children: 'Download',
    color: 'primary',
    variant: 'solid',
    size: 'md',
    ariaLabel: 'Download',
    leftIcon: <Download />,
  },
  render: (args) => (
    <Section>
      <div style={rowStyle}>
        <Button {...args}>Primary</Button>
      </div>
    </Section>
  ),
};

export const Colors: Story = {
  args: {
    variant: 'solid',
    size: 'md',
  },
  render: (args) => (
    <Section>
      <div style={rowStyle}>
        <Button {...args} color='primary'>
          Primary
        </Button>
        <Button {...args} color='secondary'>
          Secondary
        </Button>
        <Button {...args} color='close'>
          Close
        </Button>
        <Button {...args} color='danger'>
          Danger
        </Button>
      </div>
    </Section>
  ),
};

export const Variants: Story = {
  args: {
    color: 'primary',
    size: 'md',
  },
  render: (args) => (
    <Section>
      <div style={rowStyle}>
        <Button {...args} variant='solid'>
          Solid
        </Button>
        <Button {...args} variant='outline'>
          Outline
        </Button>
        <Button {...args} variant='ghost'>
          Ghost
        </Button>
      </div>
    </Section>
  ),
};

export const Matrix: Story = {
  args: {
    size: 'md',
  },
  render: (args) => {
    const colors = ['primary', 'secondary', 'close', 'danger'] as const;
    const variants = ['solid', 'outline', 'ghost'] as const;

    return (
      <Section>
        <div style={stackStyle}>
          {colors.map((color) => (
            <div key={color} style={rowStyle}>
              {variants.map((variant) => (
                <Button
                  key={`${color}-${variant}`}
                  {...args}
                  color={color}
                  variant={variant}
                >
                  {color} {variant}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </Section>
    );
  },
};

export const Sizes: Story = {
  args: {
    color: 'primary',
    variant: 'solid',
  },
  render: (args) => (
    <Section>
      <div style={rowStyle}>
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
    </Section>
  ),
};

export const WithIcons: Story = {
  args: {
    color: 'primary',
    variant: 'solid',
    size: 'md',
  },
  render: (args) => (
    <Section>
      <div style={stackStyle}>
        <div style={rowStyle}>
          <Button {...args} leftIcon={<Download />}>
            Left icon
          </Button>
          <Button {...args} rightIcon={<Download />}>
            Right icon
          </Button>
          <Button {...args} leftIcon={<Save />} rightIcon={<Download />}>
            Both icons
          </Button>
        </div>
      </div>
    </Section>
  ),
};

export const IconOnly: Story = {
  argTypes: {
    children: { table: { disable: true } },
  },
  args: {
    color: 'primary',
    variant: 'solid',
    size: 'md',
    iconOnly: true,
    ariaLabel: 'Filter',
  },
  render: (args) => (
    <Section>
      <div style={rowStyle}>
        <Button {...args} leftIcon={<Filter />} />
      </div>
    </Section>
  ),
};

export const Loading: Story = {
  args: {
    color: 'primary',
    variant: 'solid',
    size: 'md',
  },
  render: (args) => (
    <Section>
      <div style={rowStyle}>
        <Button {...args} loading>
          Saving
        </Button>
        <Button {...args} loading loadingText='Saving...'>
          Save
        </Button>
        <Button {...args} loading leftIcon={<Save />}>
          Uploading
        </Button>
      </div>
    </Section>
  ),
};

export const Disabled: Story = {
  args: {
    color: 'primary',
    variant: 'solid',
    size: 'md',
    disabled: true,
    children: 'Disabled',
  },
  render: (args) => (
    <Section>
      <div style={rowStyle}>
        <Button {...args}>Disabled</Button>
      </div>
    </Section>
  ),
};

export const FullWidth: Story = {
  args: {
    color: 'primary',
    variant: 'solid',
    size: 'md',
  },
  render: (args) => (
    <Section>
      <div style={rowStyle}>
        <Button {...args} fullWidth>
          Full width
        </Button>
      </div>
    </Section>
  ),
};

export const ButtonTypes: Story = {
  args: {
    color: 'primary',
    variant: 'solid',
    size: 'md',
  },
  render: (args) => (
    <Section>
      <div style={rowStyle}>
        <Button {...args} type='button'>
          Button
        </Button>
        <Button {...args} type='submit'>
          Submit
        </Button>
        <Button {...args} type='reset'>
          Reset
        </Button>
      </div>
    </Section>
  ),
};

export const AccessibleIconActions: Story = {
  render: () => (
    <Section>
      <div style={rowStyle}>
        <Button
          ariaLabel='Search'
          color='primary'
          iconOnly
          leftIcon={<Search />}
          variant='ghost'
        />
        <Button
          ariaLabel='Filter results'
          color='secondary'
          iconOnly
          leftIcon={<Filter />}
          variant='outline'
        />
        <Button
          ariaLabel='Save'
          color='primary'
          iconOnly
          leftIcon={<Save />}
          variant='solid'
        />
      </div>
    </Section>
  ),
};
