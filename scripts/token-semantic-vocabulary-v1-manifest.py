from pathlib import Path
import re

path = Path('packages/tokens/src/preservation/token-migrations.ts')
text = path.read_text()

# #883 composes the old secondary/close active->pressed migration directly from
# the baseline names to the final accent/neutral names. Remove the intermediate
# #882 pairs so preservation never records historical chains.
for role in ('secondary', 'close'):
    for field in ('bg', 'fg', 'border'):
        pattern = re.compile(
            r"  \[\n"
            + rf"    'action-{role}-active-{field}',\n"
            + rf"    'semantic\.action\.{role}\.active\.{field}',\n"
            + rf"    'semantic\.action\.{role}\.pressed\.{field}',\n"
            + r"  \],\n"
        )
        text, count = pattern.subn('', text, count=1)
        if count != 1:
            raise SystemExit(
                f'expected one #882 intermediate pair for {role}.active.{field}, found {count}'
            )

visual_marker = "const stateVocabularyVisualApproval =\n  '#879/#882 explicitly authorizes removal of pressed/active semantic conflation; the change stays inside the existing Vellira palette and requires pinned Linux visual regression.';\n"
if visual_marker not in text:
    raise SystemExit('state vocabulary visual approval marker missing')
text = text.replace(
    visual_marker,
    visual_marker
    + "\nconst semanticVocabularyVisualApproval =\n"
    + "  '#879/#883 explicitly authorizes Semantic Vocabulary V1 normalization and the narrowly scoped hierarchy/status corrections inside existing Vellira palettes; token preservation plus pinned Linux visual regression are required evidence.';\n",
    1,
)

insert_marker = ") satisfies readonly TokenMigrationEntry[];\n\n/**\n * Migration/test metadata only."
if text.count(insert_marker) != 1:
    raise SystemExit('migration helper insertion marker missing or ambiguous')

helpers = r'''

const semanticActionRoleRenamePairsV1 = (
  [
    ['secondary', 'accent'],
    ['close', 'neutral'],
  ] as const
).flatMap(([fromRole, toRole]) =>
  (['default', 'hover', 'active', 'muted', 'subtle'] as const).flatMap(
    (fromState) =>
      (['bg', 'fg', 'border'] as const).map((field) => {
        const toState = fromState === 'active' ? 'pressed' : fromState;
        return [
          `action-${fromRole}-${fromState}-${field}`,
          `semantic.action.${fromRole}.${fromState}.${field}`,
          `semantic.action.${toRole}.${toState}.${field}`,
        ] as const;
      })
  )
);

const semanticStatusEmphasisRenamePairsV1 = (
  ['success', 'error', 'warning', 'info'] as const
).map((status) => [
  `status-${status}-strong`,
  `semantic.status.${status}.strong`,
  `semantic.status.${status}.emphasisFg`,
] as const);

const semanticVocabularySimpleRenamePairsV1 = [
  [
    'icons-primary',
    'semantic.icons.primary',
    'semantic.icons.interactive',
  ],
  [
    'icons-hover',
    'semantic.icons.hover',
    'semantic.icons.interactiveHover',
  ],
  [
    'border-focus',
    'semantic.border.focus',
    'semantic.border.interactive',
  ],
  [
    'focus-ring-offset',
    'semantic.focus.ring.offset',
    'semantic.focus.ring.offsetColor',
  ],
  [
    'overlay-popover-bg',
    'semantic.overlay.popover.bg',
    'semantic.overlay.floating.bg',
  ],
  [
    'overlay-popover-border',
    'semantic.overlay.popover.border',
    'semantic.overlay.floating.border',
  ],
  [
    'overlay-modal-bg',
    'semantic.overlay.modal.bg',
    'semantic.overlay.dialog.bg',
  ],
  [
    'overlay-modal-border',
    'semantic.overlay.modal.border',
    'semantic.overlay.dialog.border',
  ],
] as const;

const semanticVocabularyRenamePairsV1 = [
  ...semanticActionRoleRenamePairsV1,
  ...semanticStatusEmphasisRenamePairsV1,
  ...semanticVocabularySimpleRenamePairsV1,
] as const;

const semanticVocabularyRenameMigrationsV1 =
  semanticVocabularyRenamePairsV1.flatMap(([id, from, to]) => [
    {
      id: `883-${id}-rename`,
      kind: 'rename',
      issue: '#883',
      reason:
        'Rename a public semantic role to Semantic Vocabulary V1 while preserving its resolved design value.',
      platforms: ['react-native'],
      from,
      to,
    } as const,
    {
      id: `883-${id}-web-identity`,
      kind: 'representation-change',
      layer: 'platform-output',
      issue: '#883',
      reason:
        'Align the public Web CSS variable identity with the normalized Semantic Vocabulary V1 role.',
      platforms: ['web'],
      from,
      to,
      equivalence:
        'The paired canonical #883 rename preserves the resolved design value; only the public Web CSS variable identity changes.',
      evidence:
        'Token preservation validates the canonical/RN rename; generated CSS and pinned Linux visual regression validate Web output identity.',
    } as const,
  ]) satisfies readonly TokenMigrationEntry[];

const semanticVocabularyRemovalPathsV1 = [
  'semantic.surface.background',
  'semantic.navigation.hover.bg',
  'semantic.navigation.hover.fg',
  'semantic.navigation.active.bg',
  'semantic.navigation.active.fg',
  'semantic.navigation.brandHover.bg',
  'semantic.navigation.brandHover.fg',
  'semantic.navigation.tabHover.fg',
  'semantic.navigation.tabFocus.ring',
  'semantic.navigation.optionHover.bg',
  'semantic.navigation.optionHover.fg',
  'semantic.navigation.optionActive.bg',
  'semantic.navigation.optionActive.fg',
  'semantic.navigation.triggerHover.bg',
  'semantic.navigation.triggerHover.fg',
  'semantic.navigation.border',
] as const;

const semanticVocabularyRemovalMigrationsV1 =
  semanticVocabularyRemovalPathsV1.map((from) => ({
    id: `883-remove-${from.replaceAll('.', '-')}`,
    kind: 'remove',
    issue: '#883',
    reason:
      from === 'semantic.surface.background'
        ? 'Remove the ambiguous surface.background alias after application roots move to the canonical surface.canvas role.'
        : 'Remove the unused legacy semantic.navigation namespace instead of preserving a duplicate component-history vocabulary.',
    from,
  }) as const) satisfies readonly TokenMigrationEntry[];

const semanticVocabularyVisualMigrationsV1 = [
  {
    id: '883-dark-text-muted-hierarchy',
    kind: 'visual-change',
    issue: '#883',
    themes: ['dark'],
    reason:
      'Correct the Dark text hierarchy so muted remains stronger than subtle using only existing Vellira palette values.',
    from: 'semantic.text.muted',
    approved: true,
    approvalEvidence: semanticVocabularyVisualApproval,
  },
  {
    id: '883-dark-text-subtle-hierarchy',
    kind: 'visual-change',
    issue: '#883',
    themes: ['dark'],
    reason:
      'Correct the Dark text hierarchy so subtle remains below muted using only existing Vellira palette values.',
    from: 'semantic.text.subtle',
    approved: true,
    approvalEvidence: semanticVocabularyVisualApproval,
  },
  {
    id: '883-high-contrast-icons-muted-hierarchy',
    kind: 'visual-change',
    issue: '#883',
    themes: ['high-contrast'],
    reason:
      'Correct the High Contrast icon hierarchy so muted remains stronger than subtle using the existing gray scale.',
    from: 'semantic.icons.muted',
    approved: true,
    approvalEvidence: semanticVocabularyVisualApproval,
  },
  {
    id: '883-high-contrast-icons-subtle-hierarchy',
    kind: 'visual-change',
    issue: '#883',
    themes: ['high-contrast'],
    reason:
      'Correct the High Contrast icon hierarchy so subtle remains below muted using the existing gray scale.',
    from: 'semantic.icons.subtle',
    approved: true,
    approvalEvidence: semanticVocabularyVisualApproval,
  },
  {
    id: '883-dark-warning-ring-own-palette',
    kind: 'visual-change',
    issue: '#883',
    themes: ['dark'],
    reason:
      'Correct warning.ring to use the existing warning palette instead of the unrelated error palette.',
    from: 'semantic.status.warning.ring',
    approved: true,
    approvalEvidence: semanticVocabularyVisualApproval,
  },
  {
    id: '883-dark-info-ring-own-palette',
    kind: 'visual-change',
    issue: '#883',
    themes: ['dark'],
    reason:
      'Correct info.ring to use the existing info palette instead of the unrelated error palette.',
    from: 'semantic.status.info.ring',
    approved: true,
    approvalEvidence: semanticVocabularyVisualApproval,
  },
] as const satisfies readonly TokenMigrationEntry[];
'''

text = text.replace(
    insert_marker,
    ") satisfies readonly TokenMigrationEntry[];"
    + helpers
    + "\n\n/**\n * Migration/test metadata only.",
    1,
)

manifest_marker = "export const tokenMigrationManifestV1 = [\n  ...stateVocabularyRenameMigrationsV1,\n"
if text.count(manifest_marker) != 1:
    raise SystemExit('manifest spread marker missing or ambiguous')
text = text.replace(
    manifest_marker,
    manifest_marker
    + "  ...semanticVocabularyRenameMigrationsV1,\n"
    + "  ...semanticVocabularyRemovalMigrationsV1,\n"
    + "  ...semanticVocabularyVisualMigrationsV1,\n",
    1,
)

path.write_text(text)
