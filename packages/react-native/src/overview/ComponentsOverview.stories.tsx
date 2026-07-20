import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-native';
import {
  Check,
  Close,
  Download,
  Filter,
  Menu,
  Save,
  Search,
  Settings,
  Trash,
} from '@vellira-ui/icons';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Dropdown } from '../components/Dropdown';
import { Modal } from '../components/Modal';
import { RadioGroup } from '../components/RadioGroup';
import { Select } from '../components/Select';
import { Tabs } from '../components/Tabs';
import { Tooltip } from '../components/Tooltip';
import { FormField } from '../patterns/FormField';
import { Button } from '../primitives/Button';
import { Checkbox } from '../primitives/Checkbox';
import { Input } from '../primitives/Input';
import { Radio } from '../primitives/Radio';
import { useTheme } from '../theme';

const meta = {
  title: 'Overview/Native',
  parameters: {
    layout: 'fullscreen',
  },
  render: () => <NativeComponentsOverview />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const selectOptions = [
  { label: 'Product', value: 'product' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Support', value: 'support' },
];

const groupedSelectOptions = {
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

const longSelectOptions = Array.from({ length: 80 }, (_, index) => ({
  label: `Country ${index + 1}`,
  value: `country-${index + 1}`,
}));

function renderSelectItems() {
  return selectOptions.map((option) => (
    <Select.Item key={option.value} value={option.value} label={option.label} />
  ));
}

function renderGroupedSelectItems(
  items: Array<{ label: string; value: string }>
) {
  return items.map((option) => (
    <Select.Item key={option.value} value={option.value} label={option.label} />
  ));
}

function renderDropdownContent() {
  return (
    <Dropdown.Content>
      <Dropdown.Label>Report actions</Dropdown.Label>
      <Dropdown.Item value='settings' icon={<Settings />}>
        Open settings
      </Dropdown.Item>
      <Dropdown.Item value='download' icon={<Download />}>
        Download report
      </Dropdown.Item>
      <Dropdown.Item value='filter' icon={<Filter />}>
        Filter view
      </Dropdown.Item>
      <Dropdown.Separator />
      <Dropdown.Item value='delete' icon={<Trash />} danger>
        Delete report
      </Dropdown.Item>
    </Dropdown.Content>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.section,
        {
          borderColor: theme.semantic.border.muted,
          backgroundColor: theme.semantic.surface.subtle,
        },
      ]}
    >
      <Text
        style={[styles.sectionTitle, { color: theme.semantic.text.primary }]}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function NativeComponentsOverview() {
  const { theme } = useTheme();
  const [accepted, setAccepted] = useState(true);
  const [plan, setPlan] = useState('pro');
  const [team, setTeam] = useState('engineering');
  const [teams, setTeams] = useState<string[]>(['product']);
  return (
    <ScrollView
      nestedScrollEnabled
      keyboardShouldPersistTaps='handled'
      style={[styles.root, { backgroundColor: theme.semantic.surface.default }]}
      contentContainerStyle={styles.scrollContent}
      contentInsetAdjustmentBehavior='always'
      alwaysBounceVertical
      bounces
      showsVerticalScrollIndicator
    >
      <View style={styles.content}>
        <Section title='Button'>
          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Colors
            </Text>
            <View style={styles.row}>
              <Button color='primary'>Primary</Button>
              <Button color='neutral'>Neutral</Button>
              <Button color='success'>Success</Button>
              <Button color='warning'>Warning</Button>
              <Button color='danger'>Danger</Button>
            </View>
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Appearances
            </Text>
            <View style={styles.stack}>
              <View style={styles.row}>
                <Button color='primary' appearance='solid'>
                  Primary solid
                </Button>
                <Button color='neutral' appearance='solid'>
                  Neutral solid
                </Button>
                <Button color='success' appearance='solid'>
                  Success solid
                </Button>
                <Button color='warning' appearance='solid'>
                  Warning solid
                </Button>
                <Button color='danger' appearance='solid'>
                  Danger solid
                </Button>
              </View>

              <View style={styles.row}>
                <Button color='primary' appearance='outline'>
                  Primary outline
                </Button>
                <Button color='neutral' appearance='outline'>
                  Neutral outline
                </Button>
                <Button color='success' appearance='outline'>
                  Success outline
                </Button>
                <Button color='warning' appearance='outline'>
                  Warning outline
                </Button>
                <Button color='danger' appearance='outline'>
                  Danger outline
                </Button>
              </View>

              <View style={styles.row}>
                <Button color='primary' appearance='ghost'>
                  Primary ghost
                </Button>
                <Button color='neutral' appearance='ghost'>
                  Neutral ghost
                </Button>
                <Button color='success' appearance='ghost'>
                  Success ghost
                </Button>
                <Button color='warning' appearance='ghost'>
                  Warning ghost
                </Button>
                <Button color='danger' appearance='ghost'>
                  Danger ghost
                </Button>
              </View>

              <View style={styles.row}>
                <Button color='primary' appearance='soft'>
                  Primary soft
                </Button>
                <Button color='neutral' appearance='soft'>
                  Neutral soft
                </Button>
                <Button color='success' appearance='soft'>
                  Success soft
                </Button>
                <Button color='warning' appearance='soft'>
                  Warning soft
                </Button>
                <Button color='danger' appearance='soft'>
                  Danger soft
                </Button>
              </View>

              <View style={styles.row}>
                <Button color='primary' appearance='link'>
                  Primary link
                </Button>
                <Button color='neutral' appearance='link'>
                  Neutral link
                </Button>
                <Button color='success' appearance='link'>
                  Success link
                </Button>
                <Button color='warning' appearance='link'>
                  Warning link
                </Button>
                <Button color='danger' appearance='link'>
                  Danger link
                </Button>
              </View>
            </View>
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Sizes
            </Text>
            <View style={styles.row}>
              <Button size='sm'>Small</Button>
              <Button size='md'>Medium</Button>
              <Button size='lg'>Large</Button>
            </View>
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Shapes
            </Text>
            <View style={styles.row}>
              <Button
                accessibilityLabel='Save'
                iconOnly
                iconStart={<Save />}
                shape='square'
              />
              <Button shape='rounded'>Rounded</Button>
              <Button shape='pill'>Pill</Button>
            </View>
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              States
            </Text>
            <View style={styles.row}>
              <Button disabled>Disabled</Button>
              <Button loading>Loading</Button>
              <Button loading loadingText='Saving...'>
                Save
              </Button>
            </View>
            <View style={styles.fullWidthDemo}>
              <Button fullWidth>Full width</Button>
            </View>
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Icons
            </Text>
            <View style={styles.row}>
              <Button iconStart={<Download />}>Start icon</Button>
              <Button iconEnd={<Download />}>End icon</Button>
              <Button iconStart={<Download />} iconEnd={<Search />}>
                Both icons
              </Button>
              <Button
                iconOnly
                accessibilityLabel='Search'
                iconStart={<Search />}
              >
                Search
              </Button>
            </View>
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Command actions
            </Text>
            <View style={styles.row}>
              <Button
                appearance='soft'
                badge='4'
                color='neutral'
                iconStart={<Search />}
                shortcut='⌘K'
              >
                Command
              </Button>
              <Button
                appearance='ghost'
                color='danger'
                iconStart={<Filter />}
                shortcut='⌘⌫'
              >
                Clear filters
              </Button>
            </View>
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Accessible icon actions
            </Text>
            <View style={styles.row}>
              <Button
                accessibilityLabel='Search'
                color='primary'
                iconOnly
                iconStart={<Search />}
                appearance='ghost'
              />
              <Button
                accessibilityLabel='Filter results'
                color='neutral'
                iconOnly
                iconStart={<Filter />}
                appearance='outline'
              />
              <Button
                accessibilityLabel='Save'
                color='primary'
                iconOnly
                iconStart={<Save />}
                appearance='solid'
              />
            </View>
          </View>
        </Section>

        <Section title='Input'>
          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Basic
            </Text>
            <Input
              label='Name'
              description='Basic uncontrolled input.'
              placeholder='Ada Lovelace'
            />
            <Input
              label='Required email'
              placeholder='name@example.com'
              type='email'
              required
            />
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Colors
            </Text>
            <View style={styles.row}>
              <Checkbox label='Primary' color='primary' defaultChecked />
              <Checkbox label='Success' color='success' defaultChecked />
              <Checkbox label='Warning' color='warning' defaultChecked />
              <Checkbox label='Danger' color='danger' defaultChecked />
            </View>
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Label position
            </Text>
            <View style={styles.group}>
              <Checkbox label='Label at end' labelPosition='end' />
              <Checkbox
                label='Label at start'
                labelPosition='start'
                defaultChecked
              />
            </View>
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Sizes
            </Text>
            <Input label='Small' size='sm' placeholder='Small input' />
            <Input label='Medium' size='md' placeholder='Medium input' />
            <Input label='Large' size='lg' placeholder='Large input' />
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Types and icons
            </Text>
            <Input label='Text' type='text' placeholder='Ada Lovelace' />

            <Input label='Number' type='number' placeholder='42' />

            <Input label='Phone' type='tel' placeholder='+33 6 00 00 00 00' />

            <Input label='URL' type='url' placeholder='https://vellira.dev' />

            <Input
              label='Search'
              type='search'
              placeholder='Search components'
              iconStart={<Search />}
            />

            <Input label='Password' placeholder='Password' type='password' />

            <Input
              label='Verified email'
              defaultValue='hello@vellira.dev'
              iconEnd={<Check />}
              iconEndTone='success'
              placeholder='name@company.com'
              type='email'
            />

            <Input
              label='Search settings'
              iconStart={<Search />}
              iconEnd={<Check />}
              iconEndTone='success'
              iconStartTone='primary'
              defaultValue='Theme'
            />

            <Input
              label='Clearable'
              placeholder='Type something'
              defaultValue='Theme'
              clearable
              clearIcon={<Close />}
            />
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              States
            </Text>
            <Input label='Required' required placeholder='Required input' />

            <Input label='Disabled' disabled value='Disabled value' />

            <Input label='Read only' readOnly value='Read only value' />

            <Input
              label='Invalid email'
              placeholder='name@example.com'
              type='email'
              error='Use a valid email address'
            />

            <Input
              label='Password'
              type='password'
              required
              error='Password must contain at least 8 characters'
              value=''
            />
          </View>
        </Section>

        <Section title='Checkbox'>
          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Settings row
            </Text>
            <Checkbox
              label='Receive product updates'
              description='Get release notes and billing notifications.'
              checked={accepted}
              onCheckedChange={setAccepted}
            />
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              States
            </Text>
            <Checkbox label='Unchecked' />
            <Checkbox label='Checked' defaultChecked />
            <Checkbox label='Indeterminate' indeterminate />
            <Checkbox label='Required' required />
            <Checkbox label='Disabled checked' defaultChecked disabled />
            <Checkbox
              label='Validation state'
              description='This setting is required to continue.'
              error='Required field'
            />
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Sizes
            </Text>
            <View style={styles.row}>
              <Checkbox label='Small' size='sm' />
              <Checkbox label='Medium' size='md' />
              <Checkbox label='Large' size='lg' />
            </View>
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Accessible without visible label
            </Text>
            <Checkbox accessibilityLabel='Enable notifications' />
          </View>
        </Section>

        <Section title='Radio'>
          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              States
            </Text>
            <Radio value='unchecked' label='Unchecked' />
            <Radio value='checked' label='Checked' defaultChecked />
            <Radio
              value='described'
              label='With description'
              description='Use inside RadioGroup for exclusive choices.'
            />
            <Radio value='disabled' label='Disabled' disabled />
            <Radio
              value='error'
              label='Validation state'
              error='This option needs attention.'
            />
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Sizes
            </Text>
            <View style={styles.row}>
              <Radio value='small' label='Small' size='sm' />
              <Radio value='medium' label='Medium' size='md' />
              <Radio value='large' label='Large' size='lg' />
            </View>
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Colors
            </Text>
            <View style={styles.row}>
              <Radio
                value='primary'
                label='Primary'
                color='primary'
                defaultChecked
              />
              <Radio
                value='neutral'
                label='Neutral'
                color='neutral'
                defaultChecked
              />
              <Radio
                value='success'
                label='Success'
                color='success'
                defaultChecked
              />
              <Radio
                value='warning'
                label='Warning'
                color='warning'
                defaultChecked
              />
              <Radio
                value='danger'
                label='Danger'
                color='danger'
                defaultChecked
              />
            </View>
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Custom indicator
            </Text>
            <Radio
              value='custom-indicator'
              label='Approved'
              color='success'
              defaultChecked
              icon={<Check />}
            />
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Accessible without visible label
            </Text>
            <Radio value='email' accessibilityLabel='Email notifications' />
          </View>
        </Section>

        <Section title='RadioGroup'>
          <RadioGroup
            label='Plan'
            description='Choose one subscription plan.'
            value={plan}
            onValueChange={setPlan}
          >
            <Radio value='starter' label='Starter' />
            <Radio
              value='pro'
              label='Pro'
              description='Best for growing teams.'
            />
            <Radio value='enterprise' label='Enterprise' />
          </RadioGroup>

          <RadioGroup
            label='Delivery'
            orientation='horizontal'
            color='success'
            defaultValue='standard'
          >
            <Radio value='standard' label='Standard' />
            <Radio value='express' label='Express' />
            <Radio value='pickup' label='Pickup' disabled />
          </RadioGroup>

          <RadioGroup
            label='Status'
            description='Group color is inherited by child radios.'
            color='danger'
            defaultValue='blocked'
          >
            <Radio value='blocked' label='Blocked' />
            <Radio value='active' label='Active' color='success' />
          </RadioGroup>

          <RadioGroup
            label='Required plan'
            required
            error='Choose one plan to continue.'
          >
            <Radio value='starter' label='Starter' />
            <Radio value='pro' label='Pro' />
          </RadioGroup>
        </Section>

        <Section title='Select'>
          <Select
            label='Team'
            description='Choose the owning team.'
            value={team}
            onValueChange={(nextValue) => setTeam(nextValue ?? '')}
            clearable
          >
            {renderSelectItems()}
          </Select>
          <Select
            label='Required team'
            placeholder='Select a team'
            required
            error='Team is required'
          >
            {renderSelectItems()}
          </Select>
          <Select
            label='Searchable team'
            description='Native Select opens as a sheet, modal or popover.'
            searchable
            clearable
            defaultValue='product'
            accessibilityHint='Choose the team used for invoices.'
          >
            {renderSelectItems()}
          </Select>
          <Select
            label='Multiple teams'
            multiple
            maxSelected={2}
            closeOnSelect={false}
            value={teams}
            onValueChange={setTeams}
            placeholder='Select teams'
          >
            <Select.Group label='Teams'>
              <Select.Item value='product' label='Product' badge='Core' />
              <Select.Item
                value='engineering'
                label='Engineering'
                description='Platform and quality'
              />
              <Select.Item value='support' label='Support' disabled />
            </Select.Group>
          </Select>
          <Select
            label='Grouped teams'
            multiple
            closeOnSelect={false}
            searchable
            clearable
            defaultValue={['team-product', 'team-engineering', 'team-support']}
            placeholder='Select teams'
          >
            <Select.Group label='Core teams' selectable selectLabel='All core'>
              {renderGroupedSelectItems(groupedSelectOptions.core)}
            </Select.Group>
            <Select.Group
              label='Operations'
              selectable
              selectLabel='All operations'
            >
              {renderGroupedSelectItems(groupedSelectOptions.operations)}
            </Select.Group>
            <Select.Group
              label='Platform'
              selectable
              selectLabel='All platform'
            >
              {renderGroupedSelectItems(groupedSelectOptions.platform)}
            </Select.Group>
          </Select>
          <Select
            label='Long virtualized countries'
            searchable
            virtual={{ estimatedItemSize: 46, initialNumToRender: 16 }}
            defaultValue='country-70'
            options={longSelectOptions}
          />
        </Section>

        <Section title='Dropdown'>
          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Contextual actions for commands. Use Select or RadioGroup for
              saved form values.
            </Text>
            <View style={styles.row}>
              <Dropdown>
                <Dropdown.Trigger>
                  <Button appearance='outline' color='neutral'>
                    Report actions
                  </Button>
                </Dropdown.Trigger>
                {renderDropdownContent()}
              </Dropdown>
              <Dropdown>
                <Dropdown.Trigger>
                  <Button
                    accessibilityLabel='More report actions'
                    appearance='ghost'
                    color='neutral'
                    iconOnly
                    iconStart={<Menu />}
                  />
                </Dropdown.Trigger>
                <Dropdown.Content presentation='popover'>
                  <Dropdown.Item value='settings' icon={<Settings />}>
                    Settings
                  </Dropdown.Item>
                  <Dropdown.Item value='download' icon={<Download />}>
                    Export
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown>
            </View>
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Presentation
            </Text>
            <View style={styles.row}>
              <Dropdown>
                <Dropdown.Trigger>
                  <Button appearance='outline' color='neutral'>
                    Sheet
                  </Button>
                </Dropdown.Trigger>
                <Dropdown.Content presentation='sheet'>
                  <Dropdown.Item value='settings' icon={<Settings />}>
                    Open settings
                  </Dropdown.Item>
                  <Dropdown.Item value='filter' icon={<Filter />}>
                    Filter view
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown>
              <Dropdown>
                <Dropdown.Trigger>
                  <Button appearance='outline' color='neutral'>
                    Modal
                  </Button>
                </Dropdown.Trigger>
                <Dropdown.Content presentation='modal'>
                  <Dropdown.Item value='download' icon={<Download />}>
                    Download report
                  </Dropdown.Item>
                  <Dropdown.Item value='delete' icon={<Trash />} danger>
                    Delete report
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown>
            </View>
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              States
            </Text>
            <View style={styles.row}>
              <Dropdown disabled>
                <Dropdown.Trigger>
                  <Button appearance='outline' color='neutral'>
                    Disabled actions
                  </Button>
                </Dropdown.Trigger>
                {renderDropdownContent()}
              </Dropdown>
              <Dropdown loading loadingText='Loading actions...'>
                <Dropdown.Trigger>
                  <Button appearance='outline' color='neutral'>
                    Loading actions
                  </Button>
                </Dropdown.Trigger>
                <Dropdown.Content />
              </Dropdown>
            </View>
          </View>
        </Section>

        <Section title='Tabs'>
          <Tabs defaultActiveIndex={0} appearance='underline'>
            <Tabs.List>
              <Tabs.Tab index={0}>Overview</Tabs.Tab>
              <Tabs.Tab index={1}>Usage</Tabs.Tab>
              <Tabs.Tab index={2}>Settings</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel index={0}>
              <Text
                style={[
                  styles.panelText,
                  { color: theme.semantic.text.primary },
                ]}
              >
                Overview content for the native component.
              </Text>
            </Tabs.Panel>
            <Tabs.Panel index={1}>
              <Text
                style={[
                  styles.panelText,
                  { color: theme.semantic.text.primary },
                ]}
              >
                Usage notes and examples.
              </Text>
            </Tabs.Panel>
            <Tabs.Panel index={2}>
              <Text
                style={[
                  styles.panelText,
                  { color: theme.semantic.text.primary },
                ]}
              >
                Settings panel content.
              </Text>
            </Tabs.Panel>
          </Tabs>
        </Section>

        <Section title='Tooltip'>
          <View style={styles.row}>
            <Tooltip content='Long press to show tooltip content.'>
              <Button color='neutral' appearance='solid'>
                Long press
              </Button>
            </Tooltip>
            <Tooltip content='Icon buttons also expose tooltip content.'>
              <Button
                color='neutral'
                appearance='solid'
                accessibilityLabel='Open filters'
                iconStart={<Filter />}
              />
            </Tooltip>
          </View>
        </Section>

        <Section title='Modal'>
          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              Basic
            </Text>
            <Modal>
              <Modal.Trigger asChild>
                <Button>Review changes</Button>
              </Modal.Trigger>
              <Modal.Portal>
                <Modal.Overlay>
                  <Modal.Content>
                    <Modal.Header>Review changes</Modal.Header>
                    <Modal.Body>
                      <Text
                        style={[
                          styles.panelText,
                          { color: theme.semantic.text.primary },
                        ]}
                      >
                        Confirm the changes before applying them to the
                        workspace.
                      </Text>
                    </Modal.Body>
                    <Modal.Footer>
                      <Modal.Close>
                        <Button color='neutral' appearance='solid'>
                          Cancel
                        </Button>
                      </Modal.Close>
                      <Modal.Close>
                        <Button color='primary' appearance='solid'>
                          Apply
                        </Button>
                      </Modal.Close>
                    </Modal.Footer>
                  </Modal.Content>
                </Modal.Overlay>
              </Modal.Portal>
            </Modal>
          </View>

          <View style={styles.group}>
            <Text
              style={[
                styles.subtitle,
                { color: theme.semantic.text.secondary },
              ]}
            >
              States
            </Text>
            <View style={styles.row}>
              <Modal closeOnOutsidePress={false}>
                <Modal.Trigger asChild>
                  <Button appearance='outline' color='neutral'>
                    Explicit close
                  </Button>
                </Modal.Trigger>
                <Modal.Portal>
                  <Modal.Overlay>
                    <Modal.Content>
                      <Modal.Header>Explicit close</Modal.Header>
                      <Modal.Body>
                        <Text
                          style={[
                            styles.panelText,
                            { color: theme.semantic.text.primary },
                          ]}
                        >
                          Backdrop press is disabled for this modal.
                        </Text>
                      </Modal.Body>
                    </Modal.Content>
                  </Modal.Overlay>
                </Modal.Portal>
              </Modal>
              <Modal closeOnOutsidePress={false}>
                <Modal.Trigger asChild>
                  <Button color='danger'>Confirm delete</Button>
                </Modal.Trigger>
                <Modal.Portal>
                  <Modal.Overlay>
                    <Modal.Content>
                      <Modal.Header>Delete report?</Modal.Header>
                      <Modal.Body>
                        <Text
                          style={[
                            styles.panelText,
                            { color: theme.semantic.text.primary },
                          ]}
                        >
                          Report data will be permanently removed.
                        </Text>
                      </Modal.Body>
                      <Modal.Footer>
                        <Modal.Close>
                          <Button color='neutral' appearance='solid'>
                            Cancel
                          </Button>
                        </Modal.Close>
                        <Modal.Close>
                          <Button color='danger'>Delete</Button>
                        </Modal.Close>
                      </Modal.Footer>
                    </Modal.Content>
                  </Modal.Overlay>
                </Modal.Portal>
              </Modal>
            </View>
          </View>
        </Section>

        <Section title='FormField'>
          <FormField
            label='Workspace'
            description='Used in URLs and notifications.'
            required
          >
            <Input label='Workspace' placeholder='vellira-design' />
          </FormField>
        </Section>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
  },

  scrollContent: {
    width: '100%',
    paddingBottom: 96,
  },

  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    gap: 16,
    padding: 16,
    paddingBottom: 64,
  },

  section: {
    width: '100%',
    gap: 14,
    padding: 16,
    borderWidth: 1,
    borderRadius: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
  },

  stack: {
    gap: 12,
  },

  group: {
    gap: 8,
  },

  subtitle: {
    fontSize: 13,
    fontWeight: '600',
  },

  fullWidthDemo: {
    width: '100%',
  },

  panelText: {},
});

export const Overview: Story = {};
