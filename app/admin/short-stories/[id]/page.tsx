import ShortStoryEditor from '@/src/components/admin/stories/ShortStoryEditor';

export default async function EditShortStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ShortStoryEditor storyId={id} />;
}
