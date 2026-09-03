import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { getCatalogPaths } from '../component-page/helpers/paths';

import type { ComponentCategoryArg, ComponentProfileArg } from './cli';

export type WebsiteComponentProfile =
  'primitive' | 'form-control' | 'compound' | 'overlay';

export type ComponentWebsiteGenerationResult = {
  createdFiles: string[];
  updatedFiles: string[];
};

type ManagedWebsiteSnapshot = Map<string, Buffer>;

export function resolveWebsiteComponentProfile(
  profile: ComponentProfileArg
): WebsiteComponentProfile {
  return profile === 'base' ? 'primitive' : profile;
}

export function generateComponentWebsitePage(params: {
  root: string;
  componentName: string;
  profile: ComponentProfileArg;
  category: ComponentCategoryArg;
}): ComponentWebsiteGenerationResult {
  const root = path.resolve(params.root);

  const before = snapshotManagedWebsiteArtifacts({
    root,
    componentName: params.componentName,
  });

  const result = spawnSync(
    'pnpm',
    [
      'create:component-page',
      params.componentName,
      '--force',
      `--profile=${resolveWebsiteComponentProfile(params.profile)}`,
      `--category=${params.category}`,
    ],
    {
      cwd: root,
      encoding: 'utf8',
      stdio: 'pipe',
    }
  );

  if (result.error) {
    throw new Error(
      `Website component page generation failed for ${params.componentName}: ${result.error.message}`
    );
  }

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr]
      .filter(Boolean)
      .join('\n')
      .trim();

    throw new Error(
      [
        `Website component page generation failed for ${params.componentName}.`,
        output,
      ]
        .filter(Boolean)
        .join('\n')
    );
  }

  const after = snapshotManagedWebsiteArtifacts({
    root,
    componentName: params.componentName,
  });

  const removedFiles = [...before.keys()]
    .filter((filePath) => !after.has(filePath))
    .sort();

  if (removedFiles.length > 0) {
    const relativeFiles = removedFiles.map((filePath) =>
      path.relative(root, filePath).split(path.sep).join('/')
    );

    throw new Error(
      [
        `Website component page generation removed managed artifacts unexpectedly for ${params.componentName}:`,
        ...relativeFiles.map((filePath) => `  - ${filePath}`),
      ].join('\n')
    );
  }

  const createdFiles = [...after.keys()]
    .filter((filePath) => !before.has(filePath))
    .sort();

  const updatedFiles = [...after.keys()]
    .filter((filePath) => {
      const previous = before.get(filePath);
      const current = after.get(filePath);

      return (
        previous !== undefined &&
        current !== undefined &&
        !previous.equals(current)
      );
    })
    .sort();

  return {
    createdFiles,
    updatedFiles,
  };
}

function snapshotManagedWebsiteArtifacts(params: {
  root: string;
  componentName: string;
}): ManagedWebsiteSnapshot {
  const { componentCatalogDir, catalogRegistryFile, componentsRegistryFile } =
    getCatalogPaths(params);

  const candidateFiles = [
    ...listFilesRecursively(componentCatalogDir),
    catalogRegistryFile,
    componentsRegistryFile,
  ];

  const snapshot: ManagedWebsiteSnapshot = new Map();

  for (const filePath of [...new Set(candidateFiles)].sort()) {
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const stat = fs.statSync(filePath);

    if (!stat.isFile()) {
      continue;
    }

    snapshot.set(filePath, fs.readFileSync(filePath));
  }

  return snapshot;
}

function listFilesRecursively(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const entries = fs
    .readdirSync(directory, {
      withFileTypes: true,
    })
    .sort((left, right) => left.name.localeCompare(right.name));

  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...listFilesRecursively(entryPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}
