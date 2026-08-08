import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-native';
import { Check, Search, User } from '@vellira-ui/icons';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fn } from 'storybook/test';

import { FormField } from '../../patterns/FormField';
import { useTheme } from '../../theme';

import { Select } from './Select';

const countryItems = [
  { label: 'France', value: 'fr', description: 'Paris', badge: 'EU' },
  { label: 'Germany', value: 'de', description: 'Berlin', badge: 'EU' },
  { label: 'Spain', value: 'es', description: 'Madrid', badge: 'EU' },
];

const teamItems = [
  { label: 'Product', value: 'product' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Support', value: 'support' },
];

const groupedTeamItems = {
  core: [
    { label: 'Product', value: 'team-product' },
    { label: 'Engineering', value: 'team-engineering' },
    { label: 'Design', value: 'team-design' },
    { label: 'Research', value: 'team-research' },
    { label: 'Data', value: 'team-data' },
  ],
  operations: [
    { label: 'Support', value: 'team-support' },
    { label: 'Success', value: 'team-success' },
    { label: 'Sales', value: 'team-sales' },
    { label: 'Marketing', value: 'team-marketing' },
    { label: 'Finance', value: 'team-finance' },
  ],
  platform: [
    { label: 'Infrastructure', value: 'team-infrastructure' },
    { label: 'Security', value: 'team-security' },
    { label: 'Developer Experience', value: 'team-devex' },
    { label: 'QA', value: 'team-qa' },
  ],
};

const longItems = Array.from({ length: 80 }, (_, index) => ({
  label: `Country ${index + 1}`,
  value: `country-${index + 1}`,
}));

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Select Component

Native select control with the same public philosophy as Web Select, but with native interaction: trigger opens a sheet, modal, or popover and options render through FlatList.

**Features**

- Children-first API with \`Select.Item\`, \`Select.Group\`, \`Select.Separator\`
- Optional \`options\` array for simple lists
- \`value/defaultValue/onValueChange\`, \`color/variant/size\`
- FormField context inheritance and shorthand field props
- Searchable, clearable, loading, multiple, maxSelected and controlled open
- Rich item metadata: description, icon, badge, disabled and color
- Token-driven colors, borders, shadows, focus rings, and option states
- Native presentations: \`auto\`, \`sheet\`, \`modal\`, \`popover\`

### Usage

\`\`\`tsx
<Select label='Country' placeholder='Choose country'>
  <Select.Item value='fr' label='France' />
  <Select.Item value='de' label='Germany' />
</Select>
\`\`\`
`,
      },
    },
  },
  args: {
    label: 'Country',
    placeholder: 'Choose country',
    size: 'md',
    color: 'primary',
    variant: 'outline',
    required: false,
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    color: {
      control: 'radio',
      options: ['primary', 'neutral', 'success', 'warning', 'danger'],
    },
    variant: {
      control: 'radio',
      options: ['outline', 'filled', 'soft'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    presentation: {
      control: 'radio',
      options: ['auto', 'sheet', 'modal', 'popover'],
    },
    options: { control: false },
    children: { control: false },
    renderValue: { control: false },
    renderOption: { control: false },
    startIcon: { control: false },
    endIcon: { control: false },
    style: { control: false },
    triggerStyle: { control: false },
    textStyle: { control: false },
    contentStyle: { control: false },
    optionStyle: { control: false },
    searchStyle: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;
type SelectStoryProps = ComponentProps<typeof Select>;

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

function renderCountryItems() {
  return countryItems.map((item) => (
    <Select.Item
      key={item.value}
      value={item.value}
      label={item.label}
      description={item.description}
      badge={item.badge}
    />
  ));
}

function renderTeamItems() {
  return teamItems.map((item) => (
    <Select.Item key={item.value} value={item.value} label={item.label} />
  ));
}

function renderGroupedTeamItems(
  items: Array<{ label: string; value: string }>
) {
  return items.map((item) => (
    <Select.Item key={item.value} value={item.value} label={item.label} />
  ));
}

function InteractiveSelect(args: SelectStoryProps) {
  const [value, setValue] = useState<string | null>(
    Array.isArray(args.value)
      ? (args.value[0] ?? null)
      : (args.value ?? args.defaultValue ?? null)
  );

  useEffect(() => {
    setValue(
      Array.isArray(args.value)
        ? (args.value[0] ?? null)
        : (args.value ?? args.defaultValue ?? null)
    );
  }, [args.value, args.defaultValue]);

  return (
    <Select
      {...args}
      value={value}
      onValueChange={(nextValue) => {
        setValue(nextValue);
        args.onValueChange?.(nextValue);
      }}
    >
      {renderCountryItems()}
    </Select>
  );
}

function AsyncSearchSelect() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const options = query
    ? countryItems.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : countryItems;

  const handleSearch = (nextQuery: string) => {
    setQuery(nextQuery);
    setIsLoading(Boolean(nextQuery));
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <Select
      label='Async country'
      searchable
      clearable
      loading={isLoading}
      onSearch={handleSearch}
      options={options}
      empty='No countries found'
      loadingText='Searching...'
    />
  );
}

function ControlledOpenSelect() {
  const [open, setOpen] = useState(false);

  return (
    <Select
      label='Country'
      open={open}
      onOpenChange={setOpen}
      placeholder='Controlled open'
    >
      {renderCountryItems()}
    </Select>
  );
}

function CustomRenderSelect() {
  return (
    <Select
      label='Assignee'
      defaultValue='alex'
      startIcon={<User />}
      renderValue={({ option }) =>
        option ? <Text>Assigned to {option.label}</Text> : null
      }
      renderOption={({ option, selected }) => (
        <Text>
          {selected ? 'Selected ' : ''}
          {option.label}
        </Text>
      )}
    >
      <Select.Item value='alex' label='Alex Taylor' />
      <Select.Item value='jordan' label='Jordan Lee' />
      <Select.Item value='casey' label='Casey Morgan' />
    </Select>
  );
}

export const Playground: Story = {
  render: (args) => (
    <Section title='Playground'>
      <InteractiveSelect {...args} />
    </Section>
  ),
};

export const BasicChildrenOnly: Story = {
  render: () => (
    <Section title='Basic children-only'>
      <Select label='Country' placeholder='Choose country'>
        {renderCountryItems()}
      </Select>
    </Section>
  ),
};

export const ExplicitCompound: Story = {
  render: () => (
    <Section title='Explicit compound'>
      <Select label='Country' placeholder='Choose country'>
        <Select.Trigger />
        <Select.Content>
          <Select.Search placeholder='Search country...' />
          <Select.Group>
            <Select.Label>Europe</Select.Label>
            <Select.Item value='fr' label='France' description='Paris' />
            <Select.Item value='de' label='Germany' description='Berlin' />
          </Select.Group>
          <Select.Separator />
          <Select.Item value='es' label='Spain' description='Madrid' />
          <Select.Empty>No countries found</Select.Empty>
          <Select.Loading>Searching...</Select.Loading>
        </Select.Content>
      </Select>
    </Section>
  ),
};

export const ColorsAndVariants: Story = {
  render: () => (
    <Section title='Colors and variants'>
      <View style={storyStyles.column}>
        <Select label='Primary outline' color='primary' variant='outline'>
          {renderTeamItems()}
        </Select>
        <Select label='Neutral filled' color='neutral' variant='filled'>
          {renderTeamItems()}
        </Select>
        <Select label='Success soft' color='success' variant='soft'>
          {renderTeamItems()}
        </Select>
        <Select label='Warning outline' color='warning' variant='outline'>
          {renderTeamItems()}
        </Select>
        <Select label='Danger soft' color='danger' variant='soft'>
          {renderTeamItems()}
        </Select>
      </View>
    </Section>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section title='Sizes'>
      <View style={storyStyles.column}>
        <Select label='Small' size='sm'>
          {renderTeamItems()}
        </Select>
        <Select label='Medium' size='md'>
          {renderTeamItems()}
        </Select>
        <Select label='Large' size='lg'>
          {renderTeamItems()}
        </Select>
      </View>
    </Section>
  ),
};

export const FormFieldIntegration: Story = {
  render: () => (
    <Section title='FormField integration'>
      <FormField
        label='Country'
        description='Shipping destination'
        error='Country is required'
        required
      >
        <Select placeholder='Choose country'>{renderCountryItems()}</Select>
      </FormField>
    </Section>
  ),
};

export const ShorthandField: Story = {
  render: () => (
    <Section title='Shorthand field'>
      <Select
        label='Country'
        description='Shipping destination'
        error='Country is required'
        required
      >
        {renderCountryItems()}
      </Select>
    </Section>
  ),
};

export const SearchableAndClearable: Story = {
  render: () => (
    <Section title='Searchable and clearable'>
      <Select
        label='Country'
        searchable
        clearable
        searchPlaceholder='Search country...'
        defaultValue='fr'
      >
        {renderCountryItems()}
      </Select>
    </Section>
  ),
};

export const LoadingAndAsync: Story = {
  render: () => (
    <Section title='Loading and async'>
      <AsyncSearchSelect />
    </Section>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Section title='Multiple'>
      <Select
        label='Teams'
        multiple
        maxSelected={2}
        closeOnSelect={false}
        clearable
        defaultValue={['product']}
      >
        <Select.Group label='Teams' selectable selectLabel='All teams'>
          {renderTeamItems()}
        </Select.Group>
      </Select>
    </Section>
  ),
};

export const MultipleGroupedLarge: Story = {
  render: () => (
    <Section title='Multiple grouped large'>
      <Select
        label='Teams'
        multiple
        closeOnSelect={false}
        clearable
        searchable
        defaultValue={['team-product', 'team-engineering', 'team-support']}
        placeholder='Select teams'
      >
        <Select.Group label='Core teams' selectable selectLabel='All core'>
          {renderGroupedTeamItems(groupedTeamItems.core)}
        </Select.Group>
        <Select.Group
          label='Operations'
          selectable
          selectLabel='All operations'
        >
          {renderGroupedTeamItems(groupedTeamItems.operations)}
        </Select.Group>
        <Select.Group label='Platform' selectable selectLabel='All platform'>
          {renderGroupedTeamItems(groupedTeamItems.platform)}
        </Select.Group>
      </Select>
    </Section>
  ),
};

export const GroupsAndRichItems: Story = {
  render: () => (
    <Section title='Groups and rich items'>
      <Select label='Country' searchable clearable>
        <Select.Group label='Europe'>
          <Select.Item
            value='fr'
            label='France'
            description='Paris'
            icon={<Check />}
            badge='EU'
          />
          <Select.Item
            value='de'
            label='Germany'
            description='Berlin'
            badge='EU'
          />
        </Select.Group>
        <Select.Separator />
        <Select.Group label='Unavailable'>
          <Select.Item
            value='uk'
            label='United Kingdom'
            description='Temporarily disabled'
            disabled
          />
        </Select.Group>
      </Select>
    </Section>
  ),
};

export const CustomRender: Story = {
  render: () => (
    <Section title='Custom render'>
      <CustomRenderSelect />
    </Section>
  ),
};

export const PrefixSuffixIcons: Story = {
  render: () => (
    <Section title='Prefix, suffix and icons'>
      <Select
        label='Domain'
        prefix='https://'
        suffix='.com'
        startIcon={<Search />}
        placeholder='workspace'
      >
        <Select.Item value='vellira' label='vellira' />
        <Select.Item value='design-system' label='design-system' />
      </Select>
    </Section>
  ),
};

export const ControlledOpen: Story = {
  render: () => (
    <Section title='Controlled open'>
      <ControlledOpenSelect />
    </Section>
  ),
};

export const Presentations: Story = {
  render: () => (
    <Section title='Sheet, modal and popover'>
      <View style={storyStyles.column}>
        <Select label='Auto' presentation='auto'>
          {renderTeamItems()}
        </Select>
        <Select label='Sheet' presentation='sheet'>
          {renderTeamItems()}
        </Select>
        <Select label='Modal' presentation='modal'>
          {renderTeamItems()}
        </Select>
        <Select label='Popover' presentation='popover' matchTriggerWidth>
          {renderTeamItems()}
        </Select>
      </View>
    </Section>
  ),
};

export const LongVirtualizedList: Story = {
  render: () => (
    <Section title='Long virtualized list'>
      <Select
        label='Country'
        searchable
        virtual={{ estimatedItemSize: 46, initialNumToRender: 16 }}
        defaultValue='country-24'
        options={longItems}
      />
    </Section>
  ),
};

export const Accessibility: Story = {
  render: () => (
    <Section title='Accessibility'>
      <Select
        label='Billing country'
        description='Used for invoices and tax documents.'
        accessibilityLabel='Billing country'
        accessibilityHint='Opens a list of countries'
        required
      >
        {renderCountryItems()}
      </Select>
    </Section>
  ),
};
