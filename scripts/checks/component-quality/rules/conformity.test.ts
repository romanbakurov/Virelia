import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import type { ComponentMetadata } from '@vellira-ui/metadata';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  hardcodedColorRule,
  hardcodedGeometryRule,
  iconResourceRule,
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

function writeCanonicalIconExports(
  base: string,
  names: readonly string[] = ['ChevronDown']
) {
  const root = path.join(base, 'packages', 'icons', 'src');
  fs.mkdirSync(root, { recursive: true });

  fs.writeFileSync(
    path.join(root, 'web.source.ts'),
    `${names
      .map(
        (name) =>
          `export { default as ${name} } from './generated/${name}.web';`
      )
      .join('\n')}\n`
  );

  fs.writeFileSync(
    path.join(root, 'native.source.ts'),
    `${names
      .map(
        (name) =>
          `export { default as ${name} } from './generated/${name}.native';`
      )
      .join('\n')}\n`
  );
}

function writeCanonicalTokenPaths(
  base: string,
  tokenPaths: readonly string[] = ['semantic.text.primary']
) {
  const root = path.join(base, 'packages', 'tokens', 'src', 'generated');
  fs.mkdirSync(root, { recursive: true });

  fs.writeFileSync(
    path.join(root, 'token-types.ts'),
    `export const tokenPaths = [
${tokenPaths.map((token) => `  '${token}',`).join('\n')}
] as const;
`
  );
}

afterEach(() => {
  vi.restoreAllMocks();

  for (const value of roots.splice(0)) {
    fs.rmSync(value, { recursive: true, force: true });
  }
});

describe('design-system conformity rules', () => {
  it('passes a declared canonical Vellira design token', async () => {
    const base = createRoot();
    const dir = componentDir(base, 'react');
    writeCanonicalTokenPaths(base);

    fs.writeFileSync(
      path.join(dir, 'Example.module.scss'),
      `.example {
  color: var(--vellira-text-primary);
}
`
    );

    const result = await tokenIntegrationRule.evaluate({
      metadata: {
        ...metadata,
        requirements: {
          ...metadata.requirements,
          tokens: ['semantic.text.primary'],
        },
      },
      platform: 'react',
    });

    expect(result.status).toBe('pass');
  });

  it('fails closed when a declared Vellira design token does not exist', async () => {
    const base = createRoot();
    const dir = componentDir(base, 'react');
    writeCanonicalTokenPaths(base, ['semantic.text.primary']);

    fs.writeFileSync(
      path.join(dir, 'Example.module.scss'),
      `.example {
  color: var(--vellira-text-primary);
}
`
    );

    const result = await tokenIntegrationRule.evaluate({
      metadata: {
        ...metadata,
        requirements: {
          ...metadata.requirements,
          tokens: ['semantic.text.missing'],
        },
      },
      platform: 'react',
    });

    expect(result.status).toBe('fail');
    expect(result.evidence).toContain(
      'missing-design-token: path="semantic.text.missing" component="Example" part="component" platform="react" — expected canonical token path in @vellira-ui/tokens'
    );
  });

  it('passes a declared canonical Vellira icon resource', async () => {
    const base = createRoot();
    const dir = componentDir(base, 'react');
    writeCanonicalIconExports(base);

    fs.writeFileSync(
      path.join(dir, 'Example.tsx'),
      `import { ChevronDown } from '@vellira-ui/icons';

export function Example() {
  return <ChevronDown />;
}
`
    );

    const result = await iconResourceRule.evaluate({
      metadata: {
        ...metadata,
        requirements: {
          ...metadata.requirements,
          icons: [
            {
              name: 'ChevronDown',
              purpose: 'disclosure indicator',
            },
          ],
        },
      },
      platform: 'react',
    });

    expect(result.status).toBe('pass');
  });

  it('fails closed when a declared canonical icon resource does not exist', async () => {
    const base = createRoot();
    componentDir(base, 'react');
    writeCanonicalIconExports(base, ['Close']);

    const result = await iconResourceRule.evaluate({
      metadata: {
        ...metadata,
        requirements: {
          ...metadata.requirements,
          icons: [
            {
              name: 'ChevronDown',
              purpose: 'disclosure indicator',
            },
          ],
        },
      },
      platform: 'react',
    });

    expect(result.status).toBe('fail');
    expect(result.evidence).toContain(
      'missing-icon-resource: name="ChevronDown" purpose="disclosure indicator" — expected canonical export from @vellira-ui/icons'
    );
  });

  it('fails when a declared icon exists but canonical usage is missing', async () => {
    const base = createRoot();
    const dir = componentDir(base, 'react');
    writeCanonicalIconExports(base);

    fs.writeFileSync(
      path.join(dir, 'Example.tsx'),
      `export function Example() {
  return null;
}
`
    );

    const result = await iconResourceRule.evaluate({
      metadata: {
        ...metadata,
        requirements: {
          ...metadata.requirements,
          icons: [
            {
              name: 'ChevronDown',
              purpose: 'disclosure indicator',
            },
          ],
        },
      },
      platform: 'react',
    });

    expect(result.status).toBe('fail');
    expect(result.evidence).toContain(
      'missing-icon-usage: name="ChevronDown" purpose="disclosure indicator" — import and use the canonical @vellira-ui/icons export'
    );
  });

  it('rejects an improvised Unicode glyph in icon context', async () => {
    const base = createRoot();
    const dir = componentDir(base, 'react');

    fs.writeFileSync(
      path.join(dir, 'Example.tsx'),
      `export function Example() {
  const clearIcon = '×';
  return <span>{clearIcon}</span>;
}
`
    );

    const result = await iconResourceRule.evaluate({
      metadata,
      platform: 'react',
    });

    expect(result.status).toBe('fail');
    expect(
      result.evidence?.some((item) => item.includes('prohibited-icon-glyph'))
    ).toBe(true);
  });

  it('does not treat an ordinary text multiplication sign as an icon', async () => {
    const base = createRoot();
    const dir = componentDir(base, 'react');

    fs.writeFileSync(
      path.join(dir, 'Example.tsx'),
      `export function Example() {
  return <span>3 × 4</span>;
}
`
    );

    const result = await iconResourceRule.evaluate({
      metadata,
      platform: 'react',
    });

    expect(result.status).toBe('pass');
  });

  it('rejects inline SVG used as component-owned icon artwork', async () => {
    const base = createRoot();
    const dir = componentDir(base, 'react');

    fs.writeFileSync(
      path.join(dir, 'ExampleIcon.tsx'),
      `export function ExampleIcon() {
  return <svg aria-hidden='true' />;
}
`
    );

    const result = await iconResourceRule.evaluate({
      metadata,
      platform: 'react',
    });

    expect(result.status).toBe('fail');
    expect(
      result.evidence?.some((item) =>
        item.includes('prohibited-inline-icon-resource')
      )
    ).toBe(true);
  });

  it('rejects direct react-native-svg icon implementation', async () => {
    const base = createRoot();
    const dir = componentDir(base, 'react-native');

    fs.writeFileSync(
      path.join(dir, 'ExampleIcon.tsx'),
      `import Svg from 'react-native-svg';

export function ExampleIcon() {
  return <Svg />;
}
`
    );

    const result = await iconResourceRule.evaluate({
      metadata,
      platform: 'react-native',
    });

    expect(result.status).toBe('fail');
    expect(
      result.evidence?.some((item) => item.includes('react-native-svg'))
    ).toBe(true);
  });

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
