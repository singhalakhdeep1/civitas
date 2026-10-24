'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { FileText, TrendingUp, Users } from 'lucide-react';

interface Petition { id: string; title: string; description: string; targetSignatures: number; currentSignatures: number; status: string; category?: string; createdAt: string }

export default function PetitionsPage() {
  const token = useAuthStore((s) => s.accessToken);
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [trending, setTrending] = useState<Petition[]>([]);

  useEffect(() => {
    api.get<Petition[]>('/petitions', token ?? undefined).then(setPetitions).catch(() => {});
    api.get<Petition[]>('/petitions/trending', token ?? undefined).then(setTrending).catch(() => {});
  }, [token]);

  async function sign(id: string) {
    if (!token) { toast.error('Please sign in'); return; }
    try {
      await api.post(`/petitions/${id}/sign`, {}, token);
      toast.success('Petition signed!');
      setPetitions((prev) => prev.map((p) => p.id === id ? { ...p, currentSignatures: p.currentSignatures + 1 } : p));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to sign');
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Petitions</h1>

      {trending.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><TrendingUp className="h-5 w-5 text-orange-500" /> Trending Petitions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {trending.slice(0, 3).map((p) => (
              <div key={p.id} className="rounded-xl border-2 border-orange-100 bg-white p-5 shadow-sm">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{p.description}</p>
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{p.currentSignatures} signatures</span>
                    <span>Goal: {p.targetSignatures}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100"><div className="h-2 rounded-full bg-orange-400" style={{ width: `${Math.min(100, (p.currentSignatures / p.targetSignatures) * 100)}%` }} /></div>
                </div>
                <button onClick={() => sign(p.id)} className="mt-3 w-full rounded-lg bg-orange-500 py-1.5 text-xs font-medium text-white hover:bg-orange-600">Sign Petition</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-3 text-lg font-semibold">All Petitions</h2>
      <div className="space-y-3">
        {petitions.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex-1">
              <h3 className="font-medium">{p.title}</h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-1">{p.description}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                <span>{p.currentSignatures}/{p.targetSignatures} signatures</span>
                <span>{formatDate(p.createdAt)}</span>
              </div>
            </div>
            <button onClick={() => sign(p.id)} className="ml-4 rounded-lg border border-primary-200 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50">Sign</button>
          </div>
        ))}
        {petitions.length === 0 && <p className="py-12 text-center text-gray-400">No petitions yet</p>}
      </div>
    </div>
  );
}
