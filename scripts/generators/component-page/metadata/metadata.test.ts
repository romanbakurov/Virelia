import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { loadGeneratedComponentProfile } from './metadata';

const roots: string[] = [];

function createFixture(profile: string) {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vellira-component-profile-')
  );

  roots.push(root);

  const metadataDir = path.join(
    root,
    'packages',
    'metadata',
    'src',
    'components'
  );

  fs.mkdirSync(metadataDir, { recursive: true });

  fs.writeFileSync(
    path.join(metadataDir, 'Accordion.metadata.ts'),
    `export const accordionMetadata = {
  name: 'Accordion',
  profile: '${profile}',
};
`
  );

  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('loadGeneratedComponentProfile', () => {
  it('loads the canonical compound profile', () => {
    const root = createFixture('compound');

    expect(
      loadGeneratedComponentProfile({
        root,
        componentName: 'Accordion',
      })
    ).toBe('compound');
  });

  it('maps Generator V2 base profile to website primitive profile', () => {
    const root = createFixture('base');

    expect(
      loadGeneratedComponentProfile({
        root,
        componentName: 'Accordion',
      })
    ).toBe('primitive');
  });
});
