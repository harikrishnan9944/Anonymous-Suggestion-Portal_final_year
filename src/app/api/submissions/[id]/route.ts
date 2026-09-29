import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/serverAuth';
import { getServerModules } from '@/lib/serverModules';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    const { memoryStore, SubmissionModel, connectDB, getIsConnected } = getServerModules();

    await connectDB();
    const { id } = await params;
    let item: any = null;

    if (getIsConnected()) {
      item = await SubmissionModel.findById(id);
    }
    if (!item) {
      item = memoryStore.getSubmissionById(id);
    }

    if (!item) {
      return NextResponse.json({ success: false, message: 'Submission not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error fetching submission details.' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    const { memoryStore, SubmissionModel, connectDB, getIsConnected } = getServerModules();

    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const { status, adminResponse, department, priority, statusNote } = body;

    let updated: any = null;

    if (getIsConnected()) {
      const doc = await SubmissionModel.findById(id);
      if (doc) {
        if (status && status !== doc.status) {
          doc.status = status;
          doc.statusHistory.push({
            status,
            date: new Date(),
            note: statusNote || `Status updated to ${status}`
          });
        }
        if (adminResponse !== undefined) doc.adminResponse = adminResponse;
        if (department) doc.department = department;
        if (priority) doc.priority = priority;
        updated = await doc.save();
      }
    }

    if (!updated) {
      updated = memoryStore.updateSubmission(id, { status, adminResponse, department, priority, statusNote });
    }

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Submission not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Submission updated successfully',
      data: updated
    });

  } catch (error) {
    console.error('Update Submission Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update submission.' }, { status: 500 });
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
    const { memoryStore, SubmissionModel, connectDB, getIsConnected } = getServerModules();

    await connectDB();
    const { id } = await params;
    let deleted = false;

    if (getIsConnected()) {
      const res = await SubmissionModel.findByIdAndDelete(id);
      if (res) deleted = true;
    }

    if (!deleted) {
      deleted = memoryStore.deleteSubmission(id);
    }

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Submission not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Submission deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete submission.' }, { status: 500 });
  }
}
