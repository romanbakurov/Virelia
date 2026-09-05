import { applyChildPropBindings, toTsString } from '../helpers/format';
import type { ComponentPageMetadata } from '../metadata/metadata';
import type { ExtractedProp, Platform } from '../model/types';

export function renderDemoFiles(params: {
  componentName: string;
  componentConfig: ComponentPageMetadata;
  platforms: readonly Platform[];
  playgroundProps: readonly ExtractedProp[];
  reactApiProps: readonly ExtractedProp[];
  nativeApiProps: readonly ExtractedProp[];
  reactPlaygroundPropBindings: string;
  nativePlaygroundPropBindings: string;
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
    reactApiProps,
    nativeApiProps,
    reactPlaygroundPropBindings,
    nativePlaygroundPropBindings,
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

  function hasPropBinding(source: string, propName: string) {
    return new RegExp(`(^|\\s)${propName}\\s*=`).test(source);
  }

  function hasApiProp(platform: Platform, propName: string) {
    const apiProps = platform === 'react' ? reactApiProps : nativeApiProps;

    return apiProps.some((prop) => prop.name === propName);
  }

  function createDemoShortcutProps(platform: Platform, propBindings: string) {
    return [
      componentConfig.demo?.label &&
      hasApiProp(platform, 'label') &&
      !hasPropBinding(propBindings, 'label')
        ? `label=${toTsString(componentConfig.demo.label)}`
        : null,
      componentConfig.demo?.description &&
      hasApiProp(platform, 'description') &&
      !hasPropBinding(propBindings, 'description')
        ? `description=${toTsString(componentConfig.demo.description)}`
        : null,
    ]
      .filter(Boolean)
      .join('\n          ');
  }

  function createStaticDemoProps(platformStaticProps: string) {
    return Object.entries(componentConfig.demo?.staticProps ?? {})
      .filter(
        ([name]) =>
          !isPlaygroundProp(name) && !hasPropBinding(platformStaticProps, name)
      )
      .map(([name, value]) => `${name}={${value}}`)
      .join('\n          ');
  }

  function createPlatformSetup(platform: Platform) {
    const statements =
      platform === 'react'
        ? (componentConfig.react?.setup ?? [])
        : (componentConfig.native?.setup ?? []);

    if (statements.length === 0) return '';

    const setup = statements
      .map((statement) => statement.trim())
      .filter(Boolean)
      .map((statement) => `  ${statement}`)
      .join('\n');

    return setup ? `${setup}\n\n` : '';
  }

  const reactPlatformSetup = createPlatformSetup('react');
  const nativePlatformSetup = createPlatformSetup('react-native');

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

    const platformConfig =
      platform === 'react' ? componentConfig.react : componentConfig.native;

    const children = applyChildPropBindings(
      platform === 'react' ? reactDemoChildren : nativeDemoChildren,
      platformConfig?.childPropBindings ?? []
    );

    const staticProps =
      platform === 'react' ? reactStaticDemoProps : nativeStaticDemoProps;
    const sharedStaticDemoProps = createStaticDemoProps(staticProps);
    const demoShortcutProps = createDemoShortcutProps(platform, propBindings);

    const props = [
      staticProps,
      sharedStaticDemoProps,
      platform === 'react-native' && nativeResponsivePresentation
        ? 'presentation={presentation}'
        : '',
      propBindings,
      demoShortcutProps,
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
    propBindings: reactPlaygroundPropBindings,
  });

  const nativeDemoElement = createDemoElement({
    platform: 'react-native',
    propBindings: nativePlaygroundPropBindings,
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
${reactPlatformSetup}  return (
    <${componentName}Playground
      platform='react'
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
${nativePlatformSetup}${nativeResponsiveSetup}  return (
    <${componentName}Playground
      platform='react-native'
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
