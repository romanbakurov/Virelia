import {
  createPackageProgram,
  existsInPackage,
  extractComponentProps,
  extractPlatformPartProps,
  extractPlatformProps,
  listComponentParts,
} from '../extractors/source';
import { capitalize } from '../helpers/format';
import {
  loadComponentMetadata,
  loadGeneratedComponentCategory,
  loadGeneratedComponentProfile,
  mergeComponentMetadata,
  validateComponentMetadata,
} from '../metadata/metadata';
import type { ExtractedProp, Platform } from './types';
import {
  getGeneratedCompositionMetadata,
  getProfileMetadata,
  inferComponentProfile,
  resolveCatalogCategory,
  type ComponentProfile,
  type GeneratorComponentCategory,
} from '../profiles/profiles';

export function resolveComponentPageProfile(params: {
  componentName: string;
  metadataProfile?: ComponentProfile;
  requestedProfile?: ComponentProfile;
  generatedProfile?: ComponentProfile;
}): ComponentProfile {
  const legacyProfile = inferComponentProfile(params.componentName);

  return (
    params.metadataProfile ??
    (legacyProfile !== 'primitive'
      ? legacyProfile
      : (params.requestedProfile ?? params.generatedProfile ?? legacyProfile))
  );
}

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
  requestedProfile?: ComponentProfile;
  requestedCategory?: GeneratorComponentCategory;
}) {
  const { root, catalogComponentsRoot, componentName } = params;

  const componentMetadata = await loadComponentMetadata({
    catalogComponentsRoot,
    componentName,
  });

  const platforms: Platform[] = [];

  if (existsInPackage({ root, packageName: 'react', componentName })) {
    platforms.push('react');
  }

  if (existsInPackage({ root, packageName: 'react-native', componentName })) {
    platforms.push('react-native');
  }

  const generatedComponentProfile = loadGeneratedComponentProfile({
    root,
    componentName,
  });

  const generatedComponentCategory = loadGeneratedComponentCategory({
    root,
    componentName,
  });

  const inferredComponentProfile = resolveComponentPageProfile({
    componentName,
    metadataProfile: componentMetadata.profile,
    requestedProfile: params.requestedProfile,
    generatedProfile: generatedComponentProfile,
  });

  const parts = Array.from(
    new Set(
      platforms.flatMap((platform) =>
        listComponentParts({
          root,
          platform,
          componentName,
        })
      )
    )
  ).sort((left, right) => left.localeCompare(right));

  const partProps =
    inferredComponentProfile === 'compound' && parts.length > 0
      ? (Object.fromEntries(
          platforms.map((platform) => {
            const program = createPackageProgram({ root, platform });

            return [
              platform,
              Object.fromEntries(
                parts.map((partName) => [
                  partName,
                  extractPlatformPartProps({
                    root,
                    componentName,
                    platform,
                    partName,
                    program,
                  }),
                ])
              ),
            ];
          })
        ) as Partial<
          Record<Platform, Record<string, readonly ExtractedProp[]>>
        >)
      : undefined;

  const generatedComposition = getGeneratedCompositionMetadata({
    profile: inferredComponentProfile,
    componentName,
    parts,
    partProps,
    platforms: platforms.filter((platform) =>
      platform === 'react'
        ? !componentMetadata.react?.children
        : !componentMetadata.native?.children
    ),
  });

  const componentConfig = mergeComponentMetadata(
    mergeComponentMetadata(
      getProfileMetadata(inferredComponentProfile),
      generatedComposition
    ),
    componentMetadata
  );

  validateComponentMetadata({
    componentName,
    metadata: componentConfig,
  });

  const componentProfile = componentConfig.profile ?? inferredComponentProfile;

  const catalogCategory = resolveCatalogCategory({
    profile: componentProfile,
    requestedCategory: params.requestedCategory,
    generatedCategory: generatedComponentCategory,
  });

  function getDemoProps(platform: Platform) {
    if (platform === 'react') {
      return componentConfig.react?.demoProps ?? '';
    }

    return componentConfig.native?.demoProps ?? '';
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
    catalogCategory,
    parts,
    extractedProps,
    playgroundProps,
    platforms,
    reactApiProps,
    nativeApiProps,
    getDemoProps,
    getChangeHandlerName,
  };
}
