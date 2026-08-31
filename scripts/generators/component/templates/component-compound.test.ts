import { describe, expect, it } from 'vitest';

import { renderCompoundComponentTemplate } from './component-compound';

describe('compound component template', () => {
  it('composes the root with public parts', () => {
    const result = renderCompoundComponentTemplate({
      componentName: 'Tabs',
      parts: ['Root', 'List', 'Trigger', 'Content'],
    });

    expect(result).toContain("import { TabsRoot } from './Root';");
    expect(result).toContain("import { TabsList } from './List';");
    expect(result).toContain("import { TabsTrigger } from './Trigger';");
    expect(result).toContain("import { TabsContent } from './Content';");

    expect(result).toContain('export const Tabs = Object.assign(TabsRoot, {');

    expect(result).toContain('List: TabsList');
    expect(result).toContain('Trigger: TabsTrigger');
    expect(result).toContain('Content: TabsContent');

    expect(result).not.toContain('Root: TabsRoot');

    expect(result).toContain("displayName: 'Tabs'");
    expect(result).not.toContain("Tabs.displayName = 'Tabs';");
  });

  it('requires a Root part', () => {
    expect(() =>
      renderCompoundComponentTemplate({
        componentName: 'Tabs',
        parts: ['List', 'Trigger', 'Content'],
      })
    ).toThrow('Compound component "Tabs" requires a Root part.');
  });
});
