# Component Page Generator

Builds website component catalog pages under
`apps/website/src/component-catalog`.

## Commands

```bash
pnpm create:component-page <Name> [--force] [--check]
pnpm component-pages:audit
pnpm component-pages:check
pnpm test:component-pages
```

## Pipeline

The generator keeps page generation convention-first:

```txt
source extraction
  -> profile conventions
  -> optional colocated metadata
  -> GeneratedPageModel
  -> renderers
  -> audit/check
```

Source facts such as props, types, JSDoc, defaults, platform support, and
owned/inherited API classification come from package source wherever possible.
Metadata files under `apps/website/src/component-catalog/components/<Component>/`
are optional and should only provide curated information that cannot be inferred
reliably, such as examples, related components, accessibility guidance, or
compound API section ordering.

## Boundaries

This subsystem may inspect runtime package source, but it should not import the
component scaffolding generator implementation. Renderers should consume the
normalized model rather than re-extracting source facts.

## Modules

- `create-component-page.ts` is the CLI/orchestrator.
- `extractors/` reads package source and TypeScript public props.
- `model/` resolves page input and builds `GeneratedPageModel`.
- `metadata/` loads and merges optional colocated component metadata.
- `profiles/` provides reusable convention defaults.
- `renderers/` turns the normalized model and derived artifacts into generated
  website files and registry updates.
- `helpers/` contains component-page-only formatting, paths, and file writing.
