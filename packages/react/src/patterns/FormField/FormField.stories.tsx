import { useId } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import { Checkbox } from '../../primitives/Checkbox';

import { FormField } from './FormField';

import styles from './FormField.stories.module.scss';

const inputStyle = {
  width: '100%',
  padding: 'var(--space-3) var(--space-4)',
  color: 'var(--input-default-fg)',
  font: 'inherit',
  backgroundColor: 'var(--input-default-bg)',
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
  color: 'var(--input-disabled-fg)',
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
  fontSize: 12,
  lineHeight: '16px',
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
  id='email'
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

- \`id\` associates the label and supporting content with the control.
- FormField does not inject props into children.
- Pass \`id\` to FormField and the same \`id\` to the control.
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
  id,
  description,
  error,
  ...args
}: FormFieldStoryProps) {
  const generatedId = useId();
  const resolvedId = id?.trim() || generatedId;

  const describedBy =
    [
      description ? `${resolvedId}-description` : undefined,
      error ? `${resolvedId}-error` : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <FormField
      {...args}
      id={resolvedId}
      description={description}
      error={error}
    >
      <input
        id={resolvedId}
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
  const id = useId();

  return (
    <FormField id={id} label='Email'>
      <input
        id={id}
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
  const id = useId();

  return (
    <FormField
      id={id}
      label='Username'
      description='Use 3–20 characters. Letters, numbers, and underscores are allowed.'
    >
      <input
        id={id}
        name='username'
        autoComplete='username'
        placeholder='alex_johnson'
        aria-describedby={`${id}-description`}
        style={inputStyle}
        className={styles.storyInput}
      />
    </FormField>
  );
}

function RequiredExample() {
  const id = useId();

  return (
    <FormField id={id} label='Full name' required>
      <input
        id={id}
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
  const id = useId();

  return (
    <FormField
      id={id}
      label='Password'
      error='Password must be at least 8 characters.'
    >
      <input
        id={id}
        name='password'
        type='password'
        autoComplete='current-password'
        placeholder='Enter password'
        aria-invalid
        aria-describedby={`${id}-error`}
        style={errorInputStyle}
        className={styles.storyInput}
      />
    </FormField>
  );
}

function DisabledExample() {
  const id = useId();

  return (
    <FormField
      id={id}
      label='Email'
      description='This field is currently unavailable.'
      disabled
    >
      <input
        id={id}
        type='email'
        name='disabled-email'
        autoComplete='email'
        placeholder='name@company.com'
        aria-describedby={`${id}-description`}
        disabled
        style={disabledInputStyle}
        className={styles.storyInput}
      />
    </FormField>
  );
}

function WithCheckboxExample() {
  const id = useId();

  return (
    <FormField
      id={id}
      description='This example uses a custom Vellira control.'
    >
      <Checkbox
        id={id}
        name='agreement'
        label='Accept terms and conditions'
        aria-describedby={`${id}-description`}
      />
    </FormField>
  );
}

function CustomLabelExample() {
  const id = useId();

  return (
    <FormField
      id={id}
      label={
        <span style={customLabelStyle}>
          Workspace
          <span className={styles.storyBadge} style={badgeStyle}>
            Public
          </span>
        </span>
      }
      required
    >
      <input
        id={id}
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
  const id = useId();

  return (
    <FormField
      id={id}
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
        id={id}
        type='password'
        name='new-password'
        autoComplete='new-password'
        placeholder='Enter password'
        aria-describedby={`${id}-description`}
        style={inputStyle}
        className={styles.storyInput}
      />
    </FormField>
  );
}

function CustomErrorExample() {
  const id = useId();

  return (
    <FormField
      id={id}
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
        id={id}
        type='email'
        name='registered-email'
        autoComplete='email'
        placeholder='name@company.com'
        aria-invalid
        aria-describedby={`${id}-error`}
        style={errorInputStyle}
        className={styles.storyInput}
      />
    </FormField>
  );
}

function CompleteExampleDemo() {
  const id = useId();

  return (
    <FormField
      id={id}
      label='Email'
      description='We will use this email for account notifications.'
      required
      error='Email is required.'
    >
      <input
        id={id}
        type='email'
        name='complete-email'
        autoComplete='email'
        placeholder='name@company.com'
        aria-invalid
        aria-describedby={`${id}-description ${id}-error`}
        required
        style={errorInputStyle}
        className={styles.storyInput}
      />
    </FormField>
  );
}

function CustomClassesExample() {
  const id = useId();

  return (
    <FormField
      id={id}
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
      <input
        id={id}
        name='repository'
        autoComplete='off'
        placeholder='vellira'
        required
        aria-invalid
        aria-describedby={`${id}-description ${id}-error`}
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
      <FormField id={defaultId} label='Default'>
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
        id={descriptionId}
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

      <FormField id={requiredId} label='Required' required>
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

      <FormField id={disabledId} label='Disabled' disabled>
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

      <FormField id={errorId} label='Error' error='This field is invalid.'>
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

export const CustomClasses: Story = {
  render: () => (
    <Section title='Custom classes'>
      <CustomClassesExample />
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
