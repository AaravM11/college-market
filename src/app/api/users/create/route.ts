import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { uid, name, email, photoURL } = await req.json();
    if (!uid || !email) {
      return NextResponse.json({ success: false, error: 'Missing uid or email' }, { status: 400 });
    }
    const users = await getUsersCollection();
    const existing = await users.findOne({ uid });
    if (!existing) {
      await users.insertOne({
        uid,
        name: name || '',
        email,
        photoURL: photoURL || '',
        items: [],
        createdAt: new Date(),
      });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 