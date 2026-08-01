# Vellira

<p align="center">
  <img src="./packages/assets/brand/logos/logo-gradient.svg" alt="Vellira" width="120" />
</p>

<p align="center">
  <strong>Build once. Stay consistent everywhere.</strong><br/>
  Build consistent interfaces across <strong>React</strong> and <strong>React Native</strong> with shared design tokens, reusable logic and platform-specific components.
</p>

<p align="center">
MIT Licensed • TypeScript First • Open Source
</p>

<p align="center">
Accessibility Minded • Cross Platform • Modular
</p>

<p align="center">
  <a href="https://vellira.dev">Website</a>
  •
  <a href="https://docs.vellira.dev">Documentation</a>
  •
  <a href="https://storybook.vellira.dev">Storybook</a>
  •
  <a href="https://github.com/vellira-dev/vellira">GitHub</a>
</p>

<p align="center">

[![npm version](https://img.shields.io/npm/v/@vellira-ui/react)](https://www.npmjs.com/package/@vellira-ui/react)
[![npm downloads](https://img.shields.io/npm/dm/@vellira-ui/react)](https://www.npmjs.com/package/@vellira-ui/react)
[![CI](https://github.com/vellira-dev/vellira/actions/workflows/ci.yml/badge.svg)](https://github.com/vellira-dev/vellira/actions/workflows/ci.yml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/vellira-dev/vellira/badge)](https://securityscorecards.dev/viewer/?uri=github.com/vellira-dev/vellira)
![License](https://img.shields.io/github/license/vellira-dev/vellira)

</p>

---

<p align="center">
  <img
    src="./packages/assets/brand/social/vellira-og-code-to-ui.png"
    alt="Vellira Preview"
  />
</p>

## Why Vellira?

Most design systems stop at components.

Vellira goes further by providing a shared foundation for building consistent interfaces across React and React Native.

Instead of duplicating design decisions across platforms, Vellira shares:

- 🎨 Design Tokens
- ⚡ TypeScript Contracts
- 🧠 Interaction Logic
- 🧩 Consistent Component APIs

Each platform still gets its own native implementation, ensuring familiar behavior without sacrificing consistency.

---

## Why developers choose Vellira

✔ Shared design tokens across Web and React Native

✔ Consistent APIs on both platforms

✔ Accessibility-minded component APIs

✔ Modern TypeScript-first developer experience

✔ Modular packages with tree-shaking support

✔ Interactive documentation and Storybook

✔ Automated testing and release pipeline

---

## Features

### 🌐 Cross-platform

- Shared APIs for React and React Native
- Platform-specific implementations

### ⚡ Developer Experience

- TypeScript-first APIs
- Tree-shakeable packages
- Practical documentation
- Predictable component architecture

### 🎨 UI

- Accessibility-minded components
- CSS Variables
- Shared Design Tokens
- Interactive Storybook

### 🛡️ Quality

- Automated testing
- Semantic Release
- Continuous Integration
- Public API validation

---

## Installation

### React

**pnpm**

```bash
pnpm add @vellira-ui/react
```

**npm**

```bash
npm install @vellira-ui/react
```

**yarn**

```bash
yarn add @vellira-ui/react
```

---

### React Native

```bash
pnpm add @vellira-ui/react-native
```

---

### Design Tokens

```bash
pnpm add @vellira-ui/tokens
```

---

## Quick Example

```tsx
import '@vellira-ui/react/styles';
import { Select } from '@vellira-ui/react';

export function ReleaseTeamSelect() {
  return (
    <Select
      label='Release owner'
      description='Assign the team responsible for the next rollout.'
      placeholder='Choose a team'
      defaultValue='frontend-platform'
      color='primary'
      variant='outline'
      clearable
    >
      <Select.Group label='Core teams'>
        <Select.Item
          value='design-systems'
          label='Design Systems'
          description='Components, tokens and accessibility reviews'
          badge='Core'
        />
        <Select.Item
          value='frontend-platform'
          label='Frontend Platform'
          description='Build tooling, docs and release quality'
          badge='Web'
        />
      </Select.Group>

      <Select.Separator />

      <Select.Group label='Operations'>
        <Select.Item
          value='customer-support'
          label='Customer Support'
          description='Escalations, feedback and adoption notes'
          badge='CS'
        />
      </Select.Group>
    </Select>
  );
}
```

---

## Packages

| Package                    | Platform     | Purpose                            |
| -------------------------- | ------------ | ---------------------------------- |
| `@vellira-ui/react`        | Web          | UI components for React            |
| `@vellira-ui/react-native` | React Native | UI components for React Native     |
| `@vellira-ui/tokens`       | Shared       | Design tokens                      |
| `@vellira-ui/core`         | Shared       | Shared hooks and interaction logic |
| `@vellira-ui/icons`        | Shared       | SVG icon library                   |
| `@vellira-ui/types`        | Shared       | Shared TypeScript definitions      |

---

## Components

Every component is available for both React and React Native, providing a familiar developer experience with a consistent API across platforms.

| Component  | React | React Native |
| ---------- | :---: | :----------: |
| Button     |  ✅   |      ✅      |
| Checkbox   |  ✅   |      ✅      |
| Dropdown   |  ✅   |      ✅      |
| FormField  |  ✅   |      ✅      |
| Input      |  ✅   |      ✅      |
| Modal      |  ✅   |      ✅      |
| Portal     |  ✅   |      ✅      |
| Radio      |  ✅   |      ✅      |
| RadioGroup |  ✅   |      ✅      |
| Select     |  ✅   |      ✅      |
| Tabs       |  ✅   |      ✅      |
| Tooltip    |  ✅   |      ✅      |

---

## Philosophy

Vellira is built around a few simple principles.

### Shared foundations

Share tokens, logic and APIs across platforms.

### Native experiences

Each platform should feel native instead of being forced into a one-size-fits-all solution.

### Developer Experience

Strong typing, modular packages, clear documentation and predictable APIs.

### Accessibility

Keyboard navigation, focus management and accessible APIs are considered from the beginning.

---

## Documentation

Everything you need to get started:

- Getting Started
- Installation
- Components
- Design Tokens
- API Reference
- Production Guide
- Examples

📖 **[Documentation](https://docs.vellira.dev)**

Complete guides, API references and examples.

---

## Storybook

Explore every component interactively.

📖 **[Storybook](https://storybook.vellira.dev)**

---

## Roadmap

The first public release is just the beginning.

Upcoming work includes:

- More components
- Advanced data entry components
- React Native expansion
- More design tokens
- Starter templates
- AI-powered developer tools
- Figma resources
- Performance optimizations

---

## Contributing

Contributions, issues and ideas are always welcome.

If you'd like to improve Vellira, feel free to open an issue or submit a pull request.

---

## Community

- 📚 **[Documentation](https://docs.vellira.dev)**
- 📖 **[Storybook](https://storybook.vellira.dev)**
- 🐞 **[Report an Issue](https://github.com/vellira-dev/vellira/issues)**
- 💬 **[Join Discussions](https://github.com/vellira-dev/vellira/discussions)**
- 🤝 **[Contributing Guide](./CONTRIBUTING.md)**
- ⭐ **[Star on GitHub](https://github.com/vellira-dev/vellira)**
- 🌐 **[Website](https://vellira.dev)**

---

## Browser Support

Vellira supports all modern evergreen browsers and actively maintained versions of React and React Native.

See the documentation for compatibility details.

---

Built by Roman Bakurov.

If Vellira helps you build better interfaces, consider starring the repository on GitHub.

Every star helps the project reach more developers.

## License

MIT (c) Roman Bakurov
