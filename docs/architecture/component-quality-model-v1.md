# Component Quality Model V1

## Purpose

Component Quality Model V1 defines what "quality" means for a Vellira component in a form that future tooling can evaluate consistently.

The model sits above component metadata and completeness checks:

- component metadata declares the component engineering contract
- the completeness checker verifies required artifacts and registrations exist
- the quality model defines how deeper quality rules are classified and how their results are represented
- the future Component Quality Checker executes concrete rules against this model

V1 intentionally defines the model and contracts only. It does not implement the checker CLI or individual rule families.

## Principles

1. **Deterministic first.** Automated rules must have a stable, explainable contract.
2. **Required and recommended are different.** Required violations block readiness; recommendations do not.
3. **Web and React Native are evaluated independently.** Cross-platform quality does not mean identical implementation or UX.
4. **Not applicable is neutral.** A component is never penalized for a capability, platform, or artifact that does not apply.
5. **Metadata remains the source of declared component intent.** The quality model must not duplicate the component metadata schema.
6. **Human judgment stays explicit.** Subjective design or UX review is not disguised as deterministic automation.
7. **V1 stays small.** Numeric scoring and heuristic weighting are intentionally excluded.

## Quality dimensions

V1 uses the following stable dimensions.

| Dimension                     | Purpose                                                                    | Typical deterministic signals                                                     |
| ----------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `implementation-completeness` | Required implementation structure exists and is internally coherent        | implementation files, declared platform implementation, expected parts            |
| `public-api`                  | Public API matches declared component contracts and Vellira conventions    | exports, declared capabilities, compound parts, controlled/uncontrolled contracts |
| `type-quality`                | Public and internal TypeScript contracts are sound                         | exported types, platform types, unsafe public `any`, declaration reachability     |
| `behavior`                    | Declared states and behavioral capabilities are implemented                | disabled, required, invalid, loading, controlled/uncontrolled behavior            |
| `accessibility`               | Platform-appropriate accessibility contracts are satisfied                 | semantic HTML/ARIA or React Native accessibility props/state                      |
| `interaction`                 | Interaction contracts are implemented where applicable                     | keyboard, focus, dismiss, portal, touch/press behavior                            |
| `tests`                       | Required behavior has deterministic regression coverage                    | capability-driven tests and platform-specific coverage                            |
| `storybook`                   | Representative supported states have Storybook coverage where required     | required stories/states/variants                                                  |
| `documentation`               | Public usage, API, platform, and accessibility expectations are documented | website/docs/API coverage                                                         |
| `tokens-theming`              | Styling follows Vellira token and theme contracts                          | token requirements, prohibited hardcoded values where deterministic               |
| `exports-package`             | Public package integration is valid                                        | package exports, barrels, platform entry points                                   |
| `platform-quality`            | Supported platforms satisfy their own declared contracts                   | platform-specific requirements and intentional divergence handling                |

A concrete rule belongs to one primary dimension even if it supports more than one quality concern.

## Rule severity

Every rule is either `required` or `recommended`.

### Required

A required rule represents a contract that must be satisfied for the applicable component/platform to be considered ready.

A violated required rule produces `fail`.

Examples:

- a component declares controlled support but the required controlled contract is missing
- an interactive web component declares keyboard support but the required keyboard behavior is absent
- a supported React Native component is missing required accessibility state semantics

### Recommended

A recommended rule describes a meaningful improvement that does not block readiness in V1.

A violated recommended rule produces `warn`.

Examples:

- a useful additional Storybook state is missing
- documentation could include a recommended platform note
- a non-critical conformity improvement is available

The future checker must not silently promote recommended findings to blocking failures.

## Result states

V1 has four result states:

- `pass` — the applicable contract is satisfied
- `warn` — a recommended contract is not satisfied
- `fail` — a required contract is not satisfied
- `not-applicable` — the rule does not apply to this component/platform

There is deliberately no numeric score in V1.

## Aggregation

Aggregation follows severity rather than arithmetic scoring.

For a platform or component result:

1. any applicable `fail` makes the aggregate result `fail`
2. otherwise, any applicable `warn` makes the aggregate result `warn`
3. otherwise, any applicable `pass` makes the aggregate result `pass`
4. if every evaluated rule is `not-applicable`, the aggregate result is `not-applicable`

`not-applicable` never lowers an aggregate result.

This ordering is deterministic and intentionally simple:

`fail > warn > pass > not-applicable`

The component aggregate is derived from its applicable platform results plus component-wide findings such as package/export contracts.

## Platform model

`react` and `react-native` quality are evaluated independently.

A cross-platform component is not required to have identical:

- DOM and React Native APIs
- keyboard and touch behavior
- focus implementation
- portal/presentation strategy
- semantic role implementation
- layout structure
- visual presentation mechanics

Instead, each platform is evaluated against the rules that are applicable to that platform and the component capabilities declared in metadata.

### Intentional divergence

Intentional platform divergence is neutral by default. A difference becomes a quality finding only when one platform violates its own explicit contract.

For example, an overlay may use a browser portal, focus trap, Escape handling, and ARIA relationships on React while React Native uses native presentation, back handling, touch dismissal, and native accessibility state. This is valid Vellira parity when both implementations satisfy their platform requirements.

V1 therefore does not define a generic "React and React Native implementations must match" rule.

## Automated vs human-review-only criteria

Every quality rule declares an evaluation kind:

- `automated`
- `human-review`

### Automated

Automated rules must be deterministic enough to run repeatedly with stable outcomes and actionable evidence.

Suitable examples include:

- declared artifact or export reachability
- metadata-to-implementation consistency
- supported platform checks
- deterministic accessibility requirements
- capability-driven test/story/docs contracts
- prohibited hardcoded values when the project convention is explicit

### Human review

Human-review-only criteria cover areas where V1 cannot provide a reliable deterministic contract.

Examples include:

- whether an API is aesthetically elegant
- whether a component visually feels polished
- whether native UX feels idiomatic in a subjective interaction flow
- whether documentation prose is exceptionally clear
- whether a complex animation feels appropriate

Human-review rules may be represented in the same model for traceability, but the future automated checker must not invent PASS/FAIL results for them without explicit human input.

## Metadata integration boundary

`@vellira-ui/metadata` remains the source of component intent, including:

- supported platforms
- component profile
- capabilities
- dependencies
- required tests
- required Storybook coverage
- required documentation
- required accessibility coverage
- token requirements

The quality model consumes that intent; it does not copy those fields into a second component schema.

Examples:

- `capabilities: ['controlled', 'uncontrolled']` can make controlled/uncontrolled quality rules applicable
- `platforms: ['react-native']` makes React-only rules `not-applicable`
- `requirements.accessibility: false` makes generic accessibility artifact requirements inapplicable, while a separately defined required platform contract may still apply if explicitly declared by future rules
- `requirements.tokens` can make token-conformity rules applicable

If future quality rules need additional deterministic component intent, that intent should be added deliberately to component metadata rather than hidden inside checker code.

## Relationship to completeness checks

Completeness and quality are related but not interchangeable.

The existing completeness checker primarily answers questions such as:

- does an implementation exist?
- are types/exports/tests/Storybook/docs present?
- are required registrations present?

The quality checker should answer stronger questions such as:

- does the public API satisfy the declared contract?
- are important declared capabilities meaningfully tested?
- does accessibility behavior satisfy platform expectations?
- are token and design-system conventions followed?

A completeness failure can be consumed as a required quality finding where appropriate, but V1 should avoid running duplicate checks merely to produce a second copy of the same error.

## Machine-readable contract

The public type contract lives in `@vellira-ui/metadata` and is exported from `packages/metadata/src/quality.ts`.

Representative output:

```json
{
  "schemaVersion": "1",
  "components": [
    {
      "componentName": "Select",
      "status": "warn",
      "platforms": [
        {
          "platform": "react",
          "status": "pass",
          "findings": []
        },
        {
          "platform": "react-native",
          "status": "warn",
          "findings": [
            {
              "ruleId": "docs.native-platform-notes",
              "dimension": "documentation",
              "severity": "recommended",
              "evaluation": "automated",
              "status": "warn",
              "platform": "react-native",
              "message": "Native-specific presentation notes are missing."
            }
          ]
        }
      ],
      "findings": []
    }
  ]
}
```

Evidence is represented as a list of stable strings in V1 so future rules can attach file paths, symbols, or concise source references without forcing one evidence format onto every rule family.

Timestamps, execution duration, Git SHA, CI URLs, and similar run metadata are intentionally excluded from the core V1 report contract. A runner may wrap or accompany the report with execution metadata later without destabilizing the quality result schema.

## Representative examples

### Simple primitive: Button

A primitive Button may have required rules for:

- public export/type reachability
- disabled behavior
- accessible naming
- required tests
- token usage

A keyboard-navigation rule may be `not-applicable` if Button relies on native button semantics and no additional keyboard contract is declared.

### Interactive web component: Dropdown

A React Dropdown may have required rules for:

- compound public API
- keyboard navigation
- focus movement/restore where declared
- Escape/outside dismissal
- ARIA roles and accessible naming
- interaction test coverage

Missing a required keyboard contract produces `fail`. Missing a recommended extra Storybook scenario produces `warn`.

### React Native component: Checkbox

A React Native Checkbox is evaluated against native requirements such as:

- press interaction
- `accessibilityRole`
- accessible naming strategy
- `accessibilityState` for checked/disabled state
- touch-target expectations when deterministically declared

DOM roles, browser keyboard events, CSS selectors, and ARIA attributes are `not-applicable`.

### Cross-platform overlay with intentional divergence: Modal

React may be required to satisfy:

- portal behavior
- focus trap/restore
- Escape dismissal
- browser accessibility relationships

React Native may instead be required to satisfy:

- native modal/presentation behavior
- back/dismiss handling
- touch interaction
- native accessibility semantics

The implementations can be structurally and behaviorally different while both receiving `pass`.

## Rule identifiers

Rule IDs should be stable, namespaced strings such as:

- `api.controlled-contract`
- `a11y.web.accessible-name`
- `a11y.native.accessibility-state`
- `tests.declared-capabilities`
- `conformity.token-usage`

Renaming a rule ID should be treated as a report-contract change because CI, fixtures, and future automation may reference it.

## V1 boundaries

This model does not implement:

- Component Quality Checker CLI or orchestration
- executable rule registration
- API/feature quality rules
- accessibility/platform quality rules
- tests/Storybook/docs quality rules
- design-system conformity rules
- regression fixtures for those rule families
- CI enforcement
- automatic fixes
- AI-based scoring or review
- visual regression testing
- numeric quality scores

Those concerns belong to follow-up issues #517 through #523 or later dedicated work.

## Follow-up mapping

- #517 — checker core, rule registration, aggregation, CLI, report emission
- #518 — API and feature coverage rules
- #519 — accessibility and platform quality rules
- #520 — tests, Storybook, and documentation coverage rules
- #521 — design-system conformity rules
- #522 — fixtures and regression tests
- #523 — CI integration and staged enforcement

This separation is intentional: #516 defines the contract; the following issues implement and prove it.
