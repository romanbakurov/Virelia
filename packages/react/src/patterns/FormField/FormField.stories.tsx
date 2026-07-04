import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';

import { Checkbox } from '../../primitives/Checkbox';
import { Input } from '../../primitives/Input';
import { FormField } from '../FormField';

const inputStyle = {
  width: '100%',
  padding: 'var(--space-3) var(--space-4)',
  color: 'var(--color-gray-900)',
  font: 'inherit',
  backgroundColor: 'var(--color-gray-0)',
  border: '1px solid var(--color-gray-200)',
  borderRadius: 'var(--radius-md)',
  outline: 'none',
} satisfies CSSProperties;

const errorInputStyle = {
  ...inputStyle,
  borderColor: 'var(--color-error)',
} satisfies React.CSSProperties;

const disabledInputStyle = {
  ...inputStyle,
  color: 'var(--color-gray-500)',
  backgroundColor: 'var(--color-gray-100)',
  cursor: 'not-allowed',
  opacity: 0.6,
} satisfies React.CSSProperties;

const meta = {
  title: 'Patterns/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### FormField Pattern

Layout wrapper for composing labels, descriptions, validation text, and custom form controls.

**Features**
- Label rendering
- Optional description text
- Required marker
- Error message area
- Disabled state styling
- Works with native inputs or custom Vellira controls

### Usage

Use FormField when a control needs consistent spacing and validation presentation but the control itself is custom.

Correct usage:

\`\`\`tsx
<FormField id='email' label='Email' required error={emailError}>
  <input
    id='email'
    value={email}
    onChange={handleEmailChange}
  />
</FormField>
\`\`\`

Important: FormField does not automatically inject ids into children. Pass the same id to FormField and the control.
`,
      },
    },
  },
  argTypes: {
    id: {
      description: 'ID used to associate the label with the form control.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    label: {
      description: 'Field label displayed above the control.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      description: 'Optional helper text displayed between label and control.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      description: 'Form control rendered inside the field.',
      control: false,
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    required: {
      description: 'Displays a required indicator next to the label.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      description: 'Applies disabled styling to the field wrapper.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      description: 'Validation error message displayed below the field.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    className: {
      description: 'Additional class name for the field wrapper.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof FormField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithInput: Story = {
  args: {
    id: 'email',
    label: 'Email',
    children: (
      <Input
        id='email'
        type='email'
        placeholder='name@company.com'
        style={inputStyle}
      />
    ),
  },
};

export const WithDescription: Story = {
  args: {
    id: 'username',
    label: 'Username',
    description:
      'Use 3–20 characters. Letters, numbers, and underscores are allowed.',
    children: (
      <Input
        id='username'
        type='text'
        placeholder='alex_johnson'
        style={inputStyle}
      />
    ),
  },
};

export const Required: Story = {
  args: {
    id: 'full-name',
    label: 'Full name',
    required: true,
    children: (
      <Input
        id='full-name'
        type='text'
        placeholder='Alex Johnson'
        style={inputStyle}
      />
    ),
  },
};

export const WithError: Story = {
  args: {
    id: 'password',
    label: 'Password',
    error: 'Password must be at least 8 characters',
    children: (
      <Input
        id='password'
        type='password'
        placeholder='Enter password'
        aria-invalid='true'
        aria-describedby='password-error'
        style={errorInputStyle}
      />
    ),
  },
};

export const Disabled: Story = {
  args: {
    id: 'disabled-email',
    label: 'Email',
    disabled: true,
    children: (
      <Input
        id='disabled-email'
        disabled
        type='email'
        placeholder='name@company.com'
        style={disabledInputStyle}
      />
    ),
  },
};

export const WithCheckbox: Story = {
  args: {
    id: 'agreement',
    label: 'Agreement',
    description: 'This example shows FormField with a custom Vellira control.',
    children: <Checkbox label='Accept terms and conditions' />,
  },
};

export const CompleteExample: Story = {
  args: {
    id: 'complete-email',
    label: 'Email',
    description: 'We will use this email for account notifications.',
    required: true,
    error: 'Email is required',
    children: (
      <Input
        id='complete-email'
        type='email'
        placeholder='name@company.com'
        aria-invalid='true'
        aria-describedby='complete-email-error'
        style={errorInputStyle}
      />
    ),
  },
};
