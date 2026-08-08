import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dirname, '..');

const packageExportContracts = {
  'packages/assets/package.json': [
    './brand/*',
    './fonts/*',
    './styles',
    './styles/*',
    './sync-brand',
  ],
  'packages/core/package.json': ['.'],
  'packages/icons/package.json': ['.', './lottie', './native', './web'],
  'packages/react-native/package.json': ['.'],
  'packages/tokens/package.json': ['.', './css'],
  'packages/types/package.json': ['.'],
  'packages/react/package.json': ['.', './styles'],
};

const publicSymbolContracts = {
  'packages/core/src/index.ts': [
    'AriaIsolationOptions',
    'FocusScopeOptions',
    'OverlayAutoFocusEvent',
    'OverlayDismissOptions',
    'OverlayOutsideEvent',
    'OverlayStackOptions',
    'PortalOptions',
    'RefObjectLike',
    'ScrollLockOptions',
    'createAutoFocusEvent',
    'createOutsideEvent',
    'focusFirstElement',
    'focusableSelector',
    'getFocusableElements',
  ],
  'packages/icons/src/native.ts': [
    'ArrowDown',
    'ArrowLeft',
    'ArrowLeftRight',
    'ArrowRight',
    'ArrowTopButton',
    'ArrowUp',
    'At',
    'Bag',
    'Bell',
    'BellOff',
    'Book',
    'Bookmark',
    'Calendar',
    'Camera',
    'Cart',
    'Chat',
    'Check',
    'ChevronDown',
    'ChevronLeft',
    'ChevronRight',
    'ChevronUp',
    'Clock',
    'Close',
    'Collapse',
    'Contrast',
    'Copy',
    'CreditCard',
    'Doc',
    'Docs',
    'DocsVellira',
    'Dollar',
    'Download',
    'Edit',
    'Error',
    'Euro',
    'Exit',
    'Expand',
    'Eye',
    'EyeOff',
    'FastForward',
    'File',
    'Filter',
    'Folder',
    'FolderOpen',
    'GitHub',
    'Gift',
    'Grid',
    'Headphones',
    'Heart',
    'Help',
    'Home',
    'Image',
    'Inbox',
    'Info',
    'Laptop',
    'Link',
    'List',
    'Loader',
    'Lock',
    'LockOpen',
    'Mail',
    'Menu',
    'Message',
    'Microphone',
    'MicrophoneOff',
    'Minus',
    'Monitor',
    'Moon',
    'MoreHorizontal',
    'MoreVertical',
    'Pause',
    'Phone',
    'Pin',
    'Play',
    'Plus',
    'Package',
    'Percent',
    'Printer',
    'QrCode',
    'Refresh',
    'Receipt',
    'Rewind',
    'Save',
    'Search',
    'Send',
    'Settings',
    'Share',
    'SkipBack',
    'SkipForward',
    'Smartphone',
    'Star',
    'Stop',
    'Storybook',
    'Success',
    'Sun',
    'System',
    'Tag',
    'Tablet',
    'Trash',
    'Truck',
    'Upload',
    'User',
    'Users',
    'Video',
    'Volume',
    'VolumeHigh',
    'VolumeLow',
    'VolumeOff',
    'Warning',
    'Wallet',
    'Website',
  ],
  'packages/icons/src/web.ts': [
    'ArrowDown',
    'ArrowLeft',
    'ArrowLeftRight',
    'ArrowRight',
    'ArrowTopButton',
    'ArrowUp',
    'At',
    'Bag',
    'Bell',
    'BellOff',
    'Book',
    'Bookmark',
    'Calendar',
    'Camera',
    'Cart',
    'Chat',
    'Check',
    'ChevronDown',
    'ChevronLeft',
    'ChevronRight',
    'ChevronUp',
    'Clock',
    'Close',
    'Collapse',
    'Contrast',
    'Copy',
    'CreditCard',
    'Doc',
    'Docs',
    'DocsVellira',
    'Dollar',
    'Download',
    'Edit',
    'Error',
    'Euro',
    'Exit',
    'Expand',
    'Eye',
    'EyeOff',
    'FastForward',
    'File',
    'Filter',
    'Folder',
    'FolderOpen',
    'GitHub',
    'Gift',
    'Grid',
    'Headphones',
    'Heart',
    'Help',
    'Home',
    'Image',
    'Inbox',
    'Info',
    'Laptop',
    'Link',
    'List',
    'Loader',
    'Lock',
    'LockOpen',
    'Mail',
    'Menu',
    'Message',
    'Microphone',
    'MicrophoneOff',
    'Minus',
    'Monitor',
    'Moon',
    'MoreHorizontal',
    'MoreVertical',
    'Pause',
    'Phone',
    'Pin',
    'Play',
    'Plus',
    'Package',
    'Percent',
    'Printer',
    'QrCode',
    'Refresh',
    'Receipt',
    'Rewind',
    'Save',
    'Search',
    'Send',
    'Settings',
    'Share',
    'SkipBack',
    'SkipForward',
    'Smartphone',
    'Star',
    'Stop',
    'Storybook',
    'Success',
    'Sun',
    'System',
    'Tag',
    'Tablet',
    'Trash',
    'Truck',
    'Upload',
    'User',
    'Users',
    'Video',
    'Volume',
    'VolumeHigh',
    'VolumeLow',
    'VolumeOff',
    'Warning',
    'Wallet',
    'Website',
  ],
  'packages/icons/src/lottie.ts': [
    'AnimatedIconData',
    'AnimatedIconManifest',
    'AnimatedIconName',
    'animatedIconManifest',
    'animatedIcons',
  ],
  'packages/react-native/src/index.ts': [
    'Button',
    'ButtonProps',
    'Checkbox',
    'CheckboxProps',
    'Dropdown',
    'DropdownContentProps',
    'DropdownEmptyProps',
    'DropdownGroupProps',
    'DropdownItemProps',
    'DropdownLabelProps',
    'DropdownPresentation',
    'DropdownProps',
    'DropdownSelectEvent',
    'DropdownSeparatorProps',
    'DropdownTriggerProps',
    'FormField',
    'FormFieldControlProps',
    'FormFieldDescriptionProps',
    'FormFieldLabelProps',
    'FormFieldMessageProps',
    'FormFieldProps',
    'Input',
    'InputProps',
    'Modal',
    'ModalProps',
    'Popover',
    'PopoverAnchorProps',
    'PopoverArrowProps',
    'PopoverCloseProps',
    'PopoverContentProps',
    'PopoverDescriptionProps',
    'PopoverProps',
    'PopoverTitleProps',
    'PopoverTriggerProps',
    'NativeThemeName',
    'Portal',
    'PortalProps',
    'PortalProvider',
    'PortalProviderProps',
    'Radio',
    'RadioGroup',
    'RadioGroupProps',
    'RadioProps',
    'Select',
    'SelectOption',
    'SelectProps',
    'Tabs',
    'TabsContentProps',
    'TabsListProps',
    'TabsProps',
    'TabsTriggerProps',
    'ThemeProvider',
    'ThemeProviderProps',
    'Tooltip',
    'TooltipContentProps',
    'TooltipProps',
    'TooltipRootProps',
    'TooltipTriggerProps',
    'nativeThemes',
    'useTheme',
  ],
  'packages/tokens/src/index.ts': [
    'BaseCssVariableName',
    'BaseTokenPath',
    'ColorTokenPath',
    'ComponentTokenPath',
    'CssVariableName',
    'DarkTheme',
    'FontWeight',
    'HighContrastTheme',
    'LightTheme',
    'SemanticTokenPath',
    'ThemeCssVariableName',
    'ThemeName',
    'TokenPath',
    'VelliraBaseTokens',
    'VelliraColors',
    'VelliraComponentTokens',
    'VelliraSemanticTokens',
    'VelliraTheme',
    'WidenTokenValues',
    'baseCssVariableNames',
    'baseTokenPaths',
    'colorTokenPaths',
    'componentTokenPaths',
    'cssVariableNames',
    'darkTheme',
    'fontWeights',
    'highContrastTheme',
    'lightTheme',
    'overlay',
    'semanticTokenPaths',
    'theme',
    'themeCssVariableNames',
    'themeNames',
    'tokenPaths',
  ],
  'packages/types/src/index.ts': [
    'BaseButtonProps',
    'BaseCheckboxProps',
    'BaseDropdownContentProps',
    'BaseDropdownItemProps',
    'BaseDropdownProps',
    'BaseDropdownSearchProps',
    'BaseDropdownSelectableItemProps',
    'BaseDropdownTriggerProps',
    'BaseFormFieldProps',
    'BaseModalBodyProps',
    'BaseModalContentProps',
    'BaseModalFooterProps',
    'BaseModalHeaderProps',
    'BaseModalOverlayProps',
    'BaseModalProps',
    'BasePopoverPositioningProps',
    'BasePopoverProps',
    'BaseRadioGroupProps',
    'BaseRadioProps',
    'BaseSelectDropdownProps',
    'BaseSelectMultipleProps',
    'BaseSelectOption',
    'BaseSelectOptionProps',
    'BaseSelectProps',
    'BaseSelectSharedProps',
    'BaseSelectSingleProps',
    'BaseSelectTriggerProps',
    'BaseTabsContentProps',
    'BaseTabsListProps',
    'BaseTabsProps',
    'BaseTabsTriggerProps',
    'BaseTooltipProps',
    'ButtonAppearance',
    'ButtonColor',
    'ButtonShape',
    'ButtonSize',
    'CheckboxColor',
    'CheckboxLabelPosition',
    'CheckboxSize',
    'DropdownColor',
    'DropdownItemColor',
    'DropdownSize',
    'FloatingPlacement',
    'FormFieldMessageLive',
    'FormFieldMessageTone',
    'InputAdornmentTone',
    'InputBaseProps',
    'InputColor',
    'InputFormatter',
    'InputMask',
    'InputParser',
    'InputSize',
    'InputType',
    'InputVariant',
    'Orientation',
    'PopoverAlign',
    'PopoverOpenChangeDetails',
    'PopoverOpenChangeReason',
    'PopoverSide',
    'PopoverSize',
    'RadioColor',
    'RadioGroupOrientation',
    'RadioSize',
    'RadioValue',
    'SelectColor',
    'SelectMultipleValue',
    'SelectSize',
    'SelectValue',
    'SelectVariant',
    'SelectVirtualConfig',
    'TabsActivationMode',
    'TabsColor',
    'TabsSize',
    'TabsValue',
    'TabsVariant',
    'TextWrap',
    'TooltipDelay',
  ],
  'packages/react/src/index.ts': [
    'Button',
    'ButtonProps',
    'Checkbox',
    'CheckboxProps',
    'Dropdown',
    'DropdownCheckboxItemProps',
    'DropdownContentProps',
    'DropdownGroupProps',
    'DropdownItemProps',
    'DropdownLabelProps',
    'DropdownProps',
    'DropdownRadioGroupProps',
    'DropdownRadioItemProps',
    'DropdownSelectEvent',
    'DropdownSeparatorProps',
    'DropdownSubContentProps',
    'DropdownSubProps',
    'DropdownSubTriggerProps',
    'DropdownTriggerProps',
    'FormField',
    'FormFieldControlProps',
    'FormFieldDescriptionProps',
    'FormFieldLabelProps',
    'FormFieldMessageProps',
    'FormFieldProps',
    'Input',
    'InputProps',
    'Modal',
    'ModalProps',
    'Popover',
    'PopoverAnchorProps',
    'PopoverArrowAlign',
    'PopoverArrowProps',
    'PopoverCloseProps',
    'PopoverContentProps',
    'PopoverDescriptionProps',
    'PopoverProps',
    'PopoverTitleProps',
    'PopoverTriggerProps',
    'Portal',
    'PortalProps',
    'PortalProvider',
    'PortalProviderProps',
    'Radio',
    'RadioGroup',
    'RadioGroupProps',
    'RadioProps',
    'Select',
    'SelectOption',
    'SelectProps',
    'Tabs',
    'TabsContentProps',
    'TabsIndicatorProps',
    'TabsListProps',
    'TabsProps',
    'TabsSlotProps',
    'TabsTriggerProps',
    'ThemeContextValue',
    'ThemeName',
    'ThemeProvider',
    'ThemeProviderProps',
    'Tooltip',
    'TooltipProps',
    'useTheme',
  ],
};

for (const [packagePath, expectedExports] of Object.entries(
  packageExportContracts
)) {
  const absolutePath = path.join(root, packagePath);
  const packageJson = JSON.parse(readFileSync(absolutePath, 'utf8'));
  const actualExports = Object.keys(packageJson.exports ?? {}).sort();
  const sortedExpectedExports = [...expectedExports].sort();

  if (JSON.stringify(actualExports) !== JSON.stringify(sortedExpectedExports)) {
    throw new Error(
      `${packageJson.name} exports mismatch. Expected ${sortedExpectedExports.join(
        ', '
      )}, got ${actualExports.join(', ')}`
    );
  }
}

for (const [entryPath, expectedSymbols] of Object.entries(
  publicSymbolContracts
)) {
  const actualSymbols = collectPublicSymbols(path.join(root, entryPath));
  const sortedExpectedSymbols = [...expectedSymbols].sort();

  if (JSON.stringify(actualSymbols) !== JSON.stringify(sortedExpectedSymbols)) {
    throw new Error(
      `${entryPath} public symbols mismatch. Expected ${sortedExpectedSymbols.join(
        ', '
      )}, got ${actualSymbols.join(', ')}`
    );
  }
}

console.log('Public package exports and symbols check passed');

function collectPublicSymbols(entryPath, seen = new Set()) {
  const normalizedEntryPath = path.normalize(entryPath);

  if (seen.has(normalizedEntryPath)) {
    return [];
  }

  seen.add(normalizedEntryPath);

  const sourceFile = ts.createSourceFile(
    normalizedEntryPath,
    readFileSync(normalizedEntryPath, 'utf8'),
    ts.ScriptTarget.Latest,
    true
  );
  const symbols = new Set();

  for (const statement of sourceFile.statements) {
    if (ts.isExportDeclaration(statement)) {
      if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) {
          symbols.add(element.name.text);
        }
        continue;
      }

      const resolvedPath = resolveExportPath(
        normalizedEntryPath,
        statement.moduleSpecifier?.text
      );

      if (resolvedPath) {
        for (const symbol of collectPublicSymbols(resolvedPath, seen)) {
          symbols.add(symbol);
        }
      }

      continue;
    }

    if (!hasExportModifier(statement)) {
      continue;
    }

    if (
      (ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isEnumDeclaration(statement)) &&
      statement.name
    ) {
      symbols.add(statement.name.text);
      continue;
    }

    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        for (const name of collectBindingNames(declaration.name)) {
          symbols.add(name);
        }
      }
    }
  }

  return [...symbols].sort();
}

function hasExportModifier(statement) {
  return Boolean(
    statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
    )
  );
}

function collectBindingNames(name) {
  if (ts.isIdentifier(name)) {
    return [name.text];
  }

  if (ts.isObjectBindingPattern(name) || ts.isArrayBindingPattern(name)) {
    return name.elements.flatMap((element) =>
      ts.isBindingElement(element) ? collectBindingNames(element.name) : []
    );
  }

  return [];
}

function resolveExportPath(fromPath, specifier) {
  if (typeof specifier !== 'string' || !specifier.startsWith('.')) {
    return null;
  }

  const rawPath = path.resolve(path.dirname(fromPath), specifier);
  const extension = path.extname(rawPath);
  const candidates = [];

  if (extension === '.js') {
    const withoutExtension = rawPath.slice(0, -extension.length);
    candidates.push(`${withoutExtension}.ts`, `${withoutExtension}.tsx`);
  }

  candidates.push(
    rawPath,
    `${rawPath}.ts`,
    `${rawPath}.tsx`,
    path.join(rawPath, 'index.ts'),
    path.join(rawPath, 'index.tsx')
  );

  return (
    candidates.find(
      (candidate) => existsSync(candidate) && statSync(candidate).isFile()
    ) ?? null
  );
}
