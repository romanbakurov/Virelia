import { describe, expect, it } from 'vitest';

import {
  renderPartComponentTemplate,
  renderPartIndexTemplate,
  renderPartTypesTemplate,
} from './component-part';

describe('component part templates', () => {
  it('renders a web part', () => {
    const result = renderPartComponentTemplate({
      componentName: 'Tabs',
      partName: 'Trigger',
      isNative: false,
    });

    expect(result).toContain('export function TabsTrigger');
    expect(result).toContain('<div>{children}</div>');
  });

  it('renders a native part', () => {
    const result = renderPartComponentTemplate({
      componentName: 'Tabs',
      partName: 'Content',
      isNative: true,
    });

    expect(result).toContain('export function TabsContent');
    expect(result).toContain('<View>{children}</View>');
  });

  it('renders part types', () => {
    const result = renderPartTypesTemplate({
      componentName: 'Tabs',
      partName: 'Root',
      isNative: false,
    });

    expect(result).toContain('export type TabsRootProps');
  });

  it('renders part index', () => {
    const result = renderPartIndexTemplate({
      componentName: 'Tabs',
      partName: 'List',
      isNative: false,
    });

    expect(result).toContain("export * from './TabsList';");
  });
});
