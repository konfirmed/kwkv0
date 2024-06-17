import { NextRequest, NextResponse } from 'next/server';
import { getEventNavigationTiming } from '../../lib/eventNavigation';

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  // Validate input
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const metrics = await getEventNavigationTiming(url);
    return NextResponse.json(metrics, { status: 200 });
  } catch (error: any) {
    if (error.message.includes('TimeoutError')) {
      return NextResponse.json({ error: 'Navigation timeout exceeded. Please try again later.' }, { status: 504 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ error: 'Method GET not allowed' }, { status: 405 });
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ error: 'Method PUT not allowed' }, { status: 405 });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ error: 'Method DELETE not allowed' }, { status: 405 });
}