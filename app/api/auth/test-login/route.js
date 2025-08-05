import { NextResponse } from 'next/server';
import connectDB from '@/database/connection';
import { User } from '@/database/mongoose-schema';

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
    
    // For testing, let's just return success without password verification
    console.log('✅ Login successful (password verification skipped for testing)');
    
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
      token: 'test-token-123'
    });
    
  } catch (error) {
    console.error('❌ Login test error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 