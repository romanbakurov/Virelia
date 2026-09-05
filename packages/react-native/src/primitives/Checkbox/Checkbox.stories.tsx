import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-native';
import { Checkbox } from '@vellira-ui/react-native';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fn } from 'storybook/test';

import { useTheme } from '../../theme';

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        // language=Markdown
        component: `
### Checkbox Component

Native boolean control for independent choices.

**Features**
- Controlled and uncontrolled usage
- Checked, unchecked and indeterminate states
- Sizes: sm, md and lg
- Optional label and description
- Required, disabled and error states
- Native accessibility semantics
- Standard Pressable props

### Usage

Use Checkbox for a single on/off choice in forms, preferences, and settings screens.

\`\`\`tsx
<Checkbox
  label='Accept terms'
  checked={accepted}
  onCheckedChange={setAccepted}
/>
\`\`\`
`,
      },
    },
  },
  args: {
    label: 'Accept terms',
    size: 'md',
    color: 'primary',
    labelPosition: 'end',
    disabled: false,
    required: false,
    indeterminate: false,
    onCheckedChange: fn(),
  },
  argTypes: {
    label: {
      description: 'Visible text label displayed next to the checkbox.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },

    description: {
      description: 'Helper text displayed below the checkbox.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },

    checked: {
      description: 'Controlled checked state.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      },
    },

    defaultChecked: {
      description: 'Initial checked state for uncontrolled usage.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    size: {
      description: 'Checkbox size.',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: `'sm' | 'md' | 'lg'` },
        defaultValue: { summary: 'md' },
      },
    },

    color: {
      description: 'Selected checkbox color.',
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger'],
      table: {
        type: {
          summary: `'primary' | 'neutral' | 'success' | 'warning' | 'danger'`,
        },
        defaultValue: { summary: 'primary' },
      },
    },

    labelPosition: {
      description: 'Position of the visible label relative to the checkbox.',
      control: 'radio',
      options: ['end', 'start'],
      table: {
        type: { summary: `'end' | 'start'` },
        defaultValue: { summary: 'end' },
      },
    },

    indeterminate: {
      description: 'Displays a mixed selection state.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    required: {
      description: 'Marks the checkbox as required.',
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
      description: 'Validation error message displayed below the checkbox.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },

    accessibilityLabel: {
      description:
        'Accessible label used when the visible label is absent or needs an override.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },

    accessibilityHint: {
      description: 'Additional accessibility guidance.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },

    onCheckedChange: {
      description: 'Called when the checked state changes.',
      action: 'changed',
      table: {
        type: { summary: '(checked: boolean) => void' },
      },
    },

    style: {
      control: false,
    },

    icon: {
      control: false,
    },

    indeterminateIcon: {
      control: false,
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;
type CheckboxStoryProps = ComponentProps<typeof Checkbox>;

const storyStyles = StyleSheet.create({
  column: {
    width: '100%',
    gap: 12,
  },

  rowStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 16,
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

function ControlledCheckbox(args: CheckboxStoryProps) {
  const [checked, setChecked] = useState(args.checked ?? false);

  useEffect(() => {
    setChecked(args.checked ?? false);
  }, [args.checked]);

  return (
    <Checkbox
      {...args}
      checked={checked}
      onCheckedChange={(nextChecked) => {
        setChecked(nextChecked);
        args.onCheckedChange?.(nextChecked);
      }}
    />
  );
}

export const Playground: Story = {
  render: (args) => (
    <Section title='Playground'>
      <View style={storyStyles.column}>
        <ControlledCheckbox {...args} />
      </View>
    </Section>
  ),
};

export const Default: Story = {
  args: {
    label: 'Accept terms',
  },
  render: (args) => (
    <Section title='Default'>
      <View style={storyStyles.column}>
        <Checkbox {...args} />
      </View>
    </Section>
  ),
};

export const Controlled: Story = {
  args: {
    label: 'Receive notifications',
    checked: false,
  },
  render: (args) => (
    <Section title='Controlled'>
      <View style={storyStyles.column}>
        <ControlledCheckbox {...args} />
      </View>
    </Section>
  ),
};

export const Uncontrolled: Story = {
  args: {
    label: 'Remember me',
    defaultChecked: true,
  },
  render: (args) => (
    <Section title='Uncontrolled'>
      <View style={storyStyles.column}>
        <Checkbox {...args} />
      </View>
    </Section>
  ),
};

export const Checked: Story = {
  args: {
    label: 'Checked',
    defaultChecked: true,
  },

  render: (args) => (
    <Section title='Checked'>
      <View style={storyStyles.column}>
        <Checkbox {...args} />
      </View>
    </Section>
  ),
};

export const Unchecked: Story = {
  args: {
    label: 'Unchecked',
    defaultChecked: false,
  },
  render: (args) => (
    <Section title='Unchecked'>
      <View style={storyStyles.column}>
        <Checkbox {...args} />
      </View>
    </Section>
  ),
};

export const Indeterminate: Story = {
  args: {
    label: 'Select all items',
    indeterminate: true,
  },

  render: (args) => (
    <Section title='Indeterminate'>
      <View style={storyStyles.column}>
        <Checkbox {...args} />
      </View>
    </Section>
  ),
};

export const Required: Story = {
  args: {
    label: 'Accept the privacy policy',
    required: true,
  },

  render: (args) => (
    <Section title='Required'>
      <View style={storyStyles.column}>
        <Checkbox {...args} />
      </View>
    </Section>
  ),
};

export const WithDescription: Story = {
  args: {
    label: 'Product updates',
    description: 'Receive occasional news about new Vellira releases.',
  },

  render: (args) => (
    <Section title='With description'>
      <View style={storyStyles.column}>
        <Checkbox {...args} />
      </View>
    </Section>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },

  render: (args) => (
    <Section title='Disabled'>
      <View style={storyStyles.column}>
        <Checkbox {...args} />
      </View>
    </Section>
  ),
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled checked',
    disabled: true,
    defaultChecked: true,
  },

  render: (args) => (
    <Section title='Disabled checked'>
      <View style={storyStyles.column}>
        <Checkbox {...args} />
      </View>
    </Section>
  ),
};

export const DisabledUnchecked: Story = {
  args: {
    label: 'Disabled unchecked',
    disabled: true,
    defaultChecked: false,
  },

  render: (args) => (
    <Section title='Disabled unchecked'>
      <View style={storyStyles.column}>
        <Checkbox {...args} />
      </View>
    </Section>
  ),
};

export const Error: Story = {
  args: {
    label: 'Accept terms',
    error: 'You must accept the terms',
  },

  render: (args) => (
    <Section title='Error'>
      <View style={storyStyles.column}>
        <Checkbox {...args} />
      </View>
    </Section>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section title='Sizes'>
      <View style={storyStyles.rowStyle}>
        <Checkbox label='Small' size='sm' />
        <Checkbox label='Medium' size='md' />
        <Checkbox label='Large' size='lg' />
      </View>
    </Section>
  ),
};

export const Colors: Story = {
  render: () => (
    <Section title='Colors'>
      <View style={storyStyles.column}>
        <Checkbox label='Primary' color='primary' defaultChecked />
        <Checkbox label='Neutral' color='neutral' defaultChecked />
        <Checkbox label='Success' color='success' defaultChecked />
        <Checkbox label='Warning' color='warning' defaultChecked />
        <Checkbox label='Danger' color='danger' defaultChecked />
      </View>
    </Section>
  ),
};

export const LabelPositions: Story = {
  render: () => (
    <Section title='Label positions'>
      <View style={storyStyles.column}>
        <Checkbox label='Label at end' labelPosition='end' defaultChecked />
        <Checkbox label='Label at start' labelPosition='start' defaultChecked />
      </View>
    </Section>
  ),
};

export const CustomIcons: Story = {
  render: () => (
    <Section title='Custom icons'>
      <View style={storyStyles.column}>
        <Checkbox label='Custom checked' defaultChecked icon={<Text>✓</Text>} />
        <Checkbox
          label='Custom mixed'
          indeterminate
          indeterminateIcon={<Text>−</Text>}
        />
      </View>
    </Section>
  ),
};

export const States: Story = {
  render: () => (
    <Section title='States'>
      <View style={storyStyles.column}>
        <Checkbox label='Unchecked' />
        <Checkbox label='Checked' defaultChecked />
        <Checkbox label='Indeterminate' indeterminate />
        <Checkbox label='Required' required />
        <Checkbox label='Disabled' disabled />
        <Checkbox label='Disabled checked' disabled defaultChecked />
        <Checkbox
          label='Error with description'
          description='This option is required to continue.'
          error='This field is required'
        />
      </View>
    </Section>
  ),
};

export const AccessibleWithoutVisibleLabel: Story = {
  args: {
    label: undefined,
    accessibilityLabel: 'Enable notifications',
  },
  render: (args) => (
    <Section title='Accessible without visible label'>
      <View style={storyStyles.column}>
        <Checkbox {...args} />
      </View>
    </Section>
  ),
};
