import { buildComponentQualityCompletionContract } from './completion-contract';
import { ComponentQualityRuntimeError } from './types';

type CliOptions = {
  componentName: string;
  platform: 'all' | 'web' | 'native';
};

function parseArgs(args: readonly string[]): CliOptions {
  let componentName: string | undefined;
  let platform: CliOptions['platform'] = 'all';

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--platform') {
      const value = args[index + 1];

      if (value !== 'web' && value !== 'native' && value !== 'all') {
        throw new ComponentQualityRuntimeError(
          'Expected --platform to be one of: web, native, all.'
        );
      }

      platform = value;
      index += 1;
      continue;
    }

    if (arg.startsWith('--')) {
      throw new ComponentQualityRuntimeError(`Unknown option "${arg}".`);
    }

    if (componentName) {
      throw new ComponentQualityRuntimeError(
        'Provide exactly one component name.'
      );
    }

    componentName = arg;
  }

  if (!componentName) {
    throw new ComponentQualityRuntimeError(
      'Provide exactly one component name.'
    );
  }

  return { componentName, platform };
}

export async function runCompletionContractCli(
  args: readonly string[],
  write: (message: string) => void = console.log,
  writeError: (message: string) => void = console.error,
  buildContract = buildComponentQualityCompletionContract
): Promise<number> {
  try {
    const options = parseArgs(args);
    const contract = await buildContract(options);

    write(JSON.stringify(contract, null, 2));
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    writeError(`Component Quality completion contract error: ${message}`);
    return 2;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = await runCompletionContractCli(process.argv.slice(2));
}
