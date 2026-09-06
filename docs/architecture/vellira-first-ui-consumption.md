# Vellira-first UI Consumption Policy

## Status And Authority

This document is the canonical policy for how maintained first-party Vellira UI
consumes components and design-system resources.

It applies to contributors, repository automation, generators, review tooling,
and agents working on first-party Vellira surfaces. Secondary guidance should
link here instead of maintaining a second copy of these rules.

## Core Rule

If Vellira already provides the required component, primitive, icon, token,
asset, style resource, or reusable interaction pattern, first-party Vellira code
must reuse the canonical Vellira resource rather than recreate an equivalent
local implementation.

A missing reusable capability is not permission to create a permanent local
substitute. Route the gap through the canonical component or resource production
path first.

## Scope

This policy covers maintained first-party UI, including:

- `apps/website`;
- `apps/docs`;
- React and React Native Storybook surfaces;
- web and native playgrounds;
- component catalog pages;
- maintained examples and demos;
- future first-party Vellira applications and automation that writes UI code.

Package implementations are also subject to canonical resource ownership, but
may use platform primitives where those primitives are the implementation layer
of a Vellira component.

## Decision Order

Before adding a UI control, resource, or reusable interaction, follow this order:

1. Check the canonical Vellira component/resource authority.
2. If the required component or resource already exists, reuse it.
3. If an existing component is the correct abstraction but lacks one required
   capability, enhance that canonical component instead of creating a sibling or
   page-local clone.
4. If a reusable component is genuinely missing, fail closed and route it to the
   missing-component workflow tracked by #851.
5. If an icon, token, color role, or other design resource is missing, follow the
   canonical resource behavior established by #760; do not invent a substitute.
6. If the need is only page-specific composition or layout, keep it local and
   compose canonical Vellira resources.
7. Use an architectural exception only when a Vellira abstraction would be
   technically incorrect, and document the exception explicitly.

The intended result is one design system, not a canonical library plus hidden
page-specific equivalents.

## Existing Components Are Mandatory By Default

When a canonical Vellira component satisfies the requirement, first-party UI
must consume its public API.

Do not:

- recreate an existing Vellira component in an app;
- create a page-specific `Button`, input, select, dialog, popover, tooltip,
  checkbox, menu, or equivalent control when the canonical component exists;
- copy a Vellira component's styles or interaction behavior into a local wrapper
  instead of composing the public component;
- bypass a canonical component with a third-party UI control merely because the
  third-party API is convenient;
- fork an existing component under a different local name to gain one missing
  prop or state.

A wrapper is acceptable when it represents product composition rather than a
second implementation of the underlying control. The wrapper should delegate
interaction, accessibility, states, and visual resource ownership to canonical
Vellira components.

## Capability Gaps On Existing Components

A missing prop, variant, slot, platform implementation, or interaction state on
an otherwise correct canonical component is an enhancement request, not a new
component request.

The enhancement should preserve the existing component's ownership of:

- API and controlled/uncontrolled semantics;
- keyboard and pointer behavior;
- accessibility;
- React/React Native parity where the concept is shared;
- semantic/component token usage;
- tests, Storybook, docs, metadata, and public exports.

Do not solve a capability gap by shipping a parallel first-party implementation.

## Local Composition And Layout Are Allowed

Vellira-first does not prohibit normal application code.

First-party surfaces may use:

- semantic HTML such as `main`, `section`, `article`, `nav`, and headings;
- layout markup such as `div` where no design-system control is implied;
- React Native layout primitives such as `View` and `Text` when used for
  application composition rather than recreating an owned control;
- CSS modules and page-specific layout styles that consume canonical Vellira
  design resources;
- application-specific composition of multiple canonical components;
- content markup and data-driven presentation that is not a reusable UI control;
- platform primitives inside canonical Vellira component implementations;
- framework or infrastructure adapters where a design-system abstraction would
  be semantically wrong.

The boundary is ownership: local code may compose the interface, but it should
not silently take ownership of a reusable control or design resource that Vellira
already owns.

## Icons, Tokens, Assets, And Visual Resources

Canonical design resources must come from Vellira-owned packages and token
architecture.

Generated component behavior for icons and tokens is already governed by #760.
This policy does not redefine that contract. It extends the same ownership
principle to first-party product surfaces:

- use `@vellira-ui/icons` for owned icons;
- use `@vellira-ui/tokens`, theme APIs, semantic roles, and component token
  contracts for owned visual values;
- use `@vellira-ui/assets` for owned shared assets;
- do not introduce local SVG/Unicode icon substitutes when Vellira owns the icon;
- do not introduce arbitrary visual values where a canonical token/resource
  expresses the intended meaning.

The token semantic authority is defined by
`packages/tokens/src/token-architecture.ts` and the Token Architecture docs.
Consumers select tokens by semantic purpose rather than by palette appearance.

If the required canonical resource does not exist, follow the fail-closed
resource path from #760: record the missing semantic requirement, add the
resource through its owning Vellira package/factory, then consume it.

## Missing Reusable Components

A genuinely missing reusable UI component must not be hidden inside a product
surface.

Until the deterministic workflow from #851 is implemented, the repository rule
is still fail-closed:

1. verify the canonical component metadata/catalog first;
2. distinguish an existing-component capability gap from a genuinely missing
   component;
3. record the semantic requirement, target platforms, consumer, and evidence;
4. create or link a focused component issue/spec;
5. run deterministic scaffold/registration work through the repository component
   generator;
6. complete component-specific API, interaction, accessibility, and design
   semantics through reviewed human/agent completion;
7. pass normal metadata, exports, tests, Storybook, docs, website, completeness,
   quality, public API, and platform validation gates;
8. only then adopt the canonical component in the blocked first-party surface.

The machine-readable request schema and idempotent automation for this flow belong
to #851. Do not embed an incompatible one-off request schema in product code.

## Generator Versus Semantic Completion

The repository component generator is invoked through `pnpm create:component`.
Generator-owned work is deterministic repository plumbing: component structure,
platform skeletons, registration, exports, metadata, and other consequences the
generator contract owns.

Generation does not authorize unresolved product decisions. Component-specific
API semantics, behavior, accessibility, visual intent, and platform behavior
remain reviewed completion work and must pass the normal component gates before
the component is canonical.

A generator or agent must therefore fail closed rather than fabricate semantic
completion merely to unblock a consuming app.

## Canonical Authorities

| Concern | Canonical authority |
| --- | --- |
| React components | `@vellira-ui/react` / `packages/react` |
| React Native components | `@vellira-ui/react-native` / `packages/react-native` |
| Component metadata/catalog | `@vellira-ui/metadata` / `packages/metadata` |
| Design tokens and theme contracts | `@vellira-ui/tokens` / `packages/tokens` |
| Token architecture metadata | `packages/tokens/src/token-architecture.ts` |
| Icons | `@vellira-ui/icons` / `packages/icons` |
| Shared assets | `@vellira-ui/assets` / `packages/assets` |
| Shared behavior/contracts | `@vellira-ui/core` and `@vellira-ui/types` where applicable |
| Deterministic component scaffold | `pnpm create:component` / `scripts/generators/component` |
| Component quality/completeness | repository component checks and production validation |
| Architectural exceptions | this policy plus an explicit owning issue/PR justification |

Public Vellira metadata and package exports remain the source of truth for
consumers and automation. Private automation must consume those authorities
rather than maintain a second component catalog.

## Architectural Exceptions

Exceptions are narrow escape hatches for cases where applying a Vellira
abstraction would be incorrect, not a convenience mechanism.

An exception must state:

- the exact consumer/path and scope;
- why an existing Vellira component/resource is not semantically or technically
  applicable;
- who owns the exception;
- whether the exception is permanent or temporary;
- for temporary exceptions, the removal condition or follow-up issue.

Examples may include framework-owned infrastructure UI, embedded third-party
surfaces that cannot be reasonably wrapped, or platform behavior that belongs to
an adapter rather than the design system.

An exception must not be used to bypass a missing canonical icon/token/resource,
or to ship a permanent local equivalent of an existing Vellira component.

## Review Checklist

For maintained first-party UI changes, reviewers and automation should be able to
answer:

1. Does Vellira already own this component/resource/interaction?
2. If yes, is the public canonical resource reused?
3. If the existing component lacks a capability, is the change routed to that
   component rather than duplicated locally?
4. If a reusable component is missing, is the consumer fail-closed and routed to
   #851 rather than shipping a permanent substitute?
5. If a design resource is missing, is #760's canonical resource path followed?
6. Are local HTML/CSS/React Native primitives only doing composition/layout or
   canonical component implementation work?
7. Is any third-party/framework bypass explicitly justified as an architectural
   exception?
8. Do tokens/icons/assets come from their canonical authorities?

#850 is responsible for turning appropriate parts of this policy into
repository-wide detection. #852 is responsible for auditing and migrating legacy
first-party usages before that enforcement becomes blocking.
