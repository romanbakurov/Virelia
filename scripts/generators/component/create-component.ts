import { parseComponentGeneratorArgs } from './cli';
import { runComponentGenerator } from './run';

let options;

try {
  options = parseComponentGeneratorArgs(process.argv.slice(2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

try {
  const result = runComponentGenerator({
    root: process.cwd(),
    options,
  });

  for (const target of result.plan.targets) {
    console.log(
      `✅ Created ${target.packageName} ${result.plan.layer}/${result.plan.componentName}`
    );
  }

  console.log(
    `Generated ${result.createdFiles.length} files and updated ${result.updatedFiles.length} exports.`
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
