import { useId, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Check,
  Close,
  Delete,
  Download,
  DropdownMenu,
  Filter,
  Save,
  Search,
  Settings,
} from '@vellira-ui/icons';
import type { CSSProperties, ReactNode } from 'react';
const noop = () => undefined;

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

const dropdownItems = [
  { type: 'group' as const, label: 'Report actions' },
  { label: 'Open settings', value: 'settings', icon: <Settings /> },
  { label: 'Download report', value: 'download', icon: <Download /> },
  { label: 'Filter view', value: 'filter', icon: <Filter /> },
  { type: 'separator' as const },
  { label: 'Delete report', value: 'delete', icon: <Delete />, danger: true },
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

function WorkspaceFormFieldDemo() {
  const workspaceId = useId();
  const projectId = useId();
  const disabledId = useId();
  const errorId = useId();

  return (
    <div style={stackStyle}>
      <FormField
        id={workspaceId}
        label='Workspace'
        description='Used in URLs and notifications.'
        required
      >
        <input
          id={workspaceId}
          name='workspace'
          autoComplete='organization'
          placeholder='vellira-design'
          required
          aria-describedby={`${workspaceId}-description`}
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

      <FormField
        id={projectId}
        label={
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            Project
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
              Public
            </span>
          </span>
        }
        description='Custom label content.'
      >
        <input
          id={projectId}
          name='project'
          autoComplete='off'
          placeholder='launch-plan'
          aria-describedby={`${projectId}-description`}
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

      <FormField
        id={errorId}
        label='Slug'
        error='Only lowercase letters, numbers, and hyphens are allowed.'
      >
        <input
          id={errorId}
          name='slug'
          autoComplete='off'
          placeholder='Launch Plan'
          aria-invalid
          aria-describedby={`${errorId}-error`}
          style={{
            width: '100%',
            minHeight: 40,
            padding: '0 12px',
            color: 'var(--input-default-fg)',
            background: 'var(--input-default-bg)',
            border: '1px solid var(--status-error-border)',
            borderRadius: 'var(--radius-md)',
            boxSizing: 'border-box',
          }}
        />
      </FormField>

      <FormField
        id={disabledId}
        label='Organization'
        description='Locked by workspace policy.'
        disabled
      >
        <input
          id={disabledId}
          name='organization'
          autoComplete='organization'
          placeholder='Vellira'
          disabled
          aria-describedby={`${disabledId}-description`}
          style={{
            width: '100%',
            minHeight: 40,
            padding: '0 12px',
            color: 'var(--input-disabled-fg)',
            background: 'var(--input-disabled-bg)',
            border: '1px solid var(--input-disabled-border)',
            borderRadius: 'var(--radius-md)',
            boxSizing: 'border-box',
            cursor: 'not-allowed',
          }}
        />
      </FormField>
    </div>
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
                <Button iconOnly aria-label='Search' leftIcon={<Search />} />
              </div>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Button types</h3>
              <div style={rowStyle}>
                <Button type='button'>Button</Button>
                <Button type='submit'>Submit</Button>
                <Button type='reset'>Reset</Button>
              </div>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Accessible icon actions</h3>
              <div style={rowStyle}>
                <Button
                  aria-label='Search'
                  color='primary'
                  iconOnly
                  leftIcon={<Search />}
                  variant='ghost'
                />
                <Button
                  aria-label='Filter results'
                  color='secondary'
                  iconOnly
                  leftIcon={<Filter />}
                  variant='outline'
                />
                <Button
                  aria-label='Save'
                  color='primary'
                  iconOnly
                  leftIcon={<Save />}
                  variant='solid'
                />
              </div>
            </div>
          </div>
        </Section>

        <Section title='Input'>
          <div style={stackStyle}>
            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Basic</h3>
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
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Sizes</h3>
              <Input label='Small' size='sm' placeholder='Small input' />
              <Input label='Medium' size='md' placeholder='Medium input' />
              <Input label='Large' size='lg' placeholder='Large input' />
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Types and adornments</h3>
              <Input label='Text' type='text' placeholder='Ada Lovelace' />

              <Input label='Number' type='number' placeholder='42' />

              <Input label='Phone' type='tel' placeholder='+33 6 00 00 00 00' />

              <Input label='URL' type='url' placeholder='https://vellira.dev' />

              <Input
                label='Search'
                type='search'
                size='sm'
                leftAdornment={<Search />}
                placeholder='Search components'
              />

              <Input label='Password' type='password' placeholder='Password' />

              <Input
                label='Verified email'
                defaultValue='hello@vellira.dev'
                rightAdornment={<Check />}
                rightAdornmentTone='success'
                placeholder='name@company.com'
                type='email'
              />

              <Input
                label='Search settings'
                leftAdornment={<Search />}
                rightAdornment={<Check />}
                rightAdornmentTone='success'
                leftAdornmentTone='primary'
                defaultValue='Theme'
              />

              <Input
                label='Clearable'
                placeholder='Type something'
                defaultValue='Theme'
                clearable
                clearIcon={<Close />}
              />
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>States</h3>
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
            </div>
          </div>
        </Section>

        <Section title='Checkbox'>
          <div style={groupStyle}>
            <h3 style={subtitleStyle}>Settings row</h3>
            <Checkbox
              label='Receive product updates'
              description='Get release notes and billing notifications.'
              checked={accepted}
              onCheckedChange={setAccepted}
            />
          </div>

          <div style={groupStyle}>
            <h3 style={subtitleStyle}>States</h3>
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
          </div>

          <div style={groupStyle}>
            <h3 style={subtitleStyle}>Sizes</h3>
            <div style={rowStyle}>
              <Checkbox label='Small' size='sm' />
              <Checkbox label='Medium' size='md' />
              <Checkbox label='Large' size='lg' />
            </div>
          </div>

          <div style={groupStyle}>
            <h3 style={subtitleStyle}>Accessible without visible label</h3>
            <Checkbox aria-label='Enable notifications' />
          </div>
        </Section>

        <Section title='Radio'>
          <div style={stackStyle}>
            <div style={groupStyle}>
              <h3 style={subtitleStyle}>States</h3>
              <Radio
                name='overview-radio'
                value='unchecked'
                label='Unchecked'
              />
              <Radio
                name='overview-radio'
                value='checked'
                label='Checked'
                defaultChecked
              />
              <Radio value='required' label='Required' required />
              <Radio value='disabled' label='Disabled' disabled />
              <Radio
                value='description'
                label='With description'
                description='Useful when an option needs supporting context.'
              />
              <Radio
                value='error'
                label='Validation state'
                description='This choice is required to continue.'
                error='Select this option first.'
              />
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Sizes</h3>
              <div style={rowStyle}>
                <Radio value='small' label='Small' size='sm' />
                <Radio value='medium' label='Medium' size='md' />
                <Radio value='large' label='Large' size='lg' />
              </div>
            </div>
          </div>
        </Section>

        <Section title='RadioGroup'>
          <div style={stackStyle}>
            <RadioGroup
              name='overview-plan'
              label='Plan'
              description='Choose the billing plan for this workspace.'
              value={plan}
              onValueChange={setPlan}
            >
              <Radio value='starter' label='Starter' />
              <Radio value='pro' label='Pro' />
              <Radio value='enterprise' label='Enterprise' />
            </RadioGroup>

            <RadioGroup
              name='overview-delivery'
              label='Delivery'
              orientation='horizontal'
              defaultValue='standard'
            >
              <Radio value='standard' label='Standard' />
              <Radio value='express' label='Express' />
              <Radio value='pickup' label='Pickup' disabled />
            </RadioGroup>

            <RadioGroup
              name='overview-required-plan'
              label='Required plan'
              required
              error='Choose one plan to continue.'
            >
              <Radio value='starter' label='Starter' />
              <Radio value='pro' label='Pro' />
            </RadioGroup>
          </div>
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
            required
            error='Team is required'
          />
          <Select
            aria-label='Billing team'
            placeholder='Billing team'
            description='Accessible name comes from aria-label when the visible label is omitted.'
            options={selectOptions}
            defaultValue='product'
          />
          <Select
            label='Archived team'
            options={[]}
            placeholder='No archived team'
            noOptionsText='No archived teams available'
            defaultOpen
          />
        </Section>

        <Section title='Dropdown'>
          <div style={groupStyle}>
            <p style={subtitleStyle}>
              Contextual actions for commands. Use Select or RadioGroup for
              saved form values.
            </p>
            <div style={rowStyle}>
              <Dropdown
                label='Report actions'
                trigger='Report actions'
                items={dropdownItems}
                onSelect={noop}
              />
              <Dropdown
                label='More report actions'
                ariaLabel='More report actions'
                icon={<DropdownMenu />}
                showArrow={false}
                items={dropdownItems}
                onSelect={noop}
              />
              <Dropdown
                label='Disabled actions'
                trigger='Disabled actions'
                disabled
                items={dropdownItems}
                onSelect={noop}
              />
            </div>
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
                aria-label='Open filters'
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
          <WorkspaceFormFieldDemo />
        </Section>
      </div>
    </div>
  );
}

export const Overview: Story = {};
