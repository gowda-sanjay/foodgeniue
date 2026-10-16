import Link from 'next/link';

export default function AdminIndexPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-8 rounded-3xl border border-slate-800/70 bg-slate-900/80 p-10 shadow-glow backdrop-blur-sm">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Admin Portal</p>
          <h1 className="text-4xl font-semibold text-white">FoodGenie AI Admin</h1>
          <p className="text-slate-400">
            Secure admin login and dashboard for managing KGF restaurants, orders, payments, and AI analytics.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/admin/login" className="rounded-3xl bg-sky-500 px-6 py-5 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
            Admin Login
          </Link>
          <Link href="/admin/dashboard" className="rounded-3xl border border-slate-700 px-6 py-5 text-center text-sm font-semibold text-slate-100 transition hover:border-slate-500">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
