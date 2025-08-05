"use client";

import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component
import { Star, MapPin } from "lucide-react";
import { Store } from "@/types";

// TODO: Fetch from API or pass as props in production
const featuredStores: Store[] = [
  {
    id: "store1",
    name: "Fresh Market",
    description: "Your local source for fresh organic produce and groceries",
    logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    banner: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviewCount: 1250,
    category: "Groceries",
    isVerified: true,
    isActive: true,
    sellerId: "seller1",
    createdAt: "2024-01-01",
  },
  {
    id: "store2",
    name: "Tech Store",
    description: "Latest electronics and gadgets at competitive prices",
    logo: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    banner: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: 4.6,
    reviewCount: 890,
    category: "Electronics",
    isVerified: true,
    isActive: true,
    sellerId: "seller2",
    createdAt: "2024-01-01",
  },
  {
    id: "store3",
    name: "Fashion Hub",
    description: "Trendy fashion items for every style and occasion",
    logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: 4.4,
    reviewCount: 650,
    category: "Fashion",
    isVerified: false,
    isActive: true,
    sellerId: "seller3",
    createdAt: "2024-01-01",
  },
  {
    id: "store4",
    name: "Beauty Store",
    description: "Premium beauty and skincare products",
    logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    banner: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    reviewCount: 420,
    category: "Beauty",
    isVerified: true,
    isActive: true,
    sellerId: "seller4",
    createdAt: "2024-01-01",
  },
];

// StoreCard component for better readability and reusability
function StoreCard({ store }: { store: Store }) {
  return (
    <Link
      href={`/stores/${store.id}`}
      className="group block"
      aria-label={`Visit ${store.name} store page`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Store Banner */}
        <div className="relative h-32">
          <Image
            src={store.banner}
            alt={`${store.name} banner`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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
        </div>

        {/* Store Info */}
        <div className="p-4 pt-12">
          <div className="flex items-center gap-1 mb-2">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">
              {store.name}
            </h3>
            {store.isVerified && (
              <div className="text-blue-500 dark:text-blue-400" title="Verified Store">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {store.description}
          </p>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(store.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                    }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              ({store.reviewCount})
            </span>
          </div>

          {/* Category */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 text-orange-500" aria-hidden="true" />
            {store.category}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedStores() {
  return (
    <section
      className="py-16 bg-gray-50 dark:bg-gray-900"
      aria-labelledby="featured-stores-heading"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            id="featured-stores-heading"
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Featured Stores
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Shop from our trusted local stores
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {featuredStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/stores"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold text-lg transition-colors"
            aria-label="View all stores"
          >
            View All Stores
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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