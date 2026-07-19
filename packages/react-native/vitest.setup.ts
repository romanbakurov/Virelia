globalThis.IS_REACT_ACT_ENVIRONMENT = true;

import React from 'react';

import { Text } from 'react-native';
import { vi } from 'vitest';

vi.mock('@vellira-ui/icons', () => ({
  ChevronDown: () => React.createElement(Text, null, '⌄'),
  Check: () => React.createElement(Text, null, '✓'),
  Close: () => React.createElement(Text, null, '×'),
  Search: () => React.createElement(Text, null, '⌕'),
}));

vi.mock('react-native-svg', () => {
  const React = require('react');

  const Svg = ({ children }: { children?: React.ReactNode }) =>
    React.createElement('svg', props, children);

  const Path = () => React.createElement('path');

  return {
    default: Svg,
    Svg,
    Path,
  };
});
