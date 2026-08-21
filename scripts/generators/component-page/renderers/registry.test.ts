import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import type { GeneratedPageModel } from '../model/types';
import { updateCatalogRegistry } from './registry';

const model: GeneratedPageModel = {
  componentName: 'Switch',
  slug: 'switch',
  platforms: ['react', 'react-native'],
  demo: {
    staticProps: {},
    children: {},
    imports: {},
    responsivePresentation: false,
  },
  playground: {
    props: [],
    initialValues: {},
  },
  usage: {
    children: {},
  },
  examples: [],
  accessibility: {
    react: [],
    'react-native': [],
  },
  api: {
    react: {
      sections: [],
      inheritedProps: [],
    },
    'react-native': {
      sections: [],
      inheritedProps: [],
    },
  },
  related: [],
};

describe('component catalog registration', () => {
  it('adds a generated page to the website component catalog once', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vellira-catalog-'));
    const componentsRegistryFile = path.join(root, 'components.ts');

    fs.writeFileSync(
      componentsRegistryFile,
      `import type { ComponentCatalogEntry } from '../types';\n\nexport const webComponents = [\n] as const satisfies readonly ComponentCatalogEntry[];\n`
    );

    updateCatalogRegistry({
      root,
      check: false,
      checkFailures: [],
      componentsRegistryFile,
      model,
      componentProfile: 'form-control',
    });

    updateCatalogRegistry({
      root,
      check: false,
      checkFailures: [],
      componentsRegistryFile,
      model,
      componentProfile: 'form-control',
    });

    const content = fs.readFileSync(componentsRegistryFile, 'utf8');

    expect(content.match(/slug: 'switch'/g)).toHaveLength(1);
    expect(content).toContain("category: 'forms'");
    expect(content).toContain("status: 'beta'");
    expect(content).toContain("'react-native'");
  });
});
