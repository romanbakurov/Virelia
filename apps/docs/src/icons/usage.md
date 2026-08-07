---
title: Icon Usage
description: Learn how to install and use Vellira icons in React and React Native, including sizing, color, accessibility, tree shaking, and icon-only controls.
---

# Icon Usage

Install the icon package.

```bash
pnpm add @vellira-ui/icons
```

## React

```tsx
import { Search } from '@vellira-ui/icons';

<Search />;
```

## React Native

```tsx
import { Search } from '@vellira-ui/icons';

<Search />;
```

## Size

```tsx
<Search size={20} />
```

## Color

```tsx
<Search color='currentColor' />
```

Icons inherit text color by default, making them easy to integrate with buttons, links, and typography.

## Accessibility

Decorative icons should be hidden from assistive technologies.

```tsx
<Search aria-hidden />
```

Icons that communicate meaning should have an accessible label through the parent control.

```tsx
<Button aria-label='Search' iconStart={<Search />} />
```

## Tree Shaking

Import icons individually.

```tsx
import { Search } from '@vellira-ui/icons';
```

Avoid importing the entire library when only a few icons are required.

## Best Practices

- Use icons to reinforce labels, not replace them.
- Keep icon sizes consistent throughout a product.
- Reserve animation for interactive feedback.
- Prefer decorative icons with `aria-hidden`.
- Use accessible labels for icon-only actions.

## Storybook

Browse the complete icon collection.

<a class="docs-cta" href="https://storybook.vellira.dev/?path=/story/icons-overview--all" target="_blank" rel="noreferrer">
Open Storybook
</a>
