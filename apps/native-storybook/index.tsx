import { useFonts } from 'expo-font';
import { registerRootComponent } from 'expo';

import StorybookUIRoot from './.rnstorybook';

function App() {
  const [loaded] = useFonts({
    'VelliraSans-ExtraLight': require('@vellira-ui/assets/fonts/VelliraSans-ExtraLight.ttf'),
    'VelliraSans-Regular': require('@vellira-ui/assets/fonts/VelliraSans-Regular.ttf'),
    'VelliraSans-Medium': require('@vellira-ui/assets/fonts/VelliraSans-Medium.ttf'),
    'VelliraSans-SemiBold': require('@vellira-ui/assets/fonts/VelliraSans-SemiBold.ttf'),
    'VelliraSans-Bold': require('@vellira-ui/assets/fonts/VelliraSans-Bold.ttf'),
    'VelliraSans-ExtraBold': require('@vellira-ui/assets/fonts/VelliraSans-ExtraBold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return <StorybookUIRoot />;
}

registerRootComponent(App);
