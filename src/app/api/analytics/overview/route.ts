import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/serverAuth';
import { getServerModules } from '@/lib/serverModules';

async function fetchAllSubmissions() {
  const { memoryStore, SubmissionModel, connectDB, getIsConnected } = getServerModules();
  await connectDB();
  if (getIsConnected()) {
    return await SubmissionModel.find().sort({ createdAt: -1 });
  }
  return memoryStore.getSubmissions();
}

export async function GET(req: NextRequest) {
  const user = verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    const submissions = await fetchAllSubmissions();

    const total = submissions.length;
    const pending = submissions.filter((s: any) => s.status === 'Pending').length;
    const inProgress = submissions.filter((s: any) => s.status === 'In Progress' || s.status === 'Under Review' || s.status === 'Assigned').length;
    const resolved = submissions.filter((s: any) => s.status === 'Resolved').length;
    const highPriority = submissions.filter((s: any) => s.priority === 'High' || s.sentiment === 'Critical').length;

    return NextResponse.json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        resolved,
        highPriority
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error retrieving overview KPIs.' }, { status: 500 });
  }
}
