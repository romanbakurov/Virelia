import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import type { ComponentMetadata } from '@vellira-ui/metadata';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  hardcodedColorRule,
  hardcodedGeometryRule,
  tokenIntegrationRule,
} from './conformity';

const metadata: ComponentMetadata = {
  name: 'Example',
  layer: 'components',
  category: 'form',
  platforms: ['react', 'react-native'],
  profile: 'base',
  status: 'stable',
  capabilities: [],
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
  },
};

const roots: string[] = [];

function createRoot() {
  const value = fs.mkdtempSync(path.join(os.tmpdir(), 'vellira-conformity-'));
  roots.push(value);
  vi.spyOn(process, 'cwd').mockReturnValue(value);
  return value;
}

function componentDir(
  base: string,
  platform: 'react' | 'react-native',
  name = 'Example'
) {
  const value = path.join(
    base,
    'packages',
    platform,
    'src',
    'components',
    name
  );
  fs.mkdirSync(value, { recursive: true });
  return value;
}

afterEach(() => {
  vi.restoreAllMocks();

  for (const value of roots.splice(0)) {
    fs.rmSync(value, { recursive: true, force: true });
  }
});

describe('design-system conformity rules', () => {
  it('passes Web token integration through CSS custom properties', async () => {
    const base = createRoot();
    const dir = componentDir(base, 'react');

    fs.writeFileSync(
      path.join(dir, 'Example.module.scss'),
      '.root { color: var(--control-fg); padding: var(--space-2); }'
    );

    expect(
      (
        await tokenIntegrationRule.evaluate({
          metadata,
          platform: 'react',
        })
      ).status
    ).toBe('pass');
  });

  it('passes Native token integration through NativeTheme', async () => {
    const base = createRoot();
    const dir = componentDir(base, 'react-native');

    fs.writeFileSync(
      path.join(dir, 'Example.styles.ts'),
      `export const createStyles = (theme: NativeTheme) => StyleSheet.create({
        root: {
          color: theme.components.input.default.fg,
          borderRadius: theme.tokens.radius.md,
        },
      });`
    );

    expect(
      (
        await tokenIntegrationRule.evaluate({
          metadata,
          platform: 'react-native',
        })
      ).status
    ).toBe('pass');
  });

  it('fails hardcoded colors with actionable evidence', async () => {
    const base = createRoot();
    const dir = componentDir(base, 'react');

    fs.writeFileSync(
      path.join(dir, 'Example.module.scss'),
      '.root { color: #ffffff; background: rgb(0, 0, 0); }'
    );

    const result = await hardcodedColorRule.evaluate({
      metadata,
      platform: 'react',
    });

    expect(result.status).toBe('fail');
    expect(result.evidence?.[0]).toContain('Example.module.scss:1');
  });

  it('ignores tests and stories when scanning hardcoded design values', async () => {
    const base = createRoot();
    const dir = componentDir(base, 'react');

    fs.writeFileSync(
      path.join(dir, 'Example.test.tsx'),
      `it('renders', () => expect('#ffffff').toBe('#ffffff'));`
    );
    fs.writeFileSync(
      path.join(dir, 'Example.stories.tsx'),
      `export const Demo = { args: { color: '#ffffff' } };`
    );

    expect(
      (
        await hardcodedColorRule.evaluate({
          metadata,
          platform: 'react',
        })
      ).status
    ).toBe('pass');
  });

  it('warns for non-exempt reusable hardcoded geometry', async () => {
    const base = createRoot();
    const dir = componentDir(base, 'react');

    fs.writeFileSync(
      path.join(dir, 'Example.module.scss'),
      '.root { padding: 20px; border-radius: 10px; }'
    );

    expect(
      (
        await hardcodedGeometryRule.evaluate({
          metadata,
          platform: 'react',
        })
      ).status
    ).toBe('warn');
  });

  it('supports narrow explicit geometry exceptions', async () => {
    const base = createRoot();
    const dir = componentDir(base, 'react', 'Button');
    const buttonMetadata: ComponentMetadata = {
      ...metadata,
      name: 'Button',
    };

    fs.writeFileSync(
      path.join(dir, 'Button.module.scss'),
      '.sm { padding-inline: 16px; } .md { padding-inline: 24px; }'
    );

    expect(
      (
        await hardcodedGeometryRule.evaluate({
          metadata: buttonMetadata,
          platform: 'react',
        })
      ).status
    ).toBe('pass');
  });

  it('returns not-applicable when no styling surface exists', async () => {
    const base = createRoot();
    const dir = componentDir(base, 'react');

    fs.writeFileSync(
      path.join(dir, 'Example.tsx'),
      'export function Example() { return null; }'
    );

    expect(
      (
        await tokenIntegrationRule.evaluate({
          metadata,
          platform: 'react',
        })
      ).status
    ).toBe('not-applicable');
  });

  it('does not require tokens for layout-only Web styles', async () => {
    const base = createRoot();
    const dir = componentDir(base, 'react');

    fs.writeFileSync(
      path.join(dir, 'Example.module.scss'),
      '.root { display: inline-flex; align-items: center; justify-content: center; }'
    );

    const result = await tokenIntegrationRule.evaluate({
      metadata,
      platform: 'react',
    });

    expect(result.status).toBe('not-applicable');
  });

  it('still requires tokens for token-relevant Web styles', async () => {
    const base = createRoot();
    const dir = componentDir(base, 'react');

    fs.writeFileSync(
      path.join(dir, 'Example.module.scss'),
      '.root { padding: 1rem; }'
    );

    const result = await tokenIntegrationRule.evaluate({
      metadata,
      platform: 'react',
    });

    expect(result.status).toBe('fail');
  });

  it('does not require theme tokens for layout-only Native styles', async () => {
    const base = createRoot();
    const dir = componentDir(base, 'react-native');

    fs.writeFileSync(
      path.join(dir, 'Example.styles.ts'),
      `export const createStyles = (_theme: NativeTheme) =>
      StyleSheet.create({
        root: {
          width: '100%',
          minWidth: 0,
          alignSelf: 'stretch',
          flexDirection: 'row',
        },
      });`
    );

    const result = await tokenIntegrationRule.evaluate({
      metadata,
      platform: 'react-native',
    });

    expect(result.status).toBe('not-applicable');
  });
});
