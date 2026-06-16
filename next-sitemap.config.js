/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.vannes-batteries.fr',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ['/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  transform: async (config, path) => {
    const priorities = {
      '/': 1.0,
      '/a-propos': 0.8,
      '/services': 0.8,
      '/contact': 0.7,
    };
    const changefreqs = {
      '/': 'weekly',
      '/a-propos': 'monthly',
      '/services': 'monthly',
    };
    return {
      loc: path,
      changefreq: changefreqs[path] || 'yearly',
      priority: priorities[path] || 0.3,
      lastmod: new Date().toISOString(),
    };
  },
}
