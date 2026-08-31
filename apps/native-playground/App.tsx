import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  Check,
  ChevronDown,
  Copy,
  Download,
  Grid,
  Monitor,
  Settings,
  Smartphone,
  Users,
} from '@vellira-ui/icons';
import {
  Button,
  Checkbox,
  Dropdown,
  Input,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Tabs,
  ThemeProvider,
  useTheme,
} from '@vellira-ui/react-native';

type PreviewTab = 'overview' | 'permissions';
type PreviewDensity = 'comfortable' | 'compact';
type PreviewTeam = 'design' | 'platform' | 'mobile';
type PreviewTheme = 'light' | 'dark' | 'high-contrast';

type WebsitePreviewMessage = {
  source: 'vellira-website';
  type: 'sync-preview';
  payload: {
    workspace: string;
    notificationsEnabled: boolean;
    activeTab: PreviewTab;
    density: PreviewDensity;
    team: PreviewTeam;
    theme: PreviewTheme;
  };
};

interface PreviewContentProps {
  workspace: string;
  notificationsEnabled: boolean;
  activeTab: PreviewTab;
  density: PreviewDensity;
  team: PreviewTeam;
  onWorkspaceChange: (value: string) => void;
  onNotificationsChange: (value: boolean) => void;
  onActiveTabChange: (value: PreviewTab) => void;
  onDensityChange: (value: PreviewDensity) => void;
  onTeamChange: (value: PreviewTeam) => void;
}

const isPreviewTheme = (value: unknown): value is PreviewTheme =>
  value === 'light' || value === 'dark' || value === 'high-contrast';

const isPreviewTab = (value: unknown): value is PreviewTab =>
  value === 'overview' || value === 'permissions';

const isPreviewDensity = (value: unknown): value is PreviewDensity =>
  value === 'comfortable' || value === 'compact';

const isPreviewTeam = (value: unknown): value is PreviewTeam =>
  value === 'design' || value === 'platform' || value === 'mobile';

const isTrustedWebsiteOrigin = (origin: string): boolean =>
  origin.startsWith('http://localhost:') ||
  origin.startsWith('http://127.0.0.1:');

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
    isPreviewDensity(payload.density) &&
    isPreviewTeam(payload.team) &&
    isPreviewTheme(payload.theme)
  );
};

export default function App() {
  const [loaded, fontError] = useFonts({
    'VelliraSans-Regular': require('@vellira-ui/assets/fonts/VelliraSans-Regular.ttf'),
    'VelliraSans-Medium': require('@vellira-ui/assets/fonts/VelliraSans-Medium.ttf'),
    'VelliraSans-SemiBold': require('@vellira-ui/assets/fonts/VelliraSans-SemiBold.ttf'),
  });

  const [workspace, setWorkspace] = useState('Vellira Product Suite');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<PreviewTab>('overview');
  const [density, setDensity] = useState<PreviewDensity>('comfortable');
  const [team, setTeam] = useState<PreviewTeam>('design');
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>('light');

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return undefined;
    }

    const handleMessage = (event: MessageEvent<unknown>) => {
      if (!isTrustedWebsiteOrigin(event.origin)) {
        return;
      }

      if (!isPreviewMessage(event.data)) {
        return;
      }

      const nextState = event.data.payload;

      setWorkspace(nextState.workspace);
      setNotificationsEnabled(nextState.notificationsEnabled);
      setActiveTab(nextState.activeTab);
      setDensity(nextState.density);
      setTeam(nextState.team);
      setPreviewTheme(nextState.theme);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  if (!loaded) {
    return (
      <View style={fallbackStyles.screen}>
        <Text style={fallbackStyles.text}>
          {fontError ? 'Unable to load Vellira fonts' : 'Loading Vellira fonts'}
        </Text>
      </View>
    );
  }

  const nativeTheme =
    previewTheme === 'high-contrast' ? 'highContrast' : previewTheme;

  return (
    <ThemeProvider theme={nativeTheme}>
      <PreviewContent
        workspace={workspace}
        notificationsEnabled={notificationsEnabled}
        activeTab={activeTab}
        density={density}
        team={team}
        onWorkspaceChange={setWorkspace}
        onNotificationsChange={setNotificationsEnabled}
        onActiveTabChange={setActiveTab}
        onDensityChange={setDensity}
        onTeamChange={setTeam}
      />
    </ThemeProvider>
  );
}

function PreviewContent({
  workspace,
  notificationsEnabled,
  activeTab,
  density,
  team,
  onWorkspaceChange,
  onNotificationsChange,
  onActiveTabChange,
  onDensityChange,
  onTeamChange,
}: PreviewContentProps) {
  const { theme, themeName } = useTheme();
  const styles = createStyles(theme);
  const [lastModalClose, setLastModalClose] = useState('None');
  const headerIconColor =
    themeName === 'light'
      ? theme.semantic.text.brand
      : theme.semantic.action.primary.muted.fg;

  const selectedTeam =
    team === 'design'
      ? 'Design systems'
      : team === 'platform'
        ? 'Platform team'
        : 'Mobile squad';

  return (
    <View style={styles.screen}>
      <View style={styles.statusBar} aria-hidden>
        <Text style={styles.statusTime}>9:41</Text>

        <View style={styles.statusIndicators}>
          <Text style={styles.statusNetwork}>5G</Text>

          <View style={styles.signalBars}>
            <View style={[styles.signalBar, styles.signalBarShort]} />
            <View style={[styles.signalBar, styles.signalBarMedium]} />
            <View style={styles.signalBar} />
          </View>

          <View style={styles.battery}>
            <View style={styles.batteryFill} />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Smartphone color={headerIconColor} size={18} />
          </View>

          <View style={styles.headerText}>
            <Text style={styles.headerLabel}>React Native</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {workspace || 'Untitled workspace'}
            </Text>
          </View>

          <Dropdown>
            <Dropdown.Trigger>
              <Button
                accessibilityLabel='Native actions'
                appearance='outline'
                color='neutral'
                iconStart={<ChevronDown />}
                iconOnly
                size='sm'
                style={styles.headerActionButton}
              />
            </Dropdown.Trigger>

            <Dropdown.Content presentation='sheet'>
              <Dropdown.Label>Native actions</Dropdown.Label>
              <Dropdown.Item value='copy' icon={<Copy />}>
                Copy config
              </Dropdown.Item>
              <Dropdown.Item value='export' icon={<Download />}>
                Export bundle
              </Dropdown.Item>
              <Dropdown.Separator />
              <Dropdown.Item value='settings' icon={<Settings />}>
                Rollout rules
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </View>

        <View style={styles.card}>
          <Input
            label='Workspace'
            value={workspace}
            onValueChange={onWorkspaceChange}
            description='Synced from the website through the same state payload.'
          />

          <Select
            label='Owning team'
            value={team}
            onValueChange={(value) => {
              if (isPreviewTeam(value)) {
                onTeamChange(value);
              }
            }}
            startIcon={<Users />}
            presentation='sheet'
          >
            <Select.Item
              value='design'
              label='Design systems'
              description='Components and foundations'
              badge='Core'
              icon={<Grid />}
            />
            <Select.Item
              value='platform'
              label='Platform team'
              description='Web delivery and tooling'
              badge='Web'
              icon={<Monitor />}
            />
            <Select.Item
              value='mobile'
              label='Mobile squad'
              description='Native previews and gestures'
              badge='RN'
              icon={<Smartphone />}
            />
          </Select>

          <Checkbox
            label='Enable notifications'
            description='Native checkbox, shared boolean state.'
            checked={notificationsEnabled}
            onCheckedChange={onNotificationsChange}
          />

          <View style={styles.switchRow}>
            <View style={styles.switchCopy}>
              <Text style={styles.panelLabel}>Switch QA</Text>
              <Text style={styles.modalQaStatus}>Enable notifications</Text>
            </View>

            <Switch
              accessibilityLabel='Enable notifications with Switch'
              checked={notificationsEnabled}
              onCheckedChange={onNotificationsChange}
            />
          </View>

          <RadioGroup
            label='Density'
            value={density}
            onValueChange={(value) => {
              if (isPreviewDensity(value)) {
                onDensityChange(value);
              }
            }}
            orientation='horizontal'
            size='sm'
          >
            <Radio value='comfortable' label='Comfort' />
            <Radio value='compact' label='Compact' />
          </RadioGroup>
        </View>

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
            <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
            <Tabs.Trigger value='permissions'>Access</Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>

          <Tabs.Content value='overview'>
            <View style={styles.panel}>
              <Text style={styles.panelLabel}>Active team</Text>
              <Text style={styles.panelValue}>{selectedTeam}</Text>
            </View>
          </Tabs.Content>

          <Tabs.Content value='permissions'>
            <View style={styles.panel}>
              <Text style={styles.panelLabel}>Release guard</Text>
              <Text style={styles.panelValue}>Owner approval</Text>
            </View>
          </Tabs.Content>
        </Tabs>

        <Button fullWidth iconStart={<Check />}>
          Sync native changes
        </Button>

        <View style={styles.card}>
          <View style={styles.modalQaHeader}>
            <Text style={styles.panelLabel}>Modal QA</Text>
            <Text
              accessibilityLabel={`Last modal close method: ${lastModalClose}`}
              style={styles.modalQaStatus}
            >
              Last close: {lastModalClose}
            </Text>
          </View>

          <Modal
            onOpenChange={(open) => {
              if (!open) {
                setLastModalClose('default modal');
              }
            }}
          >
            <Modal.Trigger asChild>
              <Button accessibilityLabel='Open default modal' fullWidth>
                Open default modal
              </Button>
            </Modal.Trigger>
            <Modal.Overlay>
              <Modal.Content>
                <Modal.Header>
                  <Modal.Title>Default modal</Modal.Title>
                  <Modal.Description>
                    Close with the backdrop, the close icon, a footer action, or
                    Android hardware back.
                  </Modal.Description>
                </Modal.Header>
                <Modal.Body>
                  <Text style={styles.modalQaBody}>
                    Verify that focus returns to Open default modal after close.
                  </Text>
                </Modal.Body>
                <Modal.Footer>
                  <Modal.Close asChild>
                    <Button color='neutral' appearance='outline'>
                      Cancel
                    </Button>
                  </Modal.Close>
                  <Modal.Close asChild>
                    <Button>Confirm</Button>
                  </Modal.Close>
                </Modal.Footer>
              </Modal.Content>
            </Modal.Overlay>
          </Modal>

          <Modal
            closeOnOutsidePress={false}
            onOpenChange={(open) => {
              if (!open) {
                setLastModalClose('explicit close only');
              }
            }}
          >
            <Modal.Trigger asChild>
              <Button
                accessibilityLabel='Open modal with disabled backdrop close'
                appearance='outline'
                color='neutral'
                fullWidth
              >
                Backdrop disabled
              </Button>
            </Modal.Trigger>
            <Modal.Overlay>
              <Modal.Content>
                <Modal.Header>
                  <Modal.Title>Explicit close only</Modal.Title>
                  <Modal.Description>
                    Backdrop press should not close this dialog.
                  </Modal.Description>
                </Modal.Header>
                <Modal.Body>
                  <Text style={styles.modalQaBody}>
                    Use the close icon or the Done action to dismiss.
                  </Text>
                </Modal.Body>
                <Modal.Footer>
                  <Modal.Close asChild>
                    <Button>Done</Button>
                  </Modal.Close>
                </Modal.Footer>
              </Modal.Content>
            </Modal.Overlay>
          </Modal>

          <Modal
            animation='none'
            onOpenChange={(open) => {
              if (!open) {
                setLastModalClose('reduced motion modal');
              }
            }}
          >
            <Modal.Trigger asChild>
              <Button
                accessibilityLabel='Open reduced motion modal'
                appearance='outline'
                color='neutral'
                fullWidth
              >
                Reduced motion path
              </Button>
            </Modal.Trigger>
            <Modal.Overlay>
              <Modal.Content>
                <Modal.Header>
                  <Modal.Title>Reduced motion path</Modal.Title>
                  <Modal.Description>
                    This modal uses animation none for device reduced-motion
                    comparison.
                  </Modal.Description>
                </Modal.Header>
                <Modal.Body>
                  <Text style={styles.modalQaBody}>
                    Open and close should happen without animated transition.
                  </Text>
                </Modal.Body>
                <Modal.Footer>
                  <Modal.Close asChild>
                    <Button>Close</Button>
                  </Modal.Close>
                </Modal.Footer>
              </Modal.Content>
            </Modal.Overlay>
          </Modal>
        </View>
      </ScrollView>
    </View>
  );
}

type ResolvedNativeTheme = ReturnType<typeof useTheme>['theme'];

const fallbackStyles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },

  text: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

const createStyles = (theme: ResolvedNativeTheme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.semantic.surface.background,
    },

    scroll: {
      flex: 1,
    },

    content: {
      gap: 14,
      minHeight: '100%',
      paddingHorizontal: 18,
      paddingTop: 48,
      paddingBottom: 22,
    },

    statusBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      minHeight: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 22,
      paddingTop: 14,
      paddingBottom: 10,
      backgroundColor: theme.semantic.surface.background,
      elevation: 10,
    },

    statusTime: {
      color: theme.semantic.text.primary,
      fontSize: 12,
      fontWeight: '700',
    },

    statusIndicators: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },

    statusNetwork: {
      color: theme.semantic.text.primary,
      fontSize: 10,
      fontWeight: '700',
    },

    signalBars: {
      height: 12,
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 2,
    },

    signalBar: {
      width: 3,
      height: 11,
      borderRadius: 2,
      backgroundColor: theme.semantic.text.primary,
    },

    signalBarShort: {
      height: 6,
    },

    signalBarMedium: {
      height: 9,
    },

    battery: {
      width: 22,
      height: 11,
      justifyContent: 'center',
      padding: 2,
      borderWidth: 1,
      borderColor: theme.semantic.text.primary,
      borderRadius: 4,
    },

    batteryFill: {
      width: '78%',
      height: '100%',
      borderRadius: 2,
      backgroundColor: theme.semantic.text.primary,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },

    headerIcon: {
      width: 42,
      height: 42,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.semantic.action.primary.muted.border,
      borderRadius: theme.tokens.radius.xl,
      backgroundColor: theme.semantic.action.primary.muted.bg,
    },

    headerText: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },

    headerLabel: {
      color: theme.semantic.text.subtle,
      fontSize: 11,
      fontWeight: '700',
      lineHeight: 13,
      textTransform: 'uppercase',
    },

    headerTitle: {
      color: theme.semantic.text.primary,
      fontSize: 16,
      fontWeight: '700',
      lineHeight: 20,
    },

    headerActionButton: {
      borderColor: theme.components.button.neutral.outline.default.border,
      ...Platform.select({
        web: {
          boxShadow: 'none',
        },
        default: {
          elevation: 0,
          shadowOpacity: 0,
          shadowRadius: 0,
        },
      }),
    },

    card: {
      gap: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.semantic.border.muted,
      borderRadius: theme.tokens.radius.xl,
      backgroundColor: theme.semantic.surface.subtle,
    },

    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },

    switchCopy: {
      flex: 1,
      gap: 4,
    },

    panel: {
      minHeight: 74,
      justifyContent: 'center',
      gap: 5,
      marginTop: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.semantic.border.muted,
      borderRadius: theme.tokens.radius.lg,
      backgroundColor: theme.semantic.surface.subtle,
    },

    panelLabel: {
      color: theme.semantic.text.subtle,
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
    },

    panelValue: {
      color: theme.semantic.text.primary,
      fontSize: 15,
      fontWeight: '700',
    },

    modalQaHeader: {
      gap: 4,
    },

    modalQaStatus: {
      color: theme.semantic.text.primary,
      fontSize: 13,
      fontWeight: '600',
      lineHeight: 18,
    },

    modalQaBody: {
      color: theme.semantic.text.primary,
      fontSize: 14,
      lineHeight: 20,
    },
  });
