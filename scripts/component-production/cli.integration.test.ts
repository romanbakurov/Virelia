import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { runComponentProductionCli } from './cli';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, {
      recursive: true,
      force: true,
    });
  }
});

describe('component production JSON CLI integration', () => {
  it('wires JSON input through the real production boundary and fails closed before writes', async () => {
    const root = fs.mkdtempSync(
      path.join(os.tmpdir(), 'vellira-component-production-cli-')
    );

    roots.push(root);

    fs.writeFileSync(
      path.join(root, 'avatar.json'),
      JSON.stringify(
        {
          schemaVersion: '1',
          componentName: 'Avatar',
          platform: 'both',
          layer: 'primitives',
          category: 'data-display',
          profile: 'base',
          capabilities: [],
          parts: [],
        },
        null,
        2
      )
    );

    const output: string[] = [];

    const exitCode = await runComponentProductionCli(
      ['--spec', 'avatar.json'],
      {
        root,
        write: (message) => output.push(message),
      }
    );

    expect(exitCode).toBe(1);

    const result = JSON.parse(output[0] ?? '');

    expect(result).toMatchObject({
      schemaVersion: '1',
      input: {
        componentName: 'Avatar',
        platform: 'both',
        profile: 'base',
      },
      status: 'blocked',
      readyForReview: false,
      blockingFindings: [
        {
          id: 'preflight:repository-safety',
          stage: 'preflight',
          severity: 'blocking',
          message: 'Component production requires a Git repository checkout.',
        },
      ],
    });

    expect(result.stages.map((stage: { id: string }) => stage.id)).toEqual([
      'preflight',
      'generation',
      'semantic-completion',
      'format',
      'lint',
      'tests',
      'typecheck',
      'build',
      'storybook',
      'docs',
      'website',
      'completeness',
      'quality',
      'public-api',
      'tooling',
      'visual',
      'smoke',
    ]);

    expect(fs.readdirSync(root).sort()).toEqual(['avatar.json']);
  });
});
