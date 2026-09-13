import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import SiteConfig from '@/src/lib/db/models/SiteConfig';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import type { HomepageSection } from '@/src/lib/db/homepageSections';
import { getDefaultHomepageSections } from '@/src/lib/db/homepageSections';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const config = await SiteConfig.findOne().lean();
    let sections = config?.homepage?.sections || [];
    const theme = config?.theme || { accentColor: '#D4AF37' };

    if (!sections.length) {
      sections = getDefaultHomepageSections();
    }

    return NextResponse.json({ sections, theme });
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

    const { sections, theme } = await request.json();

    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    await connectDB();
    
    // Validate each section has the minimal required shape
    const validSections = sections.map((sec, index) => ({
      id: sec.id,
      type: sec.type,
      title: sec.title || '',
      subtitle: sec.subtitle || '',
      order: index, // Enforce array order
      isActive: Boolean(sec.isActive),
      settings: sec.settings || {},
    }));

    const updateObj: any = { 'homepage.sections': validSections };
    if (theme && theme.accentColor) {
      updateObj['theme.accentColor'] = theme.accentColor;
    }

    await SiteConfig.findOneAndUpdate(
      {},
      { $set: updateObj },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, sections: validSections, theme });
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
    await SiteConfig.findOneAndUpdate({}, { $set: { 'homepage.sections': [] } });
    return NextResponse.json({ success: true, sections: getDefaultHomepageSections() });
  } catch (error) {
    console.error('Error resetting homepage config:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

