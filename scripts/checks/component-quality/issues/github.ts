import { extractComponentQualityIssueKey } from './identity';
import type {
  GitHubIssueMutationInput,
  ManagedQualityIssue,
  QualityIssueClient,
  QualityIssueSyncOperation,
} from './types';
import { ComponentQualityIssueSyncError } from './types';

type GitHubIssueResponse = {
  number: number;
  state: 'open' | 'closed';
  title: string;
  body: string | null;
  labels: Array<string | { name?: string | null }>;
  pull_request?: unknown;
};

type GitHubLabelResponse = { name: string };

export interface GitHubQualityIssueClient extends QualityIssueClient {
  listAvailableLabels(): Promise<readonly string[]>;
}

export interface GitHubQualityIssueClientOptions {
  repository: string;
  token?: string;
  apiBaseUrl?: string;
  fetchImpl?: typeof fetch;
}

function parseRepository(repository: string) {
  const [owner, repo, ...rest] = repository.split('/');
  if (!owner || !repo || rest.length > 0) {
    throw new ComponentQualityIssueSyncError(
      `Expected repository in owner/name form, received "${repository}".`
    );
  }
  return { owner, repo };
}

export function createGitHubQualityIssueClient(
  options: GitHubQualityIssueClientOptions
): GitHubQualityIssueClient {
  const { owner, repo } = parseRepository(options.repository);
  const apiBaseUrl = options.apiBaseUrl ?? 'https://api.github.com';
  const fetchImpl = options.fetchImpl ?? fetch;

  async function request<T>(
    path: string,
    init: RequestInit = {},
    requireAuth = false
  ): Promise<T> {
    if (requireAuth && !options.token) {
      throw new ComponentQualityIssueSyncError(
        'GITHUB_TOKEN is required for GitHub issue mutations.'
      );
    }

    const headers = new Headers(init.headers);
    headers.set('Accept', 'application/vnd.github+json');
    headers.set('X-GitHub-Api-Version', '2022-11-28');
    if (options.token) headers.set('Authorization', `Bearer ${options.token}`);
    if (init.body) headers.set('Content-Type', 'application/json');

    const response = await fetchImpl(`${apiBaseUrl}${path}`, {
      ...init,
      headers,
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new ComponentQualityIssueSyncError(
        `GitHub API ${response.status} for ${path}: ${detail.slice(0, 500)}`
      );
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }

  async function listAll<T>(path: string): Promise<T[]> {
    const items: T[] = [];
    for (let page = 1; ; page += 1) {
      const separator = path.includes('?') ? '&' : '?';
      const batch = await request<T[]>(
        `${path}${separator}per_page=100&page=${page}`
      );
      items.push(...batch);
      if (batch.length < 100) return items;
    }
  }

  function mutationBody(input: GitHubIssueMutationInput) {
    return JSON.stringify({
      title: input.title,
      body: input.body,
      labels: input.labels,
    });
  }

  async function addLifecycleComment(issueNumber: number, body: string) {
    await request(
      `/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
      { method: 'POST', body: JSON.stringify({ body }) },
      true
    );
  }

  return {
    async listManagedIssues() {
      const issues = await listAll<GitHubIssueResponse>(
        `/repos/${owner}/${repo}/issues?state=all`
      );

      return issues
        .filter((issue) => !issue.pull_request)
        .flatMap((issue): ManagedQualityIssue[] => {
          const body = issue.body ?? '';
          const key = extractComponentQualityIssueKey(body);
          if (!key) return [];

          const labels = issue.labels
            .map((label) => (typeof label === 'string' ? label : label.name))
            .filter((label): label is string => Boolean(label))
            .sort();

          return [
            {
              number: issue.number,
              state: issue.state,
              key,
              title: issue.title,
              body,
              labels,
            },
          ];
        })
        .sort((left, right) => left.number - right.number);
    },

    async listAvailableLabels() {
      const labels = await listAll<GitHubLabelResponse>(
        `/repos/${owner}/${repo}/labels`
      );
      return labels.map(({ name }) => name).sort();
    },

    async createIssue(input) {
      await request(
        `/repos/${owner}/${repo}/issues`,
        { method: 'POST', body: mutationBody(input) },
        true
      );
    },

    async updateIssue(issueNumber, input) {
      await request(
        `/repos/${owner}/${repo}/issues/${issueNumber}`,
        { method: 'PATCH', body: mutationBody(input) },
        true
      );
    },

    async closeIssue(issueNumber) {
      await addLifecycleComment(
        issueNumber,
        'Automatically closing this managed issue because the corresponding Component Quality finding is no longer actionable.'
      );
      await request(
        `/repos/${owner}/${repo}/issues/${issueNumber}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ state: 'closed', state_reason: 'completed' }),
        },
        true
      );
    },

    async reopenIssue(issueNumber, input) {
      await request(
        `/repos/${owner}/${repo}/issues/${issueNumber}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            state: 'open',
            title: input.title,
            body: input.body,
            labels: input.labels,
          }),
        },
        true
      );
      await addLifecycleComment(
        issueNumber,
        'Automatically reopening this managed issue because the Component Quality finding has regressed and is actionable again.'
      );
    },
  };
}

export async function applyQualityIssueSyncOperations(
  client: QualityIssueClient,
  operations: readonly QualityIssueSyncOperation[]
) {
  for (const operation of operations) {
    if (operation.kind === 'create') {
      await client.createIssue(operation.desired);
    } else if (operation.kind === 'update') {
      await client.updateIssue(operation.issueNumber, operation.desired);
    } else if (operation.kind === 'close') {
      await client.closeIssue(operation.issueNumber);
    } else {
      await client.reopenIssue(operation.issueNumber, operation.desired);
    }
  }
}
