'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'DONOR' });
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.post<{ user: { id: string; email: string; firstName: string; lastName: string; role: string }; accessToken: string; refreshToken: string }>('/auth/register', form);
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Account created!');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-center">Create Your Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">First Name</label>
              <input type="text" required value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className="w-full rounded-lg border px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Last Name</label>
              <input type="text" required value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className="w-full rounded-lg border px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full rounded-lg border px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input type="password" required minLength={8} value={form.password} onChange={(e) => update('password', e.target.value)} className="w-full rounded-lg border px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">I want to</label>
            <select value={form.role} onChange={(e) => update('role', e.target.value)} className="w-full rounded-lg border px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option value="DONOR">Donate to causes</option>
              <option value="VOLUNTEER">Volunteer my time</option>
              <option value="NONPROFIT_ADMIN">Register a nonprofit</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link href="/auth/login" className="text-primary-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
