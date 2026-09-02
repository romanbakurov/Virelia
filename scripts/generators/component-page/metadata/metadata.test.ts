import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  loadGeneratedComponentProfile,
  validateComponentMetadata,
} from './metadata';

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

describe('validateComponentMetadata', () => {
  it.each([
    ["import { Accordion } from '@vellira/react';", 'react'],
    ["import Accordion from '@example/accordion';", 'react'],
    ["import * as Accordion from '@example/accordion';", 'react-native'],
    ["import { Other as Accordion } from '@example/other';", 'react-native'],
  ])('rejects imports that locally bind the generated component', (source, platform) => {
    const metadata =
      platform === 'react'
        ? { react: { imports: [source] } }
        : { native: { imports: [source] } };

    expect(() =>
      validateComponentMetadata({
        componentName: 'Accordion',
        metadata,
      })
    ).toThrow(/must not bind generated component "Accordion"/);
  });

  it('allows additional imports that do not bind the generated component', () => {
    expect(() =>
      validateComponentMetadata({
        componentName: 'Accordion',
        metadata: {
          react: {
            imports: [
              "import { Plus } from '@vellira-ui/icons';",
              "import { Accordion as NestedAccordion } from '@vellira-ui/react';",
            ],
          },
          native: {
            imports: ["import { useState } from 'react';"],
          },
        },
      })
    ).not.toThrow();
  });
});
