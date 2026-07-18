import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Check, Search } from '@vellira-ui/icons';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
const noop = () => undefined;

import { FormField } from '../../patterns/FormField';

import { Select } from './Select';

const defaultOptions = [
  { label: 'France', value: 'fr' },
  { label: 'Spain', value: 'es' },
  { label: 'Germany', value: 'de' },
];

const optionsWithDisabled = [
  { label: 'France', value: 'fr' },
  { label: 'Spain', value: 'es', disabled: true },
  { label: 'Germany', value: 'de' },
];

const longOptions = [
  {
    label: 'France - European workspace with a deliberately long label',
    value: 'fr',
  },
  { label: 'Spain - Customer success and regional operations', value: 'es' },
  { label: 'Germany - Engineering platform team', value: 'de' },
];

const virtualOptions = Array.from({ length: 500 }, (_, index) => ({
  label: `Workspace ${index + 1}`,
  value: `workspace-${index + 1}`,
}));

const richOptions = [
  {
    label: 'France',
    value: 'fr',
    description: 'Paris workspace',
    icon: '🇫🇷',
    badge: 'EU',
    shortcut: '⌘1',
  },
  {
    label: 'Germany',
    value: 'de',
    description: 'Berlin operations',
    icon: '🇩🇪',
    badge: 'NEW',
    shortcut: '⌘2',
  },
  {
    label: 'Spain',
    value: 'es',
    description: 'Madrid support',
    icon: '🇪🇸',
    color: 'success' as const,
  },
];

const asyncOptions = [
  { label: 'France', value: 'fr' },
  { label: 'Germany', value: 'de' },
  { label: 'Spain', value: 'es' },
  { label: 'Portugal', value: 'pt' },
  { label: 'Poland', value: 'pl' },
  { label: 'Netherlands', value: 'nl' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Select Component

Single-value select control for choosing from a predefined list.

**Features**
- Label, description, and ReactNode error support
- Controlled and uncontrolled value support
- Controlled and uncontrolled open state
- Native form submission through hidden input
- Sizes, disabled state, required state, and disabled options
- Keyboard navigation, Escape close behavior, and selected option indicator
- Floating dropdown placement with trigger-width matching

### Usage

\`\`\`tsx
<Select
  label='Country'
  description='Choose your country of residence.'
  value={country}
  onValueChange={setCountry}
  placeholder='Select country...'
>
  <Select.Trigger />
  <Select.Content>
    <Select.Item value='fr'>France</Select.Item>
    <Select.Item value='de'>Germany</Select.Item>
  </Select.Content>
</Select>
\`\`\`
`,
      },
    },
  },
  args: {
    label: 'Country',
    placeholder: 'Select country...',
    size: 'md',
    color: 'primary',
    variant: 'outline',
    placement: 'bottom',
    matchTriggerWidth: true,
    disabled: false,
    required: false,
    onValueChange: noop,
    onOpenChange: noop,
  },
  argTypes: {
    id: {
      description:
        'Unique select id used to connect the label, error text, and trigger.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    label: {
      description: 'Content displayed as the Select label.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    description: {
      description: 'Supporting content displayed below the label.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    name: {
      description: 'Hidden input name used for native HTML form submission.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    'aria-label': {
      description:
        'Accessible trigger label used when a visible label is not provided.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    placeholder: {
      description: 'Placeholder text shown when no value is selected.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    noOptionsText: {
      description: 'Content shown inside the dropdown when options is empty.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'No options available' },
      },
    },
    value: {
      description: 'Current selected value for controlled usage.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    defaultValue: {
      description: 'Initial selected value for uncontrolled usage.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    size: {
      description: 'Visual size of the Select trigger.',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: `'sm' | 'md' | 'lg'` },
        defaultValue: { summary: 'md' },
      },
    },
    color: {
      description: 'Semantic color palette for the Select trigger.',
      control: 'radio',
      options: ['primary', 'neutral', 'success', 'warning', 'danger'],
      table: {
        type: {
          summary: `'primary' | 'neutral' | 'success' | 'warning' | 'danger'`,
        },
        defaultValue: { summary: 'primary' },
      },
    },
    variant: {
      description: 'Visual variant for the Select trigger.',
      control: 'radio',
      options: ['outline', 'filled', 'soft'],
      table: {
        type: { summary: `'outline' | 'filled' | 'soft'` },
        defaultValue: { summary: 'outline' },
      },
    },
    placement: {
      description: 'Preferred dropdown placement.',
      control: 'select',
      options: ['bottom', 'top', 'left', 'right'],
      table: {
        type: {
          summary: `'bottom' | 'top' | 'left' | 'right'`,
        },
        defaultValue: { summary: 'bottom' },
      },
    },
    matchTriggerWidth: {
      description: 'Matches dropdown width to the trigger width.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    open: {
      description: 'Controlled open state.',
      control: 'boolean',
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
    required: {
      description: 'Marks the select as required.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      description: 'Disables the select trigger and prevents interaction.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      description: 'Validation content displayed below the Select.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    clearable: {
      description: 'Shows a clear action when a value is selected.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    searchable: {
      description: 'Shows an option search field in the dropdown.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      description: 'Shows loading affordances in the trigger and dropdown.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    virtual: {
      description: 'Virtualizes long option lists.',
      control: 'object',
      table: {
        type: { summary: 'boolean | { itemHeight?: number }' },
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      description: 'Additional class name for the Select root field wrapper.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    triggerClassName: {
      description: 'Additional class name for the trigger element.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    dropdownClassName: {
      description: 'Additional class name for the dropdown element.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    onValueChange: {
      description: 'Called when the selected value changes.',
      action: 'changed',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
    onOpenChange: {
      description: 'Called when the open state changes.',
      action: 'open changed',
      table: {
        type: { summary: '(open: boolean) => void' },
      },
    },
    onFocus: {
      description: 'Called when the trigger receives focus.',
      action: 'focused',
      table: {
        type: { summary: 'FocusEventHandler<HTMLButtonElement>' },
      },
    },
    onBlur: {
      description: 'Called when the trigger loses focus.',
      action: 'blurred',
      table: {
        type: { summary: 'FocusEventHandler<HTMLButtonElement>' },
      },
    },
  },
} satisfies Meta<typeof Select>;

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

const customLabelStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
} satisfies CSSProperties;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={sectionStyle}>
      <h3 style={subtitleStyle}>{title}</h3>
      {children}
    </section>
  );
}

type SelectStoryProps = ComponentProps<typeof Select>;
type StoryOption = (typeof richOptions)[number];

function renderSelectItems(items: StoryOption[] = defaultOptions) {
  return (
    <>
      {items.map((option) => (
        <Select.Item
          key={option.value}
          value={option.value}
          label={option.label}
          disabled={'disabled' in option ? option.disabled : undefined}
          description={'description' in option ? option.description : undefined}
          icon={'icon' in option ? option.icon : undefined}
          badge={'badge' in option ? option.badge : undefined}
          shortcut={'shortcut' in option ? option.shortcut : undefined}
          color={'color' in option ? option.color : undefined}
        >
          {option.label}
        </Select.Item>
      ))}
    </>
  );
}

const SelectWithState = ({
  children,
  storyOptions = defaultOptions,
  ...args
}: SelectStoryProps & { storyOptions?: StoryOption[] }) => {
  const [value, setValue] = useState(args.value ?? args.defaultValue ?? '');

  useEffect(() => {
    setValue(args.value ?? args.defaultValue ?? '');
  }, [args.value, args.defaultValue]);

  return (
    <Select
      {...args}
      value={value}
      onValueChange={(newValue) => {
        setValue(newValue);
        args.onValueChange?.(newValue);
      }}
    >
      {children ?? renderSelectItems(storyOptions)}
    </Select>
  );
};

const SelectWithOpenState = ({
  children,
  storyOptions = defaultOptions,
  ...args
}: SelectStoryProps & { storyOptions?: StoryOption[] }) => {
  const [open, setOpen] = useState(args.open ?? args.defaultOpen ?? true);

  useEffect(() => {
    setOpen(args.open ?? args.defaultOpen ?? true);
  }, [args.open, args.defaultOpen]);

  return (
    <Select
      {...args}
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        args.onOpenChange?.(nextOpen);
      }}
    >
      {children ?? renderSelectItems(storyOptions)}
    </Select>
  );
};

const AsyncSearchSelect = (args: SelectStoryProps) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(asyncOptions);

  return (
    <Select
      {...args}
      value={value}
      searchable
      loading={loading}
      loadingText='Searching...'
      onValueChange={(newValue) => {
        setValue(newValue);
        args.onValueChange?.(newValue);
      }}
      onSearch={(query) => {
        setLoading(true);

        window.setTimeout(() => {
          const normalizedQuery = query.trim().toLocaleLowerCase();

          setItems(
            normalizedQuery
              ? asyncOptions.filter((option) =>
                  option.label.toLocaleLowerCase().includes(normalizedQuery)
                )
              : asyncOptions
          );
          setLoading(false);
        }, 450);
      }}
    >
      {renderSelectItems(items)}
    </Select>
  );
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Section title='Playground'>
      <SelectWithState {...args} />
    </Section>
  ),
};

export const Default: Story = {
  args: {
    defaultValue: '',
  },
  render: (args) => (
    <Section title='Default'>
      <Select {...args} />
    </Section>
  ),
};

export const Controlled: Story = {
  args: {
    value: 'fr',
  },
  render: (args) => (
    <Section title='Controlled'>
      <SelectWithState {...args} />
    </Section>
  ),
};

export const Uncontrolled: Story = {
  args: {
    defaultValue: 'fr',
  },
  render: (args) => (
    <Section title='Uncontrolled'>
      <Select {...args} />
    </Section>
  ),
};

export const WithDescription: Story = {
  args: {
    defaultValue: '',
    description: 'Choose your country of residence.',
  },
  render: (args) => (
    <Section title='With description'>
      <SelectWithState {...args} />
    </Section>
  ),
};

export const Required: Story = {
  args: {
    required: true,
    defaultValue: '',
  },
  render: (args) => (
    <Section title='Required'>
      <SelectWithState {...args} />
    </Section>
  ),
};

export const WithError: Story = {
  args: {
    id: 'country-error-example',
    required: true,
    value: '',
    error: 'Select a country to continue.',
  },
  render: (args) => (
    <Section title='With error'>
      <SelectWithState {...args} />
    </Section>
  ),
};

export const Disabled: Story = {
  args: {
    value: 'fr',
    disabled: true,
  },
  render: (args) => (
    <Section title='Disabled'>
      <SelectWithState {...args} />
    </Section>
  ),
};

export const DisabledOption: Story = {
  args: {
    value: '',
  },
  render: (args) => (
    <Section title='Disabled option'>
      <SelectWithState {...args} storyOptions={optionsWithDisabled} />
    </Section>
  ),
};

export const EmptyOptions: Story = {
  args: {
    defaultOpen: true,
    noOptionsText: 'No countries found',
  },
  render: (args) => (
    <Section title='Empty options'>
      <SelectWithOpenState {...args} storyOptions={[]} />
    </Section>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section title='Sizes'>
      <div style={gridStyle}>
        <Select label='Small' placeholder='Small select' size='sm'>
          {renderSelectItems()}
        </Select>
        <Select label='Medium' placeholder='Medium select' size='md'>
          {renderSelectItems()}
        </Select>
        <Select label='Large' placeholder='Large select' size='lg'>
          {renderSelectItems()}
        </Select>
      </div>
    </Section>
  ),
};

export const Colors: Story = {
  render: () => (
    <Section title='Colors'>
      <div style={gridStyle}>
        {(['primary', 'neutral', 'success', 'warning', 'danger'] as const).map(
          (color) => (
            <Select key={color} label={color} color={color} defaultValue='fr'>
              {renderSelectItems()}
            </Select>
          )
        )}
      </div>
    </Section>
  ),
};

export const Variants: Story = {
  render: () => (
    <Section title='Variants'>
      <div style={gridStyle}>
        {(['outline', 'filled', 'soft'] as const).map((variant) => (
          <Select
            key={variant}
            label={variant}
            variant={variant}
            defaultValue='fr'
          >
            {renderSelectItems()}
          </Select>
        ))}
      </div>
    </Section>
  ),
};

export const FormFieldIntegration: Story = {
  render: () => (
    <Section title='FormField integration'>
      <FormField
        id='shipping-country'
        label='Country'
        description='Shipping destination'
        required
      >
        <Select placeholder='Choose country'>{renderSelectItems()}</Select>
      </FormField>
    </Section>
  ),
};

export const Searchable: Story = {
  args: {
    searchable: true,
    startIcon: <Search />,
    placeholder: 'Search countries',
  },
  render: (args) => (
    <Section title='Searchable'>
      <SelectWithState {...args} storyOptions={richOptions} />
    </Section>
  ),
};

export const AsyncSearch: Story = {
  args: {
    placeholder: 'Search countries',
    startIcon: <Search />,
  },
  render: (args) => (
    <Section title='Async search'>
      <AsyncSearchSelect {...args} />
    </Section>
  ),
};

export const Clearable: Story = {
  args: {
    defaultValue: 'fr',
    clearable: true,
  },
  render: (args) => (
    <Section title='Clearable'>
      <SelectWithState {...args} storyOptions={richOptions} />
    </Section>
  ),
};

export const Loading: Story = {
  args: {
    defaultOpen: true,
    loading: true,
    loadingText: 'Searching...',
  },
  render: (args) => (
    <Section title='Loading'>
      <SelectWithOpenState {...args} />
    </Section>
  ),
};

export const RichOptions: Story = {
  args: {
    defaultOpen: true,
    renderValue: (option) =>
      option ? `${option.icon ?? ''} ${option.label}` : 'Choose country',
  },
  render: (args) => (
    <Section title='Rich options'>
      <SelectWithOpenState {...args} storyOptions={richOptions} />
    </Section>
  ),
};

export const Groups: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Groups'>
      <Select {...args}>
        <Select.Group label='Europe'>
          <Select.Item value='fr'>France</Select.Item>
          <Select.Item value='de'>Germany</Select.Item>
          <Select.Item value='es'>Spain</Select.Item>
        </Select.Group>
        <Select.Separator />
        <Select.Group label='Americas'>
          <Select.Item value='us'>United States</Select.Item>
          <Select.Item value='ca'>Canada</Select.Item>
        </Select.Group>
      </Select>
    </Section>
  ),
};

export const CustomRender: Story = {
  args: {
    defaultOpen: true,
    renderOption: (option) => (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          minWidth: 0,
        }}
      >
        <span>{option.icon}</span>
        <span style={{ flex: 1, minWidth: 0 }}>{option.label}</span>
        {option.value === 'fr' && <Check />}
      </span>
    ),
    renderValue: (option) =>
      option ? `${option.icon ?? ''} ${option.label}` : 'Choose country',
  },
  render: (args) => (
    <Section title='Custom render'>
      <SelectWithOpenState {...args} storyOptions={richOptions} />
    </Section>
  ),
};

export const Placements: Story = {
  render: () => (
    <Section title='Placements'>
      <div style={gridStyle}>
        <Select label='Bottom' defaultOpen placement='bottom'>
          {renderSelectItems()}
        </Select>
        <Select label='Top' defaultOpen placement='top'>
          {renderSelectItems()}
        </Select>
      </div>
    </Section>
  ),
};

export const ControlledOpen: Story = {
  args: {
    defaultOpen: true,
    defaultValue: 'fr',
  },
  render: (args) => (
    <Section title='Controlled open'>
      <SelectWithOpenState {...args} />
    </Section>
  ),
};

export const MatchTriggerWidthDisabled: Story = {
  args: {
    defaultOpen: true,
    matchTriggerWidth: false,
    placeholder: 'Select a team with a long label',
  },
  render: (args) => (
    <Section title='Dropdown natural width'>
      <SelectWithOpenState {...args} storyOptions={longOptions} />
    </Section>
  ),
};

export const VirtualizedList: Story = {
  args: {
    defaultOpen: true,
    virtual: { itemHeight: 40 },
    placeholder: 'Choose workspace',
  },
  render: (args) => (
    <Section title='Virtualized list'>
      <SelectWithOpenState {...args} storyOptions={virtualOptions} />
    </Section>
  ),
};

export const CustomContent: Story = {
  render: () => (
    <Section title='Custom content'>
      <Select
        label={
          <span style={customLabelStyle}>
            Country
            <span
              style={{
                padding: '2px 6px',
                color: 'var(--color-primary-50)',
                fontSize: 12,
                lineHeight: '16px',
                background: 'var(--color-primary-600)',
                borderRadius: 'var(--radius-full)',
              }}
            >
              Required
            </span>
          </span>
        }
        description={
          <span>
            This example uses ReactNode label, description, and validation
            content.
          </span>
        }
        error={<strong>Select an available country.</strong>}
        required
      >
        {renderSelectItems(optionsWithDisabled)}
      </Select>
    </Section>
  ),
};

export const States: Story = {
  render: () => (
    <Section title='States'>
      <div style={gridStyle}>
        <Select label='Default'>{renderSelectItems()}</Select>
        <Select label='With value' defaultValue='fr'>
          {renderSelectItems()}
        </Select>
        <Select label='Required' required placeholder='Required select'>
          {renderSelectItems()}
        </Select>
        <Select label='Disabled' defaultValue='fr' disabled>
          {renderSelectItems()}
        </Select>
        <Select label='Error' error='This field is required.'>
          {renderSelectItems()}
        </Select>
      </div>
    </Section>
  ),
};

export const WithFormName: Story = {
  args: {
    id: 'country',
    name: 'country',
    defaultValue: 'fr',
    description: 'This value is submitted through a hidden input.',
  },
  render: (args) => (
    <Section title='Form submission'>
      <Select {...args} />
    </Section>
  ),
};

export const AccessibleWithoutVisibleLabel: Story = {
  args: {
    label: undefined,
    'aria-label': 'Billing country',
    placeholder: 'Choose billing country',
  },
  render: (args) => (
    <Section title='Accessible without visible label'>
      <SelectWithState {...args} />
    </Section>
  ),
};

export const Selection: Story = {
  args: {
    defaultValue: 'fr',
  },
  render: (args) => (
    <Section title='Selection'>
      <SelectWithState {...args} />
    </Section>
  ),
};

export const OpenDropdown: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Open dropdown'>
      <SelectWithState {...args} />
    </Section>
  ),
};

export const DisabledOptionsOpen: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Section title='Disabled options'>
      <SelectWithState {...args} storyOptions={optionsWithDisabled} />
    </Section>
  ),
};
