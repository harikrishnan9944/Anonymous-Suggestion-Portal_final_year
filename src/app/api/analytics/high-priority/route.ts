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
    const alerts = submissions.filter((s: any) => 
      (s.priority === 'High' || s.sentiment === 'Critical') && s.status !== 'Resolved'
    );

    return NextResponse.json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error retrieving high priority alerts.' }, { status: 500 });
  }
}
