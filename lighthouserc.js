module.exports = {
  ci: {
    collect: {
      staticDistDir: './out/',
      numberOfRuns: 1,
      url: [
        '/demo-store/index.html',
        '/demo-store/en-US.html',
        '/demo-store/en-US/search.html',
        '/demo-store/en-US/search/accessories.html',
        '/demo-store/en-US/product//black-men-polo-with-white-logo-l/POLOMXXX000000FFFFFFLXXX.html'
      ]
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        // 'first-contentful-paint': 'off',
        // 'installable-manifest': ['warn', { 'minScore': 1 }],
        // 'uses-responsive-images': ['error', { 'maxLength': 0 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    },
    server: {},
    wizard: {},
  },
}
