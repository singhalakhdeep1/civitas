'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { Bell, Check } from 'lucide-react';

interface Notification { id: string; title: string; message: string; type: string; read: boolean; createdAt: string }

export default function CommunicationsPage() {
  const token = useAuthStore((s) => s.accessToken);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!token) return;
    api.get<Notification[]>('/communications/notifications', token).then(setNotifications).catch(() => {});
  }, [token]);

  async function markRead(id: string) {
    if (!token) return;
    try {
      await api.patch(`/communications/notifications/${id}/read`, {}, token);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    } catch { toast.error('Failed to mark as read'); }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Notifications</h1>
      <div className="space-y-2">
        {notifications.map((n) => (
          <div key={n.id} className={`flex items-start gap-3 rounded-xl border p-4 shadow-sm ${n.read ? 'bg-white' : 'bg-blue-50 border-blue-100'}`}>
            <Bell className={`mt-0.5 h-5 w-5 ${n.read ? 'text-gray-300' : 'text-primary-500'}`} />
            <div className="flex-1">
              <h3 className="text-sm font-medium">{n.title}</h3>
              <p className="mt-0.5 text-sm text-gray-500">{n.message}</p>
              <p className="mt-1 text-xs text-gray-400">{formatDate(n.createdAt)}</p>
            </div>
            {!n.read && (
              <button onClick={() => markRead(n.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="Mark as read">
                <Check className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        {notifications.length === 0 && <p className="py-12 text-center text-gray-400">No notifications</p>}
      </div>
    </div>
  );
}
