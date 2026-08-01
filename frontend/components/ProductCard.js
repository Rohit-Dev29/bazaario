import Link from 'next/link';

export default function ProductCard({ product }) {
  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-lg border border-indigo-900/10 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all focus-ring"
    >
      <div className="aspect-square bg-cream overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3">
        <p className="text-sm text-indigo-900/70 truncate">{product.brand}</p>
        <h3 className="font-medium text-indigo-950 line-clamp-2 leading-snug">{product.title}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-semibold text-indigo-950">₹{product.price.toLocaleString('en-IN')}</span>
          {discount > 0 && (
            <>
              <span className="text-xs text-indigo-900/50 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-green-700 font-medium">{discount}% off</span>
            </>
          )}
        </div>
        {product.ratingCount > 0 && (
          <div className="mt-1 text-xs text-indigo-900/60">
            ★ {product.ratingAverage} ({product.ratingCount})
          </div>
        )}
      </div>
    </Link>
  );
}
