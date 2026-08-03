import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const rootDir = process.cwd();
const composePath = resolve(rootDir, 'compose.yaml');

function getInstalledPlaywrightVersion() {
    try {
        const output = execFileSync(
            'pnpm',
            [
                '--filter',
                '@vellira-ui/react-storybook',
                'exec',
                'playwright',
                '--version',
            ],
            {
                cwd: rootDir,
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'pipe'],
            }
        ).trim();

        const match = output.match(/Version\s+(\d+\.\d+\.\d+)/);

        if (!match) {
            throw new Error(`Unexpected Playwright version output: ${output}`);
        }

        return match[1];
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        throw new Error(`Unable to determine the Playwright version: ${message}`);
    }
}

function getDockerPlaywrightVersion() {
    const compose = readFileSync(composePath, 'utf8');

    const match = compose.match(
        /mcr\.microsoft\.com\/playwright:v(\d+\.\d+\.\d+)-noble/
    );

    if (!match) {
        throw new Error(
            'Unable to find a Playwright image such as ' +
            '`mcr.microsoft.com/playwright:v1.61.1-noble` in compose.yaml.'
        );
    }

    return match[1];
}

const installedVersion = getInstalledPlaywrightVersion();
const dockerVersion = getDockerPlaywrightVersion();

if (installedVersion !== dockerVersion) {
    console.error('');
    console.error('Playwright version mismatch.');
    console.error('');
    console.error(`Installed @playwright/test: ${installedVersion}`);
    console.error(`Docker image version:      ${dockerVersion}`);
    console.error('');
    console.error(
        `Update compose.yaml to use ` +
        `mcr.microsoft.com/playwright:v${installedVersion}-noble`
    );
    console.error('');

    process.exit(1);
}

console.log(
    `✓ Playwright versions are synchronized (${installedVersion})`
);