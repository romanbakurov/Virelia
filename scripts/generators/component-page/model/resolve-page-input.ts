import {
  existsInPackage,
  extractComponentProps,
  extractPlatformProps,
} from '../extractors/source';
import { capitalize } from '../helpers/format';
import {
  loadComponentMetadata,
  mergeComponentMetadata,
  validateComponentMetadata,
} from '../metadata/metadata';
import type { ExtractedProp, Platform } from './types';
import {
  getProfileMetadata,
  inferComponentProfile,
} from '../profiles/profiles';

export function resolveExtractedProps(params: {
  sharedProps: readonly ExtractedProp[];
  reactApiProps: readonly ExtractedProp[];
  nativeApiProps: readonly ExtractedProp[];
}) {
  if (params.sharedProps.length > 0) {
    return [...params.sharedProps];
  }

  const propsByName = new Map<string, ExtractedProp>();

  for (const prop of [...params.reactApiProps, ...params.nativeApiProps]) {
    if (!propsByName.has(prop.name)) {
      propsByName.set(prop.name, prop);
    }
  }

  return [...propsByName.values()];
}

export async function resolvePageInput(params: {
  root: string;
  catalogComponentsRoot: string;
  componentName: string;
}) {
  const { root, catalogComponentsRoot, componentName } = params;

  const componentMetadata = await loadComponentMetadata({
    catalogComponentsRoot,
    componentName,
  });

  const inferredComponentProfile =
    componentMetadata.profile ?? inferComponentProfile(componentName);

  const componentConfig = mergeComponentMetadata(
    getProfileMetadata(inferredComponentProfile),
    componentMetadata
  );

  validateComponentMetadata({
    componentName,
    metadata: componentConfig,
  });

  const componentProfile = componentConfig.profile ?? inferredComponentProfile;

  function getDemoProps(platform: Platform) {
    if (platform === 'react') {
      return componentConfig.react?.demoProps ?? '';
    }

    return componentConfig.native?.demoProps ?? '';
  }

  const platforms: Platform[] = [];

  if (existsInPackage({ root, packageName: 'react', componentName })) {
    platforms.push('react');
  }

  if (existsInPackage({ root, packageName: 'react-native', componentName })) {
    platforms.push('react-native');
  }

  const reactApiProps = platforms.includes('react')
    ? extractPlatformProps({ root, componentName, platform: 'react' })
    : [];

  const nativeApiProps = platforms.includes('react-native')
    ? extractPlatformProps({ root, componentName, platform: 'react-native' })
    : [];

  const sharedProps = extractComponentProps({ root, componentName });
  const extractedProps = resolveExtractedProps({
    sharedProps,
    reactApiProps,
    nativeApiProps,
  });

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

  const apiPropNames = new Set(
    [...reactApiProps, ...nativeApiProps].map((prop) => prop.name)
  );

  function getChangeHandlerName(propName: string) {
    const handlerName = `on${capitalize(propName)}Change`;

    return apiPropNames.has(handlerName) ? handlerName : null;
  }

  return {
    componentConfig,
    componentProfile,
    extractedProps,
    playgroundProps,
    platforms,
    reactApiProps,
    nativeApiProps,
    getDemoProps,
    getChangeHandlerName,
  };
}
