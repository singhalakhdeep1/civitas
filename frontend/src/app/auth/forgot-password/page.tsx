'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent!');
    } catch {
      toast.error('Failed to send reset link');
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
          <h1 className="mb-4 text-2xl font-bold">Check Your Email</h1>
          <p className="mb-6 text-gray-600">We sent a password reset link to {email}</p>
          <Link href="/auth/login" className="text-primary-600 hover:underline">Back to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-center">Forgot Password</h1>
        <p className="mb-6 text-center text-sm text-gray-600">Enter your email and we'll send a reset link</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-lg border px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
          <button type="submit" className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">Send Reset Link</button>
        </form>
        <p className="mt-4 text-center text-sm"><Link href="/auth/login" className="text-primary-600 hover:underline">Back to login</Link></p>
      </div>
    </div>
  );
}
