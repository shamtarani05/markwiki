import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import SiteConfig from '@/src/lib/db/models/SiteConfig';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import type { NavItem } from '@/src/lib/db/getNavigationConfig';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const config = await SiteConfig.findOne().lean();

    return NextResponse.json({
      navigation: config?.navigation || { main: [], footer: [] },
      social: config?.social || {},
    });
  } catch (error) {
    console.error('Error fetching navigation config:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { navigation, social } = await request.json();

    await connectDB();
    
    // Enforce arrays for navigation
    const updatePayload: Record<string, any> = {};
    
    if (navigation) {
      if (Array.isArray(navigation.main)) {
        updatePayload['navigation.main'] = navigation.main.map((n: NavItem, i: number) => ({
          ...n,
          order: i,
        }));
      }
      if (Array.isArray(navigation.footer)) {
        updatePayload['navigation.footer'] = navigation.footer.map((n: NavItem, i: number) => ({
          ...n,
          order: i,
        }));
      }
    }
    
    if (social) {
      if (social.twitter !== undefined) updatePayload['social.twitter'] = social.twitter;
      if (social.facebook !== undefined) updatePayload['social.facebook'] = social.facebook;
      if (social.instagram !== undefined) updatePayload['social.instagram'] = social.instagram;
      if (social.discord !== undefined) updatePayload['social.discord'] = social.discord;
    }

    await SiteConfig.findOneAndUpdate(
      {},
      { $set: updatePayload },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating navigation config:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
