import type { ReactNode } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';
import { createSelectSlot } from '../internal/SelectCollection';
import { useSelectContext } from '../internal/SelectContext';
import type { SelectLoadingProps } from '../types';

import { createContentStyles } from './SelectContent.styles';

const renderText = (node: ReactNode, style: object) => {
  if (typeof node === 'string' || typeof node === 'number') {
    return <Text style={style}>{node}</Text>;
  }

  return node;
};

export const SelectLoading = createSelectSlot<SelectLoadingProps>(
  'loading',
  'Select.Loading'
);

export const SelectLoadingState = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles(createContentStyles);
  const { loadingContent } = useSelectContext();

  return (
    <View style={styles.loading}>
      <ActivityIndicator
        testID='select-content-loading-indicator'
        size='small'
        color={theme.components.select.dropdown.fg}
      />
      {renderText(loadingContent, styles.loadingText)}
    </View>
  );
};

SelectLoadingState.displayName = 'Select.LoadingState';
