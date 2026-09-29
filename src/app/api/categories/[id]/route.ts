import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/serverAuth';
import { getServerModules } from '@/lib/serverModules';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    const { memoryStore, CategoryModel, connectDB, getIsConnected } = getServerModules();

    await connectDB();
    const { id } = await params;
    const { name, description, color, active } = await req.json();
    let updated: any = null;

    if (getIsConnected()) {
      updated = await CategoryModel.findByIdAndUpdate(id, { name, description, color, active }, { new: true });
    }
    if (!updated) {
      updated = memoryStore.updateCategory(id, { name, description, color, active });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Error updating category.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    const { memoryStore, CategoryModel, connectDB, getIsConnected } = getServerModules();

    await connectDB();
    const { id } = await params;
    let deleted = false;

    if (getIsConnected()) {
      const res = await CategoryModel.findByIdAndDelete(id);
      if (res) deleted = true;
    }
    if (!deleted) {
      deleted = memoryStore.deleteCategory(id);
    }

    return NextResponse.json({ success: true, message: 'Category deleted.' });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Error deleting category.' }, { status: 500 });
  }
}
