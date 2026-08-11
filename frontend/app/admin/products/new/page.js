'use client';

import AdminGuard from '../../../../components/AdminGuard';
import ProductForm from '../../../../components/ProductForm';

export default function NewProductPage() {
  return (
    <AdminGuard>
      <h1 className="font-display text-2xl font-600 text-indigo-950 mb-6">Add a new product</h1>
      <ProductForm />
    </AdminGuard>
  );
}
