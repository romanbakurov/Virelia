import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChevronDown,
  Copy,
  Delete,
  DropdownMenu,
  Edit,
  Filter,
  Plus,
  Restart,
  Settings,
} from '@vellira-ui/icons';
const noop = () => undefined;

import { Dropdown } from '../Dropdown';

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Dropdown Component

Contextual action menu opened from a trigger.

**Features**
- Text and icon triggers
- Custom trigger content
- Disabled items
- Danger items
- Long menus
- Different trigger styles

### Usage

Use Dropdown for secondary actions that should not be visible all the time, such as edit, duplicate, delete, or account actions.

Correct usage:

\`\`\`tsx
<Dropdown
  label='Actions'
  trigger='Menu'
  items={[
    { label: 'Edit', value: 'edit' },
    { label: 'Delete', value: 'delete', danger: true },
  ]}
/>
\`\`\`
`,
      },
    },
  },
  args: {
    onSelect: noop,
  },
  argTypes: {
    label: {
      description: 'Accessible label for the dropdown trigger.',
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
    disabled: {
      description: 'Disables the dropdown trigger.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
    rotateAngle: {
      description: 'Rotation angle applied to the arrow icon when open.',
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
        type: { summary: `''truncate', 'wrap', 'nowrap'` },
      },
    },
    onSelect: {
      description: 'Called when a dropdown item is selected.',
      action: 'selected',
      table: {
        type: { summary: '(value: string) => void' },
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

const defaultOptions = [
  {
    label: 'Edit',
    value: 'edit',
    icon: <Edit />,
  },
  { label: 'Refresh', value: 'refresh', icon: <Restart /> },
  {
    label: 'Delete',
    value: 'delete',
    icon: <Delete />,
    danger: true,
  },
];

export const Basic: Story = {
  args: {
    label: 'Active menu',
    icon: <DropdownMenu style={{ width: 20, height: 20 }} />,
    items: defaultOptions,
  },
};

export const TextOnly: Story = {
  args: {
    label: 'Text menu',
    trigger: 'Actions',
    arrowIcon: <ChevronDown />,
    items: [
      { label: 'Edit', value: 'edit' },
      { label: 'Copy', value: 'copy' },
      { label: 'Delete', value: 'delete', danger: true },
    ],
  },
};

export const IconAndText: Story = {
  args: {
    label: 'Actions',
    icon: <Filter style={{ width: 16, height: 16 }} />,
    trigger: 'Menu',
    items: defaultOptions,
  },
};

export const WithDisabledItems: Story = {
  args: {
    label: 'Menu with disabled',
    trigger: 'Available actions',
    items: [
      { label: 'Edit', value: 'edit', icon: <Edit /> },
      { label: 'Refresh', value: 'refresh', icon: <Restart />, disabled: true },
      {
        label: 'Delete',
        value: 'delete',
        icon: <Delete />,
        danger: true,
        disabled: true,
      },
    ],
  },
};

export const DangerZone: Story = {
  args: {
    label: 'Danger zone',
    trigger: 'Delete actions',
    items: [
      { label: 'Delete draft', value: 'draft', danger: true },
      { label: 'Delete published', value: 'published', danger: true },
      { label: 'Delete all', value: 'all', danger: true },
      { label: 'Cancel', value: 'cancel' },
    ],
  },
};

export const WithGroups: Story = {
  args: {
    label: 'Menu with groups',
    trigger: 'Select',
    items: [
      { label: 'Recent', type: 'group' },
      { label: 'Document 1', value: 'doc1' },
      { label: 'Document 2', value: 'doc2' },
      { type: 'separator' },
      { label: 'Actions', type: 'group' },
      { label: 'New document', value: 'new', icon: <Plus /> },
      {
        label: 'Settings',
        value: 'settings',
        icon: <Settings />,
        danger: true,
      },
    ],
  },
};

export const LongLabelsTruncate: Story = {
  args: {
    trigger: 'Long labels (truncate)',
    textWrap: 'truncate',
    items: [
      {
        label:
          'Very very very very very very very long menu item label that will be truncated with ellipsis',
        value: '1',
      },
      {
        label: 'Another long label that also gets truncated',
        value: '2',
      },
      {
        label: 'Short label',
        value: '3',
      },
    ],
  },
};

export const LongLabelsWrap: Story = {
  args: {
    trigger: 'Long labels (wrap)',
    textWrap: 'wrap',
    items: [
      {
        label:
          'Very very very very very very very long menu item label that will wrap to multiple lines for better readability',
        value: '1',
      },
      {
        label: 'Another long label that also wraps to show full content',
        value: '2',
      },
    ],
  },
};

export const TableActions: Story = {
  render: () => {
    const handleSelect = noop;
    const rows = [
      { id: 1, name: 'Document.pdf', status: 'Active' },
      { id: 2, name: 'Image.png', status: 'Processing' },
      { id: 3, name: 'Archive.zip', status: 'Archived' },
    ];

    return (
      <table
        style={{ borderCollapse: 'collapse', width: '100%', minWidth: '300px' }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
            <th style={{ width: '50px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} style={{ borderTop: '1px solid #e5e7eb' }}>
              <td style={{ padding: '8px' }}>{row.name}</td>
              <td style={{ padding: '8px' }}>{row.status}</td>
              <td style={{ padding: '8px' }}>
                <Dropdown
                  placement='left-start'
                  label='Row actions'
                  icon={<DropdownMenu style={{ width: 20, height: 20 }} />}
                  items={[
                    { label: 'Edit', value: 'edit', icon: <Edit /> },
                    { label: 'Copy', value: 'copy', icon: <Copy /> },
                    {
                      label: 'Delete',
                      value: 'delete',
                      icon: <Delete />,
                      danger: true,
                    },
                  ]}
                  onSelect={handleSelect}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};

export const CustomTrigger: Story = {
  args: {
    label: 'Custom trigger',
    showArrow: false,
    trigger: (
      <div
        style={{
          padding: '8px 16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
        }}
      >
        <Settings style={{ width: 16, height: 16 }} />
        Custom Button
      </div>
    ),
    items: defaultOptions,
  },
};

export const DifferentPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Dropdown label='Left' trigger='Left aligned' items={defaultOptions} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Dropdown
          placement='bottom-start'
          label='Center'
          trigger='Center aligned'
          items={defaultOptions}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Dropdown
          placement='bottom-end'
          label='Right'
          trigger='Right aligned'
          items={defaultOptions}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Dropdown
          placement='left-start'
          label='Top'
          trigger='Top'
          items={defaultOptions}
        />
        <Dropdown
          placement='right-start'
          label='Bottom'
          trigger='Bottom'
          items={defaultOptions}
        />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Disabled menu',
    trigger: 'Not available',
    disabled: true,
    items: defaultOptions,
  },
};

export const Selection: Story = {
  args: {
    label: 'Actions',
    trigger: 'Actions',
    items: [
      { label: 'Edit', value: 'edit' },
      { label: 'Copy', value: 'copy' },
      { label: 'Delete', value: 'delete', danger: true },
    ],
  },
};
