import { useEffect } from 'react';

import { Close, Search } from '@vellira-ui/icons';
import { Pressable, TextInput, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';
import { createSelectSlot } from '../internal/SelectCollection';
import { useSelectContext } from '../internal/SelectContext';
import type { SelectSearchProps } from '../types';

import { createSearchStyles } from './SelectSearch.styles';

export const SelectSearch = createSelectSlot<SelectSearchProps>(
  'search',
  'Select.Search'
);

export const SelectSearchField = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles(createSearchStyles);
  const {
    query,
    setQuery,
    searchPlaceholder,
    searchInputRef,
    searchStyle,
    selectedRowIndex,
    virtual,
  } = useSelectContext();
  const shouldAutoFocus = !virtual || selectedRowIndex === 0;

  useEffect(() => {
    if (!shouldAutoFocus) return;

    const focusTimer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);

    return () => clearTimeout(focusTimer);
  }, [searchInputRef, shouldAutoFocus]);

  return (
    <View style={styles.searchWrap}>
      <View
        style={styles.searchIcon}
        accessibilityElementsHidden
        importantForAccessibility='no'
      >
        <Search
          width={16}
          height={16}
          color={theme.components.select.dropdown.search.placeholder}
        />
      </View>
      <TextInput
        ref={searchInputRef}
        value={query}
        onChangeText={setQuery}
        placeholder={searchPlaceholder}
        autoFocus={shouldAutoFocus}
        returnKeyType='search'
        placeholderTextColor={
          theme.components.select.dropdown.search.placeholder
        }
        accessibilityLabel={searchPlaceholder}
        style={[styles.searchInput, searchStyle]}
      />
      {Boolean(query) && (
        <Pressable
          accessibilityRole='button'
          accessibilityLabel='Clear search'
          hitSlop={8}
          onPress={() => setQuery('')}
          style={styles.searchClearButton}
        >
          <Close
            width={14}
            height={14}
            color={theme.components.select.clearButton.fg}
          />
        </Pressable>
      )}
    </View>
  );
};

SelectSearchField.displayName = 'Select.SearchField';
