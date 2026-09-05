import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-native';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { toNativeFontWeight, useTheme } from '../../theme';

import { Accordion } from './Accordion';

const noop = () => undefined;

function Section({ title, children }: { title: string; children: ReactNode }) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    section: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.tokens.spacing[4],
      width: '100%',
      maxWidth: 720,
      minWidth: 0,
      padding: theme.tokens.spacing[5],
      borderWidth: 1,
      borderColor: theme.semantic.border.muted,
      borderRadius: theme.tokens.radius.xl,
      backgroundColor: theme.semantic.surface.subtle,
    },
    title: {
      margin: 0,
      color: theme.semantic.text.secondary,
      fontSize: theme.tokens.typography.size.sm,
      fontWeight: toNativeFontWeight(theme.tokens.typography.weight.semibold),
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

function PanelText({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    text: {
      color: theme.semantic.text.secondary,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.md,
      lineHeight: theme.tokens.typography.lineHeight.md,
    },
  });

  return <Text style={styles.text}>{children}</Text>;
}

function StateText({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    text: {
      color: theme.semantic.text.secondary,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.sm,
      lineHeight: theme.tokens.typography.lineHeight.sm,
    },
  });

  return <Text style={styles.text}>{children}</Text>;
}

function AccountAccordion(props: ComponentProps<typeof Accordion>) {
  return (
    <Accordion {...props}>
      <Accordion.Item value='profile'>
        <Accordion.Trigger>Profile settings</Accordion.Trigger>
        <Accordion.Content>
          <PanelText>
            Update public profile details, display name, and workspace contact
            information.
          </PanelText>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value='notifications'>
        <Accordion.Trigger>Notifications</Accordion.Trigger>
        <Accordion.Content>
          <PanelText>
            Choose email summaries, billing notices, and weekly activity
            reminders.
          </PanelText>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value='security'>
        <Accordion.Trigger>Security</Accordion.Trigger>
        <Accordion.Content>
          <PanelText>
            Review passkeys, password rotation, active sessions, and recovery
            options.
          </PanelText>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

function ControlledAccordion() {
  const [value, setValue] = useState('notifications');

  return (
    <>
      <StateText>Open section: {value || 'none'}</StateText>
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
          <PanelText>
            Include ownership, customer status, and next action so the next
            teammate can continue without opening another view.
          </PanelText>
          <PanelText>Owner: Customer operations</PanelText>
          <PanelText>Status: Waiting for workspace admin</PanelText>
          <PanelText>Next action: Confirm billing contact</PanelText>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value='history'>
        <Accordion.Trigger>Recent history</Accordion.Trigger>
        <Accordion.Content>
          <PanelText>
            Four workspace settings changed in the last seven days, including
            two notification rules and one billing contact.
          </PanelText>
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
        // language=Markdown
        component: `
### Accordion Component

Accordion organizes related sections of content behind headers so dense
settings, support details, and account information can stay scannable on native
screens.

**Features**
- Compound API with Accordion.Item, Accordion.Trigger, and Accordion.Content
- Single mode for one open item and multiple mode for parallel open sections
- Controlled value state with value and onValueChange
- Uncontrolled state with defaultValue
- Optional collapsible behavior for single accordions
- Root, item, and trigger disabled states
- Content mounting control through forceMount
- Native button accessibility role, expanded and disabled state, press
  feedback, and screen reader hints for expand and collapse actions

### Usage

\`\`\`tsx
<Accordion defaultValue='profile' collapsible>
  <Accordion.Item value='profile'>
    <Accordion.Trigger>Profile settings</Accordion.Trigger>
    <Accordion.Content>
      <Text>Update public profile details and workspace contact information.</Text>
    </Accordion.Content>
  </Accordion.Item>

  <Accordion.Item value='notifications'>
    <Accordion.Trigger>Notifications</Accordion.Trigger>
    <Accordion.Content>
      <Text>Choose email summaries, billing notices, and activity reminders.</Text>
    </Accordion.Content>
  </Accordion.Item>
</Accordion>
\`\`\`

Use \`type='multiple'\` with an array \`value\` or \`defaultValue\` when more
than one section may stay open. Use \`value\` and \`onValueChange\` for
controlled state, or \`defaultValue\` when the accordion owns its later state.
\`collapsible\` applies to single accordions and allows the current item to
close back to no open section. Textual children inside Accordion.Content should
be rendered with React Native Text.
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
    },
    type: {
      control: 'radio',
      options: ['single', 'multiple'],
    },
    value: {
      control: false,
    },
    defaultValue: {
      control: 'text',
    },
    onValueChange: {
      action: 'value changed',
    },
    collapsible: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;
type SingleAccordionStoryProps = Extract<
  ComponentProps<typeof Accordion>,
  { type?: 'single' }
>;

function SingleAccountAccordion(args: ComponentProps<typeof Accordion>) {
  const { defaultValue, onValueChange, type: _type, value, ...rest } = args;
  const singleValue = typeof value === 'string' ? value : undefined;
  const singleDefaultValue =
    typeof defaultValue === 'string' ? defaultValue : 'profile';

  return (
    <AccountAccordion
      {...(rest as SingleAccordionStoryProps)}
      type='single'
      value={singleValue}
      defaultValue={singleDefaultValue}
      onValueChange={
        onValueChange as SingleAccordionStoryProps['onValueChange']
      }
    />
  );
}

export const Default: Story = {
  render: (args) => (
    <Section title='Default'>
      <SingleAccountAccordion {...args} />
    </Section>
  ),
};

export const Basic: Story = {
  render: (args) => (
    <Section title='Basic'>
      <SingleAccountAccordion {...args} />
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
            <PanelText>
              Profile details are visible because this section is already open.
            </PanelText>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value='audit' disabled>
          <Accordion.Trigger>Audit exports</Accordion.Trigger>
          <Accordion.Content>
            <PanelText>
              Audit exports become available after the first report is
              generated.
            </PanelText>
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
