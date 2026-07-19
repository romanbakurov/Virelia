import { View } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { createPresentationStyles } from './SelectPresentation.styles';

export const SelectHandle = () => {
  const styles = useThemeStyles(createPresentationStyles);

  return (
    <View style={styles.handleWrap} accessible={false}>
      <View style={styles.handle} />
    </View>
  );
};

SelectHandle.displayName = 'Select.Handle';
