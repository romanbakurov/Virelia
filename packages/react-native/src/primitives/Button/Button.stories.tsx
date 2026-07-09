import type { Meta, StoryObj } from '@storybook/react-native';
import { Download, Search, Settings } from '@vellira-ui/icons';
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
  },
  args: {
    children: 'Button',
    color: 'primary',
    variant: 'solid',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
    onPress: fn(),
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'close', 'danger'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
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
    leftIcon: { control: false },
    rightIcon: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

const storyStyles = StyleSheet.create({
  column: {
    width: '100%',
    gap: 12,
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

export const Colors: Story = {
  render: () => (
    <Section title='Colors'>
      <View style={storyStyles.column}>
        <Button color='primary'>Primary</Button>
        <Button color='secondary'>Secondary</Button>
        <Button color='close'>Close</Button>
        <Button color='danger'>Danger</Button>
      </View>
    </Section>
  ),
};

export const Variants: Story = {
  render: () => (
    <Section title='Variants'>
      <View style={storyStyles.column}>
        <Button color='primary' variant='solid'>
          Primary solid
        </Button>
        <Button color='secondary' variant='solid'>
          Secondary solid
        </Button>
        <Button color='close' variant='solid'>
          Close solid
        </Button>
        <Button color='danger' variant='solid'>
          Danger solid
        </Button>
      </View>

      <View style={storyStyles.column}>
        <Button color='primary' variant='outline'>
          Primary outline
        </Button>
        <Button color='secondary' variant='outline'>
          Secondary outline
        </Button>
        <Button color='close' variant='outline'>
          Close outline
        </Button>
        <Button color='danger' variant='outline'>
          Danger outline
        </Button>
      </View>

      <View style={storyStyles.column}>
        <Button color='primary' variant='ghost'>
          Primary ghost
        </Button>
        <Button color='secondary' variant='ghost'>
          Secondary ghost
        </Button>
        <Button color='close' variant='ghost'>
          Close ghost
        </Button>
        <Button color='danger' variant='ghost'>
          Danger ghost
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
        <Button leftIcon={<Search />}>Left icon</Button>
        <Button rightIcon={<Search />}>Right icon</Button>
        <Button leftIcon={<Search />} rightIcon={<Search />}>
          Both icons
        </Button>
      </View>
    </Section>
  ),
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    leftIcon: <Search />,
    accessibilityLabel: 'Search',
  },
  render: () => (
    <Section title='IconOnly'>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Button leftIcon={<Search />} accessibilityLabel='Search' />
        <Button leftIcon={<Settings />} accessibilityLabel='Settings' />
        <Button leftIcon={<Download />} accessibilityLabel='Download' />
      </View>
    </Section>
  ),
};
