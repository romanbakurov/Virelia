# Component Token Platform Boundary V1

Issue: #884

Vellira component tokens are canonical renderer-neutral contracts. Web and React Native representation is produced only after canonical component-token resolution.

## Canonical component tokens may contain

- semantic colors and visual states;
- spacing, size, radius, geometry and motion intent;
- renderer-neutral effect intent such as a shadow level;
- renderer-neutral viewport/layout intent such as a viewport-height ratio;
- component semantics that have the same meaning on Web and React Native.

## Canonical component tokens must not contain

- `web` or `native` branches;
- names such as `nativeMaxHeight` or other renderer implementation keys;
- CSS-only values when the same intent needs a different React Native representation;
- React Native shadow/style objects embedded beside Web representations;
- duplicated renderer-specific values for one component semantic.

## Platform-output stage

Renderer-specific serialization happens after the canonical component contract is resolved.

Examples:

- canonical `{ kind: 'shadow', level: 'lg' }` becomes the current Web shadow string for Web output and a structured React Native shadow for RN output;
- canonical `{ kind: 'viewport-height', ratio: 0.9 }` becomes `90vh` for Web and `90%` for React Native.

The canonical component path remains component-semantic (`content.shadow`, `content.maxHeight`). The adapter owns representation.

## Generator rule

Generator V2 must emit renderer-neutral component-token contracts by default. Generated canonical contracts must not introduce `web`, `native`, `native*`, CSS-only shadow strings, or React Native style-object branches. Platform differences belong in shared output adapters.

## Validation

The token architecture must provide a deterministic leakage check over every `theme.components.*` family. Known renderer-key patterns are rejected fail-closed. Representation-specific values must be wrapped in an approved renderer-neutral intent and resolved by the platform-output layer.

This boundary intentionally does not consolidate the underlying shadow/elevation authorities. That authority normalization is owned by #885; #884 ensures components no longer encode the renderer split themselves.
