from pathlib import Path

path = Path('packages/tokens/src/preservation/token-migrations.ts')
text = path.read_text()

marker = "export const tokenMigrationManifestV1 = [\n"
if text.count(marker) != 1:
    raise SystemExit('manifest marker missing or ambiguous')

block = r'''
const semanticVocabularyDownstreamVisualMigrationsV1 = [
  {
    id: '883-dark-dropdown-separator-muted-hierarchy',
    kind: 'visual-change',
    issue: '#883',
    themes: ['dark'],
    reason:
      'Dropdown separator follows the corrected Dark muted text hierarchy without introducing a new palette value.',
    from: 'components.dropdown.separator.fg',
    approved: true,
    approvalEvidence: semanticVocabularyVisualApproval,
  },
  {
    id: '883-dark-form-field-helper-muted-hierarchy',
    kind: 'visual-change',
    issue: '#883',
    themes: ['dark'],
    reason:
      'FormField helper text follows the corrected Dark muted text hierarchy without introducing a new palette value.',
    from: 'components.formField.helperText.default.fg',
    approved: true,
    approvalEvidence: semanticVocabularyVisualApproval,
  },
  {
    id: '883-dark-input-readonly-placeholder-muted-hierarchy',
    kind: 'visual-change',
    issue: '#883',
    themes: ['dark'],
    reason:
      'Input read-only placeholder follows the corrected Dark muted text hierarchy without introducing a new palette value.',
    from: 'components.input.readOnly.placeholder',
    approved: true,
    approvalEvidence: semanticVocabularyVisualApproval,
  },
  {
    id: '883-dark-modal-close-button-pressed-state',
    kind: 'visual-change',
    issue: '#883',
    themes: ['dark'],
    reason:
      'Modal close-button physical press now consumes the canonical surface.pressed state instead of the persistent surface.active state.',
    from: 'components.modal.closeButton.pressed.bg',
    approved: true,
    approvalEvidence: semanticVocabularyVisualApproval,
  },
  {
    id: '883-high-contrast-input-clear-button-icon-hierarchy',
    kind: 'visual-change',
    issue: '#883',
    themes: ['high-contrast'],
    reason:
      'Input clear-button foreground follows the corrected High Contrast muted icon hierarchy.',
    from: 'components.input.clearButton.fg',
    approved: true,
    approvalEvidence: semanticVocabularyVisualApproval,
  },
  {
    id: '883-high-contrast-input-muted-icon-hierarchy',
    kind: 'visual-change',
    issue: '#883',
    themes: ['high-contrast'],
    reason:
      'Input muted icon follows the corrected High Contrast muted/subtle icon hierarchy.',
    from: 'components.input.icon.muted',
    approved: true,
    approvalEvidence: semanticVocabularyVisualApproval,
  },
  {
    id: '883-high-contrast-input-readonly-icon-hierarchy',
    kind: 'visual-change',
    issue: '#883',
    themes: ['high-contrast'],
    reason:
      'Input read-only icon follows the corrected High Contrast muted icon hierarchy.',
    from: 'components.input.readOnly.icon',
    approved: true,
    approvalEvidence: semanticVocabularyVisualApproval,
  },
  {
    id: '883-high-contrast-input-spinner-icon-hierarchy',
    kind: 'visual-change',
    issue: '#883',
    themes: ['high-contrast'],
    reason:
      'Input spinner foreground follows the corrected High Contrast muted icon hierarchy.',
    from: 'components.input.spinner.fg',
    approved: true,
    approvalEvidence: semanticVocabularyVisualApproval,
  },
  {
    id: '883-high-contrast-select-clear-button-icon-hierarchy',
    kind: 'visual-change',
    issue: '#883',
    themes: ['high-contrast'],
    reason:
      'Select clear-button foreground follows the corrected High Contrast muted icon hierarchy.',
    from: 'components.select.clearButton.fg',
    approved: true,
    approvalEvidence: semanticVocabularyVisualApproval,
  },
] as const satisfies readonly TokenMigrationEntry[];

'''

text = text.replace(marker, block + marker, 1)

spread_marker = "  ...semanticVocabularyVisualMigrationsV1,\n"
if text.count(spread_marker) != 1:
    raise SystemExit('semantic visual spread marker missing or ambiguous')
text = text.replace(
    spread_marker,
    spread_marker + "  ...semanticVocabularyDownstreamVisualMigrationsV1,\n",
    1,
)

path.write_text(text)
