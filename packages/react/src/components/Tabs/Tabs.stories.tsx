import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Alarm,
  Folder,
  Home,
  Image,
  Music,
  Settings,
  User,
} from '@vellira-ui/icons';
const noop = () => undefined;

import { Tabs } from '../Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Tabs Component

Navigation component for switching between related content panels.

**Features**
- Text, icon, and text-with-icon tabs
- Default, underline, and pills appearances
- Horizontal and vertical orientation
- Disabled tabs
- Keyboard navigation with arrow keys, Home, and End
- Panel composition through \`Tabs.Panel\`

### Accessibility

Tabs render tablist, tab, and panel semantics so keyboard and screen reader users can understand the relationship between controls and content.

Correct usage:

\`\`\`tsx
<Tabs defaultActiveIndex={0}>
  <Tabs.List>
    <Tabs.Tab index={0}>Overview</Tabs.Tab>
    <Tabs.Tab index={1}>Settings</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel index={0}>Overview content</Tabs.Panel>
  <Tabs.Panel index={1}>Settings content</Tabs.Panel>
</Tabs>
\`\`\`
`,
      },
    },
  },
  args: {
    defaultActiveIndex: 0,
    orientation: 'horizontal',
    appearance: 'default',
    onChange: noop,
  },
  argTypes: {
    children: {
      description:
        'Tabs content composed from Tabs.List, Tabs.Tab, and Tabs.Panel.',
      control: false,
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    orientation: {
      description: 'Layout direction of the tab list.',
      control: 'select',
      options: ['horizontal', 'vertical'],
      table: {
        type: { summary: `'horizontal' | 'vertical'` },
        defaultValue: { summary: 'horizontal' },
      },
    },
    appearance: {
      description: 'Visual style of the tabs.',
      control: 'select',
      options: ['default', 'underline', 'pills'],
      table: {
        type: { summary: `'default' | 'underline' | 'pills'` },
        defaultValue: { summary: 'default' },
      },
    },
    defaultActiveIndex: {
      description: 'Index of initially active tab.',
      control: 'number',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    activeIndex: {
      description: 'Controlled active tab index.',
      control: 'number',
      table: {
        type: { summary: 'number' },
      },
    },
    onChange: {
      description: 'Called when the active tab changes.',
      action: 'changed',
      table: {
        type: { summary: '(index: number) => void' },
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

const TextTabs = () => (
  <>
    <Tabs.Tab index={0}>Home</Tabs.Tab>
    <Tabs.Tab index={1}>Profile</Tabs.Tab>
    <Tabs.Tab index={2}>Settings</Tabs.Tab>
    <Tabs.Tab index={3}>Notifications</Tabs.Tab>
  </>
);

const IconTabs = () => (
  <>
    <Tabs.Tab index={0} icon={<Home />} aria-label='Home' />
    <Tabs.Tab index={1} icon={<User />} aria-label='Profile' />
    <Tabs.Tab index={2} icon={<Settings />} aria-label='Settings' />
    <Tabs.Tab index={3} icon={<Alarm />} aria-label='Notifications' />
  </>
);

const DisabledTabs = () => (
  <>
    <Tabs.Tab index={0} icon={<Home />}>
      Home
    </Tabs.Tab>
    <Tabs.Tab index={1} icon={<User />}>
      Profile
    </Tabs.Tab>
    <Tabs.Tab index={2} disabled icon={<Settings />}>
      Settings
    </Tabs.Tab>
    <Tabs.Tab index={3} icon={<Alarm />}>
      Notifications
    </Tabs.Tab>
  </>
);

const DefaultPanels = () => (
  <>
    <Tabs.Panel index={0}>
      <div>Home content - Home information</div>
    </Tabs.Panel>
    <Tabs.Panel index={1}>
      <div>Profile content - User information and preferences</div>
    </Tabs.Panel>
    <Tabs.Panel index={2}>
      <div>Settings content - Configuration options</div>
    </Tabs.Panel>
    <Tabs.Panel index={3}>
      <div>Notifications content - Alert and notification settings</div>
    </Tabs.Panel>
  </>
);

const FileTabs = () => (
  <>
    <Tabs.Tab index={0} icon={<Folder />}>
      Files
    </Tabs.Tab>
    <Tabs.Tab index={1} icon={<Image />}>
      Images
    </Tabs.Tab>
    <Tabs.Tab index={2} icon={<Music />}>
      Music
    </Tabs.Tab>
  </>
);

const FilePanels = () => (
  <>
    <Tabs.Panel index={0}>
      <ul>
        <li>document.pdf</li>
        <li>presentation.pptx</li>
        <li>spreadsheet.xlsx</li>
      </ul>
    </Tabs.Panel>
    <Tabs.Panel index={1}>
      <ul>
        <li>photo.jpg</li>
        <li>screenshot.png</li>
        <li>illustration.svg</li>
      </ul>
    </Tabs.Panel>
    <Tabs.Panel index={2}>
      <ul>
        <li>song.mp3</li>
        <li>podcast.wav</li>
        <li>playlist.m3u</li>
      </ul>
    </Tabs.Panel>
  </>
);

const ControlledDemo = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Tabs
      activeIndex={activeIndex}
      onChange={setActiveIndex}
      appearance='underline'
    >
      <Tabs.List>
        <TextTabs />
      </Tabs.List>
      <DefaultPanels />
    </Tabs>
  );
};

export const Basic: Story = {
  args: {
    defaultActiveIndex: 0,
    orientation: 'horizontal',
    appearance: 'default',
  },
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List>
        <TextTabs />
      </Tabs.List>
      <DefaultPanels />
    </Tabs>
  ),
};

export const Underline: Story = {
  render: () => (
    <Tabs defaultActiveIndex={0} appearance='underline'>
      <Tabs.List>
        <TextTabs />
      </Tabs.List>
      <DefaultPanels />
    </Tabs>
  ),
};

export const Pills: Story = {
  render: () => (
    <Tabs defaultActiveIndex={0} appearance='pills'>
      <Tabs.List>
        <TextTabs />
      </Tabs.List>
      <DefaultPanels />
    </Tabs>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <Tabs defaultActiveIndex={0} appearance='pills'>
      <Tabs.List>
        <IconTabs />
      </Tabs.List>
      <DefaultPanels />
    </Tabs>
  ),
};

export const DisabledState: Story = {
  render: () => (
    <Tabs defaultActiveIndex={0}>
      <Tabs.List>
        <DisabledTabs />
      </Tabs.List>
      <DefaultPanels />
    </Tabs>
  ),
};

export const CustomContent: Story = {
  render: () => (
    <Tabs defaultActiveIndex={0}>
      <Tabs.List>
        <FileTabs />
      </Tabs.List>
      <FilePanels />
    </Tabs>
  ),
};

export const VerticalBasic: Story = {
  render: () => (
    <Tabs defaultActiveIndex={0} orientation='vertical'>
      <Tabs.List>
        <TextTabs />
      </Tabs.List>
      <DefaultPanels />
    </Tabs>
  ),
};

export const VerticalPills: Story = {
  render: () => (
    <Tabs defaultActiveIndex={0} orientation='vertical' appearance='pills'>
      <Tabs.List>
        <TextTabs />
      </Tabs.List>
      <DefaultPanels />
    </Tabs>
  ),
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
