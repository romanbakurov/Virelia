import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { RadioGroup } from '../RadioGroup';

import type { RadioGroupProps } from './types';

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

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### RadioGroup Component

Grouped radio control for selecting exactly one option.

**Features**
- Label and description support
- Controlled and uncontrolled value support
- Vertical and horizontal orientation
- Required state
- Disabled group state
- Disabled individual options
- Validation error message
- Native radio input semantics

### Accessibility

RadioGroup uses native radio inputs inside a \`radiogroup\`.
Error and description text are connected through \`aria-describedby\`.

Correct usage:

\`\`\`tsx
<RadioGroup
  name='country'
  label='Country'
  description='Choose your country of residence.'
  value={country}
  onChange={setCountry}
  options={countries}
/>
\`\`\`
`,
      },
    },
  },
  args: {
    name: 'country',
    label: 'Country',
    placeholder: undefined,
    options: defaultOptions,
    orientation: 'vertical',
    onChange: fn(),
  },
  argTypes: {
    label: {
      description: 'Text label displayed above the RadioGroup.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      description: 'Helper text displayed below the label.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    name: {
      description: 'Radio group name shared by all radio options.',
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
      description: 'List of radio options.',
      control: 'object',
      table: {
        type: {
          summary:
            'Array<{ label: string; value: string; disabled?: boolean }>',
        },
      },
    },
    orientation: {
      description: 'Layout direction of the radio options.',
      control: 'radio',
      options: ['vertical', 'horizontal'],
      table: {
        type: { summary: `'vertical' | 'horizontal'` },
        defaultValue: { summary: 'vertical' },
      },
    },
    required: {
      description: 'Marks the radio group as required.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      description: 'Disables all radio options in the group.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      description: 'Validation error message displayed below the group.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    className: {
      description: 'Additional class name for the RadioGroup root.',
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

export const Basic: Story = {
  args: {
    defaultValue: 'fr',
  },
  render: (args) => <RadioGroupWithState {...args} />,
};

export const WithDescription: Story = {
  args: {
    defaultValue: 'fr',
    description: 'Choose your country of residence.',
  },
  render: (args) => <RadioGroupWithState {...args} />,
};

export const Required: Story = {
  args: {
    required: true,
    defaultValue: 'fr',
  },
  render: (args) => <RadioGroupWithState {...args} />,
};

export const WithError: Story = {
  args: {
    required: true,
    defaultValue: '',
    error: 'Please select a country',
  },
  render: (args) => <RadioGroupWithState {...args} />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'fr',
  },
  render: (args) => <RadioGroupWithState {...args} />,
};

export const DisabledOption: Story = {
  args: {
    defaultValue: 'fr',
    options: optionsWithDisabled,
  },
  render: (args) => <RadioGroupWithState {...args} />,
};

export const Horizontal: Story = {
  args: {
    defaultValue: 'fr',
    orientation: 'horizontal',
  },
  render: (args) => <RadioGroupWithState {...args} />,
};

export const Selection: Story = {
  args: {
    defaultValue: '',
  },
  render: (args) => <RadioGroupWithState {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const spainInput = canvas.getByLabelText('Spain');
    const spainLabel = spainInput.closest('label');

    expect(spainLabel).not.toBeNull();

    await userEvent.click(spainLabel as HTMLLabelElement);

    await expect(spainInput).toBeChecked();
  },
};
