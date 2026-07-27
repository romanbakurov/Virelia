import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import {
  Button,
  Checkbox,
  Input,
  Tabs,
  ThemeProvider,
  useTheme,
} from '@vellira-ui/react-native';

type PreviewTab = 'design' | 'code';
type PreviewTheme = 'light' | 'dark' | 'high-contrast';

type WebsitePreviewMessage = {
  source: 'vellira-website';
  type: 'sync-preview';
  payload: {
    workspace: string;
    notificationsEnabled: boolean;
    activeTab: PreviewTab;
    theme: PreviewTheme;
  };
};

interface PreviewContentProps {
  workspace: string;
  notificationsEnabled: boolean;
  activeTab: PreviewTab;
  onWorkspaceChange: (value: string) => void;
  onNotificationsChange: (value: boolean) => void;
  onActiveTabChange: (value: PreviewTab) => void;
}

const isPreviewTheme = (value: unknown): value is PreviewTheme =>
  value === 'light' || value === 'dark' || value === 'high-contrast';

const isPreviewTab = (value: unknown): value is PreviewTab =>
  value === 'design' || value === 'code';

const isPreviewMessage = (value: unknown): value is WebsitePreviewMessage => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<WebsitePreviewMessage>;
  const payload = candidate.payload;

  if (!payload || typeof payload !== 'object') {
    return false;
  }

  return (
    candidate.source === 'vellira-website' &&
    candidate.type === 'sync-preview' &&
    typeof payload.workspace === 'string' &&
    typeof payload.notificationsEnabled === 'boolean' &&
    isPreviewTab(payload.activeTab) &&
    isPreviewTheme(payload.theme)
  );
};

export default function App() {
  const [loaded] = useFonts({
    'VelliraSans-Regular': require('@vellira-ui/assets/fonts/VelliraSans-Regular.ttf'),
    'VelliraSans-Medium': require('@vellira-ui/assets/fonts/VelliraSans-Medium.ttf'),
    'VelliraSans-SemiBold': require('@vellira-ui/assets/fonts/VelliraSans-SemiBold.ttf'),
  });

  const [workspace, setWorkspace] = useState('Vellira Native');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<PreviewTab>('design');
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>('light');

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
      setPreviewTheme(nextState.theme);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  if (!loaded) {
    return null;
  }

  const nativeTheme =
    previewTheme === 'high-contrast' ? 'highContrast' : previewTheme;

  return (
    <ThemeProvider theme={nativeTheme}>
      <PreviewContent
        workspace={workspace}
        notificationsEnabled={notificationsEnabled}
        activeTab={activeTab}
        onWorkspaceChange={setWorkspace}
        onNotificationsChange={setNotificationsEnabled}
        onActiveTabChange={setActiveTab}
      />
    </ThemeProvider>
  );
}

function PreviewContent({
  workspace,
  notificationsEnabled,
  activeTab,
  onWorkspaceChange,
  onNotificationsChange,
  onActiveTabChange,
}: PreviewContentProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Input
          label='Workspace'
          value={workspace}
          onValueChange={onWorkspaceChange}
        />

        <Checkbox
          label='Enable notifications'
          checked={notificationsEnabled}
          onCheckedChange={onNotificationsChange}
        />

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            if (isPreviewTab(value)) {
              onActiveTabChange(value);
            }
          }}
          variant='segmented'
        >
          <Tabs.List>
            <Tabs.Trigger value='design'>Design</Tabs.Trigger>
            <Tabs.Trigger value='code'>Code</Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>

          <Tabs.Content value='design'>
            <View />
          </Tabs.Content>

          <Tabs.Content value='code'>
            <View />
          </Tabs.Content>
        </Tabs>

        <Button fullWidth>Continue</Button>
      </View>
    </View>
  );
}

type ResolvedNativeTheme = ReturnType<typeof useTheme>['theme'];

const createStyles = (theme: ResolvedNativeTheme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.semantic.surface.background,
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
