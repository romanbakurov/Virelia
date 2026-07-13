import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-native';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fn } from 'storybook/test';

import { useTheme } from '../../theme';

import { Select } from './Select';

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

const longOptions = [
  {
    label: 'France - European workspace with a deliberately long label',
    value: 'fr',
  },
  { label: 'Spain - Customer success and regional operations', value: 'es' },
  { label: 'Germany - Engineering platform team', value: 'de' },
  { label: 'Italy - Product launch operations', value: 'it' },
  { label: 'Portugal - Partner success team', value: 'pt' },
  { label: 'Belgium - Finance operations', value: 'be' },
  { label: 'Netherlands - Platform reliability', value: 'nl' },
  { label: 'Switzerland - Enterprise accounts', value: 'ch' },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Select Component

Native single-value select control for choosing from a predefined list.

**Features**

- Native platform picker behavior
- Label, description, placeholder, and ReactNode error support
- Controlled and uncontrolled value support
- Required, disabled, and validation states
- Disabled options
- Sizes: sm, md, and lg
- Style slots for container, trigger, text, and picker
- Accessibility label and hint overrides

### Usage

\`\`\`tsx
<Select
  label='Country'
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
    size: 'md',
    required: false,
    disabled: false,
    options: defaultOptions,
    onChange: fn(),
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Text label displayed above the Select.',
    },

    description: {
      control: 'text',
      description: 'Helper text displayed below the label.',
    },

    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when no value is selected.',
    },

    value: {
      control: 'text',
      description: 'Current selected value for controlled usage.',
    },

    defaultValue: {
      control: 'text',
      description: 'Initial selected value for uncontrolled usage.',
    },

    options: {
      control: 'object',
      description: 'List of select options.',
    },

    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Visual size of the Select trigger.',
    },

    required: {
      control: 'boolean',
      description: 'Marks the select as required.',
    },

    disabled: {
      control: 'boolean',
      description: 'Disables the select.',
    },

    error: {
      control: 'text',
      description: 'Validation content displayed below the Select.',
    },

    accessibilityLabel: {
      control: 'text',
      description: 'Accessible label for the picker trigger.',
    },

    accessibilityHint: {
      control: 'text',
      description: 'Accessible hint for the picker trigger.',
    },

    onChange: {
      action: 'changed',
      description: 'Called when the selected value changes.',
    },

    style: {
      control: false,
    },

    triggerStyle: {
      control: false,
    },

    textStyle: {
      control: false,
    },

    pickerStyle: {
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;
type SelectStoryProps = ComponentProps<typeof Select>;

const storyStyles = StyleSheet.create({
  column: {
    width: '100%',
    gap: 12,
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
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

function InteractiveSelect(args: SelectStoryProps) {
  const [value, setValue] = useState(args.value ?? args.defaultValue ?? '');

  useEffect(() => {
    setValue(args.value ?? args.defaultValue ?? '');
  }, [args.value, args.defaultValue]);

  return (
    <Select
      {...args}
      value={value}
      onChange={(nextValue) => {
        setValue(nextValue);
        args.onChange?.(nextValue);
      }}
    />
  );
}

export const Playground: Story = {
  render: (args) => (
    <Section title='Playground'>
      <InteractiveSelect {...args} />
    </Section>
  ),
};

export const Default: Story = {
  render: (args) => (
    <Section title='Default'>
      <Select {...args} />
    </Section>
  ),
};

export const Controlled: Story = {
  args: {
    value: 'fr',
  },
  render: (args) => (
    <Section title='Controlled'>
      <InteractiveSelect {...args} />
    </Section>
  ),
};

export const Uncontrolled: Story = {
  args: {
    defaultValue: 'fr',
  },
  render: (args) => (
    <Section title='Uncontrolled'>
      <Select {...args} />
    </Section>
  ),
};

export const WithDescription: Story = {
  args: {
    description: 'Choose your country of residence.',
  },
  render: (args) => (
    <Section title='With description'>
      <InteractiveSelect {...args} />
    </Section>
  ),
};

export const Required: Story = {
  args: {
    required: true,
  },
  render: (args) => (
    <Section title='Required'>
      <InteractiveSelect {...args} />
    </Section>
  ),
};

export const WithError: Story = {
  args: {
    required: true,
    error: 'Country is required.',
  },
  render: (args) => (
    <Section title='With error'>
      <InteractiveSelect {...args} />
    </Section>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: 'de',
    disabled: true,
  },
  render: (args) => (
    <Section title='Disabled'>
      <InteractiveSelect {...args} />
    </Section>
  ),
};

export const DisabledOption: Story = {
  args: {
    options: optionsWithDisabled,
  },
  render: (args) => (
    <Section title='Disabled option'>
      <InteractiveSelect {...args} />
    </Section>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section title='Sizes'>
      <View style={storyStyles.column}>
        <Select
          label='Small'
          placeholder='Small select'
          size='sm'
          options={defaultOptions}
        />
        <Select
          label='Medium'
          placeholder='Medium select'
          size='md'
          options={defaultOptions}
        />
        <Select
          label='Large'
          placeholder='Large select'
          size='lg'
          options={defaultOptions}
        />
      </View>
    </Section>
  ),
};

export const LongList: Story = {
  args: {
    options: longOptions,
    placeholder: 'Select a regional workspace',
  },
  render: (args) => (
    <Section title='Long list'>
      <InteractiveSelect {...args} />
    </Section>
  ),
};

export const CustomErrorContent: Story = {
  render: () => (
    <Section title='Custom error content'>
      <Select
        label='Country'
        description='This example renders custom validation content.'
        error={
          <Text style={{ fontWeight: '700' }}>
            Select an available country.
          </Text>
        }
        options={optionsWithDisabled}
        required
      />
    </Section>
  ),
};

export const Accessibility: Story = {
  args: {
    label: 'Country',
    accessibilityLabel: 'Billing country',
    accessibilityHint: 'Choose the country used for invoices.',
    required: true,
  },
  render: (args) => (
    <Section title='Accessibility'>
      <InteractiveSelect {...args} />
    </Section>
  ),
};

export const StyleProps: Story = {
  render: () => (
    <Section title='Style props'>
      <Select
        label='Country'
        options={defaultOptions}
        size='lg'
        style={{ maxWidth: 360 }}
        triggerStyle={{ borderRadius: 16 }}
        textStyle={{ fontWeight: '700' }}
        pickerStyle={{ minHeight: 180 }}
      />
    </Section>
  ),
};

export const States: Story = {
  render: () => (
    <Section title='States'>
      <View style={storyStyles.column}>
        <Select label='Default' options={defaultOptions} />
        <Select label='With value' defaultValue='fr' options={defaultOptions} />
        <Select
          label='Required'
          required
          placeholder='Required select'
          options={defaultOptions}
        />
        <Select
          label='Disabled'
          defaultValue='fr'
          disabled
          options={defaultOptions}
        />
        <Select
          label='Error'
          error='This field is required.'
          options={defaultOptions}
        />
      </View>
    </Section>
  ),
};
