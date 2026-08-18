import { writeFixtureFile } from './repo';

export function createPassingWebFixture(rootDir: string) {
  const docsBase =
    'apps/website/src/component-catalog/components/PassingProductionWeb';

  writeFixtureFile(
    rootDir,
    `${docsBase}/PassingProductionWebUsage.tsx`,
    `
export function PassingProductionWebUsage() {
  return <p>Usage documentation for the PassingProductionWeb component with practical application guidance.</p>;
}
`
  );

  writeFixtureFile(
    rootDir,
    `${docsBase}/PassingProductionWebExamples.tsx`,
    `
export function PassingProductionWebExamples() {
  return <p>Examples demonstrating default and disabled states for PassingProductionWeb in application interfaces.</p>;
}
`
  );

  writeFixtureFile(
    rootDir,
    `${docsBase}/PassingProductionWebApi.ts`,
    `
export const PassingProductionWebApi = {
  disabled: 'Disables user interaction and exposes the disabled state through the public component API.',
};
`
  );

  writeFixtureFile(
    rootDir,
    `${docsBase}/PassingProductionWebAccessibility.tsx`,
    `
export function PassingProductionWebAccessibility() {
  return <p>The component uses a semantic button element and preserves native accessibility semantics when disabled.</p>;
}
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react/src/components/PassingProductionWeb/index.ts',
    `
export { PassingProductionWeb } from './PassingProductionWeb';
export type { PassingProductionWebProps } from './types';
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react/src/components/PassingProductionWeb/types.ts',
    `
export interface PassingProductionWebProps {
  disabled?: boolean;
}
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react/src/components/PassingProductionWeb/PassingProductionWeb.tsx',
    `
import type { PassingProductionWebProps } from './types';

export function PassingProductionWeb({
  disabled,
}: PassingProductionWebProps) {
  return <button disabled={disabled}>Fixture</button>;
}
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react/src/components/PassingProductionWeb/PassingProductionWeb.module.scss',
    `
.root {
  color: var(--text-primary);
  padding: var(--space-2);
}
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react/src/components/PassingProductionWeb/PassingProductionWeb.test.tsx',
    `
import { expect, it } from 'vitest';

it('supports disabled state', () => {
  const disabled = true;
  expect(disabled).toBe(true);
});
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react/src/components/PassingProductionWeb/PassingProductionWeb.stories.tsx',
    `
export const Default = {};
export const Disabled = { args: { disabled: true } };
`
  );
}

export function createPassingNativeFixture(rootDir: string) {
  writeFixtureFile(
    rootDir,
    'packages/react-native/src/components/PassingProductionNative/index.ts',
    `
export { PassingProductionNative } from './PassingProductionNative';
export type { PassingProductionNativeProps } from './types';
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react-native/src/components/PassingProductionNative/types.ts',
    `
export interface PassingProductionNativeProps {
  disabled?: boolean;
}
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react-native/src/components/PassingProductionNative/PassingProductionNative.tsx',
    `
import { Pressable } from 'react-native';

import type { PassingProductionNativeProps } from './types';

export function PassingProductionNative({
  disabled,
}: PassingProductionNativeProps) {
  return (
    <Pressable
      disabled={disabled}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      onPress={() => undefined}
    />
  );
}
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react-native/src/components/PassingProductionNative/PassingProductionNative.test.tsx',
    `
import { expect, it } from 'vitest';

it('supports disabled state', () => {
  const disabled = true;
  expect(disabled).toBe(true);
});
`
  );
}

export function createPassingCrossPlatformFixture(rootDir: string) {
  writeFixtureFile(
    rootDir,
    'packages/react/src/components/PassingProductionCrossPlatform/index.ts',
    `
export { PassingProductionCrossPlatform } from './PassingProductionCrossPlatform';
export type { PassingProductionCrossPlatformProps } from './types';
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react/src/components/PassingProductionCrossPlatform/types.ts',
    `
export interface PassingProductionCrossPlatformProps {
  disabled?: boolean;
}
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react/src/components/PassingProductionCrossPlatform/PassingProductionCrossPlatform.tsx',
    `
import type { PassingProductionCrossPlatformProps } from './types';

export function PassingProductionCrossPlatform({
  disabled,
}: PassingProductionCrossPlatformProps) {
  return <button disabled={disabled}>Web fixture</button>;
}
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react/src/components/PassingProductionCrossPlatform/PassingProductionCrossPlatform.test.tsx',
    `
import { expect, it } from 'vitest';

it('supports disabled state', () => {
  const disabled = true;
  expect(disabled).toBe(true);
});
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react-native/src/components/PassingProductionCrossPlatform/index.ts',
    `
export { PassingProductionCrossPlatform } from './PassingProductionCrossPlatform';
export type { PassingProductionCrossPlatformProps } from './types';
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react-native/src/components/PassingProductionCrossPlatform/types.ts',
    `
export interface PassingProductionCrossPlatformProps {
  disabled?: boolean;
}
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react-native/src/components/PassingProductionCrossPlatform/PassingProductionCrossPlatform.tsx',
    `
import { Pressable } from 'react-native';

import type { PassingProductionCrossPlatformProps } from './types';

export function PassingProductionCrossPlatform({
  disabled,
}: PassingProductionCrossPlatformProps) {
  return (
    <Pressable
      disabled={disabled}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      onPress={() => undefined}
    />
  );
}
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react-native/src/components/PassingProductionCrossPlatform/PassingProductionCrossPlatform.test.tsx',
    `
import { expect, it } from 'vitest';

it('supports disabled state', () => {
  const disabled = true;
  expect(disabled).toBe(true);
});
`
  );
}

export function createNotApplicableFixture(rootDir: string) {
  writeFixtureFile(
    rootDir,
    'packages/react/src/components/NotApplicableProduction/index.ts',
    `
export { NotApplicableProduction } from './NotApplicableProduction';
export type { NotApplicableProductionProps } from './types';
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react/src/components/NotApplicableProduction/types.ts',
    `
export interface NotApplicableProductionProps {}
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react/src/components/NotApplicableProduction/NotApplicableProduction.tsx',
    `
import type { NotApplicableProductionProps } from './types';

export function NotApplicableProduction(
  _props: NotApplicableProductionProps
) {
  return <div>Fixture</div>;
}
`
  );
}

export function createNativeLayoutOnlyFixture(rootDir: string) {
  writeFixtureFile(
    rootDir,
    'packages/react-native/src/components/NativeLayoutOnly/index.ts',
    `
export { NativeLayoutOnly } from './NativeLayoutOnly';
export type { NativeLayoutOnlyProps } from './types';
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react-native/src/components/NativeLayoutOnly/types.ts',
    `
export interface NativeLayoutOnlyProps {}
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react-native/src/components/NativeLayoutOnly/NativeLayoutOnly.tsx',
    `
import { View } from 'react-native';

import type { NativeLayoutOnlyProps } from './types';

export function NativeLayoutOnly(_props: NativeLayoutOnlyProps) {
  return <View />;
}
`
  );

  writeFixtureFile(
    rootDir,
    'packages/react-native/src/components/NativeLayoutOnly/NativeLayoutOnly.styles.ts',
    `
export const styles = {
  root: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
};
`
  );
}
