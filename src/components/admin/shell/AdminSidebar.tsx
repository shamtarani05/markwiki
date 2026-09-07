'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, BookOpen, FileText, Book, PenLine, ScrollText,
  Tag, Megaphone, Compass, Palette, Inbox, Users, Settings,
  PanelLeftClose, PanelLeftOpen, type LucideIcon,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// Items with no href are intentionally not built yet — shown greyed out so
// the sidebar communicates the full planned IA (per PROGRESS.md's Admin
// Panel checklist) instead of hiding the gaps or linking to dead routes.
const NAV_GROUPS: { label: string; items: (NavItem | { label: string; icon: LucideIcon })[] }[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { label: 'Wikis', href: '/admin/wikis', icon: BookOpen },
      { label: 'Pages', href: '/admin/pages', icon: FileText },
      { label: 'Site Pages', href: '/admin/pages/site', icon: FileText },
      { label: 'Books', icon: Book },
      { label: 'Blog Posts', icon: PenLine },
      { label: 'Short Stories', icon: ScrollText },
    ],
  },
  {
    label: 'Site',
    items: [
      { label: 'Categories', icon: Tag },
      { label: 'Ad Placements', icon: Megaphone },
      { label: 'Navigation', icon: Compass },
      { label: 'Theme', icon: Palette },
    ],
  },
  {
    label: 'Community',
    items: [
      { label: 'Review Queue', href: '/admin/review', icon: Inbox },
      { label: 'Users', icon: Users },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

const STORAGE_KEY = 'admin-sidebar-collapsed';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === '1');
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      return next;
    });
  };

  return (
    <aside
      className={`shrink-0 border-r border-border bg-background-secondary h-screen flex-col hidden md:flex transition-[width] duration-150 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className={`flex items-center h-14 shrink-0 border-b border-border ${collapsed ? 'justify-center px-0' : 'justify-between px-3'}`}>
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center shrink-0">
              <span className="text-accent-contrast font-bold text-xs">M</span>
            </div>
            <span className="font-semibold text-foreground text-sm truncate">Admin</span>
          </Link>
        )}
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-8 h-8 flex items-center justify-center rounded-md text-foreground-muted hover:text-foreground hover:bg-background-tertiary transition-colors shrink-0"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-2 text-[11px] font-semibold text-foreground-muted/70 uppercase tracking-wider mb-1">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                if (!('href' in item)) {
                  return (
                    <div
                      key={item.label}
                      title={collapsed ? `${item.label} (soon)` : undefined}
                      className={`flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-foreground-muted/40 cursor-not-allowed ${collapsed ? 'justify-center' : ''}`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={16} className="shrink-0 opacity-60" />
                        {!collapsed && item.label}
                      </span>
                      {!collapsed && <span className="text-[9px] uppercase tracking-wide text-foreground-muted/40">soon</span>}
                    </div>
                  );
                }
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`relative flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                      collapsed ? 'justify-center' : ''
                    } ${
                      active
                        ? 'bg-accent-muted text-accent font-medium'
                        : 'text-foreground-muted hover:bg-background-tertiary hover:text-foreground'
                    }`}
                  >
                    {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-accent" />}
                    <Icon size={16} className="shrink-0" />
                    {!collapsed && item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
