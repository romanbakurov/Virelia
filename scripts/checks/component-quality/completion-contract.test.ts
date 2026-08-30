import { afterEach, describe, expect, it } from 'vitest';

import {
  nativeLayoutOnlyMetadata,
  passingProductionNativeMetadata,
  passingProductionWebMetadata,
} from './fixtures/metadata';
import {
  createNativeLayoutOnlyFixture,
  createPassingNativeFixture,
  createPassingWebFixture,
} from './fixtures/production';
import {
  createFixtureRepo,
  removeFixtureRepo,
  writeFixtureFile,
} from './fixtures/repo';

import { buildComponentQualityCompletionContract } from './completion-contract';
import { componentQualityRules } from './rules';

const fixtureRoots: string[] = [];

function createRepo() {
  const rootDir = createFixtureRepo();
  fixtureRoots.push(rootDir);
  return rootDir;
}

afterEach(() => {
  for (const rootDir of fixtureRoots.splice(0)) {
    removeFixtureRepo(rootDir);
  }
});

describe('Component Quality completion contract', () => {
  it('exposes applicable web requirements with completion guidance', async () => {
    const rootDir = createRepo();

    createPassingWebFixture(rootDir);

    writeFixtureFile(
      rootDir,
      'packages/react/src/components/PassingProductionWeb/PassingProductionWeb.tsx',
      `
export function PassingProductionWeb() {
  return <div>Fixture</div>;
}
`
    );

    const contract = await buildComponentQualityCompletionContract({
      componentName: 'PassingProductionWeb',
      metadataRegistry: [passingProductionWebMetadata],
      rootDir,
    });

    expect(contract.schemaVersion).toBe('1');
    expect(contract.componentName).toBe('PassingProductionWeb');

    const web = contract.platforms.find(({ platform }) => platform === 'react');

    expect(web).toBeDefined();

    const accessibility = web?.requirements.find(
      ({ ruleId }) => ruleId === 'platform.accessibility-semantics'
    );

    expect(accessibility).toMatchObject({
      severity: 'required',
      evaluation: 'automated',
      guidance: {
        evidence: expect.arrayContaining([
          'semantic HTML element such as button, input, select, textarea, or anchor',
          'role attribute',
          'ARIA attribute',
        ]),
      },
    });

    expect(accessibility?.description).toContain('accessibility semantics');
    expect(accessibility).not.toHaveProperty('currentStatus');
    expect(accessibility).not.toHaveProperty('message');

    const tokenIntegration = web?.requirements.find(
      ({ ruleId }) => ruleId === 'conformity.token-integration'
    );

    expect(tokenIntegration).toMatchObject({
      severity: 'required',
      guidance: {
        evidence: expect.arrayContaining([
          'CSS custom property via var(--...)',
          '@use from @styles',
        ]),
      },
    });
  });

  it('exposes applicable React Native requirements with completion guidance', async () => {
    const rootDir = createRepo();

    createPassingNativeFixture(rootDir);

    writeFixtureFile(
      rootDir,
      'packages/react-native/src/components/PassingProductionNative/PassingProductionNative.styles.ts',
      `
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: '#ffffff',
    padding: 8,
  },
});
`
    );

    const contract = await buildComponentQualityCompletionContract({
      componentName: 'PassingProductionNative',
      metadataRegistry: [passingProductionNativeMetadata],
      rootDir,
    });

    const native = contract.platforms.find(
      ({ platform }) => platform === 'react-native'
    );

    expect(native).toBeDefined();

    const accessibility = native?.requirements.find(
      ({ ruleId }) => ruleId === 'platform.accessibility-semantics'
    );

    expect(accessibility).toMatchObject({
      severity: 'required',
      guidance: {
        evidence: expect.arrayContaining([
          'accessibilityRole',
          'accessibilityLabel',
          'accessibilityState',
          'accessibilityHint',
          'accessible',
        ]),
      },
    });

    const tokenIntegration = native?.requirements.find(
      ({ ruleId }) => ruleId === 'conformity.token-integration'
    );

    expect(tokenIntegration).toMatchObject({
      severity: 'required',
      guidance: {
        evidence: expect.arrayContaining([
          'theme.tokens.*',
          'theme.components.*',
          'theme.semantic.*',
        ]),
      },
    });
  });

  it('omits not-applicable requirements', async () => {
    const rootDir = createRepo();

    createNativeLayoutOnlyFixture(rootDir);

    const contract = await buildComponentQualityCompletionContract({
      componentName: 'NativeLayoutOnly',
      metadataRegistry: [nativeLayoutOnlyMetadata],
      rootDir,
    });

    const native = contract.platforms.find(
      ({ platform }) => platform === 'react-native'
    );

    expect(
      native?.requirements.some(
        ({ ruleId }) => ruleId === 'conformity.token-integration'
      )
    ).toBe(false);
  });

  it('preserves canonical rule ordering for applicable requirements', async () => {
    const rootDir = createRepo();

    createPassingWebFixture(rootDir);

    const contract = await buildComponentQualityCompletionContract({
      componentName: 'PassingProductionWeb',
      metadataRegistry: [passingProductionWebMetadata],
      rootDir,
    });

    const web = contract.platforms.find(({ platform }) => platform === 'react');

    expect(web).toBeDefined();

    const actualRuleIds = web?.requirements.map(({ ruleId }) => ruleId) ?? [];

    const canonicalRuleIds = componentQualityRules
      .map(({ definition }) => definition.id)
      .filter((ruleId) => actualRuleIds.includes(ruleId));

    expect(actualRuleIds).toEqual(canonicalRuleIds);
  });
});
