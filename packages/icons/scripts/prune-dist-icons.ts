import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SOURCE_ICONS = path.join(ROOT, 'src/generated');
const DIST_ICONS = path.join(ROOT, 'dist/generated');
const DIST_EXTENSIONS = ['.js', '.js.map', '.d.ts', '.d.ts.map'];

if (fs.existsSync(SOURCE_ICONS) && fs.existsSync(DIST_ICONS)) {
  const expectedDistFiles = new Set<string>();

  for (const sourceFile of fs.readdirSync(SOURCE_ICONS)) {
    if (!sourceFile.endsWith('.tsx')) continue;

    const distBaseName = sourceFile.replace(/\.tsx$/, '');

    for (const extension of DIST_EXTENSIONS) {
      expectedDistFiles.add(`${distBaseName}${extension}`);
    }
  }

  for (const distFile of fs.readdirSync(DIST_ICONS)) {
    if (!expectedDistFiles.has(distFile)) {
      fs.rmSync(path.join(DIST_ICONS, distFile), { force: true });
    }
  }
}
