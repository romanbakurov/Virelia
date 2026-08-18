import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import type { ComponentMetadata } from '@vellira-ui/metadata';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  documentationCoverageRule,
  storybookCoverageRule,
  testCoverageRule,
} from './coverage';

const metadata: ComponentMetadata = {
  name: 'Example',
  layer: 'components',
  category: 'form',
  platforms: ['react', 'react-native'],
  profile: 'base',
  status: 'stable',
  capabilities: ['controlled', 'uncontrolled', 'disabled'],
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
  },
};

const roots: string[] = [];

function root() {
  const value = fs.mkdtempSync(path.join(os.tmpdir(), 'vellira-coverage-'));
  roots.push(value);
  vi.spyOn(process, 'cwd').mockReturnValue(value);
  return value;
}

function componentDir(base: string, platform: 'react' | 'react-native') {
  const dir = path.join(
    base,
    'packages',
    platform,
    'src',
    'components',
    'Example'
  );
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const value of roots.splice(0)) {
    fs.rmSync(value, { recursive: true, force: true });
  }
});

describe('coverage quality rules', () => {
  it('passes meaningful deterministic test coverage', async () => {
    const base = root();
    const dir = componentDir(base, 'react');
    fs.writeFileSync(
      path.join(dir, 'Example.test.tsx'),
      `
        it('supports controlled, uncontrolled and disabled accessibility behavior', () => {
          render(<Example value="a" onValueChange={() => {}} defaultValue="a" disabled aria-label="Example" />);
          expect(screen.getByRole('button')).toBeDisabled();
        });
      `
    );

    const result = await testCoverageRule.evaluate({
      metadata,
      platform: 'react',
    });

    expect(result.status).toBe('pass');
  });

  it('does not duplicate platform-specific keyboard requirements', async () => {
    const base = root();
    const dir = componentDir(base, 'react');
    const keyboardMetadata: ComponentMetadata = {
      ...metadata,
      capabilities: ['keyboard'],
    };
    fs.writeFileSync(
      path.join(dir, 'Example.test.tsx'),
      `
        it('has executable coverage', () => {
          expect(true).toBe(true);
        });
      `
    );

    const result = await testCoverageRule.evaluate({
      metadata: keyboardMetadata,
      platform: 'react',
    });

    expect(result.status).toBe('pass');
  });

  it('does not duplicate native interaction and accessibility rules', async () => {
    const base = root();
    const dir = componentDir(base, 'react-native');
    const platformMetadata: ComponentMetadata = {
      ...metadata,
      capabilities: ['keyboard', 'focus-management', 'portal'],
    };
    fs.writeFileSync(
      path.join(dir, 'Example.test.tsx'),
      `
        it('has executable native coverage', () => {
          expect(true).toBe(true);
        });
      `
    );

    const result = await testCoverageRule.evaluate({
      metadata: platformMetadata,
      platform: 'react-native',
    });

    expect(result.status).toBe('pass');
  });

  it('recognizes interaction-driven uncontrolled coverage without default props', async () => {
    const base = root();
    const dir = componentDir(base, 'react');
    const uncontrolledMetadata: ComponentMetadata = {
      ...metadata,
      capabilities: ['uncontrolled'],
    };
    fs.writeFileSync(
      path.join(dir, 'Example.test.tsx'),
      `
        it('opens from Trigger', () => {
          const { container } = render(
            <Example>
              <Example.Trigger>Open</Example.Trigger>
            </Example>
          );
          expect(document.querySelector('[role="dialog"]')).toBeNull();
          container.querySelector('button')?.click();
          expect(document.querySelector('[role="dialog"]')).not.toBeNull();
        });
      `
    );

    const result = await testCoverageRule.evaluate({
      metadata: uncontrolledMetadata,
      platform: 'react',
    });

    expect(result.status).toBe('pass');
  });

  it('warns for partial Storybook coverage', async () => {
    const base = root();
    const dir = componentDir(base, 'react');
    fs.writeFileSync(
      path.join(dir, 'Example.stories.tsx'),
      `export const Default = { args: {} };`
    );

    const result = await storybookCoverageRule.evaluate({
      metadata,
      platform: 'react',
    });

    expect(result.status).toBe('warn');
  });

  it('does not require implementation details such as portal stories', async () => {
    const base = root();
    const dir = componentDir(base, 'react');
    const overlayMetadata: ComponentMetadata = {
      ...metadata,
      capabilities: ['controlled', 'uncontrolled', 'portal'],
    };
    fs.writeFileSync(
      path.join(dir, 'Example.stories.tsx'),
      `
        export const Controlled = { args: { open: true, onOpenChange() {} } };
        export const Uncontrolled = { args: { defaultOpen: true } };
      `
    );

    const result = await storybookCoverageRule.evaluate({
      metadata: overlayMetadata,
      platform: 'react',
    });

    expect(result.status).toBe('pass');
  });

  it('discovers kebab-case API documentation filenames', async () => {
    const base = root();
    const docsDir = path.join(
      base,
      'apps',
      'website',
      'src',
      'component-catalog',
      'components',
      'Example'
    );
    fs.mkdirSync(docsDir, { recursive: true });

    const substantial =
      'export function Section() { return <>React and React Native platform usage documentation with examples and API details.</>; }';
    fs.writeFileSync(path.join(docsDir, 'ExampleUsage.tsx'), substantial);
    fs.writeFileSync(path.join(docsDir, 'ExampleExamples.tsx'), substantial);
    fs.writeFileSync(
      path.join(docsDir, 'ExampleAccessibility.tsx'),
      substantial
    );
    fs.writeFileSync(path.join(docsDir, 'NativeExampleDemo.tsx'), substantial);
    fs.writeFileSync(
      path.join(docsDir, 'example-componentApi.ts'),
      `export const exampleApi = { react: [], 'react-native': [] }; ${'x'.repeat(100)}`
    );

    const result = await documentationCoverageRule.evaluate({
      metadata,
      platform: 'react',
    });

    expect(result.status).toBe('pass');
  });

  it('fails thin or incomplete documentation surfaces', async () => {
    const base = root();
    const docsDir = path.join(
      base,
      'apps',
      'website',
      'src',
      'component-catalog',
      'components',
      'Example'
    );
    fs.mkdirSync(docsDir, { recursive: true });
    fs.writeFileSync(path.join(docsDir, 'ExampleUsage.tsx'), 'export {};');

    const result = await documentationCoverageRule.evaluate({
      metadata,
      platform: 'react',
    });

    expect(result.status).toBe('fail');
    expect(result.message).toContain('missing or too thin');
  });

  it('returns not-applicable when coverage surface is not required', async () => {
    root();
    const optional: ComponentMetadata = {
      ...metadata,
      requirements: {
        ...metadata.requirements,
        tests: false,
        storybook: false,
        docs: false,
      },
    };

    expect(
      (
        await testCoverageRule.evaluate({
          metadata: optional,
          platform: 'react',
        })
      ).status
    ).toBe('not-applicable');
    expect(
      (
        await storybookCoverageRule.evaluate({
          metadata: optional,
          platform: 'react',
        })
      ).status
    ).toBe('not-applicable');
    expect(
      (
        await documentationCoverageRule.evaluate({
          metadata: optional,
          platform: 'react',
        })
      ).status
    ).toBe('not-applicable');
  });
});
