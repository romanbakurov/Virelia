import assert from 'node:assert/strict';
import test from 'node:test';

import {
  INDEXNOW_ENDPOINT,
  INDEXNOW_KEY,
  createPayload,
  extractUrls,
  normalizeUrls,
  submitSite,
  verifyKey,
} from './submit-indexnow.mjs';

function response({ status = 200, statusText = 'OK', body = '' } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    async text() {
      return body;
    },
  };
}

function createFetch(sequence) {
  const calls = [];

  const fetchImpl = async (url, options = {}) => {
    calls.push({ url, options });
    const next = sequence.shift();

    if (next instanceof Error) {
      throw next;
    }

    if (!next) {
      throw new Error(`Unexpected fetch call: ${url}`);
    }

    return next;
  };

  return { fetchImpl, calls };
}

test('extractUrls reads sitemap locations', () => {
  assert.deepEqual(
    extractUrls(`
      <urlset>
        <url><loc>https://vellira.dev/</loc></url>
        <url><loc>https://vellira.dev/components/button</loc></url>
      </urlset>
    `),
    ['https://vellira.dev/', 'https://vellira.dev/components/button']
  );
});

test('normalizeUrls keeps only canonical HTTPS URLs and deduplicates them', () => {
  assert.deepEqual(
    normalizeUrls(
      [
        'https://vellira.dev/components/button#example',
        'https://vellira.dev/components/button',
        'http://vellira.dev/components/button',
        'https://docs.vellira.dev/components/button',
        'not-a-url',
        'https://vellira.dev/components',
      ],
      'vellira.dev'
    ),
    ['https://vellira.dev/components', 'https://vellira.dev/components/button']
  );
});

test('createPayload is deterministic and uses the matching key location', () => {
  const payload = createPayload({
    host: 'vellira.dev',
    urlList: [
      'https://vellira.dev/z',
      'https://vellira.dev/a',
      'https://vellira.dev/z',
    ],
  });

  assert.deepEqual(payload, {
    host: 'vellira.dev',
    key: INDEXNOW_KEY,
    keyLocation: `https://vellira.dev/${INDEXNOW_KEY}.txt`,
    urlList: ['https://vellira.dev/a', 'https://vellira.dev/z'],
  });
});

test('verifyKey accepts the exact hosted key', async () => {
  const { fetchImpl, calls } = createFetch([
    response({ body: `${INDEXNOW_KEY}\n` }),
  ]);

  const keyLocation = await verifyKey({ host: 'vellira.dev' }, fetchImpl);

  assert.equal(keyLocation, `https://vellira.dev/${INDEXNOW_KEY}.txt`);
  assert.equal(calls.length, 1);
});

test('verifyKey rejects an invalid key response', async () => {
  const { fetchImpl } = createFetch([response({ status: 403, statusText: 'Forbidden' })]);

  await assert.rejects(
    verifyKey({ host: 'vellira.dev' }, fetchImpl),
    /403 Forbidden/
  );
});

test('verifyKey rejects a key body mismatch', async () => {
  const { fetchImpl } = createFetch([response({ body: 'wrong-key' })]);

  await assert.rejects(
    verifyKey({ host: 'vellira.dev' }, fetchImpl),
    /body mismatch/
  );
});

test('submitSite skips empty canonical URL sets without calling IndexNow', async () => {
  const { fetchImpl, calls } = createFetch([
    response({ body: INDEXNOW_KEY }),
    response({ body: '<urlset><url><loc>http://vellira.dev/</loc></url></urlset>' }),
  ]);
  const logs = [];

  const result = await submitSite(
    { host: 'vellira.dev', sitemapUrl: 'https://vellira.dev/sitemap.xml' },
    { fetchImpl, logger: { log: (message) => logs.push(message) } }
  );

  assert.deepEqual(result, { host: 'vellira.dev', status: 'skipped', count: 0 });
  assert.equal(calls.length, 2);
  assert.match(logs[0], /no canonical URLs found/);
});

test('submitSite submits one deterministic batch', async () => {
  const { fetchImpl, calls } = createFetch([
    response({ body: INDEXNOW_KEY }),
    response({
      body: `
        <urlset>
          <url><loc>https://vellira.dev/components/button</loc></url>
          <url><loc>https://vellira.dev/</loc></url>
          <url><loc>https://vellira.dev/components/button</loc></url>
        </urlset>
      `,
    }),
    response({ status: 202, statusText: 'Accepted' }),
  ]);

  const result = await submitSite(
    { host: 'vellira.dev', sitemapUrl: 'https://vellira.dev/sitemap.xml' },
    { fetchImpl, logger: { log() {} } }
  );

  assert.deepEqual(result, { host: 'vellira.dev', status: 'submitted', count: 2 });
  assert.equal(calls[2].url, INDEXNOW_ENDPOINT);
  assert.deepEqual(JSON.parse(calls[2].options.body), {
    host: 'vellira.dev',
    key: INDEXNOW_KEY,
    keyLocation: `https://vellira.dev/${INDEXNOW_KEY}.txt`,
    urlList: ['https://vellira.dev/', 'https://vellira.dev/components/button'],
  });
});

for (const [status, statusText] of [
  [422, 'Unprocessable Entity'],
  [429, 'Too Many Requests'],
  [503, 'Service Unavailable'],
]) {
  test(`submitSite exposes IndexNow ${status} failures`, async () => {
    const { fetchImpl } = createFetch([
      response({ body: INDEXNOW_KEY }),
      response({ body: '<urlset><url><loc>https://vellira.dev/</loc></url></urlset>' }),
      response({ status, statusText, body: 'failure detail' }),
    ]);

    await assert.rejects(
      submitSite(
        { host: 'vellira.dev', sitemapUrl: 'https://vellira.dev/sitemap.xml' },
        { fetchImpl, logger: { log() {} } }
      ),
      new RegExp(`${status} ${statusText}`)
    );
  });
}

test('submitSite exposes network failures', async () => {
  const { fetchImpl } = createFetch([
    response({ body: INDEXNOW_KEY }),
    response({ body: '<urlset><url><loc>https://vellira.dev/</loc></url></urlset>' }),
    new Error('network unavailable'),
  ]);

  await assert.rejects(
    submitSite(
      { host: 'vellira.dev', sitemapUrl: 'https://vellira.dev/sitemap.xml' },
      { fetchImpl, logger: { log() {} } }
    ),
    /network unavailable/
  );
});
