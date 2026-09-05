import type { Meta, StoryObj } from '@storybook/react-native';
import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Input } from '../../primitives';
import { useTheme } from '../../theme';

import { FormField } from './FormField';

function DemoControl({
  placeholder,
  accessibilityLabel,
  error = false,
  disabled = false,
}: {
  placeholder: string;
  accessibilityLabel?: string;
  error?: boolean;
  disabled?: boolean;
}) {
  const { theme } = useTheme();

  return (
    <TextInput
      accessibilityLabel={accessibilityLabel ?? placeholder}
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

const meta: Meta<typeof FormField> = {
  title: 'Patterns/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        // language=Markdown
        component: `
### FormField Pattern

Composable field wrapper for custom form controls in React Native.

**Features**

- Label and custom label content
- Description and custom supporting content
- Lower message slot with neutral, success, warning, or danger tone
- Error message replaces lower message and announces through a live region
- Required indicator
- Error message and custom error content
- Disabled visual state
- Size and state context for Vellira controls
- Control layout customization
- Works with any custom form control

### Usage

Use FormField when building custom form controls or composing field layouts.

Controls such as Input can inherit size, required, disabled and invalid state from FormField.

\`\`\`tsx
<FormField
  label='Workspace'
  description='Visible to other users.'
  required
>
  <Input placeholder='vellira-design' />
</FormField>
\`\`\`

### Accessibility

FormField provides visual field structure and announces error content with a polite live region. Vellira controls consume FormField context automatically; custom controls can still use FormField as a visual and semantic wrapper.
`,
      },
    },
  },
  args: {
    label: 'Label',
    message: '',
    messageTone: 'neutral',
    messageLive: 'off',
    required: false,
    disabled: false,
    invalid: false,
    size: 'md',
    children: <Text>Field content</Text>,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label content displayed above the control.',
    },

    description: {
      control: 'text',
      description: 'Supporting content displayed below the label.',
    },

    error: {
      control: 'text',
      description: 'Validation content displayed below the control.',
    },

    message: {
      control: 'text',
      description:
        'Supporting result or status content displayed below the control.',
    },

    messageTone: {
      control: 'radio',
      options: ['neutral', 'success', 'warning', 'danger'],
      description: 'Visual tone for message content.',
    },

    messageLive: {
      control: 'radio',
      options: ['off', 'polite'],
      description: 'Live region behavior for non-error message content.',
    },

    required: {
      control: 'boolean',
      description: 'Displays the required indicator next to the label.',
    },

    disabled: {
      control: 'boolean',
      description: 'Applies disabled styling to field text.',
    },

    invalid: {
      control: 'boolean',
      description: 'Marks the field invalid without requiring error text.',
    },

    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Field size passed to compatible controls through context.',
    },

    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
    },

    labelPosition: {
      control: 'radio',
      options: ['top', 'start'],
    },

    optionalText: {
      control: 'text',
      description: 'Optional marker rendered next to non-required labels.',
    },

    labelInfo: {
      control: false,
      description: 'Additional label content, such as an info affordance.',
    },

    labelAction: {
      control: false,
      description: 'Action rendered next to the label.',
    },

    children: {
      control: false,
      description: 'Custom form control rendered inside the field.',
    },

    style: {
      control: false,
      description: 'Style applied to the root container.',
    },

    controlStyle: {
      control: false,
      description: 'Style applied to the control wrapper.',
    },

    labelStyle: {
      control: false,
      description: 'Style applied to string or numeric label content.',
    },

    descriptionStyle: {
      control: false,
      description: 'Style applied to string or numeric description content.',
    },

    errorStyle: {
      control: false,
      description: 'Style applied to string or numeric error content.',
    },

    messageStyle: {
      control: false,
      description: 'Style applied to string or numeric message content.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormField>;

const storyStyles = StyleSheet.create({
  column: {
    width: '100%',
    gap: 16,
  },

  customLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    section: {
      width: '100%',
      padding: 20,
      gap: 16,
      borderWidth: 1,
      borderColor: theme.semantic.border.muted,
      borderRadius: 20,
      backgroundColor: theme.semantic.surface.subtle,
    },

    subtitle: {
      color: theme.semantic.text.secondary,
      fontSize: 13,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.subtitle}>{title}</Text>
      {children}
    </View>
  );
}

function CustomLabelExample() {
  const { theme, themeName } = useTheme();
  const isLightTheme = themeName === 'light';

  return (
    <Section title='CustomLabel'>
      <FormField
        label={
          <View style={storyStyles.customLabel}>
            <Text
              style={{
                color: theme.components.formField.label.fg,
                fontFamily: theme.tokens.typography.family.medium,
                fontSize: theme.tokens.typography.size.md,
              }}
            >
              Workspace
            </Text>

            <View
              style={[
                storyStyles.badge,
                {
                  backgroundColor: isLightTheme
                    ? theme.colors.primary[600]
                    : theme.colors.primary[400],
                },
              ]}
            >
              <Text
                style={{
                  color: isLightTheme
                    ? theme.colors.primary[50]
                    : theme.colors.primary[950],
                  fontSize: theme.tokens.typography.size.xs,
                }}
              >
                Public
              </Text>
            </View>
          </View>
        }
        required
      >
        <DemoControl placeholder='vellira-design' />
      </FormField>
    </Section>
  );
}

function InfoMark() {
  const { theme } = useTheme();

  return (
    <Text
      style={{
        color: theme.components.formField.labelInfo.fg,
        fontFamily: theme.tokens.typography.family.medium,
      }}
    >
      ?
    </Text>
  );
}

function CustomDescriptionExample() {
  const { theme } = useTheme();

  return (
    <Section title='CustomDescription'>
      <FormField
        label='Password'
        description={
          <View style={{ gap: theme.tokens.spacing[1] }}>
            <Text
              style={{
                color: theme.components.formField.description.fg,
                fontFamily: theme.tokens.typography.family.regular,
                fontSize: theme.tokens.typography.size.sm,
              }}
            >
              Your password must contain:
            </Text>

            <Text
              style={{
                color: theme.semantic.text.secondary,
                fontFamily: theme.tokens.typography.family.regular,
                fontSize: theme.tokens.typography.size.sm,
              }}
            >
              • At least 8 characters{'\n'}• One number{'\n'}• One uppercase
              letter
            </Text>
          </View>
        }
      >
        <DemoControl placeholder='Enter password' />
      </FormField>
    </Section>
  );
}

function CustomErrorExample() {
  const { theme } = useTheme();

  return (
    <Section title='CustomError'>
      <FormField
        label='Email'
        error={
          <View
            style={{
              padding: theme.tokens.spacing[2],
              borderRadius: theme.tokens.radius.md,
              backgroundColor: theme.semantic.surface.subtle,
            }}
          >
            <Text
              style={{
                color: theme.components.formField.helperText.error.fg,
                fontFamily: theme.tokens.typography.family.medium,
                fontSize: theme.tokens.typography.size.sm,
              }}
            >
              This email address is already registered.
            </Text>
          </View>
        }
      >
        <DemoControl placeholder='name@company.com' error />
      </FormField>
    </Section>
  );
}

function MessageTonesExample() {
  return (
    <Section title='MessageTones'>
      <View style={{ gap: 16 }}>
        <FormField
          label='Email'
          description='Used for account notifications.'
          message='Email address is available.'
          messageTone='success'
        >
          <DemoControl placeholder='name@company.com' />
        </FormField>

        <FormField
          label='API key'
          message='This key expires in 7 days.'
          messageTone='warning'
        >
          <DemoControl placeholder='vk_live_...' />
        </FormField>

        <FormField
          label='Project slug'
          message='Lower priority message is replaced by error.'
          error='This slug is already used.'
        >
          <DemoControl placeholder='vellira-ui' error />
        </FormField>
      </View>
    </Section>
  );
}

function LabelActionExample() {
  const { theme } = useTheme();

  return (
    <Section title='LabelAction'>
      <FormField
        label='Password'
        labelAction={
          <Text
            style={{
              color: theme.semantic.text.interactive,
              fontFamily: theme.tokens.typography.family.medium,
              fontSize: theme.tokens.typography.size.sm,
            }}
          >
            Forgot?
          </Text>
        }
        message='Use at least 12 characters.'
      >
        <DemoControl placeholder='Password' />
      </FormField>
    </Section>
  );
}

function CompoundApiExample() {
  return (
    <Section title='Compound API'>
      <FormField id='compound-email' required>
        <FormField.Label>Email</FormField.Label>
        <FormField.Description>
          Used for account notifications.
        </FormField.Description>
        <FormField.Control>
          <Input color='success' placeholder='name@company.com' />
        </FormField.Control>
        <FormField.Message tone='success'>
          Email address is available.
        </FormField.Message>
      </FormField>
    </Section>
  );
}

export const Playground: Story = {
  args: {
    children: <DemoControl placeholder='Alex Johnson' />,
  },
  render: (args) => (
    <Section title='Playground'>
      <FormField {...args} />
    </Section>
  ),
};

export const Default: Story = {
  args: {
    label: 'Full name',
    children: <DemoControl placeholder='name@company.com' />,
  },
  render: (args) => (
    <Section title='Default'>
      <FormField {...args} />
    </Section>
  ),
};

export const WithInputContext: Story = {
  render: () => (
    <Section title='WithInputContext'>
      <FormField
        label='Email'
        description='Input inherits size, required, invalid and disabled state.'
        size='sm'
        required
        invalid
      >
        <Input placeholder='name@company.com' type='email' />
      </FormField>
    </Section>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section title='Sizes'>
      <View style={storyStyles.column}>
        <FormField label='Small' size='sm'>
          <Input placeholder='Small field' />
        </FormField>

        <FormField label='Medium' size='md'>
          <Input placeholder='Medium field' />
        </FormField>

        <FormField label='Large' size='lg'>
          <Input placeholder='Large field' />
        </FormField>
      </View>
    </Section>
  ),
};

export const OptionalAndInfo: Story = {
  render: () => (
    <Section title='OptionalAndInfo'>
      <View style={storyStyles.column}>
        <FormField
          label='Display name'
          optionalText='Optional'
          description='Shown in profile surfaces.'
        >
          <Input placeholder='Alex Taylor' />
        </FormField>

        <FormField
          label='API key'
          labelInfo={<InfoMark />}
          description='Create and rotate keys in account settings.'
          required
        >
          <Input placeholder='vk_live_...' />
        </FormField>
      </View>
    </Section>
  ),
};

export const WithDescription: Story = {
  args: {
    label: 'Username',
    description:
      'Use 3–20 characters. Letters, numbers and underscores are allowed.',
    children: <DemoControl placeholder='alex_johnson' />,
  },
  render: (args) => (
    <Section title='WithDescription'>
      <FormField {...args} />
    </Section>
  ),
};

export const Required: Story = {
  args: {
    label: 'Full name',
    required: true,
    children: <DemoControl placeholder='Alex Johnson' />,
  },
  render: (args) => (
    <Section title='Required'>
      <FormField {...args} />
    </Section>
  ),
};

export const WithError: Story = {
  args: {
    label: 'Email',
    required: true,
    error: 'Enter a valid email.',
    children: <DemoControl placeholder='name@company.com' error />,
  },
  render: (args) => (
    <Section title='WithError'>
      <FormField {...args} />
    </Section>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Disabled field',
    description: 'This field is currently unavailable.',
    disabled: true,
    children: <DemoControl placeholder='Not editable' disabled />,
  },
  render: (args) => (
    <Section title='Disabled'>
      <FormField {...args} />
    </Section>
  ),
};

export const CustomLabel: Story = {
  render: () => <CustomLabelExample />,
};

export const CustomDescription: Story = {
  render: () => <CustomDescriptionExample />,
};

export const CustomError: Story = {
  render: () => <CustomErrorExample />,
};

export const MessageTones: Story = {
  render: () => <MessageTonesExample />,
};

export const LabelAction: Story = {
  render: () => <LabelActionExample />,
};

export const CompoundApi: Story = {
  render: () => <CompoundApiExample />,
};

export const CustomStyles: Story = {
  render: () => (
    <Section title='CustomStyles'>
      <FormField
        label='Project name'
        description='Used throughout the workspace.'
        style={{ maxWidth: 320 }}
        controlStyle={{ marginTop: 4 }}
        labelStyle={{ fontWeight: '700' }}
        descriptionStyle={{ fontStyle: 'italic' }}
      >
        <DemoControl placeholder='Vellira' />
      </FormField>
    </Section>
  ),
};

export const CompleteExample: Story = {
  args: {
    label: 'Email',
    description: 'We will use this email for account notifications.',
    required: true,
    error: 'Email is required.',
    children: <DemoControl placeholder='name@company.com' error />,
  },
  render: (args) => (
    <Section title='CompleteExample'>
      <FormField {...args} />
    </Section>
  ),
};

export const States: Story = {
  render: () => (
    <Section title='States'>
      <View style={storyStyles.column}>
        <FormField label='Default'>
          <DemoControl placeholder='Default field' />
        </FormField>

        <FormField
          label='With description'
          description='Additional supporting information.'
        >
          <DemoControl placeholder='Field with description' />
        </FormField>

        <FormField label='Required' required>
          <DemoControl placeholder='Required field' />
        </FormField>

        <FormField label='Disabled' disabled>
          <DemoControl placeholder='Disabled field' disabled />
        </FormField>

        <FormField label='Error' error='This field is invalid.'>
          <DemoControl placeholder='Invalid field' error />
        </FormField>
      </View>
    </Section>
  ),
};
