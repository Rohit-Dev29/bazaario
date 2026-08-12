export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bazaario-git-main-rohit-verma1.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/cart', '/checkout', '/orders'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
