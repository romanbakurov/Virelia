import type { Meta, StoryObj } from '@storybook/react-native';
import { Search } from '@vellira-ui/icons';
import { View } from 'react-native';
import { fn } from 'storybook/test';

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

const rowStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
  alignItems: 'center',
} as const;

const stackStyle = {
  gap: 16,
  alignItems: 'flex-start',
} as const;

export const Basic: Story = {
  args: {
    children: 'Search',
    color: 'primary',
    variant: 'solid',
    leftIcon: <Search />,
  },
};

export const Colors: Story = {
  render: () => (
    <View style={rowStyle}>
      <Button color='primary'>Primary</Button>
      <Button color='secondary'>Secondary</Button>
      <Button color='close'>Close</Button>
      <Button color='danger'>Danger</Button>
    </View>
  ),
};

export const Variants: Story = {
  render: () => (
    <View style={stackStyle}>
      <View style={rowStyle}>
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

      <View style={rowStyle}>
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

      <View style={rowStyle}>
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
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={rowStyle}>
      <Button size='sm'>Small</Button>
      <Button size='md'>Medium</Button>
      <Button size='lg'>Large</Button>
    </View>
  ),
};

export const States: Story = {
  render: () => (
    <View style={stackStyle}>
      <View style={rowStyle}>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
        <Button loading loadingText='Saving...'>
          Save
        </Button>
      </View>

      <View style={{ width: 280 }}>
        <Button fullWidth>Full width</Button>
      </View>
    </View>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <View style={rowStyle}>
      <Button leftIcon={<Search />}>Left icon</Button>
      <Button rightIcon={<Search />}>Right icon</Button>
      <Button leftIcon={<Search />} rightIcon={<Search />}>
        Both icons
      </Button>
    </View>
  ),
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    leftIcon: <Search />,
    accessibilityLabel: 'Search',
  },
};
