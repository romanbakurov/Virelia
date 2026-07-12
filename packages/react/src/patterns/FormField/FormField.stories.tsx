import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import { Checkbox } from '../../primitives/Checkbox';

import { FormField } from './FormField';

import styles from './FormField.module.scss';

const inputStyle = {
  width: '100%',
  padding: 'var(--space-3) var(--space-4)',
  color: 'var(--color-gray-900)',
  font: 'inherit',
  backgroundColor: 'transparent',
  border: '1px solid var(--input-default-border)',
  borderRadius: 'var(--radius-md)',
  outline: 'none',
} satisfies CSSProperties;

const errorInputStyle = {
  ...inputStyle,
  borderColor: 'var(--status-error-border)',
} satisfies CSSProperties;

const disabledInputStyle = {
  ...inputStyle,
  color: 'var(--color-gray-500)',
  backgroundColor: 'var(--input-disabled-bg)',
  cursor: 'not-allowed',
  opacity: 0.6,
} satisfies CSSProperties;

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
  gap: 24,
} satisfies CSSProperties;

const customLabelStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
} satisfies CSSProperties;

const badgeStyle = {
  padding: '2px 6px',
  color: 'var(--text-secondary)',
  fontSize: 12,
  lineHeight: '16px',
  background: 'var(--surface-active)',
  borderRadius: 'var(--radius-full)',
} satisfies CSSProperties;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={sectionStyle}>
      <h3 style={subtitleStyle}>{title}</h3>
      {children}
    </section>
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

Layout wrapper for composing labels, descriptions, validation content, and custom form controls.

**Features**

- String or custom ReactNode label
- String or custom ReactNode description
- String or custom ReactNode error
- Required indicator
- Disabled visual state
- Separate class names for internal elements
- Native div attributes on the root
- Works with native inputs and custom Vellira controls

### Usage

Use FormField when a custom control needs consistent field layout and validation presentation.

\`\`\`tsx
<FormField
  controlId='email'
  label='Email'
  description='Used for account notifications.'
  error={emailError}
  required
>
  <input
    id='email'
    name='email'
    type='email'
    autoComplete='email'
    aria-describedby='email-description email-error'
    aria-invalid={Boolean(emailError)}
  />
</FormField>
\`\`\`

### ID behavior

- \`id\` is applied to the FormField root.
- \`controlId\` associates the label and supporting content with the control.
- FormField does not inject props into children.
- Pass \`controlId\` to FormField and the same \`id\` to the control.
- Add \`aria-describedby\`, \`aria-invalid\`, \`required\`, and \`disabled\` to the control when needed.
`,
      },
    },
  },
  args: {
    controlId: 'field',
    label: 'Label',
    required: false,
    disabled: false,
  },
  argTypes: {
    id: {
      description: 'ID applied to the FormField root container.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },

    controlId: {
      description:
        'ID used to associate the field label and supporting content with the form control.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },

    label: {
      description: 'Label content displayed above the control.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },

    description: {
      description: 'Supporting content displayed below the label.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },

    error: {
      description: 'Validation content displayed below the control.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },

    children: {
      description: 'Form control rendered inside the field.',
      control: false,
      table: {
        type: { summary: 'ReactNode' },
      },
    },

    required: {
      description: 'Displays a required indicator next to the label.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    disabled: {
      description: 'Applies disabled styling to the field content.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    className: {
      description: 'Class name applied to the root container.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },

    controlClassName: {
      description: 'Class name applied to the control wrapper.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },

    labelClassName: {
      description: 'Class name applied to the label.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },

    descriptionClassName: {
      description: 'Class name applied to the description container.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },

    errorClassName: {
      description: 'Class name applied to the error container.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof FormField>;

export default meta;

type FormFieldStoryProps = ComponentProps<typeof FormField>;

function PlaygroundExample({
  children: _children,
  controlId,
  description,
  error,
  ...args
}: FormFieldStoryProps) {
  const resolvedControlId = controlId?.trim() || 'field';

  const describedBy =
    [
      description ? `${resolvedControlId}-description` : undefined,
      error ? `${resolvedControlId}-error` : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <FormField
      {...args}
      controlId={resolvedControlId}
      description={description}
      error={error}
    >
      <input
        id={resolvedControlId}
        name={resolvedControlId}
        className={styles.storyInput}
        autoComplete='off'
        placeholder='Field value'
        required={args.required}
        disabled={args.disabled}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        style={
          args.disabled
            ? disabledInputStyle
            : error
              ? errorInputStyle
              : inputStyle
        }
      />
    </FormField>
  );
}

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Section title='Playground'>
      <PlaygroundExample {...args} />
    </Section>
  ),
};

export const WithInput: Story = {
  args: {
    controlId: 'email',
    label: 'Email',
    children: (
      <input
        id='email'
        name='email'
        type='email'
        autoComplete='email'
        placeholder='name@company.com'
        style={inputStyle}
        className={styles.storyInput}
      />
    ),
  },
  render: (args) => (
    <Section title='With input'>
      <FormField {...args} />
    </Section>
  ),
};

export const WithDescription: Story = {
  args: {
    controlId: 'username',
    label: 'Username',
    description:
      'Use 3–20 characters. Letters, numbers, and underscores are allowed.',
    children: (
      <input
        id='username'
        type='text'
        name='username'
        autoComplete='username'
        placeholder='alex_johnson'
        aria-describedby='username-description'
        style={inputStyle}
        className={styles.storyInput}
      />
    ),
  },
  render: (args) => (
    <Section title='With description'>
      <FormField {...args} />
    </Section>
  ),
};

export const Required: Story = {
  args: {
    controlId: 'full-name',
    label: 'Full name',
    required: true,
    children: (
      <input
        id='full-name'
        type='text'
        name='full-name'
        autoComplete='name'
        placeholder='Alex Johnson'
        required
        style={inputStyle}
        className={styles.storyInput}
      />
    ),
  },
  render: (args) => (
    <Section title='Required'>
      <FormField {...args} />
    </Section>
  ),
};

export const WithError: Story = {
  args: {
    controlId: 'password',
    label: 'Password',
    error: 'Password must be at least 8 characters.',
    children: (
      <input
        id='password'
        type='password'
        name='password'
        autoComplete='current-password'
        placeholder='Enter password'
        aria-invalid
        aria-describedby='password-error'
        style={errorInputStyle}
        className={styles.storyInput}
      />
    ),
  },
  render: (args) => (
    <Section title='With error'>
      <FormField {...args} />
    </Section>
  ),
};

export const Disabled: Story = {
  args: {
    controlId: 'disabled-email',
    label: 'Email',
    description: 'This field is currently unavailable.',
    disabled: true,
    children: (
      <input
        id='disabled-email'
        type='email'
        name='email'
        autoComplete='email'
        placeholder='name@company.com'
        aria-describedby='disabled-email-description'
        disabled
        style={disabledInputStyle}
        className={styles.storyInput}
      />
    ),
  },
  render: (args) => (
    <Section title='Disabled'>
      <FormField {...args} />
    </Section>
  ),
};

export const WithCheckbox: Story = {
  args: {
    controlId: 'agreement',
    description: 'This example uses a custom Vellira control.',
    children: (
      <Checkbox
        id='agreement'
        name='agreement'
        label='Accept terms and conditions'
        aria-describedby='agreement-description'
      />
    ),
  },
  render: (args) => (
    <Section title='With checkbox'>
      <FormField {...args} />
    </Section>
  ),
};

export const CustomLabel: Story = {
  args: {
    controlId: 'workspace',
    label: (
      <span style={customLabelStyle}>
        Workspace
        <span style={badgeStyle}>Public</span>
      </span>
    ),
    required: true,
    children: (
      <input
        id='workspace'
        name='workspace'
        autoComplete='off'
        placeholder='vellira-design'
        required
        style={inputStyle}
        className={styles.storyInput}
      />
    ),
  },
  render: (args) => (
    <Section title='Custom label'>
      <FormField {...args} />
    </Section>
  ),
};

export const CustomDescription: Story = {
  args: {
    controlId: 'secure-password',
    label: 'Password',
    description: (
      <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
        <span>Your password must contain:</span>

        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>At least 8 characters</li>
          <li>One number</li>
          <li>One uppercase letter</li>
        </ul>
      </div>
    ),
    children: (
      <input
        id='secure-password'
        type='password'
        name='password'
        autoComplete='new-password'
        placeholder='Enter password'
        aria-describedby='secure-password-description'
        style={inputStyle}
        className={styles.storyInput}
      />
    ),
  },
  render: (args) => (
    <Section title='Custom description'>
      <FormField {...args} />
    </Section>
  ),
};

export const CustomError: Story = {
  args: {
    controlId: 'registered-email',
    label: 'Email',
    error: (
      <div
        style={{
          padding: 'var(--space-2)',
          background: 'var(--surface-subtle)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        This email address is already registered.
      </div>
    ),
    children: (
      <input
        id='registered-email'
        type='email'
        name='email'
        autoComplete='email'
        placeholder='name@company.com'
        aria-invalid
        aria-describedby='registered-email-error'
        style={errorInputStyle}
        className={styles.storyInput}
      />
    ),
  },
  render: (args) => (
    <Section title='Custom error'>
      <FormField {...args} />
    </Section>
  ),
};

export const CompleteExample: Story = {
  args: {
    id: 'complete-field',
    controlId: 'complete-email',
    label: 'Email',
    description: 'We will use this email for account notifications.',
    required: true,
    error: 'Email is required.',
    children: (
      <input
        id='complete-email'
        type='email'
        name='email'
        autoComplete='email'
        placeholder='name@company.com'
        aria-invalid
        aria-describedby='complete-email-description complete-email-error'
        required
        style={errorInputStyle}
        className={styles.storyInput}
      />
    ),
  },
  render: (args) => (
    <Section title='Complete example'>
      <FormField {...args} />
    </Section>
  ),
};

export const States: Story = {
  render: () => (
    <Section title='States'>
      <div style={columnStyle}>
        <FormField controlId='state-default' label='Default'>
          <input
            id='state-default'
            name='state-default'
            autoComplete='off'
            placeholder='Default field'
            style={inputStyle}
            className={styles.storyInput}
          />
        </FormField>

        <FormField
          controlId='state-username'
          label='With description'
          description='Additional supporting information.'
        >
          <input
            id='state-username'
            name='username'
            autoComplete='username'
            placeholder='Field with description'
            aria-describedby='state-username-description'
            style={inputStyle}
            className={styles.storyInput}
          />
        </FormField>

        <FormField controlId='state-required' label='Required' required>
          <input
            id='state-required'
            name='required'
            autoComplete='off'
            placeholder='Required field'
            required
            style={inputStyle}
            className={styles.storyInput}
          />
        </FormField>

        <FormField controlId='state-disabled' label='Disabled' disabled>
          <input
            id='state-disabled'
            name='state-disabled'
            autoComplete='off'
            placeholder='Disabled field'
            disabled
            style={disabledInputStyle}
            className={styles.storyInput}
          />
        </FormField>

        <FormField
          controlId='state-error'
          label='Error'
          error='This field is invalid.'
        >
          <input
            id='state-error'
            name='state-error'
            autoComplete='off'
            placeholder='Invalid field'
            aria-invalid
            aria-describedby='state-error-error'
            style={errorInputStyle}
            className={styles.storyInput}
          />
        </FormField>
      </div>
    </Section>
  ),
};
