---
layout: home

hero:
  name: Vellira
  text: Cross-platform design system for React and React Native apps.
  tagline: Shared tokens, stable APIs, platform-native rendering.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Component Gallery
      link: /component-examples
    - theme: alt
      text: GitHub
      link: https://github.com/romanbakurov/Vellira
---

## Why Vellira

Vellira keeps product interfaces consistent across Web and React Native without
forcing both renderers into the same implementation. Tokens, public contracts,
and interaction logic are shared. Rendering stays platform-specific.

<div class="docs-card-grid docs-card-grid-three">
  <a class="docs-card" href="/theme-architecture">
    <strong>Token architecture</strong>
    <span>Primitive colors flow into semantic tokens, component states, and renderer packages.</span>
  </a>
  <a class="docs-card" href="/component-examples">
    <strong>Component coverage</strong>
    <span>Button, Input, Checkbox, RadioGroup, Select, Dropdown, Tabs, Tooltip, and Modal.</span>
  </a>
  <a class="docs-card" href="/getting-started">
    <strong>Fast adoption</strong>
    <span>Install a renderer, import styles where needed, and render your first component.</span>
  </a>
  <a class="docs-card" href="/production">
    <strong>Production path</strong>
    <span>Use the install, theming, accessibility, quality, and deploy guidance before shipping.</span>
  </a>
</div>

## Quick Start

Install the Web renderer and import styles once in your app entry.

```bash
pnpm add @vellira-ui/react
```

```tsx
import '@vellira-ui/react/styles';

import { Button } from '@vellira-ui/react';

export function Example() {
  return <Button variant='primary'>Continue</Button>;
}
```

<p>
  <a class="docs-cta" href="/getting-started">Get Started</a>
</p>

## Packages

<div class="docs-card-grid docs-card-grid-three">
  <a class="docs-package-card" href="/web">
    <strong>Web</strong>
    <span>React</span>
    <code>@vellira-ui/react</code>
  </a>
  <a class="docs-package-card" href="/native">
    <strong>Native</strong>
    <span>React Native</span>
    <code>@vellira-ui/react-native</code>
  </a>
  <a class="docs-package-card" href="/tokens">
    <strong>Tokens</strong>
    <span>Design Tokens</span>
    <code>@vellira-ui/tokens</code>
  </a>
</div>

## Features

<div class="docs-feature-list">
  <div>Shared design tokens</div>
  <div>React and React Native renderers</div>
  <div>TypeScript-first public APIs</div>
  <div>Modular packages</div>
  <div>Tested components</div>
  <div>Automated releases</div>
</div>

## Documentation

Use the docs as the main path through the system.

| Goal                           | Page                                      |
| ------------------------------ | ----------------------------------------- |
| Install and render a component | [Quick Start](/getting-started)           |
| Browse component previews      | [Component Gallery](/component-examples)  |
| Understand tokens              | [Theme Architecture](/theme-architecture) |
| Prepare for production         | [Production](/production)                 |
| Use React DOM                  | [Web](/web)                               |
| Use React Native               | [Native](/native)                         |

## GitHub

Vellira is developed as a monorepo with package builds, tests, Storybook, smoke
checks, documentation builds, and release automation.

[Open GitHub Repository](https://github.com/romanbakurov/Vellira)
