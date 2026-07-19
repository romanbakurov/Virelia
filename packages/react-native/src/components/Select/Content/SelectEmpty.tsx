import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { useThemeStyles } from '../../../theme';
import { createSelectSlot } from '../internal/SelectCollection';
import { useSelectContext } from '../internal/SelectContext';
import type { SelectEmptyProps } from '../types';

import { createContentStyles } from './SelectContent.styles';

const renderText = (node: ReactNode, style: object) => {
  if (typeof node === 'string' || typeof node === 'number') {
    return <Text style={style}>{node}</Text>;
  }

  return node;
};

export const SelectEmpty = createSelectSlot<SelectEmptyProps>(
  'empty',
  'Select.Empty'
);

export const SelectEmptyState = () => {
  const styles = useThemeStyles(createContentStyles);
  const { empty } = useSelectContext();

  return (
    <View style={styles.empty}>{renderText(empty, styles.emptyText)}</View>
  );
};

SelectEmptyState.displayName = 'Select.EmptyState';
