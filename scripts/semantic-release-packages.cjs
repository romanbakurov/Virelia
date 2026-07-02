const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const publicPackages = [
  '@romanbakurov/vellira-core',
  '@romanbakurov/vellira-tokens',
  '@romanbakurov/vellira-types',
  '@romanbakurov/vellira-icons',
  '@romanbakurov/vellira-assets',
  '@romanbakurov/vellira-web',
  '@romanbakurov/vellira-native',
];

function updateVersion(packagePath, version) {
  const manifest = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  manifest.version = version;
  fs.writeFileSync(packagePath, `${JSON.stringify(manifest, null, 2)}\n`);
}

exports.prepare = async (_pluginConfig, context) => {
  updateVersion(path.resolve('package.json'), context.nextRelease.version);

  for (const packageName of publicPackages) {
    const directory = packageName.replace('@romanbakurov/', '');
    updateVersion(
      path.resolve('packages', directory, 'package.json'),
      context.nextRelease.version
    );
  }
};

exports.publish = async () => {
  for (const packageName of publicPackages) {
    execFileSync(
      'pnpm',
      [
        '--filter',
        packageName,
        'publish',
        '--no-git-checks',
        '--access',
        'public',
      ],
      {
        stdio: 'inherit',
      }
    );
  }
};
