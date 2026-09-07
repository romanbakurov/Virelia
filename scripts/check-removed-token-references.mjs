import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const maintainedRoots = ['apps', 'packages'];
const styleExtensions = new Set(['.css', '.scss']);
const ignoredDirectoryNames = new Set([
  '.next',
  '.turbo',
  '.vitepress',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'storybook-static',
]);
const removedTokenReferences = [
  {
    needle: '--surface-background',
    replacement: '--surface-canvas',
    reason: 'Semantic Vocabulary V1 removed surface.background in favor of surface.canvas.',
  },
];

const findings = [];

function walk(directory) {
  if (!fs.existsSync(directory)) return;

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectoryNames.has(entry.name)) {
      continue;
    }

    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walk(absolutePath);
      continue;
    }

    if (!styleExtensions.has(path.extname(entry.name))) {
      continue;
    }

    const source = fs.readFileSync(absolutePath, 'utf8');
    const lines = source.split('\n');

    for (let index = 0; index < lines.length; index += 1) {
      for (const reference of removedTokenReferences) {
        if (!lines[index].includes(reference.needle)) continue;

        findings.push({
          path: path.relative(root, absolutePath).split(path.sep).join('/'),
          line: index + 1,
          ...reference,
        });
      }
    }
  }
}

for (const maintainedRoot of maintainedRoots) {
  walk(path.join(root, maintainedRoot));
}

if (findings.length > 0) {
  console.error('Removed token reference check failed:');

  for (const finding of findings) {
    console.error(
      `- ${finding.path}:${finding.line} references ${finding.needle}. Use ${finding.replacement}. ${finding.reason}`
    );
  }

  process.exit(1);
}

console.log('Removed token reference check passed');
