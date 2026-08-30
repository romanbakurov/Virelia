import fs from 'node:fs';

import type { ComponentGenerationTarget } from './plan';

const runtimeExportExpectationPattern =
  /expect\(Object\.keys\(api\)\.sort\(\)\)\.toEqual\(\[\n([\s\S]*?)\n {4}\]\);/;

function readRuntimeExportExpectation(publicApiTestFile: string) {
  if (!fs.existsSync(publicApiTestFile)) {
    throw new Error(`Missing public API contract test: ${publicApiTestFile}`);
  }

  const content = fs.readFileSync(publicApiTestFile, 'utf8');
  const match = runtimeExportExpectationPattern.exec(content);

  if (!match) {
    throw new Error(
      `Unable to locate runtime export expectation in ${publicApiTestFile}`
    );
  }

  const entries = [...match[1].matchAll(/ {6}'([^']+)',/g)].map(
    (entry) => entry[1]
  );

  if (entries.length === 0) {
    throw new Error(
      `Runtime export expectation is empty or invalid in ${publicApiTestFile}`
    );
  }

  return {
    content,
    entries,
  };
}

export function renderSynchronizedPublicApiContract(params: {
  componentName: string;
  publicApiTestFile: string;
}) {
  const { componentName, publicApiTestFile } = params;
  const { content, entries } = readRuntimeExportExpectation(publicApiTestFile);

  if (entries.includes(componentName)) {
    return content;
  }

  const nextEntries = [...entries, componentName].sort();
  const nextExpectation = `expect(Object.keys(api).sort()).toEqual([\n${nextEntries
    .map((entry) => `      '${entry}',`)
    .join('\n')}\n    ]);`;

  return content.replace(runtimeExportExpectationPattern, nextExpectation);
}

export function checkPublicApiContractSynchronization(params: {
  componentName: string;
  targets: readonly ComponentGenerationTarget[];
}) {
  const driftedFiles: string[] = [];

  for (const target of params.targets) {
    const current = fs.existsSync(target.publicApiTestFile)
      ? fs.readFileSync(target.publicApiTestFile, 'utf8')
      : '';

    const expected = renderSynchronizedPublicApiContract({
      componentName: params.componentName,
      publicApiTestFile: target.publicApiTestFile,
    });

    if (current !== expected) {
      driftedFiles.push(target.publicApiTestFile);
    }
  }

  return driftedFiles;
}
