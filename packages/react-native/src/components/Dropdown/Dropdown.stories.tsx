import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { ChevronDown, DropdownMenu } from '@vellira-ui/icons';
import { Text } from 'react-native';

import { useTheme } from '../../theme';

import { Dropdown } from './Dropdown';

const items = [
  { type: 'group' as const, label: 'Actions' },
  { label: 'Edit profile', value: 'edit' },
  { label: 'Duplicate', value: 'duplicate' },
  { type: 'separator' as const },
  { label: 'Delete account', value: 'delete', danger: true },
];

function DropdownIcon() {
  const { theme } = useTheme();

  return (
    <DropdownMenu
      style={{
        transform: [{ rotate: '90deg' }],
      }}
      size={20}
      color={theme.components.dropdown.trigger.default.fg}
    />
  );
}

function ArrowIcon() {
  const { theme } = useTheme();

  return (
    <ChevronDown
      size={16}
      color={theme.components.dropdown.trigger.default.fg}
    />
  );
}

function TriggerText({ children }: { children: string }) {
  const { theme } = useTheme();

  return (
    <Text
      style={{
        color: theme.components.dropdown.trigger.default.fg,
        fontFamily: theme.tokens.typography.family.regular,
        fontSize: theme.tokens.typography.size.md,
      }}
    >
      {children}
    </Text>
  );
}

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    docs: {
      description: {
        component: `
### Dropdown Component

Contextual action menu for React Native applications. Dropdown is for commands
and secondary actions, not for selecting a saved form value.

**Features**
- Text trigger
- Icon-only trigger
- Custom trigger content
- Groups and separators
- Disabled items
- Danger actions
- Long text support
- Controlled selection callback
- Controlled and uncontrolled open state

### Usage

Use Dropdown when secondary actions should be hidden until requested by the user.
Use Select when the user is choosing a form value from a compact list. Use RadioGroup when a small set of choices should stay visible for comparison.

Correct usage:

\`\`\`tsx
<Dropdown
  label="Actions"
  items={[
    { label: 'Edit', value: 'edit' },
    { label: 'Delete', value: 'delete', danger: true },
  ]}
  onSelect={(value) => console.log(value)}
/>
\`\`\`

### Accessibility

- Accessible button trigger
- Expanded/collapsed state
- Disabled state support
- Screen reader friendly labels

### Common use cases

- Row actions
- Settings menus
- Context menus
- Overflow actions (three dots menu)
- Account actions
`,
      },
    },
  },
  args: {
    label: 'Open menu',
    items,
    showArrow: false,
  },
  argTypes: {
    label: {
      description:
        'Trigger label. Use accessibilityLabel when the rendered label is not plain text.',
      control: 'text',
    },

    accessibilityLabel: {
      description:
        'Accessible trigger label used when label is not plain text or the trigger is icon-only.',
      control: 'text',
    },

    accessibilityHint: {
      description: 'Additional screen reader hint for the trigger.',
      control: 'text',
    },

    trigger: {
      description: 'Custom trigger content.',
      control: false,
    },

    icon: {
      description: 'Icon displayed inside the trigger.',
      control: false,
    },

    arrowIcon: {
      description: 'Custom arrow icon.',
      control: false,
    },

    showArrow: {
      description: 'Controls arrow visibility.',
      control: 'boolean',
    },

    items: {
      description: 'Dropdown items, groups and separators.',
      control: 'object',
    },

    disabled: {
      description: 'Disables the dropdown.',
      control: 'boolean',
    },

    onSelect: {
      description: 'Called when a dropdown action item is selected.',
      action: 'selected',
    },

    open: {
      description: 'Controlled open state.',
      control: 'boolean',
    },

    defaultOpen: {
      description: 'Initial open state for uncontrolled usage.',
      control: 'boolean',
    },

    onOpenChange: {
      description: 'Called when the dropdown requests an open state change.',
      action: 'open changed',
    },

    style: {
      table: { disable: true },
    },

    triggerStyle: {
      table: { disable: true },
    },

    itemStyle: {
      table: { disable: true },
    },

    contentStyle: {
      table: { disable: true },
    },

    textStyle: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    label: 'Actions',
    icon: <DropdownIcon />,
    arrowIcon: <ArrowIcon />,
    showArrow: false,
    items,
  },
};

export const TextOnly: Story = {
  args: {
    label: 'Actions',
    trigger: <TriggerText>Actions</TriggerText>,
    showArrow: true,
    items,
  },
};

export const CustomTrigger: Story = {
  args: {
    trigger: <TriggerText>Account actions</TriggerText>,
    showArrow: true,
    items,
  },
};

export const WithGroupsAndSeparator: Story = {
  args: {
    label: 'Documents',
    showArrow: true,
    items: [
      { type: 'group', label: 'Recent' },
      { label: 'Document 1', value: 'doc1' },
      { label: 'Document 2', value: 'doc2' },
      { type: 'separator' },
      { type: 'group', label: 'Actions' },
      { label: 'Duplicate', value: 'duplicate' },
      { label: 'Delete', value: 'delete', danger: true },
    ],
  },
};

export const WithDisabledItems: Story = {
  args: {
    label: 'Project menu',
    showArrow: true,
    items: [
      { label: 'Rename', value: 'rename' },
      { label: 'Archive', value: 'archive', disabled: true },
      { label: 'Delete', value: 'delete', danger: true },
    ],
  },
};

export const LongText: Story = {
  args: {
    label: 'Long labels',
    showArrow: true,
    items: [
      {
        label: 'This option has a long label and wraps onto another line',
        value: 'long',
        textWrap: 'wrap',
      },
      { label: 'Short option', value: 'short' },
    ],
  },
};

const DropdownWithState = () => {
  const { theme } = useTheme();
  const [value, setValue] = useState<string>();

  return (
    <>
      <Dropdown
        label='Select action'
        items={[
          { label: 'Edit', value: 'edit' },
          { label: 'Duplicate', value: 'duplicate' },
          { label: 'Delete', value: 'delete', danger: true },
        ]}
        onSelect={setValue}
      />

      <Text
        style={{
          marginTop: 12,
          color: theme.semantic.text.primary,
        }}
      >
        Selected: {value ?? 'none'}
      </Text>
    </>
  );
};

export const Selection: Story = {
  args: {
    showArrow: true,
    items,
  },
  render: () => <DropdownWithState />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled menu',
    showArrow: true,
    items,
  },
};
