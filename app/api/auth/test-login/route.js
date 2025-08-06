import { NextResponse } from 'next/server';
import connectDB from '@/database/connection';
import { User } from '@/database/mongoose-schema';
import { generateToken } from '@/lib/auth';

export async function GET(request) {
  try {
    console.log('🔍 Testing login API (GET)...');
    
    await connectDB();
    console.log('✅ Database connected');
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    console.log('📧 Email:', email);
    
    // Validate input
    if (!email) {
      console.log('❌ Missing email');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    console.log('🔍 Searching for user...');
    const user = await User.findOne({ email });
    console.log('👤 User found:', !!user);
    
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ User found:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    
    // Check if user is active
    if (!user.isActive) {
      console.log('❌ User account is deactivated');
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      );
    }
    
    // Generate proper JWT token
    const token = generateToken({ userId: user._id, email: user.email, role: user.role });
    console.log('✅ JWT token generated');
    
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      isVerified: user.isVerified,
      isActive: user.isActive
    };
    
    return NextResponse.json({
      success: true,
      message: 'Login successful (test mode)',
      user: userResponse,
      token: token
    });
    
  } catch (error) {
    console.error('❌ Login test error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    console.log('🔍 Testing login API...');
    
    await connectDB();
    console.log('✅ Database connected');
    
    const { email, password } = await request.json();
    console.log('📧 Email:', email);
    console.log('🔑 Password provided:', !!password);
    
    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    console.log('🔍 Searching for user...');
    const user = await User.findOne({ email }).select('+password');
    console.log('👤 User found:', !!user);
    
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    console.log('✅ User found:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    
    // Check if user is active
    if (!user.isActive) {
      console.log('❌ User account is deactivated');
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      );
    }
    
    // Generate proper JWT token
    const token = generateToken({ userId: user._id, email: user.email, role: user.role });
    console.log('✅ JWT token generated');
    
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      isVerified: user.isVerified,
      isActive: user.isActive
    };
    
    return NextResponse.json({
      success: true,
      message: 'Login successful (test mode)',
      user: userResponse,
      token: token
    });
    
  } catch (error) {
    console.error('❌ Login test error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 