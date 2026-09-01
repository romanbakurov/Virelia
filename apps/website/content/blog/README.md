# Vellira Engineering Blog content

Blog V1 keeps article source in Git and deliberately separates structured metadata from the MDX body.

## Canonical article structure

Each article owns one slug directory:

```text
apps/website/content/blog/<slug>/
  metadata.json
  article.mdx
```

The directory name is the canonical slug and must exactly match `metadata.json#slug`.

Metadata lives in JSON rather than YAML frontmatter so listing, validation, SEO tooling, and future automation can inspect article facts without compiling or rendering MDX. The article body remains MDX for normal Markdown authoring and controlled React component support.

## Metadata contract V1

```json
{
  "title": "Building cross-platform component APIs",
  "description": "A practical look at sharing component contracts across React and React Native.",
  "slug": "building-cross-platform-component-apis",
  "publishedAt": "2026-09-01",
  "updatedAt": "2026-09-02",
  "author": "Roman Bakurov",
  "tags": ["Design Systems", "React Native"],
  "draft": true,
  "socialImage": "/blog/building-cross-platform-component-apis.png"
}
```

Required fields:

- `title`: non-empty string
- `description`: non-empty string
- `slug`: lowercase letters/numbers separated by single hyphens
- `publishedAt`: valid `YYYY-MM-DD` calendar date
- `author`: non-empty string
- `tags`: non-empty array of unique, non-empty strings
- `draft`: boolean

Optional fields:

- `updatedAt`: valid `YYYY-MM-DD`, not earlier than `publishedAt`
- `socialImage`: non-empty string reference

Unknown fields fail validation. Blog V1 intentionally has no generic content schema or category taxonomy.

## Draft and publication semantics

`draft: true` is fail-safe: draft metadata is never returned by the public discovery helpers and a draft slug cannot be loaded through the published-article API.

Publishing requires an explicit change to `draft: false` in a reviewed commit. Invalid or ambiguous metadata throws instead of being treated as published content.

## Content access boundary

Rendering code must import the typed API from `apps/website/src/blog` rather than reading the filesystem or parsing metadata itself.

The public server-side surface is intentionally small:

- `getPublishedBlogArticles()` — list published metadata in deterministic newest-first order
- `getPublishedBlogArticleMetadata(slug)` — load published metadata without compiling the body
- `getPublishedBlogArticle(slug)` — load published metadata and the MDX component

Filesystem and JSON details stay behind this boundary. Blog V1 does **not** introduce a generic repository/provider abstraction, CMS adapter, or backend interface. If a real product requirement later moves storage to a backend/content API, that migration should happen behind these helpers rather than leaking storage concerns into routes and rendering.

MDX module imports are kept in `apps/website/src/blog/article-modules.ts`. The registry uses literal import paths so Next.js/Turbopack can analyze article modules deterministically, including when the repository contains zero published articles. This registry is implementation wiring rather than a second content source of truth; #649 is expected to maintain it automatically when article generation is added.

## Creating an article manually

Until the Blog V1 generator from #649 exists:

1. Create `apps/website/content/blog/<slug>/`.
2. Add a valid `metadata.json` with `draft: true` while writing.
3. Add the body in `article.mdx`.
4. Add the article's literal MDX import loader to `apps/website/src/blog/article-modules.ts`.
5. Run focused tooling tests plus the website typecheck/build.
6. Open a pull request and review the rendered result once the Blog V1 routes exist.
7. Change `draft` to `false` only when the article is intentionally ready to publish.
8. Merge the reviewed pull request to publish.

## Automation boundary

Later automation may rely on:

- one directory per canonical slug;
- stable filenames `metadata.json` and `article.mdx`;
- the metadata contract above;
- invalid metadata failing closed;
- draft content being excluded from published helpers;
- Git review remaining the publication boundary.

The intended future flow is:

```text
idea / research
→ article draft
→ branch
→ Draft PR
→ deterministic checks
→ human review
→ merge
→ publish
```

AI-assisted tooling may create or edit a draft in a branch later, but Blog V1 does not provide a path for an LLM to publish directly to production.
