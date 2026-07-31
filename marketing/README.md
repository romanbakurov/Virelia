# Marketing

This directory contains all marketing and launch materials for Vellira.

## Structure

```
marketing/
├── launches/
├── assets/
├── media-kit/
└── templates/
```

### launches/

Version-specific launch materials.

Example:

```
launches/
└── 2.44.0/
    ├── github-release.md
    ├── x.md
    ├── linkedin.md
    ├── reddit.md
    └── article.md
```

### assets/

Screenshots, GIFs, videos, and promotional images for each release.

### media-kit/

Official Vellira branding assets:

- logos
- icons
- Open Graph images
- brand colors
- press resources

### templates/

Reusable templates for release announcements and articles.

## Content guidelines

- Adapt the message to each platform instead of copying the same text everywhere.
- Focus on concrete improvements and user value.
- Include links to the website, documentation, GitHub repository, and release where relevant.
- Use screenshots, GIFs, or short videos when they help demonstrate the release.
- Avoid unsupported claims, inflated language, and artificial engagement tactics.

## Platform purposes

| File                | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `github-release.md` | Detailed release notes and upgrade information   |
| `x.md`              | Short announcement with a visual                 |
| `linkedin.md`       | Story behind the release and lessons learned     |
| `reddit.md`         | Discussion-oriented post asking for feedback     |
| `article.md`        | Long-form article for DEV Community and Hashnode |
