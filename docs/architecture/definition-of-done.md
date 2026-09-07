# Repository Definition of Done

## Status

Canonical governance contract for all Vellira issues and pull requests.

This document applies to human contributors, coding agents, review agents, and
future model sessions. Entry-point documentation may summarize or link to this
contract, but must not replace it with a weaker local definition of Done.

## Core rule

A Vellira task is **not Done, merge-ready, or safe to close** until its entire
accepted scope is proven on the **exact final HEAD**.

Green CI is necessary when required, but it is not sufficient by itself. If an
acceptance criterion, baseline condition, or known in-scope correctness concern
is still unproven, the task remains open.

Local or manual success is not authoritative when the repository requires CI,
canonical visual validation, generated-output checks, or another repository-owned
gate.

## Definition of Done

Before any issue or pull request is called Done or merge-ready, all applicable
items below must be true.

### 1. Accepted scope is complete

- Every acceptance criterion and explicit in-scope requirement is implemented or
  explicitly resolved.
- No known in-scope TODO, compatibility gap, bypass, stale metadata, orphan
  contract, temporary assertion, workaround, or deferred correctness issue
  remains.
- If a requirement cannot be completed inside the current scope, keep the issue
  open or explicitly change the accepted scope before merge. Do not silently
  defer it while still claiming the original task is complete.

### 2. Existing baseline is validated when relevant

- When a task introduces or changes a repository-wide rule, architecture
  contract, generator behavior, quality gate, metadata contract, or shared
  resource, validate the relevant maintained repository baseline rather than
  only a new fixture or happy path.
- A new gate must not pass merely because an existing in-scope component or
  resource is accidentally ignored.
- Existing valid platform differences must remain valid unless the accepted scope
  explicitly changes them.

### 3. Regression evidence exists

- Bug fixes and architecture fixes include deterministic positive coverage for
  the intended valid behavior or structure.
- They also include deterministic negative coverage for the failure mode that
  must not recur.
- Prefer machine-readable contracts, type/AST evidence, repository structure, or
  behavioral assertions over fragile substring checks when practical.

### 4. All affected lifecycle surfaces agree

When a task spans generated or derived artifacts, validate every affected path.
Examples include:

- planning and preflight;
- dry-run, write, force, and check modes;
- source implementation and public exports;
- shared types and renderer adapters;
- metadata and dependency/resource declarations;
- tokens, icons, assets, and shared core dependencies;
- tests and Storybook;
- API docs, component docs, and website pages;
- completeness and quality rules.

A successful result in one surface must not hide drift in another.

### 5. Required validation passes

Run every repository-owned validation applicable to the change. Depending on
scope, this can include:

- formatting and lint;
- source/package-boundary checks;
- completeness and component quality;
- builds and documentation builds;
- TypeScript and tooling typechecks;
- public API and generated API checks;
- unit, integration, tooling, coverage, and end-to-end tests;
- Storybook validation;
- package smoke tests;
- canonical visual regression.

Do not describe a task as green when only an earlier commit or a partial subset
of required validation passed.

### 6. Visual integrity is proven when applicable

If renderer output, styling, tokens, component factories, layout, interaction
states, or screenshot-producing infrastructure can affect visuals:

- use the repository-owned canonical visual environment;
- unexpected visual diffs block completion;
- do not approve a change by weakening thresholds, blindly updating snapshots,
  or hiding a design/token change unless that change is explicitly in scope and
  reviewed.

### 7. Final diff review is complete

Before merge, review the final diff against the accepted scope and confirm:

- no unrelated changes are present;
- tests or checks were not weakened to make the change pass;
- no hidden snapshot, threshold, public API, token, metadata, or dependency
  bypass was introduced;
- generated outputs are current where required;
- comments, docs, metadata, and code describe the same architecture;
- no known in-scope debt remains.

### 8. Evidence belongs to the exact final HEAD

Validation evidence must correspond to the final commit being considered for
merge.

If the branch changes after a successful run, the prior result is not evidence
for the new HEAD unless the repository can deterministically prove the affected
validation is unchanged. The default is to rerun the authoritative checks.

### 9. Closure is verified

When an issue is intended to close through a pull request:

- merge only after the task satisfies this Definition of Done;
- confirm the expected merge/main state when the workflow requires it;
- confirm the issue is actually closed/completed;
- do not report a task as closed based only on an open PR or local implementation.

## Launch-critical strengthening

Issues or pull requests labeled `launch-blocker` or `launch-critical-path` use the
same Definition of Done with stricter evidence requirements:

- the complete applicable validation matrix is required before merge;
- relevant maintained baseline coverage must be explicit;
- no known in-scope correctness or compatibility debt may be deferred;
- final exact-HEAD evidence and diff review must be recorded clearly enough for a
  later reviewer or model session to reconstruct why the change was considered
  complete.

Launch urgency is never a reason to weaken the Definition of Done.

## What does not count as Done

None of the following is sufficient on its own:

- "the main implementation is finished";
- "most acceptance criteria pass";
- "the happy-path fixture passes";
- "CI was green before the last commit";
- "the checker is advisory";
- "the remaining gap can be fixed later";
- "the generated files exist";
- "the code compiles";
- "the PR is mergeable".

The task is Done only when the accepted scope and its required evidence are
complete together.
