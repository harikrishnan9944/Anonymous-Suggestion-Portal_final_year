import { NextRequest, NextResponse } from 'next/server';
import { getServerModules } from '@/lib/serverModules';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  try {
    const { memoryStore, SubmissionModel, connectDB, getIsConnected } = getServerModules();

    await connectDB();
    const { trackingId } = await params;

    if (!trackingId) {
      return NextResponse.json({ success: false, message: 'Tracking ID is required.' }, { status: 400 });
    }

    const cleanId = trackingId.toUpperCase().trim();
    let submission: any = null;

    if (getIsConnected()) {
      submission = await SubmissionModel.findOne({ trackingId: cleanId }).select('-__v');
    }

    if (!submission) {
      submission = memoryStore.getSubmissionByTrackingId(cleanId);
    }

    if (!submission) {
      return NextResponse.json({
        success: false,
        message: `No submission found with Tracking ID "${cleanId}". Please verify and try again.`
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        trackingId: submission.trackingId,
        type: submission.type,
        category: submission.category,
        priority: submission.priority,
        title: submission.title,
        description: submission.description,
        status: submission.status,
        adminResponse: submission.adminResponse || null,
        statusHistory: submission.statusHistory || [],
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt
      }
    });

  } catch (error) {
    console.error('Track Lookup Error:', error);
    return NextResponse.json({ success: false, message: 'Error retrieving tracking information.' }, { status: 500 });
  }
}
