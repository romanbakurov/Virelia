import type { ComponentProfileArg, FormControlKindArg } from '../cli';
import type { ComponentTemplateParams } from './component-types';

export type ComponentTokensTemplateParams = ComponentTemplateParams & {
  profile?: ComponentProfileArg;
  control?: FormControlKindArg;
};

function lowerCamel(componentName: string) {
  return `${componentName[0].toLowerCase()}${componentName.slice(1)}`;
}

export function renderComponentTokenFactoryTemplate({
  componentName,
  profile = 'base',
  control = 'value',
}: ComponentTokensTemplateParams) {
  if (profile === 'form-control' && control === 'boolean') {
    return `export type ${componentName}VisualState = {
  trackBg: string;
  trackBorder: string;
  thumbBg: string;
};

export type ${componentName}Geometry = {
  trackWidth: number;
  trackHeight: number;
  borderWidth: number;
  padding: number;
  thumbSize: number;
  thumbTravel: number;
  focusRingWidth: number;
  focusRingOffset: number;
  pressScale: number;
};

export type ${componentName}TokensConfig = {
  geometry: ${componentName}Geometry;
  off: ${componentName}VisualState;
  on: {
    default: ${componentName}VisualState;
    hover: ${componentName}VisualState;
    pressed: ${componentName}VisualState;
  };
  focusRing: string;
  errorBorder: string;
  errorRing: string;
  disabled: ${componentName}VisualState;
};

export const create${componentName}Tokens = (
  config: ${componentName}TokensConfig
) => config;
`;
  }

  return `export type ${componentName}VisualState = {
  bg: string;
  fg: string;
  border: string;
};

export type ${componentName}TokensConfig = {
  default: ${componentName}VisualState;
  hover: ${componentName}VisualState;
  pressed: ${componentName}VisualState;
  focusRing: string;
  error: {
    fg: string;
    border: string;
    ring: string;
  };
  disabled: ${componentName}VisualState;
};

export const create${componentName}Tokens = (
  config: ${componentName}TokensConfig
) => config;
`;
}

export function renderThemeComponentTokensTemplate({
  componentName,
  profile = 'base',
  control = 'value',
}: ComponentTokensTemplateParams) {
  const tokenName = `${lowerCamel(componentName)}Tokens`;

  if (profile === 'form-control' && control === 'boolean') {
    return `import { create${componentName}Tokens } from '../../factories/create${componentName}Tokens.js';
import { control } from '../semantic/control.js';
import { focus } from '../semantic/focus.js';
import { status } from '../semantic/status.js';

export const ${tokenName} = create${componentName}Tokens({
  geometry: {
    trackWidth: 44,
    trackHeight: 24,
    borderWidth: 2,
    padding: 1,
    thumbSize: 18,
    thumbTravel: 20,
    focusRingWidth: 2,
    focusRingOffset: 2,
    pressScale: 0.98,
  },
  off: {
    trackBg: control.default.bg,
    trackBorder: control.default.border,
    thumbBg: control.default.fg,
  },
  on: {
    default: {
      trackBg: control.selected.default.bg,
      trackBorder: control.selected.default.border,
      thumbBg: control.selected.default.fg,
    },
    hover: {
      trackBg: control.selected.hover.bg,
      trackBorder: control.selected.hover.border,
      thumbBg: control.selected.hover.fg,
    },
    pressed: {
      trackBg: control.selected.active.bg,
      trackBorder: control.selected.active.border,
      thumbBg: control.selected.active.fg,
    },
  },
  focusRing: focus.ring.color,
  errorBorder: status.error.border,
  errorRing: status.error.ring,
  disabled: {
    trackBg: control.disabled.bg,
    trackBorder: control.disabled.border,
    thumbBg: control.disabled.fg,
  },
});
`;
  }

  return `import { create${componentName}Tokens } from '../../factories/create${componentName}Tokens.js';
import { control } from '../semantic/control.js';
import { focus } from '../semantic/focus.js';
import { status } from '../semantic/status.js';

export const ${tokenName} = create${componentName}Tokens({
  default: control.default,
  hover: control.hover,
  pressed: control.active,
  focusRing: focus.ring.color,
  error: {
    fg: status.error.fg,
    border: status.error.border,
    ring: status.error.ring,
  },
  disabled: control.disabled,
});
`;
}

export function renderComponentTokenBarrelExport(componentName: string) {
  const tokenName = `${lowerCamel(componentName)}Tokens`;
  const exportName = lowerCamel(componentName);

  return `export { ${tokenName} as ${exportName} } from './${exportName}.js';`;
}

export function renderComponentTokenFactoryBarrelExport(componentName: string) {
  return `export * from './create${componentName}Tokens.js';`;
}
