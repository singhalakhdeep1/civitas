'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Shield, CheckCircle, XCircle } from 'lucide-react';

interface AdminStats { totalUsers: number; totalNonprofits: number; totalCampaigns: number; totalDonations: number; pendingVerifications: number }
interface Verification { id: string; name: string; type: string; status: string }

export default function AdminPage() {
  const token = useAuthStore((s) => s.accessToken);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pending, setPending] = useState<Verification[]>([]);

  useEffect(() => {
    if (!token) return;
    api.get<AdminStats>('/admin/stats', token).then(setStats).catch(() => {});
    api.get<Verification[]>('/admin/verifications/pending', token).then(setPending).catch(() => {});
  }, [token]);

  async function verify(id: string, approved: boolean) {
    if (!token) return;
    try {
      await api.patch(`/admin/nonprofits/${id}/verify`, { status: approved ? 'VERIFIED' : 'REJECTED' }, token);
      setPending((prev) => prev.filter((p) => p.id !== id));
      toast.success(approved ? 'Nonprofit verified' : 'Verification rejected');
    } catch { toast.error('Action failed'); }
  }

  const statCards = stats ? [
    { label: 'Users', value: stats.totalUsers },
    { label: 'Nonprofits', value: stats.totalNonprofits },
    { label: 'Campaigns', value: stats.totalCampaigns },
    { label: 'Donations', value: stats.totalDonations },
    { label: 'Pending Verifications', value: stats.pendingVerifications },
  ] : [];

  return (
    <div>
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold"><Shield className="h-6 w-6 text-primary-600" /> Admin Panel</h1>

      {stats && (
        <div className="mb-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {statCards.map((s) => (
            <div key={s.label} className="rounded-xl border bg-white p-4 shadow-sm text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold">Pending Verifications</h2>
      <div className="space-y-3">
        {pending.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-500">{p.type}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => verify(p.id, true)} className="rounded-lg bg-green-50 p-2 text-green-600 hover:bg-green-100" title="Approve"><CheckCircle className="h-5 w-5" /></button>
              <button onClick={() => verify(p.id, false)} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100" title="Reject"><XCircle className="h-5 w-5" /></button>
            </div>
          </div>
        ))}
        {pending.length === 0 && <p className="py-8 text-center text-gray-400">No pending verifications</p>}
      </div>
    </div>
  );
}
