'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { MapPin, Clock, Users } from 'lucide-react';

interface Opportunity { id: string; title: string; description: string; category: string; isRemote: boolean; location?: string; startDate: string; endDate?: string; hoursPerWeek?: number; totalSpots: number; nonprofit?: { id: string; name: string; verified: boolean }; _count?: { applications: number } }

export default function VolunteeringPage() {
  const token = useAuthStore((s) => s.accessToken);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'browse' | 'my'>('browse');
  const [myApps, setMyApps] = useState<{ id: string; status: string; opportunity: Opportunity }[]>([]);

  useEffect(() => {
    api.get<Opportunity[]>(`/volunteering/opportunities${search ? `?search=${search}` : ''}`, token ?? undefined).then(setOpportunities).catch(() => {});
  }, [token, search]);

  useEffect(() => {
    if (token && tab === 'my') {
      api.get<{ id: string; status: string; opportunity: Opportunity }[]>('/volunteering/my-applications', token).then(setMyApps).catch(() => {});
    }
  }, [token, tab]);

  async function apply(opportunityId: string) {
    if (!token) { toast.error('Please sign in'); return; }
    try {
      await api.post(`/volunteering/opportunities/${opportunityId}/apply`, { message: 'I would like to volunteer' }, token);
      toast.success('Application submitted!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to apply');
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Volunteering</h1>
      <div className="mb-6 flex gap-4">
        <button onClick={() => setTab('browse')} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === 'browse' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border'}`}>Browse Opportunities</button>
        <button onClick={() => setTab('my')} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === 'my' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border'}`}>My Applications</button>
      </div>

      {tab === 'browse' && (
        <>
          <input type="text" placeholder="Search opportunities..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-6 w-full rounded-lg border bg-white px-4 py-2.5 shadow-sm" />
          <div className="grid gap-4 md:grid-cols-2">
            {opportunities.map((o) => (
              <div key={o.id} className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-700">{o.category}</span>
                  {o.isRemote && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">Remote</span>}
                </div>
                <h3 className="mt-2 font-semibold">{o.title}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{o.description}</p>
                {o.nonprofit && <p className="mt-2 text-xs text-gray-400">by {o.nonprofit.name}</p>}
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                  {o.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{o.location}</span>}
                  {o.hoursPerWeek && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{o.hoursPerWeek}h/wk</span>}
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{o._count?.applications ?? 0}/{o.totalSpots} spots</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Starts {formatDate(o.startDate)}</span>
                  <button onClick={() => apply(o.id)} className="rounded-lg bg-accent-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-accent-700">Apply</button>
                </div>
              </div>
            ))}
            {opportunities.length === 0 && <p className="col-span-full py-12 text-center text-gray-400">No opportunities found</p>}
          </div>
        </>
      )}

      {tab === 'my' && (
        <div className="space-y-3">
          {myApps.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
              <div>
                <p className="font-medium">{a.opportunity.title}</p>
                <p className="text-sm text-gray-500">{a.opportunity.nonprofit?.name}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${a.status === 'APPROVED' ? 'bg-green-50 text-green-700' : a.status === 'REJECTED' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>{a.status}</span>
            </div>
          ))}
          {myApps.length === 0 && <p className="py-12 text-center text-gray-400">No applications yet</p>}
        </div>
      )}
    </div>
  );
}
