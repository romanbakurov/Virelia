import { spawnSync } from 'node:child_process';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { generateComponentWebsitePage } from './website';

vi.mock('node:child_process', () => ({
  spawnSync: vi.fn(),
}));

describe('generateComponentWebsitePage', () => {
  beforeEach(() => {
    vi.mocked(spawnSync).mockReset();
  });

  it('runs the component page generator for the generated component', () => {
    vi.mocked(spawnSync).mockReturnValue({
      pid: 1,
      output: [],
      stdout: '',
      stderr: '',
      status: 0,
      signal: null,
    });

    generateComponentWebsitePage({
      root: '/repo',
      componentName: 'Avatar',
    });

    expect(spawnSync).toHaveBeenCalledTimes(1);
    expect(spawnSync).toHaveBeenCalledWith(
      'pnpm',
      ['create:component-page', 'Avatar', '--force'],
      {
        cwd: '/repo',
        encoding: 'utf8',
        stdio: 'pipe',
      }
    );
  });

  it('fails when the component page generator exits unsuccessfully', () => {
    vi.mocked(spawnSync).mockReturnValue({
      pid: 1,
      output: [],
      stdout: 'generator output',
      stderr: 'generator failed',
      status: 1,
      signal: null,
    });

    expect(() =>
      generateComponentWebsitePage({
        root: '/repo',
        componentName: 'Avatar',
      })
    ).toThrow('Website component page generation failed for Avatar.');
  });

  it('fails when the component page generator cannot be started', () => {
    vi.mocked(spawnSync).mockReturnValue({
      pid: 1,
      output: [],
      stdout: '',
      stderr: '',
      status: null,
      signal: null,
      error: new Error('spawn failed'),
    });

    expect(() =>
      generateComponentWebsitePage({
        root: '/repo',
        componentName: 'Avatar',
      })
    ).toThrow(
      'Website component page generation failed for Avatar: spawn failed'
    );
  });
});
