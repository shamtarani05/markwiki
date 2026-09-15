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
    <header className="h-14 shrink-0 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between gap-4 px-4 md:px-6 bg-[#0B0B0F]/85 backdrop-blur-[12px] relative z-10">
      {/* Live status pulse pip */}
      <div className="absolute -bottom-[3px] left-6 w-[6px] h-[6px] rounded-full bg-[#35C98A] animate-[pulse_2s_ease-in-out_infinite]" />

      <form action="/admin/search" className="relative w-72 max-w-[45vw]">
        <Search
          size={15}
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A7A5AE] pointer-events-none"
        />
        <input
          name="q"
          type="search"
          placeholder="Search content"
          aria-label="Search content"
          className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-[#121218] border border-[rgba(255,255,255,0.09)] rounded-md text-[#F5F3EF] placeholder:text-[#706F78] focus:outline-none focus:border-[#8B5CF6] focus:shadow-[inset_0_0_0_1px_#8B5CF6] transition-all"
        />
      </form>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          className="w-8 h-8 flex items-center justify-center rounded-md text-[#A7A5AE] hover:text-[#F5F3EF] hover:bg-[#181820] transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <span aria-hidden="true" className="w-px h-5 bg-[rgba(255,255,255,0.09)] mx-2" />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#8B5CF6] flex items-center justify-center text-[#F5F3EF] text-xs font-bold shrink-0">
            {me?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          {me && <span className="text-[13px] text-[#F5F3EF] hidden sm:block">{me.name}</span>}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
          className="w-8 h-8 ml-1 flex items-center justify-center rounded-md text-[#A7A5AE] hover:text-[#F5F3EF] hover:bg-[#181820] transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
