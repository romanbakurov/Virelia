# Vellira Component Generator

Internal scaffolding tool used to generate components for Vellira Web and Native packages.

## Usage

Generate a component:

```bash
pnpm create:component <Name> <platform> <layer>
```

Examples:

```bash
pnpm create:component Badge web primitives
pnpm create:component Badge native primitives
pnpm create:component Badge both primitives
```

## Platforms

| Platform | Description                          |
| -------- | ------------------------------------ |
| web      | Generate component in `react`        |
| native   | Generate component in `react-native` |
| both     | Generate component in both packages  |

## Layers

| Layer      | Location         |
| ---------- | ---------------- |
| primitives | `src/primitives` |
| components | `src/components` |
| patterns   | `src/patterns`   |

## Generated Structure

The generator creates:

```txt
Badge/
├── Badge.tsx
├── Badge.stories.tsx
├── index.ts
├── types.ts
├── Badge.test.tsx
└── Badge.module.scss
```

Generated files depend on the selected platform and enabled templates.

## Template Architecture

Templates are stored in:

```txt
scripts/
└── generators/
    ├── create-component.ts
    └── templates/
        ├── index.ts
        ├── component-web.ts
        ├── component-native.ts
        ├── component-story.ts
        ├── component-styles.ts
        ├── component-test.ts
        └── component-types.ts
```

### Template Responsibilities

| Template                   | Purpose                      |
| -------------------------- | ---------------------------- |
| component-web.ts           | React Web component          |
| component-native.ts        | React Native component       |
| component-story.ts         | Storybook stories            |
| component-styles.ts        | SCSS module template         |
| component-native-styles.ts | React Native styles template |
| component-test.ts          | Component test template      |
| component-types.ts         | Component type definitions   |
| index.ts                   | Template exports             |

## Features

The generator automatically:

- Creates component directories
- Generates platform-specific component implementations
- Generates Storybook stories
- Generates component tests
- Generates style templates
- Generates type definitions
- Creates component barrel exports
- Updates layer barrel exports
- Supports Web and Native packages
- Supports multi-platform generation (`both`)

## Supported Targets

```txt
packages/
├── react
└── react-native
```

## Notes

The generator assumes the standard Vellira package structure and updates exports automatically after component creation.

All generated files are intended as starting points and may require manual refinement depending on component complexity.
