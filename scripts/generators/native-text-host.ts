import ts from 'typescript';

export type GeneratedNativeTextHostSemantic = 'view-like' | 'text-like';

export const NATIVE_TEXT_IMPORT =
  "import { Text as NativeText } from 'react-native';";

export function renderGeneratedNativeText(
  value: string,
  hostSemantic: GeneratedNativeTextHostSemantic
) {
  return hostSemantic === 'view-like'
    ? `<NativeText>${value}</NativeText>`
    : value;
}

export function validateGeneratedNativeTextHostSafety(params: {
  componentName: string;
  surface: string;
  source: string;
}) {
  if (!params.source.trim()) {
    return [];
  }

  const wrappedSource = `const generated = (
  <>
${params.source}
  </>
);`;

  const sourceFile = ts.createSourceFile(
    'generated-native-text-host.tsx',
    wrappedSource,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  const parseDiagnostics =
    (
      sourceFile as ts.SourceFile & {
        parseDiagnostics?: readonly ts.Diagnostic[];
      }
    ).parseDiagnostics ?? [];

  const parseError = parseDiagnostics.find(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error
  );

  if (parseError) {
    return [
      `${params.componentName} ${params.surface} could not validate generated React Native text-host safety: ${ts.flattenDiagnosticMessageText(
        parseError.messageText,
        '\n'
      )}`,
    ];
  }

  const errors: string[] = [];

  function visit(node: ts.Node) {
    if (ts.isJsxText(node)) {
      const text = node.getText(sourceFile).replace(/\s+/g, ' ').trim();

      if (text) {
        const parent = node.parent;
        const parentTag = ts.isJsxElement(parent)
          ? parent.openingElement.tagName.getText(sourceFile)
          : 'fragment';

        if (parentTag !== 'NativeText') {
          errors.push(
            `${params.componentName} ${params.surface} contains unsafe generator-owned React Native text "${text}" under <${parentTag}>; generated literal text for a View-like host must be wrapped in <NativeText>.`
          );
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return errors;
}

export function assertGeneratedNativeTextHostSafety(params: {
  componentName: string;
  surface: string;
  source: string;
}) {
  const errors = validateGeneratedNativeTextHostSafety(params);

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
}
