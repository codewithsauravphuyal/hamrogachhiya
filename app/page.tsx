"use client";

import HeroBanner from '@/components/home/hero-banner';
import FeaturedProducts from '@/components/home/featured-products';
import FeaturedStores from '@/components/home/featured-stores';
import CategoryGrid from '@/components/home/category-grid';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <FeaturedStores />
    </div>
  );
} 