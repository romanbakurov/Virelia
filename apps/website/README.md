# Vellira Website

The Vellira marketing site is deployed at [https://vellira.dev](https://vellira.dev).

## Development

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The app lives in `apps/website` and uses Next.js App Router.

## Production URL

- Website: [https://vellira.dev](https://vellira.dev)
- Documentation: [https://docs.vellira.dev](https://docs.vellira.dev)
- Storybook: [https://storybook.vellira.dev](https://storybook.vellira.dev)

## Build

From the repository root:

```bash
pnpm --filter @vellira-ui/website build
```

## Deploy

The production site is served from `https://vellira.dev`.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
