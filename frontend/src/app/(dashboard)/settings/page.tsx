'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  const token = useAuthStore((s) => s.accessToken);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      await api.patch('/users/me', { firstName, lastName }, token);
      toast.success('Profile updated');
    } catch { toast.error('Update failed'); }
    setSaving(false);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      await api.patch('/auth/change-password', { currentPassword, newPassword }, token);
      setCurrentPassword('');
      setNewPassword('');
      toast.success('Password changed');
    } catch { toast.error('Password change failed'); }
    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold"><Settings className="h-6 w-6 text-gray-600" /> Settings</h1>

      <form onSubmit={updateProfile} className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">First Name</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Last Name</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
          </div>
        </div>
        <button type="submit" disabled={saving} className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50">Save Profile</button>
      </form>

      <form onSubmit={changePassword} className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Current Password</label>
            <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
            <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
          </div>
        </div>
        <button type="submit" disabled={saving} className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50">Change Password</button>
      </form>
    </div>
  );
}
