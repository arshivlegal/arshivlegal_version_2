import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Instantly destroy the cookie to lock the dashboard
  response.cookies.set('admin_auth', '', {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
    path: '/',
  });
  
  return response;
}