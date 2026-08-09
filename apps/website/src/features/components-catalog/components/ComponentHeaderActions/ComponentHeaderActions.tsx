'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import type { ComponentCatalogEntry, ComponentPlatform } from '../../types';

import styles from './ComponentHeaderActions.module.css';

type ComponentHeaderActionsProps = {
  component: ComponentCatalogEntry;
  defaultPlatform?: ComponentPlatform;
};

const platformLabels: Record<ComponentPlatform, string> = {
  react: 'React',
  'react-native': 'React Native',
};

export function ComponentHeaderActions({
  component,
  defaultPlatform = 'react',
}: ComponentHeaderActionsProps) {
  const initialPlatform = component.platforms.includes(defaultPlatform)
    ? defaultPlatform
    : component.platforms[0];

  const [activePlatform, setActivePlatform] =
    useState<ComponentPlatform>(initialPlatform);

  const documentationUrl = useMemo(
    () => component.docs[activePlatform],
    [activePlatform, component.docs]
  );

  return (
    <div className={styles.root}>
      <div className={styles.switcher} role='group' aria-label='Platform'>
        {component.platforms.map((platform) => {
          const isActive = platform === activePlatform;

          return (
            <button
              key={platform}
              type='button'
              className={[
                styles.platformButton,
                isActive ? styles.activePlatformButton : null,
              ]
                .filter(Boolean)
                .join(' ')}
              aria-pressed={isActive}
              onClick={() => setActivePlatform(platform)}
            >
              {platformLabels[platform]}
            </button>
          );
        })}
      </div>

      {documentationUrl && (
        <Link
          className={styles.documentation}
          href={documentationUrl}
          target='_blank'
          rel='noreferrer noopener'
        >
          Documentation
          <span aria-hidden='true'>↗</span>
        </Link>
      )}
    </div>
  );
}
