import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

import {
  tokenMigrationManifestV1,
  tokenPreservationBaselineRevisionV1,
} from '../src/preservation/token-migrations.js';

import {
  createTokenPreservationBaseline,
  type TokenPreservationBaselineV1,
  verifyTokenPreservation,
} from './token-preservation.js';

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const baselinePath = path.join(
  packageRoot,
  'src',
  'preservation',
  'token-preservation-baseline.v1.json'
);

const checkMode = process.argv.includes('--check');
const writeMode = process.argv.includes('--write');
const forceReset = process.argv.includes('--force-reset');

function serializeBaseline(baseline: TokenPreservationBaselineV1): string {
  return `${JSON.stringify(baseline, null, 2)}\n`;
}

function printBootstrapCandidate(): void {
  const candidate = serializeBaseline(
    createTokenPreservationBaseline(tokenPreservationBaselineRevisionV1)
  );
  const compressed = gzipSync(candidate).toString('base64');
  const wrapped = compressed.match(/.{1,120}/g)?.join('\n') ?? compressed;

  console.error(
    'Token preservation baseline is missing. Bootstrap candidate follows as gzip+base64.'
  );
  console.error('TOKEN_PRESERVATION_BASELINE_GZIP_BASE64_BEGIN');
  console.error(wrapped);
  console.error('TOKEN_PRESERVATION_BASELINE_GZIP_BASE64_END');
  console.error(
    'Decode the payload and commit it at src/preservation/token-preservation-baseline.v1.json.'
  );
}

if (writeMode) {
  if (fs.existsSync(baselinePath) && !forceReset) {
    console.error(
      'Refusing to overwrite the committed token preservation baseline. Existing baselines are immutable during normal token work.'
    );
    console.error(
      'Use migration evidence for token changes. A deliberate reviewed baseline reset requires --force-reset.'
    );
    process.exit(1);
  }

  const baseline = createTokenPreservationBaseline(
    tokenPreservationBaselineRevisionV1
  );

  fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
  fs.writeFileSync(baselinePath, serializeBaseline(baseline), 'utf8');
  console.log(`✅ wrote token preservation baseline: ${baselinePath}`);
  process.exit(0);
}

if (!checkMode) {
  console.error('Use --check to verify or --write to bootstrap the baseline.');
  process.exit(1);
}

if (!fs.existsSync(baselinePath)) {
  printBootstrapCandidate();
  process.exit(1);
}

let baseline: TokenPreservationBaselineV1;

try {
  baseline = JSON.parse(
    fs.readFileSync(baselinePath, 'utf8')
  ) as TokenPreservationBaselineV1;
} catch (error) {
  console.error(
    `Token preservation baseline is unreadable: ${
      error instanceof Error ? error.message : String(error)
    }`
  );
  process.exit(1);
}

const findings = verifyTokenPreservation({
  baseline,
  manifest: tokenMigrationManifestV1,
  expectedSourceRevision: tokenPreservationBaselineRevisionV1,
});

if (findings.length > 0) {
  console.error(
    `Token preservation failed with ${findings.length} finding(s):`
  );

  for (const finding of findings.slice(0, 100)) {
    const location = [finding.theme, finding.platform, finding.path]
      .filter(Boolean)
      .join(':');
    console.error(
      `- ${finding.rule}${location ? ` [${location}]` : ''}: ${finding.message}`
    );
  }

  if (findings.length > 100) {
    console.error(`- ... ${findings.length - 100} additional finding(s)`);
  }

  process.exit(1);
}

console.log('✅ token preservation baseline matches resolved token outputs');
