import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Media } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { imagekit } from '@/src/lib/imagekit';

const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']);
const ALLOWED_VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg']);

export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();

  const formData = await req.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const isImage = ALLOWED_IMAGE_TYPES.has(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.has(file.type);
  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: 'Unsupported file type — use JPEG, PNG, GIF, WebP, SVG (images) or MP4, WebM, MOV, OGG (video)' },
      { status: 400 }
    );
  }
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: `File is too large (max ${isVideo ? '100MB' : '8MB'})` },
      { status: 400 }
    );
  }

  const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : `.${file.type.split('/')[1]}`;
  const filename = `${randomUUID()}${ext}`;

  const uploaded = await imagekit.files.upload({
    file,
    fileName: filename,
    folder: '/wiki-platform',
  });

  const uploadedBy = session.sub;

  const media = await Media.create({
    filename,
    originalFilename: file.name,
    url: uploaded.url,
    thumbnailUrl: uploaded.thumbnailUrl,
    type: isVideo ? 'video' : 'image',
    mimeType: file.type,
    size: file.size,
    dimensions: uploaded.width && uploaded.height ? { width: uploaded.width, height: uploaded.height } : undefined,
    uploadedBy,
  });

  return NextResponse.json({ media }, { status: 201 });
}
