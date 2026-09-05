import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-native';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fn } from 'storybook/test';

import { toNativeFontWeight, useTheme } from '../../theme';

import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'Primitives/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        // language=Markdown
        component: `
### Radio Component

Radio allows selecting a single option.

**Features**

- Controlled and uncontrolled usage
- Sizes: sm, md and lg
- Selected colors: primary, neutral, success, warning and danger
- Custom selected indicator
- Optional label and description
- Token-driven size, typography, color states, and press feedback
- Disabled and error states
- Accessibility support
- Compatible with RadioGroup

### Usage

Use Radio inside a RadioGroup when selecting one option from multiple choices.

Standalone usage is also supported.

\`\`\`tsx
<Radio
  value="email"
  label="Email"
  checked={selected}
  onCheckedChange={setSelected}
/>
\`\`\`
`,
      },
    },
  },
  args: {
    value: 'option',
    label: 'Select option',
    size: 'md',
    color: 'primary',
    disabled: false,
    required: false,
    checked: false,
    onCheckedChange: fn(),
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Value represented by the radio control.',
    },

    label: {
      control: 'text',
      description: 'Visible label displayed next to the radio control.',
    },

    description: {
      control: 'text',
      description: 'Supporting text displayed below the label.',
    },

    checked: {
      control: 'boolean',
      description: 'Current checked state for controlled usage.',
    },

    defaultChecked: {
      control: 'boolean',
      description: 'Initial checked state for uncontrolled usage.',
    },

    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Radio control size.',
    },

    color: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger'],
      description: 'Selected radio color.',
    },

    disabled: {
      control: 'boolean',
      description: 'Disables interaction with the radio control.',
    },

    required: {
      control: 'boolean',
      description: 'Marks the radio control as required for accessibility.',
    },

    error: {
      control: 'text',
      description: 'Validation error displayed below the radio control.',
    },

    accessibilityLabel: {
      control: 'text',
      description:
        'Accessible label used when there is no visible string label.',
    },

    accessibilityHint: {
      control: 'text',
      description: 'Additional accessibility hint.',
    },

    onCheckedChange: {
      action: 'changed',
      description: 'Called when the checked state changes.',
    },

    containerStyle: {
      control: false,
    },

    labelStyle: {
      control: false,
    },

    descriptionStyle: {
      control: false,
    },

    errorStyle: {
      control: false,
    },

    style: {
      control: false,
    },

    icon: {
      control: false,
      description: 'Custom indicator rendered for the checked state.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Radio>;
type RadioStoryProps = ComponentProps<typeof Radio>;

const storyStyles = StyleSheet.create({
  column: {
    width: '100%',
    gap: 12,
  },

  row: {
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
      borderRadius: theme.tokens.radius.xl,
      backgroundColor: theme.semantic.surface.subtle,
    },

    subtitle: {
      color: theme.semantic.text.secondary,
      fontSize: theme.tokens.typography.size.sm,
      fontWeight: toNativeFontWeight(theme.tokens.typography.weight.semibold),
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.subtitle}>{title}</Text>
      {children}
    </View>
  );
}

function InteractiveRadio(args: RadioStoryProps) {
  const [checked, setChecked] = useState(
    args.checked ?? args.defaultChecked ?? false
  );

  useEffect(() => {
    setChecked(args.checked ?? args.defaultChecked ?? false);
  }, [args.checked, args.defaultChecked]);

  return (
    <Radio
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
      <InteractiveRadio {...args} />
    </Section>
  ),
};

export const Basic: Story = {
  args: {
    value: 'basic',
    label: 'Select option',
  },
  render: (args) => (
    <Section title='Basic'>
      <Radio {...args} />
    </Section>
  ),
};

export const Controlled: Story = {
  args: {
    value: 'controlled',
    label: 'Receive notifications',
    checked: false,
  },
  render: (args) => (
    <Section title='Controlled'>
      <InteractiveRadio {...args} />
    </Section>
  ),
};

export const Uncontrolled: Story = {
  args: {
    value: 'uncontrolled',
    label: 'Remember this choice',
    defaultChecked: true,
  },
  render: (args) => (
    <Section title='Uncontrolled'>
      <Radio {...args} />
    </Section>
  ),
};

export const Checked: Story = {
  args: {
    value: 'checked',
    label: 'Selected option',
    checked: true,
  },
  render: (args) => (
    <Section title='Checked'>
      <Radio {...args} />
    </Section>
  ),
};

export const Unchecked: Story = {
  args: {
    value: 'unchecked',
    label: 'Unselected option',
    checked: false,
  },
  render: (args) => (
    <Section title='Unchecked'>
      <Radio {...args} />
    </Section>
  ),
};

export const WithDescription: Story = {
  args: {
    value: 'description',
    label: 'Email notifications',
    description: 'Receive important account updates by email.',
  },
  render: (args) => (
    <Section title='WithDescription'>
      <Radio {...args} />
    </Section>
  ),
};

export const Disabled: Story = {
  args: {
    value: 'disabled',
    label: 'Disabled option',
    disabled: true,
  },
  render: (args) => (
    <Section title='Disabled'>
      <Radio {...args} />
    </Section>
  ),
};

export const DisabledChecked: Story = {
  args: {
    value: 'disabled-checked',
    label: 'Selected but unavailable',
    checked: true,
    disabled: true,
  },
  render: (args) => (
    <Section title='DisabledChecked'>
      <Radio {...args} />
    </Section>
  ),
};

export const Error: Story = {
  args: {
    value: 'error',
    label: 'Select this option',
    description: 'This selection is required to continue.',
    error: 'Please select an option.',
  },
  render: (args) => (
    <Section title='Error'>
      <Radio {...args} />
    </Section>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section title='Sizes'>
      <View style={storyStyles.column}>
        <Radio value='small' label='Small' size='sm' />
        <Radio value='medium' label='Medium' size='md' />
        <Radio value='large' label='Large' size='lg' />
      </View>
    </Section>
  ),
};

export const Colors: Story = {
  render: () => (
    <Section title='Colors'>
      <View style={storyStyles.column}>
        <Radio value='primary' label='Primary' color='primary' defaultChecked />
        <Radio value='neutral' label='Neutral' color='neutral' defaultChecked />
        <Radio value='success' label='Success' color='success' defaultChecked />
        <Radio value='warning' label='Warning' color='warning' defaultChecked />
        <Radio value='danger' label='Danger' color='danger' defaultChecked />
      </View>
    </Section>
  ),
};

export const CustomIndicator: Story = {
  args: {
    value: 'custom-indicator',
    label: 'Custom indicator',
    color: 'success',
    checked: true,
    icon: <Text>✓</Text>,
  },
  render: (args) => (
    <Section title='CustomIndicator'>
      <Radio {...args} />
    </Section>
  ),
};

export const States: Story = {
  render: () => (
    <Section title='States'>
      <View style={storyStyles.column}>
        <Radio value='unchecked' label='Unchecked' />
        <Radio value='checked' label='Checked' defaultChecked />
        <Radio value='disabled' label='Disabled' disabled />
        <Radio
          value='disabled-checked'
          label='Disabled checked'
          defaultChecked
          disabled
        />
        <Radio
          value='description'
          label='With description'
          description='Additional information about this option.'
        />
        <Radio
          value='error'
          label='Error state'
          description='This option is required to continue.'
          error='Please select an option.'
        />
      </View>
    </Section>
  ),
};

export const CustomStyles: Story = {
  render: () => (
    <Section title='CustomStyles'>
      <Radio
        value='custom'
        label='Custom styled label'
        description='Custom supporting text.'
        containerStyle={{ width: 280 }}
        labelStyle={{ fontWeight: '700' }}
        descriptionStyle={{ fontStyle: 'italic' }}
      />
    </Section>
  ),
};

export const AccessibleWithoutVisibleLabel: Story = {
  args: {
    value: 'accessible',
    label: undefined,
    accessibilityLabel: 'Enable email notifications',
    accessibilityHint: 'Selects email as the notification method.',
  },
  render: (args) => (
    <Section title='AccessibleWithoutVisibleLabel'>
      <Radio {...args} />
    </Section>
  ),
};
