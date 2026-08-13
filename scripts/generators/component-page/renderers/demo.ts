import { toTsString } from '../helpers/format';
import type { ComponentPageMetadata } from '../metadata/metadata';
import type { ExtractedProp, Platform } from '../model/types';

export function renderDemoFiles(params: {
  componentName: string;
  componentConfig: ComponentPageMetadata;
  platforms: readonly Platform[];
  playgroundProps: readonly ExtractedProp[];
  playgroundPropBindings: string;
  reactStaticDemoProps: string;
  nativeStaticDemoProps: string;
  reactDemoChildren: string;
  nativeDemoChildren: string;
  nativeResponsivePresentation: boolean;
  generatedFileHeader: string;
  getChangeHandlerName(propName: string): string | null;
}) {
  const {
    componentName,
    componentConfig,
    platforms,
    playgroundProps,
    playgroundPropBindings,
    reactStaticDemoProps,
    nativeStaticDemoProps,
    reactDemoChildren,
    nativeDemoChildren,
    nativeResponsivePresentation,
    generatedFileHeader,
    getChangeHandlerName,
  } = params;

  function isPlaygroundProp(name: string) {
    return playgroundProps.some((prop) => prop.name === name);
  }

  const demoPresentationProps = [
    componentConfig.demo?.label && !isPlaygroundProp('label')
      ? `label=${toTsString(componentConfig.demo.label)}`
      : null,
    componentConfig.demo?.description && !isPlaygroundProp('description')
      ? `description=${toTsString(componentConfig.demo.description)}`
      : null,
  ]
    .filter(Boolean)
    .join('\n          ');

  const staticDemoProps = Object.entries(
    componentConfig.demo?.staticProps ?? {}
  )
    .map(([name, value]) => `${name}={${value}}`)
    .join('\n          ');

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

    const formattedChildren = children
      .split('\n')
      .map((line) => `          ${line}`)
      .join('\n');

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

  const reactContent = `${generatedFileHeader}'use client';

import { ${componentName} } from '@vellira-ui/react';
${componentConfig.react?.imports?.join('\n') ?? ''}

import { ${componentName}Playground } from './${componentName}Playground';

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

  const nativeContent = `${generatedFileHeader}'use client';

${nativeResponsiveImport}import { ${componentName} } from '@vellira-ui/react-native';
${componentConfig.native?.imports?.join('\n') ?? ''}

import { ${componentName}Playground } from './${componentName}Playground';

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

  return {
    reactContent: platforms.includes('react') ? reactContent : null,
    nativeContent: platforms.includes('react-native') ? nativeContent : null,
  };
}
