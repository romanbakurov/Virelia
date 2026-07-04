import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';

import { Button, Checkbox } from '@vellira-ui/react-native';

export default function App() {
  const [loaded] = useFonts({
    'KantumruyPro-ExtraLight': require('./assets/fonts/KantumruyPro-ExtraLight.ttf'),
    'KantumruyPro-Regular': require('./assets/fonts/KantumruyPro-Regular.ttf'),
    'KantumruyPro-Medium': require('./assets/fonts/KantumruyPro-Medium.ttf'),
    'KantumruyPro-SemiBold': require('./assets/fonts/KantumruyPro-SemiBold.ttf'),
  });

  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Button
        variant='primary'
        size='md'
        onPress={() => Alert.alert('Vellira!')}
      >
        Click me
      </Button>
      <Checkbox label='Enable updates' />
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
