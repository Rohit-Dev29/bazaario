'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authApi } from '../../lib/api';

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const [addressSaving, setAddressSaving] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const load = () => {
    authApi
      .me()
      .then(({ data }) => {
        setUser(data.user);
        setProfileForm({ name: data.user.name || '', phone: data.user.phone || '' });
      })
      .catch(() => setError('Sign in to manage your account.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSaved(false);
    try {
      const { data } = await authApi.updateProfile(profileForm);
      setUser(data.user);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save changes.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAddressSave = async (e) => {
    e.preventDefault();
    setAddressSaving(true);
    try {
      const { data } = await authApi.updateProfile({ address: addressForm });
      setUser(data.user);
      setShowAddressForm(false);
      setAddressForm({
        label: 'Home',
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save address.');
    } finally {
      setAddressSaving(false);
    }
  };

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-10 text-indigo-900/60">Loading…</div>;

  if (error && !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl text-indigo-950">Account settings</h1>
        <p className="text-indigo-900/60 mt-2">{error}</p>
        <Link
          href="/login"
          className="inline-block mt-6 bg-marigold-400 hover:bg-marigold-500 text-indigo-950 font-semibold px-6 py-3 rounded-md transition-colors focus-ring"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <h1 className="font-display text-2xl font-600 text-indigo-950">Account settings</h1>

      {/* Profile section */}
      <div className="bg-white border border-indigo-900/10 rounded-lg p-5">
        <h2 className="font-semibold text-indigo-950 mb-4">Your details</h2>
        <form onSubmit={handleProfileSave} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-indigo-950 mb-1">Full name</label>
            <input
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-950 mb-1">Email</label>
            <input
              value={user.email}
              disabled
              className="w-full border border-indigo-900/10 bg-cream rounded-md px-3 py-2 text-indigo-900/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-950 mb-1">Phone</label>
            <input
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              className="w-full border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={profileSaving}
            className="bg-marigold-500 hover:bg-marigold-600 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-md transition-colors focus-ring"
          >
            {profileSaving ? 'Saving…' : profileSaved ? 'Saved ✓' : 'Save changes'}
          </button>
        </form>
      </div>

      {/* Addresses section */}
      <div className="bg-white border border-indigo-900/10 rounded-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-indigo-950">Delivery addresses</h2>
          <button
            onClick={() => setShowAddressForm((s) => !s)}
            className="text-sm font-bold text-marigold-600 hover:underline focus-ring"
          >
            {showAddressForm ? 'Cancel' : '+ Add address'}
          </button>
        </div>

        {user.addresses?.length > 0 ? (
          <div className="space-y-3 mb-4">
            {user.addresses.map((a) => (
              <div key={a._id} className="border border-indigo-900/10 rounded-md p-3 text-sm">
                <p className="font-semibold text-indigo-950">{a.label}</p>
                <p className="text-indigo-900/70">
                  {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} {a.postalCode}, {a.country}
                </p>
              </div>
            ))}
          </div>
        ) : (
          !showAddressForm && <p className="text-sm text-indigo-900/50 mb-2">No saved addresses yet.</p>
        )}

        {showAddressForm && (
          <form onSubmit={handleAddressSave} className="space-y-3 border-t border-indigo-900/10 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Label (e.g. Home, Office)"
                value={addressForm.label}
                onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                className="col-span-2 border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
              />
              <input
                placeholder="Address line 1"
                required
                value={addressForm.line1}
                onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                className="col-span-2 border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
              />
              <input
                placeholder="Address line 2 (optional)"
                value={addressForm.line2}
                onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                className="col-span-2 border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
              />
              <input
                placeholder="City"
                required
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                className="border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
              />
              <input
                placeholder="State"
                required
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                className="border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
              />
              <input
                placeholder="Postal code"
                required
                value={addressForm.postalCode}
                onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                className="border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
              />
              <input
                placeholder="Country"
                required
                value={addressForm.country}
                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                className="border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={addressSaving}
              className="bg-marigold-500 hover:bg-marigold-600 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-md transition-colors focus-ring"
            >
              {addressSaving ? 'Saving…' : 'Save address'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}