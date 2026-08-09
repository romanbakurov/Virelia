import type { ComponentType } from 'react';

import type { ComponentPlatform } from '../types';

import { ButtonDemo } from './ButtonDemo';
import { NativeButtonDemo } from './NativeButtonDemo';

type PlatformDemoRegistry = Partial<Record<ComponentPlatform, ComponentType>>;

export const componentDemos: Record<string, PlatformDemoRegistry> = {
  button: {
    react: ButtonDemo,
    'react-native': NativeButtonDemo,
  },
};
