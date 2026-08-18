# Component Quality Checker

## CI enforcement rollout

Component Quality Checker V1 initially runs in advisory mode so the rule set can
be calibrated against real repository changes before quality failures become
blocking.

### Advisory mode

`COMPONENT_QUALITY_ENFORCEMENT=advisory`

- `PASS` is non-blocking.
- `WARN` is non-blocking.
- `FAIL` is reported with exit code `1` but does not block CI.
- `not-applicable` is neutral.
- Runtime/configuration errors use exit code `2` and remain blocking.
- Machine-readable JSON reports are retained as CI artifacts.

### Enabling blocking enforcement

Switch to:

`COMPONENT_QUALITY_ENFORCEMENT=blocking`

only when:

- the V1 rule set has regression coverage;
- representative Web, React Native, and cross-platform fixtures are covered;
- intentional Web / React Native implementation divergence is covered;
- known false positives have regression tests;
- the checker has completed a calibration period in real CI;
- no unresolved systematic false positives remain;
- existing stable components do not produce unexplained `FAIL` results;
- machine-readable and human-readable output remain deterministic;
- runtime failures remain distinguishable from component quality failures.

Switching enforcement mode must not require changes to checker semantics or
rule implementations.

### Blocking mode

- `PASS` remains non-blocking.
- `WARN` remains non-blocking.
- `FAIL` blocks CI with exit code `1`.
- Runtime/configuration errors block CI with exit code `2`.
- `not-applicable` remains neutral.
- Machine-readable reports continue to be retained.

### CI report

CI generates the machine-readable report with:

`pnpm check:component-quality:json`

and uploads `.artifacts/component-quality/report.json` as the
`component-quality-report` artifact.

## GitHub issue synchronization

The issue synchronization layer is separate from the checker engine. It consumes
the V1 report, normalizes actionable findings, plans deterministic lifecycle
operations, and only then applies GitHub mutations.

Default synchronization policy:

- `FAIL` findings are actionable.
- `WARN` findings are ignored unless `--warn` is passed explicitly.
- `PASS` and `not-applicable` never create issues.
- managed issues are identified by a stable HTML marker derived from component,
  platform, and rule identity.
- unmanaged issues are never modified by the synchronizer.

Preview operations without mutations:

`pnpm component-quality:issues --dry-run`

Synchronize FAIL findings:

`GITHUB_TOKEN=... pnpm component-quality:issues`

Include WARN findings explicitly:

`GITHUB_TOKEN=... pnpm component-quality:issues --warn`

Consume an existing machine-readable report instead of running the checker:

`pnpm component-quality:issues --dry-run --report .artifacts/component-quality/report.json`

The repository defaults to `vellira-dev/vellira` and can be overridden with
`--repo owner/name` or `GITHUB_REPOSITORY`. GitHub labels are applied only when
the corresponding labels already exist in the target repository.

The planner supports deterministic `create`, `update`, `close`, and `reopen`
operations. Closing and reopening managed issues is marked automatically in the
issue lifecycle. This design is intended to be callable later from a scheduled
or post-main GitHub Actions workflow without coupling GitHub connectivity to the
core quality checker.
