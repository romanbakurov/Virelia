import { checkBlogCorpus } from './tooling';

if (process.argv.length > 2) {
  console.error('Usage: pnpm blog:check');
  process.exit(1);
}

const result = await checkBlogCorpus(process.cwd());

if (result.issues.length > 0) {
  console.error(`Blog V1 check failed with ${result.issues.length} issue(s):`);

  for (const issue of result.issues) {
    console.error(`- ${issue}`);
  }

  process.exit(1);
}

console.log(`Blog V1 check passed (${result.articleCount} article(s)).`);
