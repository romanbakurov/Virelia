const fs = require('node:fs');

const version = process.argv[2];

if (!version) {
  console.error('Usage: node scripts/sync-package-versions.cjs <version>');
  process.exit(1);
}

const packageFiles = [
  'package.json',
  'packages/react/package.json',
  'packages/react-native/package.json',
  'packages/core/package.json',
  'packages/types/package.json',
  'packages/tokens/package.json',
  'packages/icons/package.json',
];

for (const file of packageFiles) {
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));

  pkg.version = version;

  fs.writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`${file} → ${version}`);
}
