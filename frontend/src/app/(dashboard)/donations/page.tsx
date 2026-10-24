'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Donation { id: string; amount: number; status: string; campaignId: string; campaign?: { title: string }; createdAt: string }
interface RecurringDonation { id: string; amount: number; frequency: string; status: string; campaign?: { title: string }; nextChargeDate: string }

export default function DonationsPage() {
  const token = useAuthStore((s) => s.accessToken);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [recurring, setRecurring] = useState<RecurringDonation[]>([]);

  useEffect(() => {
    if (!token) return;
    api.get<Donation[]>('/donations/my-donations', token).then(setDonations).catch(() => {});
    api.get<RecurringDonation[]>('/donations/my-recurring', token).then(setRecurring).catch(() => {});
  }, [token]);

  async function cancelRecurring(id: string) {
    if (!token) return;
    try {
      await api.patch(`/donations/recurring/${id}/cancel`, {}, token);
      setRecurring((prev) => prev.filter((r) => r.id !== id));
      toast.success('Recurring donation cancelled');
    } catch { toast.error('Failed to cancel'); }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Donations</h1>

      {recurring.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Recurring Donations</h2>
          <div className="space-y-3">
            {recurring.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
                <div>
                  <p className="font-medium">{r.campaign?.title || 'Campaign'}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(r.amount)} / {r.frequency.toLowerCase()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">Next: {formatDate(r.nextChargeDate)}</span>
                  <button onClick={() => cancelRecurring(r.id)} className="rounded-lg border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-3 text-lg font-semibold">Donation History</h2>
      <div className="rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left text-gray-500"><th className="px-4 py-3">Campaign</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th></tr></thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{d.campaign?.title || d.campaignId}</td>
                <td className="px-4 py-3">{formatCurrency(d.amount)}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${d.status === 'COMPLETED' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{d.status}</span></td>
                <td className="px-4 py-3 text-gray-500">{formatDate(d.createdAt)}</td>
              </tr>
            ))}
            {donations.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No donations yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
