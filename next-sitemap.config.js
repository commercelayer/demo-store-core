// @ts-check

/** @type {import('next-sitemap').IConfig} */
const sitemapConfig = {
  siteUrl: process.env.SITE_URL || '',
  sitemapSize: 7000,
  exclude: ['/*/search'],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: [
          '/*/search'
        ]
      }
    ]
  }
}

module.exports = sitemapConfig
