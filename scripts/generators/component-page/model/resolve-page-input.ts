import fs from 'node:fs';

import {
  existsInPackage,
  extractComponentProps,
  extractPlatformProps,
  findTypeSourceFile,
} from '../extractors/source';
import { capitalize } from '../helpers/format';
import {
  loadComponentMetadata,
  mergeComponentMetadata,
  validateComponentMetadata,
} from '../metadata/metadata';
import type { Platform } from './types';
import {
  getProfileMetadata,
  inferComponentProfile,
} from '../profiles/profiles';

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

  const extractedProps = extractComponentProps({ root, componentName });

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

  const componentTypeFile = findTypeSourceFile({
    root,
    name: componentName.charAt(0).toLowerCase() + componentName.slice(1),
  });

  const componentTypeSource = componentTypeFile
    ? fs.readFileSync(componentTypeFile, 'utf8')
    : '';

  function getChangeHandlerName(propName: string) {
    const handlerName = `on${capitalize(propName)}Change`;

    return componentTypeSource.includes(handlerName) ? handlerName : null;
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
