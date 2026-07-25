import { forwardRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Check,
  Download,
  Filter,
  MoreHorizontal,
  MoreVertical,
  Save,
  Search,
  Settings,
} from '@vellira-ui/icons';
import { animatedIcons } from '@vellira-ui/icons/lottie';
import type {
  ComponentProps,
  ComponentRef,
  CSSProperties,
  ReactNode,
} from 'react';

import { AnimatedIconPreview } from '../../../icons/src/storybook/AnimatedIconPreview';
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
import { Portal } from '../primitives/Portal';
import { Radio } from '../primitives/Radio';

const noop = () => undefined;

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

const groupedSelectOptions = {
  core: [
    { label: 'Product', value: 'product' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Design', value: 'design' },
    { label: 'Research', value: 'research' },
    { label: 'Data', value: 'data' },
  ],
  operations: [
    { label: 'Support', value: 'support' },
    { label: 'Success', value: 'success' },
    { label: 'Sales', value: 'sales' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Finance', value: 'finance' },
  ],
  platform: [
    { label: 'Infrastructure', value: 'infrastructure' },
    { label: 'Security', value: 'security' },
    { label: 'Developer Experience', value: 'devex' },
    { label: 'QA', value: 'qa' },
  ],
};

function renderSelectItems() {
  return (
    <>
      {selectOptions.map((option) => (
        <Select.Item key={option.value} value={option.value}>
          {option.label}
        </Select.Item>
      ))}
    </>
  );
}

function renderGroupedSelectItems() {
  return (
    <>
      <Select.Group label='Core teams' selectable selectLabel='All core teams'>
        <Select.Item value='product'>
          <Select.ItemIcon>
            <Check size={14} />
          </Select.ItemIcon>
          Product
          <Select.ItemDescription>Roadmap and delivery</Select.ItemDescription>
        </Select.Item>
        <Select.Item value='engineering'>
          Engineering
          <Select.ItemDescription>Platform and quality</Select.ItemDescription>
        </Select.Item>
      </Select.Group>
      <Select.Separator />
      <Select.Group label='Support' selectable selectLabel='All support'>
        <Select.Item value='support' badge='NEW'>
          Support
          <Select.ItemDescription>Customer operations</Select.ItemDescription>
        </Select.Item>
      </Select.Group>
    </>
  );
}

function renderLargeGroupedSelectItems() {
  return (
    <>
      <Select.Group label='Core teams' selectable selectLabel='All core teams'>
        {groupedSelectOptions.core.map((option) => (
          <Select.Item key={option.value} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Group>
      <Select.Separator />
      <Select.Group label='Operations' selectable>
        {groupedSelectOptions.operations.map((option) => (
          <Select.Item key={option.value} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Group>
      <Select.Separator />
      <Select.Group label='Platform' selectable>
        {groupedSelectOptions.platform.map((option) => (
          <Select.Item key={option.value} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Group>
    </>
  );
}

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
    onBlur,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseUp,
    size,
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

  return (
    <Button
      {...props}
      ref={ref}
      aria-label='More report actions'
      appearance='ghost'
      color={color ?? 'neutral'}
      iconOnly
      iconStart={
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
      }
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

function OverviewIconOnlyDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown placement='bottom-end' open={open} onOpenChange={setOpen}>
      <Dropdown.Trigger asChild>
        <MoreActionsIconButton isOpen={open} />
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item icon={<Settings />} onSelect={noop}>
          Settings
        </Dropdown.Item>
        <Dropdown.Item icon={<Download />} onSelect={noop}>
          Export
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
}

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
      <div style={groupStyle}>
        <h3 style={subtitleStyle}>Basic</h3>
        <FormField
          label='Workspace'
          description='BindControl connects id, aria, required, disabled and invalid state.'
          required
          bindControl
        >
          <Input placeholder='vellira-design' />
        </FormField>

        <FormField
          label='Display name'
          optionalText='Optional'
          description='Optional text is handled by FormField.'
          bindControl
        >
          <Input placeholder='Alex Taylor' />
        </FormField>
      </div>

      <div style={groupStyle}>
        <h3 style={subtitleStyle}>Sizes</h3>
        <FormField label='Small' size='sm' bindControl>
          <Input placeholder='Small field' />
        </FormField>
        <FormField label='Medium' size='md' bindControl>
          <Input placeholder='Medium field' />
        </FormField>
        <FormField label='Large' size='lg' bindControl>
          <Input placeholder='Large field' />
        </FormField>
      </div>

      <div style={groupStyle}>
        <h3 style={subtitleStyle}>Layout</h3>
        <FormField
          label='Horizontal'
          description='Horizontal fields keep metadata beside the control.'
          orientation='horizontal'
          bindControl
        >
          <Input placeholder='horizontal-field' />
        </FormField>

        <FormField
          label='Start label'
          description='Label position can be used for dense settings rows.'
          labelPosition='start'
          bindControl
        >
          <Input placeholder='start-label' />
        </FormField>
      </div>

      <div style={groupStyle}>
        <h3 style={subtitleStyle}>States</h3>
        <FormField
          label='Slug'
          description='Error text is merged into aria-describedby.'
          error='Only lowercase letters, numbers, and hyphens are allowed.'
          bindControl
        >
          <Input placeholder='Launch Plan' />
        </FormField>

        <FormField
          label='Organization'
          description='Locked by workspace policy.'
          disabled
          bindControl
        >
          <Input placeholder='Vellira' />
        </FormField>
      </div>

      <div style={groupStyle}>
        <h3 style={subtitleStyle}>Custom content</h3>
        <FormField
          label='Invoice email'
          optionalText='Optional'
          description={
            <span>Used for receipts, invoices, and billing updates.</span>
          }
          error={
            <span>
              Use a shared workspace inbox instead of a personal email address.
            </span>
          }
          bindControl
        >
          <Input placeholder='billing@company.com' />
        </FormField>
      </div>
    </div>
  );
}

function WebComponentsOverview() {
  const [accepted, setAccepted] = useState(true);
  const [plan, setPlan] = useState('pro');
  const [team, setTeam] = useState('engineering');
  const [teams, setTeams] = useState<string[]>(['product']);
  const [manyTeams, setManyTeams] = useState<string[]>([
    'product',
    'engineering',
    'design',
    'research',
    'data',
    'support',
    'success',
    'sales',
    'marketing',
    'finance',
    'infrastructure',
  ]);
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
                <Button
                  appearance='soft'
                  iconStart={<AnimatedIconPreview data={animatedIcons.Bell} />}
                >
                  Animated
                </Button>
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
          <div style={stackStyle}>
            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Basic</h3>
              <Checkbox
                label='Receive product updates'
                description='Get release notes and billing notifications.'
                checked={accepted}
                onCheckedChange={setAccepted}
              />
              <Checkbox
                label='Accept terms'
                description='Required to create a workspace.'
                required
              />
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Color variants</h3>
              <div style={rowStyle}>
                <Checkbox label='Primary' color='primary' defaultChecked />
                <Checkbox label='Neutral' color='neutral' defaultChecked />
                <Checkbox label='Success' color='success' defaultChecked />
                <Checkbox label='Warning' color='warning' defaultChecked />
                <Checkbox label='Danger' color='danger' defaultChecked />
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
              <Checkbox aria-label='Enable notifications' />
            </div>
          </div>
        </Section>

        <Section title='Radio'>
          <div style={stackStyle}>
            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Basic</h3>
              <Radio
                name='overview-radio-basic'
                value='email'
                label='Email'
                description='Send notifications by email.'
                defaultChecked
              />
              <Radio
                name='overview-radio-basic'
                value='sms'
                label='SMS'
                description='Use SMS for urgent notifications.'
              />
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Color variants</h3>
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
              <h3 style={subtitleStyle}>Sizes</h3>
              <div style={rowStyle}>
                <Radio value='small' label='Small' size='sm' />
                <Radio value='medium' label='Medium' size='md' />
                <Radio value='large' label='Large' size='lg' />
              </div>
            </div>

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
            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Basic</h3>
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
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Color variants</h3>
              <RadioGroup
                name='overview-group-primary'
                label='Primary'
                color='primary'
                defaultValue='starter'
              >
                <Radio value='starter' label='Starter' />
                <Radio value='pro' label='Pro' />
              </RadioGroup>
              <RadioGroup
                name='overview-group-success'
                label='Success'
                color='success'
                defaultValue='standard'
              >
                <Radio value='standard' label='Standard' />
                <Radio value='express' label='Express' />
              </RadioGroup>
              <RadioGroup
                name='overview-status'
                label='Danger with override'
                description='Group color is inherited by child radios unless an item overrides it.'
                color='danger'
                defaultValue='blocked'
              >
                <Radio value='blocked' label='Blocked' />
                <Radio value='active' label='Active' color='success' />
              </RadioGroup>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Sizes</h3>
              <RadioGroup
                name='overview-group-small'
                label='Small'
                size='sm'
                defaultValue='starter'
              >
                <Radio value='starter' label='Starter' />
                <Radio value='pro' label='Pro' />
              </RadioGroup>
              <RadioGroup
                name='overview-group-medium'
                label='Medium'
                size='md'
                defaultValue='starter'
              >
                <Radio value='starter' label='Starter' />
                <Radio value='pro' label='Pro' />
              </RadioGroup>
              <RadioGroup
                name='overview-group-large'
                label='Large'
                size='lg'
                defaultValue='starter'
              >
                <Radio value='starter' label='Starter' />
                <Radio value='pro' label='Pro' />
              </RadioGroup>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Layout and states</h3>
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
                name='overview-required-plan'
                label='Required plan'
                required
                error='Choose one plan to continue.'
              >
                <Radio value='starter' label='Starter' />
                <Radio value='pro' label='Pro' />
              </RadioGroup>
              <RadioGroup
                name='overview-disabled-plan'
                label='Disabled plan'
                disabled
                defaultValue='pro'
              >
                <Radio value='starter' label='Starter' />
                <Radio value='pro' label='Pro' />
              </RadioGroup>
            </div>
          </div>
        </Section>

        <Section title='Select'>
          <div style={stackStyle}>
            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Basic</h3>
              <Select
                label='Team'
                description='Shorthand API renders FormField internally.'
                value={team}
                onValueChange={setTeam}
                placeholder='Select a team'
              >
                {renderSelectItems()}
              </Select>
              <Select
                aria-label='Billing team'
                placeholder='Billing team'
                description='Accessible name comes from aria-label when the visible label is omitted.'
                defaultValue='product'
              >
                {renderSelectItems()}
              </Select>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Color variants</h3>
              <Select label='Primary' color='primary' placeholder='Primary'>
                {renderSelectItems()}
              </Select>
              <Select label='Neutral' color='neutral' placeholder='Neutral'>
                {renderSelectItems()}
              </Select>
              <Select
                label='Success'
                color='success'
                variant='filled'
                defaultValue='product'
              >
                {renderSelectItems()}
              </Select>
              <Select label='Warning' color='warning' variant='soft'>
                {renderSelectItems()}
              </Select>
              <Select label='Danger' color='danger' error='Team is required'>
                {renderSelectItems()}
              </Select>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Sizes</h3>
              <Select label='Small' size='sm' placeholder='Small select'>
                {renderSelectItems()}
              </Select>
              <Select label='Medium' size='md' placeholder='Medium select'>
                {renderSelectItems()}
              </Select>
              <Select label='Large' size='lg' placeholder='Large select'>
                {renderSelectItems()}
              </Select>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Search and multiple</h3>
              <Select
                label='Searchable'
                placeholder='Search teams'
                searchable
                clearable
              >
                {renderSelectItems()}
              </Select>
              <Select
                label='Teams'
                description='Multiple selection with a maximum of two teams.'
                value={teams}
                onValueChange={setTeams}
                multiple
                maxSelected={2}
                closeOnSelect={false}
                placeholder='Select teams'
                color='primary'
              >
                {renderGroupedSelectItems()}
              </Select>
              <Select
                label='Large team access'
                description='More than 10 selected values with selectable groups.'
                value={manyTeams}
                onValueChange={setManyTeams}
                multiple
                maxSelected={12}
                closeOnSelect={false}
                searchable
                clearable
                placeholder='Select teams'
              >
                {renderLargeGroupedSelectItems()}
              </Select>
              <Select
                label='Grouped teams'
                placeholder='Choose from groups'
                defaultValue='engineering'
              >
                {renderGroupedSelectItems()}
              </Select>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>States</h3>
              <Select label='Required' required placeholder='Required select'>
                {renderSelectItems()}
              </Select>
              <Select
                label='Invalid'
                required
                error='Team is required'
                placeholder='Select a team'
              >
                {renderSelectItems()}
              </Select>
              <Select label='Disabled' disabled defaultValue='support'>
                {renderSelectItems()}
              </Select>
              <Select
                label='Loading'
                placeholder='Searching teams'
                loading
                loadingText='Searching teams...'
              >
                {renderSelectItems()}
              </Select>
              <Select
                label='Archived team'
                placeholder='No archived team'
                noOptionsText='No archived teams available'
                defaultOpen
              />
            </div>
          </div>
        </Section>

        <Section title='Dropdown'>
          <div style={stackStyle}>
            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Basic</h3>
              <div style={rowStyle}>
                <Dropdown>
                  <Dropdown.Trigger asChild>
                    <Button appearance='outline' color='neutral'>
                      Report actions
                    </Button>
                  </Dropdown.Trigger>
                  <Dropdown.Content>
                    <Dropdown.Item icon={<Settings />} onSelect={noop}>
                      Open settings
                    </Dropdown.Item>
                    <Dropdown.Item icon={<Download />} onSelect={noop}>
                      Download report
                    </Dropdown.Item>
                    <Dropdown.Item icon={<Filter />} onSelect={noop}>
                      Filter view
                    </Dropdown.Item>
                  </Dropdown.Content>
                </Dropdown>
                <OverviewIconOnlyDropdown />
              </div>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Searchable</h3>
              <Dropdown empty='No matching actions' minWidth={280}>
                <Dropdown.Trigger asChild>
                  <Button
                    appearance='outline'
                    color='neutral'
                    iconStart={<Search />}
                  >
                    Search actions
                  </Button>
                </Dropdown.Trigger>
                <Dropdown.Content>
                  <Dropdown.Search placeholder='Search report actions' />
                  <Dropdown.Item icon={<Settings />} onSelect={noop}>
                    Open settings
                  </Dropdown.Item>
                  <Dropdown.Item icon={<Download />} onSelect={noop}>
                    Download report
                  </Dropdown.Item>
                  <Dropdown.Item icon={<Filter />} onSelect={noop}>
                    Filter view
                  </Dropdown.Item>
                  <Dropdown.Item icon={<Save />} onSelect={noop}>
                    Save layout
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Groups and choices</h3>
              <Dropdown closeOnSelect={false} minWidth={260}>
                <Dropdown.Trigger asChild>
                  <Button appearance='outline' color='neutral'>
                    View options
                  </Button>
                </Dropdown.Trigger>
                <Dropdown.Content>
                  <Dropdown.Group>
                    <Dropdown.Label>Visibility</Dropdown.Label>
                    <Dropdown.CheckboxItem defaultChecked>
                      Show archived
                    </Dropdown.CheckboxItem>
                    <Dropdown.CheckboxItem>Compact rows</Dropdown.CheckboxItem>
                  </Dropdown.Group>
                  <Dropdown.Separator />
                  <Dropdown.Group>
                    <Dropdown.Label>Density</Dropdown.Label>
                    <Dropdown.RadioGroup defaultValue='comfortable'>
                      <Dropdown.RadioItem value='comfortable'>
                        Comfortable
                      </Dropdown.RadioItem>
                      <Dropdown.RadioItem value='compact'>
                        Compact
                      </Dropdown.RadioItem>
                    </Dropdown.RadioGroup>
                  </Dropdown.Group>
                </Dropdown.Content>
              </Dropdown>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>States</h3>
              <div style={rowStyle}>
                <Dropdown disabled>
                  <Dropdown.Trigger asChild>
                    <Button appearance='outline' color='neutral'>
                      Disabled actions
                    </Button>
                  </Dropdown.Trigger>
                  <Dropdown.Content>
                    <Dropdown.Item>Edit</Dropdown.Item>
                  </Dropdown.Content>
                </Dropdown>
                <Dropdown loading loadingText='Loading actions...'>
                  <Dropdown.Trigger asChild>
                    <Button appearance='outline' color='neutral'>
                      Loading actions
                    </Button>
                  </Dropdown.Trigger>
                  <Dropdown.Content />
                </Dropdown>
              </div>
            </div>
          </div>
        </Section>

        <Section title='Tabs'>
          <div style={stackStyle}>
            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Line with indicator</h3>
              <Tabs defaultValue='overview' variant='line'>
                <Tabs.List aria-label='Project sections'>
                  <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
                  <Tabs.Trigger value='usage'>Usage</Tabs.Trigger>
                  <Tabs.Trigger value='settings'>Settings</Tabs.Trigger>
                  <Tabs.Indicator />
                </Tabs.List>
                <Tabs.Content value='overview'>
                  Project summary, activity, and recent changes.
                </Tabs.Content>
                <Tabs.Content value='usage'>
                  Usage metrics, limits, and operational notes.
                </Tabs.Content>
                <Tabs.Content value='settings'>
                  Settings panel content.
                </Tabs.Content>
              </Tabs>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Rich scrollable triggers</h3>
              <Tabs defaultValue='general' variant='segmented'>
                <Tabs.List aria-label='Account settings' scrollable>
                  <Tabs.Trigger value='general' icon={<Settings />}>
                    General
                  </Tabs.Trigger>
                  <Tabs.Trigger value='members' badge='4'>
                    Members
                  </Tabs.Trigger>
                  <Tabs.Trigger value='billing' disabled>
                    Billing
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value='general'>
                  General account preferences.
                </Tabs.Content>
                <Tabs.Content value='members'>
                  Member invitations and access levels.
                </Tabs.Content>
                <Tabs.Content value='billing'>
                  Billing settings are disabled in this demo.
                </Tabs.Content>
              </Tabs>
            </div>
          </div>
        </Section>

        <Section title='Tooltip'>
          <div style={stackStyle}>
            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Triggers</h3>
              <div style={rowStyle}>
                <Tooltip placement='top' delay={250}>
                  <Tooltip.Trigger asChild>
                    <Button color='neutral' appearance='solid'>
                      Hover me
                    </Button>
                  </Tooltip.Trigger>
                  <Portal>
                    <Tooltip.Content>
                      Tooltip text is shown on hover or focus.
                      <Tooltip.Arrow />
                    </Tooltip.Content>
                  </Portal>
                </Tooltip>
                <Tooltip placement='bottom'>
                  <Tooltip.Trigger asChild>
                    <Button
                      color='neutral'
                      appearance='solid'
                      aria-label='Open filters'
                      iconStart={<Filter />}
                    />
                  </Tooltip.Trigger>
                  <Portal>
                    <Tooltip.Content>
                      Icon buttons keep their own accessible label.
                      <Tooltip.Arrow />
                    </Tooltip.Content>
                  </Portal>
                </Tooltip>
              </div>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Placement</h3>
              <div style={rowStyle}>
                {(['top', 'right', 'bottom', 'left'] as const).map(
                  (placement) => (
                    <Tooltip key={placement} placement={placement}>
                      <Tooltip.Trigger asChild>
                        <Button appearance='outline' color='neutral'>
                          {placement}
                        </Button>
                      </Tooltip.Trigger>
                      <Portal>
                        <Tooltip.Content>
                          {placement} placement
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Portal>
                    </Tooltip>
                  )
                )}
              </div>
            </div>
          </div>
        </Section>

        <Section title='Modal'>
          <div style={stackStyle}>
            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Basic</h3>
              <Modal>
                <Modal.Trigger asChild>
                  <Button>Review changes</Button>
                </Modal.Trigger>
                <Portal>
                  <Modal.Overlay />
                  <Modal.Content>
                    <Modal.Header>
                      <div>
                        <Modal.Title>Review changes</Modal.Title>
                        <Modal.Description>
                          Confirm the changes before applying them to the
                          workspace.
                        </Modal.Description>
                      </div>
                      <Modal.Close />
                    </Modal.Header>
                    <Modal.Body>
                      Confirm the changes before applying them to the workspace.
                    </Modal.Body>
                    <Modal.Footer>
                      <Modal.Close asChild>
                        <Button color='neutral' appearance='solid'>
                          Cancel
                        </Button>
                      </Modal.Close>
                      <Modal.Close asChild>
                        <Button color='primary' appearance='solid'>
                          Apply
                        </Button>
                      </Modal.Close>
                    </Modal.Footer>
                  </Modal.Content>
                </Portal>
              </Modal>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Sizes</h3>
              <div style={rowStyle}>
                {(['sm', 'md', 'lg'] as const).map((size) => (
                  <Modal key={size}>
                    <Modal.Trigger asChild>
                      <Button appearance='outline' color='neutral'>
                        {size}
                      </Button>
                    </Modal.Trigger>
                    <Portal>
                      <Modal.Overlay />
                      <Modal.Content size={size}>
                        <Modal.Header title={`Size ${size}`} showClose />
                        <Modal.Body>
                          Modal content uses token-based width for each size.
                        </Modal.Body>
                      </Modal.Content>
                    </Portal>
                  </Modal>
                ))}
              </div>
            </div>

            <div style={groupStyle}>
              <h3 style={subtitleStyle}>Behavior</h3>
              <div style={rowStyle}>
                <Modal closeOnOutsidePress={false}>
                  <Modal.Trigger asChild>
                    <Button appearance='outline' color='neutral'>
                      Explicit close
                    </Button>
                  </Modal.Trigger>
                  <Portal>
                    <Modal.Overlay />
                    <Modal.Content>
                      <Modal.Header title='Explicit close' showClose />
                      <Modal.Body>
                        Outside press is disabled for this modal.
                      </Modal.Body>
                    </Modal.Content>
                  </Portal>
                </Modal>
                <Modal role='alertdialog' closeOnOutsidePress={false}>
                  <Modal.Trigger asChild>
                    <Button color='danger'>Alert dialog</Button>
                  </Modal.Trigger>
                  <Portal>
                    <Modal.Overlay />
                    <Modal.Content>
                      <Modal.Header
                        title='Delete report?'
                        description='This action cannot be undone.'
                        showClose
                      />
                      <Modal.Body>
                        Report data will be permanently removed.
                      </Modal.Body>
                      <Modal.Footer>
                        <Modal.Close asChild>
                          <Button color='neutral' appearance='ghost'>
                            Cancel
                          </Button>
                        </Modal.Close>
                        <Modal.Close asChild>
                          <Button color='danger'>Delete</Button>
                        </Modal.Close>
                      </Modal.Footer>
                    </Modal.Content>
                  </Portal>
                </Modal>
              </div>
            </div>
          </div>
        </Section>

        <Section title='FormField'>
          <WorkspaceFormFieldDemo />
        </Section>
      </div>
    </div>
  );
}

export const Overview: Story = {};
