import { pathToFileURL } from 'node:url';

export const INDEXNOW_KEY =
  '2f92269f763373da3dcd332907a547f721e177a93eaec211fc187930ccb59b9c';

export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

export const sites = [
  {
    host: 'vellira.dev',
    sitemapUrl: 'https://vellira.dev/sitemap.xml',
  },
  {
    host: 'docs.vellira.dev',
    sitemapUrl: 'https://docs.vellira.dev/sitemap.xml',
  },
];

const REQUEST_TIMEOUT_MS = 15_000;

export function extractUrls(xml) {
  return [...xml.matchAll(/<loc>\s*(.*?)\s*<\/loc>/g)].map((match) =>
    match[1].trim()
  );
}

export function normalizeUrls(urls, host) {
  const normalized = new Set();

  for (const value of urls) {
    try {
      const url = new URL(value);

      if (url.protocol !== 'https:' || url.host !== host) {
        continue;
      }

      url.hash = '';
      normalized.add(url.href);
    } catch {
      // Invalid sitemap entries are ignored rather than submitted.
    }
  }

  return [...normalized].sort();
}

export function createPayload({ host, urlList, key = INDEXNOW_KEY }) {
  return {
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: normalizeUrls(urlList, host),
  };
}

function requestOptions(options = {}) {
  return {
    ...options,
    signal: options.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  };
}

export async function loadSitemap(sitemapUrl, fetchImpl = fetch) {
  const response = await fetchImpl(
    sitemapUrl,
    requestOptions({
      headers: {
        'User-Agent': 'Vellira-IndexNow/1.0',
      },
    })
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load ${sitemapUrl}: ${response.status} ${response.statusText}`
    );
  }

  return response.text();
}

export async function verifyKey({ host, key = INDEXNOW_KEY }, fetchImpl = fetch) {
  const keyLocation = `https://${host}/${key}.txt`;
  const response = await fetchImpl(
    keyLocation,
    requestOptions({
      headers: {
        'User-Agent': 'Vellira-IndexNow/1.0',
      },
    })
  );

  if (!response.ok) {
    throw new Error(
      `IndexNow key verification failed for ${host}: ` +
        `${response.status} ${response.statusText}`
    );
  }

  const body = (await response.text()).trim();

  if (body !== key) {
    throw new Error(`IndexNow key verification failed for ${host}: body mismatch`);
  }

  return keyLocation;
}

export async function submitSite(
  { host, sitemapUrl },
  { fetchImpl = fetch, logger = console } = {}
) {
  await verifyKey({ host }, fetchImpl);

  const sitemap = await loadSitemap(sitemapUrl, fetchImpl);
  const payload = createPayload({ host, urlList: extractUrls(sitemap) });

  if (payload.urlList.length === 0) {
    logger.log(`Skipped IndexNow submission for ${host}: no canonical URLs found`);
    return { host, status: 'skipped', count: 0 };
  }

  const response = await fetchImpl(
    INDEXNOW_ENDPOINT,
    requestOptions({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    })
  );

  if (!response.ok) {
    const responseBody = await response.text();
    const detail = responseBody ? `\n${responseBody}` : '';

    throw new Error(
      `IndexNow submission failed for ${host}: ` +
        `${response.status} ${response.statusText}${detail}`
    );
  }

  logger.log(`Submitted ${payload.urlList.length} URLs for ${host}`);
  return { host, status: 'submitted', count: payload.urlList.length };
}

export async function main({ fetchImpl = fetch, logger = console } = {}) {
  const results = await Promise.allSettled(
    sites.map((site) => submitSite(site, { fetchImpl, logger }))
  );

  const failures = results.filter((result) => result.status === 'rejected');

  for (const failure of failures) {
    logger.error(failure.reason);
  }

  return {
    failed: failures.length,
    results,
  };
}

const isDirectExecution =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  const result = await main();

  if (result.failed > 0) {
    process.exitCode = 1;
  }
}
