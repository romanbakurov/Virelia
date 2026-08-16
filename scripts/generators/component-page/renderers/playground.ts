import { identifierFromSlug, toLabel, toTsLiteral } from '../helpers/format';
import type { ComponentPageMetadata } from '../metadata/metadata';
import type { ExtractedProp } from '../model/types';

export function getInitialValue(params: {
  prop: ExtractedProp;
  componentConfig: ComponentPageMetadata;
}) {
  const { prop, componentConfig } = params;
  const configuredValue = componentConfig.demo?.initialValues?.[prop.name];

  if (configuredValue !== undefined) {
    return toTsLiteral(configuredValue);
  }

  if (prop.kind === 'boolean') {
    return 'false';
  }

  if (prop.kind === 'number') {
    return '0';
  }

  if (prop.kind === 'select') {
    return toTsLiteral(prop.options[0] ?? '');
  }

  return prop.required ? toTsLiteral('example') : toTsLiteral('');
}

function getControlOptions(prop: ExtractedProp) {
  if (
    prop.name === 'labelPosition' &&
    prop.kind === 'select' &&
    prop.options.includes('end') &&
    prop.options.includes('start')
  ) {
    return ['end', 'start'];
  }

  return prop.kind === 'select' ? prop.options : [];
}

export function buildPlaygroundArtifacts(params: {
  componentName: string;
  slug: string;
  componentConfig: ComponentPageMetadata;
  reactApiProps: readonly ExtractedProp[];
  nativeApiProps: readonly ExtractedProp[];
  playgroundProps: readonly ExtractedProp[];
  generatedFileHeader: string;
  getChangeHandlerName(propName: string): string | null;
}) {
  const {
    componentName,
    slug,
    componentConfig,
    playgroundProps,
    reactApiProps,
    nativeApiProps,
    generatedFileHeader,
    getChangeHandlerName,
  } = params;
  const slugIdentifier = identifierFromSlug(slug);

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

  const reactApiPropNames = new Set(reactApiProps.map((prop) => prop.name));
  const nativeApiPropNames = new Set(nativeApiProps.map((prop) => prop.name));

  const reactPropBindings = playgroundProps
    .filter((prop) => reactApiPropNames.has(prop.name))
    .map((prop) => getPlaygroundPropBinding(prop))
    .join('\n          ');

  const nativePropBindings = playgroundProps
    .filter((prop) => nativeApiPropNames.has(prop.name))
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
    .map(
      (prop) => `  ${prop.name}: ${getInitialValue({ prop, componentConfig })},`
    )
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
        const options = getControlOptions(prop);

        return `  {
    type: 'select',
    key: '${prop.name}',
    label: '${label}',
    options: [${options.map((option) => `'${option}'`).join(', ')}],
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

  const schemaContent = `${generatedFileHeader}import type { PlaygroundControl } from '../../shared/PlaygroundControls';

import type { ${componentName}PlaygroundValue } from './${componentName}Playground';

export const ${slugIdentifier}PlaygroundControls = [
${playgroundControlEntries}
] as const satisfies readonly PlaygroundControl<${componentName}PlaygroundValue>[];
`;

  const content = `${generatedFileHeader}'use client';

import type { ReactNode } from 'react';

import { ComponentPlayground } from '../../shared/ComponentPlayground';
import { useComponentDemoState } from '../../shared/ComponentDemoStateProvider';
import { PlaygroundControlsFromSchema } from '../../shared/PlaygroundControls';

import { ${slugIdentifier}PlaygroundControls } from './${slug}PlaygroundSchema';

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
      previewWidth=${toTsLiteral(componentConfig.demo?.previewWidth ?? 'auto')}
      controls={
        <PlaygroundControlsFromSchema
          value={value}
          controls={${slugIdentifier}PlaygroundControls}
          onChange={update}
        />
      }
    >
      {render${componentName}(value, update)}
    </ComponentPlayground>
  );
}
`;

  const initialValues = Object.fromEntries(
    playgroundProps.map((prop) => [
      prop.name,
      getInitialValue({ prop, componentConfig }),
    ])
  ) as Record<string, string | boolean | number>;

  return {
    schemaContent,
    content,
    reactPropBindings,
    nativePropBindings,
    initialValues,
  };
}
