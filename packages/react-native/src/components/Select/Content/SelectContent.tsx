import { FlatList, Pressable, Text, View } from 'react-native';

import { useThemeStyles } from '../../../theme';
import {
  SelectGroupActionRow,
  SelectGroupLabelRow,
  SelectSeparatorRow,
} from '../Group';
import { createSelectSlot } from '../internal/SelectCollection';
import { useSelectContext } from '../internal/SelectContext';
import type { SelectCollectionRow } from '../internal/types';
import { SelectItemRow } from '../Item';
import { SelectModal, SelectPopover, SelectSheet } from '../Presentation';
import type { SelectContentProps } from '../types';

import { createContentStyles } from './SelectContent.styles';
import { SelectEmptyState } from './SelectEmpty';
import { SelectLoadingState } from './SelectLoading';
import { SelectSearchField } from './SelectSearch';

export const SelectContent = createSelectSlot<SelectContentProps>(
  'content',
  'Select.Content'
);

export const SelectContentSurface = () => {
  const styles = useThemeStyles(createContentStyles);
  const context = useSelectContext();
  const {
    isOpen,
    resolvedPresentation,
    placement,
    dismissOnBackdropPress,
    contentStyle,
    matchTriggerWidth,
    triggerWidth,
    resolvedLabel,
    closeContent,
    searchable,
    loading,
    filteredRows,
    selectedValues,
    selectedOptions,
    maxSelected,
    optionStyle,
    selectOption,
    selectGroup,
    itemHeight,
    selectedRowIndex,
  } = context;
  const shouldScrollToSelected =
    Boolean(context.virtual) && selectedRowIndex > 0;

  const renderRow = ({ item }: { item: SelectCollectionRow }) => {
    if (item.type === 'group') {
      if (item.selectable && context.multiple) {
        const enabledGroupValues = item.itemValues.filter((value) =>
          context.optionsByValue.get(value)
        );
        const selectedGroupCount = selectedOptions.filter((option) =>
          enabledGroupValues.includes(option.value)
        ).length;

        return (
          <SelectGroupActionRow
            label={item.label}
            selectLabel={item.selectLabel}
            selectedCount={selectedGroupCount}
            itemCount={enabledGroupValues.length}
            onPress={() => selectGroup(enabledGroupValues)}
          />
        );
      }

      return <SelectGroupLabelRow label={item.label} />;
    }

    if (item.type === 'separator') {
      return <SelectSeparatorRow />;
    }

    const isSelected = selectedValues.includes(item.option.value);
    const maxReached =
      !isSelected &&
      typeof maxSelected === 'number' &&
      selectedValues.length >= maxSelected;

    return (
      <SelectItemRow
        option={item.option}
        isSelected={isSelected}
        isDisabled={Boolean(item.option.disabled || maxReached)}
        optionStyle={optionStyle}
        onSelect={selectOption}
      />
    );
  };

  const body = (
    <>
      <View
        style={styles.toolbar}
        accessible
        accessibilityRole='toolbar'
        accessibilityLabel={`${resolvedLabel} selection actions`}
      >
        <Pressable
          onPress={closeContent}
          hitSlop={8}
          style={styles.toolbarAction}
          accessibilityRole='button'
          accessibilityLabel='Close selection'
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>

        <Text style={styles.title} numberOfLines={1} accessibilityRole='header'>
          {resolvedLabel}
        </Text>

        <Pressable
          onPress={closeContent}
          hitSlop={8}
          style={styles.toolbarAction}
          accessibilityRole='button'
          accessibilityLabel='Done'
        >
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>

      {searchable && <SelectSearchField />}

      {loading && filteredRows.length === 0 ? (
        <SelectLoadingState />
      ) : filteredRows.length === 0 ? (
        <SelectEmptyState />
      ) : (
        <FlatList
          data={filteredRows}
          keyExtractor={(item) => item.key}
          renderItem={renderRow}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps='handled'
          initialScrollIndex={
            shouldScrollToSelected ? selectedRowIndex : undefined
          }
          initialNumToRender={
            typeof context.virtual === 'object'
              ? context.virtual.initialNumToRender
              : 12
          }
          windowSize={
            typeof context.virtual === 'object' ? context.virtual.windowSize : 7
          }
          getItemLayout={(_data, index) => ({
            length: itemHeight,
            offset: itemHeight * index,
            index,
          })}
        />
      )}
    </>
  );

  if (resolvedPresentation === 'sheet') {
    return (
      <SelectSheet
        visible={isOpen}
        onClose={closeContent}
        dismissOnBackdropPress={dismissOnBackdropPress}
        contentStyle={contentStyle}
      >
        {body}
      </SelectSheet>
    );
  }

  if (resolvedPresentation === 'popover') {
    return (
      <SelectPopover
        visible={isOpen}
        onClose={closeContent}
        dismissOnBackdropPress={dismissOnBackdropPress}
        placement={placement}
        matchTriggerWidth={matchTriggerWidth}
        triggerWidth={triggerWidth}
        contentStyle={contentStyle}
      >
        {body}
      </SelectPopover>
    );
  }

  return (
    <SelectModal
      visible={isOpen}
      onClose={closeContent}
      dismissOnBackdropPress={dismissOnBackdropPress}
      contentStyle={contentStyle}
    >
      {body}
    </SelectModal>
  );
};

SelectContentSurface.displayName = 'Select.ContentSurface';
