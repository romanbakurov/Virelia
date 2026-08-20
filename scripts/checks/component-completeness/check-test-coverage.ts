import fs from 'node:fs';

import type {
  ComponentMetadata,
  ComponentPlatform,
} from '@vellira-ui/metadata';
import {
  componentTestCoverageContractVersion,
  type ComponentTestCoverageContract,
} from '../../generators/component/coverage-contract';
import { createBaselineTestContract } from '../../generators/component/test-contract';

import type { ComponentCheckResult } from './types';

function expectedContractPlatform(platform: ComponentPlatform) {
  return platform === 'react' ? ('web' as const) : ('native' as const);
}

function sameRequirements(
  actual: readonly string[],
  expected: readonly string[]
) {
  return (
    actual.length === expected.length &&
    actual.every((requirement, index) => requirement === expected[index])
  );
}

export function checkTestCoverageContract(params: {
  contractFile: string;
  testFile: string;
  metadata: ComponentMetadata;
  platform: ComponentPlatform;
}): ComponentCheckResult {
  const { contractFile, testFile, metadata, platform } = params;

  if (!fs.existsSync(contractFile)) {
    return {
      name: 'tests',
      platform,
      ok: false,
      details: `Missing test coverage contract: ${contractFile}`,
    };
  }

  if (!fs.existsSync(testFile)) {
    return {
      name: 'tests',
      platform,
      ok: false,
      details: `Missing test file required by coverage contract: ${testFile}`,
    };
  }

  let contract: ComponentTestCoverageContract;

  try {
    contract = JSON.parse(
      fs.readFileSync(contractFile, 'utf8')
    ) as ComponentTestCoverageContract;
  } catch {
    return {
      name: 'tests',
      platform,
      ok: false,
      details: `Invalid test coverage contract JSON: ${contractFile}`,
    };
  }

  if (contract.version !== componentTestCoverageContractVersion) {
    return {
      name: 'tests',
      platform,
      ok: false,
      details: `Unsupported test coverage contract version in ${contractFile}`,
    };
  }

  if (contract.component !== metadata.name) {
    return {
      name: 'tests',
      platform,
      ok: false,
      details: `Test coverage contract component drift in ${contractFile}: expected ${metadata.name}, received ${contract.component}`,
    };
  }

  const expectedPlatform = expectedContractPlatform(platform);

  if (contract.platform !== expectedPlatform) {
    return {
      name: 'tests',
      platform,
      ok: false,
      details: `Test coverage contract platform drift in ${contractFile}: expected ${expectedPlatform}, received ${contract.platform}`,
    };
  }

  if (contract.profile !== metadata.profile) {
    return {
      name: 'tests',
      platform,
      ok: false,
      details: `Test coverage contract profile drift in ${contractFile}: expected ${metadata.profile}, received ${contract.profile}`,
    };
  }

  const expectedBaseline = createBaselineTestContract({
    profile: metadata.profile,
    control: contract.control,
    capabilities: metadata.capabilities ?? [],
    isNative: platform === 'react-native',
  });

  if (
    !sameRequirements(
      contract.baseline.requirements,
      expectedBaseline.requirements
    )
  ) {
    return {
      name: 'tests',
      platform,
      ok: false,
      details: `Test coverage contract requirements drift in ${contractFile}. Regenerate baseline tests for ${metadata.name}.`,
    };
  }

  const testSource = fs.readFileSync(testFile, 'utf8');
  const expectedMarker = `// Baseline contract: ${expectedBaseline.requirements.join(', ')}`;

  if (!testSource.includes(expectedMarker)) {
    return {
      name: 'tests',
      platform,
      ok: false,
      details: `Generated baseline test contract is stale in ${testFile}. Expected marker: ${expectedMarker}`,
    };
  }

  return {
    name: 'tests',
    platform,
    ok: true,
  };
}
