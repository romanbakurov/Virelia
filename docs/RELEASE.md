# Release

Vellira releases are automated. Package versions and publishing should be driven
by CI and release tooling, not by manual edits.

## Versioning

Vellira follows Semantic Versioning.

| Version | Use for                                     |
| ------- | ------------------------------------------- |
| Patch   | Bug fixes, documentation, internal cleanup  |
| Minor   | New backwards-compatible APIs or components |
| Major   | Breaking changes to public APIs or behavior |

Breaking changes must be documented with migration notes.

## Before Release

Run focused checks while developing:

```bash
pnpm format:check
pnpm typecheck
pnpm test
pnpm docs:api:check
pnpm check:public-api
pnpm docs:build
```

Run the full CI gate before release-sensitive changes:

```bash
pnpm ci
```

## API Documentation

Public API docs are generated from source types.

Generate:

```bash
pnpm docs:api
```

Check:

```bash
pnpm docs:api:check
```

If API docs change, verify that the source API change is intentional and that
README and VitePress docs are updated as well.

## Public API Snapshots

Public package exports are checked by:

```bash
pnpm check:public-api
```

If a symbol is intentionally added or removed, update the public API snapshot in
the same change and document the new contract.

## Token Releases

When token source changes:

```bash
pnpm --filter @vellira-ui/tokens generate:types
pnpm --filter @vellira-ui/tokens test
```

Token updates may affect both Web CSS variables and Native theme objects. Update
documentation examples when paths change.

## Package Builds

Build all public packages:

```bash
pnpm build
```

Build renderers only:

```bash
pnpm build:renderers
```

Build docs:

```bash
pnpm docs:build
```

## Smoke Tests

Smoke tests verify that published package surfaces work after build.

```bash
pnpm smoke:web
pnpm smoke:native
pnpm smoke:packages
```

Use smoke tests after changes to exports, build config, package files, or
generated artifacts.

## npm Trusted Publishing

The `Release` workflow publishes packages through npm Trusted Publishing, not a
long-lived npm publish token. The workflow must keep `id-token: write`, use npm
CLI 11.5.1 or newer for the publish command, and must not set `NODE_AUTH_TOKEN`
for the publish step, otherwise npm can fall back to token-based authentication
instead of OIDC.

Configure a Trusted Publisher on npmjs.com for each public package:

- `@vellira-ui/core`
- `@vellira-ui/tokens`
- `@vellira-ui/types`
- `@vellira-ui/icons`
- `@vellira-ui/react`
- `@vellira-ui/react-native`

Use these exact npm settings for each package:

- Provider: GitHub Actions
- Organization or user: `vellira-dev`
- Repository: `vellira`
- Workflow filename: `release.yml`
- Environment name: leave empty unless the GitHub workflow also declares the
  same environment
- Allowed actions: `npm publish`

`@vellira-ui/assets` is intentionally excluded because it is a private workspace
package and is not published to npm.

If npm returns `ERR_PNPM_AUTH_TOKEN_EXCHANGE` with a 404 during publish, the
package's Trusted Publisher entry is missing or does not exactly match the
repository/workflow fields above. npm does not validate those fields when the
configuration is saved, so the mismatch only appears during publish.

The failed `v2.22.2` release tag exists without matching npm packages. Do not
reuse that version. After Trusted Publishing is configured, the next
release-triggering commit should publish the next patch version.

## Changelog

`docs/CHANGELOG.md` contains release notes and migration policy. Release tooling
appends generated release notes below the semantic-release marker.

Release notes should mention:

- new components or props;
- breaking changes;
- migration steps;
- token path changes;
- accessibility behavior changes;
- package export changes.

## Manual Version Edits

Do not manually bump package versions for normal releases. Semantic Release owns
version changes.

Manual version edits are only acceptable for release infrastructure repair and
must be reviewed carefully.
