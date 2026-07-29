module.exports = {
  ci: {
    collect: {
      startServerCommand:
        'pnpm --filter @vellira-ui/website start --hostname 127.0.0.1 --port 3000',
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 30000,
      url: ['http://127.0.0.1:3000/'],
      numberOfRuns: 3,
      settings: {
        chromeFlags:
          '--headless --no-sandbox --disable-dev-shm-usage --force-prefers-reduced-motion',
      },
    },

    assert: {
      assertions: {
        'categories:performance': [
          'error',
          {
            minScore: 0.8,
            aggregationMethod: 'median-run',
          },
        ],

        'categories:accessibility': [
          'error',
          {
            minScore: 0.9,
            aggregationMethod: 'median-run',
          },
        ],

        'categories:best-practices': [
          'error',
          {
            minScore: 0.9,
            aggregationMethod: 'median-run',
          },
        ],

        'categories:seo': [
          'error',
          {
            minScore: 0.9,
            aggregationMethod: 'median-run',
          },
        ],

        'cumulative-layout-shift': [
          'error',
          {
            maxNumericValue: 0.1,
            aggregationMethod: 'median-run',
          },
        ],

        'largest-contentful-paint': [
          'warn',
          {
            maxNumericValue: 3000,
            aggregationMethod: 'median-run',
          },
        ],

        'total-blocking-time': [
          'warn',
          {
            maxNumericValue: 500,
            aggregationMethod: 'median-run',
          },
        ],
      },
    },

    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-results/website',
    },
  },
};
