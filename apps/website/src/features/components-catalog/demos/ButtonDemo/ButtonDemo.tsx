'use client';

import { Button } from '@vellira-ui/react';

import { ButtonPlayground } from '../ButtonPlayground';

export function ButtonDemo() {
  return (
    <ButtonPlayground
      renderButton={({ appearance, color, size, shape, state }) => (
        <Button
          appearance={appearance}
          color={color}
          size={size}
          shape={shape}
          disabled={state === 'disabled'}
          loading={state === 'loading'}
          loadingText='Loading'
        >
          Button
        </Button>
      )}
    />
  );
}
