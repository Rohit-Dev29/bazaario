'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '../../lib/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.register(form);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="font-display text-2xl font-600 text-indigo-950 mb-6">Create your account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-indigo-950 mb-1">Full name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
          />
        </div>
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
          <label className="block text-sm font-medium text-indigo-950 mb-1">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-indigo-950 mb-1">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
          />
          <p className="text-xs text-indigo-900/50 mt-1">At least 8 characters</p>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-marigold-400 hover:bg-marigold-500 disabled:opacity-50 text-indigo-950 font-semibold px-6 py-2.5 rounded-md transition-colors focus-ring"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="mt-4 text-sm text-indigo-900/70">
        Already have an account?{' '}
        <Link href="/login" className="text-marigold-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
