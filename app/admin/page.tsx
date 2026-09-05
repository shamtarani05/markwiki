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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-foreground-muted mt-0.5">An overview of your wiki content.</p>
        </div>
        <Link href="/admin/wiki/new" className="btn btn-primary text-sm py-2 flex items-center gap-1.5">
          <Plus size={16} /> New Page
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Wikis" value={wikiCount} icon={BookOpen} accent="blue" />
        <StatCard label="Pages" value={pageCount} icon={FileText} accent="purple" />
        <StatCard label="Drafts" value={draftCount} icon={FileEdit} accent="yellow" />
        <StatCard label="Published" value={publishedCount} icon={CheckCircle2} accent="green" />
      </div>

      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Recently edited</h2>
        </div>
        {recentPages.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-foreground-muted mb-3">No pages yet.</p>
            <Link href="/admin/wiki/new" className="text-sm text-accent hover:underline">Create your first page →</Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentPages.map((p) => (
              <Link
                key={p._id.toString()}
                href={`/admin/wiki/${p._id}/edit`}
                className="flex items-center justify-between px-4 py-3 hover:bg-background-tertiary transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    {(p.wiki as unknown as { name?: string } | null)?.name ?? 'Unknown wiki'} · {p.pageType}
                  </p>
                </div>
                <span className="text-xs text-foreground-muted shrink-0 ml-4">{new Date(p.updatedAt).toLocaleDateString()}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const ACCENT_CLASSES: Record<string, string> = {
  blue: 'badge-blue',
  purple: 'badge-purple',
  yellow: 'badge-yellow',
  green: 'badge-green',
};

function StatCard({
  label, value, icon: Icon, accent,
}: { label: string; value: number; icon: LucideIcon; accent: string }) {
  return (
    <div className="card p-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${ACCENT_CLASSES[accent]}`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
      <p className="text-xs text-foreground-muted mt-1.5">{label}</p>
    </div>
  );
}
