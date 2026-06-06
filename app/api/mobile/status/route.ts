import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Handyfor.me Mobile API is active',
    timestamp: new Date().toISOString()
  });
}
