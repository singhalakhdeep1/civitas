'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Heart, Target, Clock } from 'lucide-react';

interface Campaign { id: string; title: string; description: string; goalAmount: number; currentAmount: number; status: string; category: string; startDate: string; endDate: string; nonprofit?: { id: string; name: string; verified: boolean }; milestones?: { id: string; title: string; targetAmount: number; reached: boolean }[]; updates?: { id: string; title: string; content: string; createdAt: string }[] }

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const token = useAuthStore((s) => s.accessToken);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [amount, setAmount] = useState('25');

  useEffect(() => {
    api.get<Campaign>(`/campaigns/${id}`, token ?? undefined).then(setCampaign).catch(() => toast.error('Campaign not found'));
  }, [id, token]);

  async function handleDonate() {
    if (!token) { toast.error('Please sign in to donate'); return; }
    try {
      await api.post('/donations/one-time', { campaignId: id, amount: parseInt(amount) * 100 }, token);
      toast.success('Thank you for your donation!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Donation failed');
    }
  }

  if (!campaign) return <div className="py-20 text-center text-gray-400">Loading...</div>;

  const progress = Math.min(100, (campaign.currentAmount / campaign.goalAmount) * 100);

  return (
    <div className="mx-auto max-w-4xl">
      <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">{campaign.category}</span>
      <h1 className="mt-3 text-3xl font-bold">{campaign.title}</h1>
      {campaign.nonprofit && <p className="mt-1 text-gray-500">by {campaign.nonprofit.name} {campaign.nonprofit.verified && <span className="text-accent-600">&#10003; Verified</span>}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="whitespace-pre-wrap text-gray-700">{campaign.description}</p>
          </div>

          {campaign.milestones && campaign.milestones.length > 0 && (
            <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 font-semibold"><Target className="h-5 w-5 text-primary-600" /> Milestones</h2>
              <div className="space-y-3">
                {campaign.milestones.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${m.reached ? 'bg-accent-500' : 'bg-gray-200'}`} />
                    <span className={m.reached ? 'font-medium text-accent-700' : 'text-gray-600'}>{m.title}</span>
                    <span className="ml-auto text-sm text-gray-400">{formatCurrency(m.targetAmount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {campaign.updates && campaign.updates.length > 0 && (
            <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold">Updates</h2>
              <div className="space-y-4">
                {campaign.updates.map((u) => (
                  <div key={u.id} className="border-l-2 border-primary-200 pl-4">
                    <h3 className="font-medium">{u.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{u.content}</p>
                    <p className="mt-1 text-xs text-gray-400">{formatDate(u.createdAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="sticky top-6 rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-1 flex justify-between text-sm"><span className="font-semibold text-primary-700">{formatCurrency(campaign.currentAmount)}</span><span className="text-gray-400">of {formatCurrency(campaign.goalAmount)}</span></div>
            <div className="mb-4 h-3 rounded-full bg-gray-100"><div className="h-3 rounded-full bg-primary-500 transition-all" style={{ width: `${progress}%` }} /></div>
            <p className="mb-4 flex items-center gap-1 text-xs text-gray-400"><Clock className="h-3 w-3" /> Ends {formatDate(campaign.endDate)}</p>
            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium">Donation Amount ($)</label>
              <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
            </div>
            <div className="mb-3 flex gap-2">
              {[10, 25, 50, 100].map((v) => (
                <button key={v} onClick={() => setAmount(String(v))} className={`flex-1 rounded-lg border py-1.5 text-sm font-medium ${amount === String(v) ? 'border-primary-500 bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}>${v}</button>
              ))}
            </div>
            <button onClick={handleDonate} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
              <Heart className="h-4 w-4" /> Donate Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
