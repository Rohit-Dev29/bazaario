'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '../../../../components/AdminGuard';
import ProductForm from '../../../../components/ProductForm';
import { productApi } from '../../../../lib/api';

export default function EditProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    productApi
      .get(params.id)
      .then(({ data }) => setProduct(data.product))
      .catch(() => setError('Could not load this product.'));
  }, [params.id]);

  return (
    <AdminGuard>
      <h1 className="font-display text-2xl font-600 text-indigo-950 mb-6">Edit product</h1>
      {error && <p className="text-red-600">{error}</p>}
      {product && <ProductForm initialProduct={product} />}
    </AdminGuard>
  );
}
