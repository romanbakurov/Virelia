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
        chromeFlags: '--headless --no-sandbox --disable-dev-shm-usage',
      },
    },

    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'total-blocking-time': ['warn', { maxNumericValue: 500 }],
      },
    },

    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-results/website',
    },
  },
};
