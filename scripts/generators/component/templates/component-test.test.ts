import { describe, expect, it } from 'vitest';

import { renderManualTestTemplate, renderTestTemplate } from './component-test';

describe('component test templates', () => {
  it('keeps base output minimal', () => {
    const result = renderTestTemplate({
      componentName: 'Avatar',
      isNative: false,
      profile: 'base',
      capabilities: [],
    });

    expect(result).toContain('// Baseline contract: render, accessibility');
    expect(result).toContain("import { render } from '@test-utils/render';");
    expect(result).toContain("it('renders children'");
    expect(result).not.toContain('renders the disabled baseline state');
  });

  it('keeps generated test imports in canonical lint order', () => {
    const results = [
      renderTestTemplate({
        componentName: 'Avatar',
        isNative: false,
        profile: 'base',
      }),
      renderTestTemplate({
        componentName: 'Switch',
        isNative: false,
        profile: 'form-control',
        control: 'boolean',
      }),
      renderTestTemplate({
        componentName: 'Accordion',
        isNative: false,
        profile: 'compound',
        parts: ['Root', 'Item', 'Trigger', 'Content'],
      }),
    ];

    for (const result of results) {
      const testUtilsImport = result.indexOf(
        "import { render } from '@test-utils/render';"
      );
      const vitestImport = result.indexOf(" from 'vitest';");

      expect(testUtilsImport).toBeGreaterThanOrEqual(0);
      expect(vitestImport).toBeGreaterThanOrEqual(0);
      expect(testUtilsImport).toBeLessThan(vitestImport);
    }
  });

  it('generates controlled, state, and accessibility coverage for boolean controls', () => {
    const result = renderTestTemplate({
      componentName: 'Switch',
      isNative: false,
      profile: 'form-control',
      control: 'boolean',
      capabilities: [
        'controlled',
        'uncontrolled',
        'disabled',
        'required',
        'invalid',
      ],
    });

    expect(result).toContain('state-change callback');
    expect(result).toContain('controlled baseline contract');
    expect(result).toContain('uncontrolled baseline contract');
    expect(result).toContain("it('renders the disabled baseline state'");
    expect(result).toContain("it('renders the required baseline state'");
    expect(result).toContain("it('renders the invalid baseline state'");
    expect(result).toContain('web switch semantics');
    expect(result).toContain('[role="switch"]');
    expect(result).toContain('onCheckedChange');
  });

  it('generates native text-entry accessibility coverage', () => {
    const result = renderTestTemplate({
      componentName: 'Textarea',
      isNative: true,
      profile: 'form-control',
      control: 'text',
      capabilities: ['controlled', 'uncontrolled', 'disabled'],
    });

    expect(result).toContain('controlled baseline contract');
    expect(result).toContain('uncontrolled baseline contract');
    expect(result).toContain('renders a text-entry control');
    expect(result).toContain("querySelector('textarea, input')");
  });

  it('keeps component-specific Web compound keyboard behavior out of generated tests', () => {
    const result = renderTestTemplate({
      componentName: 'Accordion',
      isNative: false,
      profile: 'compound',
      capabilities: ['compound-api', 'keyboard'],
      parts: ['Root', 'Item', 'Trigger', 'Content'],
    });

    expect(result).toContain(
      '// Baseline contract: render, accessibility, compound-api'
    );
    expect(result).toContain('exposes the declared compound API');
    expect(result).not.toContain('gives the trigger an accessible name');
    expect(result).not.toContain('forwards trigger activation');
    expect(result).not.toContain('keyboard-focusable');
  });

  it('renders a deterministic manual coverage marker skeleton', () => {
    const result = renderManualTestTemplate({
      componentName: 'Disclosure',
      isNative: false,
      requirements: [
        'accessible-name',
        'interaction',
        'controlled',
        'uncontrolled',
        'disabled',
        'keyboard',
      ],
    });

    expect(result).toContain(
      '// Coverage contract: accessible-name, interaction, controlled, uncontrolled, disabled, keyboard'
    );
    expect(result).toContain("describe('Disclosure manual behavior coverage'");
    expect(result).not.toContain('KeyboardEvent');
    expect(result).not.toContain('expect(');
  });

  it('does not generate browser keyboard coverage for native compound components', () => {
    const result = renderTestTemplate({
      componentName: 'Accordion',
      isNative: true,
      profile: 'compound',
      capabilities: ['compound-api', 'keyboard'],
      parts: ['Root', 'Item', 'Trigger', 'Content'],
    });

    expect(result).toContain(
      '// Baseline contract: render, accessibility, compound-api'
    );
    expect(result).not.toContain('gives the trigger an accessible name');
    expect(result).not.toContain('forwards trigger activation');
    expect(result).not.toContain('keyboard-focusable');
    expect(result).toContain("describe('Native Accordion'");
  });

  it('generates controlled and uncontrolled overlay state coverage', () => {
    const result = renderTestTemplate({
      componentName: 'Dialog',
      isNative: false,
      profile: 'overlay',
      capabilities: [
        'controlled',
        'uncontrolled',
        'keyboard',
        'focus-management',
        'compound-api',
        'portal',
      ],
      parts: ['Root', 'Trigger', 'Content'],
    });

    expect(result).toContain('supports the controlled open contract');
    expect(result).toContain('supports the uncontrolled defaultOpen contract');
    expect(result).toContain('keeps the trigger keyboard-focusable');
  });
});
