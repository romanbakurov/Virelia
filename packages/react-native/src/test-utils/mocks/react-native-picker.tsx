// packages/react-native/src/test-utils/mocks/react-native-picker.tsx

import React from 'react';

import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, Text, View } from 'react-native';

interface PickerProps {
  selectedValue?: string;
  enabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  onValueChange?: (value: string) => void;
}

interface PickerItemProps {
  label: string;
  value: string;
  enabled?: boolean;
  color?: string;
  onPress?: () => void;
}

export function Picker({
  children,
  enabled = true,
  onValueChange,
  style,
}: PickerProps) {
  return (
    <View testID='native-picker' style={style}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<PickerItemProps>(child)) {
          return child;
        }

        const { label, value, enabled: itemEnabled = true } = child.props;
        const isEnabled = enabled && itemEnabled;

        return (
          <Pressable
            disabled={!isEnabled}
            onPress={() => {
              if (!isEnabled) return;
              onValueChange?.(value);
            }}
          >
            <Text>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

Picker.Item = function PickerItem(_props: PickerItemProps) {
  return null;
};
