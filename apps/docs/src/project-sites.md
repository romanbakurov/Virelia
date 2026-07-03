# Project Sites

Vellira can grow into three focused public surfaces. The goal is to keep each
site responsible for one job instead of mixing marketing, documentation, and
component review in the same place.

| Domain                  | Purpose                                                    |
| ----------------------- | ---------------------------------------------------------- |
| `www.vellira.dev`       | Marketing site and landing page                            |
| `docs.vellira.dev`      | Product documentation, guides, API references, and theming |
| `storybook.vellira.dev` | Live component examples, states, and visual review         |

## Current State

The documentation is currently developed as the VitePress app in this
repository. Storybook is available through Chromatic.

## Target Shape

```text
www.vellira.dev
  Landing page
  Product positioning
  Calls to action

docs.vellira.dev
  Quick Start
  Component docs
  Token architecture
  Package guides

storybook.vellira.dev
  Live stories
  Component states
  Visual regression review
```

This split keeps the developer path clear:

1. Discover Vellira on the marketing site.
2. Learn and integrate from the documentation site.
3. Inspect live component states in Storybook.
