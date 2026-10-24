'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';

interface Event { id: string; title: string; description: string; date: string; endDate?: string; location: string; address?: string; maxAttendees: number; ticketPrice: number; nonprofit?: { name: string }; _count?: { registrations: number } }

export default function EventsPage() {
  const token = useAuthStore((s) => s.accessToken);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    api.get<Event[]>('/events', token ?? undefined).then(setEvents).catch(() => {});
  }, [token]);

  async function register(eventId: string) {
    if (!token) { toast.error('Please sign in'); return; }
    try {
      await api.post(`/events/${eventId}/register`, {}, token);
      toast.success('Registered for event!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Events</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((ev) => (
          <div key={ev.id} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm text-primary-600">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{formatDate(ev.date)}</span>
            </div>
            <h3 className="font-semibold">{ev.title}</h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{ev.description}</p>
            {ev.nonprofit && <p className="mt-2 text-xs text-gray-400">by {ev.nonprofit.name}</p>}
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.location}</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{ev._count?.registrations ?? 0}/{ev.maxAttendees}</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm font-medium">
                <Ticket className="h-4 w-4 text-gray-400" />
                {ev.ticketPrice > 0 ? `$${(ev.ticketPrice / 100).toFixed(2)}` : 'Free'}
              </span>
              <button onClick={() => register(ev.id)} className="rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700">Register</button>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="col-span-full py-12 text-center text-gray-400">No upcoming events</p>}
      </div>
    </div>
  );
}
