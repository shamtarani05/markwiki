import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { AdPlacement } from '@/src/lib/db/models';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const data = await req.json();

    const ad = await AdPlacement.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!ad) {
      return NextResponse.json({ success: false, error: 'Ad not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ad });
  } catch (error: any) {
    console.error('Error updating ad:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update ad' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const ad = await AdPlacement.findByIdAndDelete(id);

    if (!ad) {
      return NextResponse.json({ success: false, error: 'Ad not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    console.error('Error deleting ad:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete ad' },
      { status: 400 }
    );
  }
}
