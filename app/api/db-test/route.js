import { NextResponse } from 'next/server';
import connectDB from '@/database/connection';
import { User, Product, Order, Store } from '@/database/mongoose-schema';

export async function GET(request) {
  try {
    await connectDB();
    
    // Test database connection and get counts
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const storeCount = await Store.countDocuments();
    
    // Get a sample user to check if there's any data
    const sampleUser = await User.findOne();
    
    return NextResponse.json({
      success: true,
      data: {
        userCount,
        productCount,
        orderCount,
        storeCount,
        sampleUser: sampleUser ? {
          id: sampleUser._id,
          name: sampleUser.name,
          email: sampleUser.email,
          role: sampleUser.role
        } : null,
        message: 'Database connection successful'
      }
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Database connection failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 