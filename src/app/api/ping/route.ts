
import { NextResponse } from 'next/server';

// A simple health check endpoint to confirm the API is live.
export async function GET() {
  const data = { ok: true, engine: "2025-11-13-v1.0" };
  
  // In a real app, you might want to restrict this more,
  // but for a simple health check, "*" is fine.
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };

  return NextResponse.json(data, { headers });
}
