import Link from 'next/link';

export default function ProductCard({ product }) {
  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-xl border border-indigo-900/10 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 focus-ring"
    >
      <div className="relative aspect-square bg-cream overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-marigold-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
            {discount}% OFF
          </span>
        )}
      </div>
      <div className="p-3.5">
        <p className="text-xs text-indigo-900/60 uppercase tracking-wide truncate">{product.brand}</p>
        <h3 className="font-medium text-indigo-950 line-clamp-2 leading-snug mt-0.5">{product.title}</h3>

        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="font-semibold text-lg text-indigo-950">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {discount > 0 && (
            <span className="text-xs text-indigo-900/40 line-through">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {product.ratingCount > 0 && (
          <div className="mt-2 inline-flex items-center gap-1 bg-green-600 text-white text-xs font-medium px-1.5 py-0.5 rounded">
            <span>{product.ratingAverage}</span>
            <span>★</span>
            <span className="text-white/80 font-normal">({product.ratingCount})</span>
          </div>
        )}
      </div>
    </Link>
  );
}