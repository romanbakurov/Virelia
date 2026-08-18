import { describe, expect, it, vi } from 'vitest';

import {
  applyQualityIssueSyncOperations,
  createGitHubQualityIssueClient,
} from './github';
import { componentQualityIssueMarker } from './identity';

function jsonResponse(value: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

describe('component quality GitHub issue adapter', () => {
  it('only exposes issues carrying a managed identity marker', async () => {
    const key = 'component-quality:Select:react:api.public-surface';
    const fetchImpl = vi.fn(async (input: string | URL | Request) => {
      const url = String(input);

      if (url.includes('/issues?')) {
        return jsonResponse([
          {
            number: 10,
            state: 'open',
            title: 'Manual issue',
            body: 'Maintained by a human.',
            labels: [],
          },
          {
            number: 11,
            state: 'open',
            title: 'Managed issue',
            body: `Generated\n${componentQualityIssueMarker(key)}`,
            labels: [{ name: 'component-quality' }],
          },
        ]);
      }

      throw new Error(`Unexpected request: ${url}`);
    });
    const client = createGitHubQualityIssueClient({
      repository: 'vellira-dev/vellira',
      fetchImpl: fetchImpl as typeof fetch,
    });

    await expect(client.listManagedIssues()).resolves.toEqual([
      {
        number: 11,
        state: 'open',
        key,
        title: 'Managed issue',
        body: `Generated\n${componentQualityIssueMarker(key)}`,
        labels: ['component-quality'],
      },
    ]);
  });

  it('requires authentication before applying GitHub mutations', async () => {
    const fetchImpl = vi.fn();
    const client = createGitHubQualityIssueClient({
      repository: 'vellira-dev/vellira',
      fetchImpl: fetchImpl as typeof fetch,
    });

    await expect(
      client.createIssue({ title: 'Title', body: 'Body', labels: [] })
    ).rejects.toThrow('GITHUB_TOKEN is required');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('records lifecycle comments when closing and reopening managed issues', async () => {
    const calls: Array<{ url: string; method?: string; body?: string }> = [];
    const fetchImpl = vi.fn(
      async (input: string | URL | Request, init?: RequestInit) => {
        calls.push({
          url: String(input),
          method: init?.method,
          body: typeof init?.body === 'string' ? init.body : undefined,
        });
        return jsonResponse({});
      }
    );
    const client = createGitHubQualityIssueClient({
      repository: 'vellira-dev/vellira',
      token: 'test-token',
      fetchImpl: fetchImpl as typeof fetch,
    });

    await applyQualityIssueSyncOperations(client, [
      {
        kind: 'close',
        key: 'component-quality:Select:react:rule',
        issueNumber: 42,
      },
      {
        kind: 'reopen',
        key: 'component-quality:Select:react:rule',
        issueNumber: 42,
        desired: {
          key: 'component-quality:Select:react:rule',
          title: 'Managed title',
          body: 'Managed body',
          labels: ['component-quality'],
        },
      },
    ]);

    expect(calls.map(({ url }) => url)).toEqual([
      'https://api.github.com/repos/vellira-dev/vellira/issues/42/comments',
      'https://api.github.com/repos/vellira-dev/vellira/issues/42',
      'https://api.github.com/repos/vellira-dev/vellira/issues/42',
      'https://api.github.com/repos/vellira-dev/vellira/issues/42/comments',
    ]);
    expect(calls[1]?.body).toContain('"state":"closed"');
    expect(calls[2]?.body).toContain('"state":"open"');
  });

  it('surfaces GitHub API failures instead of silently losing operations', async () => {
    const fetchImpl = vi.fn(
      async () => new Response('rate limited', { status: 403 })
    );
    const client = createGitHubQualityIssueClient({
      repository: 'vellira-dev/vellira',
      token: 'test-token',
      fetchImpl: fetchImpl as typeof fetch,
    });

    await expect(
      client.createIssue({ title: 'Title', body: 'Body', labels: [] })
    ).rejects.toThrow('GitHub API 403');
  });
});
