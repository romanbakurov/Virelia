import { toTemplateLiteral, toTsLiteral } from '../helpers/format';
import type { ComponentPageMetadata } from '../metadata/metadata';
import type { ExtractedProp, Platform } from '../model/types';
import {
  indentBlock,
  normalizePropFragments,
  normalizeSetupStatements,
} from './renderer-format';

export function renderUsage(params: {
  componentName: string;
  componentConfig: ComponentPageMetadata;
  playgroundProps: readonly ExtractedProp[];
  reactApiProps: readonly ExtractedProp[];
  nativeApiProps: readonly ExtractedProp[];
  generatedFileHeader: string;
  getDemoProps(platform: Platform): string;
}) {
  const {
    componentName,
    componentConfig,
    playgroundProps,
    reactApiProps,
    nativeApiProps,
    generatedFileHeader,
    getDemoProps,
  } = params;

  function hasApiProp(platform: Platform, propName: string) {
    const apiProps = platform === 'react' ? reactApiProps : nativeApiProps;

    return apiProps.some((prop) => prop.name === propName);
  }

  function hasPropBinding(source: string, propName: string) {
    return new RegExp(`(^|\\s)${propName}\\s*=`).test(source);
  }

  function createUsageStaticProps(platform: Platform) {
    const demoProps = getDemoProps(platform);

    return normalizePropFragments(
      [
        demoProps || null,
        componentConfig.demo?.label &&
        hasApiProp(platform, 'label') &&
        !hasPropBinding(demoProps, 'label')
          ? `label='${componentConfig.demo.label}'`
          : null,
        componentConfig.demo?.description &&
        hasApiProp(platform, 'description') &&
        !hasPropBinding(demoProps, 'description')
          ? `description='${componentConfig.demo.description}'`
          : null,
      ].filter((prop): prop is string => Boolean(prop))
    )
      .map((prop) => `        ${toTemplateLiteral(prop)},`)
      .join('\n');
  }

  function createUsageChildren(platform: Platform) {
    const children =
      platform === 'react'
        ? (componentConfig.react?.children ?? '')
        : (componentConfig.native?.children ?? '');

    if (!children) {
      return '';
    }

    return children
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n');
  }

  function createPlatformImports(platform: Platform) {
    const imports =
      platform === 'react'
        ? (componentConfig.react?.imports ?? [])
        : (componentConfig.native?.imports ?? []);

    return imports.length > 0 ? `\n${imports.join('\n')}` : '';
  }

  function createPlatformSetup(platform: Platform) {
    const setup =
      platform === 'react'
        ? (componentConfig.react?.setup ?? [])
        : (componentConfig.native?.setup ?? []);

    return normalizeSetupStatements(setup)
      .map((statement) => indentBlock(statement, '  '))
      .join('\n');
  }

  const reactUsageStaticProps = createUsageStaticProps('react');
  const nativeUsageStaticProps = createUsageStaticProps('react-native');
  const reactUsageChildren = createUsageChildren('react');
  const nativeUsageChildren = createUsageChildren('react-native');
  const reactPlatformImports = createPlatformImports('react');
  const nativePlatformImports = createPlatformImports('react-native');
  const reactPlatformSetup = createPlatformSetup('react');
  const nativePlatformSetup = createPlatformSetup('react-native');
  const hasPlatformSetup = Boolean(reactPlatformSetup || nativePlatformSetup);
  const reactApiPropNames = new Set(reactApiProps.map((prop) => prop.name));
  const nativeApiPropNames = new Set(nativeApiProps.map((prop) => prop.name));
  const hasPlaygroundState = playgroundProps.length > 0;
  const usageValueParameter = hasPlaygroundState
    ? `,\n  value: ${componentName}PlaygroundValue`
    : '';
  const usageValueArgument = hasPlaygroundState ? ', value' : '';
  const demoStateImport = hasPlaygroundState
    ? `import { useComponentDemoState } from '../../shared/ComponentDemoStateProvider';\n\nimport {\n  initial${componentName}PlaygroundValue,\n  type ${componentName}PlaygroundValue,\n} from './${componentName}Playground';\n\n`
    : '';
  const demoStateUsage = hasPlaygroundState
    ? `  const [value] =\n    useComponentDemoState<${componentName}PlaygroundValue>(\n      initial${componentName}PlaygroundValue\n    );\n\n`
    : '';
  const setupAwareCode = hasPlatformSetup
    ? `
  const imports = \`import { ${componentName} } from '\${packageName}';\${platform === 'react' ? ${toTemplateLiteral(reactPlatformImports)} : ${toTemplateLiteral(nativePlatformImports)}}\`;

  const setup =
    platform === 'react'
      ? ${toTemplateLiteral(reactPlatformSetup)}
      : ${toTemplateLiteral(nativePlatformSetup)};

  const root = !children
    ? \`<${componentName}\${propsText}/>\`
    : \`<${componentName}\${propsText}>
\${children}
</${componentName}>\`;

  if (setup) {
    const indentedRoot = root
      .split('\\n')
      .map((line) => \`    \${line}\`)
      .join('\\n');

    return \`\${imports}

function Example() {
\${setup}

  return (
\${indentedRoot}
  );
}\`;
  }

  return \`\${imports}

\${root}\`;`
    : `
  if (!children) {
    return \`import { ${componentName} } from '\${packageName}';
\${platform === 'react' ? ${toTemplateLiteral(reactPlatformImports)} : ${toTemplateLiteral(nativePlatformImports)}}

<${componentName}\${propsText}/>\`;
  }

  return \`import { ${componentName} } from '\${packageName}';
\${platform === 'react' ? ${toTemplateLiteral(reactPlatformImports)} : ${toTemplateLiteral(nativePlatformImports)}}

<${componentName}\${propsText}>
\${children}
</${componentName}>\`;`;

  const content = `${generatedFileHeader}'use client';

import type { ComponentPlatform } from '../../types';

import { ComponentCodeBlock } from '../../shared/ComponentCodeBlock';
${demoStateImport}import styles from '../../shared/ComponentUsage.module.css';

type ${componentName}UsageProps = {
  platform: ComponentPlatform;
};

function create${componentName}Code(
  platform: ComponentPlatform${usageValueParameter}
) {
  const packageName =
    platform === 'react' ? '@vellira-ui/react' : '@vellira-ui/react-native';

  const props: string[] =
    platform === 'react'
      ? [
${reactUsageStaticProps}
        ]
      : [
${nativeUsageStaticProps}
        ];

  const children =
    platform === 'react'
      ? ${toTemplateLiteral(reactUsageChildren)}
      : ${toTemplateLiteral(nativeUsageChildren)};

${playgroundProps
  .map((prop) => {
    const supportedOnReact = reactApiPropNames.has(prop.name);
    const supportedOnNative = nativeApiPropNames.has(prop.name);

    const platformGuard =
      supportedOnReact && supportedOnNative
        ? ''
        : supportedOnReact
          ? `platform === 'react' && `
          : `platform === 'react-native' && `;

    const initialValue = componentConfig.demo?.initialValues?.[prop.name];

    if (prop.kind === 'boolean') {
      return `  if (${platformGuard}value.${prop.name}) {
    props.push('${prop.name}');
  }`;
    }

    if (prop.kind === 'string') {
      return `  if (${platformGuard}value.${prop.name}) {
    props.push(\`${prop.name}='\${value.${prop.name}}'\`);
  }`;
    }

    if (prop.kind === 'number') {
      return `  if (${platformGuard}value.${prop.name} !== ${toTsLiteral(
        initialValue ?? 0
      )}) {
    props.push(\`${prop.name}={\${value.${prop.name}}}\`);
  }`;
    }

    if (prop.kind === 'select') {
      return `  if (${platformGuard}value.${prop.name} !== ${toTsLiteral(
        initialValue ?? prop.options[0] ?? ''
      )}) {
    props.push(\`${prop.name}='\${value.${prop.name}}'\`);
  }`;
    }

    return `  if (${platformGuard}value.${prop.name}) {
    props.push(\`${prop.name}='\${value.${prop.name}}'\`);
  }`;
  })
  .join('\n\n')}

  const propsText =
    props.length === 0 ? '' : \`\\n  \${props.join('\\n  ')}\\n\`;
${setupAwareCode}
}

export function ${componentName}Usage({
  platform,
}: ${componentName}UsageProps) {
${demoStateUsage}  const code = create${componentName}Code(platform${usageValueArgument});

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

  return {
    content,
    children: {
      react: reactUsageChildren,
      'react-native': nativeUsageChildren,
    },
  };
}
