import { useEffect, useState } from 'react';

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

const sectionStyle = {
  alignItems: 'flex-start' as const,
  gap: 16,
  padding: 20,
};

const matrixStyle = {
  flexDirection: 'row' as const,
  flexWrap: 'wrap' as const,
  gap: 12,
};

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
      <Tooltip.Content
        style={panelStyle}
        textStyle={textStyle}
        withArrow={showArrow}
      >
        {panelChildren}
      </Tooltip.Content>
    </Tooltip>
  );
}

function ControlledTooltip({
  defaultOpen,
  open,
  ...args
}: ComponentProps<typeof Tooltip>) {
  const [isOpen, setIsOpen] = useState(open ?? defaultOpen ?? false);

  useEffect(() => {
    setIsOpen(open ?? defaultOpen ?? false);
  }, [open, defaultOpen]);

  return (
    <Tooltip
      {...args}
      open={isOpen}
      onOpenChange={(nextOpen) => {
        setIsOpen(nextOpen);
        args.onOpenChange?.(nextOpen);
      }}
    >
      <Tooltip.Trigger>
        <Trigger label={isOpen ? 'Tooltip open' : 'Tooltip closed'} />
      </Tooltip.Trigger>
      <Tooltip.Content withArrow>Controlled native tooltip</Tooltip.Content>
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
- Top, bottom, left, right, and aligned placement variants
- Configurable open and close delays
- Optional arrow and force-mounted content
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

  <Tooltip.Content withArrow>Additional information</Tooltip.Content>
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
    delay: {
      description: 'Open delay in milliseconds, or open/close delay object.',
      control: 'number',
      table: {
        type: { summary: 'number | { open?: number; close?: number }' },
      },
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
    <View style={sectionStyle}>
      <TooltipPreview {...args} panelChildren='Helpful native tooltip content'>
        <Trigger />
      </TooltipPreview>
    </View>
  ),
};

export const Controlled: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <View style={sectionStyle}>
      <ControlledTooltip {...args} />
    </View>
  ),
};

export const Placement: Story = {
  render: () => (
    <View style={[sectionStyle, matrixStyle]}>
      {placements.map((placement) => (
        <TooltipPreview
          key={placement}
          placement={placement}
          delay={0}
          panelChildren={`${placement} tooltip`}
        >
          <Trigger label={placement} />
        </TooltipPreview>
      ))}
    </View>
  ),
};

export const LongContent: Story = {
  render: (args) => (
    <View style={sectionStyle}>
      <TooltipPreview
        {...args}
        panelChildren='Use this tooltip for short contextual help. Keep content concise on small screens.'
        panelStyle={{ maxWidth: 280 }}
      >
        <Trigger label='Long tooltip' />
      </TooltipPreview>
    </View>
  ),
};

export const CustomContent: Story = {
  render: (args) => (
    <View style={sectionStyle}>
      <TooltipPreview {...args} panelChildren={<CustomTooltipContent />}>
        <Trigger label='Custom content' />
      </TooltipPreview>
    </View>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <View style={sectionStyle}>
      <TooltipPreview {...args} panelChildren='Disabled tooltip'>
        <Trigger label='Disabled tooltip' />
      </TooltipPreview>
    </View>
  ),
};

export const CustomDelay: Story = {
  args: {
    delay: 500,
  },
  render: (args) => (
    <View style={sectionStyle}>
      <TooltipPreview {...args} panelChildren='Appears after 500ms'>
        <Trigger label='Slow tooltip' />
      </TooltipPreview>
    </View>
  ),
};

export const NoDelay: Story = {
  args: {
    delay: 0,
  },
  render: (args) => (
    <View style={sectionStyle}>
      <TooltipPreview {...args} panelChildren='Appears immediately'>
        <Trigger label='Instant tooltip' />
      </TooltipPreview>
    </View>
  ),
};

export const WithoutArrow: Story = {
  render: (args) => (
    <View style={sectionStyle}>
      <TooltipPreview
        {...args}
        panelChildren='Tooltip without arrow'
        showArrow={false}
      >
        <Trigger label='No arrow' />
      </TooltipPreview>
    </View>
  ),
};

export const AutoHide: Story = {
  render: (args) => (
    <View style={sectionStyle}>
      <TooltipPreview
        {...args}
        panelChildren='This tooltip will disappear automatically.'
      >
        <Trigger label='Auto hide' />
      </TooltipPreview>
    </View>
  ),
};

export const ForceMount: Story = {
  args: {
    open: false,
  },
  render: (args) => (
    <View style={sectionStyle}>
      <Tooltip {...args}>
        <Tooltip.Trigger>
          <Trigger label='Force mounted' />
        </Tooltip.Trigger>
        <Tooltip.Content forceMount withArrow>
          Mounted with closed state
        </Tooltip.Content>
      </Tooltip>
    </View>
  ),
};
