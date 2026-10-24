'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

interface Story { id: string; title: string; content: string; metrics?: Record<string, number>; nonprofit?: { name: string }; createdAt: string }

export default function ImpactPage() {
  const token = useAuthStore((s) => s.accessToken);
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    api.get<Story[]>('/impact/stories', token ?? undefined).then(setStories).catch(() => {});
  }, [token]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Impact Stories</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {stories.map((s) => (
          <div key={s.id} className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent-600" />
              <h3 className="font-semibold">{s.title}</h3>
            </div>
            <p className="text-sm text-gray-600">{s.content}</p>
            {s.metrics && Object.keys(s.metrics).length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {Object.entries(s.metrics).map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-accent-50 p-3 text-center">
                    <p className="text-lg font-bold text-accent-700">{v.toLocaleString()}</p>
                    <p className="text-xs text-accent-600">{k.replace(/_/g, ' ')}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
              <span>{s.nonprofit?.name}</span>
              <span>{formatDate(s.createdAt)}</span>
            </div>
          </div>
        ))}
        {stories.length === 0 && <p className="col-span-full py-12 text-center text-gray-400">No impact stories yet</p>}
      </div>
    </div>
  );
}
