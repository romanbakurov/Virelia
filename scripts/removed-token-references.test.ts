import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

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

function findRemovedSurfaceBackgroundReferences(): string[] {
  const findings: string[] = [];

  function walk(directory: string) {
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

      const lines = fs.readFileSync(absolutePath, 'utf8').split('\n');
      for (let index = 0; index < lines.length; index += 1) {
        if (!lines[index].includes('--surface-background')) continue;

        findings.push(
          `${path.relative(root, absolutePath).split(path.sep).join('/')}:${index + 1}`
        );
      }
    }
  }

  for (const maintainedRoot of maintainedRoots) {
    walk(path.join(root, maintainedRoot));
  }

  return findings;
}

describe('removed semantic token references', () => {
  it('does not reference the removed --surface-background CSS variable', () => {
    expect(findRemovedSurfaceBackgroundReferences()).toEqual([]);
  });
});
