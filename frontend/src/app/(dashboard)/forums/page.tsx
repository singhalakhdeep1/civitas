'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';

interface Forum { id: string; title: string; description: string; category?: string; _count?: { threads: number }; createdAt: string }

export default function ForumsPage() {
  const token = useAuthStore((s) => s.accessToken);
  const [forums, setForums] = useState<Forum[]>([]);

  useEffect(() => {
    api.get<Forum[]>('/forums', token ?? undefined).then(setForums).catch(() => {});
  }, [token]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Community Forums</h1>
      <div className="space-y-3">
        {forums.map((f) => (
          <Link key={f.id} href={`/forums/${f.id}`} className="flex items-center gap-4 rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="rounded-lg bg-primary-50 p-3"><MessageSquare className="h-6 w-6 text-primary-600" /></div>
            <div className="flex-1">
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{f.description}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                <span>{f._count?.threads ?? 0} threads</span>
                <span>Created {formatDate(f.createdAt)}</span>
              </div>
            </div>
          </Link>
        ))}
        {forums.length === 0 && <p className="py-12 text-center text-gray-400">No forums yet</p>}
      </div>
    </div>
  );
}
