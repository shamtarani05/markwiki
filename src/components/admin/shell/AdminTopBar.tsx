'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '@/src/context/ThemeContext';

interface Me {
  name: string;
  email: string;
}

export default function AdminTopBar() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  // ThemeProvider (wrapped around this shell in app/admin/layout.tsx) already
  // reads localStorage/system preference on mount and writes data-theme onto
  // <html>. What was missing was any control to actually flip it, so the admin
  // portal was effectively stuck on whatever it loaded with — the public
  // site's Header has had this toggle all along.
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then(({ user }) => setMe(user));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="h-14 shrink-0 border-b border-border flex items-center justify-between gap-4 px-4 md:px-6 bg-background">
      <div className="relative w-72 max-w-[45vw]">
        <Search
          size={15}
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none"
        />
        <input
          type="search"
          placeholder="Search content"
          aria-label="Search content"
          className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-background-secondary border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          className="w-8 h-8 flex items-center justify-center rounded-md text-foreground-muted hover:text-foreground hover:bg-background-tertiary transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <span aria-hidden="true" className="w-px h-5 bg-border mx-2" />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-accent-contrast text-xs font-bold shrink-0">
            {me?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          {me && <span className="text-[13px] text-foreground hidden sm:block">{me.name}</span>}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
          className="w-8 h-8 ml-1 flex items-center justify-center rounded-md text-foreground-muted hover:text-foreground hover:bg-background-tertiary transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
