import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const generatorsRoot = path.join(root, 'scripts', 'generators');
const catalogRoot = path.join(
  root,
  'apps',
  'website',
  'src',
  'component-catalog'
);

function read(relativePath: string) {
  return fs.readFileSync(path.join(catalogRoot, relativePath), 'utf8');
}

function assertIncludes(source: string, expected: string, message: string) {
  assert.ok(source.includes(expected), message);
}

function assertNotIncludes(source: string, expected: string, message: string) {
  assert.ok(!source.includes(expected), message);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getRegistryEntryPattern(slug: string) {
  return new RegExp(
    `\\n\\s*(?:${escapeRegExp(slug)}|${escapeRegExp(
      `'${slug}'`
    )}|${escapeRegExp(`"${slug}"`)}): \\{`,
    'g'
  );
}

const {
  formatApiTypeForDisplay,
  getApiTypePreview,
}: {
  formatApiTypeForDisplay: (type: string) => string;
  getApiTypePreview: (type: string) => string;
} = await import(
  pathToFileURL(
    path.join(
      catalogRoot,
      'shared',
      'ComponentApi',
      'formatApiTypeForDisplay.ts'
    )
  ).href
);
const {
  resetComponentDemoTransientState,
  resolveComponentDemoState,
}: {
  resetComponentDemoTransientState: (
    state: unknown,
    transientStateKeys: readonly string[]
  ) => unknown;
  resolveComponentDemoState: <T>(state: unknown, initialState: T) => T;
} = await import(
  pathToFileURL(
    path.join(
      catalogRoot,
      'shared',
      'ComponentDemoStateProvider',
      'ComponentDemoStateProvider.tsx'
    )
  ).href
);

const buttonExamples = read('components/Button/ButtonExamples.tsx');
const buttonDemo = read('components/Button/ButtonDemo.tsx');
const nativeButtonDemo = read('components/Button/NativeButtonDemo.tsx');
const buttonApi = read('components/Button/buttonApi.ts');
const componentPages = read('registry/componentPages.ts');
const dropdownDemo = read('components/Dropdown/DropdownDemo.tsx');
const nativeDropdownDemo = read('components/Dropdown/NativeDropdownDemo.tsx');
const dropdownExamples = read('components/Dropdown/DropdownExamples.tsx');
const dropdownApi = read('components/Dropdown/dropdownApi.ts');
const modalExamples = read('components/Modal/ModalExamples.tsx');
const modalAccessibility = read('components/Modal/ModalAccessibility.tsx');
const nativeModalDemo = read('components/Modal/NativeModalDemo.tsx');
const popoverExamples = read('components/Popover/PopoverExamples.tsx');
const popoverAccessibility = read(
  'components/Popover/PopoverAccessibility.tsx'
);
const checkboxMetadataFile = path.join(
  catalogRoot,
  'components',
  'Checkbox',
  'metadata.ts'
);
const checkboxUsage = read('components/Checkbox/CheckboxUsage.tsx');
const checkboxExamples = read('components/Checkbox/CheckboxExamples.tsx');
const checkboxDemo = read('components/Checkbox/CheckboxDemo.tsx');
const nativeCheckboxDemo = read('components/Checkbox/NativeCheckboxDemo.tsx');
const checkboxApi = read('components/Checkbox/checkboxApi.ts');
const checkboxPlaygroundSchema = read(
  'components/Checkbox/checkboxPlaygroundSchema.ts'
);
const checkboxPlayground = read('components/Checkbox/CheckboxPlayground.tsx');
const radioGroupUsage = read('components/RadioGroup/RadioGroupUsage.tsx');
const formFieldUsage = read('components/FormField/FormFieldUsage.tsx');

assert.ok(
  !fs.existsSync(checkboxMetadataFile),
  'Checkbox proves metadata-free component generation'
);
assertIncludes(
  checkboxUsage,
  'Checkbox',
  'Metadata-free Checkbox usage is generated'
);
assertIncludes(
  checkboxExamples,
  "title: 'Basic'",
  'Metadata-free Checkbox examples are generated'
);
assertIncludes(
  checkboxApi,
  "defaultValue: 'false'",
  'Metadata-free Checkbox receives profile defaults'
);
assertIncludes(
  checkboxUsage,
  "label='Accept terms'",
  'Metadata-free Checkbox usage receives accessible label'
);
assertIncludes(
  checkboxExamples,
  "label='Accept terms'",
  'Metadata-free Checkbox examples receive accessible label'
);
assertIncludes(
  checkboxDemo,
  "label='Accept terms'",
  'Metadata-free React Checkbox demo receives accessible label'
);
assertIncludes(
  nativeCheckboxDemo,
  "label='Accept terms'",
  'Metadata-free React Native Checkbox demo receives accessible label'
);
assertIncludes(
  componentPages,
  "related: ['radio', 'select']",
  'Metadata-free Checkbox receives selection-control related components'
);
assertIncludes(
  checkboxPlayground,
  "labelPosition: 'end'",
  'Metadata-free Checkbox defaults labelPosition to end'
);
assertIncludes(
  checkboxPlaygroundSchema,
  "options: ['end', 'start']",
  'Metadata-free Checkbox orders labelPosition controls end before start'
);

assertIncludes(buttonExamples, "title: 'Icons'", 'Button icon example exists');
assertIncludes(
  buttonExamples,
  "title: 'Icon-only'",
  'Button icon-only example exists'
);
assertIncludes(
  buttonDemo,
  'iconStart={<Plus />}',
  'React Button playground demo uses a real icon for iconOnly'
);
assertIncludes(
  buttonDemo,
  "aria-label='Add item'",
  'React Button playground demo keeps iconOnly accessible'
);
assertIncludes(
  nativeButtonDemo,
  'iconStart={<Plus />}',
  'React Native Button playground demo uses a real icon for iconOnly'
);
assertIncludes(
  nativeButtonDemo,
  "accessibilityLabel='Add item'",
  'React Native Button playground demo keeps iconOnly accessible'
);
assertIncludes(
  componentPages,
  "related: ['input', 'checkbox', 'modal']",
  'Button related components are preserved'
);
assertIncludes(
  buttonApi,
  `defaultValue: "'primary'"`,
  'Button color default exists'
);
assertIncludes(
  buttonApi,
  "defaultValue: 'false'",
  'Button boolean defaults exist'
);
assertIncludes(
  dropdownExamples,
  "title: 'Groups and separators'",
  'Dropdown groups and separators example exists'
);
assertIncludes(
  dropdownDemo,
  '<Dropdown.Trigger asChild>',
  'React Dropdown demo uses canonical trigger composition'
);
assertIncludes(
  dropdownDemo,
  '<ReactButton',
  'React Dropdown demo trigger is a public Button'
);
assertIncludes(
  dropdownDemo,
  "appearance='outline'",
  'React Dropdown demo trigger uses the canonical Button appearance'
);
assertIncludes(
  dropdownDemo,
  'size={value.size}',
  'React Dropdown demo binds playground size into the nested trigger Button'
);
assertNotIncludes(
  dropdownDemo,
  '<Dropdown.Trigger>Actions</Dropdown.Trigger>',
  'React Dropdown demo does not use a raw text trigger'
);
assertIncludes(
  nativeDropdownDemo,
  '<Dropdown.Trigger asChild>',
  'React Native Dropdown demo uses canonical asChild trigger composition'
);
assertIncludes(
  nativeDropdownDemo,
  'size={value.size}',
  'React Native Dropdown demo binds playground size into the nested trigger Button'
);
assertIncludes(
  dropdownExamples,
  "title: 'Item adornments'",
  'Dropdown item adornments example exists'
);
assertIncludes(
  dropdownExamples,
  "title: 'Selectable items'",
  'Dropdown selectable items example exists'
);
assertIncludes(
  dropdownExamples,
  "title: 'Submenu'",
  'Dropdown submenu example exists'
);
assertIncludes(
  dropdownApi,
  "name: 'Dropdown.CheckboxItem'",
  'Dropdown.CheckboxItem API section exists'
);
assertIncludes(
  dropdownApi,
  "name: 'Dropdown.SubTrigger'",
  'Dropdown.SubTrigger API section exists'
);
assertIncludes(
  modalExamples,
  "title: 'Fade animation'",
  'Modal animation example exists'
);
assertIncludes(
  modalExamples,
  "title: 'Large scrollable content'",
  'Modal scrollable content example exists'
);
assertIncludes(
  modalExamples,
  "title: 'Alert dialog'",
  'Modal alert dialog example exists'
);
assertIncludes(
  nativeModalDemo,
  '<Modal.Trigger asChild>',
  'React Native Modal demo uses asChild trigger composition'
);
assertIncludes(
  modalExamples,
  '<NativeModal.Trigger asChild>',
  'React Native Modal examples use asChild trigger composition'
);
assertIncludes(
  modalExamples,
  '<NativeModal.Overlay>',
  'React Native Modal examples use overlay-wrapped content composition'
);
assertNotIncludes(
  nativeModalDemo,
  '<Modal.Trigger>\n      <NativeButton>Open modal</NativeButton>\n    </Modal.Trigger>',
  'React Native Modal demo does not nest a native Button inside a default trigger'
);
assertIncludes(
  modalAccessibility,
  "props: ['role']",
  'Modal alert dialog accessibility guidance exists'
);
assertIncludes(
  popoverExamples,
  "title: 'Arrow and close action'",
  'Popover arrow and close example exists'
);
assertIncludes(
  popoverExamples,
  "title: 'Separate anchor'",
  'Popover separate anchor example exists'
);
assertIncludes(
  popoverExamples,
  "title: 'Open change handler'",
  'Popover open change handler example exists without forced-open preview'
);
assertIncludes(
  popoverAccessibility,
  'Explicit close controls',
  'Popover close accessibility guidance exists'
);
assertIncludes(
  radioGroupUsage,
  "<RadioGroup.Item value='fr' label='France'",
  'RadioGroup standalone page includes compound item children'
);
assertIncludes(
  formFieldUsage,
  "<ReactInput placeholder='name@company.com'",
  'FormField standalone page includes a composed input child'
);

const selectUsage = read('components/Select/SelectUsage.tsx');
const selectExamples = read('components/Select/SelectExamples.tsx');
const selectAccessibility = read('components/Select/SelectAccessibility.tsx');
const selectApi = read('components/Select/selectApi.ts');
const tooltipUsage = read('components/Tooltip/TooltipUsage.tsx');
const tooltipExamples = read('components/Tooltip/TooltipExamples.tsx');
const nativeTooltipDemo = read('components/Tooltip/NativeTooltipDemo.tsx');

assertIncludes(
  selectUsage,
  "<Select.Item value='react'>React</Select.Item>",
  'React Select usage contains compound children'
);
assertIncludes(
  selectUsage,
  "<Select.Item value='react' label='React' />",
  'React Native Select usage contains native item children'
);
assertIncludes(
  selectExamples,
  "title: 'Searchable'",
  'Select Searchable example exists'
);
assertIncludes(
  selectExamples,
  "title: 'Multiple'",
  'Select Multiple example exists'
);
assertIncludes(
  selectApi,
  "name: 'Select.Item'",
  'Select.Item API section exists'
);
assertIncludes(
  selectApi,
  "name: 'Select.Trigger'",
  'Select.Trigger API section exists'
);
assertIncludes(
  selectApi,
  "name: 'Select.Content'",
  'Select.Content API section exists'
);
assertNotIncludes(
  selectApi,
  'listboxId',
  'Select.Content API excludes internal listboxId'
);
assertNotIncludes(
  selectApi,
  'setDropdownRef',
  'Select.Content API excludes internal ref setter'
);
assertIncludes(
  selectAccessibility,
  "props: ['label', 'description']",
  'Select accessibility chips exist'
);
assertIncludes(
  tooltipUsage,
  '<NativeText>Press and hold</NativeText>',
  'React Native Tooltip usage wraps trigger text in a native component'
);
assertIncludes(
  tooltipExamples,
  '<NativeText>Press and hold</NativeText>',
  'React Native Tooltip examples wrap trigger text in a native component'
);
assertIncludes(
  nativeTooltipDemo,
  '<NativeText>Press and hold</NativeText>',
  'React Native Tooltip demo wraps trigger text in a native component'
);
assertNotIncludes(
  tooltipExamples,
  '<NativeTooltip.Trigger>Press for details</NativeTooltip.Trigger>',
  'React Native Tooltip examples do not use raw string trigger children'
);
assertNotIncludes(
  nativeTooltipDemo,
  '<Tooltip.Trigger>Press for details</Tooltip.Trigger>',
  'React Native Tooltip demo does not use raw string trigger children'
);
assertIncludes(
  tooltipUsage,
  '<Tooltip.Content withArrow>Helpful contextual label.</Tooltip.Content>',
  'Tooltip usage follows Storybook arrow-by-default composition'
);
assertIncludes(
  tooltipExamples,
  "title: 'Without arrow'",
  'Tooltip keeps no-arrow as an explicit exception example'
);

const radioApi = read('components/Radio/radioApi.ts');
const radioAccessibility = read('components/Radio/RadioAccessibility.tsx');
const radioOwnedApiSource = radioApi.slice(
  0,
  radioApi.indexOf('const inheritedReactRadioApi')
);

assertIncludes(
  componentPages,
  "related: ['radio-group', 'checkbox', 'select']",
  'Radio related components are preserved'
);
assertIncludes(
  radioAccessibility,
  'props:',
  'Radio accessibility prop chips exist'
);
assert.ok(
  (radioOwnedApiSource.match(/name: '/g) ?? []).length < 40,
  'Radio owned API stays sane after owned/inherited split'
);

for (const [componentName, sections] of Object.entries({
  Dropdown: ['Dropdown.Trigger', 'Dropdown.Content', 'Dropdown.Item'],
  Tabs: ['Tabs.List', 'Tabs.Trigger', 'Tabs.Indicator', 'Tabs.Content'],
  Modal: ['Modal.Trigger', 'Modal.Content', 'Modal.Close'],
  Tooltip: ['Tooltip.Trigger', 'Tooltip.Content'],
  Popover: ['Popover.Trigger', 'Popover.Content', 'Popover.Close'],
})) {
  const api = read(
    `components/${componentName}/${componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}Api.ts`
  );

  for (const section of sections) {
    assertIncludes(api, `name: '${section}'`, `${section} API section exists`);
  }

  assertNotIncludes(
    api,
    'ContextValue',
    `${componentName} internal context type is not exposed`
  );
}

const entrySlugs = [
  'button',
  'input',
  'form-field',
  'radio',
  'radio-group',
  'checkbox',
  'select',
  'dropdown',
  'tabs',
  'modal',
  'tooltip',
  'popover',
];

const generatedComponentNames = [
  'Button',
  'Input',
  'FormField',
  'Radio',
  'RadioGroup',
  'Checkbox',
  'Select',
  'Dropdown',
  'Tabs',
  'Modal',
  'Tooltip',
  'Popover',
];

for (const componentName of generatedComponentNames) {
  const componentDir = path.join(catalogRoot, 'components', componentName);
  const generatedSourceFiles = fs
    .readdirSync(componentDir)
    .filter(
      (fileName) =>
        /\.(?:ts|tsx)$/.test(fileName) &&
        fileName !== 'metadata.ts' &&
        !fileName.endsWith('Api.ts')
    );

  for (const fileName of generatedSourceFiles) {
    const source = fs.readFileSync(path.join(componentDir, fileName), 'utf8');

    assert.doesNotMatch(
      source,
      /\bcode:\s*"/,
      `${componentName}/${fileName} stores displayed code snippets without double-quoted string literals`
    );

    assert.doesNotMatch(
      source,
      /\s[A-Za-z_$][\w$:-]*="/,
      `${componentName}/${fileName} does not render ordinary JSX attributes with double quotes`
    );

    assert.doesNotMatch(
      source,
      /^\s*"[^"]*",?$/m,
      `${componentName}/${fileName} does not store ordinary generated fragments as double-quoted strings`
    );

    assert.doesNotMatch(
      source,
      /\b(?:const|let|return)\s+[A-Za-z_$][\w$]*\s*=\s*"/,
      `${componentName}/${fileName} does not emit ordinary double-quoted variable string literals`
    );

    assert.doesNotMatch(
      source,
      /`[^`]*\s[A-Za-z_$][\w$:-]*="[^"]*"[^`]*`/,
      `${componentName}/${fileName} displayed code snippets do not contain double-quoted JSX attributes`
    );
  }
}

assert.equal(
  formatApiTypeForDisplay('"sm" | "md" | "lg"'),
  "'sm' | 'md' | 'lg'",
  'API type display normalizes string-literal unions to single quotes'
);
assert.equal(
  getApiTypePreview(
    '"off" | "none" | "on" | "sentence" | "words" | "characters"'
  ),
  "'off' | 'none' | 'on' | 'sentence'...",
  'API type preview truncates the formatted single-quote representation'
);
assert.equal(
  formatApiTypeForDisplay('import("react").ReactNode'),
  'import("react").ReactNode',
  'API type display preserves import() type arguments'
);
assert.equal(
  formatApiTypeForDisplay('typeof import("react-native")'),
  'typeof import("react-native")',
  'API type display preserves typeof import() type arguments'
);
assert.equal(
  formatApiTypeForDisplay('"can\\\'t" | "line\\\\nbreak"'),
  "'can\\'t' | 'line\\\\nbreak'",
  'API type display preserves escaped string literal contents'
);
assert.equal(
  formatApiTypeForDisplay('{ "aria-label"?: string; value: "on" | "off" }'),
  "{ \"aria-label\"?: string; value: 'on' | 'off' }",
  'API type display preserves quoted property names while formatting literal values'
);

for (const componentName of [
  'Button',
  'Input',
  'Select',
  'Dropdown',
  'Modal',
]) {
  const initialState = {
    size: 'md',
    color: 'primary',
    variant: 'outline',
    disabled: false,
    loading: false,
    invalid: false,
    clearable: false,
    searchable: false,
    open: false,
  };
  const configuredState = {
    size: 'lg',
    color: 'danger',
    variant: 'filled',
    disabled: true,
    loading: true,
    invalid: true,
    clearable: true,
    searchable: true,
    open: true,
  };
  const resetState = resetComponentDemoTransientState(configuredState, [
    'open',
    'defaultOpen',
    'expanded',
    'defaultExpanded',
  ]);
  const resolvedState = resolveComponentDemoState(resetState, initialState);

  assert.deepEqual(
    resolvedState,
    {
      size: 'lg',
      color: 'danger',
      variant: 'filled',
      disabled: true,
      loading: true,
      invalid: true,
      clearable: true,
      searchable: true,
      open: false,
    },
    `${componentName} platform switch preserves playground options while resetting runtime open state`
  );
}

for (const slug of entrySlugs) {
  const matches = componentPages.match(getRegistryEntryPattern(slug)) ?? [];
  assert.equal(matches.length, 1, `${slug} has exactly one registry entry`);
}

const componentGeneratorSource = fs.readFileSync(
  path.join(generatorsRoot, 'component', 'create-component.ts'),
  'utf8'
);
const platformViewSource = fs.readFileSync(
  path.join(
    catalogRoot,
    'shared',
    'ComponentPlatformView',
    'ComponentPlatformView.tsx'
  ),
  'utf8'
);

assertIncludes(
  platformViewSource,
  'resetKey={`${component.slug}:${platform}`}',
  'Component platform switch resets transient runtime state without remounting shared playground state'
);
assertNotIncludes(
  platformViewSource,
  '<ComponentDemoStateProvider key=',
  'Component platform switch does not key the shared playground state provider'
);
assertIncludes(
  platformViewSource,
  'key={`${component.slug}:${platform}:demo`}',
  'Component platform switch remounts the demo runtime subtree by platform'
);
assertIncludes(
  platformViewSource,
  'key={`${component.slug}:${platform}:examples`}',
  'Component platform switch remounts the examples runtime subtree by platform'
);

assertNotIncludes(
  componentGeneratorSource,
  'component-page',
  'Component generator does not import component-page subsystem'
);

console.log('Component page contract tests passed.');
