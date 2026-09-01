import type { ComponentType } from 'react';

export interface BlogArticleMetadata {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  draft: boolean;
  socialImage?: string;
}

export interface BlogArticle {
  metadata: BlogArticleMetadata;
  Content: ComponentType;
}
