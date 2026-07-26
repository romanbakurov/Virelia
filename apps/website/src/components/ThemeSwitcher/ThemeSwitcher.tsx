'use client';

import { Button, Dropdown } from '@vellira-ui/react';

import { useWebsiteThemeContext } from '@/providers/WebsiteThemeContext';

import styles from './ThemeSwitcher.module.css';

const options = [
  { value: 'light', label: 'Light', symbol: '☀' },
  { value: 'dark', label: 'Dark', symbol: '☾' },
  { value: 'system', label: 'System', symbol: '◐' },
  {
    value: 'high-contrast',
    label: 'High Contrast',
    symbol: '◉',
  },
] as const;

export function ThemeSwitcher() {
  const { preference, setPreference } = useWebsiteThemeContext();

  const activeOption =
    options.find((option) => option.value === preference) ?? options[2];

  return (
    <Dropdown placement='bottom-end' offset={8} collisionPadding={16}>
      <Dropdown.Trigger asChild>
        <Button
          type='button'
          appearance='ghost'
          color='neutral'
          shape='square'
          size='sm'
          aria-label={`Theme: ${activeOption.label}`}
        >
          <span aria-hidden='true'>{activeOption.symbol}</span>
        </Button>
      </Dropdown.Trigger>

      <Dropdown.Content className={styles.content}>
        <Dropdown.RadioGroup
          value={preference}
          onValueChange={(value) => {
            if (
              value === 'light' ||
              value === 'dark' ||
              value === 'system' ||
              value === 'high-contrast'
            ) {
              setPreference(value);
            }
          }}
        >
          {options.map((option) => (
            <Dropdown.RadioItem
              key={option.value}
              value={option.value}
              className={styles.item}
            >
              <Dropdown.ItemIcon>
                <span aria-hidden='true'>{option.symbol}</span>
              </Dropdown.ItemIcon>

              {option.label}
            </Dropdown.RadioItem>
          ))}
        </Dropdown.RadioGroup>
      </Dropdown.Content>
    </Dropdown>
  );
}

ThemeSwitcher.displayName = 'ThemeSwitcher';
