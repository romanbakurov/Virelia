import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Input } from '../Input';

import type { InputProps } from './types';

const meta = {
  title: 'Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Input Component

Labeled text input primitive for short form values.

**Features**
- Controlled value
- Label and placeholder support
- Required and disabled states
- Validation error message
- Size variants: sm, md, and lg
- Optional overflow tooltip for long values

### Usage

Use Input for single-line values such as names, emails, phone numbers, and search text.

Correct usage:

\`\`\`tsx
<Input
  id='email'
  label='Email'
  value={email}
  onChange={setEmail}
  placeholder='name@company.com'
/>
\`\`\`
`,
      },
    },
  },
  args: {
    onChange: fn(),
  },
  argTypes: {
    id: {
      description: 'Unique input id used to connect the label with the input.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    label: {
      description: 'Text label displayed above or next to the input.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      description: 'Current input value for controlled usage.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    placeholder: {
      description: 'Placeholder text shown when the input is empty.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    size: {
      description: 'Input size.',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: `'sm' | 'md' | 'lg'` },
        defaultValue: { summary: 'md' },
      },
    },
    type: {
      description: 'Native input type.',
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      table: {
        type: {
          summary: `'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'`,
        },
        defaultValue: { summary: 'text' },
      },
    },
    required: {
      description: 'Marks the input as required.',
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
    error: {
      description: 'Validation error message displayed below the input.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    autoComplete: {
      description: 'Browser autocomplete hint.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    showOverflowTooltip: {
      description:
        'Shows a tooltip with the full value when the input text overflows.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onChange: {
      description: 'Called when the input value changes.',
      action: 'changed',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

const ControlledInputDemo = (args: InputProps) => {
  const [value, setValue] = useState(args.value ?? '');

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    args.onChange?.(nextValue);
  };

  return <Input {...args} value={value} onChange={handleChange} />;
};

const InputSizesDemo = () => {
  const [smallValue, setSmallValue] = useState('');
  const [mediumValue, setMediumValue] = useState('');
  const [largeValue, setLargeValue] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Input
        id='name-sm'
        label='Small'
        size='sm'
        value={smallValue}
        onChange={setSmallValue}
      />

      <Input
        id='name-md'
        label='Medium'
        size='md'
        value={mediumValue}
        onChange={setMediumValue}
      />

      <Input
        id='name-lg'
        label='Large'
        size='lg'
        value={largeValue}
        onChange={setLargeValue}
      />
    </div>
  );
};

export const Basic: Story = {
  args: {
    label: 'Email',
    placeholder: 'Type email...',
    required: false,
    value: '',
    size: 'md',
    type: 'email',
  },
  render: (args) => <ControlledInputDemo {...args} />,
};

export const Error: Story = {
  args: {
    label: 'Email',
    placeholder: 'Type email...',
    required: true,
    value: '',
    error: 'This field is required',
    size: 'md',
    type: 'email',
  },
  render: (args) => <ControlledInputDemo {...args} />,
};

export const Disabled: Story = {
  args: {
    label: 'Phone',
    placeholder: '+33 ___-__-__-__',
    value: '123456',
    disabled: true,
    size: 'md',
    type: 'tel',
  },
  render: (args) => <ControlledInputDemo {...args} />,
};

export const WithOverflowTooltip: Story = {
  args: {
    label: 'Company name',
    value:
      'Very long company name that does not fit into the input field and should be shown inside tooltip',
    size: 'md',
    showOverflowTooltip: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 260 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => <ControlledInputDemo {...args} />,
};

export const Sizes: Story = {
  render: () => <InputSizesDemo />,
};
