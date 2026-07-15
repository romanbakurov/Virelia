import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
const noop = () => undefined;

import { Checkbox } from './index';

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Checkbox Component

Boolean form control for turning a single option on or off.

**Features**
- Controlled and uncontrolled usage
- Checked, unchecked and indeterminate states
- Sizes: sm, md and lg
- Optional label and description
- Required, disabled and error states
- Standard input and accessibility props

### Usage

Use Checkbox for independent choices such as accepting terms, enabling settings, or selecting optional preferences.

Correct usage:

\`\`\`tsx
<Checkbox
  label='Accept terms'
  checked={accepted}
  onCheckedChange={setAccepted}
/>
\`\`\`
`,
      },
    },
  },
  args: {
    label: 'Accept terms',
    size: 'md',
    disabled: false,
    required: false,
    indeterminate: false,
    onCheckedChange: noop,
  },
  argTypes: {
    label: {
      description: 'Text label displayed next to the checkbox.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      description: 'Additional supporting text displayed below the label.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },

    required: {
      description: 'Marks the checkbox as required.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    indeterminate: {
      description: 'Displays the mixed selection state.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    size: {
      description: 'Checkbox size.',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: `'sm' | 'md' | 'lg'` },
        defaultValue: { summary: 'md' },
      },
    },
    checked: {
      description: 'Current checked state.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    defaultChecked: {
      description: 'Initial checked state for uncontrolled usage.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      description: 'Disables user interaction.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onCheckedChange: {
      description: 'Called when checked state changes.',
      action: 'changed',
      table: {
        type: { summary: '(checked: boolean) => void' },
      },
    },
    error: {
      description: 'Validation error message displayed under the checkbox.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    className: {
      description: 'Class name applied to the root container.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    wrapperClassName: {
      description: 'Class name applied to the clickable label wrapper.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

const subtitleStyle = {
  margin: 0,
  color: 'var(--text-secondary)',
  fontSize: 13,
  fontWeight: 600,
} satisfies CSSProperties;

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
  maxWidth: 760,
  border: '1px solid var(--border-muted)',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--surface-subtle)',
} satisfies CSSProperties;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={sectionStyle}>
      <h3 style={subtitleStyle}>{title}</h3>
      {children}
    </section>
  );
}

type CheckboxStoryProps = ComponentProps<typeof Checkbox>;

const InteractiveCheckbox = (args: CheckboxStoryProps) => {
  const [checked, setChecked] = useState(
    args.checked ?? args.defaultChecked ?? false
  );

  useEffect(() => {
    setChecked(args.checked ?? args.defaultChecked ?? false);
  }, [args.checked, args.defaultChecked]);

  return (
    <Checkbox
      {...args}
      checked={checked}
      onCheckedChange={(nextChecked) => {
        setChecked(nextChecked);
        args.onCheckedChange?.(nextChecked);
      }}
    />
  );
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Section title='Playground'>
      <InteractiveCheckbox {...args} />
    </Section>
  ),
};

export const Default: Story = {
  args: {
    label: 'Accept terms',
  },
  render: (args) => (
    <Section title='Default'>
      <Checkbox {...args} />
    </Section>
  ),
};

export const Controlled: Story = {
  args: {
    label: 'Receive notifications',
    checked: false,
  },
  render: (args) => (
    <Section title='Controlled'>
      <InteractiveCheckbox {...args} />
    </Section>
  ),
};

export const Uncontrolled: Story = {
  args: {
    label: 'Remember me',
    defaultChecked: true,
  },
  render: (args) => (
    <Section title='Uncontrolled'>
      <Checkbox {...args} />
    </Section>
  ),
};

export const Checked: Story = {
  args: {
    label: 'Accept the terms',
    checked: true,
  },
  render: (args) => (
    <Section title='Checked'>
      <div style={rowStyle}>
        <Checkbox {...args} />
      </div>
    </Section>
  ),
};

export const Unchecked: Story = {
  args: {
    label: 'Accept the terms',
    checked: false,
  },
  render: (args) => (
    <Section title='Unchecked'>
      <div style={rowStyle}>
        <Checkbox {...args} />
      </div>
    </Section>
  ),
};

export const Indeterminate: Story = {
  args: {
    label: 'Select all items',
    indeterminate: true,
  },
  render: (args) => (
    <Section title='Indeterminate'>
      <Checkbox {...args} />
    </Section>
  ),
};

export const Required: Story = {
  args: {
    label: 'Accept the privacy policy',
    required: true,
  },
  render: (args) => (
    <Section title='Required'>
      <Checkbox {...args} />
    </Section>
  ),
};

export const WithDescription: Story = {
  args: {
    label: 'Product updates',
    description: 'Receive occasional news about new Vellira releases.',
  },
  render: (args) => (
    <Section title='With description'>
      <Checkbox {...args} />
    </Section>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
  render: (args) => (
    <Section title='Disabled'>
      <Checkbox {...args} />
    </Section>
  ),
};

export const DisabledChecked: Story = {
  args: {
    label: 'Not available',
    disabled: true,
    checked: true,
  },
  render: (args) => (
    <Section title='Disabled checked'>
      <div style={rowStyle}>
        <Checkbox {...args} />
      </div>
    </Section>
  ),
};

export const DisabledUnchecked: Story = {
  args: {
    label: 'Not available',
    disabled: true,
    checked: false,
  },
  render: (args) => (
    <Section title='Disabled unchecked'>
      <div style={rowStyle}>
        <Checkbox {...args} />
      </div>
    </Section>
  ),
};

export const Error: Story = {
  args: {
    label: 'Accept the terms',
    error: 'You must accept the terms',
    checked: false,
  },
  render: (args) => (
    <Section title='Error'>
      <div style={rowStyle}>
        <Checkbox {...args} />
      </div>
    </Section>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section title='Sizes'>
      <div style={rowStyle}>
        <Checkbox label='Small' size='sm' />
        <Checkbox label='Medium' size='md' />
        <Checkbox label='Large' size='lg' />
      </div>
    </Section>
  ),
};

export const States: Story = {
  render: () => (
    <Section title='States'>
      <div style={{ display: 'grid', gap: 12 }}>
        <Checkbox label='Unchecked' />
        <Checkbox label='Checked' defaultChecked />
        <Checkbox label='Indeterminate' indeterminate />
        <Checkbox label='Required' required />
        <Checkbox label='Disabled' disabled />
        <Checkbox label='Disabled checked' disabled defaultChecked />
        <Checkbox
          label='Error with description'
          description='This option is required to continue.'
          error='Accept the terms first.'
        />
      </div>
    </Section>
  ),
};

export const AccessibleWithoutVisibleLabel: Story = {
  args: {
    label: undefined,
    'aria-label': 'Enable notifications',
  },
  render: (args) => (
    <Section title='Accessible without visible label'>
      <Checkbox {...args} />
    </Section>
  ),
};
