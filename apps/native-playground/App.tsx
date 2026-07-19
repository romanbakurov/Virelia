import { useFonts } from 'expo-font';
import { StyleSheet, View, Alert } from 'react-native';

import { Button } from '@vellira-ui/react-native';

export default function App() {
  const [loaded] = useFonts({
    'VelliraSans-ExtraLight': require('./assets/fonts/VelliraSans-ExtraLight.ttf'),
    'VelliraSans-Regular': require('./assets/fonts/VelliraSans-Regular.ttf'),
    'VelliraSans-Medium': require('./assets/fonts/VelliraSans-Medium.ttf'),
    'VelliraSans-SemiBold': require('./assets/fonts/VelliraSans-SemiBold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Button
        color='primary'
        appearance='solid'
        size='md'
        onPress={() => Alert.alert('Vellira!')}
      >
        Click me
      </Button>
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
