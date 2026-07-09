import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-native';
import { Check, Close, Search } from '@vellira-ui/icons';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
- Description, required, disabled, read-only and error states
- Left and right icon support
- Clearable input
`,
      },
    },
  },
  args: {
    label: 'Email',
    placeholder: 'name@company.com',
    size: 'md',
    type: 'email',
    disabled: false,
    required: false,
    readOnly: false,
    clearable: false,
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

    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },

    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    clearable: { control: 'boolean' },
    error: { control: 'text' },
    autoFocus: { control: 'boolean' },
    maxLength: { control: 'number' },

    onChange: { action: 'changed' },
    onClear: { action: 'cleared' },

    leftIcon: { control: false },
    rightIcon: { control: false },
    clearIcon: { control: false },
    leftIconTone: {
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
    rightIconTone: {
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
    args.onChange?.(nextValue);
  };

  return <Input {...args} value={value} onChange={handleChange} />;
}

function ClearableInputDemo() {
  const [value, setValue] = useState('Clear me');

  return (
    <Input
      label='Clearable input'
      description='Shows a clear action when the field has a value.'
      value={value}
      onChange={setValue}
      clearable
      clearIcon={<Close />}
      clearIconTone='danger'
      onClear={() => setValue('')}
      placeholder='Type something'
    />
  );
}

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
          onChange={() => undefined}
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
          leftIcon={<Search />}
        />
      </View>
    </Section>
  ),
};

export const Adornments: Story = {
  render: () => (
    <Section title='Icons'>
      <View style={storyStyles.column}>
        <Input
          label='Search'
          leftIcon={<Search />}
          leftIconTone='primary'
          placeholder='Search components'
          type='search'
        />

        <Input
          label='Verified email'
          defaultValue='hello@vellira.dev'
          rightIcon={<Check />}
          rightIconTone='success'
          placeholder='name@company.com'
          type='email'
        />

        <Input
          label='Search settings'
          leftIcon={<Search />}
          rightIcon={<Check />}
          rightIconTone='success'
          leftIconTone='primary'
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
