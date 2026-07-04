import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Select } from './Select';
import type { SelectProps } from './types';

const options = [
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
  { label: 'France', value: 'fr' },
  { label: 'Spain', value: 'es' },
  { label: 'Germany', value: 'de' },
  { label: 'Italy', value: 'it' },
  { label: 'Portugal', value: 'pt' },
  { label: 'Belgium', value: 'be' },
  { label: 'Netherlands', value: 'nl' },
  { label: 'Switzerland', value: 'ch' },
];

const meta = {
  title: 'Components/Select',
  tags: ['autodocs'],
  component: Select,
  parameters: {
    docs: {
      description: {
        component: `
### Select Component

Native single-value select control for choosing from a predefined list.

**Features**
- Native platform picker behavior
- Label, description, and placeholder support
- Controlled and uncontrolled value support
- Required and disabled states
- Disabled options
- Validation error message

### Usage

Use Select for form values such as country, language, currency, or category.

Correct usage:

\`\`\`tsx
<Select
  label='Country'
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
    options,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Text label displayed above the Select.',
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the label.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when no value is selected.',
    },
    value: {
      control: 'text',
      description: 'Current selected value for controlled usage.',
    },
    defaultValue: {
      control: 'text',
      description: 'Initial selected value for uncontrolled usage.',
    },
    options: {
      control: 'object',
      description: 'List of select options.',
    },
    required: {
      control: 'boolean',
      description: 'Marks the select as required.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the select.',
    },
    error: {
      control: 'text',
      description: 'Validation error message displayed below the select.',
    },
    onChange: {
      action: 'changed',
      description: 'Called when the selected value changes.',
    },
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

const ControlledSelectDemo = (args: SelectProps) => {
  const [value, setValue] = useState(args.value ?? args.defaultValue ?? '');

  return (
    <Select
      {...args}
      value={value}
      onChange={(nextValue) => {
        setValue(nextValue);
        args.onChange?.(nextValue);
      }}
    />
  );
};

export const Default: Story = {
  render: (args) => <ControlledSelectDemo {...args} />,
};

export const WithDescription: Story = {
  args: {
    description: 'Choose your country of residence.',
  },
  render: (args) => <ControlledSelectDemo {...args} />,
};

export const WithValue: Story = {
  args: {
    defaultValue: 'fr',
  },
  render: (args) => <ControlledSelectDemo {...args} />,
};

export const Required: Story = {
  args: {
    required: true,
  },
  render: (args) => <ControlledSelectDemo {...args} />,
};

export const WithError: Story = {
  args: {
    required: true,
    error: 'Country is required',
  },
  render: (args) => <ControlledSelectDemo {...args} />,
};

export const Disabled: Story = {
  args: {
    defaultValue: 'de',
    disabled: true,
  },
  render: (args) => <ControlledSelectDemo {...args} />,
};

export const WithDisabledOption: Story = {
  args: {
    options: optionsWithDisabled,
  },
  render: (args) => <ControlledSelectDemo {...args} />,
};

export const LongList: Story = {
  args: {
    options: longOptions,
  },
  render: (args) => <ControlledSelectDemo {...args} />,
};
