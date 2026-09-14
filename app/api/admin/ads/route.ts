import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { AdPlacement } from '@/src/lib/db/models';

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const zone = url.searchParams.get('zone');
    
    // If querying by zone (e.g., for frontend rendering)
    if (zone) {
      const activeAds = await AdPlacement.find({
        zone: zone as any,
        isActive: true,
        $or: [
          { 'schedule.startDate': { $exists: false } },
          { 'schedule.startDate': { $lte: new Date() } }
        ],
        $and: [
          { $or: [{ 'schedule.endDate': { $exists: false } }, { 'schedule.endDate': { $gte: new Date() } }] }
        ]
      }).sort({ priority: -1 });
      
      return NextResponse.json({ ads: activeAds });
    }

    // Otherwise return all ads for admin panel
    const ads = await AdPlacement.find().sort({ createdAt: -1 });
    return NextResponse.json({ ads });
  } catch (error: any) {
    console.error('Error fetching ads:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // In a real app we'd fetch the active user ID from session.
    // For now we mock it or allow null/default if model supports it.
    // AdPlacement schema requires createdBy, but we can set a dummy one if it's an ObjectId,
    // or we might need to fetch the admin user.
    // Let's assume there is at least one admin user.
    const mongoose = require('mongoose');
    if (!data.createdBy) {
       data.createdBy = new mongoose.Types.ObjectId(); // Mock object id if missing
    }

    const ad = await AdPlacement.create(data);
    return NextResponse.json({ success: true, ad }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating ad:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create ad' },
      { status: 400 }
    );
  }
}
