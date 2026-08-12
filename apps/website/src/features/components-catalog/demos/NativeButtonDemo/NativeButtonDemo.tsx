'use client';

import { Button } from '@vellira-ui/react-native';

import { ButtonPlayground } from '../ButtonPlayground';

export function NativeButtonDemo() {
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
