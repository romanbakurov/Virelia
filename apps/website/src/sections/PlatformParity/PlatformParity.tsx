'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { Button, Checkbox, Input, Tabs, useTheme } from '@vellira-ui/react';

import styles from './PlatformParity.module.css';

type PlatformPreviewTab = 'design' | 'code';
type PreviewTheme = 'light' | 'dark' | 'high-contrast';

type NativePreviewMessage = {
  source: 'vellira-website';
  type: 'sync-preview';
  payload: {
    workspace: string;
    notificationsEnabled: boolean;
    activeTab: PlatformPreviewTab;
    theme: PreviewTheme;
  };
};

const isPlatformPreviewTab = (value: string): value is PlatformPreviewTab =>
  value === 'design' || value === 'code';

const sharedApi = [
  'Shared component concepts',
  'Consistent variants and sizes',
  'Unified design tokens',
  'Platform-native behaviour',
] as const;

export function PlatformParity() {
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  const [workspace, setWorkspace] = useState('Vellira Web');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<PlatformPreviewTab>('design');

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const previewTheme: PreviewTheme =
    theme === 'highContrast' ? 'high-contrast' : theme;

  const sendPreviewState = useCallback(() => {
    const message: NativePreviewMessage = {
      source: 'vellira-website',
      type: 'sync-preview',
      payload: {
        workspace,
        notificationsEnabled,
        activeTab,
        theme: previewTheme,
      },
    };

    iframeRef.current?.contentWindow?.postMessage(
      message,
      'http://localhost:8081'
    );
  }, [workspace, notificationsEnabled, activeTab, previewTheme]);

  useEffect(() => {
    sendPreviewState();
  }, [sendPreviewState]);

  return (
    <section
      id='platforms'
      className={styles.section}
      aria-labelledby='platform-parity-title'
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Cross-platform by design</span>

          <h2 id='platform-parity-title' className={styles.title}>
            One API.
            <span>Two platforms.</span>
          </h2>

          <p className={styles.description}>
            Build consistent product experiences across React and React Native
            without maintaining two unrelated design systems.
          </p>
        </header>

        <div className={styles.comparison}>
          <motion.article
            className={styles.platformCard}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, x: -72, scale: 0.97 }
            }
            whileInView={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.35,
            }}
            transition={{
              duration: shouldReduceMotion ? 0.2 : 1.05,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className={styles.platformHeader}>
              <div>
                <span className={styles.platformLabel}>Web</span>
                <h3>React</h3>
              </div>

              <span className={styles.platformBadge}>@vellira-ui/react</span>
            </div>

            <div className={styles.preview}>
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
                  if (isPlatformPreviewTab(value)) {
                    setActiveTab(value);
                  }
                }}
                variant='pills'
              >
                <Tabs.List>
                  <Tabs.Trigger value='design'>Design</Tabs.Trigger>
                  <Tabs.Trigger value='code'>Code</Tabs.Trigger>
                  <Tabs.Indicator />
                </Tabs.List>

                <Tabs.Content value='design'>
                  <span className={styles.visuallyHidden}>Design preview</span>
                </Tabs.Content>

                <Tabs.Content value='code'>
                  <span className={styles.visuallyHidden}>Code preview</span>
                </Tabs.Content>
              </Tabs>

              <Button>Continue</Button>
            </div>
          </motion.article>

          <motion.div
            className={styles.bridge}
            aria-hidden='true'
            initial={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.72,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.5,
            }}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.3,
              duration: shouldReduceMotion ? 0.2 : 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className={styles.bridgeLine} />
            <span className={styles.bridgeIcon}>↔</span>
            <span className={styles.bridgeLine} />
          </motion.div>

          <motion.article
            className={styles.platformCard}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    x: 72,
                    scale: 0.94,
                  }
            }
            whileInView={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.35,
            }}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.18,
              duration: shouldReduceMotion ? 0.2 : 1.15,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className={styles.platformHeader}>
              <div>
                <span className={styles.platformLabel}>Native</span>
                <h3>React Native</h3>
              </div>

              <span className={styles.platformBadge}>
                @vellira-ui/react-native
              </span>
            </div>

            <div className={styles.phoneStage}>
              <div className={styles.phone}>
                <div className={styles.phoneFrame}>
                  <div className={styles.phoneIsland} aria-hidden='true' />

                  <iframe
                    ref={iframeRef}
                    className={styles.phoneScreen}
                    src='http://localhost:8081'
                    title='Vellira React Native preview'
                    loading='lazy'
                    onLoad={sendPreviewState}
                  />
                </div>
              </div>
            </div>
          </motion.article>
        </div>

        <ul className={styles.features}>
          {sharedApi.map((feature) => (
            <li key={feature}>
              <span aria-hidden='true'>✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

PlatformParity.displayName = 'PlatformParity';
