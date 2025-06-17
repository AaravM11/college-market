import { NextRequest, NextResponse } from 'next/server';
import { getItemsCollection } from '@/lib/mongodb';
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid item id' }, { status: 400 });
    }
    const data = await req.json();
    const { title, price, category, description } = data;
    if (
      !title || typeof title !== 'string' ||
      !price || typeof price !== 'number' ||
      !category || typeof category !== 'string' ||
      !allowedCategories.includes(category) ||
      !description || typeof description !== 'string'
    ) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }
    const collection = await getItemsCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, price, category, description } }
    );
    if (result.modifiedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Item not found or not updated' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 