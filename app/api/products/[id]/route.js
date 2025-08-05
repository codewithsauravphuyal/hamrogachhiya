import { NextResponse } from 'next/server';
import connectDB from '@/database/connection';
import { Product } from '@/database/mongoose-schema';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const product = await Product.findById(id)
      .populate('store', 'name slug logo banner description rating reviewCount contactEmail contactPhone')
      .populate('category', 'name slug description')
      .populate('subcategory', 'name slug description')
      .lean();
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    if (!product.isActive) {
      return NextResponse.json(
        { error: 'Product is not available' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('Product detail API error:', error);
    
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 