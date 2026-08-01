'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '../../lib/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.login(form);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="font-display text-2xl font-600 text-indigo-950 mb-6">Sign in to Bazaario</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-indigo-950 mb-1">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-indigo-950 mb-1">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-marigold-400 hover:bg-marigold-500 disabled:opacity-50 text-indigo-950 font-semibold px-6 py-2.5 rounded-md transition-colors focus-ring"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-4 text-sm text-indigo-900/70">
        New to Bazaario?{' '}
        <Link href="/register" className="text-marigold-600 font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
