import { desiredIssueForFinding } from './render';
import type {
  ManagedQualityIssue,
  NormalizedQualityFinding,
  QualityIssueLabelPolicy,
  QualityIssueSyncPlan,
  QualityIssueSyncOperation,
} from './types';
import { ComponentQualityIssueSyncError } from './types';

function sameLabels(left: readonly string[], right: readonly string[]) {
  return [...left].sort().join('\n') === [...right].sort().join('\n');
}

export function planQualityIssueSync(
  findings: readonly NormalizedQualityFinding[],
  managedIssues: readonly ManagedQualityIssue[],
  labelPolicy?: QualityIssueLabelPolicy
): QualityIssueSyncPlan {
  const operations: QualityIssueSyncOperation[] = [];
  const issuesByKey = new Map<string, ManagedQualityIssue>();

  for (const issue of managedIssues) {
    if (issuesByKey.has(issue.key)) {
      throw new ComponentQualityIssueSyncError(
        `Multiple managed GitHub issues use finding identity ${issue.key}.`
      );
    }
    issuesByKey.set(issue.key, issue);
  }

  const activeKeys = new Set<string>();

  for (const finding of findings) {
    activeKeys.add(finding.key);
    const desired = desiredIssueForFinding(finding, labelPolicy);
    const existing = issuesByKey.get(finding.key);

    if (!existing) {
      operations.push({ kind: 'create', key: finding.key, desired });
      continue;
    }

    if (existing.state === 'closed') {
      operations.push({
        kind: 'reopen',
        key: finding.key,
        issueNumber: existing.number,
        desired,
      });
      continue;
    }

    if (
      existing.title !== desired.title ||
      existing.body !== desired.body ||
      !sameLabels(existing.labels, desired.labels)
    ) {
      operations.push({
        kind: 'update',
        key: finding.key,
        issueNumber: existing.number,
        desired,
      });
    }
  }

  for (const issue of managedIssues) {
    if (issue.state === 'open' && !activeKeys.has(issue.key)) {
      operations.push({
        kind: 'close',
        key: issue.key,
        issueNumber: issue.number,
      });
    }
  }

  operations.sort((left, right) => {
    const keyOrder = left.key.localeCompare(right.key);
    if (keyOrder !== 0) return keyOrder;
    return left.kind.localeCompare(right.kind);
  });

  return { operations };
}
