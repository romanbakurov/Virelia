// packages/tokens/scripts/generate-color-preview.ts
import fs from 'node:fs';
import path from 'node:path';

import { colors } from '../src/primitives/colors.js';

const outputPath = path.resolve(
  process.cwd(),
  'src/generated/color-preview.ts'
);

let content = `/**
 * AUTO-GENERATED FILE
 * DO NOT EDIT MANUALLY
 */

export const colorPreview = {
`;

for (const [groupName, group] of Object.entries(colors)) {
  for (const [shade, value] of Object.entries(group)) {
    content += `  '${groupName}.${shade}': '${value}',\n`;
  }
}

content += `} as const;\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, content, 'utf8');

console.log('✅ color-preview.ts generated');
