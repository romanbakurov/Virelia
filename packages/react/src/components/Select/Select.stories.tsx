import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Select } from './Select';
import type { SelectProps } from './types';

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
- Label, description, and placeholder support
- Controlled and uncontrolled value support
- Native form submission through hidden input
- Disabled state
- Disabled options
- Validation error message
- Keyboard navigation and Escape close behavior
- Floating dropdown with trigger-width matching

### Accessibility

The trigger exposes combobox semantics and updates its expanded state when the list opens or closes.
Error text is connected to the trigger through \`aria-describedby\`.

Correct usage:

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
    options: defaultOptions,
    onChange: fn(),
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
      description: 'Text label displayed above the Select.',
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
      description: 'Validation error message displayed below the select.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    className: {
      description: 'Additional class name for the Select root field wrapper.',
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
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

const SelectWithState = (args: SelectProps) => {
  const [value, setValue] = useState(args.value ?? args.defaultValue ?? '');

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

export const Basic: Story = {
  args: {
    value: '',
  },
  render: (args) => <SelectWithState {...args} />,
};

export const WithDescription: Story = {
  args: {
    value: '',
    description: 'Choose your country of residence.',
  },
  render: (args) => <SelectWithState {...args} />,
};

export const WithValue: Story = {
  args: {
    value: 'fr',
  },
  render: (args) => <SelectWithState {...args} />,
};

export const WithError: Story = {
  args: {
    id: 'country-error-example',
    value: '',
    required: true,
    error: 'This field is required',
  },
  render: (args) => <SelectWithState {...args} />,
};

export const OptionWithDisabled: Story = {
  args: {
    value: '',
    options: optionsWithDisabled,
  },
  render: (args) => <SelectWithState {...args} />,
};

export const Disabled: Story = {
  args: {
    value: 'fr',
    disabled: true,
  },
  render: (args) => <SelectWithState {...args} />,
};

export const WithFormName: Story = {
  args: {
    id: 'country',
    name: 'country',
    value: 'fr',
    description: 'This value is submitted through a hidden input.',
  },
  render: (args) => <SelectWithState {...args} />,
};

export const Selection: Story = {
  args: {
    value: '',
  },
  render: (args) => <SelectWithState {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    const combobox = canvas.getByRole('combobox');

    await userEvent.click(combobox);

    await expect(combobox).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(body.getByRole('option', { name: 'France' }));

    await expect(combobox).toHaveTextContent('France');
    await expect(combobox).toHaveAttribute('aria-expanded', 'false');
  },
};

export const CloseOnEscape: Story = {
  args: {
    value: '',
  },
  render: (args) => <SelectWithState {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const combobox = canvas.getByRole('combobox');

    await userEvent.click(combobox);

    await expect(combobox).toHaveAttribute('aria-expanded', 'true');

    await userEvent.keyboard('{Escape}');

    await expect(combobox).toHaveAttribute('aria-expanded', 'false');
  },
};
