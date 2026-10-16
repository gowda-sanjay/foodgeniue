'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminAccessToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    async function fetchDashboard() {
      try {
        const response = await fetch(`${apiUrl}/api/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('adminAccessToken');
            localStorage.removeItem('adminUser');
            router.push('/admin/login');
            return;
          }
          setError(data.message || 'Unable to load dashboard.');
          return;
        }

        setStats(data);
      } catch (err) {
        setError('Unable to connect to the backend.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-8 shadow-glow backdrop-blur-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Admin dashboard</p>
              <h1 className="text-4xl font-semibold text-white">FoodGenie Admin</h1>
              <p className="mt-3 text-slate-400">Live metrics for restaurants, orders, payments, and AI usage.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('adminAccessToken');
                localStorage.removeItem('adminUser');
                router.push('/admin/login');
              }}
              className="rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
            >
              Sign out
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-10 text-center text-slate-400">Loading dashboard…</div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-10 text-center text-rose-300">{error}</div>
        ) : stats ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-8 shadow-glow">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Today’s orders</p>
              <p className="mt-4 text-5xl font-semibold text-white">{stats.todaysOrders}</p>
            </div>
            <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-8 shadow-glow">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Today’s sales</p>
              <p className="mt-4 text-5xl font-semibold text-white">₹{stats.todaysSales}</p>
            </div>
            <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-8 shadow-glow">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Total revenue</p>
              <p className="mt-4 text-5xl font-semibold text-white">₹{stats.revenue}</p>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
