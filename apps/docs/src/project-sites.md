# Vellira Ecosystem

Vellira is designed around three focused public surfaces. Each serves a single
purpose, keeping marketing, documentation, and component development separate.

| Domain                  | Purpose                                                    |
| ----------------------- | ---------------------------------------------------------- |
| `www.vellira.dev`       | Marketing site and landing page                            |
| `docs.vellira.dev`      | Product documentation, guides, API references, and theming |
| `storybook.vellira.dev` | Live component examples, states, and visual review         |

## Current State

The documentation currently lives in this repository as a VitePress site.
Interactive component examples are available through Storybook on Chromatic.

## Target Shape

```text
www.vellira.dev
  Landing page
  Features
  Getting started
  Calls to action

docs.vellira.dev
  Guides
  API reference
  Component documentation
  Theme architecture

storybook.vellira.dev
  Interactive components
  Visual states
  Accessibility review
  Regression testing
```

The recommended developer journey is:

1. Discover Vellira on the marketing site.
2. Learn the library through the documentation.
3. Explore live components and states in Storybook.
