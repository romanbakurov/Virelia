import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export type EntrypointMode = 'project' | 'defaultProject' | 'build';

export interface EntrypointContract {
  project: string;
  packageJson: string;
  script: string;
  invocation: string;
  mode?: EntrypointMode;
  rootScript?: string;
  rootInvocation?: string;
  reason: string;
}

export interface AuthorityRecord {
  project: string;
  authoritySource: string;
  packageScript: string;
  invocation: string;
  reason: string;
}

export interface CoverageSummary {
  maintainedFiles: number;
  exclusions: number;
  unowned: number;
  conflicting: number;
  blocking: boolean;
}

export interface CoverageResult {
  discoveredTsconfigs: string[];
  verifiedEntrypoints: EntrypointContract[];
  authoritativeProjects: string[];
  authorityMatrix: AuthorityRecord[];
  maintainedFiles: string[];
  exclusions: string[];
  unownedFiles: string[];
  conflictingFiles: string[];
  errors: string[];
  summary: CoverageSummary;
}

const defaultEntrypointsPath = new URL('./entrypoints.json', import.meta.url);
const sourceExtensions = new Set(['.ts', '.tsx', '.mts', '.cts']);
const ignoredPathSegments = new Set([
  '.next',
  'coverage',
  'dist',
  'node_modules',
  'storybook-static',
]);

export function runTsProjectCoverageCheck(
  rootDir = process.cwd(),
  entrypointsPath: string | URL = defaultEntrypointsPath
): CoverageResult {
  const root = path.resolve(rootDir);
  const entrypoints = loadEntrypoints(entrypointsPath);
  const errors: string[] = [];
  const verifiedEntrypoints: EntrypointContract[] = [];

  for (const entrypoint of entrypoints) {
    const validationError = validateEntrypoint(root, entrypoint);
    if (validationError) {
      errors.push(validationError);
    } else {
      verifiedEntrypoints.push(entrypoint);
    }
  }

  const discoveredTsconfigs = discoverTsconfigs(root);
  const authorityByProject = new Map<string, AuthorityRecord>();
  const authoritativeProjects = new Set<string>();

  for (const entrypoint of verifiedEntrypoints) {
    const seedProject = normalizeRelative(entrypoint.project);
    const authoritySource = `${entrypoint.packageJson}#${entrypoint.script}`;
    const packageScript = entrypoint.rootScript
      ? `package.json#${entrypoint.rootScript} -> ${authoritySource}`
      : authoritySource;
    const seedRecord: AuthorityRecord = {
      project: seedProject,
      authoritySource,
      packageScript,
      invocation: entrypoint.invocation,
      reason: entrypoint.reason,
    };

    for (const project of collectProjectReferenceClosure(
      root,
      seedProject,
      errors
    )) {
      if (!authoritativeProjects.has(project)) {
        authoritativeProjects.add(project);
        authorityByProject.set(
          project,
          project === seedProject
            ? seedRecord
            : {
                ...seedRecord,
                project,
                invocation: `referenced from ${seedProject}`,
                reason: `Referenced by verified entrypoint ${seedProject}.`,
              }
        );
      }
    }
  }

  const maintainedFiles = listMaintainedFiles(root);
  const ownedByFile = new Map<string, Set<string>>();

  for (const project of authoritativeProjects) {
    for (const file of listProjectFiles(root, project, errors)) {
      if (!isMaintainedSourcePath(file)) {
        continue;
      }
      if (!isOwnedByProjectSurface(project, file)) {
        continue;
      }
      const owners = ownedByFile.get(file) ?? new Set<string>();
      owners.add(project);
      ownedByFile.set(file, owners);
    }
  }

  const unownedFiles = maintainedFiles.filter((file) => !ownedByFile.has(file));
  const conflictingFiles: string[] = [];
  const exclusions: string[] = [];

  for (const [file, owners] of ownedByFile) {
    const roots = new Set([...owners].map(projectAuthorityRoot));
    if (!file.endsWith('.d.ts') && roots.size > 1) {
      conflictingFiles.push(file);
    }
  }

  conflictingFiles.sort();

  return {
    discoveredTsconfigs,
    verifiedEntrypoints,
    authoritativeProjects: [...authoritativeProjects].sort(),
    authorityMatrix: [...authorityByProject.values()].sort((left, right) =>
      left.project.localeCompare(right.project)
    ),
    maintainedFiles,
    exclusions,
    unownedFiles,
    conflictingFiles,
    errors,
    summary: {
      maintainedFiles: maintainedFiles.length,
      exclusions: exclusions.length,
      unowned: unownedFiles.length,
      conflicting: conflictingFiles.length,
      blocking:
        errors.length > 0 ||
        unownedFiles.length > 0 ||
        conflictingFiles.length > 0,
    },
  };
}

function loadEntrypoints(entrypointsPath: string | URL): EntrypointContract[] {
  return JSON.parse(
    fs.readFileSync(entrypointsPath, 'utf8')
  ) as EntrypointContract[];
}

function validateEntrypoint(
  root: string,
  entrypoint: EntrypointContract
): string | null {
  const packageJsonPath = path.join(root, entrypoint.packageJson);
  const projectPath = path.join(root, entrypoint.project);

  if (!fs.existsSync(packageJsonPath)) {
    return `${entrypoint.project}: ${entrypoint.packageJson} does not exist.`;
  }
  if (!fs.existsSync(projectPath)) {
    return `${entrypoint.project}: project config does not exist.`;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as {
    scripts?: Record<string, string>;
  };
  const script = packageJson.scripts?.[entrypoint.script];
  if (!script) {
    return `${entrypoint.project}: ${entrypoint.packageJson} has no ${entrypoint.script} script.`;
  }
  if (!scriptHasInvocation(script, entrypoint.invocation)) {
    return `${entrypoint.project}: ${entrypoint.packageJson}#${entrypoint.script} does not contain "${entrypoint.invocation}".`;
  }

  const rootPackageJsonPath = path.join(root, 'package.json');
  const rootPackageJson = JSON.parse(
    fs.readFileSync(rootPackageJsonPath, 'utf8')
  ) as {
    scripts?: Record<string, string>;
  };

  if (entrypoint.rootScript && entrypoint.rootInvocation) {
    const rootScript = rootPackageJson.scripts?.[entrypoint.rootScript];
    if (
      !rootScript ||
      !scriptHasInvocation(rootScript, entrypoint.rootInvocation)
    ) {
      return `${entrypoint.project}: package.json#${entrypoint.rootScript} does not contain "${entrypoint.rootInvocation}".`;
    }
  }

  if (entrypoint.rootScript === 'typecheck') {
    const ciTypecheck = rootPackageJson.scripts?.['ci:typecheck'];
    if (!ciTypecheck || !scriptHasInvocation(ciTypecheck, 'pnpm typecheck')) {
      return `${entrypoint.project}: package.json#ci:typecheck does not contain "pnpm typecheck".`;
    }
  }

  return null;
}

function scriptHasInvocation(script: string, invocation: string): boolean {
  return scriptSegments(script).includes(invocation);
}

function scriptSegments(script: string): string[] {
  return script
    .split('&&')
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function collectProjectReferenceClosure(
  root: string,
  seedProject: string,
  errors: string[]
): string[] {
  const projects: string[] = [];
  const seen = new Set<string>();
  const queue = [seedProject];

  while (queue.length > 0) {
    const project = queue.shift()!;
    if (seen.has(project)) {
      continue;
    }
    seen.add(project);
    projects.push(project);

    const config = readTsconfig(root, project, errors);
    if (!config) {
      continue;
    }

    const references = Array.isArray(config.references)
      ? config.references
      : [];
    for (const reference of references) {
      if (!reference.path || typeof reference.path !== 'string') {
        continue;
      }
      const referencedProject = resolveProjectReference(
        root,
        project,
        reference.path
      );
      queue.push(referencedProject);
    }
  }

  return projects;
}

function resolveProjectReference(
  root: string,
  containingProject: string,
  referencePath: string
): string {
  const containingDir = path.dirname(path.join(root, containingProject));
  const absoluteReference = path.resolve(containingDir, referencePath);
  const statPath = fs.existsSync(absoluteReference)
    ? absoluteReference
    : `${absoluteReference}.json`;
  const configPath =
    fs.existsSync(statPath) && fs.statSync(statPath).isDirectory()
      ? path.join(statPath, 'tsconfig.json')
      : statPath.endsWith('.json')
        ? statPath
        : path.join(statPath, 'tsconfig.json');
  return path.relative(root, configPath).replaceAll(path.sep, '/');
}

function readTsconfig(
  root: string,
  project: string,
  errors: string[]
): Record<string, unknown> | null {
  const configPath = path.join(root, project);
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  if (config.error) {
    errors.push(`${project}: ${formatDiagnostic(config.error)}`);
    return null;
  }
  return config.config as Record<string, unknown>;
}

function listProjectFiles(
  root: string,
  project: string,
  errors: string[]
): string[] {
  const configPath = path.join(root, project);
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  if (config.error) {
    errors.push(`${project}: ${formatDiagnostic(config.error)}`);
    return [];
  }

  const parsed = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    path.dirname(configPath)
  );
  for (const error of parsed.errors) {
    errors.push(`${project}: ${formatDiagnostic(error)}`);
  }

  return parsed.fileNames
    .map((file) => path.relative(root, file).replaceAll(path.sep, '/'))
    .filter(isMaintainedSourcePath)
    .sort();
}

function discoverTsconfigs(root: string): string[] {
  return listFiles(root)
    .filter((file) => /(^|\/)tsconfig(?:\.[^/]+)?\.json$/.test(file))
    .sort();
}

function listMaintainedFiles(root: string): string[] {
  return listGitFiles(root)
    .filter((file) => isMaintainedSourcePath(file))
    .sort();
}

function listGitFiles(root: string): string[] {
  const files = new Set<string>();
  try {
    const output = execFileSync('git', ['ls-files'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    for (const file of output.split('\n').filter(Boolean)) {
      files.add(file);
    }
  } catch {
    return listFiles(root);
  }

  for (const file of listFiles(root)) {
    files.add(file);
  }

  return [...files].sort();
}

function listFiles(root: string): string[] {
  const files: string[] = [];
  const queue = ['.'];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const absolute = path.join(root, current);
    for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
      const relative = normalizeRelative(path.join(current, entry.name));
      if (
        relative.split('/').some((segment) => ignoredPathSegments.has(segment))
      ) {
        continue;
      }
      if (entry.isDirectory()) {
        queue.push(relative);
      } else if (entry.isFile()) {
        files.push(relative);
      }
    }
  }

  return files.sort();
}

function isMaintainedSourcePath(file: string): boolean {
  if (file.split('/').some((segment) => ignoredPathSegments.has(segment))) {
    return false;
  }
  if (!sourceExtensions.has(path.extname(file))) {
    return false;
  }
  return (
    file.startsWith('apps/') ||
    file.startsWith('packages/') ||
    file.startsWith('scripts/') ||
    /^[^/]+\.(?:config\.)?(?:ts|tsx|mts|cts)$/.test(file)
  );
}

function projectAuthorityRoot(project: string): string {
  const segments = project.split('/');
  if (
    (segments[0] === 'apps' || segments[0] === 'packages') &&
    segments.length >= 2
  ) {
    return `${segments[0]}/${segments[1]}`;
  }
  if (segments[0] === 'scripts') {
    return 'scripts';
  }
  return '.';
}

function isOwnedByProjectSurface(project: string, file: string): boolean {
  const authorityRoot = projectAuthorityRoot(project);
  if (authorityRoot === '.') {
    return file.startsWith('scripts/') || !file.includes('/');
  }
  return file.startsWith(`${authorityRoot}/`);
}

function normalizeRelative(file: string): string {
  return file.replace(/^\.\//, '').replaceAll(path.sep, '/');
}

function formatDiagnostic(diagnostic: ts.Diagnostic): string {
  return ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
}

function printCliResult(): void {
  const json = process.argv.includes('--json');
  const result = runTsProjectCoverageCheck();

  if (json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Discovered tsconfigs: ${result.discoveredTsconfigs.length}`);
    console.log(
      `Verified CI entrypoints: ${result.verifiedEntrypoints.length}`
    );
    console.log(
      `Authoritative projects: ${result.authoritativeProjects.length}`
    );
    console.log(
      `Ownership: ${result.summary.maintainedFiles} maintained, ${result.summary.exclusions} exclusions, ${result.summary.unowned} unowned, ${result.summary.conflicting} conflicting`
    );

    if (result.errors.length > 0) {
      console.log('\nErrors:');
      for (const error of result.errors) {
        console.log(`- ${error}`);
      }
    }

    if (result.unownedFiles.length > 0) {
      console.log('\nUnowned files:');
      for (const file of result.unownedFiles) {
        console.log(`- ${file}`);
      }
    }

    if (result.conflictingFiles.length > 0) {
      console.log('\nConflicting files:');
      for (const file of result.conflictingFiles) {
        console.log(`- ${file}`);
      }
    }
  }

  if (result.summary.blocking) {
    process.exitCode = 1;
  }
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
) {
  printCliResult();
}
