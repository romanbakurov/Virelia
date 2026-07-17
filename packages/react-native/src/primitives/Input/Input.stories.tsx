import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-native';
import { Check, Close, Search } from '@vellira-ui/icons';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FormField } from '../../patterns/FormField';
import { useTheme } from '../../theme';

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
- Smart input type behavior
- Sizes: sm, md, lg
- Colors: primary, neutral, success, warning, danger
- Variants: outline, filled, soft
- Description, required, disabled, read-only and error states
- Start and end icon support
- Clearable input, password reveal, masks and formatting
`,
      },
    },
  },
  args: {
    label: 'Email',
    placeholder: 'name@company.com',
    size: 'md',
    type: 'email',
    color: 'primary',
    variant: 'outline',
    disabled: false,
    required: false,
    readOnly: false,
    clearable: false,
    onValueChange: () => undefined,
  },
  argTypes: {
    id: { control: 'text' },
    name: { control: 'text' },
    label: { control: 'text' },
    description: { control: 'text' },
    value: { control: 'text' },
    defaultValue: { control: 'text' },
    placeholder: { control: 'text' },

    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },

    color: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger'],
    },

    variant: {
      control: 'radio',
      options: ['outline', 'filled', 'soft'],
    },

    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },

    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    clearable: { control: 'boolean' },
    invalid: { control: 'boolean' },
    loading: { control: 'boolean' },
    revealPassword: { control: 'boolean' },
    error: { control: 'text' },
    mask: { control: 'text' },
    autoFocus: { control: 'boolean' },
    maxLength: { control: 'number' },

    onValueChange: { action: 'changed' },
    onClear: { action: 'cleared' },

    startIcon: { control: false },
    endIcon: { control: false },
    clearIcon: { control: false },
    format: { control: false },
    parse: { control: false },
    startIconTone: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'success',
        'danger',
        'muted',
        'inverse',
      ],
    },
    endIconTone: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'success',
        'danger',
        'muted',
        'inverse',
      ],
    },
    clearIconTone: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'success',
        'danger',
        'muted',
        'inverse',
      ],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

const storyStyles = StyleSheet.create({
  column: {
    width: '100%',
    gap: 12,
  },

  matrix: {
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

function ControlledInputDemo(args: InputProps) {
  const [value, setValue] = useState(args.value ?? '');

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    args.onValueChange?.(nextValue);
  };

  return <Input {...args} value={value} onValueChange={handleChange} />;
}

function ClearableInputDemo() {
  const [value, setValue] = useState('Clear me');

  return (
    <Input
      label='Clearable input'
      description='Shows a clear action when the field has a value.'
      value={value}
      onValueChange={setValue}
      clearable
      clearIcon={<Close />}
      clearIconTone='danger'
      onClear={() => setValue('')}
      placeholder='Type something'
    />
  );
}

export const Basic: Story = {
  args: {
    label: 'Email',
    description: 'Semantic type maps to native keyboard and text behavior.',
    placeholder: 'name@company.com',
    value: '',
    type: 'email',
  },
  render: (args) => (
    <Section title='Basic'>
      <ControlledInputDemo {...args} />
    </Section>
  ),
};

export const Playground: Story = {
  render: (args) => (
    <Section title='Playground'>
      <ControlledInputDemo {...args} />
    </Section>
  ),
};

export const Uncontrolled: Story = {
  render: () => (
    <Section title='Controlled and uncontrolled'>
      <View style={storyStyles.column}>
        <ControlledInputDemo
          label='Controlled'
          value='Controlled value'
          onValueChange={() => undefined}
        />

        <Input
          label='Uncontrolled'
          defaultValue='Uncontrolled value'
          placeholder='Type something'
        />
      </View>
    </Section>
  ),
};

export const FormFieldContext: Story = {
  render: () => (
    <Section title='FormField context'>
      <View style={storyStyles.column}>
        <FormField
          label='Inherited field'
          description='Input inherits size, required, disabled and invalid.'
          size='sm'
          required
          invalid
        >
          <Input placeholder='Inherited from FormField' />
        </FormField>

        <FormField
          label='Explicit input size'
          description='Input size wins over FormField size.'
          size='sm'
        >
          <Input size='lg' placeholder='Explicit large input' />
        </FormField>
      </View>
    </Section>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section title='Sizes'>
      <View style={storyStyles.column}>
        <Input label='Small' size='sm' placeholder='Small input' />
        <Input label='Medium' size='md' placeholder='Medium input' />
        <Input label='Large' size='lg' placeholder='Large input' />
      </View>
    </Section>
  ),
};

export const Variants: Story = {
  render: () => (
    <Section title='Variants'>
      <View style={storyStyles.column}>
        <Input label='Outline' variant='outline' placeholder='Outline input' />
        <Input label='Filled' variant='filled' placeholder='Filled input' />
        <Input label='Soft' variant='soft' placeholder='Soft input' />
      </View>
    </Section>
  ),
};

export const Colors: Story = {
  render: () => (
    <Section title='Colors'>
      <View style={storyStyles.column}>
        <Input label='Primary' color='primary' placeholder='Primary input' />
        <Input label='Neutral' color='neutral' placeholder='Neutral input' />
        <Input label='Success' color='success' placeholder='Success input' />
        <Input label='Warning' color='warning' placeholder='Warning input' />
        <Input label='Danger' color='danger' placeholder='Danger input' />
      </View>
    </Section>
  ),
};

export const Types: Story = {
  render: () => (
    <Section title='Types'>
      <View style={storyStyles.column}>
        <Input label='Text' type='text' placeholder='Ada Lovelace' />
        <Input label='Email' type='email' placeholder='name@company.com' />
        <Input label='Password' type='password' placeholder='Password' />
        <Input label='Number' type='number' placeholder='42' />
        <Input label='Phone' type='tel' placeholder='+33 6 00 00 00 00' />
        <Input label='URL' type='url' placeholder='https://vellira.dev' />
        <Input
          label='Search'
          type='search'
          placeholder='Search components'
          startIcon={<Search />}
        />
      </View>
    </Section>
  ),
};

export const Actions: Story = {
  render: () => (
    <Section title='Actions'>
      <View style={storyStyles.column}>
        <ClearableInputDemo />

        <Input
          label='Reveal password'
          type='password'
          revealPassword
          value='secret'
        />

        <Input
          label='End icon'
          value=''
          endIcon={<Check />}
          endIconTone='success'
          placeholder='Verified value'
        />
      </View>
    </Section>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Section title='Icons'>
      <View style={storyStyles.column}>
        <Input
          label='Search'
          startIcon={<Search />}
          startIconTone='primary'
          placeholder='Search components'
          type='search'
        />

        <Input
          label='Verified email'
          defaultValue='hello@vellira.dev'
          endIcon={<Check />}
          endIconTone='success'
          placeholder='name@company.com'
          type='email'
        />

        <Input
          label='Search settings'
          startIcon={<Search />}
          endIcon={<Check />}
          endIconTone='success'
          startIconTone='primary'
          defaultValue='Theme'
        />

        <ClearableInputDemo />
      </View>
    </Section>
  ),
};

export const States: Story = {
  render: () => (
    <Section title='States'>
      <View style={storyStyles.column}>
        <Input label='Required' required placeholder='Required input' />

        <Input label='Disabled' disabled value='Disabled value' />

        <Input label='Read only' readOnly value='Read only value' />

        <Input
          label='Error'
          required
          error='This field is required'
          placeholder='Invalid value'
          value=''
        />

        <FormField label='Inherited disabled' disabled>
          <Input disabled={false} placeholder='Disabled by field' />
        </FormField>
      </View>
    </Section>
  ),
};

export const Validation: Story = {
  render: () => (
    <Section title='Validation'>
      <View style={storyStyles.column}>
        <Input
          label='Email'
          type='email'
          required
          error='Enter a valid email address'
          value='wrong-email'
        />

        <Input
          label='Password'
          type='password'
          required
          error='Password must contain at least 8 characters'
          value=''
        />
      </View>
    </Section>
  ),
};
