import ProductCard from '../../components/ProductCard';

async function getResults(searchParams) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const params = new URLSearchParams();
  if (searchParams.q) params.set('keyword', searchParams.q);
  if (searchParams.category) params.set('category', searchParams.category);
  if (searchParams.minPrice) params.set('minPrice', searchParams.minPrice);
  if (searchParams.maxPrice) params.set('maxPrice', searchParams.maxPrice);
  if (searchParams.sort) params.set('sort', searchParams.sort);

  try {
    const res = await fetch(`${base}/products?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) return { products: [], total: 0 };
    return res.json();
  } catch (e) {
    return { products: [], total: 0 };
  }
}

export default async function SearchPage({ searchParams }) {
  const { products, total } = await getResults(searchParams);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-600 text-indigo-950 mb-1">
        {searchParams.q ? `Results for "${searchParams.q}"` : 'Browse products'}
      </h1>
      <p className="text-indigo-900/60 mb-6">{total || products.length} products found</p>

      {products.length === 0 ? (
        <div className="bg-white border border-indigo-900/10 rounded-lg p-10 text-center text-indigo-900/60">
          No products matched your search.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
