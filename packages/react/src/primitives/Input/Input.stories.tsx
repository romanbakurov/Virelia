import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Check, Close, Search } from '@vellira-ui/icons';
import type { CSSProperties, ReactNode } from 'react';
import { fn } from 'storybook/test';

import { Input } from '../Input';

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

Labeled text input primitive for short form values.

**Features**
- Controlled and uncontrolled usage
- Label, description and placeholder support
- Sizes: sm, md and lg
- Smart type handling for email, password, tel, url, number and search
- Left and right icon support
- Clearable state
- Disabled, read-only, required and error states
- Optional overflow tooltip
`,
      },
    },
  },
  args: {
    label: 'Email',
    placeholder: 'name@company.com',
    type: 'email',
    size: 'md',
    disabled: false,
    required: false,
    readOnly: false,
    clearable: false,
    showOverflowTooltip: false,
    onChange: fn(),
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
    leftAdornmentTone: {
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
    rightAdornmentTone: {
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
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    clearable: { control: 'boolean' },
    error: { control: 'text' },
    autoComplete: { control: 'text' },
    autoFocus: { control: 'boolean' },
    maxLength: { control: 'number' },
    showOverflowTooltip: { control: 'boolean' },
    onChange: { action: 'changed' },
    onClear: { action: 'cleared' },
    leftAdornment: { control: false },
    rightAdornment: { control: false },
    className: { control: false },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

const fieldColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  width: '100%',
} satisfies CSSProperties;

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
  padding: 20,

  backgroundColor: 'var(--surface-subtle)',

  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'var(--border-muted)',

  borderRadius: 'var(--radius-xl)',
} satisfies CSSProperties;

const subtitleStyle = {
  margin: 0,
  color: 'var(--text-secondary)',
  fontSize: 13,
  fontWeight: 600,
} satisfies CSSProperties;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={sectionStyle}>
      <h3 style={subtitleStyle}>{title}</h3>
      {children}
    </section>
  );
}

const ControlledInputDemo = (args: InputProps) => {
  const [value, setValue] = useState(args.value ?? '');

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    args.onChange?.(nextValue);
  };

  return <Input {...args} value={value} onChange={handleChange} />;
};

const ClearableInputDemo = () => {
  const [value, setValue] = useState('Clear me');

  return (
    <Input
      label='Clearable input'
      value={value}
      onChange={setValue}
      clearable
      clearIcon={<Close />}
      rightAdornmentTone='danger'
      onClear={() => setValue('')}
      placeholder='Type something'
    />
  );
};

export const Basic: Story = {
  args: {
    label: 'Email',
    description: 'Smart autocomplete is derived from type="email".',
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

export const Uncontrolled: Story = {
  args: {
    label: 'Workspace',
    description: 'Uses defaultValue without controlled state.',
    defaultValue: 'vellira-design',
    placeholder: 'workspace-name',
    type: 'text',
  },
  render: (args) => (
    <Section title='Uncontrolled'>
      <Input {...args} />
    </Section>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section title='Sizes'>
      <div style={fieldColumnStyle}>
        <Input label='Small' size='sm' placeholder='Small input' />
        <Input label='Medium' size='md' placeholder='Medium input' />
        <Input label='Large' size='lg' placeholder='Large input' />
      </div>
    </Section>
  ),
};

export const Types: Story = {
  render: () => (
    <Section title='Types'>
      <div style={fieldColumnStyle}>
        <Input label='Text' type='text' placeholder='Ada Lovelace' />
        <Input label='Email' type='email' placeholder='name@company.com' />
        <Input label='Password' type='password' placeholder='Password' />
        <Input label='Number' type='number' placeholder='42' />
        <Input label='Phone' type='tel' placeholder='+33 6 00 00 00 00' />
        <Input label='URL' type='url' placeholder='https://vellira.dev' />
        <Input label='Search' type='search' placeholder='Search components' />
      </div>
    </Section>
  ),
};

export const Adornments: Story = {
  render: () => (
    <Section title='Adornments'>
      <div style={fieldColumnStyle}>
        <Input
          label='Search'
          leftAdornment={<Search />}
          leftAdornmentTone='primary'
          placeholder='Search components'
          type='search'
        />

        <Input
          label='Verified email'
          defaultValue='hello@vellira.dev'
          rightAdornment={<Check />}
          rightAdornmentTone='success'
          placeholder='name@company.com'
          type='email'
        />

        <Input
          label='Search settings'
          leftAdornment={<Search />}
          rightAdornment={<Check />}
          rightAdornmentTone='success'
          leftAdornmentTone='primary'
          defaultValue='Theme'
        />

        <ClearableInputDemo />
      </div>
    </Section>
  ),
};

export const States: Story = {
  render: () => (
    <Section title='States'>
      <div style={fieldColumnStyle}>
        <Input label='Required' required placeholder='Required input' />
        <Input label='Disabled' disabled value='Disabled value' />
        <Input label='Read only' readOnly value='Read only value' />
        <Input
          label='Error'
          value=''
          required
          error='This field is required'
          placeholder='Invalid value'
        />
      </div>
    </Section>
  ),
};

export const WithOverflowTooltip: Story = {
  args: {
    label: 'Company name',
    value:
      'Very long company name that does not fit into the input field and should be shown inside tooltip',
    size: 'md',
    showOverflowTooltip: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Section title='Overflow tooltip'>
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
