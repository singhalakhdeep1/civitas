'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';

interface Thread { id: string; title: string; content: string; user?: { firstName: string; lastName: string }; _count?: { posts: number }; createdAt: string }

export default function ForumThreadsPage() {
  const { forumId } = useParams<{ forumId: string }>();
  const token = useAuthStore((s) => s.accessToken);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    api.get<Thread[]>(`/forums/${forumId}/threads`, token ?? undefined).then(setThreads).catch(() => {});
  }, [forumId, token]);

  async function createThread(e: React.FormEvent) {
    e.preventDefault();
    if (!token) { toast.error('Please sign in'); return; }
    try {
      const thread = await api.post<Thread>(`/forums/${forumId}/threads`, { title, content }, token);
      setThreads((prev) => [thread, ...prev]);
      setTitle('');
      setContent('');
      toast.success('Thread created');
    } catch { toast.error('Failed to create thread'); }
  }

  return (
    <div>
      <Link href="/forums" className="mb-4 inline-block text-sm text-primary-600 hover:underline">&larr; Back to forums</Link>
      <h1 className="mb-6 text-2xl font-bold">Forum Threads</h1>

      <form onSubmit={createThread} className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold">New Thread</h2>
        <input type="text" required placeholder="Thread title" value={title} onChange={(e) => setTitle(e.target.value)} className="mb-3 w-full rounded-lg border px-3 py-2" />
        <textarea required rows={3} placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} className="mb-3 w-full rounded-lg border px-3 py-2" />
        <button type="submit" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">Post Thread</button>
      </form>

      <div className="space-y-3">
        {threads.map((t) => (
          <Link key={t.id} href={`/forums/thread/${t.id}`} className="block rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
            <h3 className="font-medium">{t.title}</h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{t.content}</p>
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
              <span>{t.user ? `${t.user.firstName} ${t.user.lastName}` : 'Anonymous'}</span>
              <span>{t._count?.posts ?? 0} replies</span>
              <span>{formatDate(t.createdAt)}</span>
            </div>
          </Link>
        ))}
        {threads.length === 0 && <p className="py-12 text-center text-gray-400">No threads yet — be the first!</p>}
      </div>
    </div>
  );
}
