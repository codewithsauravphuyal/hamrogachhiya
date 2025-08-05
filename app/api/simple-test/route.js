import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Simple API test...');
    
    return NextResponse.json({
      success: true,
      message: 'Simple API is working!',
      timestamp: new Date().toISOString(),
      data: {
        test: 'success',
        environment: process.env.NODE_ENV || 'development'
      }
    });
    
  } catch (error) {
    console.error('❌ Simple test error:', error);
    return NextResponse.json(
      { error: 'Simple test failed', details: error.message },
      { status: 500 }
    );
  }
} 