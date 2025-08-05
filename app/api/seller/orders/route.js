import { NextResponse } from 'next/server';
import connectDB from '@/database/connection';
import { User, Order, Store } from '@/database/mongoose-schema';
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
    // Get orders for this store
    const orders = await Order.find({ 'items.storeId': store._id })
      .populate('user', 'name email')
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Seller orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}