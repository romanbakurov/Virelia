import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDown, Copy, Edit, Settings, Trash } from '@vellira-ui/icons';
import type { ComponentProps } from 'react';

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
  argTypes: {
    children: { control: false },
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
  args: {
    color: 'primary',
    size: 'md',
    placement: 'bottom-start',
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

const noop = () => undefined;

export const Basic: Story = {
  render: (args) => (
    <Dropdown {...args}>
      <Dropdown.Trigger>Actions</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item icon={<Edit />} shortcut='⌘E' onSelect={noop}>
          Edit
        </Dropdown.Item>
        <Dropdown.Item icon={<Copy />} onSelect={noop}>
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

export const AsChildTrigger: Story = {
  render: (args) => (
    <Dropdown {...args} placement='bottom-end'>
      <Dropdown.Trigger asChild>
        <Button appearance='outline' color='neutral' iconEnd={<ChevronDown />}>
          Actions
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item icon={<Settings />}>Settings</Dropdown.Item>
        <Dropdown.Item icon={<Copy />}>Copy link</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};

export const CheckboxAndRadio: Story = {
  render: (args) => <CheckboxAndRadioExample {...args} />,
};

function CheckboxAndRadioExample(args: ComponentProps<typeof Dropdown>) {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('system');

  return (
    <Dropdown {...args} closeOnSelect={false}>
      <Dropdown.Trigger>Preferences</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.CheckboxItem
          checked={notifications}
          onCheckedChange={setNotifications}
        >
          Notifications
        </Dropdown.CheckboxItem>
        <Dropdown.Separator />
        <Dropdown.RadioGroup value={theme} onValueChange={setTheme}>
          <Dropdown.RadioItem value='light'>Light</Dropdown.RadioItem>
          <Dropdown.RadioItem value='dark'>Dark</Dropdown.RadioItem>
          <Dropdown.RadioItem value='system'>System</Dropdown.RadioItem>
        </Dropdown.RadioGroup>
      </Dropdown.Content>
    </Dropdown>
  );
}

export const RichItems: Story = {
  render: (args) => (
    <Dropdown {...args} minWidth={280}>
      <Dropdown.Trigger>Account</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Group>
          <Dropdown.Label>Workspace</Dropdown.Label>
          <Dropdown.Item
            icon={<Settings />}
            description='Manage account and security'
            badge='Pro'
            shortcut='⌘P'
          >
            Profile
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon>
              <Settings />
            </Dropdown.ItemIcon>
            Workspace settings
            <Dropdown.ItemDescription>
              Members, billing, and access
            </Dropdown.ItemDescription>
            <Dropdown.ItemBadge>Owner</Dropdown.ItemBadge>
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown>
  ),
};

export const LinkItems: Story = {
  render: (args) => (
    <Dropdown {...args}>
      <Dropdown.Trigger>Links</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item href='/settings' icon={<Settings />}>
          Settings
        </Dropdown.Item>
        <Dropdown.Item href='https://example.com' target='_blank'>
          External link
        </Dropdown.Item>
        <Dropdown.Item href='/disabled' disabled>
          Disabled link
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
    loadingText: 'Loading actions...',
  },
  render: (args) => (
    <Dropdown {...args} defaultOpen>
      <Dropdown.Trigger>Actions</Dropdown.Trigger>
      <Dropdown.Content />
    </Dropdown>
  ),
};

export const Empty: Story = {
  render: (args) => (
    <Dropdown {...args} defaultOpen>
      <Dropdown.Trigger>Actions</Dropdown.Trigger>
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
    <Dropdown {...args}>
      <Dropdown.Trigger>Actions</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Edit</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};
