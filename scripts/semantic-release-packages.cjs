const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const publicPackages = [
  '@vellira-ui/core',
  '@vellira-ui/tokens',
  '@vellira-ui/types',
  '@vellira-ui/icons',
  '@vellira-ui/assets',
  '@vellira-ui/react',
  '@vellira-ui/react-native',
];

function updateVersion(packagePath, version) {
  const manifest = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  manifest.version = version;
  fs.writeFileSync(packagePath, `${JSON.stringify(manifest, null, 2)}\n`);
}

exports.prepare = async (_pluginConfig, context) => {
  updateVersion(path.resolve('package.json'), context.nextRelease.version);

  for (const packageName of publicPackages) {
    const directory = packageName.replace('@vellira-ui/', '');
    updateVersion(
      path.resolve('packages', directory, 'package.json'),
      context.nextRelease.version
    );
  }
};

exports.publish = async () => {
  for (const packageName of publicPackages) {
    const args = [
      '--filter',
      packageName,
      'publish',
      '--no-git-checks',
      '--access',
      'public',
      '--registry',
      'https://registry.npmjs.org/',
    ];

    console.log(`Publishing ${packageName} to npm...`);

    const result = spawnSync('pnpm', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    if (result.stdout) {
      process.stdout.write(result.stdout);
    }

    if (result.stderr) {
      process.stderr.write(result.stderr);
    }

    if (result.error) {
      throw result.error;
    }

    if (result.status !== 0) {
      throw new Error(
        `Failed to publish ${packageName}: pnpm exited with status ${result.status}`
      );
    }
  }
};
