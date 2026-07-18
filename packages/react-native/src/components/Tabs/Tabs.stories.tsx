import type { Meta, StoryObj } from '@storybook/react';
import { Home, Settings, User } from '@vellira-ui/icons';
import { Text } from 'react-native';

import { useThemeStyles } from '../../theme';

import { createStyles } from './Panel/TabsPanel.styles';
import { Tabs } from '.';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Tabs Component

Navigation component used to organize related content into multiple views.

**Features**
- Compound API with Tabs.List, Tabs.Tab, and Tabs.Panel
- Controlled and uncontrolled state
- Horizontal and vertical orientation
- Default, pills, and underline appearances
- Disabled tabs
- Icon-only and text tabs
- Accessibility support

### Usage

Use Tabs to switch between related content without leaving the current screen.

Correct usage:

\`\`\`tsx
<Tabs defaultActiveIndex={0}>
  <Tabs.List>
    <Tabs.Tab index={0}>Overview</Tabs.Tab>
    <Tabs.Tab index={1}>Usage</Tabs.Tab>
    <Tabs.Tab index={2}>API</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel index={0}>
    <Text>Overview content</Text>
  </Tabs.Panel>

  <Tabs.Panel index={1}>
    <Text>Usage content</Text>
  </Tabs.Panel>

  <Tabs.Panel index={2}>
    <Text>API content</Text>
  </Tabs.Panel>
</Tabs>
\`\`\`
`,
      },
    },
  },
  args: {
    defaultActiveIndex: 0,
    appearance: 'default',
    orientation: 'horizontal',
  },
  argTypes: {
    appearance: {
      control: 'select',
      options: ['default', 'pills', 'underline'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    children: {
      control: false,
    },
  },
} satisfies Meta<typeof Tabs>;

const DefaultTabsStory = (args: React.ComponentProps<typeof Tabs>) => {
  const styles = useThemeStyles(createStyles);
  const panelStyle = {
    minHeight: 80,
  };

  return (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Tab index={0}>Overview</Tabs.Tab>
        <Tabs.Tab index={1}>Usage</Tabs.Tab>
        <Tabs.Tab index={2}>API</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel index={0} style={panelStyle}>
        <Text style={styles.text}>
          Overview content for the native tabs component.
        </Text>
      </Tabs.Panel>

      <Tabs.Panel index={1} style={panelStyle}>
        <Text style={styles.text}>
          Usage examples and implementation notes.
        </Text>
      </Tabs.Panel>

      <Tabs.Panel index={2} style={panelStyle}>
        <Text style={styles.text}>API details are shown in this panel.</Text>
      </Tabs.Panel>
    </Tabs>
  );
};

const DisabledTabsStory = (args: React.ComponentProps<typeof Tabs>) => {
  const styles = useThemeStyles(createStyles);

  return (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Tab index={0}>Active</Tabs.Tab>
        <Tabs.Tab index={1} disabled>
          Disabled
        </Tabs.Tab>
        <Tabs.Tab index={2}>Settings</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel index={0}>
        <Text style={styles.text}>Active panel.</Text>
      </Tabs.Panel>

      <Tabs.Panel index={1}>
        <Text style={styles.text}>
          This panel is not reachable while the tab is disabled.
        </Text>
      </Tabs.Panel>

      <Tabs.Panel index={2}>
        <Text style={styles.text}>Settings panel.</Text>
      </Tabs.Panel>
    </Tabs>
  );
};

const IconOnlyTabsStory = () => {
  const styles = useThemeStyles(createStyles);

  return (
    <Tabs appearance='pills'>
      <Tabs.List>
        <Tabs.Tab index={0} icon={<Home />} />
        <Tabs.Tab index={1} icon={<User />} />
        <Tabs.Tab index={2} icon={<Settings />} />
      </Tabs.List>

      <Tabs.Panel index={0}>
        <Text style={styles.text}>Home content</Text>
      </Tabs.Panel>

      <Tabs.Panel index={1}>
        <Text style={styles.text}>Profile content</Text>
      </Tabs.Panel>

      <Tabs.Panel index={2}>
        <Text style={styles.text}>Settings content</Text>
      </Tabs.Panel>
    </Tabs>
  );
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    appearance: 'default',
  },
  render: (args) => <DefaultTabsStory {...args} />,
};

export const Underline: Story = {
  args: {
    appearance: 'underline',
  },
  render: (args) => <DefaultTabsStory {...args} />,
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => <DefaultTabsStory {...args} />,
};

export const Pills: Story = {
  args: {
    appearance: 'pills',
  },
  render: (args) => <DefaultTabsStory {...args} />,
};

export const VerticalUnderline: Story = {
  args: {
    orientation: 'vertical',
    appearance: 'underline',
  },
  render: (args) => <DefaultTabsStory {...args} />,
};

export const WithDisabledTab: Story = {
  render: (args) => <DisabledTabsStory {...args} />,
};

export const IconOnly: Story = {
  render: () => <IconOnlyTabsStory />,
};
