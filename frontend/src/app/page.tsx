'use client';

import Link from 'next/link';
import { Heart, Users, Calendar, FileText, BarChart3, ArrowRight } from 'lucide-react';

const features = [
  { icon: Heart, title: 'Campaigns & Donations', desc: 'Support causes with one-time or recurring donations through secure Stripe checkout.', href: '/campaigns' },
  { icon: Users, title: 'Volunteering', desc: 'Find opportunities, apply, log hours, and earn certificates for your service.', href: '/volunteering' },
  { icon: Calendar, title: 'Events', desc: 'Discover community events, register, and get tickets for local happenings.', href: '/events' },
  { icon: FileText, title: 'Petitions', desc: 'Start or sign petitions to advocate for change in your community.', href: '/petitions' },
  { icon: BarChart3, title: 'Impact Stories', desc: 'See the real impact nonprofits are making with transparent reporting.', href: '/impact' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <nav className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-700">Civitas</Link>
          <div className="flex items-center gap-4">
            <Link href="/campaigns" className="text-sm text-gray-600 hover:text-primary-600">Campaigns</Link>
            <Link href="/events" className="text-sm text-gray-600 hover:text-primary-600">Events</Link>
            <Link href="/volunteering" className="text-sm text-gray-600 hover:text-primary-600">Volunteer</Link>
            <Link href="/auth/login" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">Sign In</Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-primary-600 to-primary-800 px-6 py-24 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight">Make a Difference in Your Community</h1>
          <p className="mb-8 text-xl text-primary-100">Civitas connects nonprofits, donors, and volunteers to drive civic engagement and create lasting impact.</p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/register" className="rounded-lg bg-white px-6 py-3 font-semibold text-primary-700 hover:bg-primary-50">Get Started</Link>
            <Link href="/campaigns" className="rounded-lg border-2 border-white px-6 py-3 font-semibold text-white hover:bg-white/10">Browse Campaigns</Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold">How Civitas Works</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Link key={f.href} href={f.href} className="group rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
                <f.icon className="mb-4 h-10 w-10 text-primary-600" />
                <h3 className="mb-2 text-lg font-semibold group-hover:text-primary-600">{f.title}</h3>
                <p className="mb-4 text-sm text-gray-600">{f.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600">
                  Explore <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
