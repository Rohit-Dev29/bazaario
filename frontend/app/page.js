import ProductCard from '../components/ProductCard';

async function getData() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${base}/products?limit=12&sort=newest`, { cache: 'no-store' }),
      fetch(`${base}/categories`, { cache: 'no-store' }),
    ]);
    const products = productsRes.ok ? (await productsRes.json()).products : [];
    const categories = categoriesRes.ok ? (await categoriesRes.json()).categories : [];
    return { products, categories };
  } catch (e) {
    return { products: [], categories: [] };
  }
}

export default async function HomePage() {
  const { products, categories } = await getData();

  return (
    <div>
      {/* Hero */}
      <section className="bg-indigo-900 text-cream">
        <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-marigold-400 font-medium mb-2 tracking-wide uppercase text-sm">
              Every stall, one street
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-600 leading-tight">
              Everything you need, from sellers you can trust.
            </h1>
            <p className="mt-4 text-cream/80 max-w-md">
              Bazaario brings independent sellers and everyday essentials onto one street —
              browse, compare, and check out in minutes.
            </p>
            <a
              href="#featured"
              className="inline-block mt-6 bg-marigold-400 hover:bg-marigold-500 transition-colors text-indigo-950 font-semibold px-6 py-3 rounded-md focus-ring"
            >
              Start browsing
            </a>
          </div>
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-3">
              {['Electronics', 'Fashion', 'Home', 'Grocery'].map((label, i) => (
                <div
                  key={label}
                  className="bg-indigo-800/60 border border-marigold-400/20 rounded-lg p-5 aspect-square flex flex-col justify-between"
                  style={{ transform: i % 2 === 0 ? 'rotate(-1deg)' : 'rotate(1deg)' }}
                >
                  <span className="text-xs text-marigold-400 font-mono">Stall {i + 1}</span>
                  <span className="font-display text-lg">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category "stalls" — the signature element */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="font-display text-2xl font-600 text-indigo-950 mb-4">Browse the street</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <a
                key={cat._id}
                href={`/search?category=${cat._id}`}
                className="shrink-0 w-40 bg-white border border-indigo-900/10 rounded-lg p-4 text-center hover:border-marigold-400 hover:shadow-md transition-all focus-ring"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-cream overflow-hidden mb-2">
                  {cat.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <p className="font-medium text-sm text-indigo-950">{cat.name}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section id="featured" className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="font-display text-2xl font-600 text-indigo-950 mb-4">Fresh on Bazaario</h2>
        {products.length === 0 ? (
          <div className="bg-white border border-indigo-900/10 rounded-lg p-10 text-center text-indigo-900/60">
            No products yet — once your backend is running and seeded, they'll show up here.
          </div>
        ) : (<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
