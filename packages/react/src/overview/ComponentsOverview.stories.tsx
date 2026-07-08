import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Download,
  DropdownMenu,
  Filter,
  Search,
  Settings,
} from '@vellira-ui/icons';
import type { CSSProperties, ReactNode } from 'react';
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

const meta = {
  title: 'Overview/Web',
  parameters: {
    layout: 'fullscreen',
  },
  render: () => <WebComponentsOverview />,
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

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  minWidth: 0,
  padding: 20,
  border: '1px solid var(--border-muted)',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--surface-subtle)',
} satisfies CSSProperties;

const sectionTitleStyle = {
  margin: 0,
  color: 'var(--text-primary)',
  fontSize: 16,
  fontWeight: 600,
} satisfies CSSProperties;

const stackStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  alignItems: 'center',
} satisfies CSSProperties;

const groupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
} satisfies CSSProperties;

const subtitleStyle = {
  margin: 0,
  color: 'var(--text-secondary)',
  fontSize: 13,
  fontWeight: 600,
} satisfies CSSProperties;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={sectionStyle}>
      <h2 style={sectionTitleStyle}>{title}</h2>
      {children}
    </section>
  );
}

function WebComponentsOverview() {
  const [accepted, setAccepted] = useState(true);
  const [plan, setPlan] = useState('pro');
  const [team, setTeam] = useState('engineering');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        padding: 32,
        background: 'var(--surface-default)',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
          alignItems: 'start',
        }}
      >
        <Section title='Button'>
          <div style={stackStyle}>
            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Colors</h3>
              <div style={rowStyle}>
                <Button color='primary'>Primary</Button>
                <Button color='secondary'>Secondary</Button>
                <Button color='close'>Close</Button>
                <Button color='danger'>Danger</Button>
              </div>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Variants</h3>
              <div style={stackStyle}>
                <div style={rowStyle}>
                  <Button color='primary' variant='solid'>
                    Primary solid
                  </Button>
                  <Button color='secondary' variant='solid'>
                    Secondary solid
                  </Button>
                  <Button color='close' variant='solid'>
                    Close solid
                  </Button>
                  <Button color='danger' variant='solid'>
                    Danger solid
                  </Button>
                </div>

                <div style={rowStyle}>
                  <Button color='primary' variant='outline'>
                    Primary outline
                  </Button>
                  <Button color='secondary' variant='outline'>
                    Secondary outline
                  </Button>
                  <Button color='close' variant='outline'>
                    Close outline
                  </Button>
                  <Button color='danger' variant='outline'>
                    Danger outline
                  </Button>
                </div>

                <div style={rowStyle}>
                  <Button color='primary' variant='ghost'>
                    Primary ghost
                  </Button>
                  <Button color='secondary' variant='ghost'>
                    Secondary ghost
                  </Button>
                  <Button color='close' variant='ghost'>
                    Close ghost
                  </Button>
                  <Button color='danger' variant='ghost'>
                    Danger ghost
                  </Button>
                </div>
              </div>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Sizes</h3>
              <div style={rowStyle}>
                <Button size='sm'>Small</Button>
                <Button size='md'>Medium</Button>
                <Button size='lg'>Large</Button>
              </div>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>States</h3>
              <div style={rowStyle}>
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
                <Button loading loadingText='Saving...'>
                  Save
                </Button>
              </div>
              <div style={{ width: '100%' }}>
                <Button fullWidth>Full width</Button>
              </div>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Icons</h3>
              <div style={rowStyle}>
                <Button leftIcon={<Download />}>Left icon</Button>
                <Button rightIcon={<Download />}>Right icon</Button>
                <Button leftIcon={<Download />} rightIcon={<Search />}>
                  Both icons
                </Button>
                <Button iconOnly ariaLabel='Search' leftIcon={<Search />} />
              </div>
            </div>
          </div>
        </Section>

        <Section title='Input'>
          <Input label='Name' placeholder='Ada Lovelace' />
          <Input label='Search' placeholder='Find component' size='sm' />
          <Input
            label='Email'
            placeholder='name@example.com'
            error='Use a valid email address'
          />
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
            name='overview-plan'
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
          <div style={rowStyle}>
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
          </div>
        </Section>

        <Section title='Tabs'>
          <Tabs defaultActiveIndex={0} appearance='underline'>
            <Tabs.List>
              <Tabs.Tab index={0}>Overview</Tabs.Tab>
              <Tabs.Tab index={1}>Usage</Tabs.Tab>
              <Tabs.Tab index={2}>Settings</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel index={0}>
              Overview content for the web component.
            </Tabs.Panel>
            <Tabs.Panel index={1}>Usage notes and examples.</Tabs.Panel>
            <Tabs.Panel index={2}>Settings panel content.</Tabs.Panel>
          </Tabs>
        </Section>

        <Section title='Tooltip'>
          <div style={rowStyle}>
            <Tooltip content='Tooltip text is shown on hover or focus.'>
              <Button color='secondary' variant='solid'>
                Hover me
              </Button>
            </Tooltip>
            <Tooltip content='Icon buttons also expose tooltip content.'>
              <Button
                color='secondary'
                variant='solid'
                ariaLabel='Open filters'
                leftIcon={<Filter />}
              />
            </Tooltip>
          </div>
        </Section>

        <Section title='Modal'>
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <Modal.Header>Review changes</Modal.Header>
            <Modal.Body>
              Confirm the changes before applying them to the workspace.
            </Modal.Body>
            <Modal.Footer>
              <Button
                color='close'
                variant='solid'
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                color='primary'
                variant='solid'
                onClick={() => setModalOpen(false)}
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
            <input
              placeholder='vellira-design'
              style={{
                width: '100%',
                minHeight: 40,
                padding: '0 12px',
                color: 'var(--input-default-fg)',
                background: 'var(--input-default-bg)',
                border: '1px solid var(--input-default-border)',
                borderRadius: 'var(--radius-md)',
                boxSizing: 'border-box',
              }}
            />
          </FormField>
        </Section>
      </div>
    </div>
  );
}

export const Overview: Story = {};
