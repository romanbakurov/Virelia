import type { Meta, StoryObj } from '@storybook/react';
import { Text, TextInput, View } from 'react-native';

import { useTheme } from '../../theme';

import { FormField } from './FormField';

function DemoControl({
  placeholder,
  error = false,
  disabled = false,
}: {
  placeholder: string;
  error?: boolean;
  disabled?: boolean;
}) {
  const { theme } = useTheme();

  return (
    <TextInput
      editable={!disabled}
      placeholder={placeholder}
      placeholderTextColor={
        disabled
          ? theme.components.input.disabled.placeholder
          : theme.components.input.default.placeholder
      }
      style={{
        width: '100%',
        minHeight: 44,
        paddingHorizontal: theme.tokens.spacing[4],
        color: disabled
          ? theme.components.input.disabled.fg
          : theme.components.input.default.fg,
        backgroundColor: disabled
          ? theme.components.input.disabled.bg
          : theme.components.input.default.bg,
        borderColor: error
          ? theme.components.input.error.border
          : disabled
            ? theme.components.input.disabled.border
            : theme.components.input.default.border,
        borderWidth: 1,
        borderRadius: theme.tokens.radius.md,
        fontSize: theme.tokens.typography.size.md,
        fontFamily: theme.tokens.typography.family.regular,
      }}
    />
  );
}

const meta = {
  title: 'Patterns/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### FormField Pattern

Composable field wrapper for custom form controls in React Native.

**Features**
- Label
- Description
- Required indicator
- Error message
- Disabled state
- Works with any custom form control

### Usage

Use FormField when building custom form controls or composing your own field layouts.

Components such as Input, Select, Checkbox and RadioGroup already include FormField internally and should not be wrapped again.

Correct usage:

\`\`\`tsx
<FormField
  label="Workspace"
  description="Visible to other users."
  required
>
  <TextInput placeholder="vellira-design" />
</FormField>
\`\`\`

### Accessibility

- Associates labels and helper content
- Exposes disabled state
- Displays validation messages
- Supports custom controls

### Common use cases

- Custom text inputs
- Date pickers
- Color pickers
- File upload controls
- Third-party form components
`,
      },
    },
  },
  args: {
    label: 'Label',
    children: <Text>Field content</Text>,
  },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
    children: { control: false },
  },
  decorators: [
    (Story) => {
      const { theme } = useTheme();

      return (
        <View style={{ width: '100%', padding: theme.tokens.spacing[4] }}>
          <Story />
        </View>
      );
    },
  ],
} satisfies Meta<typeof FormField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Full name',
    children: <DemoControl placeholder='Alex Johnson' />,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Username',
    description:
      'Use 3–20 characters. Letters, numbers, and underscores are allowed.',
    children: <DemoControl placeholder='alex_johnson' />,
  },
};

export const Required: Story = {
  args: {
    label: 'Full name',
    required: true,
    children: <DemoControl placeholder='Alex Johnson' />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    required: true,
    error: 'Enter a valid email',
    children: <DemoControl placeholder='name@company.com' error />,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled field',
    disabled: true,
    children: <DemoControl placeholder='Not editable' disabled />,
  },
};

export const CustomContent: Story = {
  args: {
    label: 'Custom content',
    description: 'FormField can wrap any custom form control.',
    children: <Text>Field content</Text>,
  },
};

export const CompleteExample: Story = {
  args: {
    label: 'Email',
    description: 'We will use this email for account notifications.',
    required: true,
    error: 'Email is required',
    children: <DemoControl placeholder='name@company.com' error />,
  },
};
