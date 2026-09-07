export const componentShadowLevels = ['sm', 'md', 'lg', 'xl'] as const;

export type ComponentShadowLevel = (typeof componentShadowLevels)[number];

export type ComponentShadowIntent = Readonly<{
  kind: 'shadow';
  level: ComponentShadowLevel;
}>;

export type ComponentViewportHeightIntent = Readonly<{
  kind: 'viewport-height';
  ratio: number;
}>;

export type ComponentPlatformIntent =
  | ComponentShadowIntent
  | ComponentViewportHeightIntent;

export type ReactNativeShadowOutput = Readonly<{
  x: number;
  y: number;
  blur: number;
  color: string;
  opacity: number;
  elevation: number;
}>;

export type ComponentPlatformOutputSources = Readonly<{
  web: {
    shadow: Readonly<Record<ComponentShadowLevel, string>>;
  };
  reactNative: {
    shadow: Readonly<Record<ComponentShadowLevel, ReactNativeShadowOutput>>;
  };
}>;

export function createComponentShadowIntent(
  level: ComponentShadowLevel
): ComponentShadowIntent {
  return { kind: 'shadow', level };
}

export function createComponentViewportHeightIntent(
  ratio: number
): ComponentViewportHeightIntent {
  if (!Number.isFinite(ratio) || ratio <= 0 || ratio > 1) {
    throw new Error(
      `Component viewport-height ratio must be finite and within (0, 1], received ${ratio}.`
    );
  }

  return { kind: 'viewport-height', ratio };
}

export function isComponentPlatformIntent(
  value: unknown
): value is ComponentPlatformIntent {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    (candidate.kind === 'shadow' &&
      typeof candidate.level === 'string' &&
      componentShadowLevels.includes(candidate.level as ComponentShadowLevel)) ||
    (candidate.kind === 'viewport-height' &&
      typeof candidate.ratio === 'number')
  );
}

function formatPercentage(ratio: number): string {
  const percentage = ratio * 100;
  return Number.isInteger(percentage)
    ? String(percentage)
    : String(Number(percentage.toFixed(4)));
}

export function resolveComponentIntentForWeb(
  intent: ComponentPlatformIntent,
  sources: ComponentPlatformOutputSources
): string {
  if (intent.kind === 'shadow') {
    return sources.web.shadow[intent.level];
  }

  return `${formatPercentage(intent.ratio)}vh`;
}

export function resolveComponentIntentForReactNative(
  intent: ComponentPlatformIntent,
  sources: ComponentPlatformOutputSources
): string | ReactNativeShadowOutput {
  if (intent.kind === 'shadow') {
    return sources.reactNative.shadow[intent.level];
  }

  return `${formatPercentage(intent.ratio)}%`;
}

function adaptComponentTokenTree(
  value: unknown,
  resolveIntent: (intent: ComponentPlatformIntent) => unknown
): unknown {
  if (isComponentPlatformIntent(value)) {
    return resolveIntent(value);
  }

  if (Array.isArray(value)) {
    return value.map((entry) => adaptComponentTokenTree(entry, resolveIntent));
  }

  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        adaptComponentTokenTree(entry, resolveIntent),
      ])
    );
  }

  return value;
}

export function adaptComponentTokensForWeb<T>(
  components: T,
  sources: ComponentPlatformOutputSources
): T {
  return adaptComponentTokenTree(components, (intent) =>
    resolveComponentIntentForWeb(intent, sources)
  ) as T;
}

export function adaptComponentTokensForReactNative<T>(
  components: T,
  sources: ComponentPlatformOutputSources
): T {
  return adaptComponentTokenTree(components, (intent) =>
    resolveComponentIntentForReactNative(intent, sources)
  ) as T;
}
