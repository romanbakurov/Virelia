export function normalizePropFragments(props: readonly string[]) {
  return props.flatMap((prop) =>
    prop
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  );
}

export function normalizeSetupStatements(statements: readonly string[]) {
  return statements.map((statement) => statement.trim()).filter(Boolean);
}

export function indentBlock(source: string, indentation: string) {
  return source
    .split('\n')
    .map((line) => `${indentation}${line}`)
    .join('\n');
}
