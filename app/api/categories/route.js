import { NextResponse } from 'next/server';
import connectDB from '@/database/connection';
import { Category } from '@/database/mongoose-schema';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const parent = searchParams.get('parent');
    const active = searchParams.get('active');
    
    // Build query
    const query = {};
    
    if (level !== null) {
      query.level = parseInt(level);
    }
    
    if (parent !== null) {
      if (parent === 'null' || parent === '') {
        query.parent = null;
      } else {
        query.parent = parent;
      }
    }
    
    if (active === 'true') {
      query.isActive = true;
    }
    
    const categories = await Category.find(query)
      .populate('parent', 'name slug')
      .sort({ sortOrder: 1, name: 1 })
      .lean();
    
    // Group categories by level for hierarchical structure
    const categoriesByLevel = {};
    categories.forEach(category => {
      if (!categoriesByLevel[category.level]) {
        categoriesByLevel[category.level] = [];
      }
      categoriesByLevel[category.level].push(category);
    });
    
    return NextResponse.json({
      success: true,
      data: categories,
      categoriesByLevel
    });
    
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 