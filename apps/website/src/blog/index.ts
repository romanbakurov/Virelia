import { getBlogArticleModuleLoader } from './article-modules';
import { getPublishedBlogArticleMetadata } from './store';
import type { BlogArticle } from './types';

export {
  getPublishedBlogArticleMetadata,
  getPublishedBlogArticles,
} from './store';
export type { BlogArticle, BlogArticleMetadata } from './types';

export async function getPublishedBlogArticle(
  slug: string
): Promise<BlogArticle | null> {
  const metadata = await getPublishedBlogArticleMetadata(slug);

  if (metadata === null) {
    return null;
  }

  const loadModule = getBlogArticleModuleLoader(metadata.slug);

  if (loadModule === null) {
    throw new Error(
      `Blog article ${metadata.slug}: MDX module is not registered`
    );
  }

  const module = await loadModule();

  if (typeof module.default !== 'function') {
    throw new Error(
      `Blog article ${metadata.slug}: MDX module has no default component export`
    );
  }

  return {
    metadata,
    Content: module.default,
  };
}
