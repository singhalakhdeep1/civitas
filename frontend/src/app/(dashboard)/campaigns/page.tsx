'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Heart, TrendingUp, Plus } from 'lucide-react';

interface Campaign { id: string; title: string; description: string; goalAmount: number; currentAmount: number; status: string; category: string; endDate: string; nonprofit?: { name: string } }

export default function CampaignsPage() {
  const token = useAuthStore((s) => s.accessToken);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [trending, setTrending] = useState<Campaign[]>([]);

  useEffect(() => {
    api.get<Campaign[]>('/campaigns', token ?? undefined).then(setCampaigns).catch(() => {});
    api.get<Campaign[]>('/campaigns/trending', token ?? undefined).then(setTrending).catch(() => {});
  }, [token]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <Link href="/campaigns/create" className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"><Plus className="h-4 w-4" /> New Campaign</Link>
      </div>

      {trending.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><TrendingUp className="h-5 w-5 text-orange-500" /> Trending</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {trending.slice(0, 3).map((c) => (
              <Link key={c.id} href={`/campaigns/${c.id}`} className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
                <span className="inline-block rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">{c.category}</span>
                <h3 className="mt-2 font-semibold">{c.title}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{c.description}</p>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-gray-500">
                    <span>{formatCurrency(c.currentAmount)}</span>
                    <span>{formatCurrency(c.goalAmount)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100"><div className="h-2 rounded-full bg-accent-500" style={{ width: `${Math.min(100, (c.currentAmount / c.goalAmount) * 100)}%` }} /></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold">All Campaigns</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((c) => (
          <Link key={c.id} href={`/campaigns/${c.id}`} className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
              <span className="inline-block rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">{c.category}</span>
              <span className={`text-xs font-medium ${c.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-400'}`}>{c.status}</span>
            </div>
            <h3 className="mt-2 font-semibold">{c.title}</h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{c.description}</p>
            {c.nonprofit && <p className="mt-2 text-xs text-gray-400">by {c.nonprofit.name}</p>}
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-gray-500">
                <span>{formatCurrency(c.currentAmount)} raised</span>
                <span>Goal: {formatCurrency(c.goalAmount)}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100"><div className="h-2 rounded-full bg-primary-500" style={{ width: `${Math.min(100, (c.currentAmount / c.goalAmount) * 100)}%` }} /></div>
            </div>
            <p className="mt-2 text-xs text-gray-400">Ends {formatDate(c.endDate)}</p>
          </Link>
        ))}
        {campaigns.length === 0 && <p className="col-span-full py-12 text-center text-gray-400">No campaigns yet</p>}
      </div>
    </div>
  );
}
