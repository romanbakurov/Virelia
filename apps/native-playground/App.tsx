import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import {
  Button,
  Checkbox,
  Input,
  Tabs,
  ThemeProvider,
} from '@vellira-ui/react-native';

type PreviewTab = 'design' | 'code';

type WebsitePreviewMessage = {
  source: 'vellira-website';
  type: 'sync-preview';
  payload: {
    workspace: string;
    notificationsEnabled: boolean;
    activeTab: PreviewTab;
  };
};

const isPreviewMessage = (value: unknown): value is WebsitePreviewMessage => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<WebsitePreviewMessage>;

  return (
    candidate.source === 'vellira-website' &&
    candidate.type === 'sync-preview' &&
    typeof candidate.payload?.workspace === 'string' &&
    typeof candidate.payload?.notificationsEnabled === 'boolean' &&
    (candidate.payload?.activeTab === 'design' ||
      candidate.payload?.activeTab === 'code')
  );
};

export default function App() {
  const [loaded] = useFonts({
    'VelliraSans-ExtraLight': require('@vellira-ui/assets/fonts/VelliraSans-ExtraLight.ttf'),
    'VelliraSans-Regular': require('@vellira-ui/assets/fonts/VelliraSans-Regular.ttf'),
    'VelliraSans-Medium': require('@vellira-ui/assets/fonts/VelliraSans-Medium.ttf'),
    'VelliraSans-SemiBold': require('@vellira-ui/assets/fonts/VelliraSans-SemiBold.ttf'),
    'VelliraSans-Bold': require('@vellira-ui/assets/fonts/VelliraSans-Bold.ttf'),
    'VelliraSans-ExtraBold': require('@vellira-ui/assets/fonts/VelliraSans-ExtraBold.ttf'),
  });

  const [workspace, setWorkspace] = useState('Vellira Native');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<PreviewTab>('design');

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return undefined;
    }

    const handleMessage = (event: MessageEvent<unknown>) => {
      if (event.origin !== 'http://localhost:3000') {
        return;
      }

      if (!isPreviewMessage(event.data)) {
        return;
      }

      const nextState = event.data.payload;

      setWorkspace(nextState.workspace);
      setNotificationsEnabled(nextState.notificationsEnabled);
      setActiveTab(nextState.activeTab);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider defaultTheme='light'>
      <View style={styles.screen}>
        <View style={styles.content}>
          <Input
            label='Workspace'
            value={workspace}
            onValueChange={setWorkspace}
          />

          <Checkbox
            label='Enable notifications'
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />

          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              if (value === 'design' || value === 'code') {
                setActiveTab(value);
              }
            }}
            variant='segmented'
          >
            <Tabs.List>
              <Tabs.Trigger value='design'>Design</Tabs.Trigger>
              <Tabs.Trigger value='code'>Code</Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>

            <Tabs.Content value='design' />
            <Tabs.Content value='code' />
          </Tabs>

          <Button fullWidth>Continue</Button>
        </View>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 22,
    paddingTop: 48,
    paddingBottom: 32,
  },
});
