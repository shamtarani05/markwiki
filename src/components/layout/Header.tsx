'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/src/context/ThemeContext';

interface Me {
  name: string;
  email: string;
}

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then(({ user }) => setMe(user));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setMe(null);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/wikis', label: 'Wikis' },
    { href: '/anime', label: 'Anime' },
    { href: '/games', label: 'Games' },
    { href: '/web-novels', label: 'Web Novels' },
    { href: '/community', label: 'Community' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-accent-contrast font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              Marc<span className="text-accent">Wiki</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground-muted hover:text-accent transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-background-tertiary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Search */}
            <button className="p-2 rounded-lg hover:bg-background-tertiary transition-colors hidden sm:block">
              <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Sign In / Sign Up */}
            <div className="hidden sm:flex items-center gap-2">
              {me ? (
                <>
                  <Link href="/account" className="btn btn-ghost text-sm">
                    Account
                  </Link>
                  <button type="button" onClick={handleLogout} className="btn btn-primary text-sm">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn btn-ghost text-sm">
                    Sign In
                  </Link>
                  <Link href="/register" className="btn btn-primary text-sm">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-background-tertiary transition-colors lg:hidden"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fadeIn">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-foreground-muted hover:text-accent hover:bg-background-tertiary rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-border my-2" />
              {me ? (
                <>
                  <Link
                    href="/account"
                    className="px-4 py-2 text-foreground-muted hover:text-accent hover:bg-background-tertiary rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Account
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="px-4 py-2 bg-accent text-accent-contrast font-medium rounded-lg text-center"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-foreground-muted hover:text-accent hover:bg-background-tertiary rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-accent text-accent-contrast font-medium rounded-lg text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
