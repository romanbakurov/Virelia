import fs from 'node:fs';
import path from 'node:path';

import prettier from 'prettier';
import ts from 'typescript';

type ApiSection = {
  docPath: string;
  heading: string;
  id: string;
  sourceFile: string;
  interfaceName: string;
};

type PropRow = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

const rootDir = process.cwd();
const shouldCheck = process.argv.includes('--check');

const fallbackDescriptions: Record<string, string> = {
  accessibilityLabel: 'Accessible label for screen readers.',
  activeIndex: 'Currently active tab index.',
  arrowIcon: 'Custom arrow icon rendered in the trigger.',
  bubbleStyle: 'Extra tooltip bubble style.',
  contentStyle: 'Extra content style.',
  error: 'Error message rendered for invalid state.',
  fullWidth: 'Makes the component fill its container width.',
  icon: 'Icon rendered inside the component.',
  iconSize: 'Icon size in pixels.',
  inputStyle: 'Extra style for the input element.',
  itemStyle: 'Extra item style.',
  labelStyle: 'Extra label text style.',
  leftIcon: 'Icon rendered before content.',
  onChange: 'Called when the value changes.',
  onClick: 'Click handler.',
  onKeyDown: 'Keyboard handler.',
  optionStyle: 'Extra option style.',
  overlayStyle: 'Extra overlay style.',
  rightIcon: 'Icon rendered after content.',
  showArrow: 'Controls whether the trigger arrow is rendered.',
  style: 'Extra root style.',
  textStyle: 'Extra text style.',
  testID: 'Test identifier forwarded to the native root element.',
  triggerStyle: 'Extra trigger style.',
  children: 'Content rendered inside the component.',
  theme: 'Controlled theme value.',
  defaultTheme: 'Initial theme for uncontrolled usage.',
  onThemeChange: 'Called whenever the active theme changes.',
  className: 'Extra CSS class for the root element.',
  description: 'Additional descriptive text.',
  disabled: 'Disables interaction.',
  required: 'Marks the field as required.',
  placeholder: 'Placeholder text.',
};

const sections: ApiSection[] = [
  section('web', '## Button', 'ButtonProps', 'src/primitives/Button/types.ts'),
  section(
    'web',
    '## Checkbox',
    'CheckboxProps',
    'src/primitives/Checkbox/types.ts'
  ),
  section('web', '## Input', 'InputProps', 'src/primitives/Input/types.ts'),
  section(
    'web',
    '## FormField',
    'FormFieldProps',
    'src/patterns/FormField/types.ts'
  ),
  section(
    'web',
    '### RadioGroup Props',
    'RadioGroupProps',
    'src/components/RadioGroup/types.ts'
  ),
  section(
    'web',
    '### RadioOption',
    'RadioOption',
    'src/components/RadioGroup/types.ts'
  ),
  section(
    'web',
    '### Select Props',
    'SelectProps',
    'src/components/Select/types.ts'
  ),
  section(
    'web',
    '### SelectOption',
    'SelectOption',
    'src/components/Select/types.ts'
  ),
  section(
    'web',
    '### Dropdown Props',
    'DropdownProps',
    'src/components/Dropdown/types.ts'
  ),
  section('web', '### Tabs Props', 'TabsProps', 'src/components/Tabs/types.ts'),
  section(
    'web',
    '### Tabs.List Props',
    'TabsListProps',
    'src/components/Tabs/List/types.ts'
  ),
  section(
    'web',
    '### Tabs.Tab Props',
    'TabProps',
    'src/components/Tabs/Tab/types.tsx'
  ),
  section(
    'web',
    '### Tabs.Panel Props',
    'TabsPanelProps',
    'src/components/Tabs/Panel/types.ts'
  ),
  section(
    'web',
    '## Tooltip',
    'TooltipProps',
    'src/components/Tooltip/types.ts'
  ),
  section(
    'web',
    '### Modal Props',
    'ModalProps',
    'src/components/Modal/types.ts'
  ),
  section(
    'web',
    '### ThemeProvider Props',
    'ThemeProviderProps',
    'src/theme/types.ts'
  ),
  section(
    'native',
    '## Button',
    'ButtonProps',
    'src/primitives/Button/types.ts'
  ),
  section(
    'native',
    '## Checkbox',
    'CheckboxProps',
    'src/primitives/Checkbox/types.ts'
  ),
  section('native', '## Input', 'InputProps', 'src/primitives/Input/types.ts'),
  section(
    'native',
    '## FormField',
    'FormFieldProps',
    'src/patterns/FormField/types.ts'
  ),
  section(
    'native',
    '### RadioGroup Props',
    'RadioGroupProps',
    'src/components/RadioGroup/types.ts'
  ),
  section(
    'native',
    '### RadioOption',
    'RadioOption',
    'src/components/RadioGroup/types.ts'
  ),
  section(
    'native',
    '### Select Props',
    'SelectProps',
    'src/components/Select/types.ts'
  ),
  section(
    'native',
    '### SelectOption',
    'SelectOption',
    'src/components/Select/types.ts'
  ),
  section(
    'native',
    '### Dropdown Props',
    'DropdownProps',
    'src/components/Dropdown/types.ts'
  ),
  section(
    'native',
    '### Tabs Props',
    'TabsProps',
    'src/components/Tabs/types.ts'
  ),
  section(
    'native',
    '### Tabs.List Props',
    'TabsListProps',
    'src/components/Tabs/List/types.ts'
  ),
  section(
    'native',
    '### Tabs.Tab Props',
    'TabProps',
    'src/components/Tabs/Tab/types.ts'
  ),
  section(
    'native',
    '### Tabs.Panel Props',
    'TabsPanelProps',
    'src/components/Tabs/Panel/types.ts'
  ),
  section(
    'native',
    '## Tooltip',
    'TooltipProps',
    'src/components/Tooltip/types.ts'
  ),
  section(
    'native',
    '### Modal Props',
    'ModalProps',
    'src/components/Modal/types.ts'
  ),
  section(
    'native',
    '### ThemeProvider Props',
    'ThemeProviderProps',
    'src/theme/types.ts'
  ),
];

const sourceFiles = Array.from(
  new Set(sections.map((item) => item.sourceFile))
).map((sourceFile) => path.join(rootDir, sourceFile));

const program = ts.createProgram(sourceFiles, {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  skipLibCheck: true,
  strict: true,
  esModuleInterop: true,
  allowSyntheticDefaultImports: true,
});

const checker = program.getTypeChecker();
const docs = new Map<string, string>();
const sourceFileByName = new Map(
  program
    .getSourceFiles()
    .map((sourceFile) => [normalizePath(sourceFile.fileName), sourceFile])
);

for (const item of sections) {
  const docPath = path.join(rootDir, item.docPath);
  const currentDoc = docs.get(item.docPath) ?? fs.readFileSync(docPath, 'utf8');
  const descriptions = readExistingDescriptions(currentDoc, item);
  const rows = sortRows(
    readInterfaceRows(item).map((row) => ({
      ...row,
      description: getDescription(row.name, descriptions),
    })),
    descriptions
  );

  docs.set(
    item.docPath,
    replaceGeneratedTable(currentDoc, item, renderPropsTable(rows))
  );
}

let hasChanges = false;

for (const [relativePath, generatedContent] of docs) {
  const docPath = path.join(rootDir, relativePath);
  const currentContent = fs.readFileSync(docPath, 'utf8');
  const prettierConfig = await prettier.resolveConfig(docPath);
  const nextContent = await prettier.format(generatedContent, {
    ...prettierConfig,
    filepath: docPath,
    parser: 'markdown',
  });

  if (currentContent !== nextContent) {
    hasChanges = true;

    if (!shouldCheck) {
      fs.writeFileSync(docPath, nextContent);
      console.log(`Updated ${relativePath}`);
    }
  }
}

if (shouldCheck && hasChanges) {
  console.error('API docs are out of date. Run `pnpm docs:api`.');
  process.exit(1);
}

if (!hasChanges) {
  console.log('API docs are up to date.');
}

function section(
  packageName: 'web' | 'native',
  heading: string,
  interfaceName: string,
  sourceFile: string
): ApiSection {
  const packageDir = `packages/vellira-${packageName}`;

  return {
    docPath: `${packageDir}/API.md`,
    heading,
    id: `${packageName}.${interfaceName}.${heading.replace(/[#.\s]/g, '')}`,
    sourceFile: `${packageDir}/${sourceFile}`,
    interfaceName,
  };
}

function getDescription(propName: string, descriptions: Map<string, string>) {
  const existing = descriptions.get(propName);

  if (existing && existing !== '—') {
    return existing;
  }

  return fallbackDescriptions[propName] ?? '—';
}

function readInterfaceRows(item: ApiSection): PropRow[] {
  const sourceFile = sourceFileByName.get(
    normalizePath(path.join(rootDir, item.sourceFile))
  );

  if (!sourceFile) {
    throw new Error(`Cannot find source file for ${item.sourceFile}`);
  }

  const declaration = findTypeDeclaration(sourceFile, item.interfaceName);

  if (!declaration) {
    throw new Error(
      `Cannot find interface or type alias ${item.interfaceName} in ${item.sourceFile}`
    );
  }

  const type = checker.getTypeAtLocation(declaration.name);

  return checker
    .getPropertiesOfType(type)
    .filter((property) => {
      const declaration =
        property.valueDeclaration ?? property.declarations?.[0];

      return declaration ? isDocumentedPropDeclaration(declaration) : false;
    })
    .map((property) => {
      const declaration =
        property.valueDeclaration ?? property.declarations?.[0];

      if (!declaration) {
        throw new Error(`Cannot resolve declaration for ${property.name}`);
      }

      const propertyType = checker.getTypeOfSymbolAtLocation(
        property,
        declaration
      );
      const optional = (property.flags & ts.SymbolFlags.Optional) !== 0;

      return {
        name: property.name,
        type: formatType(propertyType, declaration, optional),
        required: !optional,
        description: '',
      };
    });
}

function findTypeDeclaration(sourceFile: ts.SourceFile, interfaceName: string) {
  let result: ts.InterfaceDeclaration | ts.TypeAliasDeclaration | undefined;

  const visit = (node: ts.Node) => {
    if (
      (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
      node.name.text === interfaceName
    ) {
      result = node;
      return;
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return result;
}

function formatType(
  type: ts.Type,
  declaration: ts.Declaration,
  optional: boolean
) {
  const formatted = checker.typeToString(
    type,
    declaration,
    ts.TypeFormatFlags.NoTruncation |
      ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType
  );

  return normalizeType(optional ? removeUndefined(formatted) : formatted);
}

function removeUndefined(type: string) {
  return type.replace(/ \| undefined/g, '').replace(/undefined \| /g, '');
}

function isDocumentedPropDeclaration(declaration: ts.Declaration) {
  const fileName = normalizePath(declaration.getSourceFile().fileName);

  return (
    fileName.includes('/packages/vellira-web/') ||
    fileName.includes('/packages/vellira-native/') ||
    fileName.includes('/packages/vellira-types/') ||
    fileName.includes('/node_modules/@romanbakurov/vellira-types/')
  );
}

function sortRows(rows: PropRow[], descriptions: Map<string, string>) {
  const existingOrder = new Map(
    Array.from(descriptions.keys()).map((name, index) => [name, index])
  );

  return rows.toSorted((a, b) => {
    const aIndex = existingOrder.get(a.name) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = existingOrder.get(b.name) ?? Number.MAX_SAFE_INTEGER;

    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }

    return rows.indexOf(a) - rows.indexOf(b);
  });
}

function normalizeType(type: string) {
  const normalized = type
    .replace(/import\(["'][^"']*\/@types\/react\/index["']\)\./g, '')
    .replace(/import\(["'][^"']*\/@types\+react@[^"']*\/index["']\)\./g, '')
    .replace(/import\("react"\)\./g, '')
    .replace(/import\("react-native"\)\./g, '')
    .replace(/import\("@romanbakurov\/vellira-types"\)\./g, '')
    .replace(/Readonly<(.+)>/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  if (
    (normalized.startsWith('((') || normalized.startsWith('(()')) &&
    normalized.endsWith(')')
  ) {
    return normalized.slice(1, -1);
  }

  return normalized;
}

function readExistingDescriptions(doc: string, item: ApiSection) {
  const descriptions = new Map<string, string>();
  const block = findTableBlock(doc, item);

  if (!block) {
    return descriptions;
  }

  const rows = block.table
    .split('\n')
    .filter((line) => line.trim().startsWith('|'))
    .slice(2);

  for (const row of rows) {
    const cells = splitMarkdownRow(row);
    const prop = cells[0]?.replace(/`/g, '').trim();
    const description = cells[3]?.trim();

    if (prop && description) {
      descriptions.set(prop, description);
    }
  }

  return descriptions;
}

function replaceGeneratedTable(doc: string, item: ApiSection, table: string) {
  const startMarker = `<!-- api-docgen:start ${item.id} -->`;
  const endMarker = `<!-- api-docgen:end ${item.id} -->`;
  const generatedBlock = `${startMarker}\n${table}\n${endMarker}`;
  const markedBlock = new RegExp(
    `${escapeRegExp(startMarker)}[\\s\\S]*?${escapeRegExp(endMarker)}`
  );

  if (markedBlock.test(doc)) {
    return doc.replace(markedBlock, generatedBlock);
  }

  const block = findTableBlock(doc, item);

  if (!block) {
    throw new Error(
      `Cannot find props table after ${item.heading} in ${item.docPath}`
    );
  }

  return `${doc.slice(0, block.start)}${generatedBlock}${doc.slice(block.end)}`;
}

function findTableBlock(doc: string, item: ApiSection) {
  const headingIndex = doc.indexOf(item.heading);

  if (headingIndex === -1) {
    throw new Error(`Cannot find heading ${item.heading} in ${item.docPath}`);
  }

  const nextHeadingIndex = findNextHeadingIndex(
    doc,
    headingIndex + item.heading.length
  );
  const searchEnd = nextHeadingIndex === -1 ? doc.length : nextHeadingIndex;
  const sectionBody = doc.slice(headingIndex, searchEnd);
  const tableMatch =
    /\n\|\s*Prop\s*\|\s*Type\s*\|\s*Required\s*\|\s*Description\s*\|\n\|[-\s|:]+\|\n(?:\|.*\|\n?)+/.exec(
      sectionBody
    );

  if (!tableMatch || tableMatch.index === undefined) {
    return undefined;
  }

  const start = headingIndex + tableMatch.index + 1;
  const table = tableMatch[0].trimEnd();

  return {
    start,
    end: start + table.length,
    table,
  };
}

function findNextHeadingIndex(doc: string, fromIndex: number) {
  const match = /\n#{1,3}\s/.exec(doc.slice(fromIndex));
  return match?.index === undefined ? -1 : fromIndex + match.index;
}

function renderPropsTable(rows: PropRow[]) {
  const header = ['Prop', 'Type', 'Required', 'Description'];
  const body = rows.map((row) => [
    `\`${row.name}\``,
    `\`${escapeTableCell(row.type)}\``,
    row.required ? 'Yes' : 'No',
    escapeTableCell(row.description),
  ]);
  const tableRows = [header, ...body];
  const widths = header.map((_, index) =>
    Math.max(...tableRows.map((row) => (row[index] ?? '').length))
  );

  const renderRow = (row: string[]) =>
    `| ${row.map((cell, index) => cell.padEnd(widths[index])).join(' | ')} |`;
  const separator = `| ${widths.map((width) => '-'.repeat(width)).join(' | ')} |`;

  return [renderRow(header), separator, ...body.map(renderRow)].join('\n');
}

function splitMarkdownRow(row: string) {
  const cells: string[] = [];
  let current = '';
  let escaped = false;

  for (const char of row.trim().slice(1, -1)) {
    if (char === '|' && !escaped) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += char;
    escaped = char === '\\' && !escaped;
  }

  cells.push(current.trim());

  return cells;
}

function escapeTableCell(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\|/g, '\\|');
}

function normalizePath(filePath: string) {
  return path.resolve(filePath).split(path.sep).join('/');
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
