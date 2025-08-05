import { NextResponse } from 'next/server';
import connectDB from '@/database/connection';
import { User, Product, Category, Store } from '@/database/mongoose-schema';

export async function GET() {
  try {
    await connectDB();
    
    // Get counts
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    const storeCount = await Store.countDocuments();
    
    // Get sample data
    const users = await User.find().select('name email role').limit(3).lean();
    const products = await Product.find().select('name price store').populate('store', 'name').limit(3).lean();
    const categories = await Category.find().select('name slug level').limit(3).lean();
    
    return NextResponse.json({
      success: true,
      message: 'API is working! Database connection successful.',
      data: {
        counts: {
          users: userCount,
          products: productCount,
          categories: categoryCount,
          stores: storeCount
        },
        sample: {
          users,
          products,
          categories
        }
      }
    });
    
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: 'Database connection failed', details: error.message },
      { status: 500 }
    );
  }
} 