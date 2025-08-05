module.exports = {
  ci: {
    collect: {
      // Use static files instead of starting server to avoid permission issues
      staticDistDir: './build',
    },
    assert: {
      // Performance budgets
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],

        // Core Web Vitals - more lenient for development
        'first-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.2 }],
        'speed-index': ['warn', { maxNumericValue: 4000 }],
      },
    },
    upload: {
      // Store results locally
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};
