import { NextResponse } from 'next/server';
import connectDB from '@/database/connection';
import { User, Product, Order, Store } from '@/database/mongoose-schema';
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
    
    // Get stats for this seller
    const store = await Store.findOne({ seller: user._id });
    if (!store) {
      return NextResponse.json({ error: 'No store found for seller' }, { status: 404 });
    }
    
    const [
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      lowStock,
      rating
    ] = await Promise.all([
      Product.countDocuments({ store: store._id, isActive: true }),
      Order.countDocuments({ 'items.storeId': store._id }),
      Order.aggregate([
        { $match: { 'items.storeId': store._id, status: { $in: ['delivered', 'shipped'] } } },
        { $unwind: '$items' },
        { $match: { 'items.storeId': store._id } },
        { $group: { _id: null, total: { $sum: '$items.price' } } }
      ]),
      Order.countDocuments({ 'items.storeId': store._id, status: 'pending' }),
      Product.countDocuments({ store: store._id, stock: { $lte: 5 } }),
      store.rating || 0
    ]);
    
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
    
    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue: revenue,
        pendingOrders,
        lowStock,
        rating
      }
    });
  } catch (error) {
    console.error('Seller stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}