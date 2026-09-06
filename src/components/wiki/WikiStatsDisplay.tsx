export default function WikiStatsDisplay({ pageCount, totalViews }: { pageCount: number; totalViews: number }) {
  return (
    <div className="border-b border-border bg-background-secondary">
      <div className="container py-4">
        <div className="flex items-center gap-8 flex-wrap">
          <div>
            <span className="text-2xl font-bold text-accent">{pageCount.toLocaleString()}</span>
            <span className="text-foreground-muted text-sm ml-2">pages</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-accent">{totalViews.toLocaleString()}</span>
            <span className="text-foreground-muted text-sm ml-2">views</span>
          </div>
        </div>
      </div>
    </div>
  );
}
