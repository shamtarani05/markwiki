'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Me {
  name: string;
  email: string;
}

export default function AdminTopBar() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then(({ user }) => setMe(user));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-6 bg-background">
      <input
        type="search"
        placeholder="Search…"
        className="w-64 max-w-[40vw] px-3 py-1.5 text-sm bg-background-secondary border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent transition-colors"
      />
      <div className="flex items-center gap-3">
        {me && <span className="text-sm text-foreground-muted hidden sm:block">{me.name}</span>}
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-contrast text-sm font-bold">
          {me?.name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs text-foreground-muted hover:text-foreground transition-colors"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
