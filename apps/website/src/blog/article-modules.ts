import type { ComponentType } from 'react';

export interface BlogMDXModule {
  default: ComponentType;
}

export type BlogMDXModuleLoader = () => Promise<BlogMDXModule>;

/**
 * Keep MDX imports statically analyzable for Next.js/Turbopack.
 *
 * #649 will automate updates to this registry when generating articles.
 */
const blogArticleModuleLoaders: Readonly<Record<string, BlogMDXModuleLoader>> =
  {};

export function getBlogArticleModuleLoader(
  slug: string
): BlogMDXModuleLoader | null {
  return blogArticleModuleLoaders[slug] ?? null;
}
