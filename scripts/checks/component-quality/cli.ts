import type {
  ComponentQualityReportV1,
  ComponentQualityStatus,
} from '@vellira-ui/metadata';

import { runComponentQualityCheck } from './engine';
import { componentQualityRules } from './rules';
import { ComponentQualityRuntimeError } from './types';

type CliOptions = {
  componentName?: string;
  platform: 'all' | 'web' | 'native';
  json: boolean;
};

function parseArgs(args: readonly string[]): CliOptions {
  let componentName: string | undefined;
  let platform: CliOptions['platform'] = 'all';
  let json = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--all') continue;
    if (arg === '--json') {
      json = true;
      continue;
    }
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
        'Provide either one component name or --all.'
      );
    }
    componentName = arg;
  }

  return { componentName, platform, json };
}

function statusLabel(status: ComponentQualityStatus) {
  return status.toUpperCase();
}

function formatHumanReport(report: ComponentQualityReportV1) {
  const lines: string[] = [];

  for (const component of report.components) {
    lines.push(`${component.componentName}: ${statusLabel(component.status)}`);

    for (const platform of component.platforms) {
      lines.push(`  ${platform.platform}: ${statusLabel(platform.status)}`);

      if (platform.findings.length === 0) {
        lines.push('    No quality rules registered yet.');
        continue;
      }

      for (const finding of platform.findings) {
        const message = finding.message ? ` — ${finding.message}` : '';
        lines.push(
          `    [${statusLabel(finding.status)}] ${finding.ruleId}${message}`
        );
      }
    }
  }

  return lines.join('\n');
}

export async function runCli(
  args: readonly string[],
  write: (message: string) => void = console.log,
  writeError: (message: string) => void = console.error,
  runCheck = runComponentQualityCheck
): Promise<number> {
  try {
    const options = parseArgs(args);
    const result = await runCheck({
      ...options,
      rules: componentQualityRules,
    });

    write(
      options.json
        ? JSON.stringify(result.report, null, 2)
        : formatHumanReport(result.report)
    );

    return result.status === 'fail' ? 1 : 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    writeError(`Component Quality Checker error: ${message}`);
    return 2;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = await runCli(process.argv.slice(2));
}
