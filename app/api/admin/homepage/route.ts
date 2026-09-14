import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import SiteConfig from '@/src/lib/db/models/SiteConfig';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import type { Block } from '@/src/lib/blocks/types';
import { getDefaultHomepageSections } from '@/src/lib/db/homepageSections';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const config = await SiteConfig.findOne().lean();
    let blocks = config?.homepage?.blocks || [];
    const theme = config?.theme || { accentColor: '#D4AF37' };

    if (!blocks.length) {
      blocks = getDefaultHomepageSections();
    }

    return NextResponse.json({ blocks, theme });
  } catch (error) {
    console.error('Error fetching homepage config:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { blocks, theme } = await request.json();

    if (!Array.isArray(blocks)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    await connectDB();
    
    // Validate each block has the minimal required shape
    const validBlocks = blocks.map((blk) => ({
      id: blk.id,
      type: blk.type,
      props: blk.props || {},
    }));

    const updateObj: any = { 'homepage.blocks': validBlocks };
    if (theme && theme.accentColor) {
      updateObj['theme.accentColor'] = theme.accentColor;
    }

    await SiteConfig.findOneAndUpdate(
      {},
      { $set: updateObj },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, blocks: validBlocks, theme });
  } catch (error) {
    console.error('Error updating homepage config:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    await SiteConfig.findOneAndUpdate({}, { $set: { 'homepage.blocks': [] } });
    return NextResponse.json({ success: true, blocks: getDefaultHomepageSections() });
  } catch (error) {
    console.error('Error resetting homepage config:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

