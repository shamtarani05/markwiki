import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Media } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';

// TODO(production storage): writes to public/uploads on local disk, which
// works in dev but NOT on Vercel (serverless functions have no writable
// persistent disk). Before deploying, swap this for a real object store
// (Vercel Blob, S3, Cloudinary, ...) — same Media-document shape, just a
// different `url` source.
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']);

export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();

  const formData = await req.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type — use JPEG, PNG, GIF, WebP, or SVG' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File is too large (max 8MB)' }, { status: 400 });
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = path.extname(file.name) || `.${file.type.split('/')[1]}`;
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  const url = `/uploads/${filename}`;
  const uploadedBy = session.sub;

  const media = await Media.create({
    filename,
    originalFilename: file.name,
    url,
    type: 'image',
    mimeType: file.type,
    size: file.size,
    uploadedBy,
  });

  return NextResponse.json({ media }, { status: 201 });
}
