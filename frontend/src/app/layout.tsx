import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Civitas — Civic Engagement Platform',
  description: 'Connecting nonprofits, donors and volunteers for civic impact',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
