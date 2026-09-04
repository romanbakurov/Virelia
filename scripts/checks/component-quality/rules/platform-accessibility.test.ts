import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import type { ComponentMetadata } from '@vellira-ui/metadata';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  accessibilitySemanticsRule,
  focusManagementRule,
  overlayPresentationRule,
  platformInteractionRule,
} from './platform-accessibility';

const baseMetadata: ComponentMetadata = {
  name: 'Example',
  layer: 'components',
  category: 'overlay',
  platforms: ['react', 'react-native'],
  profile: 'overlay',
  status: 'stable',
  capabilities: ['keyboard', 'focus-management', 'portal'],
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
  },
};

const roots: string[] = [];

function createSource(
  platform: 'react' | 'react-native',
  source: string,
  nested = false
) {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-platform-quality-')
  );
  roots.push(root);
  const dir = path.join(
    root,
    'packages',
    platform,
    'src',
    'components',
    'Example',
    ...(nested ? ['Root'] : [])
  );

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'Example.tsx'), source);
  vi.spyOn(process, 'cwd').mockReturnValue(root);
}

function createSourceWithManualTest(params: {
  source: string;
  manualTest: string;
}) {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-platform-quality-')
  );
  roots.push(root);
  const dir = path.join(
    root,
    'packages',
    'react',
    'src',
    'components',
    'Example'
  );

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'Example.tsx'), params.source);
  fs.writeFileSync(
    path.join(dir, 'Example.manual.test.tsx'),
    params.manualTest
  );
  vi.spyOn(process, 'cwd').mockReturnValue(root);
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('platform accessibility quality rules', () => {
  it('accepts semantic web accessibility evidence', async () => {
    createSource(
      'react',
      '<button aria-expanded={open} onKeyDown={handleKeyDown} ref={triggerRef}>Open</button>'
    );

    expect(
      (
        await accessibilitySemanticsRule.evaluate({
          metadata: baseMetadata,
          platform: 'react',
        })
      ).status
    ).toBe('pass');
  });

  it('reports the exact Web implementation when required semantics are missing', async () => {
    createSource('react', '<div>Content</div>');

    const result = await accessibilitySemanticsRule.evaluate({
      metadata: baseMetadata,
      platform: 'react',
    });

    expect(result.status).toBe('fail');
    expect(result.evidence).toEqual([
      'packages/react/src/components/Example/Example.tsx',
    ]);
  });

  it('accepts React Native accessibility semantics independently', async () => {
    createSource(
      'react-native',
      '<Pressable accessibilityRole="button" accessibilityLabel="Open" onPress={open}><Text>Open</Text></Pressable>'
    );

    expect(
      (
        await accessibilitySemanticsRule.evaluate({
          metadata: baseMetadata,
          platform: 'react-native',
        })
      ).status
    ).toBe('pass');
  });

  it('fails missing required native accessibility semantics', async () => {
    createSource(
      'react-native',
      '<Pressable onPress={open}><Text>Open</Text></Pressable>'
    );

    const result = await accessibilitySemanticsRule.evaluate({
      metadata: baseMetadata,
      platform: 'react-native',
    });

    expect(result.status).toBe('fail');
    expect(result.message).toContain('React Native');
    expect(result.evidence).toEqual([
      'packages/react-native/src/components/Example/Example.tsx',
    ]);
  });

  it('uses keyboard evidence for web interaction', async () => {
    createSource('react', '<div role="tab" onKeyDown={handleKeyDown} />');

    expect(
      (
        await platformInteractionRule.evaluate({
          metadata: baseMetadata,
          platform: 'react',
        })
      ).status
    ).toBe('pass');
  });

  it('reports exact source evidence when web interaction is missing', async () => {
    createSource('react', '<div role="tab" />');

    const result = await platformInteractionRule.evaluate({
      metadata: baseMetadata,
      platform: 'react',
    });

    expect(result.status).toBe('fail');
    expect(result.evidence).toContain(
      'packages/react/src/components/Example/Example.tsx'
    );
  });

  it('recognizes executable manual keyboard interaction evidence on web', async () => {
    createSourceWithManualTest({
      source: '<button>Open</button>',
      manualTest: `
        // Coverage contract: keyboard
        it('handles trigger keyboard activation', async () => {
          const user = userEvent.setup();
          await user.keyboard('{Enter}');
          expect(document.activeElement).not.toBeNull();
        });
      `,
    });

    const result = await platformInteractionRule.evaluate({
      metadata: baseMetadata,
      platform: 'react',
    });

    expect(result.status).toBe('pass');
    expect(result.evidence).toContain(
      'packages/react/src/components/Example/Example.manual.test.tsx'
    );
  });

  it('does not treat a manual coverage marker as keyboard behavior', async () => {
    createSourceWithManualTest({
      source: '<button>Open</button>',
      manualTest: '// Coverage contract: keyboard\n',
    });

    const result = await platformInteractionRule.evaluate({
      metadata: baseMetadata,
      platform: 'react',
    });

    expect(result.status).toBe('fail');
  });

  it('uses press interaction instead of web keyboard APIs on native', async () => {
    createSource('react-native', '<Pressable onPress={select} />');

    expect(
      (
        await platformInteractionRule.evaluate({
          metadata: baseMetadata,
          platform: 'react-native',
        })
      ).status
    ).toBe('pass');
  });

  it('evaluates focus capability with platform-specific evidence', async () => {
    createSource(
      'react-native',
      'const inputRef = useRef(null); return <TextInput ref={inputRef} />;'
    );

    expect(
      (
        await focusManagementRule.evaluate({
          metadata: baseMetadata,
          platform: 'react-native',
        })
      ).status
    ).toBe('pass');
  });

  it('maps portal capability to native presentation primitives', async () => {
    createSource(
      'react-native',
      'return <Presentation><Modal visible={open} /></Presentation>;',
      true
    );

    expect(
      (
        await overlayPresentationRule.evaluate({
          metadata: baseMetadata,
          platform: 'react-native',
        })
      ).status
    ).toBe('pass');
  });

  it('accepts native interaction delegated to an interactive Vellira primitive', async () => {
    createSource(
      'react-native',
      "import { Radio } from '../../../primitives/Radio'; return <Radio value='one' />;"
    );

    expect(
      (
        await platformInteractionRule.evaluate({
          metadata: baseMetadata,
          platform: 'react-native',
        })
      ).status
    ).toBe('pass');
  });

  it('accepts Escape dismissal as deterministic web keyboard evidence', async () => {
    createSource(
      'react',
      'useOverlayDismiss({ active: open, closeOnEscape: true }); return <button aria-describedby="tip">Open</button>;'
    );

    expect(
      (
        await platformInteractionRule.evaluate({
          metadata: baseMetadata,
          platform: 'react',
        })
      ).status
    ).toBe('pass');
  });

  it('accepts explicit compound overlay composition on web', async () => {
    createSource(
      'react',
      'const Example = Object.assign(Root, { Overlay, Content });'
    );

    expect(
      (
        await overlayPresentationRule.evaluate({
          metadata: baseMetadata,
          platform: 'react',
        })
      ).status
    ).toBe('pass');
  });

  it('returns not-applicable when platform capability is not declared', async () => {
    createSource('react', '<button>Open</button>');
    const metadata: ComponentMetadata = {
      ...baseMetadata,
      capabilities: [],
    };

    expect(
      (
        await platformInteractionRule.evaluate({
          metadata,
          platform: 'react',
        })
      ).status
    ).toBe('not-applicable');
    expect(
      (
        await focusManagementRule.evaluate({
          metadata,
          platform: 'react',
        })
      ).status
    ).toBe('not-applicable');
    expect(
      (
        await overlayPresentationRule.evaluate({
          metadata,
          platform: 'react',
        })
      ).status
    ).toBe('not-applicable');
  });
});
