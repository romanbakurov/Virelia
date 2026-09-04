import { forwardRef, useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChevronDown,
  Copy,
  Download,
  Edit,
  Exit,
  File,
  Folder,
  Menu,
  MoreHorizontal,
  MoreVertical,
  Refresh,
  Save,
  Settings,
  Trash,
  Upload,
  User,
  Users,
} from '@vellira-ui/icons';
import type {
  ComponentProps,
  ComponentRef,
  CSSProperties,
  ReactNode,
} from 'react';

import { Dropdown } from './Dropdown';

import { Button } from '#primitives/Button';
import { Portal } from '#primitives/Portal';

const noop = () => undefined;

type MoreActionsIconButtonProps = Omit<
  ComponentProps<typeof Button>,
  'aria-label' | 'appearance' | 'children' | 'iconOnly' | 'iconStart'
> & {
  isOpen?: boolean;
};

const MoreActionsIconButton = forwardRef<
  ComponentRef<typeof Button>,
  MoreActionsIconButtonProps
>(function MoreActionsIconButton(
  {
    color,
    isOpen = false,
    size,
    onBlur,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseUp,
    ...props
  },
  ref
) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const isActive = isOpen || isHovered || isPressed;
  const baseIconStyle = {
    position: 'absolute',
    inset: 0,
    display: 'inline-flex',
    transformOrigin: 'center',
    transition:
      'opacity 160ms ease, transform 200ms cubic-bezier(0.22, 1, 0.36, 1)',
    willChange: 'opacity, transform',
  } satisfies CSSProperties;
  const icon = (
    <span
      aria-hidden='true'
      style={{
        display: 'inline-flex',
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <span
        style={{
          ...baseIconStyle,
          opacity: isActive ? 0 : 1,
          transform: isActive
            ? 'rotate(90deg) scale(0.92)'
            : 'rotate(0deg) scale(1)',
        }}
      >
        <MoreHorizontal size='100%' />
      </span>
      <span
        style={{
          ...baseIconStyle,
          opacity: isActive ? 1 : 0,
          transform: isActive
            ? 'rotate(0deg) scale(1)'
            : 'rotate(-90deg) scale(0.92)',
        }}
      >
        <MoreVertical size='100%' />
      </span>
    </span>
  );

  return (
    <Button
      {...props}
      ref={ref}
      aria-label='More actions'
      appearance='ghost'
      color={color ?? 'primary'}
      iconOnly
      iconStart={icon}
      size={size}
      onBlur={(event) => {
        setIsHovered(false);
        setIsPressed(false);
        onBlur?.(event);
      }}
      onMouseDown={(event) => {
        setIsPressed(true);
        onMouseDown?.(event);
      }}
      onMouseEnter={(event) => {
        setIsHovered(true);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setIsHovered(false);
        setIsPressed(false);
        onMouseLeave?.(event);
      }}
      onMouseUp={(event) => {
        setIsPressed(false);
        onMouseUp?.(event);
      }}
    />
  );
});

const actionItems = [
  {
    label: 'Edit',
    icon: <Edit />,
    shortcut: '⌘E',
  },
  {
    label: 'Duplicate',
    icon: <Copy />,
    shortcut: '⌘D',
  },
  {
    label: 'Move to folder',
    icon: <Folder />,
  },
];

const richActionItems = [
  {
    label: 'Profile settings',
    description: 'Account, billing, and security',
    icon: <Settings />,
    badge: 'Pro',
    shortcut: '⌘P',
  },
  {
    label: 'Workspace members',
    description: 'Manage roles and invitations',
    icon: <Users />,
    badge: '12',
    shortcut: '⌘M',
  },
  {
    label: 'Export report',
    description: 'Download the current workspace report',
    icon: <Download />,
    shortcut: '⌘⇧E',
  },
];

const groupedActions = {
  project: [
    { label: 'Rename', icon: <Edit />, shortcut: '⌘R' },
    { label: 'Duplicate', icon: <Copy />, shortcut: '⌘D' },
    { label: 'Move to folder', icon: <Folder /> },
  ],
  sharing: [
    { label: 'Invite members', icon: <Users /> },
    { label: 'Copy invite link', icon: <Copy /> },
  ],
  system: [
    { label: 'Refresh', icon: <Refresh />, shortcut: '⌘⇧R' },
    { label: 'Export', icon: <Download /> },
  ],
};

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Dropdown Component

Action menu for commands, toggles, radio choices, links, and submenus.

**Features**
- Compound API with Trigger, Content, Group, Label, Item, CheckboxItem,
  RadioGroup, RadioItem, Separator, Sub, SubTrigger, SubContent, Empty, and
  Loading parts
- Trigger composition through asChild, usually with Button
- Controlled and uncontrolled open state
- Searchable and command-style menus with controlled search value
- Sizes, semantic focus color, disabled state, placement, collision avoidance,
  custom width, trigger-width matching, modal scroll lock, and keyboard loop
- Item metadata through icon, description, badge, shortcut props or compound
  item slots
- Action selection with onSelect for pointer, keyboard, touch, and typeahead;
  preventDefault keeps the menu open
- Link items through href without a separate Link component
- Checkbox and radio menu items for action-menu settings
- Menu semantics with role="menu", role="menuitem", role="menuitemcheckbox",
  and role="menuitemradio"
- Public API is compound-first; items are declared with Dropdown.Item,
  Dropdown.CheckboxItem, Dropdown.RadioItem, and Dropdown.Sub instead of an
  items array
- Search can be declared with Dropdown.Search inside Content. Root searchable
  props are a shorthand, but command discovery belongs to the compound menu
  surface
- Use the shared Portal primitive for explicit portal composition; Arrow
  remains a Dropdown content part
- Dropdown.Content accepts className and style for content-level customization

### Usage

\`\`\`tsx
<Dropdown color='primary' size='md' placement='bottom-end'>
  <Dropdown.Trigger asChild>
    <Button appearance='outline' color='neutral' iconEnd={<ChevronDown />}>
      Actions
    </Button>
  </Dropdown.Trigger>

    <Dropdown.Content>
    <Dropdown.Search placeholder='Search actions' />
    <Dropdown.Item icon={<Edit />} shortcut='⌘E' onSelect={handleEdit}>
      Edit
    </Dropdown.Item>
    <Dropdown.Item icon={<Copy />} onSelect={handleDuplicate}>
      Duplicate
    </Dropdown.Item>
    <Dropdown.Separator />
    <Dropdown.Item color='danger' icon={<Trash />} onSelect={handleDelete}>
      Delete
    </Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
\`\`\`

\`\`\`tsx
<Dropdown closeOnSelect={false}>
  <Dropdown.Trigger asChild>
    <Button appearance='outline' color='neutral'>
      View options
    </Button>
  </Dropdown.Trigger>

  <Dropdown.Content>
    <Dropdown.CheckboxItem checked={showArchived} onCheckedChange={setShowArchived}>
      Show archived
    </Dropdown.CheckboxItem>
    <Dropdown.RadioGroup value={density} onValueChange={setDensity}>
      <Dropdown.RadioItem value='comfortable'>Comfortable</Dropdown.RadioItem>
      <Dropdown.RadioItem value='compact'>Compact</Dropdown.RadioItem>
    </Dropdown.RadioGroup>
  </Dropdown.Content>
</Dropdown>
\`\`\`
`,
      },
    },
  },
  args: {
    children: null,
    color: 'primary',
    size: 'md',
    placement: 'bottom-start',
    closeOnSelect: true,
    loop: true,
    portal: true,
    avoidCollisions: true,
    offset: 2,
    disabled: false,
    loading: false,
  },
  argTypes: {
    children: {
      description: 'Compound Dropdown parts.',
      control: false,
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    open: {
      description: 'Controlled open state.',
      control: false,
      table: {
        type: { summary: 'boolean' },
      },
    },
    defaultOpen: {
      description: 'Initial uncontrolled open state.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onOpenChange: {
      description: 'Called when the open state changes.',
      action: 'open changed',
      table: {
        type: { summary: '(open: boolean) => void' },
      },
    },
    size: {
      description: 'Menu item density and default trigger size.',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: `'sm' | 'md' | 'lg'` },
        defaultValue: { summary: 'md' },
      },
    },
    color: {
      description: 'Semantic color used for active and focus item states.',
      control: 'radio',
      options: ['primary', 'neutral', 'success', 'warning', 'danger'],
      table: {
        type: {
          summary: `'primary' | 'neutral' | 'success' | 'warning' | 'danger'`,
        },
        defaultValue: { summary: 'primary' },
      },
    },
    placement: {
      description: 'Preferred floating menu placement.',
      control: 'select',
      options: [
        'top-start',
        'top',
        'top-end',
        'right-start',
        'right',
        'right-end',
        'bottom-start',
        'bottom',
        'bottom-end',
        'left-start',
        'left',
        'left-end',
      ],
      table: {
        type: { summary: 'Placement' },
        defaultValue: { summary: 'bottom-start' },
      },
    },
    offset: {
      description: 'Gap in pixels between trigger and content.',
      control: 'number',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '2' },
      },
    },
    matchTriggerWidth: {
      description: 'Matches menu width to the trigger width.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    minWidth: {
      description: 'Minimum content width.',
      control: 'text',
      table: {
        type: { summary: 'number | string' },
      },
    },
    maxWidth: {
      description: 'Maximum content width.',
      control: 'text',
      table: {
        type: { summary: 'number | string' },
      },
    },
    portal: {
      description: 'Renders content in a portal.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    avoidCollisions: {
      description: 'Flips and shifts content to keep it in view.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    modal: {
      description: 'Locks page scroll while open.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    closeOnSelect: {
      description:
        'Default close behavior for action and radio items. Checkbox items default to staying open.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    loop: {
      description: 'Loops keyboard navigation at menu boundaries.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    disabled: {
      description: 'Disables the trigger and prevents opening.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      description: 'Blocks item selection and renders loading content.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loadingText: {
      description: 'Accessible loading message.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'Loading actions...' },
      },
    },
    searchable: {
      description: 'Adds a search field and filters menu items by label.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    command: {
      description:
        'Uses command-menu search copy while preserving menu semantics.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    searchValue: {
      description: 'Controlled search query.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    defaultSearchValue: {
      description: 'Initial uncontrolled search query.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    searchPlaceholder: {
      description: 'Placeholder and accessible label for the search field.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    onSearch: {
      description: 'Called when the search query changes.',
      action: 'searched',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
    empty: {
      description: 'Content shown when a searchable menu has no matches.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      description: 'Additional class name for the Dropdown root wrapper.',
      control: false,
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Dropdown>;

const subtitleStyle = {
  margin: 0,
  color: 'var(--text-secondary)',
  fontSize: 13,
  fontWeight: 600,
} satisfies CSSProperties;

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  minWidth: 0,
  maxWidth: 760,
  padding: 20,
  border: '1px solid var(--border-muted)',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--surface-subtle)',
} satisfies CSSProperties;

const gridStyle = {
  display: 'grid',
  gap: 16,
} satisfies CSSProperties;

const matrixStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, max-content))',
  gap: 12,
  alignItems: 'start',
} satisfies CSSProperties;

const placementExamples = [
  { label: 'bottomLeft', placement: 'bottom-start' },
  { label: 'bottom', placement: 'bottom' },
  { label: 'bottomRight', placement: 'bottom-end' },
  { label: 'topLeft', placement: 'top-start' },
  { label: 'top', placement: 'top' },
  { label: 'topRight', placement: 'top-end' },
  { label: 'leftTop', placement: 'left-start' },
  { label: 'left', placement: 'left' },
  { label: 'leftBottom', placement: 'left-end' },
  { label: 'rightTop', placement: 'right-start' },
  { label: 'right', placement: 'right' },
  { label: 'rightBottom', placement: 'right-end' },
] as const;

const triggerButtonPaddingBySize = {
  sm: 'var(--space-2) var(--space-3)',
  md: 'var(--space-3) var(--space-4)',
  lg: 'var(--space-4) var(--space-5)',
} satisfies Record<NonNullable<DropdownStoryProps['size']>, string>;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={sectionStyle}>
      <h3 style={subtitleStyle}>{title}</h3>
      {children}
    </section>
  );
}

export default meta;

type Story = StoryObj<typeof meta>;
type DropdownStoryProps = Omit<ComponentProps<typeof Dropdown>, 'children'> & {
  children?: ReactNode;
};
type StoryAction = {
  label: string;
  icon?: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  shortcut?: ReactNode;
  disabled?: boolean;
};

function renderActionItems(items: StoryAction[] = actionItems) {
  return (
    <>
      {items.map((item) => (
        <Dropdown.Item
          key={item.label}
          icon={item.icon}
          description={item.description}
          badge={item.badge}
          shortcut={item.shortcut}
          disabled={item.disabled}
          onSelect={noop}
        >
          {item.label}
        </Dropdown.Item>
      ))}
    </>
  );
}

function ActionDropdown({
  trigger = 'Actions',
  buttonIcon,
  children,
  ...args
}: DropdownStoryProps & {
  trigger?: ReactNode;
  buttonIcon?: ReactNode;
}) {
  return (
    <Dropdown {...args}>
      <Dropdown.Trigger asChild>
        <Button
          appearance='link'
          color={args.color ?? 'primary'}
          iconStart={buttonIcon}
          iconEnd={<ChevronDown />}
          size={args.size}
          style={{
            padding: triggerButtonPaddingBySize[args.size ?? 'md'],
          }}
        >
          {trigger}
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content>{children ?? renderActionItems()}</Dropdown.Content>
    </Dropdown>
  );
}

function DropdownWithOpenState({
  children,
  defaultOpen,
  open,
  ...args
}: DropdownStoryProps) {
  const [isOpen, setIsOpen] = useState(open ?? defaultOpen ?? false);

  useEffect(() => {
    setIsOpen(open ?? defaultOpen ?? false);
  }, [open, defaultOpen]);

  return (
    <ActionDropdown
      {...args}
      open={isOpen}
      onOpenChange={(nextOpen) => {
        setIsOpen(nextOpen);
        args.onOpenChange?.(nextOpen);
      }}
    >
      {children}
    </ActionDropdown>
  );
}

function CheckboxAndRadioMenu(args: DropdownStoryProps) {
  const [showArchived, setShowArchived] = useState(false);
  const [compactMode, setCompactMode] = useState(true);
  const [density, setDensity] = useState('comfortable');

  return (
    <ActionDropdown {...args} trigger='View options' closeOnSelect={false}>
      <Dropdown.Group>
        <Dropdown.Label>Visibility</Dropdown.Label>
        <Dropdown.CheckboxItem
          checked={showArchived}
          onCheckedChange={setShowArchived}
        >
          Show archived
        </Dropdown.CheckboxItem>
        <Dropdown.CheckboxItem
          checked={compactMode}
          onCheckedChange={setCompactMode}
        >
          Compact rows
        </Dropdown.CheckboxItem>
      </Dropdown.Group>

      <Dropdown.Separator />

      <Dropdown.Group>
        <Dropdown.Label>Density</Dropdown.Label>
        <Dropdown.RadioGroup value={density} onValueChange={setDensity}>
          <Dropdown.RadioItem value='comfortable'>
            Comfortable
          </Dropdown.RadioItem>
          <Dropdown.RadioItem value='compact'>Compact</Dropdown.RadioItem>
          <Dropdown.RadioItem value='dense'>Dense</Dropdown.RadioItem>
        </Dropdown.RadioGroup>
      </Dropdown.Group>
    </ActionDropdown>
  );
}

function ControlledOpenMenu(args: DropdownStoryProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={gridStyle}>
      <Button appearance='soft' color='neutral' onClick={() => setOpen(true)}>
        Open from outside
      </Button>

      <ActionDropdown
        {...args}
        trigger='Controlled menu'
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}

function IconOnlyDropdown(args: DropdownStoryProps) {
  const [open, setOpen] = useState(args.open ?? args.defaultOpen ?? false);

  return (
    <Dropdown
      {...args}
      minWidth={220}
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
      <Dropdown.Content>{renderActionItems()}</Dropdown.Content>
    </Dropdown>
  );
}

export const Default: Story = {
  render: (args) => (
    <Section title='Default'>
      <ActionDropdown {...args} minWidth={220} />
    </Section>
  ),
};

export const Uncontrolled: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Uncontrolled'>
      <ActionDropdown {...args} minWidth={220} />
    </Section>
  ),
};

export const IconOnly: Story = {
  render: (args) => (
    <Section title='Icon only'>
      <IconOnlyDropdown {...args} />
    </Section>
  ),
};

export const SimpleUsage: Story = {
  render: () => (
    <Section title='Simple usage'>
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button appearance='outline' color='neutral'>
            Actions
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect={noop}>Edit</Dropdown.Item>
          <Dropdown.Item onSelect={noop}>Duplicate</Dropdown.Item>
          <Dropdown.Item color='danger' onSelect={noop}>
            Delete
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </Section>
  ),
};

export const AdvancedUsage: Story = {
  render: () => (
    <Section title='Advanced usage'>
      <ActionDropdown trigger='Project actions' minWidth={280}>
        <Dropdown.Group>
          <Dropdown.Label>Project</Dropdown.Label>
          <Dropdown.Item icon={<Edit />} shortcut='⌘E'>
            Edit
          </Dropdown.Item>
          <Dropdown.Item icon={<Copy />} shortcut='⌘D'>
            Duplicate
          </Dropdown.Item>
        </Dropdown.Group>

        <Dropdown.Separator />

        <Dropdown.Sub>
          <Dropdown.SubTrigger icon={<Upload />}>Export</Dropdown.SubTrigger>
          <Dropdown.SubContent>
            <Dropdown.Item icon={<File />}>Export as PDF</Dropdown.Item>
            <Dropdown.Item icon={<Download />}>Download archive</Dropdown.Item>
          </Dropdown.SubContent>
        </Dropdown.Sub>

        <Dropdown.Separator />

        <Dropdown.Item color='danger' icon={<Trash />}>
          Delete
        </Dropdown.Item>
      </ActionDropdown>
    </Section>
  ),
};

export const AsChildTrigger: Story = {
  render: () => (
    <Section title='asChild trigger'>
      <Dropdown placement='bottom-start' minWidth={220}>
        <Dropdown.Trigger asChild>
          <Button appearance='soft' color='neutral' iconStart={<Menu />}>
            More actions
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Content>{renderActionItems()}</Dropdown.Content>
      </Dropdown>
    </Section>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section title='Sizes'>
      <div style={matrixStyle}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <ActionDropdown
            key={size}
            trigger={size}
            size={size}
            minWidth={200}
          />
        ))}
      </div>
    </Section>
  ),
};

export const Colors: Story = {
  render: () => (
    <Section title='Colors'>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, max-content))',
          gap: 12,
          alignItems: 'start',
        }}
      >
        {(['primary', 'neutral', 'success', 'warning', 'danger'] as const).map(
          (color) => (
            <ActionDropdown
              key={color}
              trigger={color}
              color={color}
              minWidth={200}
            />
          )
        )}
      </div>
    </Section>
  ),
};

export const Placements: Story = {
  render: () => (
    <Section title='Placements'>
      <div style={matrixStyle}>
        {placementExamples.map(({ label, placement }) => (
          <ActionDropdown
            key={label}
            trigger={label}
            placement={placement}
            minWidth={200}
          />
        ))}
      </div>
    </Section>
  ),
};

export const Width: Story = {
  render: () => (
    <Section title='Width'>
      <div style={gridStyle}>
        <ActionDropdown
          trigger='Match trigger width'
          matchTriggerWidth
          minWidth={260}
        />
        <ActionDropdown trigger='Fixed max width' minWidth={240} maxWidth={260}>
          {renderActionItems(richActionItems)}
        </ActionDropdown>
      </div>
    </Section>
  ),
};

export const Groups: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Groups'>
      <DropdownWithOpenState {...args} minWidth={260}>
        <Dropdown.Group>
          <Dropdown.Label>Project</Dropdown.Label>
          {renderActionItems(groupedActions.project)}
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Group>
          <Dropdown.Label>Sharing</Dropdown.Label>
          {renderActionItems(groupedActions.sharing)}
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Group>
          <Dropdown.Label>System</Dropdown.Label>
          {renderActionItems(groupedActions.system)}
        </Dropdown.Group>
      </DropdownWithOpenState>
    </Section>
  ),
};

export const RichItems: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Rich items'>
      <DropdownWithOpenState {...args} minWidth={320}>
        {renderActionItems(richActionItems)}
      </DropdownWithOpenState>
    </Section>
  ),
};

export const CompoundSlots: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Compound slots'>
      <DropdownWithOpenState {...args} minWidth={320}>
        <Dropdown.Item>
          <Dropdown.ItemIcon>
            <User />
          </Dropdown.ItemIcon>
          Roman Bakurov
          <Dropdown.ItemDescription>roman@example.com</Dropdown.ItemDescription>
          <Dropdown.ItemBadge>Owner</Dropdown.ItemBadge>
          <Dropdown.ItemShortcut>⌘1</Dropdown.ItemShortcut>
        </Dropdown.Item>
        <Dropdown.Item>
          <Dropdown.ItemIcon>
            <Settings />
          </Dropdown.ItemIcon>
          Workspace settings
          <Dropdown.ItemDescription>
            Members, billing, and access
          </Dropdown.ItemDescription>
        </Dropdown.Item>
      </DropdownWithOpenState>
    </Section>
  ),
};

export const CheckboxAndRadio: Story = {
  render: (args) => (
    <Section title='Checkbox and radio'>
      <CheckboxAndRadioMenu {...args} minWidth={260} />
    </Section>
  ),
};

export const Submenus: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Submenus'>
      <DropdownWithOpenState {...args} minWidth={240}>
        <Dropdown.Item icon={<Copy />}>Copy link</Dropdown.Item>

        <Dropdown.Sub>
          <Dropdown.SubTrigger icon={<Upload />}>Export</Dropdown.SubTrigger>
          <Dropdown.SubContent>
            <Dropdown.Item icon={<File />}>Export as PDF</Dropdown.Item>
            <Dropdown.Item icon={<Download />}>Download archive</Dropdown.Item>
          </Dropdown.SubContent>
        </Dropdown.Sub>

        <Dropdown.Sub>
          <Dropdown.SubTrigger icon={<Users />}>Share with</Dropdown.SubTrigger>
          <Dropdown.SubContent>
            <Dropdown.Item>Workspace</Dropdown.Item>
            <Dropdown.Item>Public link</Dropdown.Item>
          </Dropdown.SubContent>
        </Dropdown.Sub>
      </DropdownWithOpenState>
    </Section>
  ),
};

export const Links: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Links'>
      <DropdownWithOpenState {...args} minWidth={220}>
        <Dropdown.Item href='/settings' icon={<Settings />}>
          Settings
        </Dropdown.Item>
        <Dropdown.Item
          href='https://example.com'
          target='_blank'
          icon={<File />}
        >
          External link
        </Dropdown.Item>
        <Dropdown.Item href='/disabled' disabled>
          Disabled link
        </Dropdown.Item>
      </DropdownWithOpenState>
    </Section>
  ),
};

export const DisabledItems: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Disabled items'>
      <DropdownWithOpenState {...args} minWidth={240}>
        {renderActionItems([
          ...actionItems,
          { label: 'Archived action', icon: <Exit />, disabled: true },
        ])}
        <Dropdown.Separator />
        <Dropdown.Item color='danger' icon={<Trash />} disabled>
          Delete disabled
        </Dropdown.Item>
      </DropdownWithOpenState>
    </Section>
  ),
};

export const PreventCloseOnSelect: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Prevent close on select'>
      <DropdownWithOpenState {...args} minWidth={300}>
        <Dropdown.Item
          icon={<Refresh />}
          description='Runs the action and keeps the menu open'
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          Refresh preview
        </Dropdown.Item>
        <Dropdown.Item icon={<Save />}>Save and close</Dropdown.Item>
      </DropdownWithOpenState>
    </Section>
  ),
};

export const Loading: Story = {
  args: {
    defaultOpen: true,
    loading: true,
    loadingText: 'Loading actions...',
  },
  render: (args) => (
    <Section title='Loading'>
      <DropdownWithOpenState {...args} minWidth={220} />
    </Section>
  ),
};

export const Searchable: Story = {
  args: {
    defaultOpen: true,
    empty: 'No matching actions',
  },
  render: (args) => (
    <Section title='Searchable'>
      <DropdownWithOpenState {...args} minWidth={280}>
        <Dropdown.Search placeholder='Search actions' />
        {renderActionItems([
          ...groupedActions.project,
          ...groupedActions.sharing,
          ...groupedActions.system,
        ])}
      </DropdownWithOpenState>
    </Section>
  ),
};

export const Command: Story = {
  args: {
    defaultOpen: true,
    empty: 'No command found',
  },
  render: (args) => (
    <Section title='Command'>
      <Dropdown {...args} minWidth={300}>
        <Dropdown.Trigger asChild>
          <Button
            appearance='outline'
            color='neutral'
            iconEnd={<ChevronDown />}
          >
            Command menu
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Content command>
          <Dropdown.Search />
          <Dropdown.Item icon={<Edit />} shortcut='⌘R'>
            Rename project
          </Dropdown.Item>
          <Dropdown.Item icon={<Users />} shortcut='⌘I'>
            Invite members
          </Dropdown.Item>
          <Dropdown.Item icon={<Download />} shortcut='⌘E'>
            Export report
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item color='danger' icon={<Trash />}>
            Delete project
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </Section>
  ),
};

export const ExplicitPortal: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Explicit portal'>
      <Dropdown {...args} minWidth={260}>
        <Dropdown.Trigger asChild>
          <Button
            appearance='outline'
            color='neutral'
            iconEnd={<ChevronDown />}
          >
            Portal menu
          </Button>
        </Dropdown.Trigger>
        <Portal>
          <Dropdown.Content>
            <Dropdown.Search placeholder='Find command' />
            <Dropdown.Item>
              <Dropdown.ItemIcon>
                <Copy />
              </Dropdown.ItemIcon>
              Copy link
              <Dropdown.ItemDescription>
                Copy current selection
              </Dropdown.ItemDescription>
              <Dropdown.ItemBadge>New</Dropdown.ItemBadge>
              <Dropdown.ItemShortcut>⌘C</Dropdown.ItemShortcut>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon>
                <Download />
              </Dropdown.ItemIcon>
              Export report
              <Dropdown.ItemShortcut>⌘E</Dropdown.ItemShortcut>
            </Dropdown.Item>
          </Dropdown.Content>
        </Portal>
      </Dropdown>
    </Section>
  ),
};

export const Empty: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Empty'>
      <DropdownWithOpenState {...args} minWidth={220}>
        <Dropdown.Empty>No actions available</Dropdown.Empty>
      </DropdownWithOpenState>
    </Section>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <Section title='Disabled'>
      <ActionDropdown {...args} minWidth={220} />
    </Section>
  ),
};

export const KeyboardNavigation: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Keyboard navigation'>
      <DropdownWithOpenState {...args} minWidth={260}>
        <Dropdown.Item icon={<Edit />}>Edit</Dropdown.Item>
        <Dropdown.Item icon={<Copy />}>Duplicate</Dropdown.Item>
        <Dropdown.Item icon={<Folder />} disabled>
          Move disabled
        </Dropdown.Item>
        <Dropdown.Item icon={<Refresh />}>Refresh</Dropdown.Item>
      </DropdownWithOpenState>
    </Section>
  ),
};

export const ControlledOpen: Story = {
  render: (args) => (
    <Section title='Controlled open'>
      <ControlledOpenMenu {...args} minWidth={220} />
    </Section>
  ),
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Mobile'>
      <DropdownWithOpenState {...args} minWidth={240}>
        {renderActionItems(richActionItems)}
      </DropdownWithOpenState>
    </Section>
  ),
};
