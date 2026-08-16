import { toTemplateLiteral, toTsLiteral } from '../helpers/format';
import type { ComponentPageMetadata } from '../metadata/metadata';
import type { ExtractedProp, Platform } from '../model/types';

function normalizePropFragments(props: readonly string[]) {
  return props.flatMap((prop) =>
    prop
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  );
}

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

  function createUsageStaticProps(platform: Platform) {
    return normalizePropFragments(
      [
        getDemoProps(platform) || null,
        componentConfig.demo?.label
          ? `label='${componentConfig.demo.label}'`
          : null,
        componentConfig.demo?.description
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

  const reactUsageStaticProps = createUsageStaticProps('react');
  const nativeUsageStaticProps = createUsageStaticProps('react-native');
  const reactUsageChildren = createUsageChildren('react');
  const nativeUsageChildren = createUsageChildren('react-native');
  const reactPlatformImports = createPlatformImports('react');
  const nativePlatformImports = createPlatformImports('react-native');
  const reactApiPropNames = new Set(reactApiProps.map((prop) => prop.name));
  const nativeApiPropNames = new Set(nativeApiProps.map((prop) => prop.name));

  const content = `${generatedFileHeader}'use client';

import type { ComponentPlatform } from '../../types';

import { ComponentCodeBlock } from '../../shared/ComponentCodeBlock';
import { useComponentDemoState } from '../../shared/ComponentDemoStateProvider';

import {
  initial${componentName}PlaygroundValue,
  type ${componentName}PlaygroundValue,
} from './${componentName}Playground';

import styles from '../../shared/ComponentUsage.module.css';

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

    return `  if (${platformGuard}value.${prop.name} !== ${toTsLiteral(
      initialValue ?? prop.options[0] ?? ''
    )}) {
    props.push(\`${prop.name}='\${value.${prop.name}}'\`);
  }`;
  })
  .join('\n\n')}

  const propsText =
    props.length === 0 ? '' : \`\\n  \${props.join('\\n  ')}\\n\`;

  if (!children) {
    return \`import { ${componentName} } from '\${packageName}';
\${platform === 'react' ? ${toTemplateLiteral(reactPlatformImports)} : ${toTemplateLiteral(nativePlatformImports)}}

<${componentName}\${propsText}/>\`;
  }

  return \`import { ${componentName} } from '\${packageName}';
\${platform === 'react' ? ${toTemplateLiteral(reactPlatformImports)} : ${toTemplateLiteral(nativePlatformImports)}}

<${componentName}\${propsText}>
\${children}
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

  return {
    content,
    children: {
      react: reactUsageChildren,
      'react-native': nativeUsageChildren,
    },
  };
}
