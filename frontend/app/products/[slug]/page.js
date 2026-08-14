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

// Detects the video platform from a pasted link and returns the right
// embeddable iframe URL, or null if it should fall back to a direct
// <video> tag / plain link instead.
function getEmbedInfo(url) {
  if (!url) return null;

  // YouTube: youtube.com/watch?v=... or youtu.be/...
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (ytMatch) {
    return { type: 'iframe', src: `https://www.youtube.com/embed/${ytMatch[1]}` };
  }

  // Vimeo: vimeo.com/12345678
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return { type: 'iframe', src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }

  // Instagram: instagram.com/p/CODE/ or /reel/CODE/
  const igMatch = url.match(/instagram\.com\/(p|reel)\/([\w-]+)/);
  if (igMatch) {
    return { type: 'iframe', src: `https://www.instagram.com/${igMatch[1]}/${igMatch[2]}/embed`, tall: true };
  }

  // Facebook: facebook.com/.../videos/... or /watch/?v=...
  if (/facebook\.com\/.*(video|watch)/.test(url)) {
    return {
      type: 'iframe',
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`,
    };
  }

  // Direct video file link (.mp4, .webm, .mov, etc.)
  if (/\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url)) {
    return { type: 'file', src: url };
  }

  // Unknown platform — offer a plain link instead of trying to embed
  return { type: 'link', src: url };
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

  const embed = getEmbedInfo(product.videoUrl);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">
      <div>
        <div className="aspect-square bg-white rounded-lg border border-indigo-900/10 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.images?.[0]} alt={product.title} className="w-full h-full object-cover" />
        </div>

        {embed && (
          <div className="mt-4">
            <h2 className="font-semibold text-indigo-950 mb-2">Product demo video</h2>

            {embed.type === 'iframe' && (
              <div className={embed.tall ? 'aspect-[9/16] max-w-sm mx-auto' : 'aspect-video'}>
                <iframe
                  src={embed.src}
                  title="Product demo video"
                  className="w-full h-full rounded-lg border border-indigo-900/10"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {embed.type === 'file' && (
              <video controls className="w-full rounded-lg border border-indigo-900/10">
                <source src={embed.src} />
                Your browser does not support embedded video.
              </video>
            )}

            {embed.type === 'link' && (
              
                href={embed.src}
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
