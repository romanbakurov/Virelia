import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChevronDown,
  Copy,
  Download,
  Edit,
  File,
  Folder,
  More,
  Refresh,
  Settings,
  Trash,
  Upload,
  Users,
} from '@vellira-ui/icons';
import type { ComponentProps, CSSProperties } from 'react';

import { Button } from '../../primitives/Button';

import { Dropdown } from './Dropdown';

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Action menu built with compound parts. Use Select for stored values and Dropdown for commands.',
      },
    },
  },
  args: {
    color: 'primary',
    size: 'md',
    placement: 'bottom-start',
    closeOnSelect: true,
    loop: true,
    portal: true,
    avoidCollisions: true,
    offset: 2,
  },
  argTypes: {
    children: { control: false },
    open: { control: false },
    defaultOpen: { control: false },
    onOpenChange: { control: false },
    className: { control: false },
    loadingText: { control: false },
    minWidth: { control: 'text' },
    maxWidth: { control: 'text' },
    offset: { control: 'number' },
    matchTriggerWidth: { control: 'boolean' },
    portal: { control: 'boolean' },
    avoidCollisions: { control: 'boolean' },
    modal: { control: 'boolean' },
    closeOnSelect: { control: 'boolean' },
    loop: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    color: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    placement: {
      control: 'select',
      options: [
        'top-start',
        'top',
        'top-end',
        'right-start',
        'right',
        'right-end',
        'bottom-start',
        'bottom',
        'bottom-end',
        'left-start',
        'left',
        'left-end',
      ],
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;
type DropdownStoryProps = ComponentProps<typeof Dropdown>;

const noop = () => undefined;

const stackStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  alignItems: 'flex-start',
} satisfies CSSProperties;

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  alignItems: 'center',
} satisfies CSSProperties;

export const Basic: Story = {
  render: (args) => (
    <Dropdown {...args} minWidth={220}>
      <Dropdown.Trigger asChild>
        <Button appearance='outline' color='neutral' iconEnd={<ChevronDown />}>
          Actions
        </Button>
      </Dropdown.Trigger>

      <Dropdown.Content>
        <Dropdown.Item icon={<Edit />} shortcut='⌘E' onSelect={noop}>
          Edit
        </Dropdown.Item>
        <Dropdown.Item icon={<Copy />} shortcut='⌘D' onSelect={noop}>
          Duplicate
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item color='danger' icon={<Trash />} onSelect={noop}>
          Delete
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};

export const Groups: Story = {
  render: (args) => (
    <Dropdown {...args} minWidth={240}>
      <Dropdown.Trigger asChild>
        <Button appearance='outline' color='neutral' iconEnd={<ChevronDown />}>
          Project
        </Button>
      </Dropdown.Trigger>

      <Dropdown.Content>
        <Dropdown.Group>
          <Dropdown.Label>Project</Dropdown.Label>
          <Dropdown.Item icon={<Edit />} shortcut='⌘E'>
            Rename
          </Dropdown.Item>
          <Dropdown.Item icon={<Folder />}>Move to folder</Dropdown.Item>
        </Dropdown.Group>

        <Dropdown.Separator />

        <Dropdown.Group>
          <Dropdown.Label>Sharing</Dropdown.Label>
          <Dropdown.Item icon={<Users />}>Invite members</Dropdown.Item>
          <Dropdown.Item icon={<Copy />}>Copy invite link</Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown>
  ),
};

export const RichItems: Story = {
  render: (args) => (
    <Dropdown {...args} minWidth={320}>
      <Dropdown.Trigger asChild>
        <Button appearance='outline' color='neutral' iconStart={<More />}>
          Account
        </Button>
      </Dropdown.Trigger>

      <Dropdown.Content>
        <Dropdown.Item
          icon={<Settings />}
          description='Account, billing, and security'
          badge='Pro'
          shortcut='⌘P'
        >
          Profile settings
        </Dropdown.Item>

        <Dropdown.Item>
          <Dropdown.ItemIcon>
            <Users />
          </Dropdown.ItemIcon>
          Workspace members
          <Dropdown.ItemDescription>
            Manage roles and invitations
          </Dropdown.ItemDescription>
          <Dropdown.ItemBadge>12</Dropdown.ItemBadge>
          <Dropdown.ItemShortcut>⌘M</Dropdown.ItemShortcut>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};

export const CheckboxAndRadio: Story = {
  render: (args) => <CheckboxAndRadioExample {...args} />,
};

function CheckboxAndRadioExample(args: DropdownStoryProps) {
  const [showArchived, setShowArchived] = useState(false);
  const [compactMode, setCompactMode] = useState(true);
  const [density, setDensity] = useState('comfortable');

  return (
    <Dropdown {...args} closeOnSelect={false} minWidth={260}>
      <Dropdown.Trigger asChild>
        <Button appearance='outline' color='neutral' iconEnd={<ChevronDown />}>
          View options
        </Button>
      </Dropdown.Trigger>

      <Dropdown.Content>
        <Dropdown.Group>
          <Dropdown.Label>Visibility</Dropdown.Label>
          <Dropdown.CheckboxItem
            checked={showArchived}
            onCheckedChange={setShowArchived}
          >
            Show archived
          </Dropdown.CheckboxItem>
          <Dropdown.CheckboxItem
            checked={compactMode}
            onCheckedChange={setCompactMode}
          >
            Compact rows
          </Dropdown.CheckboxItem>
        </Dropdown.Group>

        <Dropdown.Separator />

        <Dropdown.Group>
          <Dropdown.Label>Density</Dropdown.Label>
          <Dropdown.RadioGroup value={density} onValueChange={setDensity}>
            <Dropdown.RadioItem value='comfortable'>
              Comfortable
            </Dropdown.RadioItem>
            <Dropdown.RadioItem value='compact'>Compact</Dropdown.RadioItem>
            <Dropdown.RadioItem value='dense'>Dense</Dropdown.RadioItem>
          </Dropdown.RadioGroup>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown>
  );
}

export const Submenu: Story = {
  render: (args) => (
    <Dropdown {...args} minWidth={240} placement='bottom-start'>
      <Dropdown.Trigger asChild>
        <Button appearance='outline' color='neutral' iconEnd={<ChevronDown />}>
          Share
        </Button>
      </Dropdown.Trigger>

      <Dropdown.Content>
        <Dropdown.Item icon={<Copy />}>Copy link</Dropdown.Item>

        <Dropdown.Sub>
          <Dropdown.SubTrigger icon={<Upload />}>Export</Dropdown.SubTrigger>
          <Dropdown.SubContent>
            <Dropdown.Item icon={<File />}>Export as PDF</Dropdown.Item>
            <Dropdown.Item icon={<Download />}>Download archive</Dropdown.Item>
          </Dropdown.SubContent>
        </Dropdown.Sub>

        <Dropdown.Sub>
          <Dropdown.SubTrigger icon={<Users />}>Share with</Dropdown.SubTrigger>
          <Dropdown.SubContent>
            <Dropdown.Item>Workspace</Dropdown.Item>
            <Dropdown.Item>Public link</Dropdown.Item>
          </Dropdown.SubContent>
        </Dropdown.Sub>
      </Dropdown.Content>
    </Dropdown>
  ),
};

export const Links: Story = {
  render: (args) => (
    <Dropdown {...args} minWidth={220}>
      <Dropdown.Trigger asChild>
        <Button appearance='outline' color='neutral' iconEnd={<ChevronDown />}>
          Links
        </Button>
      </Dropdown.Trigger>

      <Dropdown.Content>
        <Dropdown.Item href='/settings' icon={<Settings />}>
          Settings
        </Dropdown.Item>
        <Dropdown.Item
          href='https://example.com'
          target='_blank'
          icon={<File />}
        >
          External link
        </Dropdown.Item>
        <Dropdown.Item href='/disabled' disabled>
          Disabled link
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};

export const PreventCloseOnSelect: Story = {
  render: (args) => (
    <Dropdown {...args} defaultOpen minWidth={260}>
      <Dropdown.Trigger asChild>
        <Button appearance='outline' color='neutral' iconEnd={<ChevronDown />}>
          Advanced
        </Button>
      </Dropdown.Trigger>

      <Dropdown.Content>
        <Dropdown.Item
          icon={<Refresh />}
          description='Runs the action and keeps the menu open'
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          Refresh preview
        </Dropdown.Item>
        <Dropdown.Item icon={<Edit />}>Edit details</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};

export const ControlledOpen: Story = {
  render: (args) => <ControlledOpenExample {...args} />,
};

function ControlledOpenExample(args: DropdownStoryProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={stackStyle}>
      <Button appearance='soft' color='neutral' onClick={() => setOpen(true)}>
        Open from outside
      </Button>

      <Dropdown {...args} open={open} onOpenChange={setOpen} minWidth={220}>
        <Dropdown.Trigger asChild>
          <Button
            appearance='outline'
            color='neutral'
            iconEnd={<ChevronDown />}
          >
            Controlled menu
          </Button>
        </Dropdown.Trigger>

        <Dropdown.Content>
          <Dropdown.Item icon={<Edit />}>Edit</Dropdown.Item>
          <Dropdown.Item icon={<Copy />}>Duplicate</Dropdown.Item>
          <Dropdown.Item color='danger' icon={<Trash />}>
            Delete
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
}

export const Colors: Story = {
  render: (args) => (
    <div style={rowStyle}>
      {(['primary', 'neutral', 'success', 'warning', 'danger'] as const).map(
        (color) => (
          <Dropdown key={color} {...args} color={color} minWidth={200}>
            <Dropdown.Trigger asChild>
              <Button appearance='outline' color='neutral'>
                {color}
              </Button>
            </Dropdown.Trigger>

            <Dropdown.Content>
              <Dropdown.Item icon={<Edit />}>Edit</Dropdown.Item>
              <Dropdown.Item icon={<Copy />}>Duplicate</Dropdown.Item>
              <Dropdown.Item color='danger' icon={<Trash />}>
                Delete
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        )
      )}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={rowStyle}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Dropdown key={size} {...args} size={size} minWidth={200}>
          <Dropdown.Trigger asChild>
            <Button appearance='outline' color='neutral' size={size}>
              {size}
            </Button>
          </Dropdown.Trigger>

          <Dropdown.Content>
            <Dropdown.Item icon={<Edit />}>Edit</Dropdown.Item>
            <Dropdown.Item icon={<Copy />}>Duplicate</Dropdown.Item>
            <Dropdown.Item icon={<Settings />}>Settings</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      ))}
    </div>
  ),
};

export const MatchTriggerWidth: Story = {
  args: {
    matchTriggerWidth: true,
  },
  render: (args) => (
    <Dropdown {...args}>
      <Dropdown.Trigger asChild>
        <Button appearance='outline' color='neutral' iconEnd={<ChevronDown />}>
          Wide trigger defines menu width
        </Button>
      </Dropdown.Trigger>

      <Dropdown.Content>
        <Dropdown.Item icon={<Edit />}>Edit</Dropdown.Item>
        <Dropdown.Item icon={<Copy />}>Duplicate</Dropdown.Item>
        <Dropdown.Item icon={<Settings />}>Settings</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
    loadingText: 'Loading actions...',
    defaultOpen: true,
  },
  render: (args) => (
    <Dropdown {...args} minWidth={220}>
      <Dropdown.Trigger asChild>
        <Button appearance='outline' color='neutral'>
          Actions
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content />
    </Dropdown>
  ),
};

export const Empty: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Dropdown {...args} minWidth={220}>
      <Dropdown.Trigger asChild>
        <Button appearance='outline' color='neutral'>
          Actions
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Empty>No actions available</Dropdown.Empty>
      </Dropdown.Content>
    </Dropdown>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <Dropdown {...args} minWidth={220}>
      <Dropdown.Trigger asChild>
        <Button appearance='outline' color='neutral'>
          Actions
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Edit</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};
