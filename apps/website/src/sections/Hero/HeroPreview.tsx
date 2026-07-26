'use client';

import { useEffect, useRef, useState } from 'react';

import { Button, Input, Tabs } from '@vellira-ui/react';

import styles from './Hero.module.css';

type PreviewTab = 'overview' | 'settings';

const TAB_CHANGE_INTERVAL = 4500;
const INTERACTION_PAUSE = 9000;

const isPreviewTab = (value: string): value is PreviewTab =>
  value === 'overview' || value === 'settings';

export function HeroPreview() {
  const [activeTab, setActiveTab] = useState<PreviewTab>('overview');
  const pauseUntilRef = useRef(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) {
        return;
      }

      setActiveTab((currentTab) =>
        currentTab === 'overview' ? 'settings' : 'overview'
      );
    }, TAB_CHANGE_INTERVAL);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const handleTabChange = (value: string) => {
    if (!isPreviewTab(value)) {
      return;
    }

    pauseUntilRef.current = Date.now() + INTERACTION_PAUSE;
    setActiveTab(value);
  };

  return (
    <div className={styles.previewShell}>
      <div className={styles.previewHeader}>
        <span className={styles.previewDot} />
        <span className={styles.previewDot} />
        <span className={styles.previewDot} />

        <span className={styles.previewLabel}>Vellira preview</span>

        <span className={styles.previewStatus} aria-hidden='true'>
          Live
        </span>
      </div>

      <div className={styles.previewBody}>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          variant='segmented'
        >
          <Tabs.List aria-label='Preview sections'>
            <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
            <Tabs.Trigger value='settings'>Capabilities</Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>

          <Tabs.Content value='overview' className={styles.previewPanel}>
            <Input label='Project name' defaultValue='Vellira' />

            <div className={styles.previewField}>
              <span className={styles.previewFieldLabel}>Platform</span>

              <div className={styles.platformOptions}>
                <span className={styles.platformOption} data-active>
                  React
                </span>
                <span className={styles.platformOption}>React Native</span>
              </div>
            </div>

            <Button>Save changes</Button>
          </Tabs.Content>

          <Tabs.Content value='settings' className={styles.previewPanel}>
            <div className={styles.capabilityList}>
              <div className={styles.capabilityItem}>
                <span className={styles.capabilityCheck} aria-hidden='true'>
                  ✓
                </span>

                <span>
                  <strong>Accessible by default</strong>
                  <small>Keyboard and screen-reader support</small>
                </span>
              </div>

              <div className={styles.capabilityItem}>
                <span className={styles.capabilityCheck} aria-hidden='true'>
                  ✓
                </span>

                <span>
                  <strong>Cross-platform APIs</strong>
                  <small>Consistent patterns for web and native</small>
                </span>
              </div>

              <div className={styles.capabilityItem}>
                <span className={styles.capabilityCheck} aria-hidden='true'>
                  ✓
                </span>

                <span>
                  <strong>Design tokens</strong>
                  <small>Light, dark, and high-contrast themes</small>
                </span>
              </div>
            </div>
          </Tabs.Content>
        </Tabs>
      </div>
    </div>
  );
}

HeroPreview.displayName = 'HeroPreview';
