import { runComponentCompletenessCli } from './cli';

try {
  runComponentCompletenessCli(process.argv.slice(2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));

  process.exitCode = 1;
}
