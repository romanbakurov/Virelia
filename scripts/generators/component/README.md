# Component Generator

Scaffolds runtime Vellira components in package source trees.

Generator V2 extends the existing safe generation pipeline with richer explicit
intent. The writer/preflight/barrel workflow remains the same; V2 behavior is
selected through profiles, control kinds, compound parts, and optional metadata
capabilities.

## Command

```bash
pnpm create:component \
  <Name> \
  <platform> \
  <layer> \
  <category> \
  [--profile=<profile>] \
  [--control=value|boolean|text] \
  [--capabilities=controlled,keyboard,...] \
  [--parts=Root,Trigger,Content] \
  [--icon=<IconName>:<semantic purpose>] \
  [--token=<token.path>] \
  [--force] \
  [--dry-run] \
  [--check]
```

### Basic example

```bash
pnpm create:component Avatar both primitives data-display
```

### Switch pilot example

```bash
pnpm create:component Switch both components form \
  --profile=form-control \
  --control=boolean
```

### Textarea example

```bash
pnpm create:component Textarea both components form \
  --profile=form-control \
  --control=text
```

### Accordion pilot example

```bash
pnpm create:component Accordion both components navigation \
  --profile=compound \
  --capabilities=controlled,uncontrolled,disabled,keyboard \
  --parts=Root,Item,Trigger,Content
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
architecture and default metadata capabilities.

### `base`

Neutral component scaffold with no specialized behavior.

```bash
pnpm create:component Avatar both primitives data-display
```

### `form-control`

Form-oriented scaffold with controlled/uncontrolled intent and common field
states.

Generator V2 adds explicit control kinds:

- `value` — preserves the existing V1 value-oriented scaffold and remains the
  default for backward compatibility
- `boolean` — generates Switch-like checked/defaultChecked APIs with Web switch
  semantics and React Native switch accessibility/touch semantics
- `text` — generates multiline text-entry scaffolding with a Web `textarea` and
  React Native multiline `TextInput`

Examples:

```bash
pnpm create:component Switch both components form \
  --profile=form-control \
  --control=boolean

pnpm create:component Textarea both components form \
  --profile=form-control \
  --control=text
```

The profile establishes baseline capabilities such as:

- controlled state
- uncontrolled state
- disabled state
- required state
- invalid state

Generated tests and starter stories are selected from the same profile/control
intent instead of always receiving a generic children-only scaffold.

### `compound`

Compound component scaffold composed from a root and explicitly declared public
parts.

```bash
pnpm create:component Accordion both components navigation \
  --profile=compound \
  --parts=Root,Item,Trigger,Content
```

Generator V2 keeps `Object.assign(Root, parts)` as the public composition model
but allows part-specific templates. `Trigger` receives an interactive
button/Pressable starting point and `Content` receives platform-aware visibility
behavior; neutral parts remain generic. This is intentionally a starting point,
not an attempt to invent the entire component API.

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

## Explicit metadata capabilities

Profiles define baseline metadata capabilities. Components can add deterministic
component-specific capabilities without creating a new profile:

```bash
--capabilities=controlled,uncontrolled,disabled,keyboard
```

Explicit capabilities are validated against the canonical metadata capability
set and merged with the selected profile capabilities without duplicates.

This is useful for production components such as Accordion, where the generic
`compound` profile should not claim keyboard or controlled-state behavior for
every compound component, while the real component metadata still needs to
state those capabilities explicitly.

## Explicit design-resource requirements

Generator V2 accepts approved component-owned design resources as repeatable
CLI flags:

```bash
--icon="ChevronDown:disclosure indicator"
--token=semantic.text.primary
```

`--icon` splits only on the first `:`. The icon name must be a canonical
PascalCase `@vellira-ui/icons` export name, and the semantic purpose is kept as
plain text after trimming outer whitespace. Programmatic callers should pass
the full `--icon=ChevronDown:disclosure indicator` value as one argv entry;
shell callers should quote the value when the purpose contains spaces.
`--token` accepts one exact canonical token path. Duplicate icon name/purpose
pairs and duplicate token paths are rejected.

These inputs are explicit approved requirements. The generator does not infer,
invent, or substitute resources from component names, profiles, capabilities,
or implementation text. Requested icons are validated against the canonical
Vellira web and React Native icon registries for the selected platform target;
`both` requires the icon to exist for both platforms. Requested tokens are
validated against the canonical Vellira token registry.

Missing resources block generation before component files are written, including
`--dry-run`. Add the canonical icon or token resource separately, then rerun the
generator with the same explicit requirement flags.

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
<Dialog>
  <Dialog.Trigger />
  <Dialog.Content />
</Dialog>
```

The public component intent can remain aligned across platforms while the
generated Web and React Native implementations differ according to platform
interaction, accessibility, and presentation requirements.

## Overwriting and dry runs

Existing component targets are rejected by default.

Use:

```bash
--force
```

to explicitly overwrite an existing generated component.

Use:

```bash
--dry-run
```

to validate and inspect the generation plan without writing component files.

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
└── index.ts

packages/react-native/src/primitives/Avatar/
├── Avatar.tsx
├── Avatar.styles.ts
├── Avatar.test.tsx
├── Avatar.stories.tsx
├── types.ts
└── index.ts

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
└── index.ts
```

The exact generated implementation depends on the selected profile, explicit
intent, and target platform.

`compound` and `overlay` profiles intentionally do not emit generic top-level
style scaffolds. Component-token ownership is separate from visual scaffold
selection: the generation plan follows the explicit component-token contract
(`standard`, a specialized contract, or `false`) and may therefore create token
factory/theme artifacts even when the structural runtime scaffold has no generic
style file.

## Component Production Contract

`pnpm create:component` is the low-level deterministic scaffold mechanism. New
production work should begin from the versioned Component Production Contract
when the full component intent includes canonical package/component
dependencies, component-token intent, icons, tokens, or assets.

The lifecycle is deliberately split:

```text
scaffolded
→ semantic completion required
→ candidate
→ validated
→ ready for review
→ reviewed/promoted stable
```

A successful generator run never means that component-specific API, behavior,
accessibility, platform UX, or design decisions are complete. After scaffolding,
a human or authorized agent must perform semantic completion. The completed
candidate is then checked with `pnpm component-production:validate:json --spec
<component-spec.json>`. Only that validation path can produce
`readyForReview: true`; review/promotion to stable remains a separate governance
action.

The production contract is the canonical place to express dependencies and
resources. Generator metadata, docs metadata, and deterministic repository
consequences derive from that contract rather than from independent assumptions.

## Responsibility

This generator owns library/runtime scaffolding:

- component implementation files
- public `types.ts`
- local `index.ts`
- unit test scaffolding
- Storybook story scaffolding
- platform styles when the selected profile generates a styled runtime scaffold
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
- DOM `textarea` behavior vs native multiline `TextInput`
- Web switch semantics vs native switch/touch accessibility behavior
- platform-specific presentation, spacing, motion, and control affordances

For overlays specifically, Web scaffolding may include browser-specific
contracts such as Escape-key dismissal and DOM focus handling, while native
scaffolding should use React Native accessibility and interaction semantics
instead.

The generator should preserve cross-platform API intent without treating React
Native as a visual copy of the web implementation.

## Generator V2 migration notes

Generator V2 is additive:

- commands without new flags keep the existing V1 `base` behavior
- `form-control` without `--control` keeps the existing value-oriented scaffold
- overwrite protection, preflight validation, metadata registration, and barrel
  safety remain unchanged
- richer behavior requires explicit generator intent rather than component-name
  guessing
- component-specific engineering remains expected after generation; templates
  remove repeated repository plumbing, not design/API review

The production validation path is tracked by #552. Switch (#557) is the
`form-control` pilot and Accordion (#559) is the `compound` pilot. Reusable gaps
found while implementing those components should be fixed in the generator or
#502 rather than repeated manually in later launch components.

## Baseline test contract and #502 boundary

Generator V2 owns the deterministic input contract for baseline test generation.
The contract is derived from the same generator intent used for component
scaffolding and metadata:

```text
profile + control kind + effective capabilities + target platform
                              ↓
                  baseline test contract V1
                              ↓
                 generated baseline tests
```

`test-contract.ts` defines the machine-readable V1 requirements and exports an
explicit contract version. Generated test templates consume that contract, so
changes to generator capabilities cannot silently use an unrelated test-only
taxonomy.

Generator V2 is responsible for:

- producing the baseline contract from canonical profile/capability intent
- distinguishing Web and React Native contracts
- using the contract when selecting generated baseline test states
- keeping contract output deterministic and versioned
- preserving the contract as the integration seam for #502

Issue #502 remains responsible for the broader testing system built on this
foundation:

- richer reusable test profiles and capability-specific behavioral templates
- generated/manual test ownership and safe regeneration rules
- machine-readable coverage validation against implemented tests
- completeness-checker integration and missing-test diagnostics
- CI enforcement of required test capabilities

This boundary intentionally keeps #510 focused on Generator V2. Completing #502
must not require a second component taxonomy or replacing the generator profile
and capability model established here.

## Safety

The generation pipeline is designed to avoid partial or destructive writes.

- existing targets fail before files are written
- `--force` is required for overwrites
- required package and metadata barrels are validated before writing
- runtime and metadata barrels are updated without duplicate exports
- cross-platform generation is planned before writes begin
- component profile and parts constraints are validated during preflight
- explicit capabilities are validated before the plan is written

## Validation

The generator is covered by tests for:

- CLI argument parsing
- generation planning
- preflight validation
- component profiles
- form-control control kinds
- explicit metadata capabilities
- profile-driven tests and stories
- deterministic versioned baseline test contracts
- compound part-specific templates
- Web overlay templates
- React Native overlay templates
- Web overlay part templates
- React Native overlay part templates
- template resolution
- part template resolution
- writer behavior
- full generation pipeline behavior
- cross-platform generation
- metadata generation and validation

Before merging generator changes, run:

```bash
pnpm exec prettier scripts/generators/component --check
pnpm eslint scripts/generators/component
pnpm exec vitest run scripts/generators/component
pnpm typecheck
```

Generator V2 itself is complete when these contracts and safeguards pass the
repository validation pipeline. Mass launch-component expansion is a separate
production validation step in #552 and should only proceed after the Switch and
Accordion pilots pass the full repository pipeline.
