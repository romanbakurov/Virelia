import { useEffect, useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-native';
import {
  Copy,
  Edit,
  MoreHorizontal,
  MoreVertical,
  Refresh,
  Settings,
  Trash,
} from '@vellira-ui/icons';
import type { ComponentProps, ReactNode } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fn } from 'storybook/test';

import { Button } from '../../primitives/Button';
import { Portal } from '../../primitives/Portal';
import { useTheme } from '../../theme';

import { Dropdown } from './Dropdown';

function renderActionContent(onSelect?: (value: string) => void) {
  return (
    <Dropdown.Content>
      <Dropdown.Label>Actions</Dropdown.Label>
      <Dropdown.Item
        value='edit'
        icon={<Edit />}
        onSelect={() => onSelect?.('edit')}
      >
        Edit profile
      </Dropdown.Item>
      <Dropdown.Item
        value='duplicate'
        icon={<Copy />}
        onSelect={() => onSelect?.('duplicate')}
      >
        Duplicate
      </Dropdown.Item>
      <Dropdown.Item
        value='refresh'
        icon={<Refresh />}
        onSelect={() => onSelect?.('refresh')}
      >
        Refresh
      </Dropdown.Item>
      <Dropdown.Separator />
      <Dropdown.Item
        value='delete'
        icon={<Trash />}
        danger
        onSelect={() => onSelect?.('delete')}
      >
        Delete account
      </Dropdown.Item>
    </Dropdown.Content>
  );
}

type MoreActionsIconButtonProps = Omit<
  ComponentProps<typeof Button>,
  'accessibilityLabel' | 'appearance' | 'children' | 'iconOnly' | 'iconStart'
> & {
  isOpen?: boolean;
};

function RotatingMoreIcon({
  active,
  color,
  size,
}: {
  active: boolean;
  color?: string;
  size?: number;
}) {
  const rotation = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: active ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [active, rotation]);

  const resolvedSize = size ?? 20;

  return (
    <View
      style={{
        width: resolvedSize,
        height: resolvedSize,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          opacity: rotation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
          transform: [
            {
              rotate: rotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '90deg'],
              }),
            },
            {
              scale: rotation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.92],
              }),
            },
          ],
        }}
      >
        <MoreHorizontal color={color} size={resolvedSize} />
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          opacity: rotation,
          transform: [
            {
              rotate: rotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['-90deg', '0deg'],
              }),
            },
            {
              scale: rotation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.92, 1],
              }),
            },
          ],
        }}
      >
        <MoreVertical color={color} size={resolvedSize} />
      </Animated.View>
    </View>
  );
}

function MoreActionsIconButton({
  color,
  isOpen = false,
  size,
  onBlur,
  onHoverIn,
  onHoverOut,
  onPressIn,
  onPressOut,
  ...props
}: MoreActionsIconButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const isActive = isOpen || isHovered || isPressed;

  return (
    <Button
      {...props}
      accessibilityLabel='More actions'
      appearance='ghost'
      color={color ?? 'primary'}
      iconOnly
      iconStart={<RotatingMoreIcon active={isActive} />}
      size={size}
      onBlur={(event) => {
        setIsHovered(false);
        setIsPressed(false);
        onBlur?.(event);
      }}
      onHoverIn={(event) => {
        setIsHovered(true);
        onHoverIn?.(event);
      }}
      onHoverOut={(event) => {
        setIsHovered(false);
        onHoverOut?.(event);
      }}
      onPressIn={(event) => {
        setIsPressed(true);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setIsPressed(false);
        onPressOut?.(event);
      }}
    />
  );
}

function CustomTriggerContent() {
  const { theme } = useTheme();
  const color = theme.components.dropdown.primary.trigger.default.fg;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <Settings size={16} color={color} />
      <Text
        style={{
          color,
          fontFamily: theme.tokens.typography.family.regular,
          fontSize: theme.tokens.typography.size.md,
        }}
      >
        Account actions
      </Text>
    </View>
  );
}

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Dropdown Component

Contextual action menu for React Native applications. Dropdown is for commands
and secondary actions, not for selecting a saved form value.

**Features**

- Controlled and uncontrolled open state
- Text, icon and custom triggers
- Groups and separators
- Searchable and command-style action lists
- Disabled and danger action items
- Long text support
- Compound Trigger, Content and Item API matching web usage
- Content presentation: auto, sheet, modal or popover
- Accessibility label, hint and expanded state support

### Usage

Use Dropdown when secondary actions should be hidden until requested by the user.
Use Select when the user is choosing a form value from a compact list. Use
RadioGroup when a small set of choices should stay visible for comparison.

\`\`\`tsx
<Dropdown>
  <Dropdown.Trigger>
    <Button>Actions</Button>
  </Dropdown.Trigger>

  <Dropdown.Content presentation='auto'>
    <Dropdown.Label>Project</Dropdown.Label>
    <Dropdown.Item value='edit' onSelect={handleEdit}>
      Edit
    </Dropdown.Item>
    <Dropdown.Separator />
    <Dropdown.Item value='delete' danger onSelect={handleDelete}>
      Delete
    </Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
\`\`\`
`,
      },
    },
  },
  args: {
    label: 'Actions',
    showArrow: true,
    disabled: false,
    presentation: 'auto',
    color: 'primary',
    searchable: false,
    command: false,
    onOpenChange: fn(),
  },
  argTypes: {
    label: {
      control: 'text',
      description:
        'Trigger label. Use accessibilityLabel when the rendered label is not plain text.',
    },

    accessibilityLabel: {
      control: 'text',
      description:
        'Accessible trigger label used when label is not plain text or the trigger is icon-only.',
    },

    accessibilityHint: {
      control: 'text',
      description: 'Additional screen reader hint for the trigger.',
    },

    trigger: {
      control: false,
      description: 'Custom trigger content.',
    },

    open: {
      control: 'boolean',
      description: 'Controlled open state.',
    },

    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state for uncontrolled usage.',
    },

    presentation: {
      control: 'radio',
      options: ['auto', 'sheet', 'modal', 'popover'],
      description:
        'Native content presentation. Auto uses sheet on phones and popover on wider screens.',
    },

    color: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger'],
      description:
        'Semantic color used for trigger and menu interaction states.',
    },

    disabled: {
      control: 'boolean',
      description: 'Disables user interaction.',
    },

    showArrow: {
      control: 'boolean',
      description: 'Controls arrow visibility.',
    },

    searchable: {
      control: 'boolean',
      description: 'Adds a search field and filters action items by label.',
    },

    command: {
      control: 'boolean',
      description:
        'Uses command-menu search copy while preserving menu behavior.',
    },

    searchValue: {
      control: 'text',
      description: 'Controlled search query.',
    },

    defaultSearchValue: {
      control: 'text',
      description: 'Initial uncontrolled search query.',
    },

    searchPlaceholder: {
      control: 'text',
      description: 'Placeholder and accessible label for the search field.',
    },

    onSearch: {
      action: 'searched',
      description: 'Called when the search query changes.',
    },

    empty: {
      control: 'text',
      description: 'Content shown when a searchable menu has no matches.',
    },

    noOptionsText: {
      control: 'text',
      description: 'Fallback empty text for searchable menus.',
    },

    onOpenChange: {
      action: 'open changed',
      description: 'Called when the dropdown requests an open state change.',
    },

    icon: {
      control: false,
      description: 'Icon displayed inside the trigger.',
    },

    arrowIcon: {
      control: false,
      description: 'Custom arrow icon.',
    },

    style: {
      control: false,
    },

    triggerStyle: {
      control: false,
    },

    contentStyle: {
      control: false,
    },

    itemStyle: {
      control: false,
    },

    textStyle: {
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Dropdown>;
type DropdownStoryProps = ComponentProps<typeof Dropdown>;

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

    status: {
      color: theme.semantic.text.secondary,
      fontSize: 13,
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.subtitle}>{title}</Text>
      {children}
    </View>
  );
}

function InteractiveDropdown(args: DropdownStoryProps) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(args.open ?? args.defaultOpen ?? false);
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    setOpen(args.open ?? args.defaultOpen ?? false);
  }, [args.open, args.defaultOpen]);

  return (
    <View style={storyStyles.column}>
      <Dropdown
        {...args}
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          args.onOpenChange?.(nextOpen);
        }}
      >
        {renderActionContent((value) => {
          setSelected(value);
        })}
      </Dropdown>
      <Text
        style={{
          color: theme.semantic.text.secondary,
          fontSize: 13,
        }}
      >
        Selected action: {selected ?? 'none'}
      </Text>
    </View>
  );
}

export const Playground: Story = {
  render: (args) => (
    <Section title='Playground'>
      <InteractiveDropdown {...args} />
    </Section>
  ),
};

export const Default: Story = {
  render: (args) => (
    <Section title='Default'>
      <Dropdown {...args}>{renderActionContent()}</Dropdown>
    </Section>
  ),
};

export const CompoundApi: Story = {
  render: (args) => (
    <Section title='Compound API'>
      <Dropdown
        presentation={args.presentation}
        defaultOpen={args.defaultOpen}
        disabled={args.disabled}
      >
        <Dropdown.Trigger>
          <Button>Actions</Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Label>Project</Dropdown.Label>
          <Dropdown.Item value='edit' icon={<Edit />}>
            Edit
          </Dropdown.Item>
          <Dropdown.Item value='duplicate' icon={<Copy />}>
            Duplicate
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item value='delete' icon={<Trash />} danger>
            Delete
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </Section>
  ),
};

export const ExplicitPortal: Story = {
  render: (args) => (
    <Section title='Explicit Portal'>
      <Dropdown
        presentation={args.presentation}
        defaultOpen
        disabled={args.disabled}
      >
        <Dropdown.Trigger>
          <Button>Actions</Button>
        </Dropdown.Trigger>
        <Portal>
          <Dropdown.Content>
            <Dropdown.Label>Project</Dropdown.Label>
            <Dropdown.Item value='archive'>Move to archive</Dropdown.Item>
            <Dropdown.Item value='copy' icon={<Copy />}>
              Copy link
            </Dropdown.Item>
          </Dropdown.Content>
        </Portal>
      </Dropdown>
    </Section>
  ),
};

export const Controlled: Story = {
  args: {
    open: false,
  },
  render: (args) => (
    <Section title='Controlled'>
      <InteractiveDropdown {...args} />
    </Section>
  ),
};

export const Uncontrolled: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Uncontrolled'>
      <Dropdown {...args}>{renderActionContent()}</Dropdown>
    </Section>
  ),
};

function IconOnlyDropdown(args: DropdownStoryProps) {
  const [open, setOpen] = useState(args.open ?? args.defaultOpen ?? false);

  return (
    <Dropdown
      {...args}
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        args.onOpenChange?.(nextOpen);
      }}
    >
      <Dropdown.Trigger asChild>
        <MoreActionsIconButton
          color={args.color}
          isOpen={open}
          size={args.size}
        />
      </Dropdown.Trigger>
      {renderActionContent()}
    </Dropdown>
  );
}

export const IconOnly: Story = {
  args: {
    label: 'More actions',
    accessibilityLabel: 'More actions',
    accessibilityHint: 'Opens account action menu',
    showArrow: false,
  },
  render: (args) => (
    <Section title='Icon only'>
      <IconOnlyDropdown {...args} />
    </Section>
  ),
};

export const CustomTrigger: Story = {
  args: {
    label: 'Account actions',
    trigger: <CustomTriggerContent />,
    showArrow: true,
  },
  render: (args) => (
    <Section title='CustomTrigger'>
      <Dropdown {...args}>{renderActionContent()}</Dropdown>
    </Section>
  ),
};

export const WithGroups: Story = {
  args: {
    label: 'Document actions',
  },
  render: (args) => (
    <Section title='WithGroups'>
      <Dropdown {...args}>
        <Dropdown.Content>
          <Dropdown.Label>File</Dropdown.Label>
          <Dropdown.Item value='edit' icon={<Edit />}>
            Edit
          </Dropdown.Item>
          <Dropdown.Item value='duplicate' icon={<Copy />}>
            Duplicate
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Label>Danger</Dropdown.Label>
          <Dropdown.Item value='delete' icon={<Trash />} danger>
            Delete
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </Section>
  ),
};

export const WithDisabledItems: Story = {
  args: {
    label: 'Project actions',
  },
  render: (args) => (
    <Section title='WithDisabledItems'>
      <Dropdown {...args}>
        <Dropdown.Content>
          <Dropdown.Item value='edit' icon={<Edit />}>
            Edit
          </Dropdown.Item>
          <Dropdown.Item value='refresh' icon={<Refresh />} disabled>
            Refresh
          </Dropdown.Item>
          <Dropdown.Item value='delete' icon={<Trash />} danger>
            Delete
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </Section>
  ),
};

export const DangerActions: Story = {
  args: {
    label: 'Danger actions',
  },
  render: (args) => (
    <Section title='DangerActions'>
      <Dropdown {...args}>
        <Dropdown.Content>
          <Dropdown.Item value='archive'>Archive project</Dropdown.Item>
          <Dropdown.Item value='delete-draft' danger>
            Delete draft
          </Dropdown.Item>
          <Dropdown.Item value='delete-project' danger>
            Delete project
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </Section>
  ),
};

export const LongLabels: Story = {
  args: {
    label: 'Long labels',
  },
  render: (args) => (
    <Section title='LongLabels'>
      <Dropdown {...args}>
        <Dropdown.Content>
          <Dropdown.Item value='rename-long' textWrap='wrap'>
            Rename this project using the full generated workspace title
          </Dropdown.Item>
          <Dropdown.Item value='archive-long' textWrap='wrap'>
            Archive completed tasks and notify every collaborator
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </Section>
  ),
};

export const Searchable: Story = {
  args: {
    label: 'Search actions',
    defaultOpen: true,
    empty: 'No matching actions',
  },
  render: (args) => (
    <Section title='Searchable'>
      <Dropdown {...args}>
        <Dropdown.Content presentation='modal'>
          <Dropdown.Search placeholder='Search actions' />
          <Dropdown.Item value='edit' icon={<Edit />}>
            Edit profile
          </Dropdown.Item>
          <Dropdown.Item value='duplicate' icon={<Copy />}>
            Duplicate workspace
          </Dropdown.Item>
          <Dropdown.Item value='refresh' icon={<Refresh />}>
            Refresh report
          </Dropdown.Item>
          <Dropdown.Item value='delete' icon={<Trash />} danger>
            Delete workspace
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </Section>
  ),
};

export const Command: Story = {
  args: {
    label: 'Command menu',
    defaultOpen: true,
    empty: 'No command found',
  },
  render: (args) => (
    <Section title='Command'>
      <Dropdown {...args}>
        <Dropdown.Content presentation='popover' command>
          <Dropdown.Search />
          <Dropdown.Item value='settings' icon={<Settings />}>
            Open settings
          </Dropdown.Item>
          <Dropdown.Item value='duplicate' icon={<Copy />}>
            Duplicate workspace
          </Dropdown.Item>
          <Dropdown.Item value='refresh' icon={<Refresh />}>
            Refresh report
          </Dropdown.Item>
          <Dropdown.Item value='delete' icon={<Trash />} danger>
            Delete workspace
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </Section>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Disabled actions',
    disabled: true,
  },
  render: (args) => (
    <Section title='Disabled'>
      <Dropdown {...args}>{renderActionContent()}</Dropdown>
    </Section>
  ),
};
