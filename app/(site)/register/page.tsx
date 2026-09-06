'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Registration failed');
      router.push('/');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm card p-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Create your account</h1>
        <p className="text-sm text-foreground-muted mb-6">Join to track your reading and contribute to wikis.</p>
        {error && <p className="mb-4 text-sm text-[var(--tag-red)]">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="block text-xs text-foreground-muted mb-1">Name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-foreground-muted mb-1">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-foreground-muted mb-1">Password</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </label>
          <button type="submit" disabled={submitting} className="btn btn-primary w-full disabled:opacity-60">
            {submitting ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>
        <p className="text-sm text-foreground-muted mt-4 text-center">
          Already have an account? <Link href="/login" className="text-accent hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
