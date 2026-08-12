import Link from 'next/link';

export default function ProductCard({ product }) {
  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-lg border-2 border-indigo-900/10 overflow-hidden shadow-md hover:shadow-2xl hover:border-marigold-400 hover:-translate-y-1 transition-all duration-200 focus-ring"
    >
      <div className="relative aspect-square bg-cream overflow-hidden p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-extrabold px-2.5 py-1 rounded shadow">
            {discount}% OFF
          </span>
        )}
      </div>
      <div className="p-4 border-t-2 border-indigo-900/5">
        <p className="text-xs text-indigo-900/50 uppercase tracking-wider font-bold truncate">{product.brand}</p>
        <h3 className="font-bold text-indigo-950 text-base line-clamp-2 leading-snug mt-1">{product.title}</h3>

        {product.ratingCount > 0 && (
          <div className="mt-2 inline-flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
            <span>{product.ratingAverage}</span>
            <span>★</span>
            <span className="text-white/80 font-medium">({product.ratingCount})</span>
          </div>
        )}

        <div className="mt-2.5 flex items-baseline gap-2 flex-wrap">
          <span className="font-extrabold text-2xl text-indigo-950">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {discount > 0 && (
            <>
              <span className="text-sm text-indigo-900/40 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-green-700 font-bold">{discount}% off</span>
            </>
          )}
        </div>

        <p className="mt-2 text-xs font-bold text-indigo-900/60">Free delivery</p>
      </div>
    </Link>
  );
}
