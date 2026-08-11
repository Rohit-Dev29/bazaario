'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { productApi, categoryApi } from '../lib/api';

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ProductForm({ initialProduct = null }) {
  const isEdit = Boolean(initialProduct);
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: initialProduct?.title || '',
    slug: initialProduct?.slug || '',
    description: initialProduct?.description || '',
    brand: initialProduct?.brand || '',
    category: initialProduct?.category?._id || initialProduct?.category || '',
    images: initialProduct?.images?.join(', ') || '',
    price: initialProduct?.price || '',
    mrp: initialProduct?.mrp || '',
    stock: initialProduct?.stock ?? '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    categoryApi
      .list()
      .then(({ data }) => setCategories(data.categories))
      .catch(() => setCategories([]));
  }, []);

  const handleTitleChange = (value) => {
    setForm((f) => ({
      ...f,
      title: value,
      slug: isEdit ? f.slug : slugify(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      brand: form.brand,
      category: form.category,
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
      price: Number(form.price),
      mrp: Number(form.mrp),
      stock: Number(form.stock),
    };

    try {
      if (isEdit) {
        await productApi.update(initialProduct._id, payload);
      } else {
        await productApi.create(payload);
      }
      router.push('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium text-indigo-950 mb-1">Product title</label>
        <input
          required
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-indigo-950 mb-1">URL slug</label>
        <input
          required
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
          className="w-full border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
        />
        <p className="text-xs text-indigo-900/50 mt-1">Auto-generated from title — must be unique, no spaces.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-indigo-950 mb-1">Brand</label>
        <input
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
          className="w-full border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-indigo-950 mb-1">Category</label>
        <select
          required
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        {categories.length === 0 && (
          <p className="text-xs text-red-600 mt-1">No categories found — run the seed script first.</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-indigo-950 mb-1">Description</label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-indigo-950 mb-1">Image URL(s)</label>
        <input
          required
          value={form.images}
          onChange={(e) => setForm({ ...form, images: e.target.value })}
          placeholder="https://example.com/photo.jpg"
          className="w-full border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
        />
        <p className="text-xs text-indigo-900/50 mt-1">
          Paste an image link (upload your photo to postimages.org or imgur.com first). Separate multiple links with commas.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-indigo-950 mb-1">Price (₹)</label>
          <input
            required
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-indigo-950 mb-1">MRP (₹)</label>
          <input
            required
            type="number"
            min="0"
            value={form.mrp}
            onChange={(e) => setForm({ ...form, mrp: e.target.value })}
            className="w-full border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-indigo-950 mb-1">Stock</label>
          <input
            required
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="w-full border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-marigold-400 hover:bg-marigold-500 disabled:opacity-50 text-indigo-950 font-semibold px-6 py-2.5 rounded-md transition-colors focus-ring"
      >
        {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Add product'}
      </button>
    </form>
  );
}
