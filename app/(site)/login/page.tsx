'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Login failed');
      const next = searchParams.get('next');
      if (next) router.push(next);
      else router.push(body.user.role === 'admin' || body.user.role === 'editor' ? '/admin' : '/');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm card p-6">
        <h1 className="text-2xl font-bold text-on-surface mb-1">Welcome back</h1>
        <p className="text-sm text-on-surface-variant mb-6">Sign in to continue reading and contributing.</p>
        {error && <p className="mb-4 text-sm text-[var(--tag-red)]">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="block text-xs text-on-surface-variant mb-1">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:border-accent transition-colors"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-on-surface-variant mb-1">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:border-accent transition-colors"
            />
          </label>
          <button type="submit" disabled={submitting} className="btn btn-primary w-full disabled:opacity-60">
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="text-sm text-on-surface-variant mt-4 text-center">
          No account? <Link href="/register" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
