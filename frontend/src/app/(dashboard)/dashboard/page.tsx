'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Heart, Users, Calendar, FileText } from 'lucide-react';

interface Stats { totalCampaigns: number; totalDonations: number; totalEvents: number; totalVolunteers: number }

export default function DashboardPage() {
  const { user, accessToken } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (accessToken) {
      api.get<Stats>('/analytics/platform', accessToken).then(setStats).catch(() => {});
    }
  }, [accessToken]);

  const cards = [
    { label: 'Campaigns', value: stats?.totalCampaigns ?? '-', icon: Heart, color: 'text-rose-600 bg-rose-50' },
    { label: 'Donations', value: stats?.totalDonations ?? '-', icon: Heart, color: 'text-green-600 bg-green-50' },
    { label: 'Events', value: stats?.totalEvents ?? '-', icon: Calendar, color: 'text-blue-600 bg-blue-50' },
    { label: 'Volunteers', value: stats?.totalVolunteers ?? '-', icon: Users, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Welcome back, {user?.firstName || 'there'}</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{c.label}</p>
                <p className="mt-1 text-2xl font-bold">{c.value}</p>
              </div>
              <div className={`rounded-lg p-2.5 ${c.color}`}><c.icon className="h-5 w-5" /></div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a href="/campaigns" className="rounded-lg bg-primary-50 p-4 text-center text-sm font-medium text-primary-700 hover:bg-primary-100">Browse Campaigns</a>
          <a href="/volunteering" className="rounded-lg bg-accent-50 p-4 text-center text-sm font-medium text-accent-700 hover:bg-accent-100">Find Volunteer Work</a>
          <a href="/events" className="rounded-lg bg-blue-50 p-4 text-center text-sm font-medium text-blue-700 hover:bg-blue-100">Upcoming Events</a>
          <a href="/petitions" className="rounded-lg bg-purple-50 p-4 text-center text-sm font-medium text-purple-700 hover:bg-purple-100">Sign a Petition</a>
        </div>
      </div>
    </div>
  );
}
