import { Pressable, Text, View } from 'react-native';

import type { NativeThemeName } from '@vellira-ui/react-native';

type DeveloperPanelProps = {
  themeName: NativeThemeName;
  onChangeTheme: () => void;
};

const getThemeLabel = (themeName: NativeThemeName) => {
  if (themeName === 'highContrast') return 'High Contrast';
  if (themeName === 'dark') return 'Dark';

  return 'Light';
};

export const DeveloperPanel = ({
  themeName,
  onChangeTheme,
}: DeveloperPanelProps) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 48,
        right: 16,
        zIndex: 10,
        gap: 8,
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.75)',
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '600' }}>Developer</Text>

      <Pressable
        onPress={onChangeTheme}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
          backgroundColor: '#fff',
        }}
      >
        <Text style={{ color: '#000' }}>🎨 {getThemeLabel(themeName)}</Text>
      </Pressable>
    </View>
  );
};
