"use client";

import Link from 'next/link';
import { Star, MapPin, Clock } from 'lucide-react';
import { Store } from '@/types';

const featuredStores: Store[] = [
  {
    id: 'store1',
    name: 'Fresh Market',
    description: 'Your local source for fresh organic produce and groceries',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviewCount: 1250,
    category: 'Groceries',
    isVerified: true,
    isActive: true,
    sellerId: 'seller1',
    createdAt: '2024-01-01'
  },
  {
    id: 'store2',
    name: 'Tech Store',
    description: 'Latest electronics and gadgets at competitive prices',
    logo: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    reviewCount: 890,
    category: 'Electronics',
    isVerified: true,
    isActive: true,
    sellerId: 'seller2',
    createdAt: '2024-01-01'
  },
  {
    id: 'store3',
    name: 'Fashion Hub',
    description: 'Trendy fashion items for every style and occasion',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.4,
    reviewCount: 650,
    category: 'Fashion',
    isVerified: true,
    isActive: true,
    sellerId: 'seller3',
    createdAt: '2024-01-01'
  },
  {
    id: 'store4',
    name: 'Beauty Store',
    description: 'Premium beauty and skincare products',
    logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviewCount: 420,
    category: 'Beauty',
    isVerified: true,
    isActive: true,
    sellerId: 'seller4',
    createdAt: '2024-01-01'
  }
];

export default function FeaturedStores() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Stores
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Shop from our trusted local stores
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {featuredStores.map((store) => (
            <Link
              key={store.id}
              href={`/stores/${store.id}`}
              className="group block"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
                {/* Store Banner */}
                <div className="relative h-32">
                  <img
                    src={store.banner}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                  
                  {/* Store Logo */}
                  <div className="absolute -bottom-8 left-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Verified Badge */}
                  {store.isVerified && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                      Verified
                    </div>
                  )}
                </div>

                {/* Store Info */}
                <div className="p-4 pt-12">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors">
                    {store.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {store.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(store.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      ({store.reviewCount})
                    </span>
                  </div>

                  {/* Category */}
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                    {store.category}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/stores"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold text-lg transition-colors"
          >
            View All Stores
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
          </Link>
        </div>
      </div>
    </section>
  );
} 