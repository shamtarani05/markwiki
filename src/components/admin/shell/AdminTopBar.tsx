'use client';

export default function AdminTopBar() {
  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-6 bg-background">
      <input
        type="search"
        placeholder="Search…"
        className="w-64 max-w-[40vw] px-3 py-1.5 text-sm bg-background-secondary border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent transition-colors"
      />
      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-contrast text-sm font-bold">
        A
      </div>
    </header>
  );
}
