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
    const { memoryStore, DepartmentModel, connectDB, getIsConnected } = getServerModules();

    await connectDB();
    const { id } = await params;
    const { name, description, headName, active } = await req.json();
    let updated: any = null;

    if (getIsConnected()) {
      updated = await DepartmentModel.findByIdAndUpdate(id, { name, description, headName, active }, { new: true });
    }
    if (!updated) {
      updated = memoryStore.updateDepartment(id, { name, description, headName, active });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Error updating department.' }, { status: 500 });
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
    const { memoryStore, DepartmentModel, connectDB, getIsConnected } = getServerModules();

    await connectDB();
    const { id } = await params;
    let deleted = false;

    if (getIsConnected()) {
      const res = await DepartmentModel.findByIdAndDelete(id);
      if (res) deleted = true;
    }
    if (!deleted) {
      deleted = memoryStore.deleteDepartment(id);
    }

    return NextResponse.json({ success: true, message: 'Department deleted.' });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Error deleting department.' }, { status: 500 });
  }
}
