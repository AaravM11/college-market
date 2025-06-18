import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongodb';

// POST: Add or update a user
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { uid, name, email, photoURL, contactInfo } = data;
    if (!uid || !name || !email) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    if (!contactInfo || !contactInfo.phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required to list items' }, { status: 400 });
    }
    const collection = await getUsersCollection();
    const result = await collection.updateOne(
      { uid },
      { $set: { name, email, photoURL, contactInfo } },
      { upsert: true }
    );
    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Update user settings (name, photoURL)
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { uid, name, photoURL } = data;
    if (!uid || !name) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    const collection = await getUsersCollection();
    const result = await collection.updateOne(
      { uid },
      { $set: { name, photoURL } }
    );
    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET: Fetch a user by uid
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');
    if (!uid) {
      return NextResponse.json({ success: false, error: 'Missing uid' }, { status: 400 });
    }
    const collection = await getUsersCollection();
    const user = await collection.findOne({ uid });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 