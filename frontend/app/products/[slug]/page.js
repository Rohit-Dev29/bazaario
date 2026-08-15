import AddToCartPanel from '../../../components/AddToCartPanel';
import ChatWidget from '../../../components/ChatWidget';

async function getProduct(slug) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${base}/products/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()).product;
  } catch (e) {
    return null;
  }
}

function getEmbedUrl(url) {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return null;
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl text-indigo-950">Product not found</h1>
        <p className="text-indigo-900/60 mt-2">It may have been removed or is out of stock.</p>
      </div>
    );
  }

  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const embedUrl = getEmbedUrl(product.videoUrl);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">
      <div>
        <div className="aspect-square bg-white rounded-lg border border-indigo-900/10 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.images?.[0]} alt={product.title} className="w-full h-full object-cover" />
        </div>

        {product.videoUrl && (
          <div className="mt-4">
            <h2 className="font-semibold text-indigo-950 mb-2">Product demo video</h2>
            {embedUrl ? (
              <div className="aspect-video rounded-lg overflow-hidden border border-indigo-900/10">
                <iframe
                  src={embedUrl}
                  title="Product demo video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
  <a
    href={product.videoUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block bg-marigold-500 hover:bg-marigold-600 text-white font-bold px-5 py-2.5 rounded-md transition-colors focus-ring"
  >
    ▶ Watch demo video
  </a>
)}
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-indigo-900/60">{product.brand}</p>
        <h1 className="font-display text-2xl font-600 text-indigo-950 mt-1">{product.title}</h1>

        {product.ratingCount > 0 && (
          <div className="mt-2 inline-flex items-center gap-2 bg-green-700 text-white text-sm px-2 py-0.5 rounded">
            {product.ratingAverage} ★ <span className="text-white/80">({product.ratingCount})</span>
          </div>
        )}

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-semibold text-indigo-950">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {discount > 0 && (
            <>
              <span className="text-indigo-900/50 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
              <span className="text-green-700 font-medium">{discount}% off</span>
            </>
          )}
        </div>

        <p className="mt-2 text-sm">
          {product.stock > 0 ? (
            <span className="text-green-700">In stock</span>
          ) : (
            <span className="text-red-600">Out of stock</span>
          )}
        </p>

        <AddToCartPanel product={product} />

        <div className="mt-8">
          <h2 className="font-semibold text-indigo-950 mb-2">About this item</h2>
          <p className="text-indigo-900/80 whitespace-pre-line">{product.description}</p>
        </div>

        {product.reviews?.length > 0 && (
          <div className="mt-8">
            <h2 className="font-semibold text-indigo-950 mb-3">Reviews</h2>
            <div className="space-y-4">
              {product.reviews.map((r, i) => (
                <div key={i} className="border-t border-indigo-900/10 pt-3">
                  <p className="text-sm font-medium text-indigo-950">
                    {r.name} · {r.rating} ★
                  </p>
                  <p className="text-sm text-indigo-900/80 mt-1">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ChatWidget productId={product._id} productTitle={product.title} />
    </div>
  );
}