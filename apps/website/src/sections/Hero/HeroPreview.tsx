'use client';

import { Button, Input, Tabs } from '@vellira-ui/react';

import styles from './Hero.module.css';

export function HeroPreview() {
  return (
    <div className={styles.previewShell}>
      <div className={styles.previewHeader}>
        <span className={styles.previewDot} />
        <span className={styles.previewDot} />
        <span className={styles.previewDot} />

        <span className={styles.previewLabel}>Vellira preview</span>
      </div>

      <div className={styles.previewBody}>
        <Tabs defaultValue='overview' variant='segmented'>
          <Tabs.List aria-label='Preview sections'>
            <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
            <Tabs.Trigger value='settings'>Settings</Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>

          <Tabs.Content value='overview' className={styles.previewPanel}>
            <Input label='Project name' defaultValue='Vellira' />

            <Button>Save changes</Button>
          </Tabs.Content>

          <Tabs.Content value='settings' className={styles.previewPanel}>
            <div className={styles.settingsCard}>
              <span className={styles.settingsLabel}>Theme</span>
              <strong>Dark</strong>
            </div>

            <div className={styles.settingsCard}>
              <span className={styles.settingsLabel}>Platform</span>
              <strong>Web + Native</strong>
            </div>
          </Tabs.Content>
        </Tabs>
      </div>
    </div>
  );
}
