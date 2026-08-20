import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import type { ComponentMetadata } from '@vellira-ui/metadata';
import {
  createComponentTestCoverageContract,
  renderComponentTestCoverageContract,
} from '../../generators/component/coverage-contract';
import { checkTestCoverageContract } from './check-test-coverage';

const roots: string[] = [];

function createRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vellira-test-contract-'));
  roots.push(root);
  return root;
}

const metadata: ComponentMetadata = {
  name: 'Switch',
  layer: 'components',
  category: 'form',
  platforms: ['react'],
  profile: 'form-control',
  status: 'stable',
  capabilities: [
    'controlled',
    'uncontrolled',
    'disabled',
    'required',
    'invalid',
  ],
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
  },
};

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('test coverage contract completeness validation', () => {
  it('passes when metadata, contract, and generated test marker agree', () => {
    const root = createRoot();
    const contractFile = path.join(root, 'Switch.test-contract.json');
    const testFile = path.join(root, 'Switch.test.tsx');
    const contract = createComponentTestCoverageContract({
      componentName: 'Switch',
      profile: 'form-control',
      control: 'boolean',
      capabilities: metadata.capabilities ?? [],
      isNative: false,
    });

    fs.writeFileSync(contractFile, renderComponentTestCoverageContract(contract));
    fs.writeFileSync(
      testFile,
      `// Baseline contract: ${contract.baseline.requirements.join(', ')}\n`
    );

    expect(
      checkTestCoverageContract({
        contractFile,
        testFile,
        metadata,
        platform: 'react',
      })
    ).toEqual({ name: 'tests', platform: 'react', ok: true });
  });

  it('fails when metadata capabilities invalidate the generated contract', () => {
    const root = createRoot();
    const contractFile = path.join(root, 'Switch.test-contract.json');
    const testFile = path.join(root, 'Switch.test.tsx');
    const contract = createComponentTestCoverageContract({
      componentName: 'Switch',
      profile: 'form-control',
      control: 'boolean',
      capabilities: ['controlled', 'uncontrolled'],
      isNative: false,
    });

    fs.writeFileSync(contractFile, renderComponentTestCoverageContract(contract));
    fs.writeFileSync(
      testFile,
      `// Baseline contract: ${contract.baseline.requirements.join(', ')}\n`
    );

    const result = checkTestCoverageContract({
      contractFile,
      testFile,
      metadata,
      platform: 'react',
    });

    expect(result.ok).toBe(false);
    expect(result.details).toContain('requirements drift');
  });

  it('fails when generated tests no longer match the contract marker', () => {
    const root = createRoot();
    const contractFile = path.join(root, 'Switch.test-contract.json');
    const testFile = path.join(root, 'Switch.test.tsx');
    const contract = createComponentTestCoverageContract({
      componentName: 'Switch',
      profile: 'form-control',
      control: 'boolean',
      capabilities: metadata.capabilities ?? [],
      isNative: false,
    });

    fs.writeFileSync(contractFile, renderComponentTestCoverageContract(contract));
    fs.writeFileSync(testFile, '// Baseline contract: render\n');

    const result = checkTestCoverageContract({
      contractFile,
      testFile,
      metadata,
      platform: 'react',
    });

    expect(result.ok).toBe(false);
    expect(result.details).toContain('baseline test contract is stale');
  });
});
