import { describe, expect, it } from 'vitest';

import { componentMetadata } from './components';
import type { ComponentExpansionTarget } from './expansion';
import { componentExpansionCatalog } from './expansionCatalog';
import { getComponentExpansionReport } from './expansionReport';

describe('componentExpansionCatalog', () => {
  it('uses stable unique component names', () => {
    const names = componentExpansionCatalog.map((target) => target.name);

    expect(new Set(names).size).toBe(names.length);
  });

  it('declares at least one supported platform for every target', () => {
    for (const target of componentExpansionCatalog) {
      expect(target.platforms.length).toBeGreaterThan(0);

      for (const platform of target.platforms) {
        expect(['react', 'react-native']).toContain(platform);
      }
    }
  });

  it('references known components when representedBy or dependsOn are used', () => {
    const knownNames = new Set(
      componentMetadata.map((metadata) => metadata.name)
    );

    for (const catalogTarget of componentExpansionCatalog) {
      const target: ComponentExpansionTarget = catalogTarget;

      for (const representedName of target.representedBy ?? []) {
        expect(knownNames.has(representedName)).toBe(true);
      }

      for (const dependencyName of target.dependsOn ?? []) {
        expect(knownNames.has(dependencyName)).toBe(true);
      }
    }
  });

  it('produces a versioned machine-readable report', () => {
    expect(getComponentExpansionReport()).toEqual({
      schemaVersion: '1',
      components: componentMetadata,
      targets: componentExpansionCatalog,
    });
  });
});
