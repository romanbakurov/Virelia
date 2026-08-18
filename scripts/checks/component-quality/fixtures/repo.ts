import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export function createFixtureRepo() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'vellira-quality-'));
}

export function writeFixtureFile(
  rootDir: string,
  relativePath: string,
  content: string
) {
  const filePath = path.join(rootDir, relativePath);

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);

  return filePath;
}

export function removeFixtureRepo(rootDir: string) {
  fs.rmSync(rootDir, { recursive: true, force: true });
}
