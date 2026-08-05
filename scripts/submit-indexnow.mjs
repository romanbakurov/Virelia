const INDEXNOW_KEY =
  '2f92269f763373da3dcd332907a547f721e177a93eaec211fc187930ccb59b9c';

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

const sites = [
  {
    host: 'vellira.dev',
    sitemapUrl: 'https://vellira.dev/sitemap.xml',
  },
  {
    host: 'docs.vellira.dev',
    sitemapUrl: 'https://docs.vellira.dev/sitemap.xml',
  },
];

function extractUrls(xml) {
  return [...xml.matchAll(/<loc>\s*(.*?)\s*<\/loc>/g)].map((match) =>
    match[1].trim()
  );
}

async function loadSitemap(sitemapUrl) {
  const response = await fetch(sitemapUrl, {
    headers: {
      'User-Agent': 'Vellira-IndexNow/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load ${sitemapUrl}: ${response.status} ${response.statusText}`
    );
  }

  return response.text();
}

async function submitSite({ host, sitemapUrl }) {
  const sitemap = await loadSitemap(sitemapUrl);
  const urlList = extractUrls(sitemap).filter((url) => {
    try {
      return new URL(url).host === host;
    } catch {
      return false;
    }
  });

  if (urlList.length === 0) {
    throw new Error(`No URLs found for ${host} in ${sitemapUrl}`);
  }

  const keyLocation = `https://${host}/${INDEXNOW_KEY}.txt`;

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation,
      urlList,
    }),
  });

  if (!response.ok) {
    const responseBody = await response.text();

    throw new Error(
      `IndexNow submission failed for ${host}: ` +
        `${response.status} ${response.statusText}\n${responseBody}`
    );
  }

  console.log(`Submitted ${urlList.length} URLs for ${host}`);
}

async function main() {
  const results = await Promise.allSettled(sites.map(submitSite));

  const failures = results.filter((result) => result.status === 'rejected');

  for (const failure of failures) {
    console.error(failure.reason);
  }

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

await main();
