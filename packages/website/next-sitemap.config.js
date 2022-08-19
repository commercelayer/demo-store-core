// @ts-check

/** @type {import('next-sitemap').IConfig} */
const sitemapConfig = process.env.DISALLOW_ROBOTS === 'true' ? {
  siteUrl: process.env.SITE_URL || '',
  exclude: ['*'],
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*', // Block all crawlers except AdsBot (AdsBot crawlers must be named explicitly)
        disallow: ['/']
      },
      {
        userAgent: 'AdsBot-Google', // Block AdsBot
        disallow: ['/']
      }
    ]
  }
} : {
  siteUrl: process.env.SITE_URL || '',
  sitemapSize: 7000,
  exclude: [
    '/*/search',
    '/*/cart'
  ],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: [
          '/*/search',
          '/*/cart'
        ]
      }
    ]
  }
}

module.exports = sitemapConfig
