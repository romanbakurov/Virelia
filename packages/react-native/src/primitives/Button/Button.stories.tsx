import type { Meta, StoryObj } from '@storybook/react-native';
import { Download, Filter, Save, Search, Settings } from '@vellira-ui/icons';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fn } from 'storybook/test';

import { useTheme } from '../../theme';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Button Component

Button triggers an action initiated by the user.

**Features**

- Solid, outline, ghost, soft and link appearances
- Primary, neutral, success, warning and danger colors
- Square, rounded and pill shapes
- Sizes: sm, md and lg
- Loading state
- Disabled state
- Full width support
- Start and end icons
- Icon-only mode
- Accessibility support

### Usage

Use Button for primary, neutral and semantic actions throughout the application.

\`\`\`tsx
<Button
  color="primary"
  onPress={handlePress}
>
  Save
</Button>
\`\`\`
`,
      },
    },
  },
  args: {
    children: 'Button',
    color: 'primary',
    appearance: 'solid',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
    onPress: fn(),
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger'],
    },
    appearance: {
      control: 'select',
      options: ['solid', 'outline', 'ghost', 'soft', 'link'],
    },
    shape: {
      control: 'radio',
      options: ['square', 'rounded', 'pill'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    loadingText: { control: 'text' },
    fullWidth: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
    accessibilityLabel: { control: 'text' },
    onPress: { action: 'pressed' },
    iconStart: { control: false },
    iconEnd: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

const storyStyles = StyleSheet.create({
  column: {
    width: '100%',
    gap: 12,
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
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
  });

  return (
    <View style={styles.section}>
      <Text style={styles.subtitle}>{title}</Text>
      {children}
    </View>
  );
}

export const Basic: Story = {
  args: {
    children: 'Download',
    color: 'primary',
    appearance: 'solid',
    size: 'md',
    accessibilityLabel: 'Download',
    iconStart: <Download />,
  },
  render: (args) => (
    <Section title='Basic'>
      <View style={storyStyles.row}>
        <Button {...args}>Download</Button>
      </View>
    </Section>
  ),
};

export const Colors: Story = {
  render: () => (
    <Section title='Colors'>
      <View style={storyStyles.column}>
        <Button color='primary'>Primary</Button>
        <Button color='neutral'>Neutral</Button>
        <Button color='success'>Success</Button>
        <Button color='warning'>Warning</Button>
        <Button color='danger'>Danger</Button>
      </View>
    </Section>
  ),
};

export const Appearances: Story = {
  render: () => (
    <Section title='Appearances'>
      <View style={storyStyles.column}>
        <Button appearance='solid'>Solid</Button>
        <Button appearance='outline'>Outline</Button>
        <Button appearance='ghost'>Ghost</Button>
        <Button appearance='soft'>Soft</Button>
        <Button appearance='link'>Link</Button>
      </View>
    </Section>
  ),
};

export const Matrix: Story = {
  render: () => {
    const colors = [
      'primary',
      'neutral',
      'success',
      'warning',
      'danger',
    ] as const;
    const appearances = ['solid', 'outline', 'ghost', 'soft', 'link'] as const;

    return (
      <Section title='Matrix'>
        <View style={storyStyles.column}>
          {colors.map((color) => (
            <View key={color} style={storyStyles.row}>
              {appearances.map((appearance) => (
                <Button
                  key={`${color}-${appearance}`}
                  appearance={appearance}
                  color={color}
                >
                  {color} {appearance}
                </Button>
              ))}
            </View>
          ))}
        </View>
      </Section>
    );
  },
};

export const Shapes: Story = {
  render: () => (
    <Section title='Shapes'>
      <View style={storyStyles.column}>
        <Button shape='square'>Square</Button>
        <Button shape='rounded'>Rounded</Button>
        <Button shape='pill'>Pill</Button>
      </View>
    </Section>
  ),
};

export const Command: Story = {
  render: () => (
    <Section title='Command'>
      <View style={storyStyles.column}>
        <Button
          appearance='soft'
          badge='4'
          color='neutral'
          iconStart={<Search />}
          shortcut='⌘K'
        >
          Command menu
        </Button>
        <Button
          appearance='ghost'
          color='danger'
          iconStart={<Filter />}
          shortcut='⌘⌫'
        >
          Clear filters
        </Button>
      </View>
    </Section>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section title='Sizes'>
      <View style={storyStyles.column}>
        <Button size='sm'>Small</Button>
        <Button size='md'>Medium</Button>
        <Button size='lg'>Large</Button>
      </View>
    </Section>
  ),
};

export const States: Story = {
  render: () => (
    <Section title='States'>
      <View style={storyStyles.column}>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
        <Button loading loadingText='Saving...'>
          Save
        </Button>
      </View>

      <View style={{ width: 280 }}>
        <Button fullWidth>Full width</Button>
      </View>
    </Section>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Section title='WithIcons'>
      <View style={storyStyles.column}>
        <Button iconStart={<Search />}>Start icon</Button>
        <Button iconEnd={<Search />}>End icon</Button>
        <Button iconStart={<Search />} iconEnd={<Search />}>
          Both icons
        </Button>
      </View>
    </Section>
  ),
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    iconStart: <Search />,
    accessibilityLabel: 'Search',
  },
  render: () => (
    <Section title='IconOnly'>
      <View style={storyStyles.row}>
        <Button iconOnly iconStart={<Search />} accessibilityLabel='Search'>
          Search
        </Button>
        <Button iconOnly iconStart={<Settings />} accessibilityLabel='Settings'>
          Settings
        </Button>
        <Button iconOnly iconStart={<Download />} accessibilityLabel='Download'>
          Download
        </Button>
      </View>
    </Section>
  ),
};

export const AccessibleIconActions: Story = {
  render: () => (
    <Section title='AccessibleIconActions'>
      <View style={storyStyles.row}>
        <Button
          accessibilityLabel='Search'
          color='primary'
          iconOnly
          iconStart={<Search />}
          appearance='ghost'
        />
        <Button
          accessibilityLabel='Filter results'
          color='neutral'
          iconOnly
          iconStart={<Filter />}
          appearance='outline'
        />
        <Button
          accessibilityLabel='Save'
          color='primary'
          iconOnly
          iconStart={<Save />}
          appearance='solid'
        />
      </View>
    </Section>
  ),
};
