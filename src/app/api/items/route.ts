import { NextRequest, NextResponse } from 'next/server';
import { getItemsCollection, getUsersCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const allowedCategories = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'School Supplies',
  'Clothing',
  'Sports Equipment',
  'Other',
];

// GET: Fetch all items, optionally filtered by category, and include user info
export async function GET(req: NextRequest) {
  try {
    const collection = await getItemsCollection();
    const usersCollection = await getUsersCollection();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const filter: any = {};
    if (category && allowedCategories.includes(category)) {
      filter.category = category;
    }
    const items = await collection.find(filter).toArray();
    // Attach user info to each item
    const userIds = Array.from(new Set(items.map(item => item.userId)));
    const users = await usersCollection.find({ uid: { $in: userIds } }).toArray();
    const userMap = Object.fromEntries(users.map(u => [u.uid, u]));
    const itemsWithUser = items.map(item => ({
      ...item,
      imageUrls: Array.isArray(item.imageUrls) ? item.imageUrls : [],
      user: userMap[item.userId]
        ? {
            name: userMap[item.userId].name,
            email: userMap[item.userId].email,
            photoURL: userMap[item.userId].photoURL || null,
          }
        : null,
    }));
    return NextResponse.json({ success: true, items: itemsWithUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Add a new item
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { title, price, category, description, userId, imageUrls } = data;
    if (
      !title ||
      typeof title !== 'string' ||
      !price ||
      typeof price !== 'number' ||
      !category ||
      typeof category !== 'string' ||
      !allowedCategories.includes(category) ||
      !description ||
      typeof description !== 'string' ||
      !userId ||
      typeof userId !== 'string'
    ) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }
    const collection = await getItemsCollection();
    const itemDoc = {
      title,
      price,
      category,
      description,
      userId,
      imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
      createdAt: new Date(),
    };
    const result = await collection.insertOne(itemDoc);
    // Add item _id to user's items array
    const users = await getUsersCollection();
    await users.updateOne(
      { uid: userId },
      { $push: { items: result.insertedId as any } }
    );
    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 