import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const feedUrl = url.searchParams.get('url');

  if (!feedUrl) {
    return NextResponse.json({ error: 'Feed URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(feedUrl);
    const data = await response.text();
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
  }
} 