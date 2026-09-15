import Link from 'next/link';
import { Plus, BookOpen, ImageOff, List } from 'lucide-react';
import connectDB from '@/src/lib/db/connection';
import { Book } from '@/src/lib/db/models';

export default async function BooksListPage() {
  await connectDB();
  const books = await Book.find().populate('category', 'name').sort({ updatedAt: -1 }).lean();

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-title">Books</h1>
          <p className="admin-subtitle">
            {books.length === 0
              ? 'Manage novels, serialized fiction, and web books.'
              : `${books.length} book${books.length === 1 ? '' : 's'}, newest edits first.`}
          </p>
        </div>
        <Link href="/admin/books/new" className="btn btn-primary text-[13px] py-2 px-4 no-underline">
          <Plus size={15} /> New Book
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="admin-empty">
          <BookOpen size={22} className="mx-auto text-[#706F78] mb-3" aria-hidden="true" />
          <p className="text-[13px] text-[#F5F3EF] mb-1">No books yet</p>
          <p className="admin-meta mb-4">
            Books hold chapters of serialized fiction or novels.
          </p>
          <Link href="/admin/books/new" className="btn btn-primary text-[13px] py-2 px-4 no-underline">
            <Plus size={15} /> Create the first book
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {books.map((b: any) => (
            <div key={b._id.toString()} className="admin-tile flex flex-col">
              <Link href={`/admin/books/${b._id}`} className="no-underline group">
                <div className="aspect-[2/3] bg-[#181820] flex items-center justify-center relative overflow-hidden relative">
                  {b.coverImage ? (
                    <>
                    <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-[#121218]" />
                  </>
                  ) : (
                    <ImageOff size={24} className="text-[#706F78]" aria-hidden="true" />
                  )}
                  {/* Status badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      b.status === 'published' || b.status === 'ongoing' || b.status === 'completed'
                        ? 'bg-primary text-background'
                        : 'bg-[#181820] text-[#706F78] border border-[rgba(255,255,255,0.09)]'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
                <div className="px-4 pt-3.5 pb-3">
                  <h3 className="text-[14px] font-bold text-[#F5F3EF] truncate group-hover:text-[#8B5CF6] transition-colors">
                    {b.title}
                  </h3>
                  <p className="admin-meta mt-1 truncate">
                    {(b.category as any)?.name ?? 'Uncategorized'}
                  </p>
                </div>
              </Link>
              <div className="mt-auto flex items-center justify-between gap-2 px-4 py-2.5 border-t border-[rgba(255,255,255,0.09)] bg-[#121218]/30">
                <span className="admin-meta admin-num flex items-center gap-1.5 font-medium text-[#F5F3EF]">
                  <List size={12} className="text-[#8B5CF6]" aria-hidden="true" />
                  {b.chapterCount} chapter{b.chapterCount === 1 ? '' : 's'}
                </span>
                <div className="flex items-center gap-3">
                  <span className="admin-meta admin-num">{new Date(b.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
