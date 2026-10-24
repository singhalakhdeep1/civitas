'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';

interface Post { id: string; content: string; user?: { firstName: string; lastName: string }; createdAt: string }
interface Thread { id: string; title: string; content: string; user?: { firstName: string; lastName: string }; forumId: string; createdAt: string; posts: Post[] }

export default function ThreadPage() {
  const { id } = useParams<{ id: string }>();
  const token = useAuthStore((s) => s.accessToken);
  const [thread, setThread] = useState<Thread | null>(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    api.get<Thread>(`/forums/threads/${id}`, token ?? undefined).then(setThread).catch(() => {});
  }, [id, token]);

  async function postReply(e: React.FormEvent) {
    e.preventDefault();
    if (!token) { toast.error('Please sign in'); return; }
    try {
      const post = await api.post<Post>(`/forums/threads/${id}/posts`, { content: reply }, token);
      setThread((prev) => prev ? { ...prev, posts: [...prev.posts, post] } : prev);
      setReply('');
      toast.success('Reply posted');
    } catch { toast.error('Failed to post reply'); }
  }

  if (!thread) return <div className="py-12 text-center text-gray-400">Loading...</div>;

  return (
    <div>
      <Link href={`/forums/${thread.forumId}`} className="mb-4 inline-block text-sm text-primary-600 hover:underline">&larr; Back to threads</Link>

      <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold">{thread.title}</h1>
        <p className="mt-3 text-gray-700 whitespace-pre-wrap">{thread.content}</p>
        <div className="mt-4 text-xs text-gray-400">
          {thread.user ? `${thread.user.firstName} ${thread.user.lastName}` : 'Anonymous'} &middot; {formatDate(thread.createdAt)}
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold">Replies ({thread.posts.length})</h2>
      <div className="space-y-3">
        {thread.posts.map((p) => (
          <div key={p.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{p.content}</p>
            <div className="mt-2 text-xs text-gray-400">
              {p.user ? `${p.user.firstName} ${p.user.lastName}` : 'Anonymous'} &middot; {formatDate(p.createdAt)}
            </div>
          </div>
        ))}
        {thread.posts.length === 0 && <p className="py-6 text-center text-gray-400">No replies yet</p>}
      </div>

      <form onSubmit={postReply} className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
        <textarea required rows={3} placeholder="Write a reply..." value={reply} onChange={(e) => setReply(e.target.value)} className="mb-3 w-full rounded-lg border px-3 py-2" />
        <button type="submit" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">Post Reply</button>
      </form>
    </div>
  );
}
