#!/usr/bin/env node

import { execFileSync } from 'node:child_process';

const project = process.argv[2];

const globalPaths = [
  '.npmrc',
  '.node-version',
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'scripts/vercel-ignore-build.mjs',
];

const projectPaths = {
  website: [
    'apps/website/',
    'packages/assets/',
    'packages/core/',
    'packages/icons/',
    'packages/react/',
    'packages/tokens/',
    'packages/types/',
  ],
  storybook: [
    'apps/react-storybook/',
    'packages/assets/',
    'packages/core/',
    'packages/icons/',
    'packages/react/',
    'packages/tokens/',
    'packages/types/',
  ],
  'native-playground': [
    'apps/native-playground/',
    'packages/assets/',
    'packages/core/',
    'packages/icons/',
    'packages/react-native/',
    'packages/tokens/',
    'packages/types/',
  ],
};

function git(args) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function hasCommit(ref) {
  try {
    git(['rev-parse', '--verify', '--quiet', `${ref}^{commit}`]);
    return true;
  } catch {
    return false;
  }
}

function resolveBaseRef() {
  const candidates = [
    process.env.VERCEL_GIT_PREVIOUS_SHA,
    'HEAD^',
    'HEAD~1',
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (hasCommit(candidate)) {
      return candidate;
    }
  }

  return null;
}

function getChangedFiles(baseRef) {
  if (!baseRef) {
    return null;
  }

  const output = git(['diff', '--name-only', baseRef, 'HEAD']);

  if (!output) {
    return [];
  }

  return output.split('\n').filter(Boolean);
}

function matchesPath(file, watchedPath) {
  return file === watchedPath || file.startsWith(watchedPath);
}

if (!Object.hasOwn(projectPaths, project)) {
  console.error(
    `Unknown Vercel project "${project}". Expected one of: ${Object.keys(
      projectPaths
    ).join(', ')}.`
  );
  process.exit(1);
}

const baseRef = resolveBaseRef();
const changedFiles = getChangedFiles(baseRef);

if (!changedFiles) {
  console.log('No comparable base commit found. Proceeding with build.');
  process.exit(1);
}

const watchedPaths = [...globalPaths, ...projectPaths[project]];
const shouldBuild = changedFiles.some((file) =>
  watchedPaths.some((watchedPath) => matchesPath(file, watchedPath))
);

console.log(`Vercel project: ${project}`);
console.log(`Compared range: ${baseRef}..HEAD`);
console.log(`Changed files: ${changedFiles.length}`);

if (shouldBuild) {
  console.log('Relevant changes detected. Proceeding with build.');
  process.exit(1);
}

console.log('No relevant changes detected. Skipping build.');
process.exit(0);
