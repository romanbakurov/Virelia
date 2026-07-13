import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { fn } from 'storybook/test';

import { Select } from './Select';

const defaultOptions = [
  { label: 'France', value: 'fr' },
  { label: 'Spain', value: 'es' },
  { label: 'Germany', value: 'de' },
];

const optionsWithDisabled = [
  { label: 'France', value: 'fr' },
  { label: 'Spain', value: 'es', disabled: true },
  { label: 'Germany', value: 'de' },
];

const longOptions = [
  {
    label: 'France - European workspace with a deliberately long label',
    value: 'fr',
  },
  { label: 'Spain - Customer success and regional operations', value: 'es' },
  { label: 'Germany - Engineering platform team', value: 'de' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Select Component

Single-value select control for choosing from a predefined list.

**Features**
- Label, description, and ReactNode error support
- Controlled and uncontrolled value support
- Controlled and uncontrolled open state
- Native form submission through hidden input
- Sizes, disabled state, required state, and disabled options
- Keyboard navigation, Escape close behavior, and selected option indicator
- Floating dropdown placement with trigger-width matching

### Usage

\`\`\`tsx
<Select
  label='Country'
  description='Choose your country of residence.'
  value={country}
  onChange={setCountry}
  placeholder='Select country...'
  options={countries}
/>
\`\`\`
`,
      },
    },
  },
  args: {
    label: 'Country',
    placeholder: 'Select country...',
    size: 'md',
    placement: 'bottom-start',
    matchTriggerWidth: true,
    disabled: false,
    required: false,
    options: defaultOptions,
    onChange: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    id: {
      description:
        'Unique select id used to connect the label, error text, and trigger.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    label: {
      description: 'Content displayed as the Select label.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    description: {
      description: 'Supporting content displayed below the label.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    name: {
      description: 'Hidden input name used for native HTML form submission.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    placeholder: {
      description: 'Placeholder text shown when no value is selected.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      description: 'Current selected value for controlled usage.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    defaultValue: {
      description: 'Initial selected value for uncontrolled usage.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    options: {
      description: 'List of select options.',
      control: 'object',
      table: {
        type: {
          summary:
            'Array<{ label: string; value: string; disabled?: boolean }>',
        },
      },
    },
    size: {
      description: 'Visual size of the Select trigger.',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: `'sm' | 'md' | 'lg'` },
        defaultValue: { summary: 'md' },
      },
    },
    placement: {
      description: 'Preferred dropdown placement.',
      control: 'select',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
      table: {
        type: {
          summary: `'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'`,
        },
        defaultValue: { summary: 'bottom-start' },
      },
    },
    matchTriggerWidth: {
      description: 'Matches dropdown width to the trigger width.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    open: {
      description: 'Controlled open state.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
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
    required: {
      description: 'Marks the select as required.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      description: 'Disables the select trigger and prevents interaction.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      description: 'Validation content displayed below the Select.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      description: 'Additional class name for the Select root field wrapper.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    triggerClassName: {
      description: 'Additional class name for the trigger element.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    dropdownClassName: {
      description: 'Additional class name for the dropdown element.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    onChange: {
      description: 'Called when the selected value changes.',
      action: 'changed',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
    onOpenChange: {
      description: 'Called when the open state changes.',
      action: 'open changed',
      table: {
        type: { summary: '(open: boolean) => void' },
      },
    },
  },
} satisfies Meta<typeof Select>;

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

const gridStyle = {
  display: 'grid',
  gap: 16,
} satisfies CSSProperties;

const customLabelStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
} satisfies CSSProperties;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={sectionStyle}>
      <h3 style={subtitleStyle}>{title}</h3>
      {children}
    </section>
  );
}

type SelectStoryProps = ComponentProps<typeof Select>;

const SelectWithState = (args: SelectStoryProps) => {
  const [value, setValue] = useState(args.value ?? args.defaultValue ?? '');

  useEffect(() => {
    setValue(args.value ?? args.defaultValue ?? '');
  }, [args.value, args.defaultValue]);

  return (
    <Select
      {...args}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        args.onChange?.(newValue);
      }}
    />
  );
};

const SelectWithOpenState = (args: SelectStoryProps) => {
  const [open, setOpen] = useState(args.open ?? args.defaultOpen ?? true);

  useEffect(() => {
    setOpen(args.open ?? args.defaultOpen ?? true);
  }, [args.open, args.defaultOpen]);

  return (
    <Select
      {...args}
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        args.onOpenChange?.(nextOpen);
      }}
    />
  );
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Section title='Playground'>
      <SelectWithState {...args} />
    </Section>
  ),
};

export const Default: Story = {
  args: {
    defaultValue: '',
  },
  render: (args) => (
    <Section title='Default'>
      <Select {...args} />
    </Section>
  ),
};

export const Controlled: Story = {
  args: {
    value: 'fr',
  },
  render: (args) => (
    <Section title='Controlled'>
      <SelectWithState {...args} />
    </Section>
  ),
};

export const Uncontrolled: Story = {
  args: {
    defaultValue: 'fr',
  },
  render: (args) => (
    <Section title='Uncontrolled'>
      <Select {...args} />
    </Section>
  ),
};

export const WithDescription: Story = {
  args: {
    defaultValue: '',
    description: 'Choose your country of residence.',
  },
  render: (args) => (
    <Section title='With description'>
      <SelectWithState {...args} />
    </Section>
  ),
};

export const Required: Story = {
  args: {
    required: true,
    defaultValue: '',
  },
  render: (args) => (
    <Section title='Required'>
      <SelectWithState {...args} />
    </Section>
  ),
};

export const WithError: Story = {
  args: {
    id: 'country-error-example',
    required: true,
    value: '',
    error: 'Select a country to continue.',
  },
  render: (args) => (
    <Section title='With error'>
      <SelectWithState {...args} />
    </Section>
  ),
};

export const Disabled: Story = {
  args: {
    value: 'fr',
    disabled: true,
  },
  render: (args) => (
    <Section title='Disabled'>
      <SelectWithState {...args} />
    </Section>
  ),
};

export const DisabledOption: Story = {
  args: {
    value: '',
    options: optionsWithDisabled,
  },
  render: (args) => (
    <Section title='Disabled option'>
      <SelectWithState {...args} />
    </Section>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section title='Sizes'>
      <div style={gridStyle}>
        <Select
          label='Small'
          placeholder='Small select'
          size='sm'
          options={defaultOptions}
        />
        <Select
          label='Medium'
          placeholder='Medium select'
          size='md'
          options={defaultOptions}
        />
        <Select
          label='Large'
          placeholder='Large select'
          size='lg'
          options={defaultOptions}
        />
      </div>
    </Section>
  ),
};

export const Placements: Story = {
  render: () => (
    <Section title='Placements'>
      <div style={gridStyle}>
        <Select
          label='Bottom start'
          defaultOpen
          placement='bottom-start'
          options={defaultOptions}
        />
        <Select
          label='Bottom end'
          defaultOpen
          placement='bottom-end'
          options={defaultOptions}
        />
      </div>
    </Section>
  ),
};

export const ControlledOpen: Story = {
  args: {
    defaultOpen: true,
    defaultValue: 'fr',
  },
  render: (args) => (
    <Section title='Controlled open'>
      <SelectWithOpenState {...args} />
    </Section>
  ),
};

export const MatchTriggerWidthDisabled: Story = {
  args: {
    defaultOpen: true,
    matchTriggerWidth: false,
    options: longOptions,
    placeholder: 'Select a team with a long label',
  },
  render: (args) => (
    <Section title='Dropdown natural width'>
      <SelectWithOpenState {...args} />
    </Section>
  ),
};

export const CustomContent: Story = {
  render: () => (
    <Section title='Custom content'>
      <Select
        label={
          <span style={customLabelStyle}>
            Country
            <span
              style={{
                padding: '2px 6px',
                color: 'var(--color-primary-50)',
                fontSize: 12,
                lineHeight: '16px',
                background: 'var(--color-primary-600)',
                borderRadius: 'var(--radius-full)',
              }}
            >
              Required
            </span>
          </span>
        }
        description={
          <span>
            This example uses ReactNode label, description, and validation
            content.
          </span>
        }
        error={<strong>Select an available country.</strong>}
        options={optionsWithDisabled}
        required
      />
    </Section>
  ),
};

export const States: Story = {
  render: () => (
    <Section title='States'>
      <div style={gridStyle}>
        <Select label='Default' options={defaultOptions} />
        <Select label='With value' defaultValue='fr' options={defaultOptions} />
        <Select
          label='Required'
          required
          placeholder='Required select'
          options={defaultOptions}
        />
        <Select
          label='Disabled'
          defaultValue='fr'
          disabled
          options={defaultOptions}
        />
        <Select
          label='Error'
          error='This field is required.'
          options={defaultOptions}
        />
      </div>
    </Section>
  ),
};

export const WithFormName: Story = {
  args: {
    id: 'country',
    name: 'country',
    defaultValue: 'fr',
    description: 'This value is submitted through a hidden input.',
  },
  render: (args) => (
    <Section title='Form submission'>
      <Select {...args} />
    </Section>
  ),
};

export const Selection: Story = {
  args: {
    defaultValue: 'fr',
  },
  render: (args) => (
    <Section title='Selection'>
      <SelectWithState {...args} />
    </Section>
  ),
};

export const OpenDropdown: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Open dropdown'>
      <SelectWithState {...args} />
    </Section>
  ),
};

export const DisabledOptionsOpen: Story = {
  args: {
    options: optionsWithDisabled,
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Disabled options'>
      <SelectWithState {...args} />
    </Section>
  ),
};
