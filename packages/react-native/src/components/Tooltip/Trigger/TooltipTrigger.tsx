import { createElement, type CSSProperties } from 'react';

import { Platform, Pressable } from 'react-native';

import { useTooltipContext } from '../internal/TooltipContext';

import type { TooltipTriggerProps } from './types';

function flattenWebStyle(style: unknown): CSSProperties | undefined {
  if (!style) {
    return undefined;
  }

  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenWebStyle).filter(Boolean));
  }

  return typeof style === 'object' ? style : undefined;
}

export const TooltipTrigger = ({
  children,
  disabled,
  onBlur,
  onFocus,
  onHoverIn,
  onHoverOut,
  onLongPress,
  onPress,
  onPressIn,
  style,
  ...props
}: TooltipTriggerProps) => {
  const tooltip = useTooltipContext();
  const isDisabled = tooltip.disabled || disabled;

  if (Platform.OS === 'web') {
    const webProps = props as {
      accessibilityLabel?: string;
      testID?: string;
    };
    const showFromWebEvent = (event: { defaultPrevented?: boolean }) => {
      if (event.defaultPrevented || isDisabled) return;

      tooltip.show();
    };

    return createElement(
      'button',
      {
        'aria-label': webProps.accessibilityLabel,
        'data-testid': webProps.testID,
        disabled: isDisabled || undefined,
        type: 'button',
        ref: (node: HTMLButtonElement | null) => {
          if (node) {
            Object.assign(node, {
              measureInWindow(
                callback: (
                  x: number,
                  y: number,
                  width: number,
                  height: number
                ) => void
              ) {
                const rect = node.getBoundingClientRect();
                callback(rect.left, rect.top, rect.width, rect.height);
              },
            });
          }

          tooltip.triggerRef.current = node as never;
        },
        onBlur: (event: unknown) => {
          onBlur?.(event as Parameters<NonNullable<typeof onBlur>>[0]);
          tooltip.hide();
        },
        onClick: (event: { defaultPrevented?: boolean }) => {
          onPress?.(event as Parameters<NonNullable<typeof onPress>>[0]);
          showFromWebEvent(event);
        },
        onClickCapture: showFromWebEvent,
        onPointerDown: showFromWebEvent,
        onPointerDownCapture: showFromWebEvent,
        onMouseDown: showFromWebEvent,
        onMouseDownCapture: showFromWebEvent,
        onFocusCapture: showFromWebEvent,
        onFocus: (event: unknown) => {
          onFocus?.(event as Parameters<NonNullable<typeof onFocus>>[0]);
          tooltip.show();
        },
        onMouseEnter: (event: unknown) => {
          onHoverIn?.(event as Parameters<NonNullable<typeof onHoverIn>>[0]);
          tooltip.show();
        },
        onMouseLeave: (event: unknown) => {
          onHoverOut?.(event as Parameters<NonNullable<typeof onHoverOut>>[0]);
        },
        style: {
          all: 'unset',
          cursor: isDisabled ? 'default' : 'pointer',
          display: 'inline-flex',
          ...flattenWebStyle(style),
        },
      },
      children
    );
  }

  return (
    <Pressable
      {...props}
      ref={tooltip.triggerRef}
      accessibilityState={{
        ...props.accessibilityState,
        disabled: isDisabled || props.accessibilityState?.disabled,
      }}
      disabled={isDisabled}
      onBlur={(event) => {
        onBlur?.(event);

        if (Platform.OS === 'web') {
          tooltip.hide();
        }
      }}
      onFocus={(event) => {
        onFocus?.(event);

        if (Platform.OS === 'web') {
          tooltip.show();
        }
      }}
      onHoverIn={(event) => {
        onHoverIn?.(event);

        if (Platform.OS === 'web') {
          tooltip.show();
        }
      }}
      onHoverOut={(event) => {
        onHoverOut?.(event);

        if (Platform.OS === 'web') {
          tooltip.hide();
        }
      }}
      onLongPress={(event) => {
        onLongPress?.(event);

        if (event.defaultPrevented) return;

        tooltip.show();
      }}
      onPress={(event) => {
        onPress?.(event);

        if (event.defaultPrevented || Platform.OS !== 'web') return;

        tooltip.show();
      }}
      onPressIn={(event) => {
        onPressIn?.(event);

        if (Platform.OS === 'web') {
          tooltip.show();
        }
      }}
      style={style}
    >
      {children}
    </Pressable>
  );
};

TooltipTrigger.displayName = 'Tooltip.Trigger';
