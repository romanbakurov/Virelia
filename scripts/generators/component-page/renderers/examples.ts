import { toLabel, toTemplateLiteral, toTsString } from '../helpers/format';
import type { ComponentPageMetadata } from '../metadata/metadata';
import type { ExtractedProp, GeneratedExample, Platform } from '../model/types';
import type { ComponentProfile } from '../profiles/profiles';

export function buildExamples(params: {
  componentName: string;
  componentConfig: ComponentPageMetadata;
  componentProfile: ComponentProfile;
  extractedProps: readonly ExtractedProp[];
  playgroundProps: readonly ExtractedProp[];
}) {
  const { componentConfig, componentProfile, extractedProps, playgroundProps } =
    params;

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

  if (componentConfig.examples) {
    return [...componentConfig.examples];
  }

  const examples: GeneratedExample[] = [
    {
      title: 'Basic',
      description:
        componentProfile === 'overlay'
          ? 'Basic trigger and floating content.'
          : componentProfile === 'navigation'
            ? 'Basic navigation structure.'
            : componentProfile === 'form-control'
              ? 'Basic form control usage.'
              : 'Basic component usage.',
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

  return examples;
}

function uniqueImports(imports: readonly string[]) {
  return Array.from(new Set(imports));
}

function normalizePropFragments(props: readonly string[]) {
  return props.flatMap((prop) =>
    prop
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  );
}

export function renderExamples(params: {
  componentName: string;
  componentConfig: ComponentPageMetadata;
  generatedExamples: readonly GeneratedExample[];
  generatedFileHeader: string;
  getDemoProps(platform: Platform): string;
}) {
  const {
    componentName,
    componentConfig,
    generatedExamples,
    generatedFileHeader,
    getDemoProps,
  } = params;

  function createExampleJsx(platform: Platform, example: GeneratedExample) {
    const componentAlias =
      platform === 'react' ? `React${componentName}` : `Native${componentName}`;

    const props = normalizePropFragments(
      [
        example.inheritDemoProps === false ? '' : getDemoProps(platform),
        example.inheritDemoProps === false
          ? ''
          : componentConfig.demo?.label
            ? `label=${toTsString(componentConfig.demo.label)}`
            : '',
        example.inheritDemoProps === false
          ? ''
          : componentConfig.demo?.description
            ? `description=${toTsString(componentConfig.demo.description)}`
            : '',
        ...example.props,
        ...(platform === 'react'
          ? (example.reactProps ?? [])
          : (example.nativeProps ?? [])),
      ].filter(Boolean)
    );

    const exampleChildren =
      platform === 'react'
        ? (example.reactChildren ?? componentConfig.react?.children ?? '')
        : (example.nativeChildren ?? componentConfig.native?.children ?? '');

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

    const props = normalizePropFragments(
      [
        example.inheritDemoProps === false ? '' : getDemoProps(platform),
        example.inheritDemoProps === false
          ? ''
          : componentConfig.demo?.label
            ? `label=${toTsString(componentConfig.demo.label)}`
            : '',
        example.inheritDemoProps === false
          ? ''
          : componentConfig.demo?.description
            ? `description=${toTsString(componentConfig.demo.description)}`
            : '',
        ...example.props,
        ...(platform === 'react'
          ? (example.reactProps ?? [])
          : (example.nativeProps ?? [])),
      ].filter(Boolean)
    );

    const propsText = props.length === 0 ? '' : `\n  ${props.join('\n  ')}\n`;

    const exampleChildren =
      platform === 'react'
        ? (example.reactChildren ?? componentConfig.react?.children ?? '')
        : (example.nativeChildren ?? componentConfig.native?.children ?? '');

    if (!exampleChildren) {
      const imports = uniqueImports([
        `import { ${componentName} } from '${packageName}';`,
        ...(platform === 'react'
          ? (componentConfig.react?.imports ?? [])
          : (componentConfig.native?.imports ?? [])),
        ...(example.imports ?? []),
        ...(platform === 'react'
          ? (example.reactImports ?? [])
          : (example.nativeImports ?? [])),
      ]).join('\n');

      return `${imports}

<${componentName}${propsText}/>`;
    }

    const formattedChildren = exampleChildren
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n');

    const imports = uniqueImports([
      `import { ${componentName} } from '${packageName}';`,
      ...(platform === 'react'
        ? (componentConfig.react?.imports ?? [])
        : (componentConfig.native?.imports ?? [])),
      ...(example.imports ?? []),
      ...(platform === 'react'
        ? (example.reactImports ?? [])
        : (example.nativeImports ?? [])),
    ]).join('\n');

    return `${imports}

<${componentName}${propsText}>
${formattedChildren}
</${componentName}>`;
  }

  function getExamplesForPlatform(platform: Platform) {
    return generatedExamples.filter(
      (example) => !example.platforms || example.platforms.includes(platform)
    );
  }

  const exampleImports = Array.from(
    new Set(
      generatedExamples.flatMap((example) => [
        ...(example.imports ?? []),
        ...(example.reactImports ?? []),
        ...(example.nativeImports ?? []),
        ...(componentConfig.react?.imports ?? []),
        ...(componentConfig.native?.imports ?? []),
      ])
    )
  );

  const reactGeneratedExamples = getExamplesForPlatform('react')
    .map(
      (example) => `    {
      title: ${toTsString(example.title)},
      description: ${toTsString(example.description)},
      preview: (
        ${createExampleJsx('react', example)}
      ),
      code: ${toTemplateLiteral(createExampleCode('react', example))},
    },`
    )
    .join('\n');

  const nativeGeneratedExamples = getExamplesForPlatform('react-native')
    .map(
      (example) => `    {
      title: ${toTsString(example.title)},
      description: ${toTsString(example.description)},
      preview: (
        ${createExampleJsx('react-native', example)}
      ),
      code: ${toTemplateLiteral(createExampleCode('react-native', example))},
    },`
    )
    .join('\n');

  return `${generatedFileHeader}'use client';

import { ${componentName} as React${componentName} } from '@vellira-ui/react';
import { ${componentName} as Native${componentName} } from '@vellira-ui/react-native';
${exampleImports.join('\n')}

import { ComponentExamples } from '../../shared/ComponentExamples';
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
}
