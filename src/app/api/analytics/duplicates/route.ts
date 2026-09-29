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
    const { groupDuplicateIssues } = getServerModules();
    const submissions = await fetchAllSubmissions();
    const clusters = groupDuplicateIssues(submissions);

    return NextResponse.json({
      success: true,
      clustersCount: clusters.length,
      clusters
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error detecting duplicate issues.' }, { status: 500 });
  }
}
