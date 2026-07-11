import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-native';
import {
  Check,
  Close,
  Download,
  DropdownMenu,
  Filter,
  Save,
  Search,
  Settings,
} from '@vellira-ui/icons';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { fn } from 'storybook/test';

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

const radioOptions = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
  { label: 'Enterprise', value: 'enterprise' },
];

const dropdownItems = [
  { label: 'Open settings', value: 'settings', icon: <Settings /> },
  { label: 'Download report', value: 'download', icon: <Download /> },
  { label: 'Filter view', value: 'filter', icon: <Filter /> },
];

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
  const [modalOpen, setModalOpen] = useState(false);

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
              <Button color='secondary'>Secondary</Button>
              <Button color='close'>Close</Button>
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
              Variants
            </Text>
            <View style={styles.row}>
              <Button color='primary' variant='solid'>
                Solid
              </Button>
              <Button color='primary' variant='outline'>
                Outline
              </Button>
              <Button color='primary' variant='ghost'>
                Ghost
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
              <Button leftIcon={<Download />}>Left icon</Button>
              <Button rightIcon={<Download />}>Right icon</Button>
              <Button leftIcon={<Download />} rightIcon={<Search />}>
                Both icons
              </Button>
              <Button
                iconOnly
                accessibilityLabel='Search'
                leftIcon={<Search />}
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
              Accessible icon actions
            </Text>
            <View style={styles.row}>
              <Button
                accessibilityLabel='Search'
                color='primary'
                iconOnly
                leftIcon={<Search />}
                variant='ghost'
              />
              <Button
                accessibilityLabel='Filter results'
                color='secondary'
                iconOnly
                leftIcon={<Filter />}
                variant='outline'
              />
              <Button
                accessibilityLabel='Save'
                color='primary'
                iconOnly
                leftIcon={<Save />}
                variant='solid'
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
              leftIcon={<Search />}
            />

            <Input label='Password' placeholder='Password' type='password' />

            <Input
              label='Verified email'
              defaultValue='hello@vellira.dev'
              rightIcon={<Check />}
              rightIconTone='success'
              placeholder='name@company.com'
              type='email'
            />

            <Input
              label='Search settings'
              leftIcon={<Search />}
              rightIcon={<Check />}
              rightIconTone='success'
              leftIconTone='primary'
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
          <Checkbox
            label='Receive product updates'
            checked={accepted}
            onChange={setAccepted}
          />
          <Checkbox label='Disabled checked' checked disabled />
          <Checkbox label='Validation state' error='Required field' />
        </Section>

        <Section title='RadioGroup'>
          <RadioGroup
            label='Plan'
            options={radioOptions}
            value={plan}
            onChange={setPlan}
          />
        </Section>

        <Section title='Select'>
          <Select
            label='Team'
            description='Choose the owning team.'
            options={selectOptions}
            value={team}
            onChange={setTeam}
          />
          <Select
            label='Required team'
            options={selectOptions}
            placeholder='Select a team'
            error='Team is required'
          />
        </Section>

        <Section title='Dropdown'>
          <View style={styles.row}>
            <Dropdown
              label='Actions'
              trigger='Actions'
              items={dropdownItems}
              onSelect={fn()}
            />
            <Dropdown
              label='Icon actions'
              icon={<DropdownMenu />}
              items={dropdownItems}
              onSelect={fn()}
            />
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
              <Button color='secondary' variant='solid'>
                Long press
              </Button>
            </Tooltip>
            <Tooltip content='Icon buttons also expose tooltip content.'>
              <Button
                color='secondary'
                variant='solid'
                accessibilityLabel='Open filters'
                leftIcon={<Filter />}
              />
            </Tooltip>
          </View>
        </Section>

        <Section title='Modal'>
          <Button onPress={() => setModalOpen(true)}>Open modal</Button>
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <Modal.Header>Review changes</Modal.Header>
            <Modal.Body>
              <Text
                style={[
                  styles.panelText,
                  { color: theme.semantic.text.primary },
                ]}
              >
                Confirm the changes before applying them to the workspace.
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <Button
                color='secondary'
                variant='solid'
                onPress={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                color='primary'
                variant='solid'
                onPress={() => setModalOpen(false)}
              >
                Apply
              </Button>
            </Modal.Footer>
          </Modal>
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
