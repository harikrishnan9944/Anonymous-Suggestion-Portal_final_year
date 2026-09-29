import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/serverAuth';
import { getServerModules } from '@/lib/serverModules';

export async function GET() {
  try {
    const { memoryStore, DepartmentModel, connectDB, getIsConnected } = getServerModules();

    await connectDB();
    let items: any[] = [];
    if (getIsConnected()) {
      items = await DepartmentModel.find().sort({ name: 1 });
    }
    if (!items.length) {
      items = memoryStore.getDepartments();
    }
    return NextResponse.json({ success: true, data: items });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Error fetching departments.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    const { memoryStore, DepartmentModel, connectDB, getIsConnected } = getServerModules();

    await connectDB();
    const { name, description, headName } = await req.json();
    if (!name) return NextResponse.json({ success: false, message: 'Department name required.' }, { status: 400 });

    let newDept: any = null;
    if (getIsConnected()) {
      newDept = await DepartmentModel.create({ name, description, headName });
    } else {
      newDept = memoryStore.addDepartment({ name, description, headName });
    }

    return NextResponse.json({ success: true, data: newDept }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Error adding department.' }, { status: 500 });
  }
}
