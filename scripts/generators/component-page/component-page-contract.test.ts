import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

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

const buttonExamples = read('components/Button/ButtonExamples.tsx');
const buttonApi = read('components/Button/buttonApi.ts');
const componentPages = read('registry/componentPages.ts');
const checkboxMetadataFile = path.join(
  catalogRoot,
  'components',
  'Checkbox',
  'metadata.ts'
);
const checkboxUsage = read('components/Checkbox/CheckboxUsage.tsx');
const checkboxExamples = read('components/Checkbox/CheckboxExamples.tsx');
const checkboxApi = read('components/Checkbox/checkboxApi.ts');

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

assertIncludes(buttonExamples, "title: 'Icons'", 'Button icon example exists');
assertIncludes(
  buttonExamples,
  "title: 'Icon-only'",
  'Button icon-only example exists'
);
assertIncludes(
  componentPages,
  "related: ['input', 'checkbox', 'modal']",
  'Button related components are preserved'
);
assertIncludes(
  buttonApi,
  "defaultValue: '\\'primary\\''",
  'Button color default exists'
);
assertIncludes(
  buttonApi,
  "defaultValue: 'false'",
  'Button boolean defaults exist'
);

const selectUsage = read('components/Select/SelectUsage.tsx');
const selectExamples = read('components/Select/SelectExamples.tsx');
const selectAccessibility = read('components/Select/SelectAccessibility.tsx');
const selectApi = read('components/Select/selectApi.ts');

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
  Tabs: ['Tabs.List', 'Tabs.Trigger', 'Tabs.Content'],
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
  'radio',
  'checkbox',
  'select',
  'dropdown',
  'tabs',
  'modal',
  'tooltip',
  'popover',
];

for (const slug of entrySlugs) {
  const matches =
    componentPages.match(new RegExp(`\\n\\s*${slug}: \\{`, 'g')) ?? [];
  assert.equal(matches.length, 1, `${slug} has exactly one registry entry`);
}

const componentGeneratorSource = fs.readFileSync(
  path.join(generatorsRoot, 'component', 'create-component.ts'),
  'utf8'
);

assertNotIncludes(
  componentGeneratorSource,
  'component-page',
  'Component generator does not import component-page subsystem'
);

console.log('Component page contract tests passed.');
