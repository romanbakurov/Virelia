import type { ComponentExpansionTarget } from './expansion';

export const componentExpansionCatalog = [
  {
    name: 'Textarea',
    layer: 'primitives',
    category: 'form',
    platforms: ['react', 'react-native'],
    profile: 'form-control',
    role: 'form-control',
  },
  {
    name: 'Accordion',
    layer: 'components',
    category: 'layout',
    platforms: ['react', 'react-native'],
    profile: 'compound',
    role: 'catalog',
  },
  {
    name: 'Avatar',
    layer: 'primitives',
    category: 'data-display',
    platforms: ['react', 'react-native'],
    profile: 'base',
    role: 'foundational',
  },
  {
    name: 'Badge',
    layer: 'primitives',
    category: 'data-display',
    platforms: ['react', 'react-native'],
    profile: 'base',
    role: 'foundational',
  },
] as const satisfies readonly ComponentExpansionTarget[];
