import { describe, expect, it } from 'vitest';

import { renderTestTemplate } from './component-test';

describe('component test templates', () => {
  it('keeps base output minimal', () => {
    const result = renderTestTemplate({
      componentName: 'Avatar',
      isNative: false,
      profile: 'base',
      capabilities: [],
    });

    expect(result).toContain('// Baseline contract: render, accessibility');
    expect(result).toContain("it('renders children'");
    expect(result).not.toContain('renders the disabled baseline state');
  });

  it('generates boolean form-control baseline states from capabilities', () => {
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

    expect(result).toContain('callback');
    expect(result).toContain("it('renders the disabled baseline state'");
    expect(result).toContain("it('renders the required baseline state'");
    expect(result).toContain("it('renders the invalid baseline state'");
    expect(result).toContain('onCheckedChange');
  });

  it('records compound capabilities in the generated baseline contract', () => {
    const result = renderTestTemplate({
      componentName: 'Accordion',
      isNative: true,
      profile: 'compound',
      capabilities: ['compound-api', 'keyboard'],
    });

    expect(result).toContain(
      '// Baseline contract: render, accessibility, compound-api, keyboard'
    );
    expect(result).toContain("describe('Native Accordion'");
  });
});
