import { spawnSync } from 'node:child_process';
import path from 'node:path';

export type ComponentProductionRepositorySafetyResult =
  | {
      ok: true;
      branch: string | null;
      defaultBranch: string | null;
    }
  | {
      ok: false;
      branch: string | null;
      defaultBranch: string | null;
      reason: string;
    };

export function validateComponentProductionRepositorySafety(
  root: string
): ComponentProductionRepositorySafetyResult {
  const resolvedRoot = path.resolve(root);

  const repository = git(resolvedRoot, 'rev-parse', '--is-inside-work-tree');

  if (repository.exitCode !== 0 || repository.stdout.trim() !== 'true') {
    return {
      ok: false,
      branch: null,
      defaultBranch: null,
      reason: 'Component production requires a Git repository checkout.',
    };
  }

  const branchResult = git(
    resolvedRoot,
    'symbolic-ref',
    '--quiet',
    '--short',
    'HEAD'
  );

  const branch =
    branchResult.exitCode === 0 ? branchResult.stdout.trim() : null;

  const defaultBranchResult = git(
    resolvedRoot,
    'symbolic-ref',
    '--quiet',
    '--short',
    'refs/remotes/origin/HEAD'
  );

  const defaultBranch =
    defaultBranchResult.exitCode === 0
      ? normalizeDefaultBranch(defaultBranchResult.stdout.trim())
      : null;

  const protectedBranches = new Set(
    [defaultBranch, 'main', 'master'].filter(
      (value): value is string => value !== null
    )
  );

  if (branch !== null && protectedBranches.has(branch)) {
    return {
      ok: false,
      branch,
      defaultBranch,
      reason: `Component production refuses direct writes on protected/default branch "${branch}".`,
    };
  }

  return {
    ok: true,
    branch,
    defaultBranch,
  };
}

type GitResult = {
  exitCode: number | null;
  stdout: string;
};

function git(root: string, ...args: readonly string[]): GitResult {
  const result = spawnSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    shell: false,
  });

  return {
    exitCode: result.status,
    stdout: result.stdout ?? '',
  };
}

function normalizeDefaultBranch(value: string): string {
  const prefix = 'origin/';

  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}
