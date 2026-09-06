import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateTokenCss } from './token-css-output.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function writeFileIfChanged(filePath: string, content: string): void {
  const current = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, 'utf8')
    : '';

  if (current !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

const css = generateTokenCss();
const outputPaths = [
  path.resolve(__dirname, '../src/generated/tokens.css'),
  path.resolve(__dirname, '../dist/css/tokens.css'),
];

for (const outputPath of outputPaths) {
  fs.mkdirSync(path.dirname(outputPath), {
    recursive: true,
  });

  writeFileIfChanged(outputPath, css);
}

console.log('✅ tokens.css generated');

for (const outputPath of outputPaths) {
  console.log(outputPath);
}
