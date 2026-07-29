/** @type {import('@lhci/cli').Config} */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './apps/docs/src/.vitepress/dist',
      numberOfRuns: 3,
      url: ['http://localhost/', 'http://localhost/components/'],
      settings: {
        chromeFlags: '--headless --no-sandbox --disable-dev-shm-usage',
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
      outputDir: './lighthouse-results',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%',
    },
  },
};
