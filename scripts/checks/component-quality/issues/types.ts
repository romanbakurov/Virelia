import type {
  ComponentPlatform,
  ComponentQualityDimension,
  ComponentQualityRuleSeverity,
} from '@vellira-ui/metadata';

export type ActionableQualityStatus = 'fail' | 'warn';

export interface NormalizedQualityFinding {
  key: string;
  componentName: string;
  platform: ComponentPlatform;
  ruleId: string;
  dimension: ComponentQualityDimension;
  severity: ComponentQualityRuleSeverity;
  status: ActionableQualityStatus;
  message?: string;
  evidence: readonly string[];
}

export interface FindingNormalizationOptions {
  includeWarn?: boolean;
}

export interface ManagedQualityIssue {
  number: number;
  state: 'open' | 'closed';
  key: string;
  title: string;
  body: string;
  labels: readonly string[];
}

export interface DesiredQualityIssue {
  key: string;
  title: string;
  body: string;
  labels: readonly string[];
}

export type QualityIssueSyncOperation =
  | {
      kind: 'create';
      key: string;
      desired: DesiredQualityIssue;
    }
  | {
      kind: 'update';
      key: string;
      issueNumber: number;
      desired: DesiredQualityIssue;
    }
  | {
      kind: 'close';
      key: string;
      issueNumber: number;
    }
  | {
      kind: 'reopen';
      key: string;
      issueNumber: number;
      desired: DesiredQualityIssue;
    };

export interface QualityIssueSyncPlan {
  operations: readonly QualityIssueSyncOperation[];
}

export interface QualityIssueLabelPolicy {
  base?: readonly string[];
  dimensions?: Partial<Record<ComponentQualityDimension, readonly string[]>>;
  platforms?: Partial<Record<ComponentPlatform, readonly string[]>>;
}

export interface GitHubIssueMutationInput {
  title: string;
  body: string;
  labels: readonly string[];
}

export interface QualityIssueClient {
  listManagedIssues(): Promise<readonly ManagedQualityIssue[]>;
  createIssue(input: GitHubIssueMutationInput): Promise<void>;
  updateIssue(
    issueNumber: number,
    input: GitHubIssueMutationInput
  ): Promise<void>;
  closeIssue(issueNumber: number): Promise<void>;
  reopenIssue(
    issueNumber: number,
    input: GitHubIssueMutationInput
  ): Promise<void>;
}

export class ComponentQualityIssueSyncError extends Error {
  override name = 'ComponentQualityIssueSyncError';
}
