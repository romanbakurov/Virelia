import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps, ReactNode } from 'react';
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
        fontSize: theme.components.tooltip.content.fontSize,
      }}
    >
      Custom tooltip node
    </Text>
  );
};

function TooltipPreview({
  children,
  panelChildren,
  showArrow = true,
  panelStyle,
  textStyle,
  ...args
}: ComponentProps<typeof Tooltip> & {
  children: ReactNode;
  panelChildren: ReactNode;
  showArrow?: boolean;
  panelStyle?: ComponentProps<typeof Tooltip.Content>['style'];
  textStyle?: ComponentProps<typeof Tooltip.Content>['textStyle'];
}) {
  return (
    <Tooltip {...args}>
      <Tooltip.Trigger>{children}</Tooltip.Trigger>
      <Tooltip.Content style={panelStyle} textStyle={textStyle}>
        {panelChildren}
        {showArrow && <Tooltip.Arrow />}
      </Tooltip.Content>
    </Tooltip>
  );
}

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
- Compound API with Trigger, Content, and Arrow parts
- Long press interaction for touch interfaces
- Controlled and uncontrolled open state
- String or custom children in Tooltip.Content
- Top, bottom, left, and right placement
- Disabled state
- Native accessibility support

### Usage

Use Tooltip for short contextual help attached to a specific control. Keep the
content concise and avoid hiding required workflow information inside a long
press-only surface.

\`\`\`tsx
<Tooltip placement='top'>
  <Tooltip.Trigger>
    <Button>Long press me</Button>
  </Tooltip.Trigger>

  <Tooltip.Content>
    Additional information
    <Tooltip.Arrow />
  </Tooltip.Content>
</Tooltip>
\`\`\`

### Accessibility

- Trigger content keeps its accessible label
- Disabled tooltips do not create inactive interactive surfaces
- Custom tooltip content should remain short and readable
`,
      },
    },
  },
  args: {
    placement: 'top',
    disabled: false,
    defaultOpen: false,
  },
  argTypes: {
    children: {
      control: false,
      description: 'Compound tooltip children.',
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
    defaultOpen: {
      description: 'Initial uncontrolled open state.',
      control: 'boolean',
    },
    open: {
      control: false,
      description: 'Controlled open state.',
    },
    onOpenChange: {
      action: 'open changed',
      description: 'Called when tooltip open state changes.',
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: (args) => (
    <TooltipPreview {...args} panelChildren='Helpful native tooltip content'>
      <Trigger />
    </TooltipPreview>
  ),
};

export const LongContent: Story = {
  render: (args) => (
    <TooltipPreview
      {...args}
      panelChildren='Use this tooltip for short contextual help. Keep content concise on small screens.'
      panelStyle={{ maxWidth: 280 }}
    >
      <Trigger label='Long tooltip' />
    </TooltipPreview>
  ),
};

export const CustomContent: Story = {
  render: (args) => (
    <TooltipPreview {...args} panelChildren={<CustomTooltipContent />}>
      <Trigger label='Custom content' />
    </TooltipPreview>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <TooltipPreview {...args} panelChildren='Disabled tooltip'>
      <Trigger label='Disabled tooltip' />
    </TooltipPreview>
  ),
};

export const AutoHide: Story = {
  render: (args) => (
    <TooltipPreview
      {...args}
      panelChildren='This tooltip will disappear automatically.'
    >
      <Trigger label='Auto hide' />
    </TooltipPreview>
  ),
};
