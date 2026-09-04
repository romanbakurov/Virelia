import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import { Accordion } from './Accordion';

const noop = () => undefined;

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
  maxWidth: 720,
  minWidth: 0,
  padding: 20,
  border: '1px solid var(--border-muted)',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--surface-subtle)',
} satisfies CSSProperties;

const titleStyle = {
  margin: 0,
  color: 'var(--text-secondary)',
  fontSize: 13,
  fontWeight: 600,
} satisfies CSSProperties;

const paragraphStyle = {
  margin: 0,
} satisfies CSSProperties;

const listStyle = {
  margin: 0,
  paddingInlineStart: 20,
} satisfies CSSProperties;

const stateStyle = {
  margin: 0,
  color: 'var(--text-secondary)',
  fontSize: 14,
} satisfies CSSProperties;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={sectionStyle}>
      <h3 style={titleStyle}>{title}</h3>
      {children}
    </section>
  );
}

function AccountAccordion(props: ComponentProps<typeof Accordion>) {
  return (
    <Accordion {...props}>
      <Accordion.Item value='profile'>
        <Accordion.Trigger>Profile settings</Accordion.Trigger>
        <Accordion.Content>
          Update public profile details, display name, and workspace contact
          information.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value='notifications'>
        <Accordion.Trigger>Notifications</Accordion.Trigger>
        <Accordion.Content>
          Choose email summaries, billing notices, and weekly activity
          reminders.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value='security'>
        <Accordion.Trigger>Security</Accordion.Trigger>
        <Accordion.Content>
          Review passkeys, password rotation, active sessions, and recovery
          options.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

function ControlledAccordion() {
  const [value, setValue] = useState('notifications');

  return (
    <>
      <p style={stateStyle}>Open section: {value || 'none'}</p>
      <AccountAccordion value={value} onValueChange={setValue} collapsible />
    </>
  );
}

function RichContentAccordion() {
  return (
    <Accordion defaultValue='handoff'>
      <Accordion.Item value='handoff'>
        <Accordion.Trigger>Support handoff</Accordion.Trigger>
        <Accordion.Content>
          <p style={paragraphStyle}>
            Summarize ownership, customer status, and the next action so another
            teammate can continue the workflow without opening a separate view.
          </p>
          <ul style={listStyle}>
            <li>Owner: Customer operations</li>
            <li>Status: Waiting for workspace admin</li>
            <li>Next action: Confirm billing contact</li>
          </ul>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value='history'>
        <Accordion.Trigger>Recent history</Accordion.Trigger>
        <Accordion.Content>
          Four workspace settings changed in the last seven days, including two
          notification rules and one billing contact.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Accordion Component

Accordion organizes related sections of content behind headers so dense
settings, support details, and account information can stay scannable.

**Features**
- Compound API with Accordion.Item, Accordion.Trigger, and Accordion.Content
- Single mode for one open item and multiple mode for parallel open sections
- Controlled value state with value and onValueChange
- Uncontrolled state with defaultValue
- Optional collapsible behavior for single accordions
- Root, item, and trigger disabled states
- Content mounting control through forceMount
- Native button semantics, expanded state, content relationships, focus-visible
  styling, pointer states, and keyboard activation through standard buttons

### Usage

\`\`\`tsx
<Accordion defaultValue='profile' collapsible>
  <Accordion.Item value='profile'>
    <Accordion.Trigger>Profile settings</Accordion.Trigger>
    <Accordion.Content>
      Update public profile details and workspace contact information.
    </Accordion.Content>
  </Accordion.Item>

  <Accordion.Item value='notifications'>
    <Accordion.Trigger>Notifications</Accordion.Trigger>
    <Accordion.Content>
      Choose email summaries, billing notices, and activity reminders.
    </Accordion.Content>
  </Accordion.Item>
</Accordion>
\`\`\`

Use \`type='multiple'\` with an array \`value\` or \`defaultValue\` when more
than one section may stay open. Use \`value\` and \`onValueChange\` for
controlled state, or \`defaultValue\` when the accordion owns its later state.
\`collapsible\` applies to single accordions and allows the current item to
close back to no open section.
`,
      },
    },
  },
  args: {
    children: null,
    type: 'single',
    defaultValue: 'profile',
    collapsible: false,
    disabled: false,
    onValueChange: noop,
  },
  argTypes: {
    children: {
      description:
        'Compound content composed from Accordion.Item, Accordion.Trigger, and Accordion.Content.',
      control: false,
      table: { type: { summary: 'ReactNode' } },
    },
    type: {
      description: 'Expansion model for the accordion.',
      control: 'radio',
      options: ['single', 'multiple'],
      table: {
        type: { summary: `'single' | 'multiple'` },
        defaultValue: { summary: 'single' },
      },
    },
    value: {
      description: 'Controlled expanded value or values.',
      control: false,
      table: { type: { summary: 'string | string[]' } },
    },
    defaultValue: {
      description: 'Initial expanded value or values for uncontrolled usage.',
      control: 'text',
      table: { type: { summary: 'string | string[]' } },
    },
    onValueChange: {
      description: 'Called with the next expanded value or values.',
      action: 'value changed',
      table: { type: { summary: '(value: string | string[]) => void' } },
    },
    collapsible: {
      description:
        'Allows a single accordion to collapse the currently expanded item.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } },
    },
    disabled: {
      description: 'Disables every item in the accordion.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Section title='Default'>
      <AccountAccordion {...args} defaultValue='profile' />
    </Section>
  ),
};

export const Basic: Story = {
  render: (args) => (
    <Section title='Basic'>
      <AccountAccordion {...args} defaultValue='profile' />
    </Section>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Section title='Multiple'>
      <AccountAccordion
        type='multiple'
        defaultValue={['profile', 'security']}
      />
    </Section>
  ),
};

export const Controlled: Story = {
  render: () => (
    <Section title='Controlled'>
      <ControlledAccordion />
    </Section>
  ),
};

export const UncontrolledDefaultValue: Story = {
  render: () => (
    <Section title='Uncontrolled default value'>
      <AccountAccordion defaultValue='security' />
    </Section>
  ),
};

export const Collapsible: Story = {
  render: () => (
    <Section title='Collapsible'>
      <AccountAccordion defaultValue='notifications' collapsible />
    </Section>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Section title='Disabled'>
      <Accordion defaultValue='profile'>
        <Accordion.Item value='profile'>
          <Accordion.Trigger>Profile settings</Accordion.Trigger>
          <Accordion.Content>
            Profile details are visible because this section is already open.
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value='audit' disabled>
          <Accordion.Trigger>Audit exports</Accordion.Trigger>
          <Accordion.Content>
            Audit exports become available after the first report is generated.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Section>
  ),
};

export const RichContent: Story = {
  render: () => (
    <Section title='Rich content'>
      <RichContentAccordion />
    </Section>
  ),
};
