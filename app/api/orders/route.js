import { NextResponse } from 'next/server';
import connectDB from '@/database/connection';
import { Order, Cart, Product, Address } from '@/database/mongoose-schema';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    
    // Build query
    const query = { user: decoded.userId };
    
    if (status) {
      query.status = status;
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Execute query with population
    const orders = await Order.find(query)
      .populate('items.product', 'name images price')
      .populate('deliveryAddress', 'name address city state pincode')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const total = await Order.countDocuments(query);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });
    
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const { 
      deliveryAddressId, 
      paymentMethod, 
      notes,
      useCart = true 
    } = await request.json();
    
    // Get user's cart
    const cart = await Cart.findOne({ user: decoded.userId })
      .populate('items.product', 'name price stock isActive')
      .lean();
    
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }
    
    // Validate delivery address
    const deliveryAddress = await Address.findById(deliveryAddressId);
    if (!deliveryAddress || deliveryAddress.user.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Invalid delivery address' },
        { status: 400 }
      );
    }
    
    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    for (const cartItem of cart.items) {
      const product = cartItem.product;
      
      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Product ${product?.name || 'Unknown'} is not available` },
          { status: 400 }
        );
      }
      
      if (product.stock < cartItem.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }
      
      const itemTotal = product.price * cartItem.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        product: product._id,
        quantity: cartItem.quantity,
        price: product.price,
        total: itemTotal,
        selectedVariant: cartItem.selectedVariant
      });
    }
    
    // Calculate totals
    const tax = subtotal * 0.13; // 13% tax
    const deliveryFee = subtotal > 50 ? 0 : 5; // Free delivery over $50
    const total = subtotal + tax + deliveryFee;
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Create order
    const order = await Order.create({
      user: decoded.userId,
      orderNumber,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      deliveryAddress: deliveryAddressId,
      notes,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });
    
    // Update product stock
    for (const cartItem of cart.items) {
      await Product.findByIdAndUpdate(
        cartItem.product._id,
        { $inc: { stock: -cartItem.quantity } }
      );
    }
    
    // Clear cart if useCart is true
    if (useCart) {
      await Cart.findByIdAndUpdate(cart._id, {
        items: [],
        total: 0,
        itemCount: 0
      });
    }
    
    // Populate order for response
    await order.populate([
      {
        path: 'items.product',
        select: 'name images price'
      },
      {
        path: 'deliveryAddress',
        select: 'name address city state pincode'
      }
    ]);
    
    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: order
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 