import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { runComponentProduction } from './run';

const COMPONENT_PRODUCTION_CLI_SCHEMA_VERSION = '1' as const;

type ComponentProductionCliOptions = {
  specFile: string;
};

export type ComponentProductionCliDependencies = {
  root?: string;
  readFile?: (filePath: string) => string;
  runProduction?: typeof runComponentProduction;
  write?: (message: string) => void;
  writeError?: (message: string) => void;
};

export async function runComponentProductionCli(
  args: readonly string[],
  dependencies: ComponentProductionCliDependencies = {}
): Promise<number> {
  const write = dependencies.write ?? console.log;
  const writeError = dependencies.writeError ?? console.error;

  try {
    const options = parseArgs(args);
    const root = path.resolve(dependencies.root ?? process.cwd());

    const readFile =
      dependencies.readFile ??
      ((filePath: string) => fs.readFileSync(filePath, 'utf8'));

    const runProduction = dependencies.runProduction ?? runComponentProduction;

    const specPath = path.resolve(root, options.specFile);

    let rawInput: unknown;

    try {
      rawInput = JSON.parse(readFile(specPath));
    } catch (error) {
      throw new Error(
        `Unable to read component production specification "${options.specFile}": ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    const result = await runProduction({
      root,
      input: rawInput,
    });

    write(JSON.stringify(result, null, 2));

    if (
      result.status === 'ready' ||
      (result.status === 'blocked' &&
        result.lifecycle.current === 'semantic-completion-required')
    ) {
      return 0;
    }

    if (result.status === 'blocked') {
      return 1;
    }

    return 2;
  } catch (error) {
    writeError(
      JSON.stringify(
        {
          schemaVersion: COMPONENT_PRODUCTION_CLI_SCHEMA_VERSION,
          status: 'error',
          error: {
            message: error instanceof Error ? error.message : String(error),
          },
        },
        null,
        2
      )
    );

    return 2;
  }
}

function parseArgs(args: readonly string[]): ComponentProductionCliOptions {
  let specFile: string | undefined;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--spec') {
      const value = args[index + 1];

      if (!value || value.startsWith('--')) {
        throw new Error('Expected a file path after --spec.');
      }

      if (specFile) {
        throw new Error('Provide --spec exactly once.');
      }

      specFile = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown component production option "${arg}".`);
  }

  if (!specFile) {
    throw new Error(
      'Usage: pnpm component-production:json --spec <component-spec.json>'
    );
  }

  return {
    specFile,
  };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  process.exitCode = await runComponentProductionCli(process.argv.slice(2));
}
