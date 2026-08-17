# Component Generator

Scaffolds runtime Vellira components in package source trees.

## Command

```bash
pnpm create:component \
  <Name> \
  <platform> \
  <layer> \
  <category> \
  [--profile=<profile>] \
  [--parts=Root,Trigger,Content] \
  [--force]
```

### Basic example

```bash
pnpm create:component Avatar both primitives data-display
```

### Compound example

```bash
pnpm create:component Tabs both components navigation \
  --profile=compound \
  --parts=Root,List,Trigger,Content
```

### Overlay example

```bash
pnpm create:component Dialog both components overlay \
  --profile=overlay \
  --parts=Root,Trigger,Content
```

## Platforms

- `web` — generates the React implementation
- `native` — generates the React Native implementation
- `both` — generates both implementations

## Layers

- `primitives`
- `components`
- `patterns`

## Categories

- `action`
- `form`
- `navigation`
- `overlay`
- `feedback`
- `data-display`
- `layout`
- `utility`

## Profiles

The generator supports component profiles that describe the intended component
architecture and capabilities.

### `base`

Neutral component scaffold with no specialized behavior.

```bash
pnpm create:component Avatar both primitives data-display
```

### `form-control`

Form-oriented scaffold with controlled and uncontrolled state and common field
states.

```bash
pnpm create:component Switch both components form \
  --profile=form-control
```

The profile establishes capabilities such as:

- controlled state
- uncontrolled state
- disabled state
- required state
- invalid state

### `compound`

Compound component scaffold composed from a root and public child parts.

```bash
pnpm create:component Tabs both components navigation \
  --profile=compound \
  --parts=Root,List,Trigger,Content
```

### `overlay`

Platform-aware overlay scaffold with open-state, focus, dismissal, compound API,
and portal requirements.

```bash
pnpm create:component Dialog both components overlay \
  --profile=overlay \
  --parts=Root,Trigger,Content
```

Web and React Native overlay implementations intentionally use different
platform contracts where appropriate.

The default profile is `base`.

## Parts

Profiles that support compound parts can declare them with:

```bash
--parts=Root,Trigger,Content
```

`Root` is required when parts are provided.

Parts describe the public component composition contract.

For example:

```bash
pnpm create:component Dialog both components overlay \
  --profile=overlay \
  --parts=Root,Trigger,Content
```

may generate public parts corresponding to:

```tsx
<Dialog.Root>
  <Dialog.Trigger />
  <Dialog.Content />
</Dialog.Root>
```

The public component intent can remain aligned across platforms while the
generated Web and React Native implementations differ according to platform
interaction, accessibility, and presentation requirements.

## Overwriting

Existing component targets are rejected by default.

Use:

```bash
--force
```

to explicitly overwrite an existing generated component.

Example:

```bash
pnpm create:component Avatar both primitives data-display --force
```

The generator performs preflight validation before writing files so invalid or
conflicting generation plans fail before partial component output is created.

## Generated output

A cross-platform base component such as:

```bash
pnpm create:component Avatar both primitives data-display
```

generates approximately:

```text
packages/react/src/primitives/Avatar/
├── Avatar.tsx
├── Avatar.module.scss
├── Avatar.test.tsx
├── Avatar.stories.tsx
├── types.ts
├── index.ts
└── README.md

packages/react-native/src/primitives/Avatar/
├── Avatar.tsx
├── Avatar.styles.ts
├── Avatar.test.tsx
├── Avatar.stories.tsx
├── types.ts
├── index.ts
└── README.md

packages/metadata/src/components/
└── Avatar.metadata.ts
```

Required runtime and metadata barrel exports are registered automatically.

Compound and overlay components may additionally generate public part
directories such as:

```text
Dialog/
├── Root/
├── Trigger/
├── Content/
├── Dialog.tsx
├── Dialog.test.tsx
├── Dialog.stories.tsx
├── types.ts
├── index.ts
└── README.md
```

The exact generated implementation depends on the selected profile and target
platform.

## Responsibility

This generator owns library/runtime scaffolding:

- component implementation files
- public `types.ts`
- local `index.ts`
- unit test scaffolding
- Storybook story scaffolding
- platform styles
- component README documentation
- component metadata
- package layer barrel exports
- metadata barrel registration

It should not depend on the website component catalog or component-page
generation pipeline.

Templates live in `templates/` next to the generator implementation.

## Platform strategy

The component generator treats React and React Native as related but distinct
platform targets.

Shared component contracts should stay aligned where that improves developer
experience, but generated implementations must not force identical web and
mobile UX.

React Native output should be designed for native interaction patterns and may
diverge between iOS and Android when appropriate.

Examples of acceptable platform divergence include:

- web floating content vs native sheet or modal presentation
- browser keyboard behavior vs native back handling
- pointer and hover behavior on web vs touch-first interaction on native
- web focus management vs native accessibility focus behavior
- platform-specific presentation, spacing, motion, and control affordances

For overlays specifically, Web scaffolding may include browser-specific
contracts such as Escape-key dismissal and DOM focus handling, while native
scaffolding should use React Native accessibility and interaction semantics
instead.

The generator should preserve cross-platform API intent without treating React
Native as a visual copy of the web implementation.

## Safety

The generation pipeline is designed to avoid partial or destructive writes.

- existing targets fail before files are written
- `--force` is required for overwrites
- required package and metadata barrels are validated before writing
- runtime and metadata barrels are updated without duplicate exports
- cross-platform generation is planned before writes begin
- component profile and parts constraints are validated during preflight

## Validation

The generator is covered by tests for:

- CLI argument parsing
- generation planning
- preflight validation
- component profiles
- profile-driven templates
- compound component templates
- form-control templates
- Web overlay templates
- React Native overlay templates
- Web overlay part templates
- React Native overlay part templates
- template resolution
- part template resolution
- writer behavior
- full generation pipeline behavior
- cross-platform overlay generation
- metadata generation and validation

Before merging generator changes, run:

```bash
pnpm exec vitest run scripts/generators/component
pnpm eslint scripts/generators/component
pnpm typecheck
```

## Current V1 profiles

- `base`
- `form-control`
- `compound`
- `overlay`

Profiles establish generator intent, metadata capabilities, structural
requirements, and profile-specific scaffolding.

Future profiles and more specialized scaffolding can build on this foundation
without changing the core generation pipeline.
