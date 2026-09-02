import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  loadGeneratedComponentProfile,
  validateComponentMetadata,
  validateComponentMetadataAgainstApi,
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

function apiProp(
  name: string,
  kind: 'boolean' | 'string' | 'number' | 'select' | 'other' = 'string'
) {
  return { name, kind } as const;
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
  ])(
    'rejects imports that locally bind the generated component',
    (source, platform) => {
      const metadata =
        platform === 'react'
          ? { react: { imports: [source] } }
          : { native: { imports: [source] } };

      expect(() =>
        validateComponentMetadata({
          componentName: 'Accordion',
          metadata,
        })
      ).toThrow(/generator-owned name "Accordion"/);
    }
  );

  it('rejects imports that rebind generated platform aliases', () => {
    expect(() =>
      validateComponentMetadata({
        componentName: 'Accordion',
        metadata: {
          examples: [
            {
              title: 'Aliased import',
              description: 'Invalid alias collision.',
              props: [],
              imports: ["import { Other as ReactAccordion } from './other';"],
            },
          ],
        },
      })
    ).toThrow(/generator-owned name "ReactAccordion"/);
  });

  it('rejects malformed or non-import import entries', () => {
    expect(() =>
      validateComponentMetadata({
        componentName: 'Accordion',
        metadata: {
          react: {
            imports: ['const value = 1;'],
          },
        },
      })
    ).toThrow(/expected import declaration only/);
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

  it('accepts ordinary demo static root props', () => {
    expect(() =>
      validateComponentMetadata({
        componentName: 'Accordion',
        metadata: {
          demo: {
            staticProps: {
              type: "'single'",
              collapsible: 'true',
            },
          },
          react: {
            children: '<Accordion.Item />',
          },
          native: {
            children: '<Accordion.Item />',
          },
        },
      })
    ).not.toThrow();
  });

  it('rejects malformed static prop expressions', () => {
    expect(() =>
      validateComponentMetadata({
        componentName: 'Accordion',
        metadata: {
          demo: {
            staticProps: {
              value: "'single' +",
            },
          },
        },
      })
    ).toThrow(/demo\.staticProps\.value has invalid syntax/);
  });

  it('rejects demo children in staticProps', () => {
    expect(() =>
      validateComponentMetadata({
        componentName: 'Accordion',
        metadata: {
          demo: {
            staticProps: {
              children: '<Accordion.Item />',
            },
          },
        },
      })
    ).toThrow(/use react\.children\/native\.children for inner JSX/);
  });

  it('rejects malformed platform demo props', () => {
    expect(() =>
      validateComponentMetadata({
        componentName: 'Accordion',
        metadata: {
          react: {
            demoProps: "value={'one'",
          },
        },
      })
    ).toThrow(/react\.demoProps has invalid syntax/);
  });

  it('rejects malformed platform children and generated root rewrapping', () => {
    expect(() =>
      validateComponentMetadata({
        componentName: 'Accordion',
        metadata: {
          react: {
            children: '<Accordion><Accordion.Item /></Accordion>',
          },
        },
      })
    ).toThrow(/not a second <Accordion> root/);

    expect(() =>
      validateComponentMetadata({
        componentName: 'Accordion',
        metadata: {
          native: {
            children: '<Accordion.Item>',
          },
        },
      })
    ).toThrow(/react-native\.children has invalid syntax/);
  });

  it('accepts valid shared and platform-specific example setup', () => {
    expect(() =>
      validateComponentMetadata({
        componentName: 'Accordion',
        metadata: {
          examples: [
            {
              title: 'Controlled',
              description: 'Controlled example.',
              props: ['value={value}'],
              setup: ["const [value, setValue] = useState('account');"],
              reactSetup: ['void setValue;'],
              nativeSetup: ['void setValue;'],
            },
          ],
        },
      })
    ).not.toThrow();
  });

  it('rejects invalid example setup syntax', () => {
    expect(() =>
      validateComponentMetadata({
        componentName: 'Accordion',
        metadata: {
          examples: [
            {
              title: 'Controlled',
              description: 'Controlled example.',
              props: [],
              setup: ["const [value, setValue] = useState('account';"],
            },
          ],
        },
      })
    ).toThrow(/setup has invalid TypeScript syntax/);
  });

  it('rejects malformed and duplicate example prop fragments', () => {
    expect(() =>
      validateComponentMetadata({
        componentName: 'Accordion',
        metadata: {
          examples: [
            {
              title: 'Malformed',
              description: 'Malformed props.',
              props: ["value={'one'"],
            },
          ],
        },
      })
    ).toThrow(/props has invalid syntax/);

    expect(() =>
      validateComponentMetadata({
        componentName: 'Accordion',
        metadata: {
          examples: [
            {
              title: 'Duplicate',
              description: 'Duplicate props.',
              props: ["value='one'"],
              reactProps: ["value='two'"],
            },
          ],
        },
      })
    ).toThrow(/duplicate JSX prop "value"/);
  });
});

describe('validateComponentMetadataAgainstApi', () => {
  it('rejects dead default, initial value, excluded control, and satisfied prop names', () => {
    expect(() =>
      validateComponentMetadataAgainstApi({
        componentName: 'Example',
        platforms: ['react', 'react-native'],
        reactApiProps: [apiProp('disabled', 'boolean')],
        nativeApiProps: [apiProp('disabled', 'boolean')],
        metadata: {
          demo: {
            initialValues: {
              misspelledInitial: true,
            },
            excludeControls: ['misspelledControl'],
            satisfiedRequiredProps: ['misspelledSatisfied'],
          },
          defaults: {
            shared: {
              misspelledDefault: false,
            },
          },
        },
      })
    ).toThrow(
      /misspelledInitial[\s\S]*misspelledControl[\s\S]*misspelledSatisfied[\s\S]*misspelledDefault/
    );
  });

  it('allows shared control metadata for props supported by only one target platform', () => {
    expect(() =>
      validateComponentMetadataAgainstApi({
        componentName: 'Example',
        platforms: ['react', 'react-native'],
        reactApiProps: [
          apiProp('disabled', 'boolean'),
          apiProp('webOnly', 'boolean'),
        ],
        nativeApiProps: [
          apiProp('disabled', 'boolean'),
          apiProp('nativeOnly', 'boolean'),
        ],
        metadata: {
          demo: {
            initialValues: {
              webOnly: false,
              nativeOnly: false,
            },
            excludeControls: ['webOnly', 'nativeOnly'],
            satisfiedRequiredProps: ['webOnly', 'nativeOnly'],
          },
          defaults: {
            shared: {
              webOnly: false,
              nativeOnly: false,
            },
          },
        },
      })
    ).not.toThrow();
  });

  it('rejects platform defaults that target a prop absent from that platform', () => {
    expect(() =>
      validateComponentMetadataAgainstApi({
        componentName: 'Example',
        platforms: ['react', 'react-native'],
        reactApiProps: [apiProp('webOnly', 'boolean')],
        nativeApiProps: [apiProp('nativeOnly', 'boolean')],
        metadata: {
          defaults: {
            react: {
              nativeOnly: false,
            },
            native: {
              webOnly: false,
            },
          },
        },
      })
    ).toThrow(/defaults\.react\.nativeOnly[\s\S]*defaults\.native\.webOnly/);
  });

  it('rejects unknown and non-boolean bare example props per platform', () => {
    expect(() =>
      validateComponentMetadataAgainstApi({
        componentName: 'Example',
        platforms: ['react', 'react-native'],
        reactApiProps: [
          apiProp('disabled', 'boolean'),
          apiProp('value', 'string'),
        ],
        nativeApiProps: [apiProp('disabled', 'boolean')],
        metadata: {
          examples: [
            {
              title: 'Bare props',
              description: 'Invalid bare props.',
              props: ['disabled'],
              reactProps: ['value'],
              nativeProps: ['missing'],
            },
          ],
        },
      })
    ).toThrow(/value[\s\S]*not boolean[\s\S]*missing/);
  });

  it('allows explicit forwarded JSX attributes without claiming they are API props', () => {
    expect(() =>
      validateComponentMetadataAgainstApi({
        componentName: 'Example',
        platforms: ['react'],
        reactApiProps: [apiProp('disabled', 'boolean')],
        nativeApiProps: [],
        metadata: {
          examples: [
            {
              title: 'Forwarded attribute',
              description: 'Explicit forwarded attribute.',
              props: ["data-testid='example'"],
            },
          ],
        },
      })
    ).not.toThrow();
  });
});
