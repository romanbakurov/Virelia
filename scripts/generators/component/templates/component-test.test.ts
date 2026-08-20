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
    expect(result).toContain("[role=\"switch\"]");
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

  it('generates accessible trigger, interaction, and keyboard templates for web compound components', () => {
    const result = renderTestTemplate({
      componentName: 'Accordion',
      isNative: false,
      profile: 'compound',
      capabilities: ['compound-api', 'keyboard'],
      parts: ['Root', 'Trigger', 'Content'],
    });

    expect(result).toContain('accessible-name');
    expect(result).toContain('interaction');
    expect(result).toContain('keyboard');
    expect(result).toContain('exposes the declared compound API');
    expect(result).toContain('gives the trigger an accessible name');
    expect(result).toContain('forwards trigger activation');
    expect(result).toContain('keeps the trigger keyboard-focusable');
  });

  it('does not generate browser keyboard coverage for native compound components', () => {
    const result = renderTestTemplate({
      componentName: 'Accordion',
      isNative: true,
      profile: 'compound',
      capabilities: ['compound-api', 'keyboard'],
      parts: ['Root', 'Trigger', 'Content'],
    });

    expect(result).toContain('accessible-name');
    expect(result).toContain('interaction');
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
