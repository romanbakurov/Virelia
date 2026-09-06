import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8')
);
const playwrightVersion = packageJson.devDependencies?.['@playwright/test'];

if (!/^\d+\.\d+\.\d+$/.test(playwrightVersion ?? '')) {
  console.error(
    'Canonical visual environment requires an exact @playwright/test version.'
  );
  process.exit(1);
}

const expectedEnvironment = `playwright-v${playwrightVersion}-noble`;
const errors = [];

if (process.env.VELLIRA_VISUAL_ENVIRONMENT !== expectedEnvironment) {
  errors.push(
    `VELLIRA_VISUAL_ENVIRONMENT must be ${expectedEnvironment}. Run the canonical Docker visual command instead of host-native snapshots.`
  );
}

if (process.platform !== 'linux') {
  errors.push(`visual snapshots require Linux; received ${process.platform}`);
}

if (process.arch !== 'x64') {
  errors.push(`visual snapshots require linux/amd64; received ${process.arch}`);
}

let osRelease = '';

try {
  osRelease = readFileSync('/etc/os-release', 'utf8');
} catch {
  errors.push('unable to read /etc/os-release from the visual environment');
}

if (
  osRelease &&
  !/(?:VERSION_CODENAME|UBUNTU_CODENAME)=noble(?:\n|$)/.test(osRelease)
) {
  errors.push('visual snapshots require the pinned Ubuntu noble environment');
}

if (errors.length > 0) {
  console.error('Canonical visual environment check failed:');

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log(
  `✓ Canonical visual environment: ${expectedEnvironment} (${process.platform}/${process.arch}, Node ${process.version})`
);
