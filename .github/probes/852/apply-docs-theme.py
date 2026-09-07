from pathlib import Path


def replace_exact(path: str, old: str, new: str, count: int = 1) -> None:
    file = Path(path)
    text = file.read_text()
    actual = text.count(old)
    if actual != count:
        raise SystemExit(
            f"{path}: expected {count} occurrence(s) of {old!r}, found {actual}"
        )
    file.write_text(text.replace(old, new))


package = "apps/docs/package.json"
replace_exact(
    package,
    '    "@vellira-ui/metadata": "workspace:*",\n    "vitepress": "^1.6.4"',
    '    "@vellira-ui/metadata": "workspace:*",\n    "@vellira-ui/tokens": "workspace:*",\n    "vitepress": "^1.6.4"',
)

theme = "apps/docs/src/.vitepress/theme/index.ts"
replace_exact(
    theme,
    "import '@vellira-ui/assets/styles';\n",
    "import '@vellira-ui/assets/styles';\nimport '@vellira-ui/tokens/css';\n",
)

css = "apps/docs/src/.vitepress/theme/styles.css"
replacements = [
    (
        "  --vp-button-brand-bg: #5b4bea;",
        "  --vp-button-brand-bg: var(--action-primary-default-bg);",
    ),
    (
        "  --vp-button-brand-hover-bg: #4936d9;",
        "  --vp-button-brand-hover-bg: var(--action-primary-hover-bg);",
    ),
    (
        "  --vp-button-brand-active-bg: #4338ca;",
        "  --vp-button-brand-active-bg: var(--action-primary-pressed-bg);",
    ),
    (
        "  --vp-button-brand-text: #fff;",
        "  --vp-button-brand-text: var(--action-primary-default-fg);",
    ),
    (
        "linear-gradient(180deg, rgb(255 255 255 / 68%), rgb(255 255 255 / 22%)),",
        "linear-gradient(180deg, color-mix(in srgb, var(--color-mono-50) 68%, transparent), color-mix(in srgb, var(--color-mono-50) 22%, transparent)),",
    ),
    (
        "linear-gradient(180deg, rgb(255 255 255 / 4%), rgb(255 255 255 / 1%)),",
        "linear-gradient(180deg, color-mix(in srgb, var(--color-mono-50) 4%, transparent), color-mix(in srgb, var(--color-mono-50) 1%, transparent)),",
    ),
    (
        "  padding: 0 18px;\n  color: #fff;\n  font-weight: 700;",
        "  padding: 0 18px;\n  color: var(--vp-button-brand-text);\n  font-weight: 700;",
    ),
    (
        "  color: #fff;\n}\n\n.vp-doc .docs-cta:hover {",
        "  color: var(--vp-button-brand-text);\n}\n\n.vp-doc .docs-cta:hover {",
    ),
    ("  accent-color: #047857;", "  accent-color: var(--status-success-fg);"),
    ("  accent-color: #dc2626;", "  accent-color: var(--status-error-fg);"),
    (
        "  padding: 0 16px;\n  color: #fff;\n  font-size: 14px;",
        "  padding: 0 16px;\n  color: var(--action-primary-default-fg);\n  font-size: 14px;",
    ),
    (
        "  background: var(--vp-c-brand-1);\n  border: 0;",
        "  background: var(--action-primary-default-bg);\n  border: 0;",
    ),
    (
        "  background: #dc2626;\n}\n\n.docs-button-icon",
        "  background: var(--action-danger-default-bg);\n}\n\n.docs-button-icon",
    ),
    (
        "  background: var(--vp-c-brand-2);\n}\n\n.docs-button-danger:hover",
        "  background: var(--action-primary-hover-bg);\n}\n\n.docs-button-danger:hover",
    ),
    (
        "  background: #b91c1c;\n}",
        "  background: var(--action-danger-hover-bg);\n}",
    ),
    (
        "  border: 2px solid rgb(255 255 255 / 46%);",
        "  border: 2px solid color-mix(in srgb, var(--color-mono-50) 46%, transparent);",
    ),
    ("  border-top-color: #fff;", "  border-top-color: var(--color-mono-50);"),
    ("  border-color: #dc2626;", "  border-color: var(--status-error-border);"),
    (
        "  color: #dc2626;\n  font-size: 12px;",
        "  color: var(--status-error-fg);\n  font-size: 12px;",
    ),
    (
        "  box-shadow: 0 16px 42px rgb(27 23 38 / 12%);",
        "  box-shadow: var(--shadow-lg);",
        2,
    ),
    (
        "  color: #dc2626 !important;",
        "  color: var(--status-error-fg) !important;",
    ),
    (
        "  box-shadow: 0 12px 28px rgb(27 23 38 / 10%);",
        "  box-shadow: var(--shadow-md);",
    ),
    (
        "  color: #fff;\n  font-size: 13px;\n  background: #1b1726;",
        "  color: var(--text-inverse);\n  font-size: 13px;\n  background: var(--surface-inverse);",
    ),
]

for item in replacements:
    if len(item) == 2:
        old, new = item
        count = 1
    else:
        old, new, count = item
    replace_exact(css, old, new, count)
