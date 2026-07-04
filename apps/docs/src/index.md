---
layout: home

hero:
  name: Vellira
  text: Cross-platform UI components for React and React Native.
  tagline: Accessible components, shared design tokens, and native rendering.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Component
      link: /component-examples
    - theme: alt
      text: GitHub
      link: https://github.com/vellira-dev/vellira
---

## Why Vellira

Vellira provides a consistent UI foundation for React and React Native while
keeping each renderer platform-native.

Tokens, interaction logic, and public APIs are shared. Rendering stays
platform-specific.

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
  <a class="docs-package-card" href="/icons">
    <strong>Icons</strong>
    <span>Cross-platform Icons</span>
    <code>@vellira-ui/icons</code>
  </a>
</div>


## Features

<div class="docs-feature-list">
  <div>Accessible components</div>
  <div>Shared design tokens</div>
  <div>React & React Native</div>
  <div>TypeScript-first APIs</div>
  <div>Tree-shakeable packages</div>
  <div>Automated CI/CD pipeline</div>
</div>

## Documentation Overview

Use the docs as the main path through the system.

| Goal                           | Page                                     |
|--------------------------------| ---------------------------------------- |
| Install and render a component | [Quick Start](/getting-started)          |
| Browse component               | [Component](/component-examples)  |
| Understand tokens              | [Theme Architecture](/theme-architecture) |
| Prepare for production         | [Production](/production)                |
| Use React DOM                  | [Web](/web)                              |
| Use React Native               | [Native](/native)                        |

## GitHub

Vellira is developed as a monorepo with package builds, tests, Storybook, smoke
checks, documentation builds, and release automation.

The repository includes Storybook, automated testing, semantic releases, and
fully automated npm publishing.

[Open GitHub Repository](https://github.com/vellira-dev/vellira)
