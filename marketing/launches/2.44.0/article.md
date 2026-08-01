# Introducing Vellira

> **Build once. Stay consistent everywhere.**

<p align="center">
  <img src="./marketing/media-kit/social/vellira-og-code-to-ui.png" alt="Vellira" />
</p>

For the past several months, I've been building **Vellira** — a TypeScript-first design system for **React** and **React Native**.

The idea behind the project is straightforward:

> Build consistent interfaces across Web and Native without maintaining two completely separate UI libraries.

Today I'm excited to share the **first public release** of Vellira.

---

# Who is Vellira for?

Vellira is designed for teams building applications on both Web and React Native.

It is particularly useful if you want to:

- share design tokens across platforms;
- keep consistent component APIs;
- reduce duplicated interaction logic;
- improve long-term maintainability;
- build accessible interfaces from the start.

If you're only building a simple React website, another UI library may already fit your needs perfectly.

If you're maintaining multiple platforms, Vellira aims to reduce the amount of duplicated work.

---

# Why another design system?

The JavaScript ecosystem already offers many excellent UI libraries.

Projects like Material UI, Mantine, Chakra UI, Radix UI and React Aria each solve different problems exceptionally well.

Vellira isn't trying to replace them.

Instead, it focuses on a different challenge: providing a shared foundation for applications that target both React and React Native.

So why build another one?

Because the problem I kept running into wasn't simply about components.

It was about **consistency across platforms**.

Modern products rarely live only on the web anymore.

A dashboard often has:

- a React web application;
- a React Native mobile application;
- shared branding;
- shared design language;
- shared UX patterns.

Yet the implementation quickly starts to diverge.

The button behaves differently.

The modal has another API.

The dropdown follows another interaction model.

The documentation becomes duplicated.

Accessibility fixes are implemented twice.

Design tokens slowly drift apart.

Eventually, you're maintaining two UI libraries instead of one product.

That was the problem I wanted to solve.

---

# The idea behind Vellira

Instead of trying to make React Native behave like the web—or forcing the web to imitate native behavior—Vellira shares only what actually benefits from being shared.

That foundation consists of four building blocks:

- 🎨 Design Tokens
- ⚡ TypeScript Contracts
- 🧠 Shared Interaction Logic
- 🧩 Consistent Component APIs

Everything related to rendering remains platform specific.

This means React components still behave like React components.

React Native components still feel native.

Developers don't have to learn two completely different APIs.

---

# Design goals

From the beginning I wanted Vellira to follow a few simple principles.

## Consistency

The same component should expose the same API whenever possible.

Changing platforms shouldn't require learning an entirely different component library.

---

## Native experience

Sharing code should never come at the cost of platform conventions.

A mobile application should still feel like a mobile application.

A web application should still feel like a web application.

---

## Accessibility

Accessibility isn't an optional add-on.

Keyboard navigation, focus management, ARIA attributes and semantic APIs are considered part of every public component.

---

## Developer experience

Good tooling matters.

That means:

- strong TypeScript support;
- predictable APIs;
- modular packages;
- interactive documentation;
- automated testing;
- automated releases.

---

# Architecture

Vellira is organized as a collection of focused packages.

Instead of placing everything inside one package, responsibilities are separated.

```text
                Shared Foundation
                  Design Tokens
                        │
        ┌───────────────┴───────────────┐
        │                               │
 Shared TypeScript Types     Shared Interaction Logic
        │                               │
        └───────────────┬───────────────┘
                        │
               Platform Implementations
        ┌───────────────┴───────────────┐
        ▼                               ▼
 @vellira-ui/react          @vellira-ui/react-native
        │                               │
        └───────────────┬───────────────┘
                        ▼
                 Your Applications
```

This architecture allows platform-specific rendering while keeping the developer experience consistent.

---

# Package overview

| Package                    | Purpose                            |
| -------------------------- | ---------------------------------- |
| `@vellira-ui/react`        | React component library            |
| `@vellira-ui/react-native` | React Native component library     |
| `@vellira-ui/tokens`       | Shared design tokens               |
| `@vellira-ui/core`         | Shared hooks and interaction logic |
| `@vellira-ui/icons`        | Cross-platform icon library        |
| `@vellira-ui/types`        | Shared TypeScript types            |

Each package has a single responsibility and can evolve independently.

---

# Components available today

The first public release includes a solid foundation of commonly used UI components.

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

This foundation intentionally focuses on the components developers use every day.

The goal of the first release wasn't to ship the largest component library, but to establish a stable, well-tested foundation that can grow over time.

---

# One API across platforms

One of the core ideas behind Vellira is that switching between React and React Native shouldn't require learning a completely different component model.

For example, a real Select with grouped options, metadata and a clearable value keeps the same shape across platforms.

### React

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

### React Native

```tsx
import { Select } from '@vellira-ui/react-native';

export function ReleaseTeamSelect() {
  return (
    <Select
      label='Release owner'
      description='Assign the team responsible for the next rollout.'
      placeholder='Choose a team'
      defaultValue='frontend-platform'
      color='primary'
      variant='outline'
      presentation='sheet'
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

**Same API.**
**Platform-specific rendering.**

The React Native version follows the same philosophy, making it easier to move between platforms while preserving native rendering under the hood.

---

# Design Tokens as the Foundation

The token system also makes theming significantly easier by centralizing design decisions instead of scattering them across components.

One of the first decisions I made was that components shouldn't be the foundation of the design system.

Instead, everything starts with **design tokens**.

Colors, typography, spacing, radii, shadows and component values all live in a shared token layer that can be consumed by both React and React Native.

That approach has several advantages.

Instead of changing colors in dozens of components, the entire system can be updated by modifying the token definitions.

Instead of maintaining separate themes for every platform, the same design language can be shared everywhere.

For applications with multiple products, this dramatically reduces duplication while keeping the UI consistent.

---

# Accessibility by Default

Accessibility wasn't something I wanted to "add later."

It became part of the architecture from the beginning.

Every public component is built with accessibility in mind.

That includes things such as:

- keyboard navigation on the web
- focus management where the interaction requires it
- semantic HTML where applicable
- ARIA attributes where applicable
- predictable interaction patterns

The goal is to make accessible defaults the starting point, not an optional enhancement.

Application teams still need to provide good labels, copy and product-level flows, but the component primitives should not make that harder.

---

# Documentation Matters

A design system isn't only about components.

Documentation is equally important.

One goal for Vellira was making it easy to discover, understand and use every component.

The project currently includes:

- dedicated documentation website
- interactive Storybook
- generated API documentation
- live component examples
- installation guides
- production recommendations

Good documentation often has a bigger impact on adoption than adding another component.

---

# Storybook

Storybook plays an important role in the development workflow.

Every component is documented visually and can be explored independently.

Rather than looking through source code, developers can immediately see how a component behaves across different states and configurations.

This also makes regression testing and future development significantly easier.

---

# Quality Before Quantity

Many UI libraries focus on shipping as many components as possible.

I wanted to take a different approach.

Instead of releasing dozens of unfinished components, Vellira focuses on building a smaller collection of polished, reusable building blocks.

Every public component is expected to go through the same development process:

- implementation
- accessibility review
- Storybook documentation
- automated tests
- API validation
- production documentation

The goal isn't simply to increase the number of components.

The goal is to make every component something developers can confidently rely on.

---

# Modern Tooling

Vellira is built with a modern development workflow.

The project uses:

- TypeScript
- pnpm
- Storybook
- Vitest
- Playwright
- GitHub Actions
- Semantic Release
- OpenSSF Scorecard
- Lighthouse CI

Every change is automatically validated before release.

This allows new versions to be published with confidence while keeping maintenance predictable.

---

## Built for Production

Although this is the first public release, Vellira has been developed with production-quality practices from the beginning.

Every release goes through automated validation, testing and documentation checks to ensure a reliable developer experience.

---

# Open Source from Day One

Vellira is developed as an open-source project under the MIT license.

That means everything—from the source code to the documentation and release process—is public.

I believe open source works best when development happens in the open, feedback is encouraged and improvements are shared with the community.

Whether you discover a bug, suggest an improvement or contribute code, every contribution helps move the project forward.

Being open source also means every design decision, discussion and improvement is visible to the community.

---

# Why TypeScript First?

Every public API in Vellira is designed with TypeScript as a first-class citizen.

Strong typing improves discoverability, autocomplete and long-term maintainability while reducing runtime errors.

Rather than treating TypeScript as an afterthought, it shapes the public API from the beginning.

This makes the library easier to discover through editor autocomplete while reducing the likelihood of runtime mistakes.

---

# Roadmap

The first public release establishes the foundation of Vellira, but there is still a lot to build.

Upcoming work includes:

- expanding the component library;
- advanced data entry components;
- richer React Native support;
- additional design tokens and theming capabilities;
- starter templates and example applications;
- Figma resources;
- performance improvements;
- AI-assisted development workflows.

The goal isn't simply to add more components—it's to continue improving the overall developer experience while keeping the API consistent across platforms.

---

# What's Next

Vellira will continue evolving through incremental, production-focused improvements.

Future releases will focus on stability, accessibility, developer experience and long-term maintainability rather than introducing features for the sake of increasing the component count.

As the ecosystem grows, I also plan to expand the documentation, provide more real-world examples and improve the tooling around the design system.

---

# Try Vellira

If you're building applications with React or React Native, I'd love for you to give Vellira a try.

Whether you're starting a new project or exploring design system architectures, your feedback will help shape the future of the project.

Issues, feature requests, discussions and pull requests are always welcome.

---

# Links

🌐 **Website**  
https://vellira.dev

📚 **Documentation**  
https://docs.vellira.dev

📖 **Storybook**  
https://storybook.vellira.dev

💻 **GitHub Repository**  
https://github.com/vellira-dev/vellira

---

# Closing Thoughts

Building a design system is a long-term journey.

The first public release isn't the finish line—it's the beginning.

Vellira was created to make cross-platform interface development more consistent, maintainable and enjoyable, while respecting the strengths of both React and React Native.

I'm excited to continue improving the project in the open together with the community.

If you have ideas, questions or suggestions, I'd genuinely love to hear from you.

Thank you for taking the time to read this article, and I hope you'll enjoy building with Vellira.

---

**Build once. Stay consistent everywhere.**

If you found this project interesting, consider ⭐ starring the repository on GitHub.

Every star helps Vellira reach more developers and grow as an open-source project.
