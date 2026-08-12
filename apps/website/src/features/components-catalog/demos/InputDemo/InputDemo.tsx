'use client';

import { Input } from '@vellira-ui/react';

import { InputPlayground } from '../InputPlayground';

const inputContent = {
  text: {
    label: 'Name',
    placeholder: 'Alex Morgan',
  },
  email: {
    label: 'Email',
    placeholder: 'you@example.com',
  },
  password: {
    label: 'Password',
    placeholder: 'Enter your password',
  },
  number: {
    label: 'Age',
    placeholder: '32',
  },
  tel: {
    label: 'Phone',
    placeholder: '+33 6 12 34 56 78',
  },
  url: {
    label: 'Website',
    placeholder: 'https://vellira.dev',
  },
  search: {
    label: 'Search',
    placeholder: 'Search components...',
  },
} as const;

export function InputDemo() {
  return (
    <InputPlayground
      renderInput={(settings) => {
        const content = inputContent[settings.type];

        return (
          <Input
            label={content.label}
            description={`Example ${settings.type} input.`}
            placeholder={content.placeholder}
            type={settings.type}
            size={settings.size}
            color={settings.color}
            variant={settings.variant}
            clearable={settings.clearable}
            required={settings.required}
            disabled={settings.state === 'disabled'}
            loading={settings.state === 'loading'}
            invalid={settings.state === 'invalid'}
            readOnly={settings.state === 'readOnly'}
            error={
              settings.state === 'invalid'
                ? 'Please enter a valid value.'
                : undefined
            }
            revealPassword={settings.type === 'password'}
          />
        );
      }}
    />
  );
}
