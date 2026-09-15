'use client';

import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <section className="py-16 md:py-24 bg-surface-container-low">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <span className="section-subtitle">Stay Updated</span>
          <h2 className="section-title mb-4">Join Our Wiki Community</h2>
          <p className="text-on-surface-variant mb-8">
            Get notified about new wiki launches, trending pages, anime/game news, and community events
            delivered straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 bg-transparent border border-outline-variant/30 rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn btn-primary px-6 py-3 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Subscribing...
                </span>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>

          {status === 'success' && (
            <p className="mt-4 text-success text-sm">
              ✓ Thanks for subscribing! Check your email for confirmation.
            </p>
          )}

          <p className="mt-4 text-on-surface-variant text-xs">
            No spam, unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
