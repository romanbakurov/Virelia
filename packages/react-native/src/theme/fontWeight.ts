import type { TextStyle } from 'react-native';

const nativeFontWeights = new Set([
  'normal',
  'bold',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
]);

export function toNativeFontWeight(
  weight: string | number
): TextStyle['fontWeight'] {
  const normalizedWeight = String(weight);

  if (!nativeFontWeights.has(normalizedWeight)) {
    return 'normal';
  }

  return normalizedWeight as TextStyle['fontWeight'];
}
