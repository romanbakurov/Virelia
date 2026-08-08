import { useEffect, useMemo, useRef, useState } from 'react';

import { Search } from '@vellira-ui/icons';
import {
  AccessibilityInfo,
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';
import { useDropdownContext } from '../internal/DropdownContext';

import { createStyles } from './DropdownContent.styles';
import type { DropdownContentProps } from './types';

const nativePointerEventsBoxNone =
  Platform.OS === 'web' ? undefined : ({ pointerEvents: 'box-none' } as const);
const webPointerEventsBoxNone =
  Platform.OS === 'web' ? { pointerEvents: 'box-none' as const } : undefined;

export function DropdownContent({
  children,
  contentStyle,
  accessibilityLabel,
}: DropdownContentProps) {
  const {
    open,
    color,
    presentation,
    layer,
    position,
    searchable,
    searchValue,
    searchPlaceholder,
    searchAccessibilityLabel,
    requestClose,
    requestOutsideClose,
    onSearchChange,
    onFloatingLayout,
  } = useDropdownContext();
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const colorPalette = theme.components.dropdown[color];
  const isSheet = presentation === 'sheet';
  const isPopover = presentation === 'popover';
  const animation = useRef(new Animated.Value(open ? 1 : 0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.().then(setReduceMotion);

    const subscription = AccessibilityInfo.addEventListener?.(
      'reduceMotionChanged',
      setReduceMotion
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (!open) {
      animation.setValue(0);
      return;
    }

    if (reduceMotion) {
      animation.setValue(1);
      return;
    }

    animation.setValue(0);

    Animated.timing(animation, {
      toValue: 1,
      duration: isSheet ? 220 : 160,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [animation, open, isSheet, reduceMotion]);

  const backdropAnimatedStyle = useMemo(
    () => ({
      opacity: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    }),
    [animation]
  );

  const menuAnimatedStyle = useMemo(() => {
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: isSheet ? [24, 0] : [-6, 0],
    });

    const scale = animation.interpolate({
      inputRange: [0, 1],
      outputRange: isSheet ? [1, 1] : [0.98, 1],
    });

    return {
      opacity: animation,
      transform: [{ translateY }, { scale }],
    };
  }, [animation, isSheet]);

  return (
    <Modal
      transparent
      visible={open}
      animationType='none'
      onRequestClose={requestClose}
    >
      <View
        style={[
          styles.modalRoot,
          styles[presentation],
          Platform.OS === 'web' && { zIndex: layer },
        ]}
      >
        <Animated.View
          {...nativePointerEventsBoxNone}
          style={[
            styles.backdrop,
            backdropAnimatedStyle,
            webPointerEventsBoxNone,
          ]}
        >
          <Pressable
            accessibilityRole='button'
            accessibilityLabel='Close menu'
            style={StyleSheet.absoluteFill}
            onPress={requestOutsideClose}
          />
        </Animated.View>

        <Animated.View
          accessibilityRole='menu'
          accessibilityLabel={accessibilityLabel}
          style={[
            styles.menu,
            styles[`${presentation}Menu`],
            {
              borderColor: colorPalette.content.border,
            },
            isPopover && {
              position: 'absolute',
              top: position.top,
              left: position.left,
            },
            contentStyle,
            menuAnimatedStyle,
          ]}
          onLayout={isPopover ? onFloatingLayout : undefined}
        >
          {searchable && (
            <View style={styles.searchWrap}>
              <View
                style={styles.searchIcon}
                accessibilityElementsHidden
                importantForAccessibility='no'
              >
                <Search
                  width={16}
                  height={16}
                  color={theme.components.dropdown.separator.fg}
                />
              </View>
              <TextInput
                value={searchValue}
                onChangeText={onSearchChange}
                placeholder={searchPlaceholder}
                returnKeyType='search'
                placeholderTextColor={theme.components.dropdown.separator.fg}
                accessibilityLabel={
                  searchAccessibilityLabel ?? searchPlaceholder
                }
                style={styles.searchInput}
              />
            </View>
          )}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

DropdownContent.displayName = 'DropdownContent';
