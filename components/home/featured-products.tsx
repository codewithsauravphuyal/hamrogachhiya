"use client";

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/ui/product-card';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?featured=true&limit=8');
      const data = await response.json();
      
      if (response.ok) {
        // Transform API data to match Product interface
        const transformedProducts = data.data.map((product: any) => ({
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          images: product.images,
          category: product.category?.name || 'Uncategorized',
          subcategory: product.subcategory?.name,
          brand: product.brand,
          tags: product.tags || [],
          variants: product.variants || [],
          stock: product.stock,
          storeId: product.store._id,
          storeName: product.store.name,
          rating: product.rating,
          reviewCount: product.reviewCount,
          isActive: product.isActive,
          createdAt: product.createdAt
        }));
        
        setProducts(transformedProducts);
      } else {
        setError('Failed to load featured products');
      }
    } catch (err) {
      setError('Failed to load featured products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-8 sm:py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              Featured Products
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Loading featured products...
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 sm:py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              Featured Products
            </h2>
            <p className="text-red-600 text-base sm:text-lg">Error: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
            Featured Products
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our most popular products
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No featured products available at the moment.
            </p>
          </div>
        )}

        <div className="text-center mt-8 sm:mt-10">
          <a
            href="/products"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold text-base sm:text-lg transition-colors"
          >
            View All Products
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
} 