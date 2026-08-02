import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-native';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fn } from 'storybook/test';

import { Radio } from '../../primitives/Radio';
import { useTheme } from '../../theme';

import { RadioGroup } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### RadioGroup Component

Accessible group for selecting exactly one option in React Native.

**Features**

- Controlled and uncontrolled usage
- Composition with Radio controls
- Optional compound \`RadioGroup.Item\` alias
- Group label and description
- Required indicator
- Error message
- Vertical and horizontal orientation
- Shared selected color inherited by child Radio controls
- Token-driven Radio sizing, spacing, colors, and press states
- Disabled group state
- Disabled individual Radio controls
- Sizes: sm, md and lg
- Accessibility support

### Usage

Use RadioGroup when users must choose one option from a set.

\`\`\`tsx
<RadioGroup
  label='Plan'
  value={plan}
  onValueChange={setPlan}
>
  <Radio value='starter' label='Starter' />
  <Radio value='pro' label='Pro' />
  <Radio value='enterprise' label='Enterprise' />
</RadioGroup>
\`\`\`

\`\`\`tsx
<RadioGroup defaultValue='email'>
  <RadioGroup.Item value='email' label='Email' />
  <RadioGroup.Item value='sms' label='SMS' />
</RadioGroup>
\`\`\`

### Accessibility

- Exposes the radiogroup role
- Each Radio exposes native radio semantics
- Propagates disabled, required, invalid and size state
- Includes description and validation text in the accessibility hint
`,
      },
    },
  },
  args: {
    label: 'Plan',
    defaultValue: 'pro',
    orientation: 'vertical',
    size: 'md',
    color: 'primary',
    required: false,
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Content displayed as the group label.',
    },

    description: {
      control: 'text',
      description: 'Supporting content displayed below the group label.',
    },

    defaultValue: {
      control: 'text',
      description: 'Initial selected value for uncontrolled usage.',
    },

    value: {
      control: 'text',
      description: 'Current selected value for controlled usage.',
    },

    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      description: 'Layout direction of the Radio controls.',
    },

    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Size inherited by Radio controls in the group.',
    },

    color: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger'],
      description: 'Default selected color inherited by Radio controls.',
    },

    required: {
      control: 'boolean',
      description: 'Marks the radio group as required.',
    },

    disabled: {
      control: 'boolean',
      description: 'Disables all Radio controls in the group.',
    },

    error: {
      control: 'text',
      description: 'Validation content displayed below the group.',
    },

    onValueChange: {
      action: 'changed',
      description: 'Called when the selected value changes.',
    },

    children: {
      control: false,
      description: 'Radio controls rendered inside the group.',
    },

    style: {
      control: false,
    },

    itemsStyle: {
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
  },
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;
type RadioGroupStoryProps = ComponentProps<typeof RadioGroup>;

const storyStyles = StyleSheet.create({
  column: {
    width: '100%',
    gap: 12,
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
      fontWeight: theme.tokens.typography.weight.semibold,
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.subtitle}>{title}</Text>
      {children}
    </View>
  );
}

function PlanRadios({ disablePro = false }: { disablePro?: boolean }) {
  return (
    <>
      <Radio value='starter' label='Starter' />
      <Radio value='pro' label='Pro' disabled={disablePro} />
      <Radio value='enterprise' label='Enterprise' />
    </>
  );
}

function InteractiveRadioGroup(args: RadioGroupStoryProps) {
  const [value, setValue] = useState(args.value ?? args.defaultValue ?? '');

  useEffect(() => {
    setValue(args.value ?? args.defaultValue ?? '');
  }, [args.value, args.defaultValue]);

  return (
    <RadioGroup
      {...args}
      value={value}
      onValueChange={(nextValue) => {
        setValue(nextValue);
        args.onValueChange?.(nextValue);
      }}
    >
      {args.children}
    </RadioGroup>
  );
}

export const Playground: Story = {
  args: {
    children: <PlanRadios />,
  },
  render: (args) => (
    <Section title='Playground'>
      <InteractiveRadioGroup {...args} />
    </Section>
  ),
};

export const Default: Story = {
  render: (args) => (
    <Section title='Default'>
      <RadioGroup {...args}>
        <PlanRadios />
      </RadioGroup>
    </Section>
  ),
};

export const Controlled: Story = {
  args: {
    value: 'pro',
    defaultValue: undefined,
  },
  render: (args) => (
    <Section title='Controlled'>
      <InteractiveRadioGroup {...args}>
        <PlanRadios />
      </InteractiveRadioGroup>
    </Section>
  ),
};

export const Uncontrolled: Story = {
  args: {
    defaultValue: 'pro',
  },
  render: (args) => (
    <Section title='Uncontrolled'>
      <RadioGroup {...args}>
        <PlanRadios />
      </RadioGroup>
    </Section>
  ),
};

export const CompoundItem: Story = {
  args: {
    label: 'Notification channel',
    description: 'Choose where product updates should be sent.',
    defaultValue: 'email',
  },
  render: (args) => (
    <Section title='CompoundItem'>
      <RadioGroup {...args}>
        <RadioGroup.Item
          value='email'
          label='Email'
          description='Send updates to the account email address.'
        />
        <RadioGroup.Item
          value='sms'
          label='SMS'
          description='Send critical updates by text message.'
        />
        <RadioGroup.Item
          value='push'
          label='Push'
          description='Send updates through the mobile app.'
        />
      </RadioGroup>
    </Section>
  ),
};

export const WithDescription: Story = {
  args: {
    description: 'Choose the plan that fits your current needs.',
  },
  render: (args) => (
    <Section title='WithDescription'>
      <RadioGroup {...args}>
        <PlanRadios />
      </RadioGroup>
    </Section>
  ),
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <Section title='Horizontal'>
      <RadioGroup {...args}>
        <PlanRadios />
      </RadioGroup>
    </Section>
  ),
};

export const Required: Story = {
  args: {
    required: true,
    label: 'Required plan',
  },
  render: (args) => (
    <Section title='Required'>
      <RadioGroup {...args}>
        <PlanRadios />
      </RadioGroup>
    </Section>
  ),
};

export const WithError: Story = {
  args: {
    defaultValue: '',
    required: true,
    error: 'Select a plan to continue.',
  },
  render: (args) => (
    <Section title='WithError'>
      <RadioGroup {...args}>
        <PlanRadios />
      </RadioGroup>
    </Section>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <Section title='Disabled'>
      <RadioGroup {...args}>
        <PlanRadios />
      </RadioGroup>
    </Section>
  ),
};

export const WithDisabledRadio: Story = {
  render: (args) => (
    <Section title='WithDisabledRadio'>
      <RadioGroup {...args}>
        <PlanRadios disablePro />
      </RadioGroup>
    </Section>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section title='Sizes'>
      <View style={storyStyles.column}>
        <RadioGroup label='Small' defaultValue='starter' size='sm'>
          <PlanRadios />
        </RadioGroup>

        <RadioGroup label='Medium' defaultValue='pro' size='md'>
          <PlanRadios />
        </RadioGroup>

        <RadioGroup label='Large' defaultValue='enterprise' size='lg'>
          <PlanRadios />
        </RadioGroup>
      </View>
    </Section>
  ),
};

export const Colors: Story = {
  render: () => (
    <Section title='Colors'>
      <View style={storyStyles.column}>
        <RadioGroup label='Primary' color='primary' defaultValue='starter'>
          <PlanRadios />
        </RadioGroup>

        <RadioGroup label='Neutral' color='neutral' defaultValue='starter'>
          <PlanRadios />
        </RadioGroup>

        <RadioGroup label='Success' color='success' defaultValue='starter'>
          <PlanRadios />
        </RadioGroup>

        <RadioGroup label='Warning' color='warning' defaultValue='starter'>
          <PlanRadios />
        </RadioGroup>

        <RadioGroup label='Danger' color='danger' defaultValue='starter'>
          <PlanRadios />
        </RadioGroup>
      </View>
    </Section>
  ),
};

export const WithRadioDescriptions: Story = {
  args: {
    label: 'Delivery method',
    description: 'Choose how your order should be delivered.',
    defaultValue: 'standard',
  },
  render: (args) => (
    <Section title='WithRadioDescriptions'>
      <RadioGroup {...args}>
        <Radio
          value='standard'
          label='Standard delivery'
          description='Delivered within three to five business days.'
        />

        <Radio
          value='express'
          label='Express delivery'
          description='Delivered on the next business day.'
        />
      </RadioGroup>
    </Section>
  ),
};

export const CustomStyles: Story = {
  render: () => (
    <Section title='CustomStyles'>
      <RadioGroup
        label='Plan'
        description='Custom group layout.'
        defaultValue='pro'
        style={{ maxWidth: 320 }}
        itemsStyle={{ gap: 20 }}
        labelStyle={{ fontWeight: '700' }}
        descriptionStyle={{ fontStyle: 'italic' }}
      >
        <PlanRadios />
      </RadioGroup>
    </Section>
  ),
};

export const States: Story = {
  render: () => (
    <Section title='States'>
      <View style={storyStyles.column}>
        <RadioGroup label='Default' defaultValue='starter'>
          <PlanRadios />
        </RadioGroup>

        <RadioGroup
          label='With description'
          description='Choose one available option.'
          defaultValue='pro'
        >
          <PlanRadios />
        </RadioGroup>

        <RadioGroup label='Required' required defaultValue='enterprise'>
          <PlanRadios />
        </RadioGroup>

        <RadioGroup label='Disabled' disabled defaultValue='starter'>
          <PlanRadios />
        </RadioGroup>

        <RadioGroup label='Error' required error='Select one option.'>
          <PlanRadios />
        </RadioGroup>
      </View>
    </Section>
  ),
};
