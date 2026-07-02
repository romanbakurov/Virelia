import type { Meta, StoryObj } from '@storybook/react';
import { Text, View } from 'react-native';

import { useTheme } from '../../theme/useTheme';

import { Tooltip } from './Tooltip';

const placements = [
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
] as const;

const Trigger = ({ label = 'Press and hold' }: { label?: string }) => (
  <View
    style={{
      padding: 12,
      borderRadius: 8,
      backgroundColor: '#eee',
    }}
  >
    <Text>{label}</Text>
  </View>
);

const CustomTooltipContent = () => {
  const { theme } = useTheme();

  return (
    <Text
      style={{
        color: theme.components.tooltip.content.fg,
        fontFamily: theme.tokens.typography.family.regular,
        fontSize: theme.tokens.typography.size.sm,
      }}
    >
      Custom tooltip node
    </Text>
  );
};

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Tooltip Component

Contextual helper displayed on long press in React Native.

**Features**
- Long press interaction
- Automatic show and hide
- Custom content
- Disabled state
- Configurable maximum width

### Usage

Use Tooltip to provide additional context or guidance without permanently occupying screen space.

Correct usage:

\`\`\`tsx
<Tooltip content="Additional information">
  <Button>Long press me</Button>
</Tooltip>
\`\`\`

### Accessibility

- Long press activation
- Accessible trigger
- Disabled state support
- Custom tooltip content

### Common use cases

- Explain icons
- Additional field guidance
- Action descriptions
- Contextual help
- Short usage hints
`,
      },
    },
  },
  args: {
    content: 'Helpful native tooltip content',
    placement: 'top',
    children: <Trigger />,
  },
  argTypes: {
    content: {
      description: 'Tooltip content.',
      control: 'text',
    },
    placement: {
      description: 'Tooltip position relative to the trigger.',
      control: 'select',
      options: placements,
    },
    disabled: {
      description: 'Disables tooltip behavior.',
      control: 'boolean',
    },
    maxWidth: {
      description: 'Maximum tooltip width.',
      control: 'number',
    },
    children: {
      control: false,
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {};

export const LongContent: Story = {
  args: {
    content:
      'Use this tooltip for short contextual help. Keep content concise on small screens.',
    maxWidth: 280,
    children: <Trigger label='Long tooltip' />,
  },
};

export const CustomContent: Story = {
  args: {
    content: <CustomTooltipContent />,
    children: <Trigger label='Custom content' />,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: <Trigger label='Disabled tooltip' />,
  },
};

export const AutoHide: Story = {
  args: {
    content: 'This tooltip will disappear automatically.',
    children: <Trigger label='Auto hide' />,
  },
};
