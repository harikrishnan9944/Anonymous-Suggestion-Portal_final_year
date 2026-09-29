import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/serverAuth';
import { getServerModules } from '@/lib/serverModules';

export async function GET() {
  try {
    const { memoryStore, CategoryModel, connectDB, getIsConnected } = getServerModules();

    await connectDB();
    let items: any[] = [];
    if (getIsConnected()) {
      items = await CategoryModel.find().sort({ name: 1 });
    }
    if (!items.length) {
      items = memoryStore.getCategories();
    }
    return NextResponse.json({ success: true, data: items });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Error fetching categories.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    const { memoryStore, CategoryModel, connectDB, getIsConnected } = getServerModules();

    await connectDB();
    const { name, description, color } = await req.json();
    if (!name) return NextResponse.json({ success: false, message: 'Category name required.' }, { status: 400 });

    let newCat: any = null;
    if (getIsConnected()) {
      newCat = await CategoryModel.create({ name, description, color });
    } else {
      newCat = memoryStore.addCategory({ name, description, color });
    }

    return NextResponse.json({ success: true, data: newCat }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Error adding category.' }, { status: 500 });
  }
}
