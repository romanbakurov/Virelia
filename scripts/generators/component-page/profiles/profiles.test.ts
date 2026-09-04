import { describe, expect, it, vi } from 'vitest';

import {
  componentPageProfiles,
  getGeneratedCompositionMetadata,
  getProfileMetadata,
  mapGeneratorCategory,
  resolveCatalogCategory,
} from './profiles';

import type { ExtractedProp, Platform } from '../model/types';

function extractedProp(params: {
  name: string;
  kind: ExtractedProp['kind'];
  required?: boolean;
  options?: string[];
}): ExtractedProp {
  if (params.kind === 'select') {
    return {
      name: params.name,
      kind: params.kind,
      required: params.required ?? true,
      type: params.options?.map((option) => `'${option}'`).join(' | ') ?? '',
      description: '',
      options: params.options ?? [],
    };
  }

  return {
    name: params.name,
    kind: params.kind,
    required: params.required ?? true,
    type: params.kind,
    description: '',
  };
}

function partProps(
  platform: Platform,
  propsByPart: Record<string, readonly ExtractedProp[]>
) {
  return {
    [platform]: propsByPart,
  };
}

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

  it('scopes selection-control defaults to the target component APIs', () => {
    const checkboxProps = [
      extractedProp({ name: 'checked', kind: 'boolean' }),
      extractedProp({ name: 'disabled', kind: 'boolean' }),
      extractedProp({ name: 'required', kind: 'boolean' }),
      extractedProp({ name: 'indeterminate', kind: 'boolean' }),
      extractedProp({
        name: 'size',
        kind: 'select',
        options: ['sm', 'md', 'lg'],
      }),
      extractedProp({
        name: 'color',
        kind: 'select',
        options: ['primary', 'success'],
      }),
      extractedProp({
        name: 'labelPosition',
        kind: 'select',
        options: ['start', 'end'],
      }),
      extractedProp({ name: 'error', kind: 'string' }),
      extractedProp({ name: 'defaultChecked', kind: 'boolean' }),
    ];

    const radioProps = checkboxProps.filter(
      (prop) => prop.name !== 'indeterminate' && prop.name !== 'labelPosition'
    );

    const checkboxMetadata = getProfileMetadata('selection-control', {
      reactApiProps: checkboxProps,
      nativeApiProps: checkboxProps,
    });

    const radioMetadata = getProfileMetadata('selection-control', {
      reactApiProps: radioProps,
      nativeApiProps: radioProps,
    });

    expect(checkboxMetadata.demo?.initialValues).toMatchObject({
      indeterminate: false,
      labelPosition: 'end',
    });
    expect(checkboxMetadata.defaults?.shared).toMatchObject({
      indeterminate: false,
      labelPosition: 'end',
    });

    expect(radioMetadata.demo?.initialValues).not.toHaveProperty(
      'indeterminate'
    );
    expect(radioMetadata.demo?.initialValues).not.toHaveProperty(
      'labelPosition'
    );
    expect(radioMetadata.defaults?.shared).not.toHaveProperty('indeterminate');
    expect(radioMetadata.defaults?.shared).not.toHaveProperty('labelPosition');
  });

  it('scopes selection-control defaults to the target component APIs', () => {
    const checkboxProps = [
      extractedProp({ name: 'checked', kind: 'boolean' }),
      extractedProp({ name: 'disabled', kind: 'boolean' }),
      extractedProp({ name: 'required', kind: 'boolean' }),
      extractedProp({ name: 'indeterminate', kind: 'boolean' }),
      extractedProp({
        name: 'size',
        kind: 'select',
        options: ['sm', 'md', 'lg'],
      }),
      extractedProp({
        name: 'color',
        kind: 'select',
        options: ['primary', 'success'],
      }),
      extractedProp({
        name: 'labelPosition',
        kind: 'select',
        options: ['start', 'end'],
      }),
      extractedProp({ name: 'error', kind: 'string' }),
      extractedProp({ name: 'defaultChecked', kind: 'boolean' }),
    ];

    const radioProps = checkboxProps.filter(
      (prop) => prop.name !== 'indeterminate' && prop.name !== 'labelPosition'
    );

    const checkboxMetadata = getProfileMetadata('selection-control', {
      reactApiProps: checkboxProps,
      nativeApiProps: checkboxProps,
    });

    const radioMetadata = getProfileMetadata('selection-control', {
      reactApiProps: radioProps,
      nativeApiProps: radioProps,
    });

    expect(checkboxMetadata.demo?.initialValues).toMatchObject({
      indeterminate: false,
      labelPosition: 'end',
    });
    expect(checkboxMetadata.defaults?.shared).toMatchObject({
      indeterminate: false,
      labelPosition: 'end',
    });

    expect(radioMetadata.demo?.initialValues).not.toHaveProperty(
      'indeterminate'
    );
    expect(radioMetadata.demo?.initialValues).not.toHaveProperty(
      'labelPosition'
    );
    expect(radioMetadata.defaults?.shared).not.toHaveProperty('indeterminate');
    expect(radioMetadata.defaults?.shared).not.toHaveProperty('labelPosition');
  });

  it('generates meaningful nested compound children with required simple part props', () => {
    const metadata = getGeneratedCompositionMetadata({
      profile: 'compound',
      componentName: 'Example',
      parts: ['Root', 'Item', 'Trigger', 'Content'],
      partProps: partProps('react', {
        Item: [
          extractedProp({ name: 'value', kind: 'string' }),
          extractedProp({ name: 'count', kind: 'number' }),
          extractedProp({ name: 'disabled', kind: 'boolean' }),
          extractedProp({
            name: 'mode',
            kind: 'select',
            options: ['single', 'multiple'],
          }),
          extractedProp({
            name: 'optional',
            kind: 'string',
            required: false,
          }),
          extractedProp({
            name: 'children',
            kind: 'other',
            required: true,
          }),
        ],
      }),
    });

    expect(metadata.react?.children).toContain(
      '<Example.Item value=\'value-1\' count={1} disabled={false} mode={"single"}>'
    );
    expect(metadata.react?.children).toContain(
      '<Example.Trigger>Section</Example.Trigger>'
    );
    expect(metadata.react?.children).toContain(
      '<Example.Content>Section content</Example.Content>'
    );
    expect(metadata.react?.children).not.toContain('optional=');
    expect(metadata.react?.children).not.toContain('children=');
    expect(metadata.react?.children).not.toContain('<Example.Root');
  });

  it('generates platform-specific compound children from platform part props', () => {
    const metadata = getGeneratedCompositionMetadata({
      profile: 'compound',
      componentName: 'Example',
      parts: ['Root', 'Item', 'Trigger', 'Content'],
      partProps: {
        react: {
          Item: [extractedProp({ name: 'webValue', kind: 'string' })],
        },
        'react-native': {
          Item: [extractedProp({ name: 'nativeCount', kind: 'number' })],
        },
      },
    });

    expect(metadata.react?.children).toContain(
      "<Example.Item webValue='webValue-1'>"
    );
    expect(metadata.native?.children).toContain(
      '<Example.Item nativeCount={1}>'
    );
    expect(metadata.react?.children).not.toBe(metadata.native?.children);
  });

  it('warns and omits generated compound children for unsupported required complex props', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      const metadata = getGeneratedCompositionMetadata({
        profile: 'compound',
        componentName: 'Example',
        parts: ['Root', 'Item', 'Trigger', 'Content'],
        partProps: partProps('react', {
          Item: [extractedProp({ name: 'renderItem', kind: 'other' })],
        }),
      });

      expect(metadata.react?.children).toBeUndefined();
      expect(warnSpy).toHaveBeenCalledWith(
        '⚠️ Example react compound composition requires explicit metadata for complex part props: Item.renderItem'
      );
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('preserves existing nested compound children when parts have no required props', () => {
    const metadata = getGeneratedCompositionMetadata({
      profile: 'compound',
      componentName: 'Example',
      parts: ['Root', 'Item', 'Trigger', 'Content'],
    });

    expect(metadata.react?.children).toContain('<Example.Item>');
    expect(metadata.react?.children).toContain(
      '<Example.Trigger>Section</Example.Trigger>'
    );
    expect(metadata.react?.children).toContain(
      '<Example.Content>Section content</Example.Content>'
    );

    expect(metadata.native?.children).not.toBe(metadata.react?.children);
    expect(metadata.react?.children).not.toContain('NativeText');
    expect(metadata.native?.children).toContain(
      '<Example.Trigger><NativeText>Section</NativeText></Example.Trigger>'
    );
    expect(metadata.native?.children).toContain(
      '<Example.Content><NativeText>Section content</NativeText></Example.Content>'
    );
    expect(metadata.native?.imports).toEqual([
      "import { Text as NativeText } from 'react-native';",
    ]);
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
