import {
  requireTokenValueKind,
  type TokenValueKind,
} from '../../../packages/tokens/src/token-architecture.js';

function lowerCamel(componentName: string) {
  return `${componentName[0].toLowerCase()}${componentName.slice(1)}`;
}

export function requireGeneratedComponentNumericValueKind(params: {
  componentName: string;
  section: string;
  role: string;
  value: number;
}): TokenValueKind {
  const component = lowerCamel(params.componentName);
  const tokenPath = `components.${component}.${params.section}.${params.role}`;

  return requireTokenValueKind(tokenPath, params.value);
}
