import { describe, expect, it } from 'vitest';

import {
  assertGeneratedNativeTextHostSafety,
  NATIVE_TEXT_IMPORT,
  renderGeneratedNativeText,
  validateGeneratedNativeTextHostSafety,
} from './native-text-host';

describe('generated React Native text-host safety', () => {
  it('wraps generator-owned text for a View-like host', () => {
    expect(renderGeneratedNativeText('Content', 'view-like')).toBe(
      '<NativeText>Content</NativeText>'
    );
  });

  it('does not wrap text when the host is explicitly Text-like', () => {
    expect(renderGeneratedNativeText('Content', 'text-like')).toBe('Content');
  });

  it('accepts multiple NativeText-wrapped generated children', () => {
    const source = `<Example.Content>
  <NativeText>First message</NativeText>
  <NativeText>Second message</NativeText>
</Example.Content>`;

    expect(
      validateGeneratedNativeTextHostSafety({
        componentName: 'Example',
        surface: 'fixture',
        source,
      })
    ).toEqual([]);
  });

  it('reproduces the former Accordion raw-text-under-View failure', () => {
    const source = `<Accordion.Content>
  Choose when you want to receive updates.
</Accordion.Content>`;

    expect(() =>
      assertGeneratedNativeTextHostSafety({
        componentName: 'Accordion',
        surface: 'component-page generated native composition',
        source,
      })
    ).toThrow(
      /Accordion component-page generated native composition.*Choose when you want to receive updates.*<Accordion\.Content>.*must be wrapped in <NativeText>/s
    );
  });

  it('accepts the corrected Accordion shape', () => {
    const source = `<Accordion.Content>
  <NativeText>Choose when you want to receive updates.</NativeText>
</Accordion.Content>`;

    expect(() =>
      assertGeneratedNativeTextHostSafety({
        componentName: 'Accordion',
        surface: 'component-page generated native composition',
        source,
      })
    ).not.toThrow();
  });

  it('exposes the canonical deterministic NativeText import', () => {
    expect(NATIVE_TEXT_IMPORT).toBe(
      "import { Text as NativeText } from 'react-native';"
    );
  });
});
