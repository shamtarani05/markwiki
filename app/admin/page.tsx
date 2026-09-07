import Link from 'next/link';
import { BookOpen, FileText, FileEdit, CheckCircle2, Plus, type LucideIcon } from 'lucide-react';
import connectDB from '@/src/lib/db/connection';
import { Page, Wiki } from '@/src/lib/db/models';

export default async function AdminDashboard() {
  await connectDB();

  const [wikiCount, pageCount, draftCount, publishedCount, recentPages] = await Promise.all([
    Wiki.countDocuments(),
    Page.countDocuments(),
    Page.countDocuments({ status: 'draft' }),
    Page.countDocuments({ status: 'published' }),
    Page.find().populate('wiki', 'name').sort({ updatedAt: -1 }).limit(5),
  ]);

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-title">Dashboard</h1>
          <p className="admin-subtitle">An overview of your wiki content.</p>
        </div>
        <Link href="/admin/wiki/new" className="btn btn-primary text-[13px] py-2 px-4 no-underline">
          <Plus size={15} /> New page
        </Link>
      </div>

      {/* One divided strip rather than four floating cards: these four numbers
          are one reading, and the hairlines between them say so. */}
      <div className="admin-stat-strip grid-cols-2 md:grid-cols-4 mb-8">
        <Stat label="Wikis" value={wikiCount} icon={BookOpen} tone="blue" />
        <Stat label="Pages" value={pageCount} icon={FileText} tone="purple" />
        {/* Drafts is the only count that implies unfinished work, so it's the
            only one that carries the accent. */}
        <Stat label="Drafts" value={draftCount} icon={FileEdit} tone="yellow" flagged={draftCount > 0} />
        <Stat label="Published" value={publishedCount} icon={CheckCircle2} tone="green" />
      </div>

      <div className="admin-panel overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="admin-section-title">Recently edited</h2>
          <Link href="/admin/pages" className="text-[13px] text-accent hover:underline">
            All pages
          </Link>
        </div>
        {recentPages.length === 0 ? (
          <div className="admin-empty border-0">
            <FileText size={22} className="mx-auto text-foreground-muted mb-3" aria-hidden="true" />
            <p className="text-[13px] text-foreground mb-1">No pages yet</p>
            <p className="admin-meta mb-4">Pages you create or edit will show up here.</p>
            <Link href="/admin/wiki/new" className="btn btn-primary text-[13px] py-2 px-4 no-underline">
              <Plus size={15} /> Create your first page
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentPages.map((p) => (
              <Link key={p._id.toString()} href={`/admin/wiki/${p._id}/edit`} className="admin-row no-underline">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{p.title}</p>
                  <p className="admin-meta mt-0.5 truncate">
                    {(p.wiki as unknown as { name?: string } | null)?.name ?? 'Unknown wiki'}
                    <span aria-hidden="true" className="inline-block w-px h-3 align-middle bg-border mx-2" />
                    {PAGE_TYPE_LABEL[p.pageType] ?? p.pageType}
                  </p>
                </div>
                <span className="admin-meta admin-num shrink-0">
                  {new Date(p.updatedAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Archetype names as an admin reads them, not as the enum stores them.
// Kept local rather than exported — a Next.js `page.tsx` may only export the
// route's own reserved members.
const PAGE_TYPE_LABEL: Record<string, string> = {
  overview: 'Overview',
  character: 'Character',
  location: 'Location',
  episode: 'Episode',
  blank: 'Blank',
};

const TONE_CLASSES: Record<string, string> = {
  blue: 'badge-blue',
  purple: 'badge-purple',
  yellow: 'badge-yellow',
  green: 'badge-green',
};

function Stat({
  label, value, icon: Icon, tone, flagged = false,
}: { label: string; value: number; icon: LucideIcon; tone: string; flagged?: boolean }) {
  return (
    <div className={`admin-stat ${flagged ? 'admin-stat-flag' : ''}`}>
      <span className={`w-7 h-7 rounded-md flex items-center justify-center mb-2.5 ${TONE_CLASSES[tone]}`}>
        <Icon size={15} aria-hidden="true" />
      </span>
      <p className="admin-stat-value">{value}</p>
      <p className="admin-stat-label">{label}</p>
    </div>
  );
}
