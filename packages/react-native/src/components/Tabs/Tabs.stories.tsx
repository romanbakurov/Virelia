import type { Meta, StoryObj } from '@storybook/react';
import { Home, Settings, User } from '@vellira-ui/icons';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../theme';

import { createStyles } from './Content/TabsContent.styles';
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
- Compound API with Tabs.List, Tabs.Trigger, and Tabs.Content
- Controlled and uncontrolled state
- Horizontal and vertical orientation
- Line, pills, and segmented variants
- Disabled tabs
- Icon-only and text tabs
- Accessibility support

### Usage

Use Tabs to switch between related content without leaving the current screen.

Correct usage:

\`\`\`tsx
<Tabs defaultValue='overview'>
  <Tabs.List>
    <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
    <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
    <Tabs.Trigger value='api'>API</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value='overview'>
    <Text>Overview content</Text>
  </Tabs.Content>

  <Tabs.Content value='usage'>
    <Text>Usage content</Text>
  </Tabs.Content>

  <Tabs.Content value='api'>
    <Text>API content</Text>
  </Tabs.Content>
</Tabs>
\`\`\`
`,
      },
    },
  },
  args: {
    defaultValue: 'overview',
    variant: 'line',
    orientation: 'horizontal',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['line', 'pills', 'segmented'],
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

function Section({ title, children }: { title: string; children: ReactNode }) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    section: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      width: '100%',
      maxWidth: 760,
      minWidth: 0,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.semantic.border.muted,
      borderRadius: theme.tokens.radius.xl,
      backgroundColor: theme.semantic.surface.subtle,
    },

    subtitle: {
      margin: 0,
      color: theme.semantic.text.secondary,
      fontSize: 13,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.subtitle}>{title}</Text>
      {children}
    </View>
  );
}

const DefaultTabsStory = (args: React.ComponentProps<typeof Tabs>) => {
  const styles = useThemeStyles(createStyles);
  const panelStyle = {
    minHeight: 80,
  };

  return (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
        <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
        <Tabs.Trigger value='api'>API</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value='overview' style={panelStyle}>
        <Text style={styles.text}>
          Overview content for the native tabs component.
        </Text>
      </Tabs.Content>

      <Tabs.Content value='usage' style={panelStyle}>
        <Text style={styles.text}>
          Usage examples and implementation notes.
        </Text>
      </Tabs.Content>

      <Tabs.Content value='api' style={panelStyle}>
        <Text style={styles.text}>API details are shown in this panel.</Text>
      </Tabs.Content>
    </Tabs>
  );
};

const DisabledTabsStory = (args: React.ComponentProps<typeof Tabs>) => {
  const styles = useThemeStyles(createStyles);

  return (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Trigger value='active'>Active</Tabs.Trigger>
        <Tabs.Trigger value='disabled' disabled>
          Disabled
        </Tabs.Trigger>
        <Tabs.Trigger value='settings'>Settings</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value='active'>
        <Text style={styles.text}>Active panel.</Text>
      </Tabs.Content>

      <Tabs.Content value='disabled'>
        <Text style={styles.text}>
          This panel is not reachable while the tab is disabled.
        </Text>
      </Tabs.Content>

      <Tabs.Content value='settings'>
        <Text style={styles.text}>Settings panel.</Text>
      </Tabs.Content>
    </Tabs>
  );
};

const IconOnlyTabsStory = () => {
  const styles = useThemeStyles(createStyles);

  return (
    <Tabs defaultValue='home' variant='pills'>
      <Tabs.List>
        <Tabs.Trigger value='home' icon={<Home />} />
        <Tabs.Trigger value='profile' icon={<User />} />
        <Tabs.Trigger value='settings' icon={<Settings />} />
      </Tabs.List>

      <Tabs.Content value='home'>
        <Text style={styles.text}>Home content</Text>
      </Tabs.Content>

      <Tabs.Content value='profile'>
        <Text style={styles.text}>Profile content</Text>
      </Tabs.Content>

      <Tabs.Content value='settings'>
        <Text style={styles.text}>Settings content</Text>
      </Tabs.Content>
    </Tabs>
  );
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'line',
  },
  render: (args) => (
    <Section title='Default'>
      <DefaultTabsStory {...args} />
    </Section>
  ),
};

export const Line: Story = {
  args: {
    variant: 'line',
  },
  render: (args) => (
    <Section title='Line'>
      <DefaultTabsStory {...args} />
    </Section>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <Section title='Vertical'>
      <DefaultTabsStory {...args} />
    </Section>
  ),
};

export const Pills: Story = {
  args: {
    variant: 'pills',
  },
  render: (args) => (
    <Section title='Pills'>
      <DefaultTabsStory {...args} />
    </Section>
  ),
};

export const Segmented: Story = {
  args: {
    variant: 'segmented',
  },
  render: (args) => (
    <Section title='Segmented'>
      <DefaultTabsStory {...args} />
    </Section>
  ),
};

export const VerticalLine: Story = {
  args: {
    orientation: 'vertical',
    variant: 'line',
  },
  render: (args) => (
    <Section title='Vertical line'>
      <DefaultTabsStory {...args} />
    </Section>
  ),
};

export const WithDisabledTab: Story = {
  render: (args) => (
    <Section title='With disabled tab'>
      <DisabledTabsStory {...args} />
    </Section>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <Section title='Icon only'>
      <IconOnlyTabsStory />
    </Section>
  ),
};
