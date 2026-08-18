import fs from 'node:fs';

import type { ComponentQualityReportV1 } from '@vellira-ui/metadata';

import { runComponentQualityCheck } from '../engine';
import {
  applyQualityIssueSyncOperations,
  createGitHubQualityIssueClient,
  type GitHubQualityIssueClient,
} from './github';
import { normalizeActionableFindings } from './normalize';
import { planQualityIssueSync } from './planner';
import { qualityIssueLabelPolicyForAvailableLabels } from './render';
import type { QualityIssueSyncOperation } from './types';
import { ComponentQualityIssueSyncError } from './types';

const defaultRepository = 'vellira-dev/vellira';

type CliOptions = {
  dryRun: boolean;
  includeWarn: boolean;
  repository: string;
  reportPath?: string;
};

export interface ComponentQualityIssueSyncCliDependencies {
  runChecker?: () => Promise<ComponentQualityReportV1>;
  createClient?: (repository: string) => GitHubQualityIssueClient;
  readReport?: (filePath: string) => unknown;
  write?: (message: string) => void;
  writeError?: (message: string) => void;
}

function parseArgs(args: readonly string[]): CliOptions {
  let dryRun = false;
  let includeWarn = false;
  let repository = process.env.GITHUB_REPOSITORY ?? defaultRepository;
  let reportPath: string | undefined;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }
    if (arg === '--warn') {
      includeWarn = true;
      continue;
    }
    if (arg === '--repo') {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) {
        throw new ComponentQualityIssueSyncError(
          'Expected owner/name after --repo.'
        );
      }
      repository = value;
      index += 1;
      continue;
    }
    if (arg === '--report') {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) {
        throw new ComponentQualityIssueSyncError(
          'Expected a JSON file path after --report.'
        );
      }
      reportPath = value;
      index += 1;
      continue;
    }

    throw new ComponentQualityIssueSyncError(`Unknown option "${arg}".`);
  }

  return { dryRun, includeWarn, repository, reportPath };
}

function operationDescription(operation: QualityIssueSyncOperation) {
  if (operation.kind === 'create') {
    return `CREATE ${operation.key} — ${operation.desired.title}`;
  }
  if (operation.kind === 'update') {
    return `UPDATE #${operation.issueNumber} ${operation.key}`;
  }
  if (operation.kind === 'close') {
    return `CLOSE #${operation.issueNumber} ${operation.key}`;
  }
  return `REOPEN #${operation.issueNumber} ${operation.key}`;
}

export async function runComponentQualityIssueSyncCli(
  args: readonly string[],
  dependencies: ComponentQualityIssueSyncCliDependencies = {}
): Promise<number> {
  const write = dependencies.write ?? console.log;
  const writeError = dependencies.writeError ?? console.error;

  try {
    const options = parseArgs(args);
    const runChecker =
      dependencies.runChecker ??
      (async () => (await runComponentQualityCheck()).report);
    const readReport =
      dependencies.readReport ??
      ((filePath: string) => JSON.parse(fs.readFileSync(filePath, 'utf8')));
    const createClient =
      dependencies.createClient ??
      ((repository: string) =>
        createGitHubQualityIssueClient({
          repository,
          token: process.env.GITHUB_TOKEN,
        }));

    const report = options.reportPath
      ? readReport(options.reportPath)
      : await runChecker();
    const findings = normalizeActionableFindings(report, {
      includeWarn: options.includeWarn,
    });
    const client = createClient(options.repository);
    const [managedIssues, availableLabels] = await Promise.all([
      client.listManagedIssues(),
      client.listAvailableLabels(),
    ]);
    const labelPolicy =
      qualityIssueLabelPolicyForAvailableLabels(availableLabels);
    const plan = planQualityIssueSync(findings, managedIssues, labelPolicy);

    if (plan.operations.length === 0) {
      write('No component quality issue synchronization changes required.');
      return 0;
    }

    for (const operation of plan.operations) {
      write(
        `${options.dryRun ? '[dry-run] ' : ''}${operationDescription(operation)}`
      );
    }

    if (!options.dryRun) {
      await applyQualityIssueSyncOperations(client, plan.operations);
      write(
        `Applied ${plan.operations.length} component quality issue operation(s).`
      );
    }

    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    writeError(`Component Quality issue sync error: ${message}`);
    return 2;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = await runComponentQualityIssueSyncCli(
    process.argv.slice(2)
  );
}
