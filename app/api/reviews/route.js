import { NextResponse } from 'next/server';
import connectDB from '@/database/connection';
import { Review, Product, User } from '@/database/mongoose-schema';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const rating = searchParams.get('rating');
    
    // Build query
    const query = {};
    
    if (productId) {
      query.product = productId;
    }
    
    if (rating) {
      query.rating = parseInt(rating);
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Execute query with population
    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .populate('product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const total = await Review.countDocuments(query);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return NextResponse.json({
      success: true,
      data: reviews,
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
    console.error('Get reviews error:', error);
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

    const { productId, rating, comment, title } = await request.json();
    
    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Product ID and valid rating (1-5) are required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: decoded.userId,
      product: productId
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Create review
    const review = await Review.create({
      user: decoded.userId,
      product: productId,
      rating,
      comment: comment || '',
      title: title || '',
      isVerified: false
    });

    // Update product rating
    const productReviews = await Review.find({ product: productId });
    const avgRating = productReviews.reduce((sum, rev) => sum + rev.rating, 0) / productReviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      reviewCount: productReviews.length
    });

    // Populate review for response
    await review.populate([
      {
        path: 'user',
        select: 'name avatar'
      },
      {
        path: 'product',
        select: 'name images'
      }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
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

    const { reviewId, rating, comment, title } = await request.json();
    
    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    // Find and update review
    const review = await Review.findOneAndUpdate(
      { _id: reviewId, user: decoded.userId },
      { rating, comment, title },
      { new: true }
    ).populate([
      {
        path: 'user',
        select: 'name avatar'
      },
      {
        path: 'product',
        select: 'name images'
      }
    ]);

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update product rating
    const productReviews = await Review.find({ product: review.product._id });
    const avgRating = productReviews.reduce((sum, rev) => sum + rev.rating, 0) / productReviews.length;
    
    await Product.findByIdAndUpdate(review.product._id, {
      rating: avgRating,
      reviewCount: productReviews.length
    });

    return NextResponse.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
    
  } catch (error) {
    console.error('Update review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
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
    const reviewId = searchParams.get('id');
    
    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    // Find and delete review
    const review = await Review.findOneAndDelete({
      _id: reviewId,
      user: decoded.userId
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update product rating
    const productReviews = await Review.find({ product: review.product });
    const avgRating = productReviews.length > 0 
      ? productReviews.reduce((sum, rev) => sum + rev.rating, 0) / productReviews.length 
      : 0;
    
    await Product.findByIdAndUpdate(review.product, {
      rating: avgRating,
      reviewCount: productReviews.length
    });

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 