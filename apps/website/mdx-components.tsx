import type { MDXComponents } from 'mdx/types';

import { BlogCodeBlock } from './src/blog/ui/BlogCodeBlock';

const blogMDXComponents: MDXComponents = {
  pre: BlogCodeBlock,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...blogMDXComponents,
    ...components,
  };
}
