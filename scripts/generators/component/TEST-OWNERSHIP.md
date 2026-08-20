# Component test ownership

Component test generation uses an explicit ownership boundary so deterministic baseline regeneration does not erase component-specific regression coverage.

## Generated baseline tests

The generator owns:

```text
<Component>.test.tsx
<Component>.test-contract.json
```

`<Component>.test.tsx` is regenerated from the canonical Generator V2 profile, control kind, effective capabilities, and target platform. The adjacent JSON contract records the baseline requirements that the completeness checker validates.

Do not add hand-written component-specific scenarios to the generated baseline file. Reusable baseline behavior belongs in the generator templates and coverage contract.

## Manual component-specific tests

Hand-written regression and component-specific behavior must use the suffix:

```text
*.manual.test.tsx
```

Examples:

```text
Switch.manual.test.tsx
Accordion.keyboard.manual.test.tsx
behavior/Accordion.focus.manual.test.tsx
```

These files are owned by component engineering rather than the generator. They can contain scenarios that are intentionally too component-specific for the shared baseline contract.

## Regeneration behavior

`--force` may replace generated component scaffolding, including `<Component>.test.tsx` and `<Component>.test-contract.json`.

Before the component directory is replaced, the writer collects every `*.manual.test.tsx` file recursively. After generated files are written, those manual tests are restored byte-for-byte at their original relative paths.

This gives regeneration a deterministic rule:

- generated baseline tests are replaceable;
- explicit manual tests are preserved;
- ambiguous ownership is avoided by filename convention;
- reusable gaps discovered in manual tests should move into the baseline generator when they apply to a component family.

Legacy tests that do not use the `.manual.test.tsx` suffix are not considered manually owned by this contract. Migrate component-specific scenarios to the explicit manual suffix before using `--force` on an existing generated component.
