#!/usr/bin/env bash

set -euo pipefail

REPO="vellira-dev/vellira"
ASSIGNEE="romanbakurov"

if ! command -v gh >/dev/null 2>&1; then
  echo "❌ GitHub CLI (gh) is not installed."
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "❌ python3 is required for duplicate detection."
  exit 1
fi

echo "🚀 Creating Vellira Public Launch backlog"
echo "Repository: $REPO"
echo

create_issue() {
  local title="$1"
  local body_file
  local existing

  body_file="$(mktemp)"
  cat >"$body_file"

  existing="$(
    gh issue list \
      --repo "$REPO" \
      --state all \
      --search "\"$title\" in:title" \
      --limit 100 \
      --json title,url |
      python3 -c '
import json
import sys

title = sys.argv[1]
items = json.load(sys.stdin)

for item in items:
    if item.get("title") == title:
        print(item.get("url", ""))
        break
' "$title"
  )"

  if [[ -n "$existing" ]]; then
    echo "⏭️  SKIP: $title"
    echo "    $existing"
    rm -f "$body_file"
    return
  fi

  echo "➕ CREATE: $title"

  gh issue create \
    --repo "$REPO" \
    --title "$title" \
    --body-file "$body_file" \
    --assignee "$ASSIGNEE"

  rm -f "$body_file"
  echo
}

# -----------------------------------------------------------------------------
# TOOLING
# -----------------------------------------------------------------------------

create_issue "feat(tooling): finalize component generator V1" <<'EOF'
## Goal

Finalize the first production-ready Vellira component generator so new components start from the canonical repository structure instead of repeated manual setup.

## Acceptance criteria

- [ ] Generate the canonical component structure
- [ ] Generate TypeScript types where applicable
- [ ] Generate unit test scaffolding
- [ ] Generate Storybook story scaffolding
- [ ] Generate documentation scaffolding
- [ ] Register required package exports
- [ ] Support React and React Native targets where applicable
- [ ] Validate component names and target paths
- [ ] Prevent accidental destructive overwrites by default
- [ ] Support an explicit force/overwrite workflow where needed
- [ ] Make repeated runs predictable and safe
- [ ] Add generator tests
- [ ] Document the command and expected output
- [ ] Pass lint, typecheck, and relevant tests

## Definition of done

A new Vellira component can be scaffolded from one command with the expected implementation, tests, stories, documentation, exports, and registrations.
EOF

create_issue "feat(tooling): finalize website component-page generator V1" <<'EOF'
## Goal

Finalize generation of website catalog pages for Vellira components.

## Acceptance criteria

- [ ] Generate the canonical component page structure
- [ ] Generate component playground integration
- [ ] Generate usage examples
- [ ] Generate or register component metadata required by the website
- [ ] Generate navigation/catalog registration where required
- [ ] Support safe overwrite behavior
- [ ] Support an explicit force workflow
- [ ] Ensure repeated generation is predictable
- [ ] Validate generated imports
- [ ] Add generator tests
- [ ] Verify website typecheck and build

## Definition of done

A component website page can be created or regenerated through one documented command without manual structural setup.
EOF

# -----------------------------------------------------------------------------
# METADATA / AUTOMATION
# -----------------------------------------------------------------------------

create_issue "feat(metadata): define component metadata schema V1" <<'EOF'
## Goal

Introduce a small machine-readable component metadata schema that becomes the source of truth for Vellira tooling.

## Acceptance criteria

- [ ] Define component name
- [ ] Define category
- [ ] Define supported platforms
- [ ] Define component status
- [ ] Define supported features/capabilities
- [ ] Define relevant dependencies
- [ ] Define token requirements where applicable
- [ ] Define accessibility requirements
- [ ] Define documentation requirements
- [ ] Define test requirements
- [ ] Define Storybook requirements
- [ ] Add schema validation
- [ ] Document the V1 schema

## Non-goals

- Universal schema for every future Vellira product
- V2/enterprise requirements
- Premature AI-specific abstractions

## Definition of done

Current Vellira components can be described by a stable, validated V1 metadata contract usable by generators and checks.
EOF

create_issue "feat(tooling): implement component completeness checker" <<'EOF'
## Goal

Create a command that reports whether a Vellira component satisfies the repository's required implementation and quality contract.

## Acceptance criteria

- [ ] Read component metadata
- [ ] Check implementation presence
- [ ] Check public types
- [ ] Check package exports
- [ ] Check unit tests
- [ ] Check Storybook coverage
- [ ] Check website documentation
- [ ] Check generated/API documentation
- [ ] Check token requirements where applicable
- [ ] Check accessibility requirements
- [ ] Produce clear pass/fail output
- [ ] Return a non-zero exit code for incomplete components
- [ ] Support checking one component
- [ ] Support checking all launch components
- [ ] Add tests for checker behavior

## Expected result

Example:

```text
Select

Implementation   ✓
Types            ✓
Exports          ✓
Tests            ✓
Storybook        ✓
Website          ✓
API Docs         ✓
Tokens           ✓
Accessibility    ✓

READY

Definition of done

The checker reliably reports READY or INCOMPLETE and identifies missing requirements.
EOF

create_issue "ci: enforce component completeness checks" <<'EOF'

Goal

Run component completeness validation automatically in CI.

Acceptance criteria
 Add the completeness checker to the appropriate CI workflow
 Fail CI when required component artifacts are missing
 Keep local and CI behavior consistent
 Produce actionable failure output
 Avoid unnecessary duplicate work in the pipeline
 Document how to run the same check locally
Definition of done

A component cannot silently lose required tests, stories, documentation, exports, or other declared requirements without CI detecting it.
EOF

# -----------------------------------------------------------------------------
# COMPONENT SET
# -----------------------------------------------------------------------------

create_issue "feat(components): complete the public launch component set" <<'EOF'

Goal

Reach the agreed public-launch component baseline without delaying launch for an unnecessarily large catalog.

Acceptance criteria
 Finalize the launch component list
 Reach approximately 15–20 production-ready components
 Track each substantial new component separately
 Require launch components to pass the component completeness contract
 Ensure components cover a convincing baseline for real application UI
 Avoid expanding scope solely to increase component count
Definition of done

Vellira has a focused launch catalog of roughly 15–20 high-quality components and no obvious foundational gap that would make the public release misleading.
EOF

create_issue "refactor(api): audit launch component public APIs" <<'EOF'

Goal

Perform a final API consistency audit across all components included in the public launch.

Acceptance criteria
 Review naming consistency
 Review controlled/uncontrolled APIs where applicable
 Review disabled/loading/error/required states
 Review event naming and payloads
 Review compound APIs
 Review TypeScript public contracts
 Review React and React Native parity where claimed
 Verify package exports
 Document intentional platform differences
Definition of done

Launch component APIs are coherent, intentional, and free of obvious inconsistencies that would require avoidable breaking changes immediately after launch.
EOF

create_issue "test(a11y): audit launch components for accessibility" <<'EOF'

Goal

Perform a final accessibility review of all launch components.

Acceptance criteria
 Verify semantic roles
 Verify labels and descriptions
 Verify required and invalid states
 Verify keyboard interaction
 Verify focus management
 Verify disabled behavior
 Verify accessible names for icon-only controls
 Verify relationships such as aria-describedby where applicable
 Add regression tests for discovered gaps
 Document intentional platform-specific behavior
Definition of done

All launch components meet Vellira's intended accessibility baseline and discovered regressions are covered by tests.
EOF

create_issue "test(components): close test coverage gaps for launch components" <<'EOF'

Goal

Ensure every public-launch component has meaningful automated coverage.

Acceptance criteria
 Identify launch components with missing or weak tests
 Cover core rendering behavior
 Cover important states
 Cover user interaction
 Cover controlled/uncontrolled behavior where applicable
 Cover keyboard behavior where applicable
 Cover accessibility regressions where practical
 Ensure the full test suite passes
Definition of done

There are no obvious untested critical behaviors in the launch component set.
EOF

# -----------------------------------------------------------------------------
# DOCS / WEBSITE
# -----------------------------------------------------------------------------

create_issue "docs(components): complete documentation for all launch components" <<'EOF'

Goal

Ensure every launch component has complete and useful documentation.

Acceptance criteria
 Add or verify component overview
 Add installation/import information where relevant
 Add basic usage
 Document important variants and states
 Document accessibility considerations
 Document public API
 Verify all code examples
 Verify links and navigation
 Ensure documentation matches the released implementation
Definition of done

A developer can understand and use every launch component without reading its implementation source.
EOF

create_issue "feat(website): complete catalog pages for all launch components" <<'EOF'

Goal

Ensure every launch component is represented in the Vellira website component catalog.

Acceptance criteria
 Add a page for every launch component
 Verify playground/preview behavior
 Verify examples
 Verify component metadata
 Verify navigation/catalog registration
 Verify mobile layout
 Verify page metadata/SEO basics
 Verify website typecheck
 Verify production build
Definition of done

The public website accurately represents the full launch component catalog.
EOF

create_issue "docs: verify installation and examples from scratch" <<'EOF'

Goal

Validate documentation from the perspective of a developer who has never used Vellira.

Acceptance criteria
 Follow installation instructions in a clean environment
 Verify package names and versions
 Verify required stylesheet imports
 Verify copy-pasted examples compile
 Verify referenced APIs still exist
 Fix stale or ambiguous instructions
 Verify links between website and docs
Definition of done

A new user can install and begin using Vellira by following the published documentation without undocumented setup steps.
EOF

create_issue "docs(api): standardize launch component API documentation" <<'EOF'

Goal

Bring launch component API documentation to one consistent format.

Acceptance criteria
 Standardize property descriptions
 Standardize defaults
 Standardize union/variant presentation
 Document compound APIs consistently
 Document platform-specific differences
 Verify generated API documentation is current
 Remove stale API references
Definition of done

API documentation for the launch component set follows one consistent structure and matches the published TypeScript API.
EOF

create_issue "test(storybook): audit launch component story coverage" <<'EOF'

Goal

Make Storybook a reliable visual and behavioral reference for the public launch component set.

Acceptance criteria
 Ensure every launch component has Storybook coverage
 Cover important variants
 Cover disabled states
 Cover loading/error states where applicable
 Cover edge cases that are useful during visual review
 Verify interaction stories where appropriate
 Verify Storybook build
Definition of done

Every launch component can be meaningfully reviewed through Storybook.
EOF

create_issue "feat(website): finalize launch CTAs and navigation" <<'EOF'

Goal

Make the website clearly guide visitors from discovery to installation, documentation, and GitHub.

Acceptance criteria
 Review primary landing-page CTA
 Verify install CTA
 Verify documentation CTA
 Verify GitHub CTA
 Review component catalog navigation
 Remove dead or placeholder navigation
 Verify mobile navigation
 Verify all primary links
Definition of done

A new visitor can quickly understand what Vellira is and reach installation, docs, components, and source code without friction.
EOF

create_issue "test(website): perform mobile, SEO, and analytics launch audit" <<'EOF'

Goal

Perform the final launch-readiness audit of the public website.

Acceptance criteria
 Review important pages on mobile
 Verify titles and meta descriptions
 Verify canonical URLs
 Verify Open Graph metadata/images
 Verify sitemap/indexing configuration
 Verify analytics is collecting expected events/page views
 Review obvious Lighthouse regressions
 Fix broken links
 Verify production deployment
Definition of done

The website is technically ready to receive public launch traffic.
EOF

# -----------------------------------------------------------------------------
# CONSUMER TESTING
# -----------------------------------------------------------------------------

create_issue "test(consumer): validate React package in a clean Vite app" <<'EOF'

Goal

Validate the published React package as a real external Vite consumer.

Acceptance criteria
 Create or reset a clean Vite test app
 Install Vellira using the public package interface
 Import required styles
 Render representative components
 Verify TypeScript
 Verify development mode
 Verify production build
 Verify package exports resolve correctly
 Record and fix any consumer-only issues
Definition of done

A clean Vite application can consume the published React package without repository-specific assumptions.
EOF

create_issue "test(consumer): validate React package in a clean Next.js app" <<'EOF'

Goal

Validate the published React package in a clean Next.js application.

Acceptance criteria
 Create or reset a clean Next.js consumer
 Install Vellira through the public package interface
 Verify required stylesheet setup
 Render representative components
 Verify client/server boundaries
 Verify TypeScript
 Verify development mode
 Verify production build
 Record and fix consumer-only issues
Definition of done

A clean Next.js application can consume Vellira without special monorepo configuration.
EOF

create_issue "test(consumer): validate React Native package in a clean Expo app" <<'EOF'

Goal

Validate the published React Native package in a clean Expo application.

Acceptance criteria
 Create or reset a clean Expo consumer
 Install Vellira through the public package interface
 Render representative native components
 Verify TypeScript
 Verify Expo dependency compatibility
 Verify iOS startup
 Verify Android startup where practical
 Verify production-oriented build/config assumptions
 Record and fix consumer-only issues
Definition of done

A clean Expo project can consume the Vellira React Native package without monorepo-specific setup.
EOF

# -----------------------------------------------------------------------------
# FINAL QA / OPEN SOURCE
# -----------------------------------------------------------------------------

create_issue "test(release): perform final public launch QA" <<'EOF'

Goal

Run the final release gate before active public promotion.

Acceptance criteria
 All launch blockers are closed
 All launch components pass completeness checks
 Lint passes
 Typecheck passes
 Unit tests pass
 Relevant E2E tests pass
 Storybook builds
 Docs build
 Website builds
 Consumer tests pass
 npm package exports are verified
 No known critical bugs remain
 Published docs match the package API
Definition of done

Vellira is technically ready for active public launch and marketing.
EOF

create_issue "chore(github): audit repository launch readiness" <<'EOF'

Goal

Perform a final open-source repository audit before public promotion.

Acceptance criteria
 Verify README
 Verify CONTRIBUTING documentation
 Verify SECURITY policy
 Verify Code of Conduct
 Verify issue templates
 Verify pull request template
 Verify repository description
 Verify homepage URL
 Verify repository topics
 Verify social preview
 Verify license
 Remove obvious stale launch-facing information
Definition of done

The GitHub repository presents Vellira as a mature, understandable, and contribution-ready open-source project.
EOF

# -----------------------------------------------------------------------------
# MARKETING
# -----------------------------------------------------------------------------

create_issue "marketing: define Vellira public launch positioning" <<'EOF'

Goal

Define a clear and repeatable message for the Vellira public launch.

Acceptance criteria
 Define one-sentence positioning
 Define short product description
 Define target developer audience
 Define primary differentiators
 Explain React + React Native positioning
 Explain TypeScript-first positioning
 Decide how automation/tooling fits the story
 Define the core launch narrative
 Keep claims factual and demonstrable
Definition of done

Website copy, launch posts, articles, and repository messaging can all use one coherent product story.
EOF

create_issue "marketing: prepare public launch assets and announcements" <<'EOF'

Goal

Prepare the material needed to actively announce Vellira once final QA is complete.

Acceptance criteria
 Prepare GitHub launch/update copy
 Prepare Dev.to version
 Prepare Hashnode version
 Prepare Reddit version
 Prepare LinkedIn version
 Prepare X version
 Prepare Show HN submission
 Prepare Vellira website announcement
 Prepare screenshots or short demos where useful
 Verify all launch links
Definition of done

Vellira can be announced across the selected channels without needing another large preparation phase after technical completion.
EOF

create_issue "docs(blog): publish the first Vellira engineering article" <<'EOF'

Goal

Publish a substantive engineering article that gives developers a reason to discover Vellira beyond a generic product announcement.

Candidate topics
Building a design system that checks whether its own components are complete
Automating component creation with Vellira generators
Building one design system for React and React Native
Building and maintaining a design system as a solo developer
Acceptance criteria
 Select one focused technical topic
 Include real Vellira architecture or tooling examples
 Explain the engineering problem
 Explain the design decisions
 Include practical code/output where useful
 Link naturally to Vellira documentation and GitHub
 Publish on the chosen primary channel
 Repurpose or cross-post where appropriate
Definition of done

At least one substantial technical article is publicly available as part of the Vellira launch campaign.
EOF

echo
echo "============================================================"
echo "✅ Vellira Public Launch issue creation finished"
echo "============================================================"
echo
echo "Existing issues were skipped automatically."
echo
echo "Next:"
echo " gh issue list --repo $REPO --state open --limit 100"
echo
