import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const jsonMode = process.argv.includes('--json');

const maintainedRoots = ['packages', 'apps', 'scripts'];
const sourceExtensions = new Set(['.js', '.jsx', '.mjs', '.mts', '.cts', '.ts', '.tsx']);
const ignoredDirectoryNames = new Set([
  '.git',
  '.next',
  '.turbo',
  '.vitepress',
  'android',
  'build',
  'coverage',
  'dist',
  'ios',
  'node_modules',
  'storybook-static',
]);

const nonBlockingClonePatterns = [
  /(?:^|\/)__fixtures__(?:\/|$)/,
  /(?:^|\/)__snapshots__(?:\/|$)/,
  /\.manual\.test\.[cm]?[jt]sx?$/,
  /\.spec\.[cm]?[jt]sx?$/,
  /\.stories\.[cm]?[jt]sx?$/,
  /\.test\.[cm]?[jt]sx?$/,
];

const generatedPathPatterns = [
  /(?:^|\/)generated(?:\/|$)/,
  /(?:^|\/)fixtures(?:\/|$)/,
];

const reactSourceRoot = path.join(root, 'packages/react/src');
const canonicalReactImports = [
  {
    root: path.join(reactSourceRoot, 'hooks'),
    rootAlias: '#hooks',
    childAlias: '#hooks',
    kind: 'flat-files',
  },
  {
    root: path.join(reactSourceRoot, 'managers'),
    rootAlias: '#managers',
    childAlias: '#managers',
    kind: 'directory-index',
  },
  {
    root: path.join(reactSourceRoot, 'patterns'),
    childAlias: '#patterns',
    kind: 'directory-index',
  },
  {
    root: path.join(reactSourceRoot, 'primitives'),
    childAlias: '#primitives',
    kind: 'directory-index',
  },
  {
    root: path.join(reactSourceRoot, 'utils'),
    childAlias: '#utils',
    kind: 'flat-files',
  },
];

const toolingOnlyReactPrefixes = [
  '@/',
  '@assets/',
  '@components/',
  '@patterns/',
  '@primitives/',
  '@styles/',
  '@utils/',
];

const findings = [];

function normalizePath(filePath) {
  return path.relative(root, filePath).split(path.sep).join('/');
}

function isInside(candidate, parent) {
  const relative = path.relative(parent, candidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function stripKnownSourceExtension(specifier) {
  return specifier.replace(/\.(?:[cm]?[jt]sx?)$/, '');
}

function resolveRelativeSpecifier(sourcePath, specifier) {
  return path.resolve(path.dirname(sourcePath), stripKnownSourceExtension(specifier));
}

function expectedReactAlias(targetPath, rule) {
  const relative = path.relative(rule.root, targetPath).split(path.sep).join('/');
  const withoutIndex = relative.replace(/\/index$/, '').replace(/^index$/, '');

  if (withoutIndex === '' && rule.rootAlias) {
    return rule.rootAlias;
  }

  if (rule.kind === 'flat-files' && withoutIndex && !withoutIndex.includes('/')) {
    return `${rule.childAlias}/${withoutIndex}`;
  }

  if (rule.kind === 'directory-index' && withoutIndex && !withoutIndex.includes('/')) {
    return `${rule.childAlias}/${withoutIndex}`;
  }

  return null;
}

function extractImportSpecifiers(source) {
  const specifiers = [];
  const staticPattern = /\b(?:import|export)\s+(?:type\s+)?(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/g;
  const dynamicPattern = /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g;

  for (const pattern of [staticPattern, dynamicPattern]) {
    let match;
    while ((match = pattern.exec(source)) !== null) {
      specifiers.push({ specifier: match[1], index: match.index });
    }
  }

  return specifiers;
}

function lineNumberAt(source, index) {
  return source.slice(0, index).split('\n').length;
}

function addFinding(finding) {
  findings.push({ blocking: true, ...finding });
}

function checkReactImportPolicy(filePath, source) {
  if (!isInside(filePath, reactSourceRoot)) {
    return;
  }

  for (const { specifier, index } of extractImportSpecifiers(source)) {
    const line = lineNumberAt(source, index);

    if (toolingOnlyReactPrefixes.some((prefix) => specifier.startsWith(prefix))) {
      addFinding({
        rule: 'imports.react-tooling-alias',
        category: 'imports',
        path: normalizePath(filePath),
        line,
        reason: `Source import '${specifier}' uses a tooling-only @ alias. Use the canonical # package import when one exists, otherwise keep the dependency relative.`,
      });
      continue;
    }

    if (!specifier.startsWith('.')) {
      continue;
    }

    const targetPath = resolveRelativeSpecifier(filePath, specifier);

    for (const rule of canonicalReactImports) {
      if (!isInside(targetPath, rule.root) || isInside(filePath, rule.root)) {
        continue;
      }

      const expected = expectedReactAlias(targetPath, rule);
      if (!expected) {
        continue;
      }

      addFinding({
        rule: 'imports.react-canonical-package-import',
        category: 'imports',
        path: normalizePath(filePath),
        line,
        reason: `Import '${specifier}' crosses a stable package-internal boundary. Use '${expected}'.`,
      });
    }
  }
}

function checkTokenEsmImportPolicy(filePath, source) {
  const tokensSourceRoot = path.join(root, 'packages/tokens/src');
  if (!isInside(filePath, tokensSourceRoot)) {
    return;
  }

  for (const { specifier, index } of extractImportSpecifiers(source)) {
    if (!specifier.startsWith('.')) {
      continue;
    }

    if (/\.(?:css|json|js|mjs|cjs)$/.test(specifier)) {
      continue;
    }

    addFinding({
      rule: 'imports.tokens-explicit-esm-extension',
      category: 'imports',
      path: normalizePath(filePath),
      line: lineNumberAt(source, index),
      reason: `Relative token-package import '${specifier}' must keep an explicit emitted-runtime extension (normally .js). Do not accept IDE directory-import shortening blindly.`,
    });
  }
}

function walk(directory, files) {
  if (!fs.existsSync(directory)) {
    return;
  }

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectoryNames.has(entry.name)) {
      continue;
    }

    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(absolute, files);
      continue;
    }

    if (!sourceExtensions.has(path.extname(entry.name))) {
      continue;
    }

    files.push(absolute);
  }
}

function normalizedCloneLines(source) {
  const lines = source.split('\n');
  const result = [];
  let inBlockComment = false;

  for (let index = 0; index < lines.length; index += 1) {
    let line = lines[index].trim();

    if (inBlockComment) {
      if (line.includes('*/')) {
        inBlockComment = false;
      }
      continue;
    }

    if (line.startsWith('/*')) {
      if (!line.includes('*/')) {
        inBlockComment = true;
      }
      continue;
    }

    if (
      line === '' ||
      line.startsWith('//') ||
      /^import\b/.test(line) ||
      /^export\s+\{/.test(line)
    ) {
      continue;
    }

    line = line.replace(/\s+/g, ' ');
    result.push({ line, originalLine: index + 1 });
  }

  return result;
}

function cloneSeverity(fileA, fileB) {
  const a = normalizePath(fileA);
  const b = normalizePath(fileB);
  const nonBlocking = nonBlockingClonePatterns.some((pattern) => pattern.test(a) || pattern.test(b));
  return nonBlocking ? 'warning' : 'error';
}

function checkStructuralDuplication(files, sources) {
  const windowSize = 14;
  const minimumCharacters = 320;
  const windows = new Map();

  for (const filePath of files) {
    const relative = normalizePath(filePath);
    if (generatedPathPatterns.some((pattern) => pattern.test(relative))) {
      continue;
    }

    const lines = normalizedCloneLines(sources.get(filePath));
    if (lines.length < windowSize) {
      continue;
    }

    for (let index = 0; index <= lines.length - windowSize; index += 1) {
      const slice = lines.slice(index, index + windowSize);
      const normalized = slice.map(({ line }) => line).join('\n');
      if (normalized.length < minimumCharacters) {
        continue;
      }

      const digest = crypto.createHash('sha256').update(normalized).digest('hex');
      const occurrences = windows.get(digest) ?? [];
      occurrences.push({
        filePath,
        line: slice[0].originalLine,
        endLine: slice[slice.length - 1].originalLine,
      });
      windows.set(digest, occurrences);
    }
  }

  const reportedPairs = new Set();
  for (const occurrences of windows.values()) {
    const byFile = new Map();
    for (const occurrence of occurrences) {
      if (!byFile.has(occurrence.filePath)) {
        byFile.set(occurrence.filePath, occurrence);
      }
    }

    const distinct = [...byFile.values()];
    if (distinct.length < 2) {
      continue;
    }

    for (let left = 0; left < distinct.length; left += 1) {
      for (let right = left + 1; right < distinct.length; right += 1) {
        const a = distinct[left];
        const b = distinct[right];
        const pair = [normalizePath(a.filePath), normalizePath(b.filePath)].sort().join('::');
        if (reportedPairs.has(pair)) {
          continue;
        }
        reportedPairs.add(pair);

        const severity = cloneSeverity(a.filePath, b.filePath);
        findings.push({
          rule: 'duplication.material-clone',
          category: 'duplication',
          severity,
          blocking: severity === 'error',
          path: normalizePath(a.filePath),
          line: a.line,
          relatedPath: normalizePath(b.filePath),
          relatedLine: b.line,
          reason: `Material ${windowSize}-line structural clone also appears at ${normalizePath(b.filePath)}:${b.line}. Extract a clear shared abstraction or classify a narrow intentional fixture/test exception.`,
        });
      }
    }
  }
}

const files = [];
for (const maintainedRoot of maintainedRoots) {
  walk(path.join(root, maintainedRoot), files);
}
files.sort((a, b) => normalizePath(a).localeCompare(normalizePath(b)));

const sources = new Map();
for (const filePath of files) {
  const source = fs.readFileSync(filePath, 'utf8');
  sources.set(filePath, source);
  checkReactImportPolicy(filePath, source);
  checkTokenEsmImportPolicy(filePath, source);
}

checkStructuralDuplication(files, sources);

findings.sort((a, b) =>
  [a.path, a.line ?? 0, a.rule, a.relatedPath ?? ''].join(':').localeCompare(
    [b.path, b.line ?? 0, b.rule, b.relatedPath ?? ''].join(':')
  )
);

const blockingFindings = findings.filter((finding) => finding.blocking);

if (jsonMode) {
  process.stdout.write(
    `${JSON.stringify(
      {
        schemaVersion: 1,
        filesScanned: files.length,
        blockingFindings: blockingFindings.length,
        warnings: findings.length - blockingFindings.length,
        findings,
      },
      null,
      2
    )}\n`
  );
} else if (findings.length === 0) {
  console.log(`Source hygiene: PASS (${files.length} maintained source files scanned)`);
} else {
  for (const finding of findings) {
    const level = finding.blocking ? 'ERROR' : 'WARN';
    const related = finding.relatedPath
      ? ` -> ${finding.relatedPath}:${finding.relatedLine ?? 1}`
      : '';
    console.log(
      `${level} ${finding.rule} ${finding.path}:${finding.line ?? 1}${related}\n  ${finding.reason}`
    );
  }

  console.log(
    `\nSource hygiene: ${blockingFindings.length === 0 ? 'PASS_WITH_WARNINGS' : 'FAIL'} (${blockingFindings.length} blocking, ${findings.length - blockingFindings.length} warnings, ${files.length} files scanned)`
  );
}

if (blockingFindings.length > 0) {
  process.exitCode = 1;
}
