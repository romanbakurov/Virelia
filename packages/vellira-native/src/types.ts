import type { StyleProp, ViewStyle } from 'react-native';

export interface NativeComponentProps {
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
