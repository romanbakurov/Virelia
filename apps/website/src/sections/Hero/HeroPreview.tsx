'use client';

import { useEffect, useRef, useState } from 'react';

import { Check, Monitor, Smartphone, System } from '@vellira-ui/icons';
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
        <div className={styles.previewMeta}>
          <span className={styles.previewMetaIcon}>
            <Monitor aria-hidden='true' />
            <Smartphone aria-hidden='true' />
          </span>
          <span>React and Native APIs stay in sync</span>
          <strong>
            <System aria-hidden='true' />
            Tokens synced
          </strong>
        </div>

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

            <Button className={styles.previewButton}>Save changes</Button>
          </Tabs.Content>

          <Tabs.Content value='settings' className={styles.previewPanel}>
            <div className={styles.capabilityList}>
              <div className={styles.capabilityItem}>
                <span className={styles.capabilityCheck} aria-hidden='true'>
                  <Check />
                </span>

                <span>
                  <strong>Accessible by default</strong>
                  <small>Keyboard and screen-reader support</small>
                </span>
              </div>

              <div className={styles.capabilityItem}>
                <span className={styles.capabilityCheck} aria-hidden='true'>
                  <Check />
                </span>

                <span>
                  <strong>Cross-platform APIs</strong>
                  <small>Consistent patterns for web and native</small>
                </span>
              </div>

              <div className={styles.capabilityItem}>
                <span className={styles.capabilityCheck} aria-hidden='true'>
                  <Check />
                </span>

                <span>
                  <strong>Design tokens</strong>
                  <small>Light, dark, and high-contrast themes</small>
                </span>
              </div>
            </div>
          </Tabs.Content>
        </Tabs>

        <div className={styles.tokenStrip} aria-label='Theme token preview'>
          <span>
            <i className={styles.tokenSwatchPrimary} aria-hidden='true' />
            Primary
          </span>
          <span>
            <i className={styles.tokenSwatchSurface} aria-hidden='true' />
            Surface
          </span>
          <span>
            <i className={styles.tokenSwatchBorder} aria-hidden='true' />
            Border
          </span>
        </div>
      </div>
    </div>
  );
}

HeroPreview.displayName = 'HeroPreview';
