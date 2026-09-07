import { chromium } from '@playwright/test';

const baseUrl = process.env.WEBSITE_URL;

if (!baseUrl) {
  throw new Error('WEBSITE_URL is required.');
}

const origin = new URL(baseUrl).origin;
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
const chunkDiagnostics = [];

function isSameOrigin(url) {
  return new URL(url).origin === origin;
}

function isNextStaticChunk(url) {
  if (!isSameOrigin(url)) {
    return false;
  }

  return new URL(url).pathname.startsWith('/_next/static/');
}

function recordChunkDiagnostic(diagnostic) {
  if (!chunkDiagnostics.includes(diagnostic)) {
    chunkDiagnostics.push(diagnostic);
  }
}

page.on('response', (response) => {
  if (isNextStaticChunk(response.url()) && response.status() >= 400) {
    recordChunkDiagnostic(
      `chunk response: ${response.status()} ${response.request().method()} ${response.url()}`
    );
  }
});

page.on('requestfailed', (request) => {
  if (!isNextStaticChunk(request.url())) {
    return;
  }

  recordChunkDiagnostic(
    `chunk requestfailed: ${request.method()} ${request.url()} ${request.failure()?.errorText ?? ''}`
  );
});

page.on('pageerror', (error) => {
  const text = error.stack ?? error.message;
  if (/ChunkLoadError|Failed to load chunk/i.test(text)) {
    recordChunkDiagnostic(`chunk pageerror: ${text}`);
  }
});

page.on('console', (message) => {
  if (
    message.type() === 'error' &&
    /ChunkLoadError|Failed to load chunk|ERR_ABORTED\s+404/i.test(message.text())
  ) {
    recordChunkDiagnostic(`chunk console.error: ${message.text()}`);
  }
});

async function goto(path) {
  await page.goto(`${baseUrl}${path}`, {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  });
  await page.locator('main').first().waitFor({
    state: 'visible',
    timeout: 15_000,
  });
}

async function collectRoutes(indexPath, prefix) {
  await goto(indexPath);
  await page.waitForTimeout(500);

  const hrefs = await page
    .locator(`a[href^="${prefix}"]`)
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));

  return [...new Set(hrefs)]
    .filter((href) => typeof href === 'string')
    .filter((href) => href !== indexPath)
    .filter((href) => !href.includes('#'))
    .sort();
}

async function verifyClientRoutes(indexPath, routes) {
  for (const href of routes) {
    await goto(indexPath);

    const link = page.locator(`a[href="${href}"]`).first();
    await link.waitFor({ state: 'visible', timeout: 15_000 });
    await link.click();
    await page.waitForURL(`${baseUrl}${href}`, { timeout: 15_000 });
    await page.locator('main').first().waitFor({
      state: 'visible',
      timeout: 15_000,
    });
    await page.waitForTimeout(300);

    console.log(`OK chunk navigation ${indexPath} -> ${href}`);
  }
}

try {
  const blogRoutes = await collectRoutes('/blog', '/blog/');
  const componentRoutes = await collectRoutes('/components', '/components/');

  if (blogRoutes.length === 0) {
    throw new Error('No blog routes were discovered for chunk validation.');
  }
  if (componentRoutes.length === 0) {
    throw new Error('No component routes were discovered for chunk validation.');
  }

  console.log(`Discovered ${blogRoutes.length} blog routes for chunk validation.`);
  console.log(
    `Discovered ${componentRoutes.length} component routes for chunk validation.`
  );

  await verifyClientRoutes('/blog', blogRoutes);
  await verifyClientRoutes('/components', componentRoutes);

  if (chunkDiagnostics.length > 0) {
    throw new Error(
      `Cloudflare static chunk failures detected:\n${chunkDiagnostics.join('\n')}`
    );
  }
} catch (error) {
  console.error(`Cloudflare static chunk smoke failed at ${page.url()}`);
  console.error(error);
  for (const diagnostic of chunkDiagnostics) {
    console.error(diagnostic);
  }
  await browser.close();
  process.exit(1);
}

await browser.close();
console.log('OK Cloudflare static chunk integrity across discovered client routes');
