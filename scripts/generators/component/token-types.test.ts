import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getGeneratedTokenTypesFile,
  synchronizeGeneratedTokenTypes,
} from './token-types';

vi.mock('node:child_process', () => ({
  spawnSync: vi.fn(),
}));

const tempRoots: string[] = [];

function createTempRoot() {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-generated-token-types-')
  );

  tempRoots.push(root);

  return root;
}

function successfulSpawnResult() {
  return {
    pid: 1,
    output: [],
    stdout: '',
    stderr: '',
    status: 0,
    signal: null,
  };
}

beforeEach(() => {
  vi.mocked(spawnSync).mockReset();
});

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, {
      recursive: true,
      force: true,
    });
  }
});

describe('generated token type synchronization', () => {
  it('reports an existing generated token type file only when content changes', () => {
    const root = createTempRoot();
    const outputFile = getGeneratedTokenTypesFile(root);

    fs.mkdirSync(path.dirname(outputFile), {
      recursive: true,
    });
    fs.writeFileSync(outputFile, 'before\n');

    vi.mocked(spawnSync).mockImplementation(() => {
      fs.writeFileSync(outputFile, 'after\n');

      return successfulSpawnResult();
    });

    expect(synchronizeGeneratedTokenTypes({ root })).toEqual({
      createdFiles: [],
      updatedFiles: [outputFile],
    });

    expect(spawnSync).toHaveBeenCalledWith(
      'pnpm',
      ['--filter', '@vellira-ui/tokens', 'generate:types'],
      {
        cwd: root,
        encoding: 'utf8',
        stdio: 'pipe',
      }
    );
  });

  it('does not report the generated token type file when content is unchanged', () => {
    const root = createTempRoot();
    const outputFile = getGeneratedTokenTypesFile(root);

    fs.mkdirSync(path.dirname(outputFile), {
      recursive: true,
    });
    fs.writeFileSync(outputFile, 'stable\n');

    vi.mocked(spawnSync).mockReturnValue(successfulSpawnResult());

    expect(synchronizeGeneratedTokenTypes({ root })).toEqual({
      createdFiles: [],
      updatedFiles: [],
    });
  });

  it('reports a newly created generated token type file', () => {
    const root = createTempRoot();
    const outputFile = getGeneratedTokenTypesFile(root);

    vi.mocked(spawnSync).mockImplementation(() => {
      fs.mkdirSync(path.dirname(outputFile), {
        recursive: true,
      });
      fs.writeFileSync(outputFile, 'generated\n');

      return successfulSpawnResult();
    });

    expect(synchronizeGeneratedTokenTypes({ root })).toEqual({
      createdFiles: [outputFile],
      updatedFiles: [],
    });
  });

  it('fails closed when canonical token type generation fails', () => {
    const root = createTempRoot();

    vi.mocked(spawnSync).mockReturnValue({
      pid: 1,
      output: [],
      stdout: '',
      stderr: 'token generation failed',
      status: 1,
      signal: null,
    });

    expect(() => synchronizeGeneratedTokenTypes({ root })).toThrow(
      'Generated token type synchronization failed.\ntoken generation failed'
    );
  });
});
