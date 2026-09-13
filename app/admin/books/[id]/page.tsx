import BookEditor from '@/src/components/admin/books/BookEditor';

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookEditor bookId={id} />;
}
