import { createBlogArticle } from './tooling';

function printUsage(): void {
  console.error('Usage: pnpm blog:new <slug>');
}

const args = process.argv.slice(2);

if (args.length !== 1) {
  printUsage();
  process.exit(1);
}

const [slug] = args;

if (slug === undefined) {
  printUsage();
  process.exit(1);
}

try {
  const result = await createBlogArticle({
    root: process.cwd(),
    slug,
    today: new Date().toISOString().slice(0, 10),
  });

  console.log(`Created Blog V1 draft: ${result.articleDirectory}`);
  console.log(`Metadata: ${result.metadataPath}`);
  console.log(`Article: ${result.articlePath}`);
  console.log(
    'The article remains draft:true until a reviewed commit publishes it.'
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
