import fs from 'node:fs';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { runComponentQualityCheck } from './engine';
import {
  passingProductionNativeMetadata,
  passingProductionWebMetadata,
  passingProductionCrossPlatformMetadata,
  notApplicableProductionMetadata,
  nativeLayoutOnlyMetadata,
} from './fixtures/metadata';
import {
  createNativeLayoutOnlyFixture,
  createNotApplicableFixture,
  createPassingCrossPlatformFixture,
  createPassingNativeFixture,
  createPassingWebFixture,
} from './fixtures/production';
import {
  createFixtureRepo,
  removeFixtureRepo,
  writeFixtureFile,
} from './fixtures/repo';
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

describe('Component Quality Checker production rule regressions', () => {
  it('passes a representative high-quality Web component', async () => {
    const rootDir = createRepo();

    createPassingWebFixture(rootDir);

    const result = await runComponentQualityCheck({
      metadataRegistry: [passingProductionWebMetadata],
      componentName: 'PassingProductionWeb',
      rootDir,
      rules: componentQualityRules,
    });

    expect(result.status).toBe('pass');
  });

  it('fails when required test coverage is missing', async () => {
    const rootDir = createRepo();

    createPassingWebFixture(rootDir);

    fs.rmSync(
      path.join(
        rootDir,
        'packages/react/src/components/PassingProductionWeb/PassingProductionWeb.test.tsx'
      )
    );

    const result = await runComponentQualityCheck({
      metadataRegistry: [passingProductionWebMetadata],
      componentName: 'PassingProductionWeb',
      rootDir,
      rules: componentQualityRules,
    });

    expect(result.status).toBe('fail');
    expect(
      result.report.components[0]?.findings.some(
        (finding) =>
          finding.ruleId === 'coverage.tests' && finding.status === 'fail'
      )
    ).toBe(true);
  });

  it('warns when Storybook coverage is missing', async () => {
    const rootDir = createRepo();

    createPassingWebFixture(rootDir);

    fs.rmSync(
      path.join(
        rootDir,
        'packages/react/src/components/PassingProductionWeb/PassingProductionWeb.stories.tsx'
      )
    );

    const result = await runComponentQualityCheck({
      metadataRegistry: [passingProductionWebMetadata],
      componentName: 'PassingProductionWeb',
      rootDir,
      rules: componentQualityRules,
    });

    expect(result.status).toBe('warn');
    expect(
      result.report.components[0]?.findings.some(
        (finding) =>
          finding.ruleId === 'coverage.storybook' && finding.status === 'warn'
      )
    ).toBe(true);
  });

  it('fails when a hardcoded color bypasses design tokens', async () => {
    const rootDir = createRepo();

    createPassingWebFixture(rootDir);

    writeFixtureFile(
      rootDir,
      'packages/react/src/components/PassingProductionWeb/PassingProductionWeb.module.scss',
      `
.root {
  color: #ff0000;
  padding: var(--space-2);
}
`
    );

    const result = await runComponentQualityCheck({
      metadataRegistry: [passingProductionWebMetadata],
      componentName: 'PassingProductionWeb',
      rootDir,
      rules: componentQualityRules,
    });

    expect(result.status).toBe('fail');
    expect(
      result.report.components[0]?.findings.some(
        (finding) =>
          finding.ruleId === 'conformity.hardcoded-color' &&
          finding.status === 'fail'
      )
    ).toBe(true);
  });

  it('passes a representative Native-only component without Web requirements', async () => {
    const rootDir = createRepo();

    createPassingNativeFixture(rootDir);

    const result = await runComponentQualityCheck({
      metadataRegistry: [passingProductionNativeMetadata],
      componentName: 'PassingProductionNative',
      rootDir,
      rules: componentQualityRules,
    });

    expect(result.status).toBe('pass');

    expect(result.report.components[0]?.platforms).toHaveLength(1);
    expect(result.report.components[0]?.platforms[0]?.platform).toBe(
      'react-native'
    );
  });

  it('allows intentional Web and Native implementation divergence', async () => {
    const rootDir = createRepo();

    createPassingCrossPlatformFixture(rootDir);

    const result = await runComponentQualityCheck({
      metadataRegistry: [passingProductionCrossPlatformMetadata],
      componentName: 'PassingProductionCrossPlatform',
      rootDir,
      rules: componentQualityRules,
    });

    expect(result.status).toBe('pass');

    expect(
      result.report.components[0]?.platforms.map(({ platform }) => platform)
    ).toEqual(['react', 'react-native']);
  });

  it('preserves not-applicable results for intentionally unsupported quality surfaces', async () => {
    const rootDir = createRepo();

    createNotApplicableFixture(rootDir);

    const result = await runComponentQualityCheck({
      metadataRegistry: [notApplicableProductionMetadata],
      componentName: 'NotApplicableProduction',
      rootDir,
      rules: componentQualityRules,
    });

    const findings = result.report.components[0]?.findings ?? [];

    expect(
      findings.find(
        ({ ruleId }) => ruleId === 'platform.accessibility-semantics'
      )?.status
    ).toBe('not-applicable');

    expect(
      findings.find(({ ruleId }) => ruleId === 'coverage.tests')?.status
    ).toBe('not-applicable');

    expect(
      findings.find(({ ruleId }) => ruleId === 'coverage.storybook')?.status
    ).toBe('not-applicable');

    expect(
      findings.find(({ ruleId }) => ruleId === 'coverage.documentation')?.status
    ).toBe('not-applicable');
  });

  it('ignores hardcoded design values inside tests and stories', async () => {
    const rootDir = createRepo();

    createPassingWebFixture(rootDir);

    writeFixtureFile(
      rootDir,
      'packages/react/src/components/PassingProductionWeb/PassingProductionWeb.test.tsx',
      `
import { expect, it } from 'vitest';

it('uses fixture-only visual values', () => {
  const fixtureColor = '#ff0000';
  expect(fixtureColor).toContain('#');
});
`
    );

    writeFixtureFile(
      rootDir,
      'packages/react/src/components/PassingProductionWeb/PassingProductionWeb.stories.tsx',
      `
export const Default = {};
export const Disabled = { args: { disabled: true } };

const fixtureColor = '#00ff00';
void fixtureColor;
`
    );

    const result = await runComponentQualityCheck({
      metadataRegistry: [passingProductionWebMetadata],
      componentName: 'PassingProductionWeb',
      rootDir,
      rules: componentQualityRules,
    });

    expect(
      result.report.components[0]?.findings.find(
        ({ ruleId }) => ruleId === 'conformity.hardcoded-color'
      )?.status
    ).toBe('pass');
  });

  it('does not require theme tokens for layout-only Native styles', async () => {
    const rootDir = createRepo();

    createNativeLayoutOnlyFixture(rootDir);

    const result = await runComponentQualityCheck({
      metadataRegistry: [nativeLayoutOnlyMetadata],
      componentName: 'NativeLayoutOnly',
      rootDir,
      rules: componentQualityRules,
    });

    expect(
      result.report.components[0]?.findings.find(
        ({ ruleId }) => ruleId === 'conformity.token-integration'
      )?.status
    ).toBe('not-applicable');
  });

  it('fails when the public Props contract is missing', async () => {
    const rootDir = createRepo();

    createPassingWebFixture(rootDir);

    fs.rmSync(
      path.join(
        rootDir,
        'packages/react/src/components/PassingProductionWeb/types.ts'
      )
    );

    writeFixtureFile(
      rootDir,
      'packages/react/src/components/PassingProductionWeb/index.ts',
      `
export { PassingProductionWeb } from './PassingProductionWeb';
`
    );

    writeFixtureFile(
      rootDir,
      'packages/react/src/components/PassingProductionWeb/PassingProductionWeb.tsx',
      `
export function PassingProductionWeb() {
  return <button>Fixture</button>;
}
`
    );

    const result = await runComponentQualityCheck({
      metadataRegistry: [passingProductionWebMetadata],
      componentName: 'PassingProductionWeb',
      rootDir,
      rules: componentQualityRules,
    });

    expect(
      result.report.components[0]?.findings.find(
        ({ ruleId }) => ruleId === 'api.public-surface'
      )?.status
    ).toBe('fail');
  });

  it('fails when declared capability source evidence drifts', async () => {
    const rootDir = createRepo();

    createPassingWebFixture(rootDir);

    writeFixtureFile(
      rootDir,
      'packages/react/src/components/PassingProductionWeb/types.ts',
      `
export interface PassingProductionWebProps {}
`
    );

    writeFixtureFile(
      rootDir,
      'packages/react/src/components/PassingProductionWeb/PassingProductionWeb.tsx',
      `
import type { PassingProductionWebProps } from './types';

export function PassingProductionWeb(
  _props: PassingProductionWebProps
) {
  return <button>Fixture</button>;
}
`
    );

    const result = await runComponentQualityCheck({
      metadataRegistry: [passingProductionWebMetadata],
      componentName: 'PassingProductionWeb',
      rootDir,
      rules: componentQualityRules,
    });

    expect(
      result.report.components[0]?.findings.find(
        ({ ruleId }) => ruleId === 'api.declared-capabilities'
      )?.status
    ).toBe('fail');
  });

  it('fails when required accessibility semantics are missing', async () => {
    const rootDir = createRepo();

    createPassingWebFixture(rootDir);

    writeFixtureFile(
      rootDir,
      'packages/react/src/components/PassingProductionWeb/PassingProductionWeb.tsx',
      `
import type { PassingProductionWebProps } from './types';

export function PassingProductionWeb({
  disabled,
}: PassingProductionWebProps) {
  return <div data-disabled={disabled}>Fixture</div>;
}
`
    );

    const result = await runComponentQualityCheck({
      metadataRegistry: [passingProductionWebMetadata],
      componentName: 'PassingProductionWeb',
      rootDir,
      rules: componentQualityRules,
    });

    expect(
      result.report.components[0]?.findings.find(
        ({ ruleId }) => ruleId === 'platform.accessibility-semantics'
      )?.status
    ).toBe('fail');
  });

  it('fails when required documentation surfaces are incomplete', async () => {
    const rootDir = createRepo();

    createPassingWebFixture(rootDir);

    fs.rmSync(
      path.join(
        rootDir,
        'apps/website/src/component-catalog/components/PassingProductionWeb/PassingProductionWebAccessibility.tsx'
      )
    );

    const result = await runComponentQualityCheck({
      metadataRegistry: [passingProductionWebMetadata],
      componentName: 'PassingProductionWeb',
      rootDir,
      rules: componentQualityRules,
    });

    expect(
      result.report.components[0]?.findings.find(
        ({ ruleId }) => ruleId === 'coverage.documentation'
      )?.status
    ).toBe('fail');
  });

  it('fails when a styled Web component bypasses token integration', async () => {
    const rootDir = createRepo();

    createPassingWebFixture(rootDir);

    writeFixtureFile(
      rootDir,
      'packages/react/src/components/PassingProductionWeb/PassingProductionWeb.module.scss',
      `
.root {
  padding: 0;
}
`
    );

    const result = await runComponentQualityCheck({
      metadataRegistry: [passingProductionWebMetadata],
      componentName: 'PassingProductionWeb',
      rootDir,
      rules: componentQualityRules,
    });

    expect(
      result.report.components[0]?.findings.find(
        ({ ruleId }) => ruleId === 'conformity.token-integration'
      )?.status
    ).toBe('fail');
  });
});
