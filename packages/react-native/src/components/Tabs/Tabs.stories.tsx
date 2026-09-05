import type { Meta, StoryObj } from '@storybook/react-native';
import { Home, Settings, User } from '@vellira-ui/icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../theme';

import { Tabs } from '.';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        // language=Markdown
        component: `
### Tabs Component

Navigation component used to organize related content into multiple views.

**Features**
- Value-based compound API with List, Trigger, Content, Indicator, Icon, and
  Badge parts
- Controlled and uncontrolled value state
- Horizontal and vertical orientation
- Automatic and manual activation modes
- Tabs and navigation interaction modes
- Trigger composition through \`asChild\`
- Line, pills, and segmented variants
- Primary, neutral, success, warning, and danger colors
- Sizes: sm, md, and lg
- Token-driven colors, radii, spacing, focus rings, and segmented surface shadow
- Disabled triggers, rich trigger content, icons, badges, and descriptions
- List-level scrollable tabs
- keepMounted, lazyMount, and forceMount mounting policies
- Native accessibilityRole and accessibilityState support

### Usage

Use Tabs when related panels share the same screen context and only one panel
should be active at a time.

\`\`\`tsx
<Tabs defaultValue='overview' variant='line' color='primary'>
  <Tabs.List scrollable>
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

### Accessibility

In the default \`mode='tabs'\`, Tabs exposes native tab semantics where
available:

- \`Tabs.List\` exposes a tab list
- \`Tabs.Trigger\` exposes selected and disabled state
- disabled triggers do not activate
- active content is mounted according to the root mounting policy

When \`mode='navigation'\` is used, Tabs switches away from tab semantics:

- \`Tabs.List\` does not expose a tab-list role
- \`Tabs.Trigger asChild\` preserves the semantics of the composed child
- disabled navigation triggers do not activate
- \`Tabs.Content\` is not required
`,
      },
    },
  },
  args: {
    children: null,
    defaultValue: 'overview',
    variant: 'line',
    orientation: 'horizontal',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['line', 'pills', 'segmented'],
    },
    mode: {
      control: 'select',
      options: ['tabs', 'navigation'],
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

function PanelText({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <Text
      style={{
        color: theme.semantic.text.secondary,
        fontFamily: theme.tokens.typography.family.regular,
        fontSize: theme.tokens.typography.size.md,
        lineHeight: theme.tokens.typography.lineHeight.md,
      }}
    >
      {children}
    </Text>
  );
}

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
  const panelStyle = {
    minHeight: 80,
  };

  return (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
        <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
        <Tabs.Trigger value='api'>API</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>

      <Tabs.Content value='overview' style={panelStyle}>
        <PanelText>Overview content for the native tabs component.</PanelText>
      </Tabs.Content>

      <Tabs.Content value='usage' style={panelStyle}>
        <PanelText>Usage examples and implementation notes.</PanelText>
      </Tabs.Content>

      <Tabs.Content value='api' style={panelStyle}>
        <PanelText>API details are shown in this panel.</PanelText>
      </Tabs.Content>
    </Tabs>
  );
};

const DisabledTabsStory = (args: React.ComponentProps<typeof Tabs>) => {
  return (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Trigger value='active'>Active</Tabs.Trigger>
        <Tabs.Trigger value='disabled' disabled>
          Disabled
        </Tabs.Trigger>
        <Tabs.Trigger value='settings'>Settings</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>

      <Tabs.Content value='active'>
        <PanelText>Active panel.</PanelText>
      </Tabs.Content>

      <Tabs.Content value='disabled'>
        <PanelText>
          This panel is not reachable while the tab is disabled.
        </PanelText>
      </Tabs.Content>

      <Tabs.Content value='settings'>
        <PanelText>Settings panel.</PanelText>
      </Tabs.Content>
    </Tabs>
  );
};

const IconOnlyTabsStory = () => {
  return (
    <Tabs defaultValue='home' variant='pills'>
      <Tabs.List>
        <Tabs.Trigger value='home' icon={<Home />} />
        <Tabs.Trigger value='profile' icon={<User />} />
        <Tabs.Trigger value='settings' icon={<Settings />} />
        <Tabs.Indicator />
      </Tabs.List>

      <Tabs.Content value='home'>
        <PanelText>Home content</PanelText>
      </Tabs.Content>

      <Tabs.Content value='profile'>
        <PanelText>Profile content</PanelText>
      </Tabs.Content>

      <Tabs.Content value='settings'>
        <PanelText>Settings content</PanelText>
      </Tabs.Content>
    </Tabs>
  );
};

const NavigationTabsStory = () => (
  <Tabs mode='navigation' defaultValue='overview' variant='line'>
    <Tabs.List>
      <Tabs.Trigger value='overview' asChild>
        <Pressable>
          <Text>Overview</Text>
        </Pressable>
      </Tabs.Trigger>

      <Tabs.Trigger value='projects' asChild>
        <Pressable>
          <Text>Projects</Text>
        </Pressable>
      </Tabs.Trigger>

      <Tabs.Trigger value='activity' asChild>
        <Pressable>
          <Text>Activity</Text>
        </Pressable>
      </Tabs.Trigger>

      <Tabs.Trigger value='settings' asChild>
        <Pressable>
          <Text>Settings</Text>
        </Pressable>
      </Tabs.Trigger>

      <Tabs.Indicator />
    </Tabs.List>
  </Tabs>
);

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

export const Navigation: Story = {
  render: () => (
    <Section title='Navigation'>
      <NavigationTabsStory />
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
