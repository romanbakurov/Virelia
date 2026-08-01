import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';

import { Button } from '../../primitives/Button';
import { Input } from '../../primitives/Input';

import { FormField } from './FormField';

import styles from './FormField.stories.module.scss';

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: 760,
  minWidth: 0,
  padding: 20,
  gap: 16,
  background: 'var(--surface-subtle)',
  border: '1px solid var(--border-muted)',
  borderRadius: 'var(--radius-xl)',
} satisfies CSSProperties;

const subtitleStyle = {
  margin: 0,
  color: 'var(--text-secondary)',
  fontSize: 13,
  fontWeight: 600,
} satisfies CSSProperties;

const columnStyle = {
  display: 'grid',
  width: '100%',
  gap: 18,
} satisfies CSSProperties;

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 18,
} satisfies CSSProperties;

const rawInputStyle = {
  width: '100%',
  padding: 'var(--space-3) var(--space-4)',
  color: 'var(--input-primary-outline-default-fg)',
  font: 'inherit',
  backgroundColor: 'var(--input-primary-outline-default-bg)',
  border: '1px solid var(--input-primary-outline-default-border)',
  borderRadius: 'var(--radius-md)',
  outline: 'none',
} satisfies CSSProperties;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={sectionStyle}>
      <h3 style={subtitleStyle}>{title}</h3>
      {children}
    </section>
  );
}

function InfoMark() {
  return (
    <span
      aria-label='Why this is needed'
      title='Used for audit logs and billing notifications.'
    >
      ?
    </span>
  );
}

function WithInputContextDemo() {
  const [email, setEmail] = useState('');

  return (
    <Section title='FormField + Input context'>
      <FormField
        label='Email'
        description='Input inherits id, aria, required, invalid, and size.'
        required
        size='sm'
      >
        <Input
          value={email}
          onValueChange={setEmail}
          placeholder='name@company.com'
          type='email'
          clearable
        />
      </FormField>
    </Section>
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

Infrastructure for field semantics, layout, state propagation, and accessible labeling.

**Core contract**
- Generates and shares control, label, description, and error ids
- Renders a lower message slot with neutral, success, warning, or danger tone
- Keeps error as the highest-priority message and alert state
- Provides \`required\`, \`disabled\`, \`invalid\`, and \`size\` through context
- Merges description and error ids into \`aria-describedby\`
- Lets Vellira controls such as Input inherit field state automatically
- Still supports direct child native controls through automatic binding

\`\`\`tsx
<FormField
  label='Email'
  description='Used for login.'
  error={emailError}
  required
  size='md'
>
  <Input value={email} onValueChange={setEmail} />
</FormField>
\`\`\`

For common fields, use the shorthand API on Input:

\`\`\`tsx
<Input label='Email' description='Used for login.' error={emailError} />
\`\`\`
`,
      },
    },
  },
  args: {
    label: 'Email',
    description: 'Used for account notifications.',
    message: '',
    messageTone: 'neutral',
    messageLive: 'off',
    required: false,
    disabled: false,
    invalid: false,
    size: 'md',
    orientation: 'vertical',
    labelPosition: 'top',
  },
  argTypes: {
    id: { control: 'text' },
    label: { control: 'text' },
    description: { control: 'text' },
    message: { control: 'text' },
    messageTone: {
      control: 'radio',
      options: ['neutral', 'success', 'warning', 'danger'],
    },
    messageLive: {
      control: 'radio',
      options: ['off', 'polite'],
    },
    error: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
    },
    labelPosition: {
      control: 'radio',
      options: ['top', 'start'],
    },
    optionalText: { control: 'text' },
    labelAction: { control: false },
    labelInfo: { control: false },
    children: { control: false },
    bindControl: { control: 'boolean' },
    className: { control: 'text' },
    controlClassName: { control: 'text' },
    labelClassName: { control: 'text' },
    descriptionClassName: { control: 'text' },
    errorClassName: { control: 'text' },
    messageClassName: { control: 'text' },
  },
} satisfies Meta<typeof FormField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({ children: _children, labelInfo: _labelInfo, ...args }) => (
    <Section title='Playground'>
      <FormField {...args} labelInfo={<InfoMark />}>
        <Input placeholder='name@company.com' type='email' />
      </FormField>
    </Section>
  ),
};

export const WithInputContext: Story = {
  render: () => <WithInputContextDemo />,
};

export const InputShorthand: Story = {
  render: () => (
    <Section title='Input shorthand'>
      <Input
        label='Email'
        description='Input still renders FormField internally for common usage.'
        error='Enter a valid email address.'
        required
        value='wrong-email'
        type='email'
        clearable
      />
    </Section>
  ),
};

export const SizeInheritance: Story = {
  render: () => (
    <Section title='Size inheritance'>
      <div style={columnStyle}>
        <FormField label='Small field' size='sm'>
          <Input placeholder='Inherited sm' />
        </FormField>

        <FormField label='Medium field' size='md'>
          <Input placeholder='Inherited md' />
        </FormField>

        <FormField label='Large field' size='lg'>
          <Input placeholder='Inherited lg' />
        </FormField>

        <FormField
          label='Explicit control size'
          description='Input size wins over FormField size.'
          size='sm'
        >
          <Input size='lg' placeholder='Explicit lg' />
        </FormField>
      </div>
    </Section>
  ),
};

export const StatePropagation: Story = {
  render: () => (
    <Section title='State propagation'>
      <div style={columnStyle}>
        <FormField label='Required from field' required>
          <Input placeholder='Required input' />
        </FormField>

        <FormField
          label='Invalid without error text'
          description='Invalid state can be visual only.'
          invalid
        >
          <Input placeholder='Invalid input' />
        </FormField>

        <FormField label='Disabled from field' disabled>
          <Input placeholder='Disabled input' />
        </FormField>

        <FormField label='Error implies invalid' error='This field is invalid.'>
          <Input placeholder='Invalid input' />
        </FormField>
      </div>
    </Section>
  ),
};

export const Layout: Story = {
  render: () => (
    <Section title='Layout'>
      <div style={columnStyle}>
        <FormField
          label='Vertical'
          description='Default layout for forms.'
          orientation='vertical'
        >
          <Input placeholder='Vertical field' />
        </FormField>

        <FormField
          label='Horizontal'
          description='Useful in dense settings surfaces.'
          orientation='horizontal'
          labelPosition='start'
        >
          <Input placeholder='Horizontal field' />
        </FormField>
      </div>
    </Section>
  ),
};

export const OptionalAndInfo: Story = {
  render: () => (
    <Section title='Optional and info'>
      <div style={columnStyle}>
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
      </div>
    </Section>
  ),
};

export const MessageTones: Story = {
  render: () => (
    <Section title='Message tones'>
      <div style={columnStyle}>
        <FormField
          label='Email'
          description='Used for account notifications.'
          message='Email address is available.'
          messageTone='success'
        >
          <Input color='success' placeholder='name@company.com' />
        </FormField>

        <FormField
          label='API key'
          message='This key expires in 7 days.'
          messageTone='warning'
        >
          <Input color='warning' placeholder='vk_live_...' />
        </FormField>

        <FormField
          label='Project slug'
          message='Lower priority message is replaced by error.'
          error='This slug is already used.'
        >
          <Input invalid placeholder='vellira-ui' />
        </FormField>
      </div>
    </Section>
  ),
};

export const LabelAction: Story = {
  render: () => (
    <Section title='Label action'>
      <FormField
        label='Password'
        labelAction={
          <Button appearance='ghost' color='neutral' size='sm'>
            Forgot password?
          </Button>
        }
        message='Use at least 12 characters.'
      >
        <Input type='password' placeholder='Password' />
      </FormField>
    </Section>
  ),
};

export const NativeControlBinding: Story = {
  render: () => (
    <Section title='Native control binding'>
      <FormField
        label='Workspace'
        description='A direct child native input receives id and aria props.'
        error='Workspace is already taken.'
        required
      >
        <input
          name='workspace'
          placeholder='vellira-design'
          className={styles.storyInput}
          style={rawInputStyle}
        />
      </FormField>
    </Section>
  ),
};

export const VariantsTogether: Story = {
  render: () => (
    <Section title='Fields with input variants'>
      <div style={rowStyle}>
        <FormField label='Primary outline' description='Default field chrome.'>
          <Input color='primary' variant='outline' placeholder='Outline' />
        </FormField>

        <FormField label='Success soft' description='Positive semantic field.'>
          <Input color='success' variant='soft' placeholder='Soft' />
        </FormField>

        <FormField label='Warning filled' description='Attention state.'>
          <Input color='warning' variant='filled' placeholder='Filled' />
        </FormField>
      </div>
    </Section>
  ),
};

export const CustomClasses: Story = {
  render: () => (
    <Section title='Custom classes'>
      <FormField
        label='Repository'
        description='Class slots allow apps to integrate with local CSS modules.'
        error='Repository name is already taken.'
        required
        className={styles.storyCustomRoot}
        labelClassName={styles.storyCustomLabel}
        controlClassName={styles.storyCustomControl}
        descriptionClassName={styles.storyCustomDescription}
        errorClassName={styles.storyCustomError}
      >
        <Input placeholder='vellira' />
      </FormField>
    </Section>
  ),
};
