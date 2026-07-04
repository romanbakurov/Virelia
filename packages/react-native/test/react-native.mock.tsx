import React, { forwardRef, useEffect, useRef } from 'react';

type PressableState = { pressed: boolean };

type NativeProps = {
  children?: React.ReactNode;
  style?: unknown;
  disabled?: boolean;
  accessibilityRole?: string;
  accessibilityState?: Record<string, unknown>;
  accessibilityLabel?: string;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onLongPress?: () => void;
  onChangeText?: (value: string) => void;
  value?: string;
  editable?: boolean;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: string;
  testID?: string;
  onLayout?: (event: {
    nativeEvent: { layout: { width: number; height: number } };
  }) => void;
};

const flattenStyle = (style: unknown): React.CSSProperties | undefined => {
  if (!style) return undefined;
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle).filter(Boolean));
  }
  if (typeof style === 'object') return style as React.CSSProperties;
  return undefined;
};

const roleFromAccessibility = (role?: string) => {
  if (role === 'button') return 'button';
  if (role === 'checkbox') return 'checkbox';
  if (role === 'radio') return 'radio';
  if (role === 'radiogroup') return 'radiogroup';
  if (role === 'tab') return 'tab';
  if (role === 'tablist') return 'tablist';
  return undefined;
};

const stateProps = (state?: Record<string, unknown>) => ({
  'aria-checked':
    typeof state?.checked === 'boolean' ? String(state.checked) : undefined,
  'aria-disabled':
    typeof state?.disabled === 'boolean' ? String(state.disabled) : undefined,
  'aria-expanded':
    typeof state?.expanded === 'boolean' ? String(state.expanded) : undefined,
  'aria-selected':
    typeof state?.selected === 'boolean' ? String(state.selected) : undefined,
});

export const View = forwardRef<HTMLDivElement, NativeProps>(
  (
    {
      children,
      style,
      accessibilityRole,
      accessibilityState,
      testID,
      onLayout,
    },
    ref
  ) => {
    const resolvedStyle = flattenStyle(style);
    const onLayoutRef = useRef(onLayout);

    useEffect(() => {
      onLayoutRef.current = onLayout;
    }, [onLayout]);

    useEffect(() => {
      onLayoutRef.current?.({
        nativeEvent: {
          layout: {
            width: Number(resolvedStyle?.width ?? resolvedStyle?.maxWidth ?? 0),
            height: Number(resolvedStyle?.height ?? 0),
          },
        },
      });
    }, [resolvedStyle?.height, resolvedStyle?.maxWidth, resolvedStyle?.width]);

    return (
      <div
        ref={ref}
        data-testid={testID}
        role={roleFromAccessibility(accessibilityRole)}
        style={resolvedStyle}
        {...stateProps(accessibilityState)}
      >
        {children}
      </div>
    );
  }
);
View.displayName = 'View';

export const Animated = {
  Value: class {
    value: number;

    constructor(value: number) {
      this.value = value;
    }

    interpolate() {
      return '0deg';
    }
  },

  timing: () => ({
    start: () => {},
  }),

  View,
};

export const Text = forwardRef<HTMLSpanElement, NativeProps>(
  ({ children, style, testID }, ref) => (
    <span ref={ref} data-testid={testID} style={flattenStyle(style)}>
      {children}
    </span>
  )
);
Text.displayName = 'Text';

export const Pressable = forwardRef<HTMLButtonElement, NativeProps>(
  (
    {
      children,
      style,
      disabled,
      accessibilityRole,
      accessibilityState,
      accessibilityLabel,
      onPress,
      onPressIn,
      onPressOut,
      onLongPress,
      testID,
    },
    ref
  ) => {
    const resolvedStyle =
      typeof style === 'function'
        ? style({ pressed: false } satisfies PressableState)
        : style;

    return (
      <button
        ref={ref}
        type='button'
        data-testid={testID}
        disabled={disabled}
        aria-label={accessibilityLabel}
        role={roleFromAccessibility(accessibilityRole)}
        style={flattenStyle(resolvedStyle)}
        onClick={onPress}
        onMouseDown={onPressIn}
        onMouseUp={onPressOut}
        onDoubleClick={onLongPress}
        {...stateProps(accessibilityState)}
      >
        {children}
      </button>
    );
  }
);
Pressable.displayName = 'Pressable';

export const TextInput = forwardRef<HTMLInputElement, NativeProps>(
  (
    {
      value,
      placeholder,
      editable = true,
      secureTextEntry,
      keyboardType,
      onChangeText,
      style,
      testID,
    },
    ref
  ) => (
    <input
      ref={ref}
      data-testid={testID}
      value={value ?? ''}
      placeholder={placeholder}
      disabled={!editable}
      type={secureTextEntry ? 'password' : 'text'}
      inputMode={keyboardType === 'numeric' ? 'numeric' : undefined}
      style={flattenStyle(style)}
      onChange={(event) => onChangeText?.(event.currentTarget.value)}
    />
  )
);
TextInput.displayName = 'TextInput';

export const Modal = ({
  visible,
  children,
}: NativeProps & { visible?: boolean }) => {
  if (!visible) return null;
  return <div data-testid='native-modal'>{children}</div>;
};

export const StyleSheet = {
  create<T extends Record<string, unknown>>(styles: T): T {
    return styles;
  },

  absoluteFill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
};

export const Dimensions = {
  get() {
    return { width: 1024, height: 768 };
  },
};
