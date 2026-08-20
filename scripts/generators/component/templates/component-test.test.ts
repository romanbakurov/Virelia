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
    expect(result).toContain("it('renders the controlled baseline contract'");
    expect(result).toContain("it('renders the uncontrolled baseline contract'");
    expect(result).toContain('<Switch checked />');
    expect(result).toContain('<Switch defaultChecked />');
    expect(result).toContain("it('renders the disabled baseline state'");
    expect(result).toContain("it('renders the required baseline state'");
    expect(result).toContain("it('renders the invalid baseline state'");
    expect(result).toContain('onCheckedChange');
  });

  it('generates value form-control controlled and uncontrolled contracts', () => {
    const result = renderTestTemplate({
      componentName: 'Textarea',
      isNative: true,
      profile: 'form-control',
      control: 'text',
      capabilities: ['controlled', 'uncontrolled'],
    });

    expect(result).toContain("describe('Native Textarea'");
    expect(result).toContain("value='Controlled value'");
    expect(result).toContain("defaultValue='Default value'");
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
