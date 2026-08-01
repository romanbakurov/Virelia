#!/usr/bin/env node
import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const destinationArg = args[0];

if (!destinationArg) {
  console.error('Usage: sync-brand <destination-public-brand-dir>');
  process.exit(1);
}

const packageRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..'
);
const workspaceRoot = resolve(packageRoot, '..', '..');
const source = resolve(packageRoot, 'brand');
const destination = resolve(workspaceRoot, destinationArg);

if (!destination.startsWith(`${workspaceRoot}/`)) {
  console.error(
    `Destination must be inside the workspace: ${join(destinationArg)}`
  );
  process.exit(1);
}

await mkdir(dirname(destination), { recursive: true });
await rm(destination, { recursive: true, force: true });
await cp(source, destination, { recursive: true });
