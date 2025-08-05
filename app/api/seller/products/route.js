import { NextResponse } from 'next/server';
import connectDB from '@/database/connection';
import { User, Product, Store } from '@/database/mongoose-schema';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Check if user is seller
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'seller') {
      return NextResponse.json({ error: 'Seller access required' }, { status: 403 });
    }
    
    // Find store for this seller
    const store = await Store.findOne({ seller: user._id });
    if (!store) {
      return NextResponse.json({ error: 'No store found for seller' }, { status: 404 });
    }
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const lowStock = searchParams.get('lowStock') === 'true';
    
    // Build query
    let query = { store: store._id };
    if (lowStock) {
      query.stock = { $lte: 5 };
    }
    
    // Get products for this store
    const products = await Product.find(query)
      .select('name price stock images isActive')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Seller products error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 