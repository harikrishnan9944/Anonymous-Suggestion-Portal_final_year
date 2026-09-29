import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/serverAuth';
import { getServerModules } from '@/lib/serverModules';

function generateTrackingId() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 5; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const year = new Date().getFullYear();
  return `ASP-${year}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const { memoryStore, SubmissionModel, connectDB, getIsConnected, analyzeSentiment } = getServerModules();

    await connectDB();
    const body = await req.json();
    const { type, category, priority, title, description, attachment } = body;

    if (!type || !category || !title || !description) {
      return NextResponse.json({
        success: false,
        message: 'Submission type, category, title, and description are required.'
      }, { status: 400 });
    }

    const trackingId = generateTrackingId();
    const sentiment = analyzeSentiment(title, description);

    const submissionData = {
      trackingId,
      type,
      category,
      priority: priority || 'Medium',
      title: title.trim(),
      description: description.trim(),
      attachment: attachment || null,
      status: 'Pending',
      department: 'General Administration',
      adminResponse: '',
      sentiment,
      statusHistory: [
        { status: 'Submitted', date: new Date(), note: 'Submission received anonymously.' }
      ]
    };

    let createdSubmission: any;

    if (getIsConnected()) {
      createdSubmission = await SubmissionModel.create(submissionData);
    } else {
      createdSubmission = memoryStore.createSubmission(submissionData);
    }

    return NextResponse.json({
      success: true,
      message: 'Submission received successfully',
      trackingId: createdSubmission.trackingId,
      submission: {
        trackingId: createdSubmission.trackingId,
        type: createdSubmission.type,
        category: createdSubmission.category,
        status: createdSubmission.status,
        createdAt: createdSubmission.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Submission Creation Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to record anonymous submission.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const user = verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    const { memoryStore, SubmissionModel, connectDB, getIsConnected } = getServerModules();

    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    let items: any[] = [];

    if (getIsConnected()) {
      const query: any = {};
      if (type) query.type = type;
      if (category) query.category = category;
      if (priority) query.priority = priority;
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { trackingId: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      items = await SubmissionModel.find(query).sort({ createdAt: -1 });
    } else {
      items = memoryStore.getSubmissions();
      if (type) items = items.filter((i: any) => i.type === type);
      if (category) items = items.filter((i: any) => i.category === category);
      if (priority) items = items.filter((i: any) => i.priority === priority);
      if (status) items = items.filter((i: any) => i.status === status);
      if (search) {
        const s = search.toLowerCase();
        items = items.filter((i: any) => 
          i.trackingId.toLowerCase().includes(s) ||
          i.title.toLowerCase().includes(s) ||
          i.description.toLowerCase().includes(s)
        );
      }
    }

    const total = items.length;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      data: paginatedItems
    });

  } catch (error) {
    console.error('Fetch Submissions Error:', error);
    return NextResponse.json({ success: false, message: 'Error fetching submissions.' }, { status: 500 });
  }
}
