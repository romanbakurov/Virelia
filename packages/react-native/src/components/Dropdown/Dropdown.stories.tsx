import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-native';
import { Copy, Edit, More, Refresh, Settings, Trash } from '@vellira-ui/icons';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fn } from 'storybook/test';

import { useTheme } from '../../theme';

import { Dropdown } from './Dropdown';

const actionItems = [
  { type: 'group' as const, label: 'Actions' },
  { label: 'Edit profile', value: 'edit', icon: <Edit /> },
  { label: 'Duplicate', value: 'duplicate', icon: <Copy /> },
  { label: 'Refresh', value: 'refresh', icon: <Refresh /> },
  { type: 'separator' as const },
  { label: 'Delete account', value: 'delete', icon: <Trash />, danger: true },
];

function DropdownIcon() {
  const { theme } = useTheme();

  return (
    <More
      style={{
        transform: [{ rotate: '90deg' }],
      }}
      size={20}
      color={theme.components.dropdown.trigger.default.fg}
    />
  );
}

function CustomTriggerContent() {
  const { theme } = useTheme();
  const color = theme.components.dropdown.trigger.default.fg;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <Settings size={16} color={color} />
      <Text
        style={{
          color,
          fontFamily: theme.tokens.typography.family.regular,
          fontSize: theme.tokens.typography.size.md,
        }}
      >
        Account actions
      </Text>
    </View>
  );
}

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Dropdown Component

Contextual action menu for React Native applications. Dropdown is for commands
and secondary actions, not for selecting a saved form value.

**Features**

- Controlled and uncontrolled open state
- Text, icon and custom triggers
- Groups and separators
- Disabled and danger action items
- Long text support
- Accessibility label, hint and expanded state support

### Usage

Use Dropdown when secondary actions should be hidden until requested by the user.
Use Select when the user is choosing a form value from a compact list. Use
RadioGroup when a small set of choices should stay visible for comparison.

\`\`\`tsx
<Dropdown
  label='Actions'
  items={[
    { label: 'Edit', value: 'edit' },
    { label: 'Delete', value: 'delete', danger: true },
  ]}
  onSelect={handleAction}
/>
\`\`\`
`,
      },
    },
  },
  args: {
    label: 'Actions',
    items: actionItems,
    showArrow: true,
    disabled: false,
    onSelect: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    label: {
      control: 'text',
      description:
        'Trigger label. Use accessibilityLabel when the rendered label is not plain text.',
    },

    accessibilityLabel: {
      control: 'text',
      description:
        'Accessible trigger label used when label is not plain text or the trigger is icon-only.',
    },

    accessibilityHint: {
      control: 'text',
      description: 'Additional screen reader hint for the trigger.',
    },

    trigger: {
      control: false,
      description: 'Custom trigger content.',
    },

    items: {
      control: 'object',
      description: 'Dropdown items, groups and separators.',
    },

    open: {
      control: 'boolean',
      description: 'Controlled open state.',
    },

    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state for uncontrolled usage.',
    },

    disabled: {
      control: 'boolean',
      description: 'Disables user interaction.',
    },

    showArrow: {
      control: 'boolean',
      description: 'Controls arrow visibility.',
    },

    onSelect: {
      action: 'selected',
      description: 'Called when a dropdown action item is selected.',
    },

    onOpenChange: {
      action: 'open changed',
      description: 'Called when the dropdown requests an open state change.',
    },

    icon: {
      control: false,
      description: 'Icon displayed inside the trigger.',
    },

    arrowIcon: {
      control: false,
      description: 'Custom arrow icon.',
    },

    style: {
      control: false,
    },

    triggerStyle: {
      control: false,
    },

    contentStyle: {
      control: false,
    },

    itemStyle: {
      control: false,
    },

    textStyle: {
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Dropdown>;
type DropdownStoryProps = ComponentProps<typeof Dropdown>;

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

    status: {
      color: theme.semantic.text.secondary,
      fontSize: 13,
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.subtitle}>{title}</Text>
      {children}
    </View>
  );
}

function InteractiveDropdown(args: DropdownStoryProps) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(args.open ?? args.defaultOpen ?? false);
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    setOpen(args.open ?? args.defaultOpen ?? false);
  }, [args.open, args.defaultOpen]);

  return (
    <View style={storyStyles.column}>
      <Dropdown
        {...args}
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          args.onOpenChange?.(nextOpen);
        }}
        onSelect={(value) => {
          setSelected(value);
          args.onSelect?.(value);
        }}
      />
      <Text
        style={{
          color: theme.semantic.text.secondary,
          fontSize: 13,
        }}
      >
        Selected action: {selected ?? 'none'}
      </Text>
    </View>
  );
}

export const Playground: Story = {
  render: (args) => (
    <Section title='Playground'>
      <InteractiveDropdown {...args} />
    </Section>
  ),
};

export const Default: Story = {
  render: (args) => (
    <Section title='Default'>
      <Dropdown {...args} />
    </Section>
  ),
};

export const Controlled: Story = {
  args: {
    open: false,
  },
  render: (args) => (
    <Section title='Controlled'>
      <InteractiveDropdown {...args} />
    </Section>
  ),
};

export const Uncontrolled: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Uncontrolled'>
      <Dropdown {...args} />
    </Section>
  ),
};

export const IconOnly: Story = {
  args: {
    label: 'More actions',
    accessibilityLabel: 'More actions',
    accessibilityHint: 'Opens account action menu',
    icon: <DropdownIcon />,
    showArrow: false,
  },
  render: (args) => (
    <Section title='IconOnly'>
      <Dropdown {...args} />
    </Section>
  ),
};

export const CustomTrigger: Story = {
  args: {
    label: 'Account actions',
    trigger: <CustomTriggerContent />,
    showArrow: true,
  },
  render: (args) => (
    <Section title='CustomTrigger'>
      <Dropdown {...args} />
    </Section>
  ),
};

export const WithGroups: Story = {
  args: {
    label: 'Document actions',
    items: [
      { type: 'group', label: 'File' },
      { label: 'Edit', value: 'edit', icon: <Edit /> },
      { label: 'Duplicate', value: 'duplicate', icon: <Copy /> },
      { type: 'separator' },
      { type: 'group', label: 'Danger' },
      { label: 'Delete', value: 'delete', icon: <Trash />, danger: true },
    ],
  },
  render: (args) => (
    <Section title='WithGroups'>
      <Dropdown {...args} />
    </Section>
  ),
};

export const WithDisabledItems: Story = {
  args: {
    label: 'Project actions',
    items: [
      { label: 'Edit', value: 'edit', icon: <Edit /> },
      { label: 'Refresh', value: 'refresh', icon: <Refresh />, disabled: true },
      { label: 'Delete', value: 'delete', icon: <Trash />, danger: true },
    ],
  },
  render: (args) => (
    <Section title='WithDisabledItems'>
      <Dropdown {...args} />
    </Section>
  ),
};

export const DangerActions: Story = {
  args: {
    label: 'Danger actions',
    items: [
      { label: 'Archive project', value: 'archive' },
      { label: 'Delete draft', value: 'delete-draft', danger: true },
      { label: 'Delete project', value: 'delete-project', danger: true },
    ],
  },
  render: (args) => (
    <Section title='DangerActions'>
      <Dropdown {...args} />
    </Section>
  ),
};

export const LongLabels: Story = {
  args: {
    label: 'Long labels',
    items: [
      {
        label: 'Rename this project using the full generated workspace title',
        value: 'rename-long',
        textWrap: 'wrap',
      },
      {
        label: 'Archive completed tasks and notify every collaborator',
        value: 'archive-long',
        textWrap: 'wrap',
      },
    ],
  },
  render: (args) => (
    <Section title='LongLabels'>
      <Dropdown {...args} />
    </Section>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Disabled actions',
    disabled: true,
  },
  render: (args) => (
    <Section title='Disabled'>
      <Dropdown {...args} />
    </Section>
  ),
};
