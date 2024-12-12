import { NextResponse } from 'next/server';

export async function GET() {
  if (!process.env.ONCHAINKIT_API_KEY) {
    return NextResponse.json(
      { error: 'OnchainKit API key is not configured' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    apiKey: process.env.ONCHAINKIT_API_KEY
  });
} 