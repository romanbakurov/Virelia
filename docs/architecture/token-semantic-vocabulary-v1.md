# Token Semantic Vocabulary V1

## Status

Canonical semantic naming contract for Vellira token consumers, Generator V2, quality tooling, and agents. The machine-readable authority lives in `packages/tokens/src/token-architecture.ts` as `semanticVocabularyV1` and `canonicalSemanticRolePaths`.

## Rule

Semantic names describe **purpose**, not a primitive hue, renderer, interaction implementation, or the component that first introduced the value. Primitive values feed semantic roles; component factories consume semantic roles; platform adapters serialize component contracts.

## Canonical namespaces

- **surface** — canvas/layer backgrounds and generic interaction surfaces. `surface.background` is removed because it did not identify a distinct purpose; application roots use `surface.canvas`.
- **text** — foreground hierarchy (`primary → secondary → muted → subtle → disabled`) plus brand and interaction-specific text roles.
- **icons** — icon foreground hierarchy. `interactive`/`interactiveHover` describe interaction; `brand` remains a distinct identity role.
- **border / divider** — structural borders and separators. `border.interactive` is generic interaction emphasis; actual focus indication belongs to `focus.ring`.
- **focus** — focus indication only. `ring.offsetColor` is explicitly a color, not geometric spacing.
- **status** — success/error/warning/info paint with explicit `fg`, `bg`, `border`, `ring`, and `emphasisFg` consumption roles.
- **action** — reusable action palettes. `primary` is the main brand action, `accent` is the cyan secondary-brand hue, `neutral` is non-brand action chrome, and `danger` is destructive action paint.
- **control** — generic form-control state paint using the canonical interaction vocabulary from #882.
- **menu** — menu-specific current/highlighted semantics where `active` is a real persistent/current domain state.
- **overlay** — `backdrop`, `tooltip`, `floating`, and `dialog`; names describe presentation purpose rather than Popover/Modal component history.
- **shadow** — semantic elevation references. Renderer-neutral shadow/elevation ownership is handled by the later #885 boundary work.

## Migration policy

Legacy public names are tracked through the #880 preservation manifest. Renames are baseline-to-final: migration metadata never preserves intermediate historical names as permanent vocabulary. Pure renames preserve resolved values. The only visual corrections in #883 remain inside existing Vellira palettes and require explicit preservation evidence plus pinned visual regression.

## Theme hierarchy corrections

Semantic roles stay distinct even when a theme resolves some of them to equal values. V1 also corrects three pre-existing mapping errors without introducing new colors: Dark text `muted/subtle` ordering, High Contrast icon `muted/subtle` ordering, and Dark warning/info focus-ring palettes.
