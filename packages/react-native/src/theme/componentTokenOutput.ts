import {
  adaptComponentTokensForReactNative,
  adaptComponentTokensForWeb,
  createComponentPlatformOutputSources,
} from '@vellira-ui/tokens';

import type { NativeTheme } from './themes';

export function resolveComponentTokenPlatformOutputs<T>(
  theme: NativeTheme,
  componentTokens: T
) {
  const sources = createComponentPlatformOutputSources(theme);

  return {
    web: adaptComponentTokensForWeb(componentTokens, sources),
    reactNative: adaptComponentTokensForReactNative(componentTokens, sources),
  } as const;
}
