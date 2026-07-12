import { useId } from 'react';

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
  const generatedId = useId();
  const resolvedControlId = controlId?.trim() || generatedId;

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
        name='storybook-form-field'
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

function WithInputExample() {
  const controlId = useId();

  return (
    <FormField controlId={controlId} label='Email'>
      <input
        id={controlId}
        name='email'
        type='email'
        autoComplete='email'
        placeholder='name@company.com'
        style={inputStyle}
        className={styles.storyInput}
      />
    </FormField>
  );
}

function WithDescriptionExample() {
  const controlId = useId();

  return (
    <FormField
      controlId={controlId}
      label='Username'
      description='Use 3–20 characters. Letters, numbers, and underscores are allowed.'
    >
      <input
        id={controlId}
        name='username'
        autoComplete='username'
        placeholder='alex_johnson'
        aria-describedby={`${controlId}-description`}
        style={inputStyle}
        className={styles.storyInput}
      />
    </FormField>
  );
}

function RequiredExample() {
  const controlId = useId();

  return (
    <FormField controlId={controlId} label='Full name' required>
      <input
        id={controlId}
        type='text'
        name='full-name'
        autoComplete='name'
        placeholder='Alex Johnson'
        required
        style={inputStyle}
        className={styles.storyInput}
      />
    </FormField>
  );
}

function WithErrorExample() {
  const controlId = useId();

  return (
    <FormField
      controlId={controlId}
      label='Password'
      error='Password must be at least 8 characters.'
    >
      <input
        id={controlId}
        name='password'
        type='password'
        autoComplete='current-password'
        placeholder='Enter password'
        aria-invalid
        aria-describedby={`${controlId}-error`}
        style={errorInputStyle}
        className={styles.storyInput}
      />
    </FormField>
  );
}

function DisabledExample() {
  const controlId = useId();

  return (
    <FormField
      controlId={controlId}
      label='Email'
      description='This field is currently unavailable.'
      disabled
    >
      <input
        id={controlId}
        type='email'
        name='disabled-email'
        autoComplete='email'
        placeholder='name@company.com'
        aria-describedby={`${controlId}-description`}
        disabled
        style={disabledInputStyle}
        className={styles.storyInput}
      />
    </FormField>
  );
}

function WithCheckboxExample() {
  const controlId = useId();

  return (
    <FormField
      controlId={controlId}
      description='This example uses a custom Vellira control.'
    >
      <Checkbox
        id={controlId}
        name='agreement'
        label='Accept terms and conditions'
        aria-describedby={`${controlId}-description`}
      />
    </FormField>
  );
}

function CustomLabelExample() {
  const controlId = useId();

  return (
    <FormField
      controlId={controlId}
      label={
        <span style={customLabelStyle}>
          Workspace
          <span style={badgeStyle}>Public</span>
        </span>
      }
      required
    >
      <input
        id={controlId}
        name='workspace'
        autoComplete='off'
        placeholder='vellira-design'
        required
        style={inputStyle}
        className={styles.storyInput}
      />
    </FormField>
  );
}

function CustomDescriptionExample() {
  const controlId = useId();

  return (
    <FormField
      controlId={controlId}
      label='Password'
      description={
        <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
          <span>Your password must contain:</span>

          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>At least 8 characters</li>
            <li>One number</li>
            <li>One uppercase letter</li>
          </ul>
        </div>
      }
    >
      <input
        id={controlId}
        type='password'
        name='new-password'
        autoComplete='new-password'
        placeholder='Enter password'
        aria-describedby={`${controlId}-description`}
        style={inputStyle}
        className={styles.storyInput}
      />
    </FormField>
  );
}

function CustomErrorExample() {
  const controlId = useId();

  return (
    <FormField
      controlId={controlId}
      label='Email'
      error={
        <div
          style={{
            padding: 'var(--space-2)',
            background: 'var(--surface-subtle)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          This email address is already registered.
        </div>
      }
    >
      <input
        id={controlId}
        type='email'
        name='registered-email'
        autoComplete='email'
        placeholder='name@company.com'
        aria-invalid
        aria-describedby={`${controlId}-error`}
        style={errorInputStyle}
        className={styles.storyInput}
      />
    </FormField>
  );
}

function CompleteExampleDemo() {
  const rootId = useId();
  const controlId = useId();

  return (
    <FormField
      id={rootId}
      controlId={controlId}
      label='Email'
      description='We will use this email for account notifications.'
      required
      error='Email is required.'
    >
      <input
        id={controlId}
        type='email'
        name='complete-email'
        autoComplete='email'
        placeholder='name@company.com'
        aria-invalid
        aria-describedby={`${controlId}-description ${controlId}-error`}
        required
        style={errorInputStyle}
        className={styles.storyInput}
      />
    </FormField>
  );
}

function StatesExample() {
  const defaultId = useId();
  const descriptionId = useId();
  const requiredId = useId();
  const disabledId = useId();
  const errorId = useId();

  return (
    <div style={columnStyle}>
      <FormField controlId={defaultId} label='Default'>
        <input
          id={defaultId}
          name='state-default'
          autoComplete='off'
          placeholder='Default field'
          style={inputStyle}
          className={styles.storyInput}
        />
      </FormField>

      <FormField
        controlId={descriptionId}
        label='With description'
        description='Additional supporting information.'
      >
        <input
          id={descriptionId}
          name='state-username'
          autoComplete='username'
          placeholder='Field with description'
          aria-describedby={`${descriptionId}-description`}
          style={inputStyle}
          className={styles.storyInput}
        />
      </FormField>

      <FormField controlId={requiredId} label='Required' required>
        <input
          id={requiredId}
          name='state-required'
          autoComplete='off'
          placeholder='Required field'
          required
          style={inputStyle}
          className={styles.storyInput}
        />
      </FormField>

      <FormField controlId={disabledId} label='Disabled' disabled>
        <input
          id={disabledId}
          name='state-disabled'
          autoComplete='off'
          placeholder='Disabled field'
          disabled
          style={disabledInputStyle}
          className={styles.storyInput}
        />
      </FormField>

      <FormField
        controlId={errorId}
        label='Error'
        error='This field is invalid.'
      >
        <input
          id={errorId}
          name='state-error'
          autoComplete='off'
          placeholder='Invalid field'
          aria-invalid
          aria-describedby={`${errorId}-error`}
          style={errorInputStyle}
          className={styles.storyInput}
        />
      </FormField>
    </div>
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
  render: () => (
    <Section title='With input'>
      <WithInputExample />
    </Section>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Section title='With description'>
      <WithDescriptionExample />
    </Section>
  ),
};

export const Required: Story = {
  render: () => (
    <Section title='Required'>
      <RequiredExample />
    </Section>
  ),
};

export const WithError: Story = {
  render: () => (
    <Section title='With error'>
      <WithErrorExample />
    </Section>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Section title='Disabled'>
      <DisabledExample />
    </Section>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <Section title='With checkbox'>
      <WithCheckboxExample />
    </Section>
  ),
};

export const CustomLabel: Story = {
  render: () => (
    <Section title='Custom label'>
      <CustomLabelExample />
    </Section>
  ),
};

export const CustomDescription: Story = {
  render: () => (
    <Section title='Custom description'>
      <CustomDescriptionExample />
    </Section>
  ),
};

export const CustomError: Story = {
  render: () => (
    <Section title='Custom error'>
      <CustomErrorExample />
    </Section>
  ),
};

export const CompleteExample: Story = {
  render: () => (
    <Section title='Complete example'>
      <CompleteExampleDemo />
    </Section>
  ),
};

export const States: Story = {
  render: () => (
    <Section title='States'>
      <StatesExample />
    </Section>
  ),
};
