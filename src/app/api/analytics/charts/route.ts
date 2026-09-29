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

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap: Record<string, { month: string; Submissions: number; Resolved: number }> = {};

    submissions.forEach((sub: any) => {
      const d = new Date(sub.createdAt);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (!monthlyMap[key]) monthlyMap[key] = { month: key, Submissions: 0, Resolved: 0 };
      monthlyMap[key].Submissions += 1;
      if (sub.status === 'Resolved') monthlyMap[key].Resolved += 1;
    });

    const monthlyTrends = Object.values(monthlyMap);

    const categoryMap: Record<string, number> = {};
    submissions.forEach((sub: any) => {
      const cat = sub.category || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    const categoryDistribution = Object.keys(categoryMap).map(cat => ({
      name: cat,
      value: categoryMap[cat]
    }));

    const statusMap: Record<string, number> = { 'Pending': 0, 'Under Review': 0, 'In Progress': 0, 'Resolved': 0, 'Rejected': 0 };
    submissions.forEach((sub: any) => {
      statusMap[sub.status] = (statusMap[sub.status] || 0) + 1;
    });
    const statusDistribution = Object.keys(statusMap).map(st => ({
      status: st,
      count: statusMap[st]
    }));

    const priorityMap: Record<string, number> = { 'Low': 0, 'Medium': 0, 'High': 0 };
    submissions.forEach((sub: any) => {
      priorityMap[sub.priority] = (priorityMap[sub.priority] || 0) + 1;
    });
    const priorityDistribution = Object.keys(priorityMap).map(pr => ({
      priority: pr,
      count: priorityMap[pr]
    }));

    const sentimentMap: Record<string, number> = { 'Positive': 0, 'Neutral': 0, 'Negative': 0, 'Critical': 0 };
    submissions.forEach((sub: any) => {
      const s = sub.sentiment || 'Neutral';
      sentimentMap[s] = (sentimentMap[s] || 0) + 1;
    });
    const sentimentDistribution = Object.keys(sentimentMap).map(st => ({
      sentiment: st,
      count: sentimentMap[st]
    }));

    return NextResponse.json({
      success: true,
      charts: {
        monthlyTrends,
        categoryDistribution,
        statusDistribution,
        priorityDistribution,
        sentimentDistribution
      }
    });

  } catch (error) {
    console.error('Charts Analytics Error:', error);
    return NextResponse.json({ success: false, message: 'Error compiling analytics charts.' }, { status: 500 });
  }
}
