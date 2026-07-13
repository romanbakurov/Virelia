import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dirname, '..');

const packageExportContracts = {
  'packages/assets/package.json': ['./fonts/*', './styles', './styles/*'],
  'packages/core/package.json': ['.'],
  'packages/icons/package.json': ['.', './native', './web'],
  'packages/react-native/package.json': ['.'],
  'packages/tokens/package.json': ['.', './css'],
  'packages/types/package.json': ['.'],
  'packages/react/package.json': ['.', './styles'],
};

const publicSymbolContracts = {
  'packages/core/src/index.ts': [
    'KeyboardNavigationEvent',
    'NavigableItem',
    'TabKeyboardItem',
    'TabsKeyboardEvent',
    'UseKeyboardNavigationParams',
    'UseTabsKeyboardParams',
    'useControllableState',
    'useKeyboardNavigation',
    'useTabsKeyboard',
  ],
  'packages/icons/src/native.ts': [
    'Alarm',
    'Check',
    'ChevronDown',
    'Close',
    'Copy',
    'Delete',
    'Download',
    'DropdownMenu',
    'Edit',
    'Exit',
    'Filter',
    'Folder',
    'Home',
    'Image',
    'Music',
    'Plus',
    'Profile',
    'Restart',
    'Save',
    'Search',
    'Settings',
  ],
  'packages/icons/src/web.ts': [
    'Alarm',
    'Check',
    'ChevronDown',
    'Close',
    'Copy',
    'Delete',
    'Download',
    'DropdownMenu',
    'Edit',
    'Exit',
    'Filter',
    'Folder',
    'Home',
    'Image',
    'Music',
    'Plus',
    'Profile',
    'Restart',
    'Save',
    'Search',
    'Settings',
  ],
  'packages/react-native/src/index.ts': [
    'Button',
    'ButtonProps',
    'Checkbox',
    'CheckboxProps',
    'Dropdown',
    'DropdownGroupItem',
    'DropdownItem',
    'DropdownMenuItem',
    'DropdownProps',
    'DropdownSeparatorItem',
    'FormField',
    'FormFieldProps',
    'Input',
    'InputProps',
    'Modal',
    'ModalProps',
    'NativeThemeName',
    'Radio',
    'RadioGroup',
    'RadioGroupProps',
    'RadioProps',
    'Select',
    'SelectOption',
    'SelectProps',
    'TabProps',
    'Tabs',
    'TabsListProps',
    'TabsPanelProps',
    'TabsProps',
    'ThemeProvider',
    'ThemeProviderProps',
    'Tooltip',
    'TooltipProps',
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
    'BaseDropdownGroup',
    'BaseDropdownGroupProps',
    'BaseDropdownItem',
    'BaseDropdownItemProps',
    'BaseDropdownMenuItem',
    'BaseDropdownProps',
    'BaseDropdownSeparator',
    'BaseDropdownTriggerProps',
    'BaseFormFieldProps',
    'BaseModalBodyProps',
    'BaseModalContentProps',
    'BaseModalFooterProps',
    'BaseModalHeaderProps',
    'BaseModalOverlayProps',
    'BaseModalProps',
    'BaseRadioGroupProps',
    'BaseRadioProps',
    'BaseSelectDropdownProps',
    'BaseSelectOption',
    'BaseSelectOptionProps',
    'BaseSelectProps',
    'BaseSelectTriggerProps',
    'SelectSize',
    'BaseTabProps',
    'BaseTabsListProps',
    'BaseTabsPanelProps',
    'BaseTabsProps',
    'BaseTooltipContentProps',
    'BaseTooltipProps',
    'ButtonColor',
    'ButtonSize',
    'ButtonVariant',
    'CheckboxSize',
    'DropdownSize',
    'FloatingPlacement',
    'InputAdornmentTone',
    'InputBaseProps',
    'InputSize',
    'InputType',
    'Orientation',
    'RadioGroupOrientation',
    'RadioSize',
    'RadioValue',
    'TabsAppearance',
    'TextWrap',
    'TooltipDelay',
  ],
  'packages/react/src/index.ts': [
    'Button',
    'ButtonProps',
    'Checkbox',
    'CheckboxProps',
    'Dropdown',
    'DropdownGroupItem',
    'DropdownItem',
    'DropdownMenuItem',
    'DropdownProps',
    'DropdownSeparatorItem',
    'FormField',
    'FormFieldProps',
    'Input',
    'InputProps',
    'Modal',
    'ModalProps',
    'Radio',
    'RadioGroup',
    'RadioGroupProps',
    'RadioProps',
    'Select',
    'SelectOption',
    'SelectProps',
    'TabProps',
    'Tabs',
    'TabsListProps',
    'TabsPanelProps',
    'TabsProps',
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
