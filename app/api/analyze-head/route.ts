import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

interface AnalyzeRequestBody {
  url: string;
}

export async function POST(request: NextRequest) {
  try {
    const { url }: AnalyzeRequestBody = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch the URL: ${res.status}` }, { status: res.status });
    }

    const htmlText = await res.text();
    const dom = new JSDOM(htmlText);

    const originalElements = Array.from(dom.window.document.head.children).map((element) => ({
      tagName: element.tagName.toLowerCase(),
      attributes: Array.from(element.attributes).map((attr) => ({
        name: attr.name,
        value: attr.value,
      })),
    }));

    const sortedElements = [...originalElements].sort((a, b) =>
      a.tagName.localeCompare(b.tagName)
    );

    return NextResponse.json({
      originalElements,
      sortedElements,
    });
  } catch (error) {
    console.error('Error while analyzing the head:', error);

    // Safely extract error message.
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}