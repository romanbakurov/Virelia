import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

type PressableState = { pressed: boolean; hovered: boolean; focused: boolean };

type NativeProps = {
  children?: React.ReactNode | ((state: PressableState) => React.ReactNode);
  style?: unknown;
  disabled?: boolean;
  accessibilityRole?: string;
  accessibilityState?: Record<string, unknown>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityLabelledBy?: string;
  'aria-describedby'?: string;
  accessibilityLiveRegion?: string;
  ellipsizeMode?: string;
  accessible?: boolean;
  importantForAccessibility?: string;
  numberOfLines?: number;
  nativeID?: string;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onLongPress?: () => void;
  onChangeText?: (value: string) => void;
  onRequestClose?: () => void;
  value?: string;
  editable?: boolean;
  placeholder?: string;
  placeholderTextColor?: string;
  secureTextEntry?: boolean;
  keyboardType?: string;
  returnKeyType?: string;
  autoFocus?: boolean;
  keyboardShouldPersistTaps?: string;
  contentContainerStyle?: unknown;
  testID?: string;
  color?: string;
  size?: string | number;
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
  if (role === 'toolbar') return 'toolbar';
  if (role === 'header') return 'heading';
  if (role === 'menu') return 'menu';
  if (role === 'menuitem') return 'menuitem';
  return undefined;
};

const stateProps = (state?: Record<string, unknown>) => ({
  'aria-checked':
    typeof state?.checked === 'boolean' || state?.checked === 'mixed'
      ? String(state.checked)
      : undefined,
  'aria-disabled':
    typeof state?.disabled === 'boolean' ? String(state.disabled) : undefined,
  'aria-expanded':
    typeof state?.expanded === 'boolean' ? String(state.expanded) : undefined,
  'aria-selected':
    typeof state?.selected === 'boolean' ? String(state.selected) : undefined,
  'aria-busy':
    typeof state?.busy === 'boolean' ? String(state.busy) : undefined,
});

const accessibilityProps = ({
  accessibilityLabel,
  accessibilityHint,
  accessibilityLabelledBy,
  'aria-describedby': ariaDescribedBy,
  accessibilityLiveRegion,
  accessible,
  importantForAccessibility,
}: Partial<
  Pick<
    NativeProps,
    | 'accessibilityLabel'
    | 'accessibilityHint'
    | 'accessibilityLabelledBy'
    | 'aria-describedby'
    | 'accessibilityLiveRegion'
    | 'accessible'
    | 'importantForAccessibility'
  >
>) => ({
  'aria-label': accessibilityLabel,
  'aria-description': accessibilityHint,
  'aria-labelledby': accessibilityLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-hidden':
    accessible === false || importantForAccessibility === 'no'
      ? 'true'
      : undefined,
  'aria-live': accessibilityLiveRegion,
  'data-important-for-accessibility': importantForAccessibility,
});

export const View = forwardRef<HTMLDivElement, NativeProps>(
  (
    {
      children,
      style,
      accessibilityRole,
      accessibilityState,
      accessibilityLabel,
      accessibilityHint,
      accessibilityLabelledBy,
      accessibilityLiveRegion,
      accessible,
      importantForAccessibility,
      testID,
      nativeID,
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
        id={nativeID}
        role={roleFromAccessibility(accessibilityRole)}
        style={resolvedStyle}
        {...stateProps(accessibilityState)}
        {...accessibilityProps({
          accessibilityLabel,
          accessibilityHint,
          accessibilityLabelledBy,
          accessibilityLiveRegion,
          accessible,
          importantForAccessibility,
        })}
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
  (
    {
      children,
      style,
      testID,
      accessibilityRole,
      accessibilityLabel,
      accessibilityHint,
      accessibilityLiveRegion,
      ellipsizeMode,
      accessible,
      importantForAccessibility,
      numberOfLines,
    },
    ref
  ) => (
    <span
      ref={ref}
      data-testid={testID}
      data-ellipsize-mode={ellipsizeMode}
      data-number-of-lines={numberOfLines}
      role={roleFromAccessibility(accessibilityRole)}
      style={flattenStyle(style)}
      {...accessibilityProps({
        accessibilityLabel,
        accessibilityHint,
        accessibilityLiveRegion,
        accessible,
        importantForAccessibility,
      })}
    >
      {children}
    </span>
  )
);
Text.displayName = 'Text';

export const ActivityIndicator = ({ color, size, testID }: NativeProps) => (
  <span
    data-testid={testID ?? 'activity-indicator'}
    role='progressbar'
    style={{ color }}
  >
    {size}
  </span>
);

export const Pressable = forwardRef<HTMLButtonElement, NativeProps>(
  (
    {
      children,
      style,
      disabled,
      accessibilityRole,
      accessibilityState,
      accessibilityLabel,
      accessibilityHint,
      accessibilityLabelledBy,
      'aria-describedby': ariaDescribedBy,
      onPress,
      onPressIn,
      onPressOut,
      onHoverIn,
      onHoverOut,
      onFocus,
      onBlur,
      onLongPress,
      testID,
      nativeID,
    },
    ref
  ) => {
    const state: PressableState = {
      pressed: false,
      hovered: false,
      focused: false,
    };

    const resolvedStyle = typeof style === 'function' ? style(state) : style;

    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;

    return (
      <button
        ref={ref}
        type='button'
        data-testid={testID}
        id={nativeID}
        disabled={disabled}
        role={roleFromAccessibility(accessibilityRole)}
        style={flattenStyle(resolvedStyle)}
        onClick={onPress}
        onFocus={onFocus}
        onBlur={onBlur}
        onMouseEnter={onHoverIn}
        onMouseLeave={onHoverOut}
        onMouseDown={onPressIn}
        onMouseUp={onPressOut}
        onDoubleClick={onLongPress}
        {...stateProps(accessibilityState)}
        {...accessibilityProps({
          accessibilityLabel,
          accessibilityHint,
          accessibilityLabelledBy,
          'aria-describedby': ariaDescribedBy,
        })}
      >
        {resolvedChildren}
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
      returnKeyType,
      autoFocus,
      onChangeText,
      onFocus,
      onBlur,
      style,
      testID,
      nativeID,
      accessibilityLabel,
      accessibilityHint,
      accessibilityLabelledBy,
      accessibilityState,
    },
    ref
  ) => (
    <input
      ref={ref}
      data-testid={testID}
      id={nativeID}
      data-keyboard-type={keyboardType}
      data-return-key-type={returnKeyType}
      data-auto-focus={autoFocus ? 'true' : undefined}
      aria-label={accessibilityLabel}
      aria-description={accessibilityHint}
      aria-labelledby={accessibilityLabelledBy}
      value={value ?? ''}
      placeholder={placeholder}
      disabled={!editable}
      autoFocus={autoFocus}
      type={secureTextEntry ? 'password' : 'text'}
      inputMode={keyboardType === 'numeric' ? 'numeric' : undefined}
      style={flattenStyle(style)}
      onChange={(event) => onChangeText?.(event.currentTarget.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      {...stateProps(accessibilityState)}
    />
  )
);
TextInput.displayName = 'TextInput';

type FlatListHandle = {
  scrollToIndex: (params: {
    index: number;
    animated?: boolean;
    viewPosition?: number;
  }) => void;
  scrollToOffset: (params: { offset: number; animated?: boolean }) => void;
};

type FlatListProps<T> = NativeProps & {
  data?: T[];
  renderItem: (info: { item: T; index: number }) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;
};

const FlatListComponent = forwardRef<FlatListHandle, FlatListProps<unknown>>(
  function FlatListComponent(
    {
      data,
      renderItem,
      keyExtractor,
      style,
      contentContainerStyle,
      testID,
      onLayout,
    }: FlatListProps<unknown>,
    ref
  ) {
    const [scrolledIndex, setScrolledIndex] = useState<number | undefined>();
    const [scrolledOffset, setScrolledOffset] = useState<number | undefined>();
    const [scrollViewPosition, setScrollViewPosition] = useState<
      number | undefined
    >();

    const resolvedStyle = flattenStyle(style);

    useEffect(() => {
      onLayout?.({
        nativeEvent: {
          layout: {
            width: Number(resolvedStyle?.width ?? 0),
            height: Number(
              resolvedStyle?.height ?? resolvedStyle?.maxHeight ?? 0
            ),
            x: 0,
            y: 0,
          },
        },
      });
    }, [
      onLayout,
      resolvedStyle?.height,
      resolvedStyle?.maxHeight,
      resolvedStyle?.width,
    ]);

    useImperativeHandle(ref, () => ({
      scrollToIndex: ({ index, viewPosition }) => {
        setScrolledIndex(index);
        setScrollViewPosition(viewPosition);
      },
      scrollToOffset: ({ offset }) => {
        setScrolledOffset(offset);
      },
    }));

    return (
      <div
        data-testid={testID ?? 'native-flat-list'}
        data-scroll-to-index={scrolledIndex}
        data-scroll-to-offset={scrolledOffset}
        data-scroll-view-position={scrollViewPosition}
        data-keyboard-should-persist-taps={undefined}
        style={resolvedStyle}
      >
        <div style={flattenStyle(contentContainerStyle)}>
          {(data ?? []).map((item, index) => (
            <React.Fragment key={keyExtractor?.(item, index) ?? index}>
              {renderItem({ item, index })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
);
FlatListComponent.displayName = 'FlatList';

export const FlatList = FlatListComponent as <T>(
  props: FlatListProps<T> & { ref?: React.Ref<FlatListHandle> }
) => React.ReactElement;

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

export const useWindowDimensions = () => Dimensions.get();

export const AccessibilityInfo = {
  announceForAccessibility: () => undefined,
  setAccessibilityFocus: () => undefined,
};
