# Building Vellira: Why I Decided to Create Another Design System

> **Build once. Stay consistent everywhere.**

<p align="center">
  <img src="./marketing/media-kit/social/vellira-og-code-to-ui.png" alt="Vellira" />
</p>

A few months ago I started working on something that, at first glance, sounded like a terrible idea.

> "Another design system."

The JavaScript ecosystem already has incredible projects like Material UI, Chakra UI, Mantine, Radix UI, React Aria and many others.

So why spend months building another one?

The answer wasn't that existing libraries were missing features.

The answer was that I kept running into the same architectural problem.

---

# The Problem I Wanted to Solve

During the last few years I worked on projects that targeted both the web and mobile.

Almost every project eventually reached the same point.

The design language was shared.

The branding was shared.

The UX patterns were shared.

But the implementation wasn't.

I found myself maintaining:

- separate component libraries;
- duplicated interaction logic;
- duplicated documentation;
- duplicated accessibility fixes;
- duplicated design tokens.

The more the product grew, the more those two worlds drifted apart.

I wasn't looking for another Button component.

I wanted a better foundation.

---

# A Different Perspective

Instead of trying to build the biggest component library, I wanted to answer a different question:

> What actually needs to be shared between React and React Native?

The answer wasn't "everything."

It turned out that four things provide most of the value:

- Design Tokens
- TypeScript Contracts
- Shared Interaction Logic
- Consistent Component APIs

Everything else can remain platform-specific.

That simple idea became the foundation of Vellira.

---

# Why Platform-Specific Rendering Matters

One lesson I learned early was that sharing too much quickly becomes a problem.

React components should feel like React components.

React Native components should feel native.

Trying to hide platform differences often creates more complexity than it removes.

Instead of forcing one platform to imitate another, Vellira keeps rendering platform-specific while sharing everything that improves consistency and developer experience.

---

# Building the Foundation

The first public release intentionally focuses on the essentials.

Current components include:

- Button
- Checkbox
- Dropdown
- FormField
- Input
- Modal
- Portal
- Radio
- RadioGroup
- Select
- Tabs
- Tooltip

Rather than shipping dozens of unfinished components, I wanted every public component to have:

- documentation;
- Storybook examples;
- accessibility behavior where the platform supports it;
- automated tests;
- predictable APIs.

For me, quality matters more than quantity.

---

# More Than Components

One thing I realized while building Vellira is that a design system isn't just a collection of UI components.

Documentation matters.

Developer experience matters.

Release automation matters.

Testing matters.

Accessibility matters.

A polished Button component isn't particularly useful if developers struggle to understand how to use it.

That's why the project includes:

- a documentation website;
- interactive Storybook;
- generated API documentation;
- automated testing;
- semantic releases;
- CI validation.

I wanted the entire developer experience—not just the components—to feel polished.

---

# Lessons Learned

Building a design system taught me several things.

First, APIs are much harder to change than implementations.

Second, accessibility should never be postponed.

Third, documentation is part of the product.

And finally, consistency isn't something you add later.

It has to be part of the architecture from day one.

---

# What's Next

The first public release is only the beginning.

The roadmap includes:

- more components;
- richer React Native support;
- additional design tokens;
- Figma resources;
- starter templates;
- AI-assisted developer tooling.

Rather than chasing the largest component count, I want every release to make the system more useful and more reliable.

---

# I'd Love Your Feedback

Vellira is an open-source project, and this first release is the starting point—not the finish line.

If you're building applications with React or React Native, I'd genuinely appreciate your thoughts.

What would you build next?

Which components are essential for your projects?

What would make you consider adopting a design system like this?

I'd love to hear your feedback.

---

# Explore Vellira

🌐 **Website**

https://vellira.dev

📚 **Documentation**

https://docs.vellira.dev

📖 **Storybook**

https://storybook.vellira.dev

💻 **GitHub**

https://github.com/vellira-dev/vellira

---

Thank you for reading.

**Build once. Stay consistent everywhere.**
