'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const categories = ['EDUCATION', 'HEALTH', 'ENVIRONMENT', 'POVERTY', 'ANIMALS', 'ARTS', 'COMMUNITY', 'HUMAN_RIGHTS', 'DISASTER_RELIEF', 'CHILDREN', 'ELDERLY', 'HOUSING', 'FOOD_SECURITY'];

export default function CreateCampaignPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.accessToken);
  const [form, setForm] = useState({ title: '', description: '', goalAmount: '', category: 'COMMUNITY', endDate: '' });
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) { setForm((p) => ({ ...p, [field]: value })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) { toast.error('Please sign in'); return; }
    setLoading(true);
    try {
      await api.post('/campaigns', { ...form, goalAmount: parseInt(form.goalAmount) * 100 }, token);
      toast.success('Campaign created!');
      router.push('/campaigns');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Create Campaign</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input type="text" required value={form.title} onChange={(e) => update('title', e.target.value)} className="w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea required rows={5} value={form.description} onChange={(e) => update('description', e.target.value)} className="w-full rounded-lg border px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Goal ($)</label>
            <input type="number" required min="1" value={form.goalAmount} onChange={(e) => update('goalAmount', e.target.value)} className="w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className="w-full rounded-lg border px-3 py-2">
              {categories.map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">End Date</label>
          <input type="date" required value={form.endDate} onChange={(e) => update('endDate', e.target.value)} className="w-full rounded-lg border px-3 py-2" />
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Campaign'}
        </button>
      </form>
    </div>
  );
}
