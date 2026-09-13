import Link from 'next/link';
import type { NavItem } from '@/src/lib/db/getNavigationConfig';

export default function Footer({ navLinks = [] }: { navLinks?: NavItem[] }) {
  // Organize links into columns. If the admin hasn't set up columns,
  // we just render them all in one column or split them heuristically.
  const explore = navLinks.slice(0, Math.ceil(navLinks.length / 3));
  const community = navLinks.slice(Math.ceil(navLinks.length / 3), Math.ceil(navLinks.length * 2 / 3));
  const company = navLinks.slice(Math.ceil(navLinks.length * 2 / 3));

  return (
    <footer className="w-full bg-surface-container-lowest border-t border-white/[0.09] mt-space-2xl pt-space-2xl pb-space-xl">
      <div className="max-w-[1440px] mx-auto px-margin-sm md:px-margin lg:px-margin-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl pb-space-2xl border-b border-white/[0.06]">
          <div className="lg:col-span-2 space-y-space-md pr-space-lg">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                <span className="text-on-primary-container font-bold text-lg">M</span>
              </div>
              <span className="font-headline-md text-headline-md tracking-tight text-on-surface">MarcWiki</span>
            </div>
            <p className="text-body-editorial font-body-editorial text-on-surface-variant max-w-sm">
              Built by fans, for fans. The Living Archive for the worlds you love.
            </p>
            <div className="flex items-center gap-space-xs text-tertiary-fixed-dim font-label-mono text-label-mono">
              <span className="w-2 h-2 rounded-full bg-tertiary inline-block animate-ping"></span>
              <span>ARCHIVE NETWORK LIVE • 142,891 CANONS ACTIVE</span>
            </div>
          </div>
          
          <div className="space-y-space-md">
            <h4 className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">Explore</h4>
            <ul className="space-y-space-xs text-body-sm font-body-sm text-on-surface-variant">
              {explore.map((link) => (
                <li key={link.url} className="hover:text-primary transition-colors cursor-pointer">
                  <Link href={link.url} target={link.isExternal ? '_blank' : undefined} rel={link.isExternal ? 'noopener noreferrer' : undefined}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-space-md">
            <h4 className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">Community</h4>
            <ul className="space-y-space-xs text-body-sm font-body-sm text-on-surface-variant">
              {community.map((link) => (
                <li key={link.url} className="hover:text-primary transition-colors cursor-pointer">
                  <Link href={link.url} target={link.isExternal ? '_blank' : undefined} rel={link.isExternal ? 'noopener noreferrer' : undefined}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-space-md">
            <h4 className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">Platform & Legal</h4>
            <ul className="space-y-space-xs text-body-sm font-body-sm text-on-surface-variant">
              {company.map((link) => (
                <li key={link.url} className="hover:text-primary transition-colors cursor-pointer">
                  <Link href={link.url} target={link.isExternal ? '_blank' : undefined} rel={link.isExternal ? 'noopener noreferrer' : undefined}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md text-on-surface-variant font-label-mono text-label-mono">
          <div>© {new Date().getFullYear()} MarcWiki Foundation. Preserving collective human imagination.</div>
          <div className="flex items-center gap-space-lg">
            <span className="hover:text-primary transition-colors cursor-pointer">DISCORD</span>
            <span className="hover:text-primary transition-colors cursor-pointer">GITHUB</span>
            <span className="hover:text-primary transition-colors cursor-pointer">FEED (RSS)</span>
            <span className="hover:text-primary transition-colors cursor-pointer">SECURITY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
