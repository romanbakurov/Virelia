'use client';

import { Button } from '@vellira-ui/react-native';

import { ButtonPlayground } from '../ButtonPlayground';

export function NativeButtonDemo() {
  return (
    <ButtonPlayground
      renderButton={(value) => (
        <Button
          color={value.color}
          appearance={value.appearance}
          size={value.size}
          shape={value.shape}
          fullWidth={value.fullWidth}
          loading={value.loading}
          loadingText={value.loadingText || undefined}
          disabled={value.disabled}
          iconOnly={value.iconOnly}
        >
          Button
        </Button>
      )}
    />
  );
}
