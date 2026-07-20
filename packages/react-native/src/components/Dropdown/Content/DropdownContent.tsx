import { useEffect, useMemo, useRef, useState } from 'react';

import { Search } from '@vellira-ui/icons';
import {
  AccessibilityInfo,
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';

import { createStyles } from './DropdownContent.styles';
import type { DropdownContentProps } from './types';

export function DropdownContent({
  isOpen,
  children,
  onClose,
  contentStyle,
  accessibilityLabel,
  presentation,
  searchable = false,
  searchValue = '',
  searchPlaceholder = 'Search actions...',
  onSearchChange,
}: DropdownContentProps) {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const isSheet = presentation === 'sheet';
  const animation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
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
    if (!isOpen) {
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
      useNativeDriver: true,
    }).start();
  }, [animation, isOpen, isSheet, reduceMotion]);

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
      visible={isOpen}
      animationType='none'
      onRequestClose={onClose}
    >
      <View style={[styles.modalRoot, styles[presentation]]}>
        <Animated.View
          pointerEvents='box-none'
          style={[styles.backdrop, backdropAnimatedStyle]}
        >
          <Pressable
            accessibilityRole='button'
            accessibilityLabel='Close menu'
            style={StyleSheet.absoluteFill}
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          accessibilityRole='menu'
          accessibilityLabel={accessibilityLabel}
          style={[
            styles.menu,
            styles[`${presentation}Menu`],
            contentStyle,
            menuAnimatedStyle,
          ]}
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
                accessibilityLabel={searchPlaceholder}
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
