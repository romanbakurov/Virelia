const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const publicPackages = [
  '@vellira-ui/core',
  '@vellira-ui/tokens',
  '@vellira-ui/types',
  '@vellira-ui/icons',
  '@vellira-ui/react',
  '@vellira-ui/react-native',
];

const registry = 'https://registry.npmjs.org/';
const publishConcurrency = Number.parseInt(
  process.env.VELLIRA_RELEASE_PUBLISH_CONCURRENCY ?? '3',
  10
);
const publishRetries = Number.parseInt(
  process.env.VELLIRA_RELEASE_PUBLISH_RETRIES ?? '2',
  10
);
const minimumTrustedPublishingNpmVersion = '11.5.1';

function getPackageDirectory(packageName) {
  return path.resolve('packages', packageName.replace('@vellira-ui/', ''));
}

function getPackageManifestPath(packageName) {
  return path.join(getPackageDirectory(packageName), 'package.json');
}

function readManifest(packagePath) {
  return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
}

function updateVersion(packagePath, version) {
  const manifest = readManifest(packagePath);
  manifest.version = version;
  fs.writeFileSync(packagePath, `${JSON.stringify(manifest, null, 2)}\n`);
}

function compareVersions(left, right) {
  const leftParts = left.split('.').map((part) => Number.parseInt(part, 10));
  const rightParts = right.split('.').map((part) => Number.parseInt(part, 10));

  for (let index = 0; index < 3; index += 1) {
    const leftPart = leftParts[index] ?? 0;
    const rightPart = rightParts[index] ?? 0;

    if (leftPart > rightPart) return 1;
    if (leftPart < rightPart) return -1;
  }

  return 0;
}

function getNpmVersion() {
  const result = spawnSync('npm', ['--version'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      `Unable to read npm version: npm exited with status ${result.status}`
    );
  }

  return result.stdout.trim();
}

function assertTrustedPublishingEnvironment() {
  if (process.env.GITHUB_ACTIONS !== 'true') {
    throw new Error(
      'npm Trusted Publishing must run from GitHub Actions with OIDC enabled.'
    );
  }

  if (
    !process.env.ACTIONS_ID_TOKEN_REQUEST_URL ||
    !process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN
  ) {
    throw new Error(
      'GitHub Actions OIDC environment is missing. Keep `id-token: write` on the release workflow.'
    );
  }

  if (process.env.NODE_AUTH_TOKEN) {
    throw new Error(
      'NODE_AUTH_TOKEN must not be set for Trusted Publishing. npm should authenticate through OIDC provenance.'
    );
  }

  const npmVersion = getNpmVersion();

  if (compareVersions(npmVersion, minimumTrustedPublishingNpmVersion) === -1) {
    throw new Error(
      `npm ${minimumTrustedPublishingNpmVersion} or newer is required for Trusted Publishing. Found ${npmVersion}.`
    );
  }
}

function createPackageInfo(packageName) {
  const directory = getPackageDirectory(packageName);
  const manifestPath = getPackageManifestPath(packageName);
  const manifest = readManifest(manifestPath);

  if (manifest.name !== packageName) {
    throw new Error(
      `Expected ${manifestPath} to describe ${packageName}, found ${manifest.name}.`
    );
  }

  if (manifest.private) {
    throw new Error(
      `${packageName} is marked private and cannot be published.`
    );
  }

  if (manifest.publishConfig?.access !== 'public') {
    throw new Error(
      `${packageName} must declare publishConfig.access: "public".`
    );
  }

  return {
    name: packageName,
    version: manifest.version,
    directory,
    relativeDirectory: `.${path.sep}${path.relative(process.cwd(), directory)}`,
  };
}

function isAlreadyPublishedError(output) {
  return (
    output.includes('cannot publish over the previously published versions') ||
    output.includes(
      'You cannot publish over the previously published versions'
    ) ||
    output.includes('previously published versions') ||
    output.includes('EPUBLISHCONFLICT') ||
    output.includes('code E409')
  );
}

function isRetryablePublishError(output) {
  return [
    'ECONNRESET',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'EAI_AGAIN',
    'ENOTFOUND',
    'socket hang up',
    'Service Unavailable',
    'Gateway Timeout',
    'Too Many Requests',
    'code E429',
    'code E500',
    'code E502',
    'code E503',
    'code E504',
  ].some((pattern) => output.includes(pattern));
}

function runNpmPublish(packageInfo) {
  const args = [
    'publish',
    packageInfo.relativeDirectory,
    '--access',
    'public',
    '--registry',
    registry,
    '--provenance',
  ];

  return new Promise((resolve) => {
    const child = spawn('npm', args, {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    child.on('error', (error) => {
      resolve({ error, status: null, stdout, stderr });
    });

    child.on('close', (status) => {
      resolve({ error: null, status, stdout, stderr });
    });
  });
}

function runNpmViewDist(packageInfo) {
  const args = [
    'view',
    `${packageInfo.name}@${packageInfo.version}`,
    'dist',
    '--json',
    '--registry',
    registry,
  ];

  return new Promise((resolve) => {
    const child = spawn('npm', args, {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    child.on('error', (error) => {
      resolve({ error, status: null, stdout, stderr });
    });

    child.on('close', (status) => {
      resolve({ error: null, status, stdout, stderr });
    });
  });
}

function writeCommandOutput(packageName, result) {
  if (result.stdout) {
    process.stdout.write(`[${packageName}] stdout\n${result.stdout}`);
  }

  if (result.stderr) {
    process.stderr.write(`[${packageName}] stderr\n${result.stderr}`);
  }
}

function formatDuration(startedAt) {
  return `${((Date.now() - startedAt) / 1000).toFixed(1)}s`;
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function verifyPublishedPackage(packageInfo) {
  const maxAttempts = publishRetries + 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = await runNpmViewDist(packageInfo);
    const output = `${result.stdout}\n${result.stderr}`;

    if (!result.error && result.status === 0) {
      let dist;

      try {
        dist = JSON.parse(result.stdout);
      } catch (error) {
        throw new Error(
          `Unable to parse npm registry metadata for ${packageInfo.name}@${packageInfo.version}: ${error.message}`
        );
      }

      if (!dist?.integrity || !dist?.tarball) {
        throw new Error(
          `npm registry metadata for ${packageInfo.name}@${packageInfo.version} is missing tarball integrity.`
        );
      }

      if (!dist?.attestations) {
        if (attempt < maxAttempts) {
          console.warn(
            `[release] ${packageInfo.name} provenance metadata is not visible yet; retrying.`
          );
          await wait(1000 * attempt);
          continue;
        }

        throw new Error(
          `npm registry metadata for ${packageInfo.name}@${packageInfo.version} is missing provenance attestations.`
        );
      }

      console.log(
        `[release] Verified npm provenance metadata for ${packageInfo.name}@${packageInfo.version}.`
      );

      return;
    }

    const retryable = result.error || isRetryablePublishError(output);

    if (!retryable || attempt === maxAttempts) {
      writeCommandOutput(packageInfo.name, result);
      const reason = result.error
        ? result.error.message
        : `npm view exited with status ${result.status}`;

      throw new Error(
        `Failed to verify ${packageInfo.name}@${packageInfo.version}: ${reason}`
      );
    }

    console.warn(
      `[release] ${packageInfo.name} provenance verification attempt ${attempt}/${maxAttempts} failed; retrying.`
    );
    await wait(1000 * attempt);
  }
}

async function publishPackage(packageInfo) {
  const startedAt = Date.now();
  const maxAttempts = publishRetries + 1;

  console.log(
    `[release] Publishing ${packageInfo.name}@${packageInfo.version} with npm provenance.`
  );

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const attemptPrefix = `[release] ${packageInfo.name} attempt ${attempt}/${maxAttempts}`;
    console.log(`${attemptPrefix} started.`);

    const result = await runNpmPublish(packageInfo);
    const output = `${result.stdout}\n${result.stderr}`;

    if (!result.error && result.status === 0) {
      writeCommandOutput(packageInfo.name, result);

      try {
        await verifyPublishedPackage(packageInfo);
      } catch (error) {
        return {
          packageName: packageInfo.name,
          version: packageInfo.version,
          status: 'failed',
          provenance: 'not verified',
          attempts: attempt,
          duration: formatDuration(startedAt),
          error,
        };
      }

      console.log(
        `[release] Published ${packageInfo.name}@${packageInfo.version} in ${formatDuration(startedAt)}.`
      );

      return {
        packageName: packageInfo.name,
        version: packageInfo.version,
        status: 'published',
        provenance: 'verified',
        attempts: attempt,
        duration: formatDuration(startedAt),
      };
    }

    if (isAlreadyPublishedError(output)) {
      writeCommandOutput(packageInfo.name, result);

      try {
        await verifyPublishedPackage(packageInfo);
      } catch (error) {
        return {
          packageName: packageInfo.name,
          version: packageInfo.version,
          status: 'failed',
          provenance: 'not verified',
          attempts: attempt,
          duration: formatDuration(startedAt),
          error,
        };
      }

      console.log(
        `[release] ${packageInfo.name}@${packageInfo.version} is already published; continuing.`
      );

      return {
        packageName: packageInfo.name,
        version: packageInfo.version,
        status: 'already published',
        provenance: 'verified',
        attempts: attempt,
        duration: formatDuration(startedAt),
      };
    }

    const retryable = result.error || isRetryablePublishError(output);

    if (!retryable || attempt === maxAttempts) {
      writeCommandOutput(packageInfo.name, result);
      const reason = result.error
        ? result.error.message
        : `npm exited with status ${result.status}`;

      return {
        packageName: packageInfo.name,
        version: packageInfo.version,
        status: 'failed',
        provenance: 'not verified',
        attempts: attempt,
        duration: formatDuration(startedAt),
        error: new Error(`Failed to publish ${packageInfo.name}: ${reason}`),
      };
    }

    console.warn(
      `${attemptPrefix} failed with a transient npm error; retrying.`
    );
    await wait(1000 * attempt);
  }

  throw new Error(`Unexpected publish loop exit for ${packageInfo.name}.`);
}

async function publishPackages(packageInfos) {
  const queue = [...packageInfos];
  const summaries = [];
  const workers = Array.from(
    { length: Math.min(publishConcurrency, queue.length) },
    async () => {
      while (queue.length > 0) {
        const packageInfo = queue.shift();
        summaries.push(await publishPackage(packageInfo));
      }
    }
  );

  await Promise.all(workers);

  return summaries.sort(
    (left, right) =>
      packageInfos.findIndex(
        (packageInfo) => packageInfo.name === left.packageName
      ) -
      packageInfos.findIndex(
        (packageInfo) => packageInfo.name === right.packageName
      )
  );
}

function printPublishSummary(summaries) {
  console.log('\n[release] npm publish summary');
  console.log('Package | Version | Status | Provenance | Attempts | Duration');
  console.log('--- | --- | --- | --- | --- | ---');

  for (const summary of summaries) {
    console.log(
      `${summary.packageName} | ${summary.version} | ${summary.status} | ${summary.provenance} | ${summary.attempts} | ${summary.duration}`
    );
  }
}

exports.prepare = async (_pluginConfig, context) => {
  updateVersion(path.resolve('package.json'), context.nextRelease.version);

  for (const packageName of publicPackages) {
    updateVersion(
      getPackageManifestPath(packageName),
      context.nextRelease.version
    );
  }
};

exports.publish = async () => {
  if (!Number.isInteger(publishConcurrency) || publishConcurrency < 1) {
    throw new Error(
      'VELLIRA_RELEASE_PUBLISH_CONCURRENCY must be a positive integer.'
    );
  }

  if (!Number.isInteger(publishRetries) || publishRetries < 0) {
    throw new Error('VELLIRA_RELEASE_PUBLISH_RETRIES must be zero or greater.');
  }

  assertTrustedPublishingEnvironment();

  const packageInfos = publicPackages.map(createPackageInfo);
  const summaries = await publishPackages(packageInfos);
  printPublishSummary(summaries);

  const failures = summaries.filter((summary) => summary.error);

  if (failures.length > 0) {
    throw new Error(
      `Failed to publish ${failures.length} package(s): ${failures
        .map((summary) => summary.packageName)
        .join(', ')}`
    );
  }
};
