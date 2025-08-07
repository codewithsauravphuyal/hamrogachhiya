"use client";

import { useState } from 'react';
import { Heart, ShoppingCart, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    description: string;
  };
  addedAt: string;
}

export default function WishlistPage() {
  const { isAuthenticated } = useAuthStore();
  const { items: wishlistItems, removeFromWishlist, itemCount } = useWishlistStore();
  const { addItem } = useCartStore();
  
  // Mock wishlist data - in real app this would come from API
  // const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
  //   {
  //     id: '1',
  //     product: {
  //       id: 'prod-1',
  //       name: 'Wireless Bluetooth Headphones',
  //       price: 2999,
  //       images: ['/api/placeholder/300/300'],
  //       description: 'High-quality wireless headphones with noise cancellation'
  //     },
  //     addedAt: '2024-01-15T10:30:00Z'
  //   },
  //   {
  //     id: '2',
  //     product: {
  //       id: 'prod-2',
  //       name: 'Smart Fitness Watch',
  //       price: 4999,
  //       images: ['/api/placeholder/300/300'],
  //       description: 'Track your fitness goals with this advanced smartwatch'
  //     },
  //     addedAt: '2024-01-14T15:45:00Z'
  //   },
  //   {
  //     id: '3',
  //     product: {
  //       id: 'prod-3',
  //       name: 'Portable Power Bank',
  //       price: 1499,
  //       images: ['/api/placeholder/300/300'],
  //       description: '10000mAh portable charger for your devices'
  //     },
  //     addedAt: '2024-01-13T09:20:00Z'
  //   }
  // ]);

  const handleAddToCart = (item: WishlistItem) => {
    // Map WishlistItem to Product type for addItem (if needed)
    const product = {
      id: item.id,
      name: item.product.name,
      description: item.product.description,
      price: item.product.price,
      originalPrice: item.product.price,
      images: item.product.images,
      category: '',
      subcategory: '',
      brand: '',
      tags: [],
      variants: [],
      stock: 1,
      storeId: '',
      storeName: '',
      rating: 0,
      reviewCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    addItem(product, 1, undefined);
    toast.success(`${item.product.name} added to cart!`);
  };

  const handleRemoveFromWishlist = (itemId: string) => {
    removeFromWishlist(itemId);
    toast.success('Item removed from wishlist');
  };

  const handleViewProduct = (productId: string) => {
    window.location.href = `/products/${productId}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              My Wishlist
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Please login to view your wishlist.
            </p>
            <Link href="/login">
              <Button variant="brand">Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Wishlist <span className="text-orange-600">({itemCount})</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Save items you love for later
            </p>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-28 h-28 bg-gradient-to-tr from-orange-200 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Heart className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                Start adding items to your wishlist to save them for later.
              </p>
              <Link href="/products">
                <Button variant="brand" className="px-8 py-3 text-lg bg-orange-600 hover:bg-orange-700">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden p-0 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-0">
                  <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 group">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/90 hover:bg-white shadow-md"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 text-lg">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-orange-600">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600"
                        onClick={() => handleViewProduct(item.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="brand"
                        size="sm"
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={() => handleAddToCart(item as unknown as WishlistItem)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Actions */}
          {wishlistItems.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    wishlistItems.forEach(item => handleAddToCart(item as unknown as WishlistItem));
                    toast.success('All items added to cart!');
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add All to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // setWishlistItems([]); // This line is removed as per the new_code
                    toast.success('Wishlist cleared');
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Wishlist
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 