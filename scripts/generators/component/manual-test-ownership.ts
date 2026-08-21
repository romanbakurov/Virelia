import fs from 'node:fs';
import path from 'node:path';

export type PreservedManualTest = {
  relativePath: string;
  content: string;
};

function collectManualTestsFromDirectory(params: {
  root: string;
  directory: string;
  result: PreservedManualTest[];
}) {
  const { root, directory, result } = params;

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      collectManualTestsFromDirectory({
        root,
        directory: absolutePath,
        result,
      });
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.manual.test.tsx')) {
      continue;
    }

    result.push({
      relativePath: path.relative(root, absolutePath),
      content: fs.readFileSync(absolutePath, 'utf8'),
    });
  }
}

export function preserveManualComponentTests(
  componentDir: string
): PreservedManualTest[] {
  if (!fs.existsSync(componentDir)) {
    return [];
  }

  const result: PreservedManualTest[] = [];

  collectManualTestsFromDirectory({
    root: componentDir,
    directory: componentDir,
    result,
  });

  return result.sort((left, right) =>
    left.relativePath.localeCompare(right.relativePath)
  );
}

export function restoreManualComponentTests(params: {
  componentDir: string;
  tests: readonly PreservedManualTest[];
}) {
  const { componentDir, tests } = params;

  for (const test of tests) {
    const filePath = path.join(componentDir, test.relativePath);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, test.content);
  }
}
