import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Copy,
  Delete,
  DropdownMenu,
  Edit,
  Plus,
  Restart,
  Settings,
} from '@vellira-ui/icons';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
const noop = () => undefined;

import { Dropdown } from '../Dropdown';

const actionItems = [
  { label: 'Edit', value: 'edit', icon: <Edit /> },
  { label: 'Duplicate', value: 'duplicate', icon: <Copy /> },
  { label: 'Refresh', value: 'refresh', icon: <Restart /> },
  { label: 'Delete', value: 'delete', icon: <Delete />, danger: true },
];

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Dropdown Component

Contextual action menu opened from a trigger. Dropdown is for commands and
secondary actions, not for selecting a saved form value.

**Features**
- Controlled and uncontrolled open state
- Text, icon and custom triggers
- Item groups and separators
- Disabled and danger action items
- Keyboard navigation, Home/End and typeahead search
- Accessible trigger and menu semantics
- Custom placement and trigger-width matching

### Usage

Use Dropdown for secondary actions that should not be visible all the time, such
as edit, duplicate, archive, delete or account commands. Use Select when the
user is choosing a form value from a compact list. Use RadioGroup when a small
set of choices should stay visible for comparison.

\`\`\`tsx
<Dropdown
  label='Actions'
  trigger='Actions'
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
    trigger: 'Actions',
    items: actionItems,
    disabled: false,
    showArrow: true,
    onSelect: noop,
    onOpenChange: noop,
  },
  argTypes: {
    label: {
      description:
        'Trigger label. Use ariaLabel when the rendered label is not plain text.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    ariaLabel: {
      description:
        'Accessible trigger label used when label is not plain text or the trigger is icon-only.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    trigger: {
      description:
        'Custom trigger content displayed inside the dropdown button.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    items: {
      description: 'List of dropdown items, groups, and separators.',
      control: 'object',
      table: {
        type: {
          summary: 'Array<DropdownItem | DropdownGroup | DropdownSeparator>',
        },
      },
    },
    placement: {
      description: 'Preferred dropdown menu placement.',
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'right',
        'right-start',
        'right-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
      ],
      table: {
        type: { summary: 'Placement' },
        defaultValue: { summary: 'bottom-start' },
      },
    },
    matchTriggerWidth: {
      description: 'Makes the menu match the trigger width.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      },
    },
    open: {
      description: 'Controlled open state.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      },
    },
    defaultOpen: {
      description: 'Initial open state for uncontrolled usage.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      },
    },
    disabled: {
      description: 'Disables user interaction.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showArrow: {
      description: 'Controls whether the trigger arrow is rendered.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    rotateAngle: {
      description: 'Rotation angle applied to the icon-only trigger on hover.',
      control: 'number',
      table: {
        type: { summary: 'number' },
      },
    },
    textWrap: {
      description: 'Default text wrapping behavior for dropdown item labels.',
      control: 'radio',
      options: ['truncate', 'wrap', 'nowrap'],
      table: {
        type: { summary: `'truncate' | 'wrap' | 'nowrap'` },
      },
    },
    onSelect: {
      description: 'Called when a dropdown action item is selected.',
      action: 'selected',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
    onOpenChange: {
      description: 'Called when the dropdown requests an open state change.',
      action: 'open changed',
      table: {
        type: { summary: '(open: boolean) => void' },
      },
    },
    className: {
      description: 'Class name applied to the root container.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    triggerClassName: {
      description: 'Class name applied to the trigger button.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    contentClassName: {
      description: 'Class name applied to the menu content.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    itemClassName: {
      description: 'Class name applied to every menu item.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    icon: {
      control: false,
      table: { disable: true },
    },
    arrowIcon: {
      control: false,
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;
type DropdownStoryProps = ComponentProps<typeof Dropdown>;

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  minWidth: 0,
  maxWidth: 760,
  padding: 20,
  border: '1px solid var(--border-muted)',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--surface-subtle)',
} satisfies CSSProperties;

const subtitleStyle = {
  margin: 0,
  color: 'var(--text-secondary)',
  fontSize: 13,
  fontWeight: 600,
} satisfies CSSProperties;

const statusStyle = {
  margin: 0,
  color: 'var(--text-secondary)',
  fontSize: 13,
} satisfies CSSProperties;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={sectionStyle}>
      <h3 style={subtitleStyle}>{title}</h3>
      {children}
    </section>
  );
}

function InteractiveDropdown(args: DropdownStoryProps) {
  const [open, setOpen] = useState(args.open ?? args.defaultOpen ?? false);
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    setOpen(args.open ?? args.defaultOpen ?? false);
  }, [args.open, args.defaultOpen]);

  return (
    <>
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
      <p style={statusStyle}>Selected action: {selected ?? 'none'}</p>
    </>
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
    ariaLabel: 'More actions',
    trigger: undefined,
    icon: <DropdownMenu style={{ width: 20, height: 20 }} />,
    showArrow: false,
  },
  render: (args) => (
    <Section title='IconOnly'>
      <Dropdown {...args} />
    </Section>
  ),
};

export const WithGroups: Story = {
  args: {
    label: 'Document actions',
    trigger: 'Document actions',
    items: [
      { type: 'group', label: 'File' },
      { label: 'New document', value: 'new', icon: <Plus /> },
      { label: 'Duplicate', value: 'duplicate', icon: <Copy /> },
      { type: 'separator' },
      { type: 'group', label: 'Settings' },
      { label: 'Preferences', value: 'settings', icon: <Settings /> },
      { label: 'Delete', value: 'delete', icon: <Delete />, danger: true },
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
    trigger: 'Project actions',
    items: [
      { label: 'Edit', value: 'edit', icon: <Edit /> },
      { label: 'Refresh', value: 'refresh', icon: <Restart />, disabled: true },
      { label: 'Delete', value: 'delete', icon: <Delete />, danger: true },
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
    trigger: 'Danger actions',
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
    trigger: 'Long labels',
    textWrap: 'wrap',
    matchTriggerWidth: true,
    items: [
      {
        label:
          'Rename this project using the full generated customer workspace title',
        value: 'rename-long',
      },
      {
        label:
          'Archive all completed tasks and notify every workspace collaborator',
        value: 'archive-long',
      },
    ],
  },
  render: (args) => (
    <Section title='LongLabels'>
      <Dropdown {...args} />
    </Section>
  ),
};

export const Placement: Story = {
  args: {
    placement: 'bottom-end',
  },
  render: (args) => (
    <Section title='Placement'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          width: '100%',
        }}
      >
        <Dropdown {...args} placement='bottom-start' trigger='Bottom start' />
        <Dropdown {...args} placement='bottom-end' trigger='Bottom end' />
      </div>
    </Section>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Disabled actions',
    trigger: 'Unavailable actions',
    disabled: true,
  },
  render: (args) => (
    <Section title='Disabled'>
      <Dropdown {...args} />
    </Section>
  ),
};
