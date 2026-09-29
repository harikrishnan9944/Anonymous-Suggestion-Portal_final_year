import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    system: 'Anonymous Student Suggestion & Complaint Management System',
    timestamp: new Date().toISOString()
  });
}
