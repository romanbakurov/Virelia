import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { Search as SearchIcon } from '@vellira-ui/icons';

import { Input } from './Input';
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

Text input primitive for collecting user data in forms.

**Features**
- Controlled and uncontrolled usage
- Multiple input types
- Three size variants
- Required state
- Disabled state
- Validation error message
- Accessible label support

### Usage

Use Input when users need to enter text, email addresses, passwords, numbers, or search queries.

Correct usage:

\`\`\`tsx
<Input
  label="Email"
  placeholder="name@company.com"
  value={email}
  onChange={setEmail}
/>
\`\`\`

### Accessibility

- Associated form label
- Required state support
- Error state support
- Native keyboard and screen reader support

### Common use cases

- Login and registration forms
- Search fields
- Profile settings
- Contact forms
- Data entry forms
`,
      },
    },
  },
  args: {
    label: 'Email',
    placeholder: 'name@company.com',
    size: 'md',
    type: 'email',
  },
  argTypes: {
    label: {
      description: 'Label displayed above the input.',
      control: 'text',
    },

    value: {
      description: 'Current input value.',
      control: 'text',
    },

    placeholder: {
      description: 'Placeholder text displayed when empty.',
      control: 'text',
    },

    size: {
      description: 'Input size variant.',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },

    type: {
      description: 'Native input type.',
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },

    required: {
      description: 'Marks the input as required.',
      control: 'boolean',
    },

    disabled: {
      description: 'Disables user interaction.',
      control: 'boolean',
    },

    error: {
      description: 'Validation error message.',
      control: 'text',
    },

    onChange: {
      description: 'Called when the input value changes.',
      action: 'changed',
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

export const Default: Story = {
  render: (args) => <ControlledInputDemo {...args} />,
};

export const WithValue: Story = {
  args: {
    value: 'hello@vellira.dev',
  },
  render: (args) => <ControlledInputDemo {...args} />,
};

export const Required: Story = {
  args: {
    required: true,
    label: 'Full name',
    placeholder: 'Alex Johnson',
    type: 'text',
  },
  render: (args) => <ControlledInputDemo {...args} />,
};

export const WithError: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password',
    error: 'Password is required',
  },
  render: (args) => <ControlledInputDemo {...args} />,
};

export const Disabled: Story = {
  args: {
    label: 'Disabled input',
    value: 'Not editable',
    disabled: true,
    type: 'text',
  },
  render: (args) => <ControlledInputDemo {...args} />,
};

export const Search: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search components...',
    type: 'search',
    leftIcon: <SearchIcon />,
  },
  render: (args) => <ControlledInputDemo {...args} />,
};

export const Number: Story = {
  args: {
    label: 'Age',
    placeholder: '32',
    type: 'number',
  },
  render: (args) => <ControlledInputDemo {...args} />,
};

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Small input',
    type: 'text',
  },
  render: (args) => <ControlledInputDemo {...args} />,
};

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Large input',
    type: 'text',
  },
  render: (args) => <ControlledInputDemo {...args} />,
};
