import { createContext, useContext } from 'react';

import type React from 'react';
import { Modal, Platform, StyleSheet, View } from 'react-native';

import type { PortalProps, PortalProviderProps } from './types';

const PortalContext = createContext<unknown>(null);

type PortalComponent = ((props: PortalProps) => React.ReactElement | null) & {
  __velliraPortal?: true;
  displayName?: string;
};

const styles = StyleSheet.create({
  host: {
    flex: 1,
    ...(Platform.OS === 'web'
      ? {
          pointerEvents: 'box-none',
        }
      : {}),
  },
});

export const PortalProvider = ({
  children,
  container = null,
}: PortalProviderProps) => (
  <PortalContext.Provider value={container}>{children}</PortalContext.Provider>
);

export const Portal: PortalComponent = ({
  children,
  visible = true,
  animationType = 'none',
  hardwareAccelerated = true,
  navigationBarTranslucent = true,
  statusBarTranslucent = true,
  onDismiss,
  onRequestClose,
}) => {
  useContext(PortalContext);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      animationType={animationType}
      hardwareAccelerated={hardwareAccelerated}
      navigationBarTranslucent={navigationBarTranslucent}
      onDismiss={onDismiss}
      onRequestClose={onRequestClose}
      presentationStyle='overFullScreen'
      statusBarTranslucent={statusBarTranslucent}
      transparent
      visible
    >
      <View
        pointerEvents={Platform.OS === 'web' ? undefined : 'box-none'}
        style={styles.host}
      >
        {children}
      </View>
    </Modal>
  );
};

Portal.__velliraPortal = true;
Portal.displayName = 'Portal';
PortalProvider.displayName = 'PortalProvider';
