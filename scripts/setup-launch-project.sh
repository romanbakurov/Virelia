#!/usr/bin/env bash

set -euo pipefail

OWNER="vellira-dev"
REPO="vellira-dev/vellira"
PROJECT_NUMBER="1"

PROJECT_ID="PVT_kwDOEdzDys4BgQEQ"

STATUS_FIELD="PVTSSF_lADOEdzDys4BgQEQzhadHMw"
AREA_FIELD="PVTSSF_lADOEdzDys4BgQEQzhadNhc"

STATUS_BACKLOG="f75ad846"
STATUS_READY="2fa88c24"

AREA_COMPONENTS="12386018"
AREA_GENERATORS="dff7063e"
AREA_METADATA="fe620412"
AREA_QUALITY="0e9d5d51"
AREA_DOCS="c5190904"
AREA_WEBSITE="dcee9668"
AREA_OPEN_SOURCE="6c2ca50e"
AREA_MARKETING="ea850b68"

configure_issue() {
  local number="$1"
  local status="$2"
  local area="$3"

  local url="https://github.com/$REPO/issues/$number"

  echo
  echo "⚙️  #$number"

  # item-add is idempotent: if the issue is already in the project,
  # GitHub returns the existing project item.
  local item_id

  item_id="$(
    gh project item-add "$PROJECT_NUMBER" \
      --owner "$OWNER" \
      --url "$url" \
      --format json \
      --jq '.id'
  )"

  if [[ -z "$item_id" ]]; then
    echo "❌ Could not resolve project item for #$number"
    exit 1
  fi

  gh project item-edit \
    --id "$item_id" \
    --project-id "$PROJECT_ID" \
    --field-id "$STATUS_FIELD" \
    --single-select-option-id "$status" \
    >/dev/null

  gh project item-edit \
    --id "$item_id" \
    --project-id "$PROJECT_ID" \
    --field-id "$AREA_FIELD" \
    --single-select-option-id "$area" \
    >/dev/null

  echo "✅ #$number configured"
}

echo "🚀 Configuring Vellira Public Launch project"

# Ready — immediate work
configure_issue 426 "$STATUS_READY" "$AREA_COMPONENTS"
configure_issue 427 "$STATUS_READY" "$AREA_GENERATORS"
configure_issue 428 "$STATUS_READY" "$AREA_GENERATORS"

# Backlog — automation foundation
configure_issue 429 "$STATUS_BACKLOG" "$AREA_METADATA"
configure_issue 430 "$STATUS_BACKLOG" "$AREA_QUALITY"
configure_issue 431 "$STATUS_BACKLOG" "$AREA_QUALITY"

# Backlog — component launch set
configure_issue 432 "$STATUS_BACKLOG" "$AREA_COMPONENTS"
configure_issue 433 "$STATUS_BACKLOG" "$AREA_QUALITY"
configure_issue 434 "$STATUS_BACKLOG" "$AREA_QUALITY"
configure_issue 435 "$STATUS_BACKLOG" "$AREA_QUALITY"

# Backlog — docs / website
configure_issue 436 "$STATUS_BACKLOG" "$AREA_DOCS"
configure_issue 437 "$STATUS_BACKLOG" "$AREA_WEBSITE"
configure_issue 438 "$STATUS_BACKLOG" "$AREA_DOCS"
configure_issue 439 "$STATUS_BACKLOG" "$AREA_DOCS"
configure_issue 440 "$STATUS_BACKLOG" "$AREA_QUALITY"
configure_issue 441 "$STATUS_BACKLOG" "$AREA_WEBSITE"
configure_issue 442 "$STATUS_BACKLOG" "$AREA_WEBSITE"

# Backlog — consumer validation
configure_issue 443 "$STATUS_BACKLOG" "$AREA_QUALITY"
configure_issue 444 "$STATUS_BACKLOG" "$AREA_QUALITY"
configure_issue 445 "$STATUS_BACKLOG" "$AREA_QUALITY"

# Backlog — final QA / open source
configure_issue 446 "$STATUS_BACKLOG" "$AREA_QUALITY"
configure_issue 447 "$STATUS_BACKLOG" "$AREA_OPEN_SOURCE"

# Backlog — marketing
configure_issue 448 "$STATUS_BACKLOG" "$AREA_MARKETING"
configure_issue 449 "$STATUS_BACKLOG" "$AREA_MARKETING"
configure_issue 450 "$STATUS_BACKLOG" "$AREA_MARKETING"

echo
echo "============================================================"
echo "✅ Vellira Public Launch project configured"
echo "============================================================"
echo
echo "Ready:"
echo "  #426 FormField"
echo "  #427 Component generator V1"
echo "  #428 Website component-page generator V1"
echo
echo "All remaining launch issues: Backlog"
