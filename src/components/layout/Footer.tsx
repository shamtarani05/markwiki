import Link from 'next/link';
import type { NavItem } from '@/src/lib/db/getNavigationConfig';
import { Code, Globe, MessageCircle, Rss, ShieldCheck, Zap } from 'lucide-react';

export default function Footer({ navLinks = [] }: { navLinks?: NavItem[] }) {
  // Organize links into columns. If the admin hasn't set up columns,
  // we just render them all in one column or split them heuristically.
  const explore = navLinks.slice(0, Math.ceil(navLinks.length / 3));
  const community = navLinks.slice(Math.ceil(navLinks.length / 3), Math.ceil(navLinks.length * 2 / 3));
  const company = navLinks.slice(Math.ceil(navLinks.length * 2 / 3));

  return (
    <footer className="relative w-full overflow-hidden bg-surface-container-lowest border-t border-outline-variant/30 mt-auto pt-24 pb-12">
      {/* Cosmic Footer Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-[800px] h-[500px] bg-gradient-to-t from-primary/30 to-transparent blur-[120px] rounded-full translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-gradient-to-t from-secondary-container/20 to-transparent blur-[100px] rounded-full translate-y-1/2"></div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(160,120,255,0.08),transparent)] pointer-events-none"></div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-outline-variant/30">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-6 pr-0 lg:pr-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-on-primary font-bold text-xl">M</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-on-surface to-on-surface-variant">
                MarcWiki
              </span>
            </div>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-sm">
              Built by fans, for fans. The Living Archive for the worlds you love, curated by a global community.
            </p>
            
            {/* Status Chip */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high/50 backdrop-blur-md border border-outline-variant/30 shadow-sm mt-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary shadow-[0_0_8px_#51de9d]"></span>
              </span>
              <span className="text-[10px] font-bold text-on-surface uppercase tracking-[0.2em]">Archive Network Live</span>
            </div>
          </div>
          
          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-6">
              <h4 className="text-xs font-bold text-on-surface uppercase tracking-widest">Explore</h4>
              <ul className="space-y-4 text-sm text-on-surface-variant">
                {explore.map((link) => (
                  <li key={link.url}>
                    <Link href={link.url} target={link.isExternal ? '_blank' : undefined} rel={link.isExternal ? 'noopener noreferrer' : undefined} className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-xs font-bold text-on-surface uppercase tracking-widest">Community</h4>
              <ul className="space-y-4 text-sm text-on-surface-variant">
                {community.map((link) => (
                  <li key={link.url}>
                    <Link href={link.url} target={link.isExternal ? '_blank' : undefined} rel={link.isExternal ? 'noopener noreferrer' : undefined} className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-xs font-bold text-on-surface uppercase tracking-widest">Legal</h4>
              <ul className="space-y-4 text-sm text-on-surface-variant">
                {company.map((link) => (
                  <li key={link.url}>
                    <Link href={link.url} target={link.isExternal ? '_blank' : undefined} rel={link.isExternal ? 'noopener noreferrer' : undefined} className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-on-surface-variant font-medium">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} MarcWiki Foundation.</span>
            <span className="hidden sm:inline">Preserving collective human imagination.</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors hover:-translate-y-0.5 duration-300" aria-label="Discord">
              <MessageCircle size={18} />
            </a>
            <a href="#" className="hover:text-primary transition-colors hover:-translate-y-0.5 duration-300" aria-label="Twitter">
              <Globe size={18} />
            </a>
            <a href="#" className="hover:text-primary transition-colors hover:-translate-y-0.5 duration-300" aria-label="Github">
              <Code size={18} />
            </a>
            <a href="#" className="hover:text-primary transition-colors hover:-translate-y-0.5 duration-300" aria-label="RSS Feed">
              <Rss size={18} />
            </a>
            <a href="#" className="hover:text-primary transition-colors hover:-translate-y-0.5 duration-300" aria-label="Security">
              <ShieldCheck size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
