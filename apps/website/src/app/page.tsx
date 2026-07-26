'use client';

import { Button, Tabs } from '@vellira-ui/react';

export default function HomePage() {
  return (
    <main
      style={{
        display: 'grid',
        gap: 24,
        minHeight: '100vh',
        padding: 48,
      }}
    >
      <h1>Vellira</h1>

      <Button>Get started</Button>

      <Tabs defaultValue='web'>
        <Tabs.List aria-label='Platform'>
          <Tabs.Trigger value='web'>Web</Tabs.Trigger>
          <Tabs.Trigger value='native'>Native</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>

        <Tabs.Content value='web'>React components</Tabs.Content>

        <Tabs.Content value='native'>React Native components</Tabs.Content>
      </Tabs>
    </main>
  );
}
