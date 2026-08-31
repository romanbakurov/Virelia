import { describe, expect, it } from 'vitest';

import {
  componentPageProfiles,
  getGeneratedCompositionMetadata,
  getProfileMetadata,
  mapGeneratorCategory,
  resolveCatalogCategory,
} from './profiles';

describe('component page profiles', () => {
  it('exposes the supported profile contract', () => {
    expect(componentPageProfiles).toContain('compound');
  });

  it('maps Generator V2 navigation category to website Navigation', () => {
    expect(mapGeneratorCategory('navigation')).toBe('navigation');

    expect(
      resolveCatalogCategory({
        profile: 'compound',
        requestedCategory: 'navigation',
      })
    ).toBe('navigation');
  });

  it('provides reusable related components for compound pages', () => {
    expect(getProfileMetadata('compound').related).toEqual([
      'tabs',
      'select',
      'dropdown',
    ]);
  });

  it('generates meaningful nested compound children', () => {
    const metadata = getGeneratedCompositionMetadata({
      profile: 'compound',
      componentName: 'Accordion',
      parts: ['Root', 'Item', 'Trigger', 'Content'],
    });

    expect(metadata.react?.children).toContain('<Accordion.Item>');
    expect(metadata.react?.children).toContain(
      '<Accordion.Trigger>Section</Accordion.Trigger>'
    );
    expect(metadata.react?.children).toContain(
      '<Accordion.Content>Section content</Accordion.Content>'
    );

    expect(metadata.native?.children).toBe(metadata.react?.children);
  });

  it('does not invent compound children for an incomplete composition', () => {
    expect(
      getGeneratedCompositionMetadata({
        profile: 'compound',
        componentName: 'Accordion',
        parts: ['Root'],
      })
    ).toEqual({});
  });
});
