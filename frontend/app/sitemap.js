async function getAllProductSlugs() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${base}/products?limit=1000`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products.map((p) => p.slug);
  } catch (e) {
    return [];
  }
}

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bazaario-git-main-rohit-verma1.vercel.app';
  const slugs = await getAllProductSlugs();

  const staticRoutes = ['', '/search', '/login', '/register'].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const productRoutes = slugs.map((slug) => ({
    url: `${siteUrl}/products/${slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}
