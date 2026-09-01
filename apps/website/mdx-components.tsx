import type { MDXComponents } from 'mdx/types';

const blogMDXComponents: MDXComponents = {};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...blogMDXComponents,
    ...components,
  };
}
