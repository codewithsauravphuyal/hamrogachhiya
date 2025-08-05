"use client";

import { useState } from 'react';
import { Heart, ShoppingCart, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
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
  const { addItem } = useCartStore();
  
  // Mock wishlist data - in real app this would come from API
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: '1',
      product: {
        id: 'prod-1',
        name: 'Wireless Bluetooth Headphones',
        price: 2999,
        images: ['/api/placeholder/300/300'],
        description: 'High-quality wireless headphones with noise cancellation'
      },
      addedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      product: {
        id: 'prod-2',
        name: 'Smart Fitness Watch',
        price: 4999,
        images: ['/api/placeholder/300/300'],
        description: 'Track your fitness goals with this advanced smartwatch'
      },
      addedAt: '2024-01-14T15:45:00Z'
    },
    {
      id: '3',
      product: {
        id: 'prod-3',
        name: 'Portable Power Bank',
        price: 1499,
        images: ['/api/placeholder/300/300'],
        description: '10000mAh portable charger for your devices'
      },
      addedAt: '2024-01-13T09:20:00Z'
    }
  ]);

  const handleAddToCart = (item: WishlistItem) => {
    addItem({
      id: item.product.id,
      product: item.product,
      quantity: 1,
      selectedVariant: null
    });
    toast.success(`${item.product.name} added to cart!`);
  };

  const handleRemoveFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    toast.success('Item removed from wishlist');
  };

  const handleViewProduct = (productId: string) => {
    // Navigate to product detail page
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
              My Wishlist
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Save items you love for later
            </p>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Start adding items to your wishlist to save them for later.
              </p>
              <Link href="/products">
                <Button variant="brand">Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/90 hover:bg-white"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {item.product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ₹{item.product.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleViewProduct(item.product.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="brand"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAddToCart(item)}
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
                    wishlistItems.forEach(item => handleAddToCart(item));
                    toast.success('All items added to cart!');
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add All to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setWishlistItems([]);
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