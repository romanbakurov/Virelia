import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { RadioGroup } from './RadioGroup';
import type { RadioGroupProps } from './types';

const options = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
  { label: 'Enterprise', value: 'enterprise' },
];

const optionsWithDisabled = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro', disabled: true },
  { label: 'Enterprise', value: 'enterprise' },
];

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### RadioGroup Component

Accessible radio button group for selecting a single option in React Native.

**Features**
- Single selection
- Label and description
- Required indicator
- Error message
- Disabled state
- Controlled and uncontrolled usage

### Usage

Use RadioGroup when users must choose exactly one option from a predefined list.

Correct usage:

\`\`\`tsx
<RadioGroup
  label="Plan"
  options={[
    { label: 'Starter', value: 'starter' },
    { label: 'Pro', value: 'pro' },
    { label: 'Enterprise', value: 'enterprise' },
  ]}
  value={value}
  onChange={setValue}
/>
\`\`\`

### Accessibility

- Accessible radio group
- Individual radio button semantics
- Keyboard and screen reader support
- Disabled state support
- Validation message support

### Common use cases

- Subscription plans
- Payment methods
- Account preferences
- Shipping options
- Settings
`,
      },
    },
  },
  args: {
    label: 'Plan',
    defaultValue: 'pro',
    options,
    orientation: 'vertical',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Text label displayed above the RadioGroup.',
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the label.',
    },
    defaultValue: {
      control: 'text',
      description: 'Initial selected value for uncontrolled usage.',
    },
    value: {
      control: 'text',
      description: 'Current selected value for controlled usage.',
    },
    options: {
      control: 'object',
      description: 'List of radio options.',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout direction of the radio options.',
    },
    required: {
      control: 'boolean',
      description: 'Marks the radio group as required.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all radio options in the group.',
    },
    error: {
      control: 'text',
      description: 'Validation error message displayed below the group.',
    },
    onChange: {
      action: 'changed',
      description: 'Called when the selected value changes.',
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const RadioGroupWithState = (args: RadioGroupProps) => {
  const [value, setValue] = useState(args.value ?? args.defaultValue ?? '');

  return (
    <RadioGroup
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
  render: (args) => <RadioGroupWithState {...args} />,
};

export const WithDescription: Story = {
  args: {
    description: 'Choose the plan that fits your current needs.',
  },
  render: (args) => <RadioGroupWithState {...args} />,
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => <RadioGroupWithState {...args} />,
};

export const Required: Story = {
  args: {
    required: true,
    label: 'Required plan',
  },
  render: (args) => <RadioGroupWithState {...args} />,
};

export const WithError: Story = {
  args: {
    error: 'Select a plan to continue',
    defaultValue: '',
  },
  render: (args) => <RadioGroupWithState {...args} />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => <RadioGroupWithState {...args} />,
};

export const WithDisabledOption: Story = {
  args: {
    options: optionsWithDisabled,
  },
  render: (args) => <RadioGroupWithState {...args} />,
};
