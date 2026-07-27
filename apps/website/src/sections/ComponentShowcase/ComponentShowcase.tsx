'use client';

import { useState } from 'react';

import {
  Bell,
  Check,
  Copy,
  Download,
  File,
  Filter,
  Save,
  Search,
  Settings,
  Share,
  Trash,
  Upload,
  Users,
} from '@vellira-ui/icons';
import {
  Button,
  Checkbox,
  Dropdown,
  FormField,
  Input,
  Modal,
  Radio,
  RadioGroup,
  Tabs,
  Tooltip,
} from '@vellira-ui/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import styles from './ComponentShowcase.module.css';

type ComponentName =
  | 'button'
  | 'dropdown'
  | 'modal'
  | 'input'
  | 'tabs'
  | 'checkbox'
  | 'radio'
  | 'tooltip';

const components: Array<{
  value: ComponentName;
  label: string;
}> = [
  { value: 'button', label: 'Button' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'modal', label: 'Modal' },
  { value: 'input', label: 'Input' },
  { value: 'tabs', label: 'Tabs' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' },
  { value: 'tooltip', label: 'Tooltip' },
];

const buttonColors = [
  'primary',
  'neutral',
  'success',
  'warning',
  'danger',
] as const;

const buttonAppearances = ['solid', 'soft', 'outline', 'ghost'] as const;

const dropdownExamples = [
  { value: 'actions', label: 'Actions' },
  { value: 'access', label: 'Access' },
  { value: 'command', label: 'Command' },
] as const;

type DropdownExample = (typeof dropdownExamples)[number]['value'];

export function ComponentShowcase() {
  const shouldReduceMotion = useReducedMotion();

  const [activeComponent, setActiveComponent] =
    useState<ComponentName>('button');
  const [inputValue, setInputValue] = useState('Vellira workspace');
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioValue, setRadioValue] = useState('pro');
  const [tabValue, setTabValue] = useState('preview');
  const [dropdownExample, setDropdownExample] =
    useState<DropdownExample>('actions');

  return (
    <section
      id='components'
      className={styles.section}
      aria-labelledby='component-showcase-title'
    >
      <div className={styles.glow} aria-hidden='true' />

      <div className={styles.container}>
        <motion.header
          className={styles.header}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <span className={styles.eyebrow}>Built for production</span>

          <h2 id='component-showcase-title' className={styles.title}>
            Real components.
            <span>Real interaction.</span>
          </h2>

          <p className={styles.description}>
            Every example below is rendered from the actual Vellira component
            library. Open it, type into it and interact with it.
          </p>
        </motion.header>

        <motion.div
          className={styles.showcase}
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 48, scale: 0.975 }
          }
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: shouldReduceMotion ? 0 : 0.08,
            duration: shouldReduceMotion ? 0.2 : 0.85,
            ease: [0.16, 1, 0.3, 1],
          }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className={styles.componentPicker}>
            {components.map((component) => (
              <button
                key={component.value}
                type='button'
                className={
                  activeComponent === component.value
                    ? styles.activeComponent
                    : styles.componentButton
                }
                onClick={() => {
                  setActiveComponent(component.value);
                }}
              >
                {component.label}
              </button>
            ))}
          </div>

          <div className={styles.stage}>
            <AnimatePresence mode='wait' initial={false}>
              <motion.div
                key={activeComponent}
                className={styles.demo}
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 16, scale: 0.985 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -10, scale: 0.99 }
                }
                transition={{
                  duration: shouldReduceMotion ? 0.15 : 0.32,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {activeComponent === 'button' && (
                  <div className={styles.buttonDemo}>
                    <div className={styles.buttonMatrix}>
                      {buttonColors.map((color) => (
                        <div key={color} className={styles.buttonRow}>
                          <span>{color}</span>

                          {buttonAppearances.map((appearance) => (
                            <Button
                              key={`${color}-${appearance}`}
                              appearance={appearance}
                              color={color}
                              size='sm'
                              className={
                                appearance === 'soft'
                                  ? styles.softButtonDemo
                                  : undefined
                              }
                            >
                              {appearance}
                            </Button>
                          ))}
                        </div>
                      ))}
                    </div>

                    <div className={styles.buttonCombos}>
                      <Button size='lg' shape='pill' iconStart={<Download />}>
                        Export
                      </Button>
                      <Button
                        appearance='soft'
                        color='neutral'
                        badge='3'
                        iconStart={<Bell />}
                      >
                        Alerts
                      </Button>
                      <Button
                        appearance='outline'
                        color='success'
                        shortcut='⌘S'
                        iconStart={<Check />}
                      >
                        Saved
                      </Button>
                      <Button shape='square' aria-label='Search'>
                        <Search aria-hidden='true' />
                      </Button>
                    </div>
                  </div>
                )}

                {activeComponent === 'dropdown' && (
                  <div className={styles.dropdownDemo}>
                    <Tabs
                      value={dropdownExample}
                      onValueChange={(value) => {
                        setDropdownExample(value as DropdownExample);
                      }}
                      variant='segmented'
                      className={styles.dropdownSwitcher}
                      aria-label='Dropdown examples'
                    >
                      <Tabs.List aria-label='Dropdown examples'>
                        {dropdownExamples.map((example) => (
                          <Tabs.Trigger
                            key={example.value}
                            value={example.value}
                          >
                            {example.label}
                          </Tabs.Trigger>
                        ))}
                        <Tabs.Indicator />
                      </Tabs.List>
                    </Tabs>

                    <div className={styles.dropdownShell}>
                      <div className={styles.dropdownToolbar}>
                        <div>
                          <span className={styles.pageEyebrow}>
                            {dropdownExample === 'actions' && 'Project menu'}
                            {dropdownExample === 'access' && 'Team access'}
                            {dropdownExample === 'command' && 'Command menu'}
                          </span>
                          <strong>
                            {dropdownExample === 'actions' &&
                              'Design system website'}
                            {dropdownExample === 'access' &&
                              'Review permissions'}
                            {dropdownExample === 'command' &&
                              'Find workspace action'}
                          </strong>
                        </div>

                        <Dropdown
                          open
                          placement='bottom-end'
                          offset={8}
                          minWidth={360}
                          maxWidth={360}
                          closeOnSelect={false}
                          portal={false}
                        >
                          <Dropdown.Trigger>
                            {dropdownExample === 'actions' && 'Actions'}
                            {dropdownExample === 'access' && 'Invite'}
                            {dropdownExample === 'command' && 'Search'}
                          </Dropdown.Trigger>

                          <Dropdown.Content
                            className={styles.dropdownContent}
                            style={{ minHeight: 248 }}
                          >
                            {dropdownExample === 'actions' && (
                              <>
                                <Dropdown.Group>
                                  <Dropdown.Label>Workspace</Dropdown.Label>

                                  <Dropdown.Item>
                                    <Dropdown.ItemIcon>
                                      <Settings />
                                    </Dropdown.ItemIcon>
                                    Settings
                                    <Dropdown.ItemDescription>
                                      Members, billing, and theme defaults
                                    </Dropdown.ItemDescription>
                                    <Dropdown.ItemShortcut>
                                      ⌘,
                                    </Dropdown.ItemShortcut>
                                  </Dropdown.Item>

                                  <Dropdown.Item>
                                    <Dropdown.ItemIcon>
                                      <Copy />
                                    </Dropdown.ItemIcon>
                                    Copy preview link
                                    <Dropdown.ItemBadge>
                                      Public
                                    </Dropdown.ItemBadge>
                                  </Dropdown.Item>
                                </Dropdown.Group>

                                <Dropdown.Separator />

                                <Dropdown.Sub>
                                  <Dropdown.SubTrigger icon={<Upload />}>
                                    Export
                                  </Dropdown.SubTrigger>
                                  <Dropdown.SubContent>
                                    <Dropdown.Item icon={<File />}>
                                      Export as PDF
                                    </Dropdown.Item>
                                    <Dropdown.Item icon={<Download />}>
                                      Download archive
                                    </Dropdown.Item>
                                  </Dropdown.SubContent>
                                </Dropdown.Sub>

                                <Dropdown.Item color='danger'>
                                  <Dropdown.ItemIcon>
                                    <Trash />
                                  </Dropdown.ItemIcon>
                                  Delete workspace
                                </Dropdown.Item>
                              </>
                            )}

                            {dropdownExample === 'access' && (
                              <>
                                <Dropdown.Group>
                                  <Dropdown.Label>Visibility</Dropdown.Label>

                                  <Dropdown.CheckboxItem defaultChecked>
                                    Notify reviewers
                                  </Dropdown.CheckboxItem>
                                  <Dropdown.CheckboxItem defaultChecked>
                                    Include changelog
                                  </Dropdown.CheckboxItem>
                                  <Dropdown.CheckboxItem>
                                    Require approval
                                  </Dropdown.CheckboxItem>
                                </Dropdown.Group>

                                <Dropdown.Separator />

                                <Dropdown.Group>
                                  <Dropdown.Label>Role</Dropdown.Label>
                                  <Dropdown.RadioGroup defaultValue='editor'>
                                    <Dropdown.RadioItem value='viewer'>
                                      Viewer
                                    </Dropdown.RadioItem>
                                    <Dropdown.RadioItem value='editor'>
                                      Editor
                                    </Dropdown.RadioItem>
                                    <Dropdown.RadioItem value='admin'>
                                      Admin
                                    </Dropdown.RadioItem>
                                  </Dropdown.RadioGroup>
                                </Dropdown.Group>
                              </>
                            )}

                            {dropdownExample === 'command' && (
                              <>
                                <Dropdown.Search placeholder='Search actions' />

                                <Dropdown.Item>
                                  <Dropdown.ItemIcon>
                                    <Filter />
                                  </Dropdown.ItemIcon>
                                  Filter components
                                  <Dropdown.ItemShortcut>
                                    F
                                  </Dropdown.ItemShortcut>
                                </Dropdown.Item>

                                <Dropdown.Item>
                                  <Dropdown.ItemIcon>
                                    <Users />
                                  </Dropdown.ItemIcon>
                                  Invite teammate
                                  <Dropdown.ItemBadge>New</Dropdown.ItemBadge>
                                </Dropdown.Item>

                                <Dropdown.Item>
                                  <Dropdown.ItemIcon>
                                    <Save />
                                  </Dropdown.ItemIcon>
                                  Save as preset
                                  <Dropdown.ItemDescription>
                                    Reuse this view in docs and Storybook
                                  </Dropdown.ItemDescription>
                                </Dropdown.Item>

                                <Dropdown.Separator />

                                <Dropdown.Item icon={<Share />}>
                                  Share current view
                                </Dropdown.Item>
                              </>
                            )}
                          </Dropdown.Content>
                        </Dropdown>
                      </div>

                      <div className={styles.dropdownPreview}>
                        <div className={styles.dropdownMetric}>
                          <span>Release</span>
                          <strong>v0.8.4</strong>
                        </div>
                        <div className={styles.dropdownMetric}>
                          <span>Reviewers</span>
                          <strong>12</strong>
                        </div>
                        <div className={styles.dropdownMetric}>
                          <span>Status</span>
                          <strong>Ready</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeComponent === 'modal' && (
                  <div className={styles.modalDemo}>
                    <div className={styles.modalGrid}>
                      <div className={styles.modalCard}>
                        <div>
                          <span className={styles.pageEyebrow}>Form</span>
                          <strong>Settings dialog</strong>
                        </div>

                        <Modal>
                          <Modal.Trigger asChild>
                            <Button size='sm' iconStart={<Settings />}>
                              Open
                            </Button>
                          </Modal.Trigger>
                          <Modal.Overlay />
                          <Modal.Content size='md' scrollBehavior='inside'>
                            <Modal.Header showClose>
                              <Modal.Title>Workspace settings</Modal.Title>
                              <Modal.Description>
                                Edit team-facing workspace details.
                              </Modal.Description>
                            </Modal.Header>
                            <Modal.Body>
                              <div className={styles.modalForm}>
                                <FormField label='Workspace name'>
                                  <Input defaultValue='Vellira workspace' />
                                </FormField>
                                <Checkbox
                                  label='Notify members'
                                  description='Send a summary after changes are saved.'
                                  defaultChecked
                                />
                              </div>
                            </Modal.Body>
                            <Modal.Footer>
                              <Modal.Close asChild>
                                <Button appearance='ghost' color='neutral'>
                                  Cancel
                                </Button>
                              </Modal.Close>
                              <Modal.Close asChild>
                                <Button>Save changes</Button>
                              </Modal.Close>
                            </Modal.Footer>
                          </Modal.Content>
                        </Modal>
                      </div>

                      <div className={styles.modalCard}>
                        <div>
                          <span className={styles.pageEyebrow}>
                            Alertdialog
                          </span>
                          <strong>Danger confirm</strong>
                        </div>

                        <Modal role='alertdialog'>
                          <Modal.Trigger asChild>
                            <Button
                              size='sm'
                              color='danger'
                              iconStart={<Trash />}
                            >
                              Delete
                            </Button>
                          </Modal.Trigger>
                          <Modal.Overlay />
                          <Modal.Content size='sm'>
                            <Modal.Header showClose>
                              <Modal.Title>Delete workspace?</Modal.Title>
                              <Modal.Description>
                                This removes all shared settings for the team.
                              </Modal.Description>
                            </Modal.Header>
                            <Modal.Footer>
                              <Modal.Close asChild>
                                <Button appearance='ghost' color='neutral'>
                                  Cancel
                                </Button>
                              </Modal.Close>
                              <Modal.Close asChild>
                                <Button color='danger'>Delete</Button>
                              </Modal.Close>
                            </Modal.Footer>
                          </Modal.Content>
                        </Modal>
                      </div>

                      <div className={styles.modalCard}>
                        <div>
                          <span className={styles.pageEyebrow}>Scrollable</span>
                          <strong>Release checklist</strong>
                        </div>

                        <Modal>
                          <Modal.Trigger asChild>
                            <Button
                              size='sm'
                              color='neutral'
                              iconStart={<File />}
                            >
                              Review
                            </Button>
                          </Modal.Trigger>
                          <Modal.Overlay />
                          <Modal.Content size='lg' scrollBehavior='inside'>
                            <Modal.Header showClose>
                              <Modal.Title>Release checklist</Modal.Title>
                              <Modal.Description>
                                Review longer content inside the modal body.
                              </Modal.Description>
                            </Modal.Header>
                            <Modal.Body>
                              <div className={styles.checklist}>
                                {[
                                  'Components pass visual review.',
                                  'Tokens are generated for every theme.',
                                  'Public API snapshots are updated.',
                                  'Docs examples use real component props.',
                                  'Smoke checks cover package entry points.',
                                  'Chromatic baseline is ready for review.',
                                ].map((item) => (
                                  <Checkbox
                                    key={item}
                                    label={item}
                                    defaultChecked
                                  />
                                ))}
                              </div>
                            </Modal.Body>
                            <Modal.Footer>
                              <Modal.Close asChild>
                                <Button>Done</Button>
                              </Modal.Close>
                            </Modal.Footer>
                          </Modal.Content>
                        </Modal>
                      </div>
                    </div>
                  </div>
                )}

                {activeComponent === 'input' && (
                  <div className={styles.inputDemo}>
                    <FormField
                      label='Workspace name'
                      description='Controlled value with clear action.'
                    >
                      <Input
                        value={inputValue}
                        onValueChange={setInputValue}
                        clearable
                        clearIconTone='default'
                      />
                    </FormField>

                    <FormField
                      label='Domain'
                      description='Segmented addons stay attached to the field.'
                    >
                      <Input
                        startAddon='https://'
                        endAddon='.com'
                        placeholder='vellira'
                      />
                    </FormField>

                    <FormField
                      label='Phone'
                      description='Mask keeps typed digits in a known format.'
                    >
                      <Input
                        type='tel'
                        mask='+33 # ## ## ## ##'
                        placeholder='+33 6 00 00 00 00'
                      />
                    </FormField>

                    <FormField
                      label='Project slug'
                      error='This slug is already used.'
                    >
                      <Input
                        defaultValue='vellira-ui'
                        prefix='@'
                        endIcon={<Check size={14} />}
                        endIconTone='success'
                      />
                    </FormField>
                  </div>
                )}

                {activeComponent === 'tabs' && (
                  <Tabs
                    value={tabValue}
                    onValueChange={setTabValue}
                    variant='segmented'
                  >
                    <Tabs.List aria-label='Component preview modes'>
                      <Tabs.Trigger value='preview'>Overview</Tabs.Trigger>
                      <Tabs.Trigger value='code'>Activity</Tabs.Trigger>
                      <Tabs.Trigger value='tokens'>Tokens</Tabs.Trigger>
                      <Tabs.Indicator />
                    </Tabs.List>

                    <Tabs.Content value='preview'>
                      <div className={styles.previewPage}>
                        <div className={styles.previewPageHeader}>
                          <div>
                            <span className={styles.pageEyebrow}>
                              Live preview
                            </span>
                            <strong>Workspace settings</strong>
                          </div>

                          <Button size='sm' iconStart={<Check />}>
                            Healthy
                          </Button>
                        </div>

                        <div className={styles.metricGrid}>
                          <div>
                            <span>Coverage</span>
                            <strong>98%</strong>
                          </div>
                          <div>
                            <span>Components</span>
                            <strong>42</strong>
                          </div>
                          <div>
                            <span>Themes</span>
                            <strong>3</strong>
                          </div>
                        </div>

                        <div className={styles.statusList}>
                          <span>React and React Native APIs aligned</span>
                          <span>Token outputs generated</span>
                          <span>Docs examples synced</span>
                        </div>
                      </div>
                    </Tabs.Content>

                    <Tabs.Content value='code'>
                      <div className={styles.activityPage}>
                        <div className={styles.activityItem}>
                          <Check />
                          <div>
                            <strong>Public API check passed</strong>
                            <span>New icon exports are registered.</span>
                          </div>
                        </div>
                        <div className={styles.activityItem}>
                          <Upload />
                          <div>
                            <strong>Storybook snapshot uploaded</strong>
                            <span>Chromatic baseline is ready.</span>
                          </div>
                        </div>
                        <div className={styles.activityItem}>
                          <File />
                          <div>
                            <strong>Docs examples generated</strong>
                            <span>API tables match component props.</span>
                          </div>
                        </div>
                      </div>
                    </Tabs.Content>

                    <Tabs.Content value='tokens'>
                      <div className={styles.tokensPage}>
                        <div className={styles.tokenRow}>
                          <span className={styles.primarySwatch} />
                          <div>
                            <strong>Primary</strong>
                            <code>--color-primary-500</code>
                          </div>
                        </div>

                        <div className={styles.tokenRow}>
                          <span className={styles.surfaceSwatch} />
                          <div>
                            <strong>Surface</strong>
                            <code>--surface-default</code>
                          </div>
                        </div>

                        <div className={styles.tokenRow}>
                          <span className={styles.borderSwatch} />
                          <div>
                            <strong>Border</strong>
                            <code>--border-muted</code>
                          </div>
                        </div>
                      </div>
                    </Tabs.Content>
                  </Tabs>
                )}

                {activeComponent === 'checkbox' && (
                  <div className={styles.checkboxDemo}>
                    <div className={styles.choiceHeader}>
                      <span className={styles.pageEyebrow}>Release gates</span>
                      <strong>Publish checklist</strong>
                    </div>

                    <Checkbox
                      wrapperClassName={styles.choiceCard}
                      label='Notify reviewers'
                      description='Send an update when the preview is ready.'
                      checked={checkboxChecked}
                      onCheckedChange={setCheckboxChecked}
                      color='primary'
                    />

                    <Checkbox
                      wrapperClassName={styles.choiceCard}
                      label='Require visual approval'
                      description='Hold release until Chromatic is reviewed.'
                      defaultChecked
                      color='success'
                    />

                    <Checkbox
                      wrapperClassName={styles.choiceCard}
                      label='Block on token drift'
                      description='Prevent publishing when generated tokens differ.'
                      indeterminate
                      color='warning'
                    />

                    <Checkbox
                      wrapperClassName={styles.choiceCard}
                      label='Legacy export path'
                      description='Disabled option remains readable.'
                      disabled
                      color='neutral'
                    />
                  </div>
                )}

                {activeComponent === 'radio' && (
                  <RadioGroup
                    label='Component release channel'
                    value={radioValue}
                    onValueChange={setRadioValue}
                    className={styles.radioDemo}
                  >
                    <Radio
                      value='starter'
                      wrapperClassName={styles.radioChoiceCard}
                      label='Canary'
                      description='Ship every merged change to an internal preview.'
                      color='warning'
                    />

                    <Radio
                      value='pro'
                      wrapperClassName={styles.radioChoiceCard}
                      label='Stable'
                      description='Publish after typecheck, smoke, and visual review.'
                      color='success'
                    />

                    <Radio
                      value='enterprise'
                      wrapperClassName={styles.radioChoiceCard}
                      label='Long-term support'
                      description='Patch only critical fixes for production apps.'
                      color='primary'
                    />
                  </RadioGroup>
                )}

                {activeComponent === 'tooltip' && (
                  <div className={styles.tooltipDemo}>
                    {(
                      [
                        ['Top', 'top', 'Useful for compact icon buttons.'],
                        ['Right', 'right', 'Good for toolbar labels.'],
                        ['Bottom', 'bottom', 'Default help below a control.'],
                        ['Left', 'left', 'Works for right-aligned actions.'],
                      ] as const
                    ).map(([label, placement, content]) => (
                      <Tooltip
                        key={placement}
                        placement={placement}
                        delay={{ open: 120, close: 80 }}
                      >
                        <Tooltip.Trigger asChild>
                          <Button appearance='outline' color='neutral'>
                            {label}
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          {content}
                          <Tooltip.Arrow />
                        </Tooltip.Content>
                      </Tooltip>
                    ))}

                    <Tooltip placement='top' interactive>
                      <Tooltip.Trigger asChild>
                        <Button iconStart={<Share />}>Share</Button>
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        Invite teammates or copy a public preview link.
                        <Tooltip.Arrow />
                      </Tooltip.Content>
                    </Tooltip>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.footer}>
            <span>Rendered from</span>
            <code>@vellira-ui/react</code>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
