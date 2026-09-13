'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/src/context/ThemeContext';

interface Me {
  name: string;
  email: string;
}

export default function Header({ navLinks = [] }: { navLinks?: { label: string; url: string; icon?: string }[] }) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [me, setMe] = useState<Me | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then(({ user }) => setMe(user));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setMe(null);
    router.push('/');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`
          fixed top-0 inset-x-0 z-50
          transition-all duration-500 ease-out
          ${scrolled
            ? 'bg-surface-container-lowest/90 backdrop-blur-2xl shadow-[0_1px_0_0_rgba(160,120,255,0.08),0_8px_40px_-12px_rgba(0,0,0,0.8)]'
            : 'bg-surface-container-lowest/60 backdrop-blur-xl'
          }
        `}
      >
        {/* Subtle top gradient line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="h-[64px] w-full max-w-[1440px] mx-auto px-5 md:px-8 lg:px-10 flex items-center justify-between gap-4">

          {/* ── Left: Logo ── */}
          <Link className="flex items-center gap-2.5 group shrink-0" href="/">
            {/* Logo Mark with glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary-container to-primary/60 flex items-center justify-center shadow-[0_0_0_1px_rgba(160,120,255,0.2),0_2px_8px_-2px_rgba(160,120,255,0.3)] group-hover:shadow-[0_0_0_1px_rgba(160,120,255,0.4),0_4px_20px_-4px_rgba(160,120,255,0.5)] transition-shadow duration-500">
                <span className="text-on-primary-container font-bold text-base tracking-tight">M</span>
              </div>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[15px] font-semibold tracking-[-0.02em] text-on-surface group-hover:text-primary transition-colors duration-300">
                MarcWiki
              </span>
              <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-primary/60 leading-none mt-0.5">
                Living Archive
              </span>
            </div>
          </Link>

          {/* ── Center: Navigation ── */}
          <nav className="hidden lg:flex items-center gap-0.5 px-1.5 py-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
            {navLinks.map((link) => {
              const active = isActive(link.url);
              return (
                <Link
                  key={link.url}
                  href={link.url}
                  className={`
                    relative px-3.5 py-1.5 rounded-xl text-[13px] font-medium
                    transition-all duration-300 ease-out
                    ${active
                      ? 'text-primary-container bg-primary/15 shadow-[0_0_12px_-3px_rgba(160,120,255,0.3),inset_0_1px_0_0_rgba(160,120,255,0.1)]'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/[0.05]'
                    }
                  `}
                >
                  {active && (
                    <span className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-primary shadow-[0_0_8px_2px_rgba(160,120,255,0.4)]" />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Right: Actions ── */}
          <div className="flex items-center gap-2">

            {/* Search */}
            <button
              onClick={() => setSearchFocused(true)}
              className={`
                hidden md:flex items-center gap-2.5
                px-3.5 py-[7px] rounded-xl
                border transition-all duration-300
                ${searchFocused
                  ? 'bg-surface-container-high/80 border-primary/40 shadow-[0_0_0_3px_rgba(160,120,255,0.08),0_0_20px_-4px_rgba(160,120,255,0.15)] w-72'
                  : 'bg-white/[0.03] border-white/[0.07] hover:border-white/[0.12] hover:bg-white/[0.05] w-56 lg:w-64'
                }
                cursor-text group
              `}
              onBlur={() => setSearchFocused(false)}
            >
              <span className={`material-symbols-outlined text-[18px] transition-colors duration-300 ${searchFocused ? 'text-primary' : 'text-outline group-hover:text-on-surface-variant'}`}>
                search
              </span>
              <span className="flex-1 text-[13px] text-outline text-left truncate">
                Search wikis, characters...
              </span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-[1px] rounded-md bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono text-on-surface-variant/60">
                ⌘K
              </kbd>
            </button>

            {/* Divider */}
            <div className="hidden md:block w-[1px] h-5 bg-white/[0.08] mx-1" />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative w-8 h-8 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-white/[0.06] transition-all duration-300 group"
              aria-label="Toggle theme"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:rotate-45 transition-transform duration-500">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* CTA Button */}
            {me ? (
              <Link
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-[7px] rounded-xl text-[13px] font-semibold
                  bg-gradient-to-b from-primary-container to-primary/80
                  text-on-primary-container
                  shadow-[0_0_0_1px_rgba(160,120,255,0.3),0_2px_8px_-2px_rgba(160,120,255,0.4),inset_0_1px_0_0_rgba(255,255,255,0.15)]
                  hover:shadow-[0_0_0_1px_rgba(160,120,255,0.5),0_4px_20px_-4px_rgba(160,120,255,0.6),inset_0_1px_0_0_rgba(255,255,255,0.2)]
                  hover:brightness-110
                  active:scale-[0.97] active:brightness-95
                  transition-all duration-300"
                href="/create"
              >
                <span className="material-symbols-outlined text-[16px]">edit_square</span>
                <span>Create</span>
              </Link>
            ) : (
              <Link
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-[7px] rounded-xl text-[13px] font-semibold
                  bg-gradient-to-b from-primary-container to-primary/80
                  text-on-primary-container
                  shadow-[0_0_0_1px_rgba(160,120,255,0.3),0_2px_8px_-2px_rgba(160,120,255,0.4),inset_0_1px_0_0_rgba(255,255,255,0.15)]
                  hover:shadow-[0_0_0_1px_rgba(160,120,255,0.5),0_4px_20px_-4px_rgba(160,120,255,0.6),inset_0_1px_0_0_rgba(255,255,255,0.2)]
                  hover:brightness-110
                  active:scale-[0.97] active:brightness-95
                  transition-all duration-300"
                href="/login"
              >
                <span>Sign In</span>
              </Link>
            )}

            {/* Avatar / Profile */}
            {me && (
              <Link className="relative group" href="/account">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center
                  bg-gradient-to-br from-primary/20 to-primary/5
                  text-primary text-sm font-bold
                  ring-1 ring-white/[0.08]
                  group-hover:ring-primary/40
                  transition-all duration-300
                  shadow-[0_0_0_0_rgba(160,120,255,0)]
                  group-hover:shadow-[0_0_12px_-3px_rgba(160,120,255,0.3)]
                ">
                  {me.name.charAt(0).toUpperCase()}
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-tertiary ring-[1.5px] ring-surface-container-lowest" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative w-8 h-8 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-white/[0.06] transition-all duration-300 lg:hidden"
            >
              <span className={`material-symbols-outlined text-xl transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`}>
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom gradient edge */}
        <div className={`absolute bottom-0 inset-x-0 h-[1px] transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
          <div className="h-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]" />

          {/* Panel */}
          <div
            className="absolute top-[64px] inset-x-0 mx-3 mt-2 rounded-2xl overflow-hidden
              bg-surface-container/95 backdrop-blur-2xl
              border border-white/[0.08]
              shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(160,120,255,0.05)]
              animate-[slideDown_300ms_ease-out]
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Nav */}
            <nav className="p-3 space-y-0.5">
              {navLinks.map((link) => {
                const active = isActive(link.url);
                return (
                  <Link
                    key={link.url}
                    href={link.url}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                      transition-all duration-200
                      ${active
                        ? 'text-primary-container bg-primary/10'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-white/[0.04]'
                      }
                    `}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className={`material-symbols-outlined text-lg ${active ? 'text-primary' : 'text-outline'}`}>
                      {link.icon || 'link'}
                    </span>
                    {link.label}
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_2px_rgba(160,120,255,0.4)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Search */}
            <div className="px-3 pb-3">
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="material-symbols-outlined text-lg text-outline">search</span>
                <span className="text-sm text-outline">Search wikis, characters...</span>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-3 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* Mobile Auth */}
            <div className="p-3">
              {me ? (
                <div className="space-y-2">
                  <Link
                    href="/account"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-white/[0.04] transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="material-symbols-outlined text-lg text-outline">person</span>
                    Account
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
                      bg-gradient-to-b from-primary-container to-primary/80 text-on-primary-container
                      shadow-[0_0_0_1px_rgba(160,120,255,0.3),0_2px_8px_-2px_rgba(160,120,255,0.4)]
                      active:scale-[0.98] transition-all"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    Log out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    className="flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold
                      bg-gradient-to-b from-primary-container to-primary/80 text-on-primary-container
                      shadow-[0_0_0_1px_rgba(160,120,255,0.3)] active:scale-[0.98] transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
