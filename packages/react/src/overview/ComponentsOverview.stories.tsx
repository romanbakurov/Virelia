import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Check,
  Download,
  Filter,
  More,
  Save,
  Search,
  Settings,
  Trash,
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
  { label: 'Delete report', value: 'delete', icon: <Trash />, danger: true },
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
  return (
    <div style={stackStyle}>
      <FormField
        label='Workspace'
        description='Input inherits size, id, aria, required and invalid state.'
        required
        size='sm'
      >
        <Input placeholder='vellira-design' />
      </FormField>

      <FormField
        label='Display name'
        optionalText='Optional'
        description='Optional text is handled by FormField.'
      >
        <Input placeholder='Alex Taylor' />
      </FormField>

      <FormField
        label='Slug'
        description='Error text is merged into aria-describedby.'
        error='Only lowercase letters, numbers, and hyphens are allowed.'
      >
        <Input placeholder='Launch Plan' />
      </FormField>

      <FormField
        label='Organization'
        description='Locked by workspace policy.'
        disabled
      >
        <Input placeholder='Vellira' />
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
                <Button color='neutral'>Neutral</Button>
                <Button color='success'>Success</Button>
                <Button color='warning'>Warning</Button>
                <Button color='danger'>Danger</Button>
              </div>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Appearances</h3>
              <div style={stackStyle}>
                <div style={rowStyle}>
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
                </div>

                <div style={rowStyle}>
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
                </div>

                <div style={rowStyle}>
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
                </div>

                <div style={rowStyle}>
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
                </div>

                <div style={rowStyle}>
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
              <h3 style={subtitleStyle}>Shapes</h3>
              <div style={rowStyle}>
                <Button
                  shape='square'
                  iconOnly
                  aria-label='Save'
                  iconStart={<Save />}
                />
                <Button shape='rounded'>Rounded</Button>
                <Button shape='pill'>Pill</Button>
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
                <Button iconStart={<Download />}>Start icon</Button>
                <Button iconEnd={<Download />}>End icon</Button>
                <Button iconStart={<Download />} iconEnd={<Search />}>
                  Both icons
                </Button>
                <Button iconOnly aria-label='Search' iconStart={<Search />} />
              </div>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Command and links</h3>
              <div style={rowStyle}>
                <Button
                  appearance='soft'
                  badge='4'
                  color='neutral'
                  iconStart={<Search />}
                  shortcut='⌘K'
                  tooltip='Open command menu'
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
                <Button
                  appearance='link'
                  href='https://vellira.dev'
                  target='_blank'
                >
                  Open docs
                </Button>
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
                  iconStart={<Search />}
                  appearance='ghost'
                />
                <Button
                  aria-label='Filter results'
                  color='neutral'
                  iconOnly
                  iconStart={<Filter />}
                  appearance='outline'
                />
                <Button
                  aria-label='Save'
                  color='primary'
                  iconOnly
                  iconStart={<Save />}
                  appearance='solid'
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
                label='Email'
                description='Shorthand API renders FormField internally.'
                placeholder='name@example.com'
                type='email'
                clearable
                clearIconTone='default'
              />
              <Input
                label='Workspace URL'
                startAddon='https://'
                endAddon='.com'
                placeholder='vellira'
                color='primary'
                variant='outline'
              />
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Color variants</h3>
              <Input
                label='Primary'
                color='primary'
                placeholder='Primary input'
              />
              <Input
                label='Neutral'
                color='neutral'
                placeholder='Neutral input'
              />
              <Input
                label='Success'
                color='success'
                variant='filled'
                defaultValue='hello@vellira.dev'
                endIcon={<Check size={14} />}
                endIconTone='success'
                type='email'
              />
              <Input
                label='Warning'
                color='warning'
                variant='soft'
                placeholder='Warning input'
              />
              <Input label='Danger' color='danger' placeholder='Danger input' />
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
                defaultValue='Components'
                clearable
                clearIconTone='default'
                placeholder='Search components'
              />

              <Input
                label='Password'
                type='password'
                revealPassword
                placeholder='Password'
              />

              <Input
                label='Verified email'
                defaultValue='hello@vellira.dev'
                endIcon={<Check size={14} />}
                endIconTone='success'
                placeholder='name@company.com'
                type='email'
              />

              <Input
                label='Search settings'
                startIcon={<Search />}
                endIcon={<Check size={14} />}
                endIconTone='success'
                startIconTone='primary'
                defaultValue='Theme'
              />

              <Input
                label='Clearable'
                placeholder='Type something'
                defaultValue='Theme'
                clearable
                clearIconTone='default'
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
            <h3 style={subtitleStyle}>Colors</h3>
            <div style={rowStyle}>
              <Checkbox label='Primary' color='primary' defaultChecked />
              <Checkbox label='Success' color='success' defaultChecked />
              <Checkbox label='Warning' color='warning' defaultChecked />
              <Checkbox label='Danger' color='danger' defaultChecked />
            </div>
          </div>

          <div style={groupStyle}>
            <h3 style={subtitleStyle}>Label position</h3>
            <div style={{ display: 'grid', gap: 12, maxWidth: 320 }}>
              <Checkbox label='Label at end' labelPosition='end' />
              <Checkbox
                label='Label at start'
                labelPosition='start'
                defaultChecked
              />
            </div>
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

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Colors</h3>
              <div style={rowStyle}>
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
              </div>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Custom indicator</h3>
              <Radio
                value='custom-indicator'
                label='Approved'
                color='success'
                defaultChecked
                icon={<Check />}
              />
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
              color='success'
              defaultValue='standard'
            >
              <Radio value='standard' label='Standard' />
              <Radio value='express' label='Express' />
              <Radio value='pickup' label='Pickup' disabled />
            </RadioGroup>

            <RadioGroup
              name='overview-status'
              label='Status'
              description='Group color is inherited by child radios.'
              color='danger'
              defaultValue='blocked'
            >
              <Radio value='blocked' label='Blocked' />
              <Radio value='active' label='Active' color='success' />
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
                icon={<More />}
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
              <Button color='neutral' appearance='solid'>
                Hover me
              </Button>
            </Tooltip>
            <Tooltip content='Icon buttons also expose tooltip content.'>
              <Button
                color='neutral'
                appearance='solid'
                aria-label='Open filters'
                iconStart={<Filter />}
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
                color='neutral'
                appearance='solid'
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                color='primary'
                appearance='solid'
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
