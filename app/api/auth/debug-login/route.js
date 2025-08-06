import { NextResponse } from 'next/server';
import connectDB from '@/database/connection';
import { User } from '@/database/mongoose-schema';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    console.log('🔍 Debug login attempt:', { email, password });
    
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ User found:', {
      id: user._id,
      email: user.email,
      role: user.role,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0
    });
    
    // Test password comparison
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    console.log('🔐 Password comparison result:', isPasswordValid);
    
    if (!isPasswordValid) {
      // Let's also test with a known hash
      const testHash = await bcrypt.hash('admin123', 12);
      const testComparison = await bcrypt.compare('admin123', testHash);
      console.log('🧪 Test hash comparison:', testComparison);
      
      return NextResponse.json(
        { 
          error: 'Invalid password',
          debug: {
            providedPassword: password,
            storedPasswordLength: user.password.length,
            testHashComparison: testComparison
          }
        },
        { status: 401 }
      );
    }
    
    console.log('✅ Login successful');
    
    return NextResponse.json({
      success: true,
      message: 'Login successful (debug mode)',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('❌ Debug login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 