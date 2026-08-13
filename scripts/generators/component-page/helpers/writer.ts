import fs from 'node:fs';
import path from 'node:path';

export type FileWriter = {
  writeIfMissing(filePath: string, content: string): void;
  checkFailures: string[];
};

export function createFileWriter(params: {
  root: string;
  force: boolean;
  check: boolean;
}): FileWriter {
  const { root, force, check } = params;
  const checkFailures: string[] = [];

  return {
    checkFailures,
    writeIfMissing(filePath, content) {
      const exists = fs.existsSync(filePath);

      if (check) {
        const currentContent = exists
          ? fs.readFileSync(filePath, 'utf8')
          : null;

        if (currentContent !== content) {
          checkFailures.push(path.relative(root, filePath));
        }

        return;
      }

      if (exists && !force) {
        console.log(`⏭ Skipped existing: ${path.relative(root, filePath)}`);
        return;
      }

      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, content);

      console.log(
        `${exists ? '♻️ Updated' : '✅ Created'}: ${path.relative(root, filePath)}`
      );
    },
  };
}
