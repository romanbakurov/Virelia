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
    docs: {
      description: {
        component: `
### Button Component

Native pressable action for React Native screens.

**Features**
- Primary, secondary, and danger variants
- Native \`onPress\` handling
- Token-based colors and typography
- Touch-friendly visual states

### Usage

Use Button for screen actions, form submits, and destructive confirmations.

Correct usage:

\`\`\`tsx
<Button variant='primary' onPress={handleSave}>
  Save changes
</Button>
\`\`\`
`,
      },
    },
  },
  args: {
    onPress: fn(),
  },
  argTypes: {
    children: {
      description: 'Button label.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },

    variant: {
      description: 'Visual style of the button.',
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
      table: {
        type: { summary: `'primary' | 'secondary' | 'danger'` },
        defaultValue: { summary: 'primary' },
      },
    },

    size: {
      description: 'Button size.',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: `'sm' | 'md' | 'lg'` },
        defaultValue: { summary: 'md' },
      },
    },

    disabled: {
      description: 'Disables the button.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    fullWidth: {
      description: 'Expands button to full container width.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    onPress: {
      description: 'Called when the button is pressed.',
      action: 'pressed',
      table: {
        type: { summary: '() => void' },
      },
    },
    leftIcon: {
      description: 'Icon rendered before the button label.',
      control: true,
      table: {
        type: { summary: 'ReactNode' },
      },
    },

    rightIcon: {
      description: 'Icon rendered after the button label.',
      control: true,
      table: {
        type: { summary: 'ReactNode' },
      },
    },

    accessibilityLabel: {
      description: 'Accessible label for icon-only or non-text buttons.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
    size: 'md',
    leftIcon: <Search />,
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Cancel',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Continue',
  },
};

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Button size='sm'>Small</Button>
      <Button size='md'>Medium</Button>
      <Button size='lg'>Large</Button>
    </View>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Button leftIcon={<Search />}>Search</Button>

      <Button variant='secondary' rightIcon={<Search />}>
        Next
      </Button>

      <Button variant='danger' leftIcon={<Search />} rightIcon={<Search />}>
        Delete
      </Button>
    </View>
  ),
};

export const IconOnly: Story = {
  args: {
    leftIcon: <Search />,
    accessibilityLabel: 'Search',
  },
};

// export const CustomIconSize: Story = {
//   render: () => (
//     <View style={{ gap: 12 }}>
//       <Button leftIcon={<Search />} iconSize={16}>
//         Icon 16
//       </Button>
//
//       <Button leftIcon={<Search />} iconSize={24}>
//         Icon 24
//       </Button>
//
//       <Button leftIcon={<Search />} iconSize={32}>
//         Icon 32
//       </Button>
//     </View>
//   ),
// };
