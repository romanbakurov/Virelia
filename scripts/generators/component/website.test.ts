import { spawnSync } from 'node:child_process';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  generateComponentWebsitePage,
  resolveWebsiteComponentProfile,
} from './website';

vi.mock('node:child_process', () => ({
  spawnSync: vi.fn(),
}));

describe('generateComponentWebsitePage', () => {
  beforeEach(() => {
    vi.mocked(spawnSync).mockReset();
  });

  it('passes the canonical component profile to the page generator', () => {
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
      componentName: 'Accordion',
      profile: 'compound',
      category: 'navigation',
    });

    expect(spawnSync).toHaveBeenCalledTimes(1);
    expect(spawnSync).toHaveBeenCalledWith(
      'pnpm',
      [
        'create:component-page',
        'Accordion',
        '--force',
        '--profile=compound',
        '--category=navigation',
      ],
      {
        cwd: '/repo',
        encoding: 'utf8',
        stdio: 'pipe',
      }
    );
  });

  it('maps the base generator profile to primitive website profile', () => {
    expect(resolveWebsiteComponentProfile('base')).toBe('primitive');
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
        profile: 'base',
        category: 'data-display',
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
        profile: 'base',
        category: 'data-display',
      })
    ).toThrow(
      'Website component page generation failed for Avatar: spawn failed'
    );
  });
});
