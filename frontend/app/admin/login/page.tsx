'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('foodgen@123');
  const [password, setPassword] = useState('Food@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Login failed. Please check credentials.');
        setLoading(false);
        return;
      }

      localStorage.setItem('adminAccessToken', data.accessToken);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      router.push('/admin/dashboard');
    } catch (err) {
      setError('Unable to connect to the backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800/70 bg-slate-900/80 p-10 shadow-glow backdrop-blur-sm">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Admin sign in</p>
          <h1 className="text-4xl font-semibold text-white">FoodGenie Admin Login</h1>
          <p className="text-slate-400">Use the admin credentials to access dashboard metrics and manage orders.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-slate-400">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-800/80 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-400">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-800/80 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400"
                required
              />
            </label>
          </div>

          {error ? <p className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
