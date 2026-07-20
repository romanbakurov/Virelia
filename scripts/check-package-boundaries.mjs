import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagesDir = path.join(root, 'packages');

const workspacePackages = new Map(
  readdirSync(packagesDir)
    .map((directory) => {
      const packageJsonPath = path.join(packagesDir, directory, 'package.json');

      if (!existsSync(packageJsonPath)) return null;

      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

      return [
        packageJson.name,
        {
          directory,
          root: path.join(packagesDir, directory),
          packageJsonPath,
        },
      ];
    })
    .filter(Boolean)
);

const allowedDependencies = {
  '@vellira-ui/types': [],
  '@vellira-ui/assets': [],
  '@vellira-ui/icons': ['@vellira-ui/types', '@vellira-ui/assets'],
  '@vellira-ui/tokens': ['@vellira-ui/types', '@vellira-ui/assets'],
  '@vellira-ui/core': [
    '@vellira-ui/types',
    '@vellira-ui/assets',
    '@vellira-ui/icons',
    '@vellira-ui/tokens',
  ],
  '@vellira-ui/react': [
    '@vellira-ui/types',
    '@vellira-ui/assets',
    '@vellira-ui/icons',
    '@vellira-ui/tokens',
    '@vellira-ui/core',
  ],
  '@vellira-ui/react-native': [
    '@vellira-ui/types',
    '@vellira-ui/assets',
    '@vellira-ui/icons',
    '@vellira-ui/tokens',
    '@vellira-ui/core',
  ],
};

const dependencyFields = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

const sourceExtensions = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.mts',
]);

const ignoredDirectories = new Set([
  'coverage',
  'dist',
  'node_modules',
  'storybook-static',
]);

const importPattern =
  /(?:import|export)\s+(?:type\s+)?(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

const violations = [];

function resolveWorkspacePackage(specifier) {
  if (!specifier.startsWith('@vellira-ui/')) return null;

  const [, packageName] =
    specifier.match(/^(@vellira-ui\/[^/]+)(?:\/.*)?$/) ?? [];

  return workspacePackages.has(packageName) ? packageName : null;
}

function isAllowed(sourcePackageName, targetPackageName) {
  if (sourcePackageName === targetPackageName) return true;

  return (
    allowedDependencies[sourcePackageName]?.includes(targetPackageName) ?? false
  );
}

function addViolation({
  sourcePackageName,
  targetPackageName,
  filePath,
  specifier,
  field,
}) {
  const relativePath = path.relative(root, filePath);
  const via = field ? `${field} dependency` : `import "${specifier}"`;

  violations.push(
    `${relativePath}: ${sourcePackageName} must not depend on ${targetPackageName} via ${via}`
  );
}

function checkPackageJson(sourcePackageName, packageInfo) {
  const packageJson = JSON.parse(readFileSync(packageInfo.packageJsonPath));

  for (const field of dependencyFields) {
    const dependencies = packageJson[field] ?? {};

    for (const dependencyName of Object.keys(dependencies)) {
      const targetPackageName = resolveWorkspacePackage(dependencyName);

      if (
        targetPackageName &&
        !isAllowed(sourcePackageName, targetPackageName)
      ) {
        addViolation({
          sourcePackageName,
          targetPackageName,
          filePath: packageInfo.packageJsonPath,
          specifier: dependencyName,
          field,
        });
      }
    }
  }
}

function walkFiles(directory, visit) {
  for (const entry of readdirSync(directory)) {
    if (ignoredDirectories.has(entry) || entry.startsWith('.')) continue;

    const entryPath = path.join(directory, entry);
    const stats = statSync(entryPath);

    if (stats.isDirectory()) {
      walkFiles(entryPath, visit);
      continue;
    }

    if (sourceExtensions.has(path.extname(entryPath))) {
      visit(entryPath);
    }
  }
}

function checkSourceImports(sourcePackageName, packageInfo) {
  walkFiles(packageInfo.root, (filePath) => {
    const source = readFileSync(filePath, 'utf8');

    for (const match of source.matchAll(importPattern)) {
      const specifier = match[1] ?? match[2];
      const targetPackageName = resolveWorkspacePackage(specifier);

      if (
        targetPackageName &&
        !isAllowed(sourcePackageName, targetPackageName)
      ) {
        addViolation({
          sourcePackageName,
          targetPackageName,
          filePath,
          specifier,
        });
      }
    }
  });
}

for (const [sourcePackageName, packageInfo] of workspacePackages) {
  if (!allowedDependencies[sourcePackageName]) continue;

  checkPackageJson(sourcePackageName, packageInfo);
  checkSourceImports(sourcePackageName, packageInfo);
}

if (violations.length > 0) {
  console.error('Package boundary check failed:');

  for (const violation of violations) {
    console.error(`- ${violation}`);
  }

  process.exit(1);
}

console.log('Package boundary check passed');
