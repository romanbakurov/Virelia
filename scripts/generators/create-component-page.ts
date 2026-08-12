import fs from 'node:fs';
import path from 'node:path';

import ts from 'typescript';

type Platform = 'react' | 'react-native';

const [, , componentName, ...args] = process.argv;

const force = args.includes('--force');

if (!componentName) {
  console.error('Usage: pnpm create:component-page ComponentName [--force]');
  process.exit(1);
}

const root = process.cwd();

const slug = componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

type ComponentGeneratorConfig = {
  react?: {
    demoProps?: string;
    children?: string;
  };
  native?: {
    demoProps?: string;
    children?: string;
    responsivePresentation?: boolean;
  };
  demo?: {
    label?: string;
    description?: string;
    excludeControls?: readonly string[];
    initialValues?: Record<string, string | boolean | number>;
    staticProps?: Record<string, string>;
    satisfiedRequiredProps?: readonly string[];
    previewWidth?: 'auto' | 'field' | 'full';
  };
  examples?: readonly {
    title: string;
    description: string;
    props: readonly string[];
  }[];
  related?: readonly string[];
};

const componentConfigs: Record<string, ComponentGeneratorConfig> = {
  Radio: {
    react: {
      demoProps: 'value="option"',
    },
    native: {
      demoProps: 'value="option"',
    },
    demo: {
      label: 'Email notifications',
      description: 'Receive updates by email.',
      excludeControls: ['value', 'required'],
      initialValues: {
        size: 'md',
        color: 'primary',
        checked: false,
        disabled: false,
        error: '',
      },
      previewWidth: 'field',
    },
    related: ['RadioGroup', 'Checkbox', 'Select'],
  },

  Select: {
    react: {
      children: `<Select.Item value='react'>React</Select.Item>
<Select.Item value='vue'>Vue</Select.Item>
<Select.Item value='svelte'>Svelte</Select.Item>`,
    },

    native: {
      responsivePresentation: true,
      children: `<Select.Item value='react' label='React' />
<Select.Item value='vue' label='Vue' />
<Select.Item value='svelte' label='Svelte' />`,
    },

    demo: {
      label: 'Favorite framework',
      description: 'Choose one option.',
      satisfiedRequiredProps: ['options'],
      excludeControls: [
        'multiple',
        'label',
        'description',
        'required',
        'maxSelected',
        'closeOnSelect',
        'avoidCollisions',
        'modal',
        'command',
      ],
      initialValues: {
        multiple: false,
        placeholder: 'Select an option',
        size: 'md',
        color: 'primary',
        variant: 'outline',
        invalid: false,
        loading: false,
        clearable: false,
        searchable: false,
        disabled: false,
        error: '',
      },
    },
    examples: [
      {
        title: 'Basic',
        description: 'Basic component usage.',
        props: [],
      },
      {
        title: 'Searchable',
        description: 'Filter options by typing a search query.',
        props: ['searchable'],
      },
      {
        title: 'Multiple',
        description: 'Select more than one option.',
        props: ['multiple'],
      },
      {
        title: 'Error',
        description: 'Validation error state.',
        props: [`error='Please review this option.'`],
      },
    ],
  },
};

const componentConfig = componentConfigs[componentName] ?? {};

function getDemoProps(platform: Platform) {
  if (platform === 'react') {
    return componentConfig.react?.demoProps ?? '';
  }

  return componentConfig.native?.demoProps ?? '';
}

type ExtractedProp = {
  name: string;
  kind: 'boolean' | 'string' | 'number' | 'select' | 'other';
  required: boolean;
  type: string;
  description: string;
  options?: string[];
};

const typesRoot = path.join(root, 'packages', 'types', 'src');

function findTypeSourceFile(name: string) {
  const candidates = [
    path.join(typesRoot, `${name}.ts`),
    path.join(typesRoot, `${name.charAt(0).toLowerCase()}${name.slice(1)}.ts`),
  ];

  return candidates.find((filePath) => fs.existsSync(filePath));
}

function createTypesProgram() {
  const tsconfigPath = path.join(root, 'packages', 'types', 'tsconfig.json');

  const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

  if (configFile.error) {
    const message = ts.flattenDiagnosticMessageText(
      configFile.error.messageText,
      '\n'
    );

    throw new Error(`Failed to read ${tsconfigPath}: ${message}`);
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(tsconfigPath)
  );

  return ts.createProgram({
    rootNames: parsedConfig.fileNames,
    options: parsedConfig.options,
  });
}

function getLiteralUnionOptions(type: ts.Type) {
  if (!type.isUnion()) {
    return null;
  }

  const options: string[] = [];

  for (const item of type.types) {
    if (item.flags & ts.TypeFlags.Undefined) {
      continue;
    }

    if (!item.isStringLiteral()) {
      return null;
    }

    options.push(item.value);
  }

  return options.length > 0 ? options : null;
}

function extractComponentProps(name: string): ExtractedProp[] {
  const sourceFilePath = findTypeSourceFile(
    name.charAt(0).toLowerCase() + name.slice(1)
  );

  if (!sourceFilePath) {
    console.log(`⚠️ Types source not found for ${name}`);
    return [];
  }

  const program = createTypesProgram();
  const checker = program.getTypeChecker();

  const sourceFile = program.getSourceFile(sourceFilePath);

  if (!sourceFile) {
    return [];
  }

  const typeName = `Base${name}Props`;

  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);

  if (!moduleSymbol) {
    console.log(`⚠️ Module symbol not found for ${sourceFilePath}`);
    return [];
  }

  const exportedSymbol = checker
    .getExportsOfModule(moduleSymbol)
    .find((symbol) => symbol.name === typeName);

  if (!exportedSymbol) {
    console.log(`⚠️ Export ${typeName} not found.`);
    return [];
  }

  const declaredType = checker.getDeclaredTypeOfSymbol(exportedSymbol);

  const propSymbols = checker.getPropertiesOfType(declaredType);

  const extracted: ExtractedProp[] = [];

  for (const propSymbol of propSymbols) {
    const declaration =
      propSymbol.valueDeclaration ?? propSymbol.declarations?.[0];

    if (!declaration) {
      continue;
    }

    const propName = propSymbol.name;

    const required = (propSymbol.flags & ts.SymbolFlags.Optional) === 0;

    const type = checker.getTypeOfSymbolAtLocation(propSymbol, declaration);

    const typeText = checker.typeToString(
      type,
      declaration,
      ts.TypeFormatFlags.NoTruncation
    );

    const description = ts.displayPartsToString(
      propSymbol.getDocumentationComment(checker)
    );

    const unionOptions = getLiteralUnionOptions(type);

    if (unionOptions) {
      extracted.push({
        name: propName,
        kind: 'select',
        required,
        type: typeText,
        description,
        options: unionOptions,
      });

      continue;
    }

    const nonNullableType = checker.getNonNullableType(type);

    if (nonNullableType.flags & ts.TypeFlags.Boolean) {
      extracted.push({
        name: propName,
        kind: 'boolean',
        required,
        type: typeText,
        description,
      });

      continue;
    }

    if (
      nonNullableType.flags & ts.TypeFlags.String ||
      nonNullableType.flags & ts.TypeFlags.StringLiteral
    ) {
      extracted.push({
        name: propName,
        kind: 'string',
        required,
        type: typeText,
        description,
      });

      continue;
    }

    if (
      nonNullableType.flags & ts.TypeFlags.Number ||
      nonNullableType.flags & ts.TypeFlags.NumberLiteral
    ) {
      extracted.push({
        name: propName,
        kind: 'number',
        required,
        type: typeText,
        description,
      });

      continue;
    }

    extracted.push({
      name: propName,
      kind: 'other',
      required,
      type: typeText,
      description,
    });
  }

  return extracted;
}

const extractedProps = extractComponentProps(componentName);

const excludedControls = new Set(componentConfig.demo?.excludeControls ?? []);

const playgroundProps = extractedProps.filter(
  (prop) =>
    prop.kind !== 'other' &&
    !prop.name.startsWith('on') &&
    !prop.name.startsWith('default') &&
    !excludedControls.has(prop.name)
);

const requiredComplexProps = extractedProps.filter(
  (prop) => prop.required && prop.kind === 'other'
);

const satisfiedRequiredProps = new Set(
  componentConfig.demo?.satisfiedRequiredProps ?? []
);

const missingRequiredComplexProps = requiredComplexProps.filter(
  (prop) =>
    !componentConfig.demo?.staticProps?.[prop.name] &&
    !satisfiedRequiredProps.has(prop.name)
);

if (missingRequiredComplexProps.length > 0) {
  console.warn(
    `⚠️ ${componentName} requires demo values for complex props: ${missingRequiredComplexProps
      .map((prop) => prop.name)
      .join(', ')}`
  );
}

const componentTypeFile = findTypeSourceFile(
  componentName.charAt(0).toLowerCase() + componentName.slice(1)
);

const componentTypeSource = componentTypeFile
  ? fs.readFileSync(componentTypeFile, 'utf8')
  : '';

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getChangeHandlerName(propName: string) {
  const handlerName = `on${capitalize(propName)}Change`;

  return componentTypeSource.includes(handlerName) ? handlerName : null;
}

const websiteRoot = path.join(
  root,
  'apps',
  'website',
  'src',
  'features',
  'components-catalog'
);

function existsInPackage(packageName: 'react' | 'react-native') {
  const packageRoot = path.join(root, 'packages', packageName, 'src');

  const stack = [packageRoot];

  while (stack.length > 0) {
    const current = stack.pop();

    if (!current) continue;

    for (const entry of fs.readdirSync(current, {
      withFileTypes: true,
    })) {
      const fullPath = path.join(current, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === componentName) {
          return true;
        }

        stack.push(fullPath);
      }
    }
  }

  return false;
}

const platforms: Platform[] = [];

if (existsInPackage('react')) {
  platforms.push('react');
}

if (existsInPackage('react-native')) {
  platforms.push('react-native');
}

if (platforms.length === 0) {
  console.error(
    `Component "${componentName}" was not found in react or react-native packages.`
  );
  process.exit(1);
}

function writeIfMissing(filePath: string, content: string) {
  const exists = fs.existsSync(filePath);

  if (exists && !force) {
    console.log(`⏭ Skipped existing: ${path.relative(root, filePath)}`);
    return;
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);

  console.log(
    `${exists ? '♻️ Updated' : '✅ Created'}: ${path.relative(root, filePath)}`
  );
}

const usageDir = path.join(websiteRoot, 'demos', `${componentName}Usage`);

const usageFile = path.join(usageDir, `${componentName}Usage.tsx`);

const usageIndexFile = path.join(usageDir, 'index.ts');

const usageStaticProps = [
  getDemoProps('react') || null,
  componentConfig.demo?.label ? `label='${componentConfig.demo.label}'` : null,
  componentConfig.demo?.description
    ? `description='${componentConfig.demo.description}'`
    : null,
]
  .filter((prop): prop is string => Boolean(prop))
  .map((prop) => `    ${toTsString(prop)},`)
  .join('\n');

const usageContent = `'use client';

import type { ComponentPlatform } from '../../types';

import { ComponentCodeBlock } from '../../components/ComponentCodeBlock';
import { useComponentDemoState } from '../../components/ComponentDemoStateProvider';

import {
  initial${componentName}PlaygroundValue,
  type ${componentName}PlaygroundValue,
} from '../${componentName}Playground';

import styles from '../ButtonUsage/ButtonUsage.module.css';

type ${componentName}UsageProps = {
  platform: ComponentPlatform;
};

function create${componentName}Code(
  platform: ComponentPlatform,
  value: ${componentName}PlaygroundValue
) {
  const packageName =
    platform === 'react'
      ? '@vellira-ui/react'
      : '@vellira-ui/react-native';

const props: string[] = [
${usageStaticProps}
];

${playgroundProps
  .map((prop) => {
    const initialValue = componentConfig.demo?.initialValues?.[prop.name];

    if (prop.kind === 'boolean') {
      return `  if (value.${prop.name}) {
    props.push('${prop.name}');
  }`;
    }

    if (prop.kind === 'string') {
      return `  if (value.${prop.name}) {
    props.push(\`${prop.name}='\${value.${prop.name}}'\`);
  }`;
    }

    if (prop.kind === 'number') {
      return `  if (value.${prop.name} !== ${JSON.stringify(initialValue ?? 0)}) {
    props.push(\`${prop.name}={\${value.${prop.name}}}\`);
  }`;
    }

    return `  if (value.${prop.name} !== ${toTsString(
      String(initialValue ?? prop.options[0] ?? '')
    )}) {
    props.push(\`${prop.name}='\${value.${prop.name}}'\`);
  }`;
  })
  .join('\n\n')}

const propsText =
  props.length === 0 ? '' : \`\\n  \${props.join('\\n  ')}\\n\`;

const children =
  platform === 'react'
    ? ${JSON.stringify(componentConfig.react?.children ?? '')}
    : ${JSON.stringify(componentConfig.native?.children ?? '')};

if (!children) {
  return \`import { ${componentName} } from '\${packageName}';

<${componentName}\${propsText}/>\`;
}

const formattedChildren = children
  .split('\\n')
  .map((line) => '  ' + line)
  .join('\\n');

return \`import { ${componentName} } from '\${packageName}';

<${componentName}\${propsText}>
\${formattedChildren}
</${componentName}>\`;
}

export function ${componentName}Usage({
  platform,
}: ${componentName}UsageProps) {
  const [value] =
    useComponentDemoState<${componentName}PlaygroundValue>(
      initial${componentName}PlaygroundValue
    );

  const code = create${componentName}Code(platform, value);

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>Usage</h2>

        <p className={styles.description}>
          Import the component and configure it with the same props used in the
          playground.
        </p>
      </div>

      <ComponentCodeBlock code={code} />
    </section>
  );
}
`;

writeIfMissing(usageFile, usageContent);

writeIfMissing(
  usageIndexFile,
  `export { ${componentName}Usage } from './${componentName}Usage';\n`
);

const examplesDir = path.join(websiteRoot, 'demos', `${componentName}Examples`);

const examplesFile = path.join(examplesDir, `${componentName}Examples.tsx`);

const examplesIndexFile = path.join(examplesDir, 'index.ts');

type GeneratedExample = {
  title: string;
  description: string;
  props: readonly string[];
};

function hasExtractedProp(name: string) {
  return extractedProps.some((prop) => prop.name === name);
}

function getSelectExample() {
  const prop = playgroundProps.find(
    (item) => item.kind === 'select' && item.options.length > 1
  );

  if (!prop || prop.kind !== 'select') {
    return null;
  }

  const initialValue =
    componentConfig.demo?.initialValues?.[prop.name] ?? prop.options[0];

  const alternative = prop.options.find((option) => option !== initialValue);

  if (!alternative) {
    return null;
  }

  return {
    title: toLabel(prop.name),
    description: `Alternative ${toLabel(prop.name).toLowerCase()} option.`,
    props: [`${prop.name}='${alternative}'`],
  } satisfies GeneratedExample;
}

function createGeneratedExamples(): GeneratedExample[] {
  if (componentConfig.examples) {
    return [...componentConfig.examples];
  }

  const examples: GeneratedExample[] = [
    {
      title: 'Basic',
      description: 'Basic component usage.',
      props: [],
    },
  ];

  if (hasExtractedProp('disabled')) {
    examples.push({
      title: 'Disabled',
      description: 'Disabled state.',
      props: ['disabled'],
    });
  }

  if (hasExtractedProp('checked')) {
    examples.push({
      title: 'Selected',
      description: 'Selected state.',
      props: ['checked'],
    });
  } else if (hasExtractedProp('loading')) {
    examples.push({
      title: 'Loading',
      description: 'Loading state.',
      props: ['loading'],
    });
  } else if (hasExtractedProp('open')) {
    examples.push({
      title: 'Open',
      description: 'Open state.',
      props: ['open'],
    });
  }

  if (hasExtractedProp('error')) {
    examples.push({
      title: 'Error',
      description: 'Validation error state.',
      props: [`error='Please review this option.'`],
    });
  }

  const selectExample = getSelectExample();

  if (selectExample) {
    examples.push(selectExample);
  }

  if (hasExtractedProp('required')) {
    examples.push({
      title: 'Required',
      description: 'Required form control.',
      props: ['required'],
    });
  }

  return examples.slice(0, 4);
}

const generatedExamples = createGeneratedExamples();

function createExampleJsx(platform: Platform, example: GeneratedExample) {
  const componentAlias =
    platform === 'react' ? `React${componentName}` : `Native${componentName}`;

  const props = [
    getDemoProps(platform),
    componentConfig.demo?.label
      ? `label=${toTsString(componentConfig.demo.label)}`
      : '',
    componentConfig.demo?.description
      ? `description=${toTsString(componentConfig.demo.description)}`
      : '',
    ...example.props,
  ].filter(Boolean);

  const exampleChildren =
    platform === 'react'
      ? (componentConfig.react?.children ?? '')
      : (componentConfig.native?.children ?? '');

  const propsText =
    props.length === 0 ? '' : `\n          ${props.join('\n          ')}`;

  if (!exampleChildren) {
    return `<${componentAlias}${propsText}
        />`;
  }

  const aliasedChildren = exampleChildren
    .replaceAll(`<${componentName}.`, `<${componentAlias}.`)
    .replaceAll(`</${componentName}.`, `</${componentAlias}.`);

  const formattedChildren = aliasedChildren
    .split('\n')
    .map((line) => `          ${line}`)
    .join('\n');

  return `<${componentAlias}${propsText}
        >
${formattedChildren}
        </${componentAlias}>`;
}

function createExampleCode(platform: Platform, example: GeneratedExample) {
  const packageName =
    platform === 'react' ? '@vellira-ui/react' : '@vellira-ui/react-native';

  const props = [
    getDemoProps(platform),
    componentConfig.demo?.label
      ? `label=${toTsString(componentConfig.demo.label)}`
      : '',
    componentConfig.demo?.description
      ? `description=${toTsString(componentConfig.demo.description)}`
      : '',
    ...example.props,
  ].filter(Boolean);

  const propsText = props.length === 0 ? '' : `\n  ${props.join('\n  ')}\n`;

  const exampleChildren =
    platform === 'react'
      ? (componentConfig.react?.children ?? '')
      : (componentConfig.native?.children ?? '');

  if (!exampleChildren) {
    return `import { ${componentName} } from '${packageName}';

<${componentName}${propsText}/>`;
  }

  const formattedChildren = exampleChildren
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');

  return `import { ${componentName} } from '${packageName}';

<${componentName}${propsText}>
${formattedChildren}
</${componentName}>`;
}

const reactGeneratedExamples = generatedExamples
  .map(
    (example) => `    {
      title: ${JSON.stringify(example.title)},
      description: ${JSON.stringify(example.description)},
      preview: (
        ${createExampleJsx('react', example)}
      ),
      code: ${JSON.stringify(createExampleCode('react', example))},
    },`
  )
  .join('\n');

const nativeGeneratedExamples = generatedExamples
  .map(
    (example) => `    {
      title: ${JSON.stringify(example.title)},
      description: ${JSON.stringify(example.description)},
      preview: (
        ${createExampleJsx('react-native', example)}
      ),
      code: ${JSON.stringify(createExampleCode('react-native', example))},
    },`
  )
  .join('\n');

const examplesContent = `'use client';

import { ${componentName} as React${componentName} } from '@vellira-ui/react';
import { ${componentName} as Native${componentName} } from '@vellira-ui/react-native';

import { ComponentExamples } from '../../components/ComponentExamples';
import type { ComponentPlatform } from '../../types';

type ${componentName}ExamplesProps = {
  platform: ComponentPlatform;
};

export function ${componentName}Examples({
  platform,
}: ${componentName}ExamplesProps) {
  const reactExamples = [
${reactGeneratedExamples}
  ] as const;

  const nativeExamples = [
${nativeGeneratedExamples}
  ] as const;

  return (
    <ComponentExamples
      items={platform === 'react' ? reactExamples : nativeExamples}
    />
  );
}
`;

writeIfMissing(examplesFile, examplesContent);

writeIfMissing(
  examplesIndexFile,
  `export { ${componentName}Examples } from './${componentName}Examples';\n`
);

const accessibilityDir = path.join(
  websiteRoot,
  'demos',
  `${componentName}Accessibility`
);

const accessibilityFile = path.join(
  accessibilityDir,
  `${componentName}Accessibility.tsx`
);

const accessibilityIndexFile = path.join(accessibilityDir, 'index.ts');

function toTsString(value: string) {
  return `'${value
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")
    .replaceAll('\n', '\\n')}'`;
}

type AccessibilityItem = {
  title: string;
  description: string;
};

function createAccessibilityItems(platform: Platform): AccessibilityItem[] {
  const items: AccessibilityItem[] = [];

  const hasProp = (name: string) =>
    extractedProps.some((prop) => prop.name === name);

  const isInteractive =
    hasProp('disabled') ||
    hasProp('checked') ||
    hasProp('selected') ||
    hasProp('open') ||
    hasProp('onPress') ||
    hasProp('onClick') ||
    extractedProps.some((prop) => prop.name.startsWith('on'));

  if (
    componentConfig.demo?.label ||
    hasProp('label') ||
    hasProp('accessibilityLabel')
  ) {
    items.push({
      title: 'Accessible naming',
      description:
        platform === 'react'
          ? 'Provide a visible label or another accessible name that clearly identifies the control.'
          : 'Provide a visible label or accessibilityLabel so screen readers can identify the control.',
    });
  }

  if (
    hasProp('checked') ||
    hasProp('selected') ||
    hasProp('open') ||
    hasProp('expanded')
  ) {
    items.push({
      title: 'State communication',
      description:
        platform === 'react'
          ? 'Expose the current interactive state through the appropriate native semantics and keep it synchronized with the visual state.'
          : 'Expose the current interactive state through React Native accessibilityState and keep it synchronized with the visual state.',
    });
  }

  if (hasProp('disabled')) {
    items.push({
      title: 'Disabled state',
      description:
        'Disabled controls should remain identifiable while preventing interaction.',
    });
  }

  if (hasProp('error')) {
    items.push({
      title: 'Validation feedback',
      description:
        platform === 'react'
          ? 'Associate validation feedback with the control and expose its invalid state to assistive technologies.'
          : 'Expose validation feedback through accessible text or hints and preserve the invalid state for assistive technologies.',
    });
  }

  if (hasProp('required')) {
    items.push({
      title: 'Required fields',
      description:
        'Required state should be communicated semantically and not rely only on visual styling.',
    });
  }

  if (isInteractive) {
    items.push({
      title: 'Keyboard and focus',
      description:
        platform === 'react'
          ? 'Preserve expected keyboard interaction and visible focus behavior.'
          : 'Verify focus and screen reader interaction on supported React Native platforms.',
    });
  }

  if (items.length === 0) {
    items.push({
      title: 'Accessible usage',
      description:
        platform === 'react'
          ? 'Use semantic markup, accessible naming, and predictable keyboard behavior.'
          : 'Expose meaningful accessibility roles, labels, states, and interaction behavior.',
    });
  }

  return items.slice(0, 4);
}

const reactAccessibilityItems = createAccessibilityItems('react')
  .map(
    (item) => `    {
      title: ${toTsString(item.title)},
      description: ${toTsString(item.description)},
    },`
  )
  .join('\n');

const nativeAccessibilityItems = createAccessibilityItems('react-native')
  .map(
    (item) => `    {
      title: ${toTsString(item.title)},
      description: ${toTsString(item.description)},
    },`
  )
  .join('\n');

const accessibilityContent = `'use client';

import type { ComponentPlatform } from '../../types';

import { ComponentAccessibility } from '../../components/ComponentAccessibility';

type ${componentName}AccessibilityProps = {
  platform: ComponentPlatform;
};

export function ${componentName}Accessibility({
  platform,
}: ${componentName}AccessibilityProps) {
  const reactItems = [
${reactAccessibilityItems}
  ] as const;

  const nativeItems = [
${nativeAccessibilityItems}
  ] as const;

  return (
    <ComponentAccessibility
      items={platform === 'react' ? reactItems : nativeItems}
    />
  );
}
`;

writeIfMissing(accessibilityFile, accessibilityContent);

writeIfMissing(
  accessibilityIndexFile,
  `export { ${componentName}Accessibility } from './${componentName}Accessibility';\n`
);

const apiFile = path.join(websiteRoot, 'data', `${slug}Api.ts`);

function getApiType(prop: ExtractedProp) {
  if (prop.kind === 'select' && prop.options?.length) {
    return prop.options.map((option) => `'${option}'`).join(' | ');
  }

  return prop.type;
}

const sharedApiEntries = extractedProps
  .map((prop) => {
    return `  {
    name: ${JSON.stringify(prop.name)},
    type: ${JSON.stringify(getApiType(prop))},
    description: ${JSON.stringify(
      prop.description || `Prop for ${componentName}.`
    )},${prop.required ? '\n    required: true,' : ''}
  },`;
  })
  .join('\n');

const apiContent = `import type { ComponentApiProp } from '../components/ComponentApi';

const shared${componentName}Api: readonly ComponentApiProp[] = [
${sharedApiEntries}
];

const react${componentName}Api: readonly ComponentApiProp[] = [
  ...shared${componentName}Api,
];

const native${componentName}Api: readonly ComponentApiProp[] = [
  ...shared${componentName}Api,
];

export const ${slug}Api = {
  react: react${componentName}Api,
  'react-native': native${componentName}Api,
} as const;
`;

writeIfMissing(apiFile, apiContent);

function insertAfterMarker(params: {
  filePath: string;
  marker: string;
  content: string;
  existsCheck: string;
}) {
  const { filePath, marker, content, existsCheck } = params;

  const source = fs.readFileSync(filePath, 'utf8');

  if (source.includes(existsCheck)) {
    console.log(`⏭ Skipped registry update: ${existsCheck}`);
    return;
  }

  if (!source.includes(marker)) {
    console.error(`Marker not found in ${filePath}: ${marker}`);
    process.exit(1);
  }

  const nextSource = source.replace(marker, `${marker}\n${content}`);

  fs.writeFileSync(filePath, nextSource);

  console.log(`✅ Updated: ${path.relative(root, filePath)}`);
}

const playgroundDir = path.join(
  websiteRoot,
  'demos',
  `${componentName}Playground`
);

const playgroundSchemaFile = path.join(
  playgroundDir,
  `${slug}PlaygroundSchema.ts`
);

function toLabel(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (character) => character.toUpperCase());
}

function getInitialValue(prop: ExtractedProp) {
  const configuredValue = componentConfig.demo?.initialValues?.[prop.name];

  if (configuredValue !== undefined) {
    return JSON.stringify(configuredValue);
  }

  if (prop.kind === 'boolean') {
    return 'false';
  }

  if (prop.kind === 'number') {
    return '0';
  }

  if (prop.kind === 'select') {
    return JSON.stringify(prop.options[0] ?? '');
  }

  return prop.required ? JSON.stringify('example') : JSON.stringify('');
}

function getPlaygroundPropBinding(prop: ExtractedProp) {
  const propValue =
    prop.kind === 'string' && !prop.required
      ? `value.${prop.name} || undefined`
      : `value.${prop.name}`;

  const binding = `${prop.name}={${propValue}}`;

  const changeHandler = getChangeHandlerName(prop.name);

  if (!changeHandler) {
    return binding;
  }

  return `${binding}
          ${changeHandler}={(nextValue) =>
            onChange('${prop.name}', nextValue)
          }`;
}

const reactStaticDemoProps = getDemoProps('react');
const nativeStaticDemoProps = getDemoProps('react-native');

const reactDemoChildren = componentConfig.react?.children ?? '';
const nativeDemoChildren = componentConfig.native?.children ?? '';

const demoPresentationProps = [
  componentConfig.demo?.label
    ? `label=${toTsString(componentConfig.demo.label)}`
    : null,
  componentConfig.demo?.description
    ? `description=${toTsString(componentConfig.demo.description)}`
    : null,
]
  .filter(Boolean)
  .join('\n          ');

const staticDemoProps = Object.entries(componentConfig.demo?.staticProps ?? {})
  .map(([name, value]) => `${name}={${value}}`)
  .join('\n          ');

const playgroundPropBindings = playgroundProps
  .map((prop) => getPlaygroundPropBinding(prop))
  .join('\n          ');

const playgroundValueFields = playgroundProps
  .map((prop) => {
    if (prop.kind === 'boolean') {
      return `  ${prop.name}: boolean;`;
    }

    if (prop.kind === 'number') {
      return `  ${prop.name}: number;`;
    }

    if (prop.kind === 'select') {
      const union = prop.options.map((option) => `'${option}'`).join(' | ');

      return `  ${prop.name}: ${union};`;
    }

    return `  ${prop.name}: string;`;
  })
  .join('\n');

const playgroundInitialValues = playgroundProps
  .map((prop) => `  ${prop.name}: ${getInitialValue(prop)},`)
  .join('\n');

const playgroundControlEntries = playgroundProps
  .map((prop) => {
    const label = toLabel(prop.name);

    if (prop.kind === 'boolean') {
      return `  {
    type: 'toggle',
    key: '${prop.name}',
    label: '${label}',
    group: 'Options',
  },`;
    }

    if (prop.kind === 'select') {
      return `  {
    type: 'select',
    key: '${prop.name}',
    label: '${label}',
    options: [${prop.options.map((option) => `'${option}'`).join(', ')}],
  },`;
    }

    if (prop.kind === 'number') {
      return `  {
    type: 'number',
    key: '${prop.name}',
    label: '${label}',
  },`;
    }

    return `  {
    type: 'text',
    key: '${prop.name}',
    label: '${label}',
  },`;
  })
  .join('\n');

const playgroundSchemaContent = `import type { PlaygroundControl } from '../../components/PlaygroundControls';

import type { ${componentName}PlaygroundValue } from './${componentName}Playground';

export const ${slug}PlaygroundControls = [
${playgroundControlEntries}
] as const satisfies readonly PlaygroundControl<${componentName}PlaygroundValue>[];
`;

writeIfMissing(playgroundSchemaFile, playgroundSchemaContent);

const playgroundFile = path.join(
  playgroundDir,
  `${componentName}Playground.tsx`
);

const playgroundIndexFile = path.join(playgroundDir, 'index.ts');

const playgroundContent = `'use client';

import type { ReactNode } from 'react';

import { ComponentPlayground } from '../../components/ComponentPlayground';
import { useComponentDemoState } from '../../components/ComponentDemoStateProvider';
import { PlaygroundControlsFromSchema } from '../../components/PlaygroundControls';

import { ${slug}PlaygroundControls } from './${slug}PlaygroundSchema';

export type ${componentName}PlaygroundValue = {
${playgroundValueFields}
};

type ${componentName}PlaygroundProps = {
  render${componentName}: (
    value: ${componentName}PlaygroundValue,
    onChange: <K extends keyof ${componentName}PlaygroundValue>(
      key: K,
      nextValue: ${componentName}PlaygroundValue[K]
    ) => void
  ) => ReactNode;
};

export const initial${componentName}PlaygroundValue: ${componentName}PlaygroundValue = {
${playgroundInitialValues}
};

export function ${componentName}Playground({
  render${componentName},
}: ${componentName}PlaygroundProps) {
  const [value, setValue] =
    useComponentDemoState<${componentName}PlaygroundValue>(
      initial${componentName}PlaygroundValue
    );

    const update = (
    key: keyof ${componentName}PlaygroundValue,
    nextValue: ${componentName}PlaygroundValue[keyof ${componentName}PlaygroundValue]
  ) => {
    setValue({
      ...value,
      [key]: nextValue,
    });
  };

  return (
    <ComponentPlayground
    previewWidth=${JSON.stringify(componentConfig.demo?.previewWidth ?? 'auto')}
      controls={
        <PlaygroundControlsFromSchema
          value={value}
          controls={${slug}PlaygroundControls}
          onChange={update}
        />
      }
    >
      {render${componentName}(value, update)}
    </ComponentPlayground>
  );
}
`;

writeIfMissing(playgroundFile, playgroundContent);

writeIfMissing(
  playgroundIndexFile,
  `export {
  ${componentName}Playground,
  initial${componentName}PlaygroundValue,
} from './${componentName}Playground';

export type {
  ${componentName}PlaygroundValue,
} from './${componentName}Playground';
`
);

const demoEntries = [
  platforms.includes('react') ? `    react: ${componentName}Demo,` : null,
  platforms.includes('react-native')
    ? `    'react-native': Native${componentName}Demo,`
    : null,
]
  .filter(Boolean)
  .join('\n');

const relatedComponents = componentConfig.related ?? [];

const relatedSnippet =
  relatedComponents.length > 0
    ? `[${relatedComponents.map((item) => `'${item}'`).join(', ')}]`
    : '[]';

const pageConfigSnippet = `
${slug}: {
  name: '${componentName}',
  demos: {
${demoEntries}
  },
  Usage: ${componentName}Usage,
  Examples: ${componentName}Examples,
  Accessibility: ${componentName}Accessibility,
  api: ${slug}Api,
  related: ${relatedSnippet},
},
`;

const componentPagesFile = path.join(websiteRoot, 'data', 'componentPages.ts');

const reactDemoDir = path.join(websiteRoot, 'demos', `${componentName}Demo`);

const reactDemoFile = path.join(reactDemoDir, `${componentName}Demo.tsx`);

const reactDemoIndexFile = path.join(reactDemoDir, 'index.ts');

const nativeResponsivePresentation =
  componentConfig.native?.responsivePresentation === true;

const nativeResponsiveImport = nativeResponsivePresentation
  ? `import { useWindowDimensions } from 'react-native';\n`
  : '';

const nativeResponsiveSetup = nativeResponsivePresentation
  ? `  const { width } = useWindowDimensions();
  const presentation = width <= 890 ? 'sheet' : 'popover';

`
  : '';

function createDemoElement(params: {
  platform: Platform;
  propBindings: string;
}) {
  const { platform, propBindings } = params;

  const children =
    platform === 'react' ? reactDemoChildren : nativeDemoChildren;

  const formattedChildren = children
    .split('\n')
    .map((line) => `          ${line}`)
    .join('\n');

  const staticProps =
    platform === 'react' ? reactStaticDemoProps : nativeStaticDemoProps;

  const props = [
    staticProps,
    staticDemoProps,
    platform === 'react-native' && nativeResponsivePresentation
      ? 'presentation={presentation}'
      : '',
    propBindings,
    demoPresentationProps,
  ]
    .filter(Boolean)
    .join('\n          ');

  if (!children) {
    return `<${componentName}
          ${props}
        />`;
  }

  return `<${componentName}
          ${props}
        >
${formattedChildren}
        </${componentName}>`;
}

const reactDemoElement = createDemoElement({
  platform: 'react',
  propBindings: playgroundPropBindings,
});

const nativeDemoElement = createDemoElement({
  platform: 'react-native',
  propBindings: playgroundPropBindings,
});

const usesDemoValue = playgroundProps.length > 0;

const usesDemoOnChange = playgroundProps.some((prop) =>
  Boolean(getChangeHandlerName(prop.name))
);

const demoRenderParams = usesDemoOnChange
  ? '(value, onChange)'
  : usesDemoValue
    ? '(value)'
    : '()';

const reactDemoContent = `'use client';

import { ${componentName} } from '@vellira-ui/react';

import { ${componentName}Playground } from '../${componentName}Playground';

export function ${componentName}Demo() {
  return (
    <${componentName}Playground
      render${componentName}={${demoRenderParams} => (
        ${reactDemoElement}
      )}
    />
  );
}
`;

if (platforms.includes('react')) {
  writeIfMissing(reactDemoFile, reactDemoContent);

  writeIfMissing(
    reactDemoIndexFile,
    `export { ${componentName}Demo } from './${componentName}Demo';\n`
  );
}

const nativeDemoDir = path.join(
  websiteRoot,
  'demos',
  `Native${componentName}Demo`
);

const nativeDemoFile = path.join(
  nativeDemoDir,
  `Native${componentName}Demo.tsx`
);

const nativeDemoIndexFile = path.join(nativeDemoDir, 'index.ts');

const nativeDemoContent = `'use client';

${nativeResponsiveImport}import { ${componentName} } from '@vellira-ui/react-native';

import { ${componentName}Playground } from '../${componentName}Playground';

export function Native${componentName}Demo() {
${nativeResponsiveSetup}  return (
    <${componentName}Playground
      render${componentName}={${demoRenderParams} => (
        ${nativeDemoElement}
      )}
    />
  );
}
`;

if (platforms.includes('react-native')) {
  writeIfMissing(nativeDemoFile, nativeDemoContent);

  writeIfMissing(
    nativeDemoIndexFile,
    `export { Native${componentName}Demo } from './Native${componentName}Demo';\n`
  );
}

function insertMissingLinesAfterMarker(params: {
  filePath: string;
  marker: string;
  lines: string[];
}) {
  const { filePath, marker, lines } = params;

  const source = fs.readFileSync(filePath, 'utf8');

  if (!source.includes(marker)) {
    console.error(`Marker not found in ${filePath}: ${marker}`);
    process.exit(1);
  }

  const missingLines = lines.filter((line) => !source.includes(line));

  if (missingLines.length === 0) {
    console.log('⏭ Skipped registry imports: already present');
    return;
  }

  const nextSource = source.replace(
    marker,
    `${marker}\n${missingLines.join('\n')}`
  );

  fs.writeFileSync(filePath, nextSource);

  console.log(`✅ Updated imports: ${path.relative(root, filePath)}`);
}

const requiredDemoFiles = [
  platforms.includes('react')
    ? path.join(
        websiteRoot,
        'demos',
        `${componentName}Demo`,
        `${componentName}Demo.tsx`
      )
    : null,

  platforms.includes('react-native')
    ? path.join(
        websiteRoot,
        'demos',
        `Native${componentName}Demo`,
        `Native${componentName}Demo.tsx`
      )
    : null,
].filter((filePath): filePath is string => Boolean(filePath));

const missingDemoFiles = requiredDemoFiles.filter(
  (filePath) => !fs.existsSync(filePath)
);

if (missingDemoFiles.length > 0) {
  console.log('\n⚠️ Registry update skipped. Missing website demos:');

  for (const filePath of missingDemoFiles) {
    console.log(`   - ${path.relative(root, filePath)}`);
  }
} else {
  const registryImports = [
    `import { ${componentName}Usage } from '../demos/${componentName}Usage';`,
    `import { ${componentName}Examples } from '../demos/${componentName}Examples';`,
    `import { ${componentName}Accessibility } from '../demos/${componentName}Accessibility';`,
    ...(platforms.includes('react')
      ? [
          `import { ${componentName}Demo } from '../demos/${componentName}Demo';`,
        ]
      : []),
    ...(platforms.includes('react-native')
      ? [
          `import { Native${componentName}Demo } from '../demos/Native${componentName}Demo';`,
        ]
      : []),
    `import { ${slug}Api } from './${slug}Api';`,
  ];
  insertMissingLinesAfterMarker({
    filePath: componentPagesFile,
    marker: '// component-page-imports',
    lines: registryImports,
  });

  insertAfterMarker({
    filePath: componentPagesFile,
    marker: '// component-page-entries',
    content: pageConfigSnippet.trim(),
    existsCheck: `${slug}: {`,
  });
}

console.log('Extracted props:', extractedProps);

console.log(`Component: ${componentName}`);
console.log(`Slug: ${slug}`);
console.log(`Platforms: ${platforms.join(', ')}`);
console.log(`Website root: ${websiteRoot}`);
