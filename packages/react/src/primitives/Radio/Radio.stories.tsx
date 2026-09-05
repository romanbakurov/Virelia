import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import { RadioGroup } from '../../components/RadioGroup';

import { Radio } from './index';

const noop = () => undefined;

const meta = {
  title: 'Primitives/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        // language=Markdown
        component: `
### Radio Component

A single radio control for selecting one option.

**Features**
- Controlled and uncontrolled usage
- Checked and unchecked states
- Selected colors: primary, neutral, success, warning and danger
- Custom selected indicator
- Optional label and description
- Required, disabled and error states
- Token-driven size, typography, color states, focus rings, and motion
- Standalone usage or composition inside RadioGroup
- Standard input and accessibility props

### Usage

Radio is primarily intended to be composed inside RadioGroup when users must
choose one option from a set.

Standalone usage:

\`\`\`tsx
<Radio
  value='email'
  label='Email notifications'
  checked={enabled}
  onCheckedChange={setEnabled}
/>
\`\`\`

Group usage:

\`\`\`tsx
<RadioGroup
  value={method}
  onValueChange={setMethod}
  label='Payment method'
>
  <Radio value='card' label='Card' />
  <Radio value='cash' label='Cash' />
</RadioGroup>
\`\`\`
`,
      },
    },
  },
  args: {
    name: 'country',
    value: 'country',
    label: 'Country',
    size: 'md',
    color: 'primary',
    disabled: false,
    required: false,
    onCheckedChange: noop,
  },
  argTypes: {
    value: {
      description: 'Value submitted by the radio control.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    label: {
      description: 'Text label displayed next to the radio control.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    description: {
      description: 'Additional supporting text displayed below the label.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    checked: {
      description: 'Current checked state for controlled usage.',
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
    required: {
      description: 'Marks the radio control as required.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      description: 'Size applied to all Radio controls in the group.',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      table: {
        type: {
          summary: `'sm' | 'md' | 'lg'`,
        },
        defaultValue: {
          summary: 'md',
        },
      },
    },
    color: {
      description: 'Selected radio color.',
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger'],
      table: {
        type: {
          summary: `'primary' | 'neutral' | 'success' | 'warning' | 'danger'`,
        },
        defaultValue: { summary: 'primary' },
      },
    },
    onCheckedChange: {
      description: 'Called when the standalone checked state changes.',
      action: 'changed',
      table: {
        type: { summary: '(checked: boolean) => void' },
      },
    },
    error: {
      description: 'Validation error message displayed under the radio.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    name: {
      description:
        'Native input name used to associate related radio controls.',
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
    icon: {
      description: 'Custom indicator rendered for the checked state.',
      control: false,
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
} satisfies Meta<typeof Radio>;

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

type RadioStoryProps = ComponentProps<typeof Radio>;

const InteractiveRadio = (args: RadioStoryProps) => {
  const [checked, setChecked] = useState(
    args.checked ?? args.defaultChecked ?? false
  );

  useEffect(() => {
    setChecked(args.checked ?? args.defaultChecked ?? false);
  }, [args.checked, args.defaultChecked]);

  return (
    <Radio
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
      <InteractiveRadio {...args} />
    </Section>
  ),
};

export const Default: Story = {
  args: {
    value: 'default',
    label: 'Select option',
  },
  render: (args) => (
    <Section title='Default'>
      <Radio {...args} />
    </Section>
  ),
};

export const Controlled: Story = {
  args: {
    value: 'notifications',
    label: 'Receive notifications',
    checked: false,
  },
  render: (args) => (
    <Section title='Controlled'>
      <InteractiveRadio {...args} />
    </Section>
  ),
};

export const Uncontrolled: Story = {
  args: {
    value: 'remember',
    label: 'Remember this option',
    defaultChecked: true,
  },
  render: (args) => (
    <Section title='Uncontrolled'>
      <Radio {...args} />
    </Section>
  ),
};

export const Checked: Story = {
  args: {
    value: 'checked',
    label: 'Selected option',
    checked: true,
  },
  render: (args) => (
    <Section title='Checked'>
      <Radio {...args} />
    </Section>
  ),
};

export const Unchecked: Story = {
  args: {
    value: 'unchecked',
    label: 'Unselected option',
    checked: false,
  },
  render: (args) => (
    <Section title='Unchecked'>
      <Radio {...args} />
    </Section>
  ),
};

export const WithDescription: Story = {
  args: {
    value: 'email',
    label: 'Email notifications',
    description: 'Receive important account updates by email.',
  },
  render: (args) => (
    <Section title='With description'>
      <Radio {...args} />
    </Section>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section title='Sizes'>
      <div
        style={{
          display: 'grid',
          gap: 24,
        }}
      >
        <RadioGroup
          name='country-small'
          label='Small'
          defaultValue='fr'
          size='sm'
        >
          <Radio value='fr' label='France' />
          <Radio value='es' label='Spain' />
          <Radio value='de' label='Germany' />
        </RadioGroup>

        <RadioGroup
          name='country-medium'
          label='Medium'
          defaultValue='fr'
          size='md'
        >
          <Radio value='fr' label='France' />
          <Radio value='es' label='Spain' />
          <Radio value='de' label='Germany' />
        </RadioGroup>

        <RadioGroup
          name='country-large'
          label='Large'
          defaultValue='fr'
          size='lg'
        >
          <Radio value='fr' label='France' />
          <Radio value='es' label='Spain' />
          <Radio value='de' label='Germany' />
        </RadioGroup>
      </div>
    </Section>
  ),
};

export const Colors: Story = {
  render: () => (
    <Section title='Colors'>
      <div style={{ display: 'grid', gap: 12 }}>
        <Radio value='primary' label='Primary' color='primary' defaultChecked />
        <Radio value='neutral' label='Neutral' color='neutral' defaultChecked />
        <Radio value='success' label='Success' color='success' defaultChecked />
        <Radio value='warning' label='Warning' color='warning' defaultChecked />
        <Radio value='danger' label='Danger' color='danger' defaultChecked />
      </div>
    </Section>
  ),
};

export const CustomIndicator: Story = {
  args: {
    value: 'custom-indicator',
    label: 'Custom indicator',
    color: 'success',
    checked: true,
    icon: <span aria-hidden='true'>✓</span>,
  },
  render: (args) => (
    <Section title='Custom indicator'>
      <Radio {...args} />
    </Section>
  ),
};

export const MixedSizes: Story = {
  render: () => (
    <Section title='Radio size overrides group size'>
      <RadioGroup
        name='mixed-sizes'
        label='Mixed sizes'
        defaultValue='medium'
        size='md'
      >
        <Radio value='small' label='Small override' size='sm' />
        <Radio value='medium' label='Inherited medium' />
        <Radio value='large' label='Large override' size='lg' />
      </RadioGroup>
    </Section>
  ),
};

export const Disabled: Story = {
  args: {
    value: 'disabled',
    label: 'Disabled option',
    disabled: true,
  },
  render: (args) => (
    <Section title='Disabled'>
      <Radio {...args} />
    </Section>
  ),
};

export const DisabledChecked: Story = {
  args: {
    value: 'disabled-checked',
    label: 'Selected but unavailable',
    disabled: true,
    checked: true,
  },
  render: (args) => (
    <Section title='Disabled checked'>
      <Radio {...args} />
    </Section>
  ),
};

export const DisabledUnchecked: Story = {
  args: {
    value: 'disabled-unchecked',
    label: 'Unavailable option',
    disabled: true,
    checked: false,
  },
  render: (args) => (
    <Section title='Disabled unchecked'>
      <Radio {...args} />
    </Section>
  ),
};

export const Error: Story = {
  args: {
    value: 'error',
    label: 'Select this option',
    description: 'This choice is required to continue.',
    error: 'You must select an option.',
    checked: false,
  },
  render: (args) => (
    <Section title='Error'>
      <Radio {...args} />
    </Section>
  ),
};

export const GroupComposition: Story = {
  render: () => (
    <Section title='Radio group'>
      <RadioGroup defaultValue='email' name='contact-method'>
        <div style={{ display: 'grid', gap: 6 }}>
          <Radio value='email' label='Email' />
          <Radio value='phone' label='Phone' />
          <Radio value='post' label='Post' />
        </div>
      </RadioGroup>
    </Section>
  ),
};

export const States: Story = {
  render: () => (
    <Section title='States'>
      <div style={{ display: 'grid', gap: 12 }}>
        <Radio value='unchecked' label='Unchecked' />
        <Radio value='checked' label='Checked' defaultChecked />
        <Radio value='required' label='Required' required />
        <Radio value='disabled' label='Disabled' disabled />
        <Radio
          value='disabled-checked'
          label='Disabled checked'
          disabled
          defaultChecked
        />
        <Radio
          value='description'
          label='With description'
          description='Additional information about this choice.'
        />
        <Radio
          value='error'
          label='Error with description'
          description='This option is required to continue.'
          error='Select an option first.'
        />
      </div>
    </Section>
  ),
};

export const AccessibleWithoutVisibleLabel: Story = {
  args: {
    value: 'accessible',
    label: undefined,
    'aria-label': 'Enable email notifications',
  },
  render: (args) => (
    <Section title='Accessible without visible label'>
      <Radio {...args} />
    </Section>
  ),
};
