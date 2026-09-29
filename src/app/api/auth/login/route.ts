import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getServerModules } from '@/lib/serverModules';

const JWT_SECRET = process.env.JWT_SECRET || 'asp_college_secret_key_2026';

export async function POST(req: NextRequest) {
  try {
    const { memoryStore, UserModel, connectDB, getIsConnected } = getServerModules();

    await connectDB();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 });
    }

    let user: any = null;

    if (getIsConnected()) {
      user = await UserModel.findOne({ email: email.toLowerCase().trim() });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) user = null;
      }
    }

    if (!user) {
      const memUser = await memoryStore.verifyAdminCredentials(email, password);
      if (memUser) {
        user = memUser;
      }
    }

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid admin credentials provided.' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id || user.id, email: user.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        id: user._id || user.id,
        name: user.name || 'System Administrator',
        email: user.email,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ success: false, message: 'Server error during authentication.' }, { status: 500 });
  }
}
