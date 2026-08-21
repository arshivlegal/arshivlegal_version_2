import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { password } = await req.json();
    
    // 🔥 Define your dashboard password here (or use .env file)
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (password === adminPassword) {
      const response = NextResponse.json({ success: true });
      
      // Set a secure HTTP-only cookie that lasts exactly 24 hours (86400 seconds)
      response.cookies.set('admin_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 Day
        path: '/',
      });
      
      return response;
    }

    return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}